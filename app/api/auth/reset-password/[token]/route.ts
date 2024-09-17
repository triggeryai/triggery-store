// app/api/auth/reset-password/[token]/route.ts

import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import UserModel from '@/lib/models/UserModel';
import { sendNewPasswordEmail } from '@/lib/mail';

export const GET = async (
  request: NextRequest,
  { params }: { params: { token: string } }
) => {
  await dbConnect();
  const { token } = params;

  // Znajdź użytkownika na podstawie tokena i sprawdź, czy token nie wygasł
  const user = await UserModel.findOne({
    emailResetPassword: token,
    passwordResetTokenExpires: { $gt: Date.now() },
  });

  if (!user) {
    // Token jest nieprawidłowy lub wygasł
    return new NextResponse('Token jest nieprawidłowy lub wygasł', { status: 400 });
  }

  // Generuj nowe hasło
  const newPassword = Math.random().toString(36).slice(-8);

  // Zaktualizuj hasło użytkownika (middleware zahashuje hasło przed zapisaniem)
  user.password = newPassword;

  // Unieważnij token resetu hasła
  user.emailResetPassword = null;
  user.passwordResetTokenExpires = null;

  await user.save();

  // Wyślij nowe hasło do użytkownika emailem
  await sendNewPasswordEmail(user.email, newPassword);

  // Przekieruj użytkownika na stronę potwierdzenia
  const redirectUrl = new URL('/reset-password/success', process.env.NEXT_PUBLIC_DOMAIN);
  return NextResponse.redirect(redirectUrl.toString());
};
