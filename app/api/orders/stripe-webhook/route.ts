import { NextApiRequest, NextApiResponse } from 'next';
import Stripe from 'stripe';
import dbConnect from '@/lib/dbConnect';
import OrderModel from '@/lib/models/OrderModel';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2020-08-27',
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || '';

export const config = {
  api: {
    bodyParser: false,
  },
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const buf = await buffer(req);
  const sig = req.headers['stripe-signature'] || '';

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(buf, sig, webhookSecret);
  } catch (err) {
    console.log(`⚠️  Webhook signature verification failed.`, err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
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

  res.status(200).json({ received: true });
};

const buffer = async (readable: any) => {
  const chunks = [];
  for await (const chunk of readable) {
    chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk);
  }
  return Buffer.concat(chunks);
};

export default handler;
