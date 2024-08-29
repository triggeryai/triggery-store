// app/api/guest-checkout/route.ts
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import GuestCheckout from '@/lib/models/GuestCheckout';

export async function GET() {
  await dbConnect();

  try {
    // Pobierz status Guest Checkout z kolekcji GuestCheckout
    const guestCheckout = await GuestCheckout.findOne();

    if (!guestCheckout) {
      return NextResponse.json(
        { success: false, error: 'Guest checkout setting not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        isGuestCheckoutEnabled: guestCheckout.isGuestCheckoutEnabled,
      },
    });
  } catch (error) {
    console.error('Error fetching guest checkout status:', error);
    return NextResponse.json(
      { success: false, error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
