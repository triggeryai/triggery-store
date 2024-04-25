// lib/stripe.ts

import Stripe from 'stripe';

// Utwórz instancję Stripe z kluczem sekretnym z twojego pliku .env
// Pamiętaj, aby zmienić 'SECRET_KEY' na 'STRIPE_SECRET_KEY', aby było to bardziej zgodne z twoją konfiguracją
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2023-10-16',
});

// Funkcja do tworzenia sesji płatności Stripe
export const createStripeCheckoutSession = async (
  lineItems: Stripe.Checkout.SessionCreateParams.LineItem[],
  orderId: string // Dodano orderId do przekazywania jako metadane
) => {
  try {
    // Utwórz sesję checkout
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'], // Definiuje akceptowane metody płatności
      line_items: lineItems,          // Przedmioty do zapłaty
      mode: 'payment',                // Tryb sesji płatności
      success_url: `${process.env.NEXT_PUBLIC_DOMAIN}/order/${orderId}/success`, // URL przekierowania po udanej płatności
      cancel_url: `${process.env.NEXT_PUBLIC_DOMAIN}/order/${orderId}/cancel`,   // URL przekierowania po anulowaniu płatności
      metadata: { orderId },         // Metadane do identyfikacji zamówienia po stronie Stripe
    });
    return session;
  } catch (error) {
    console.error('Error creating Stripe session:', error);
    throw error;
  }
};
