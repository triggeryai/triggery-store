import Stripe from 'stripe';
import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import OrderModel from '@/lib/models/OrderModel';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: '2020-08-27',
});

const webhookSecret: string = process.env.STRIPE_WEBHOOK_SECRET as string;

export const dynamic = 'force-dynamic';

export const POST = async (req: NextRequest) => {
  console.log('Stripe Webhook Secret:', webhookSecret);

  await dbConnect();

  let event: Stripe.Event;

  try {
    const buf = await req.arrayBuffer();
    const sig = req.headers.get('stripe-signature');

    event = stripe.webhooks.constructEvent(new TextDecoder().decode(buf), sig as string, webhookSecret);
    console.log(`Webhook received: ${event.type}`);
  } catch (err) {
    console.error(`⚠️  Webhook signature verification failed.`, err.message);
    return new NextResponse(`Webhook Error: ${err.message}`, { status: 400 });
  }

  // Handle the event
  try {
    switch (event.type) {
      case 'payment_intent.succeeded':
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        console.log(`Payment Intent ID: ${paymentIntent.id}`);
        // Find the order and update it
        const order = await OrderModel.findOne({ 'paymentResult.id': paymentIntent.id });
        console.log(`Order: ${order}`);
        if (order) {
          order.isPaid = true;
          order.paidAt = new Date();
          order.paymentResult.status = paymentIntent.status;
          await order.save();
          console.log(`Order ${order._id} updated to paid.`);
        } else {
          console.log(`Order not found for PaymentIntent ${paymentIntent.id}`);
        }
        break;
      // ... handle other event types
      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    return new NextResponse('Received', { status: 200 });
  } catch (err) {
    console.error(`Webhook handler failed: ${err.message}`);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
};

export default POST;
