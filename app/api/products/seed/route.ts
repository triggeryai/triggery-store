// app/api/products/seed/route.ts
import dbConnect from '@/lib/dbConnect'
import ProductModel from '@/lib/models/ProductModel'
import UserModel from '@/lib/models/UserModel'
import { NextRequest, NextResponse } from 'next/server'

export const GET = async (request: NextRequest) => {
  await dbConnect()

  // Pobierz dane użytkowników z bazy danych
  const users = await UserModel.find({}).exec();
  const products = await ProductModel.find({}).exec();

  return NextResponse.json({
    message: 'Fetched data successfully',
    users,
    products,
  })
}
