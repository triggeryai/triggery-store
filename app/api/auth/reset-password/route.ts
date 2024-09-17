// app/api/auth/reset-password/route.ts

import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import UserModel from '@/lib/models/UserModel';
import { sendPasswordResetEmail } from '@/lib/mail';
import { v4 as uuidv4 } from 'uuid';

export const POST = async (request: NextRequest) => {
  await dbConnect();

  const { email } = await request.json();

  const user = await UserModel.findOne({ email });
  if (user) {
    // Generuj unikalny token resetu hasła
    const passwordResetToken = uuidv4();

    // Zapisz token w dokumencie użytkownika
    user.emailResetPassword = passwordResetToken;
    // Ustaw czas wygaśnięcia tokena
    user.passwordResetTokenExpires = Date.now() + 3600000; // 1 godzina

    await user.save();

    // Wyślij email z linkiem resetu hasła
    await sendPasswordResetEmail(email, passwordResetToken);

    return new NextResponse(
      JSON.stringify({ message: 'Link do resetowania hasła został wysłany na Twój email.' }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } else {
    // Nie ujawniamy, czy email istnieje w systemie
    return new NextResponse(
      JSON.stringify({
        message:
          'Jeśli email jest powiązany z kontem, link do resetowania hasła zostanie wysłany.',
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
};
