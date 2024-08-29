// next-amazona-v2/app/api/shipping/route.ts
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import ShippingOption from '@/lib/models/ShippingPriceModel';

const defaultShippingOptions = [
  { value: "Inpost Paczkomat", label: "Inpost Paczkomat - $5", price: 5 },
  { value: "Pocztex Poczta Polska Kurier", label: "Pocztex Poczta Kurier - $7", price: 7 },
  { value: "Pocztex Poczta Odbior Punkt", label: "Pocztex Poczta Odbior Punkt - $7", price: 7 },
  { value: "Inpost Kurier", label: "Inpost Kurier - $10", price: 10 },
  { value: "DPD Kurier", label: "DPD Kurier - $12", price: 12 },
  { value: "DHL Kurier", label: "DHL Kurier - $15", price: 15 },
  { value: "Odbior osobisty", label: "Odbior osobisty - $0", price: 0 },
];

export async function GET() {
  await dbConnect();

  try {
    let shippingOptions = await ShippingOption.find({});
    if (shippingOptions.length === 0) {
      // Wstawienie domyślnych opcji, jeśli nie istnieją
      shippingOptions = await ShippingOption.insertMany(defaultShippingOptions);
    }
    console.log('Shipping Options:', shippingOptions); // Dodano log do debugowania
    return NextResponse.json(shippingOptions);
  } catch (error) {
    console.error('Error fetching shipping options:', error); // Dodano log błędu
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(req) {
  await dbConnect();

  try {
    const { value, label, price } = await req.json();
    const newOption = new ShippingOption({ value, label, price });
    await newOption.save();
    console.log('New Shipping Option Added:', newOption); // Dodano log do debugowania
    return NextResponse.json(newOption, { status: 201 });
  } catch (error) {
    console.error('Error adding new shipping option:', error); // Dodano log błędu
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(req) {
  await dbConnect();

  try {
    const { id } = await req.json();
    await ShippingOption.findByIdAndDelete(id);
    console.log('Deleted Shipping Option with ID:', id); // Dodano log do debugowania
    return NextResponse.json(null, { status: 204 });
  } catch (error) {
    console.error('Error deleting shipping option:', error); // Dodano log błędu
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
