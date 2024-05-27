// app/api/admin/shipping/route.ts
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import ShippingOption from '@/lib/models/ShippingPriceModel';

const defaultShippingOptions = [
  { value: "Inpost Paczkomat", label: "Inpost Paczkomat - $5", price: 5, isActive: true },
  { value: "Pocztex Poczta Polska Kurier", label: "Pocztex Poczta Kurier - $7", price: 7, isActive: true },
  { value: "Pocztex Poczta Odbior Punkt", label: "Pocztex Poczta Odbior Punkt - $7", price: 7, isActive: true },
  { value: "Inpost Kurier", label: "Inpost Kurier - $10", price: 10, isActive: true },
  { value: "DPD Kurier", label: "DPD Kurier - $12", price: 12, isActive: true },
  { value: "DHL Kurier", label: "DHL Kurier - $15", price: 15, isActive: true },
  { value: "Odbior osobisty", label: "Odbior osobisty - $0", price: 0, isActive: true },
];

export async function GET() {
  await dbConnect();

  try {
    let shippingOptions = await ShippingOption.find({});
    if (shippingOptions.length === 0) {
      // Insert default options if none exist
      shippingOptions = await ShippingOption.insertMany(defaultShippingOptions);
    }
    return NextResponse.json(shippingOptions);
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(req) {
  await dbConnect();

  try {
    const { value, label, price, isActive } = await req.json();
    const newOption = new ShippingOption({ value, label, price, isActive });
    await newOption.save();
    return NextResponse.json(newOption, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(req) {
  await dbConnect();

  try {
    const { id } = await req.json();
    await ShippingOption.findByIdAndDelete(id);
    return NextResponse.json(null, { status: 204 });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
