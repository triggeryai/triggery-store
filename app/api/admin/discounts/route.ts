// next-amazona-v2/app/api/admin/discounts/route.ts
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import DiscountModel from '@/lib/models/DiscountModel';

export async function GET() {
  await dbConnect();
  
  try {
    const discounts = await DiscountModel.find({});
    return NextResponse.json(discounts);
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(req) {
  await dbConnect();

  try {
    const { type, value, isActive, users, expirationDate, code } = await req.json();
    
    const newDiscount = new DiscountModel({
      type,
      value,
      isActive,
      users: users === 'all' ? 'all' : users, // Jeśli "all", dotyczy wszystkich
      expirationDate,
      code, // Dodano pole dla kodu rabatowego
    });
    
    await newDiscount.save();
    return NextResponse.json(newDiscount, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PATCH(req, { params }) {
  const { id } = params;
  console.log(`Próbuję zaktualizować rabat z ID: ${id}`); // Informacja o ID rabatu przed rozpoczęciem aktualizacji
  const { type, value, isActive, users, expirationDate, code } = await req.json();

  await dbConnect();

  try {
    const discount = await DiscountModel.findById(id);
    if (!discount) {
      console.log(`Nie znaleziono rabatu z ID: ${id}`);
      return NextResponse.json({ error: 'Discount not found' }, { status: 404 });
    }

    discount.type = type;
    discount.value = value;
    discount.isActive = isActive;
    discount.users = users === 'all' ? 'all' : users;
    discount.expirationDate = expirationDate;
    discount.code = code;

    await discount.save();
    console.log(`Zaktualizowano rabat z ID: ${id}`); // Logowanie po zapisaniu
    return NextResponse.json(discount, { status: 200 });
  } catch (error) {
    console.error('Error during PATCH request:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}




export async function DELETE(req) {
  await dbConnect();

  try {
    const { id } = await req.json();
    await DiscountModel.findByIdAndDelete(id);
    return NextResponse.json(null, { status: 204 });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
