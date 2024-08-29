// next-amazona-v2/app/api/orders/stripe-webhook/route.ts
import { NextApiRequest, NextApiResponse } from 'next';
import Stripe from 'stripe';
import dbConnect from '@/lib/dbConnect';
import OrderModel from '@/lib/models/OrderModel';
import { NextRequest, NextResponse } from 'next/server';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2020-08-27',
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || '';

export const dynamic = 'force-dynamic';

const handler = async (req: NextRequest) => {
  const buf = await buffer(req);
  const sig = req.headers.get('stripe-signature') || '';

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(buf, sig, webhookSecret);
  } catch (err) {
    console.log(`⚠️  Webhook signature verification failed.`, err.message);
    return NextResponse.json({ message: `Webhook Error: ${err.message}` }, { status: 400 });
  }

  // Handle the checkout.session.completed event
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    
    // Database connection
    await dbConnect();
    
    // Retrieve the order ID from the session metadata
    const orderId = session.metadata?.orderId;
    const order = await OrderModel.findById(orderId);
    
    if (order) {
      order.isPaid = true;
      order.paidAt = new Date();
      await order.save();
      console.log(`Order ${orderId} marked as paid.`);
    }
  }

  return NextResponse.json({ received: true });
};

const buffer = async (readable: any) => {
  const chunks = [];
  for await (const chunk of readable) {
    chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk);
  }
  return Buffer.concat(chunks);
};

export { handler as POST };
