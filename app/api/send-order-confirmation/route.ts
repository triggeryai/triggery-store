// app/api/send-order-confirmation/route.ts
import { NextResponse } from 'next/server';
import { sendOrderConfirmationEmail } from '@/lib/mail';
import OrderModel from '@/lib/models/OrderModel';

export const POST = async (req: Request) => {
  try {
    const { orderId } = await req.json();

    if (!orderId) {
      return NextResponse.json({ message: 'Brakuje wymaganych danych' }, { status: 400 });
    }

    // Znajdź zamówienie na podstawie orderId
    const order = await OrderModel.findById(orderId);

    if (!order) {
      return NextResponse.json({ message: 'Zamówienie nie znalezione' }, { status: 404 });
    }

    // Sprawdź, czy użytkownik jest zalogowany (czy zamówienie ma pole `user`)
    const email = order.email || order.user?.email;

    if (!email) {
      return NextResponse.json({ message: 'Brakuje adresu e-mail' }, { status: 400 });
    }

    // Wywołanie funkcji wysyłającej email
    await sendOrderConfirmationEmail(email, orderId);

    return NextResponse.json({ message: 'Email został wysłany' }, { status: 200 });
  } catch (error) {
    console.error('Błąd wysyłania e-maila:', error);
    return NextResponse.json({ message: 'Wystąpił błąd podczas wysyłania e-maila' }, { status: 500 });
  }
};
