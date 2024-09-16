// next-amazona-v2/app/api/admin/shipping/route.ts
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import ShippingOption from '@/lib/models/ShippingPriceModel';

const defaultShippingOptions = [
  { value: "Inpost Paczkomat", label: "Inpost Paczkomat - $5", price: 5, width: 20, height: 15, depth: 5, weight: 2, isActive: true },
  { value: "Pocztex Poczta Polska Kurier", label: "Pocztex Poczta Kurier - $7", price: 7, width: 30, height: 20, depth: 10, weight: 3, isActive: true },
  { value: "Pocztex Poczta Odbior Punkt", label: "Pocztex Poczta Odbior Punkt - $7", price: 7, width: 25, height: 15, depth: 10, weight: 2.5, isActive: true },
  { value: "Inpost Kurier", label: "Inpost Kurier - $10", price: 10, width: 40, height: 30, depth: 20, weight: 4, isActive: true },
  { value: "DPD Kurier", label: "DPD Kurier - $12", price: 12, width: 50, height: 40, depth: 30, weight: 5, isActive: true },
  { value: "DHL Kurier", label: "DHL Kurier - $15", price: 15, width: 60, height: 50, depth: 40, weight: 6, isActive: true },
  { value: "Odbior osobisty", label: "Odbior osobisty - $0", price: 0, width: 0, height: 0, depth: 0, weight: 0, isActive: true },
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
    // Dodano pola dla wymiarów paczki oraz wagi
    const { value, label, price, width, height, depth, weight, isActive } = await req.json();

    const newOption = new ShippingOption({
      value,
      label,
      price,
      width,
      height,
      depth,
      weight, // Zapisujemy wagę
      isActive,
    });

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

// Edytowanie opcji wysyłki
export async function PATCH(req, { params }) {
  const { id } = params;
  const { value, label, price, width, height, depth, weight, isActive } = await req.json();

  await dbConnect();

  try {
    const option = await ShippingOption.findById(id);
    if (!option) {
      return NextResponse.json({ error: 'Shipping option not found' }, { status: 404 });
    }
    option.value = value;
    option.label = label;
    option.price = price;
    option.width = width;
    option.height = height;
    option.depth = depth;
    option.weight = weight; 
    option.isActive = isActive;

    await option.save();
    return NextResponse.json(option, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
