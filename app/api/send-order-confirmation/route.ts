// app/api/send-order-confirmation/route.ts
import { NextResponse } from 'next/server';
import { sendOrderConfirmationEmail } from '@/lib/mail';

export const POST = async (req: Request) => {
  try {
    const { email, orderId } = await req.json();

    if (!email || !orderId) {
      return NextResponse.json({ message: 'Brakuje wymaganych danych' }, { status: 400 });
    }

    // Wywołanie funkcji wysyłającej email
    await sendOrderConfirmationEmail(email, orderId);

    return NextResponse.json({ message: 'Email został wysłany' }, { status: 200 });
  } catch (error) {
    console.error('Błąd wysyłania e-maila:', error);
    return NextResponse.json({ message: 'Wystąpił błąd podczas wysyłania e-maila' }, { status: 500 });
  }
};
