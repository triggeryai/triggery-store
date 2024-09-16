// next-amazona-v2/app/api/admin/discounts/[id]/route.ts
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import DiscountModel from '@/lib/models/DiscountModel';

// Obsługa PATCH dla aktualizacji rabatu
export async function PATCH(req, { params }) {
  const { id } = params;
  console.log(`Próbuję zaktualizować rabat o ID: ${id}`);
  
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
    console.log(`Zaktualizowano rabat o ID: ${id}`);
    return NextResponse.json(discount, { status: 200 });
  } catch (error) {
    console.error('Error during PATCH request:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// Obsługa DELETE dla usuwania rabatu
export async function DELETE(req, { params }) {
  const { id } = params;

  await dbConnect();

  try {
    const discount = await DiscountModel.findByIdAndDelete(id);
    if (!discount) {
      return NextResponse.json({ error: 'Discount not found' }, { status: 404 });
    }
    console.log(`Usunięto rabat o ID: ${id}`);
    return NextResponse.json(null, { status: 204 });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
