// app\api\orders\[id]\create-stripe-session\route.ts
import Stripe from 'stripe';
import { auth } from '@/lib/auth';
import dbConnect from '@/lib/dbConnect';
import OrderModel from '@/lib/models/OrderModel';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2020-08-27',
});

export const POST = auth(async (...request: any) => {
  const [req, { params }] = request;

  console.log('Request params:', params); // Print params to see the received id

  if (!params || !params.id) {
    console.error('The order ID is missing in the request params.');
    return Response.json({ message: 'Order ID not provided.' }, { status: 400 });
  }

  const orderId = params.id;

  // User authentication
  if (!req.auth) {
    console.error('Authorization failed. User is not authenticated.');
    return Response.json({ message: 'Unauthorized' }, { status: 401 });
  }

  // Database connection
  await dbConnect();

  // Retrieve the order from the database
  const order = await OrderModel.findById(orderId);
  if (!order) {
    console.error(`Order not found with ID: ${orderId}`);
    return Response.json({ message: 'Order not found' }, { status: 404 });
  }

  try {
    // Prepare line items for each product in the order
    const lineItems = order.items.map(item => ({
      price_data: {
        currency: 'usd',
        product_data: {
          name: item.name,
          // Replace the placeholder URL with the actual image URL if necessary
          images: [],        },
        unit_amount: Math.round(item.price * 100), // Convert the price to cents
      },
      quantity: item.qty,
    }));

    // Add a line item for the tax if applicable
    if (order.taxPrice > 0) {
      lineItems.push({
        price_data: {
          currency: 'usd',
          product_data: {
            name: 'Tax',
            images: [], // Optionally, you can put an image URL for tax representation
          },
          unit_amount: Math.round(order.taxPrice * 100), // Convert the tax to cents
        },
        quantity: 1,
      });
    }

    // Add a line item for shipping if applicable
    if (order.shippingPrice > 0) {
      lineItems.push({
        price_data: {
          currency: 'usd',
          product_data: {
            name: 'Shipping',
            images: [], // Optionally, you can put an image URL for shipping representation
          },
          unit_amount: Math.round(order.shippingPrice * 100), // Convert the shipping to cents
        },
        quantity: 1,
      });
    }

    // Create a Stripe checkout session with line items
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_DOMAIN}/order/${orderId}/success`,
      cancel_url: `${process.env.NEXT_PUBLIC_DOMAIN}/order/${orderId}/cancel`,
      metadata: {
        orderId: order._id.toString(),
      },
    });

    console.log('Stripe session created with URL:', session.url);
    return Response.json({ url: session.url });
  } catch (error) {
    console.error('Error creating Stripe checkout session:', error);
    return Response.json({
      message: 'Error creating Stripe checkout session',
      details: error.message,
    }, { status: 500 });
  }
});
