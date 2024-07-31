// next-amazona-v2/app/api/orders/[id]/create-stripe-session/route.ts
import Stripe from 'stripe';
import { auth } from '@/lib/auth';
import dbConnect from '@/lib/dbConnect';
import OrderModel from '@/lib/models/OrderModel';
import ShippingOption from '@/lib/models/ShippingPriceModel'; // Import your ShippingOption model

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

  // Retrieve the shipping options to get the correct price
  const shippingOptions = await ShippingOption.find({});
  const selectedShippingOption = shippingOptions.find(option => option.value === order.shippingAddress.shippingMethod);

  if (!selectedShippingOption) {
    console.error(`Shipping option not found for method: ${order.shippingAddress.shippingMethod}`);
    return Response.json({ message: 'Shipping option not found' }, { status: 404 });
  }

  try {
    // Prepare line items for each product in the order
    const lineItems = order.items.map(item => ({
      price_data: {
        currency: 'pln',
        product_data: {
          name: item.name,
          // Replace the placeholder URL with the actual image URL if necessary
          images: [],        
        },
        unit_amount: Math.round(item.price * 100), // Convert the price to cents
      },
      quantity: item.qty,
    }));

    // Add a line item for shipping if applicable
    if (selectedShippingOption.price > 0) {
      lineItems.push({
        price_data: {
          currency: 'pln',
          product_data: {
            name: 'Shipping',
            images: [], // Optionally, you can put an image URL for shipping representation
          },
          unit_amount: Math.round(selectedShippingOption.price * 100), // Convert the shipping to cents
        },
        quantity: 1,
      });
    }

    // Create a Stripe checkout session with line items
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card', 'p24', 'blik'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_DOMAIN}/order/${orderId}/success`,
      cancel_url: `${process.env.NEXT_PUBLIC_DOMAIN}/order/${orderId}/cancel`,
      metadata: {
        orderId: order._id.toString(),
      },
    });

    order.paymentResult = {
      id: session.payment_intent as string, // Ensure the payment intent ID is stored
      status: 'pending',
      email_address: order.shippingAddress.email, // or however you get the email address
    };

    await order.save();

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
