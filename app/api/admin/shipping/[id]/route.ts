// app/api/admin/shipping/[id]/route.ts
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import ShippingOption from '@/lib/models/ShippingPriceModel';

export async function PATCH(req, { params }) {
  const { id } = params;
  const { value, label, price, isActive } = await req.json();

  await dbConnect();

  try {
    const option = await ShippingOption.findById(id);
    if (!option) {
      return NextResponse.json({ error: 'Shipping option not found' }, { status: 404 });
    }
    option.value = value;
    option.label = label;
    option.price = price;
    option.isActive = isActive;
    await option.save();
    return NextResponse.json(option, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
