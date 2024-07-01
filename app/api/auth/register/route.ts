// app/api/auth/register/route.ts
import { NextRequest } from 'next/server'
import bcrypt from 'bcryptjs'
import dbConnect from '@/lib/dbConnect'
import UserModel from '@/lib/models/UserModel'
import { sendVerificationEmail } from '@/lib/mail'
import { v4 as uuidv4 } from 'uuid' // Dodaj 'uuid' do zależności projektu

export const POST = async (request: NextRequest) => {
  const { name, email, password } = await request.json();
  await dbConnect();

  // Sprawdzenie, czy użytkownik o podanym emailu już istnieje
  const existingUser = await UserModel.findOne({ email });
  if (existingUser) {
    return new Response(JSON.stringify({ message: 'Użytkownik o podanym emailu już istnieje' }), {
      status: 409, // Conflict
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const hashedPassword = await bcrypt.hash(password, 5);
  const emailToken = uuidv4(); // Generowanie unikalnego tokena
  const newUser = new UserModel({
    name,
    email,
    password: hashedPassword,
    emailToken, // Przypisanie tokena
  });
  try {
    await newUser.save();
    await sendVerificationEmail(email, emailToken); // Wysyłanie e-maila weryfikacyjnego
    return new Response(JSON.stringify({ message: 'Użytkownik został utworzony i wysłano email weryfikacyjny.' }), {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ message: err.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
