import Stripe from 'stripe';
import { auth } from '@/lib/auth';
import dbConnect from '@/lib/dbConnect';
import OrderModel from '@/lib/models/OrderModel';
import ShippingOption from '@/lib/models/ShippingPriceModel'; // Importuj model ShippingOption
import { getGuestCheckoutStatus } from '@/lib/utils'; // Importuj funkcję do sprawdzania statusu Guest Checkout

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2020-08-27',
});

export const POST = auth(async (...request: any) => {
  const [req, { params }] = request;

  console.log('Request params:', params); // Loguj parametry zapytania, aby zobaczyć otrzymane ID zamówienia

  if (!params || !params.id) {
    console.error('The order ID is missing in the request params.');
    return Response.json({ message: 'Order ID not provided.' }, { status: 400 });
  }

  const orderId = params.id;

  // Sprawdzenie autoryzacji użytkownika oraz statusu Guest Checkout
  const isGuestCheckoutEnabled = await getGuestCheckoutStatus();
  if (!req.auth && !isGuestCheckoutEnabled) {
    console.error('Authorization failed. User is not authenticated and Guest Checkout is not enabled.');
    return Response.json({ message: 'Unauthorized' }, { status: 401 });
  }

  // Połączenie z bazą danych
  await dbConnect();

  // Pobranie zamówienia z bazy danych
  const order = await OrderModel.findById(orderId);
  if (!order) {
    console.error(`Order not found with ID: ${orderId}`);
    return Response.json({ message: 'Order not found' }, { status: 404 });
  }

  // Pobranie opcji wysyłki, aby uzyskać właściwą cenę
  const shippingOptions = await ShippingOption.find({});
  const selectedShippingOption = shippingOptions.find(option => option.value === order.shippingAddress.shippingMethod);

  if (!selectedShippingOption) {
    console.error(`Shipping option not found for method: ${order.shippingAddress.shippingMethod}`);
    return Response.json({ message: 'Shipping option not found' }, { status: 404 });
  }

  try {
    // Przygotowanie elementów linii dla każdego produktu w zamówieniu
    const lineItems = order.items.map(item => ({
      price_data: {
        currency: 'pln',
        product_data: {
          name: item.name,
          // W razie potrzeby zamień placeholder URL na rzeczywisty URL obrazu
          images: [],        
        },
        unit_amount: Math.round(item.price * 100), // Przeliczenie ceny na grosze
      },
      quantity: item.qty,
    }));

    // Dodanie elementu linii dla wysyłki, jeśli ma zastosowanie
    if (selectedShippingOption.price > 0) {
      lineItems.push({
        price_data: {
          currency: 'pln',
          product_data: {
            name: 'Shipping',
            images: [], // Opcjonalnie można dodać URL obrazu reprezentującego wysyłkę
          },
          unit_amount: Math.round(selectedShippingOption.price * 100), // Przeliczenie ceny wysyłki na grosze
        },
        quantity: 1,
      });
    }

    // Utworzenie sesji Stripe checkout z elementami linii
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
      id: session.payment_intent as string, // Upewnij się, że ID payment intent jest zapisane
      status: 'pending',
      email_address: order.shippingAddress.email, // lub w inny sposób uzyskaj adres e-mail
    };

    await order.save();

    console.log('Stripe session created with URL:', session.url); // Loguj sukces utworzenia sesji
    return Response.json({ url: session.url });
  } catch (error) {
    console.error('Error creating Stripe checkout session:', error); // Loguj błąd utworzenia sesji
    return Response.json({
      message: 'Error creating Stripe checkout session',
      details: error.message,
    }, { status: 500 });
  }
});
