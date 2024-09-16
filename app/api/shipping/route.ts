// next-amazona-v2/app/api/shipping/route.ts
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import ShippingOption from '@/lib/models/ShippingPriceModel';

const defaultShippingOptions = [
  { value: "Inpost Paczkomat", label: "Inpost Paczkomat - $5", price: 5, width: 50, height: 50, depth: 50, weight: 25 },
  { value: "Pocztex Poczta Polska Kurier", label: "Pocztex Poczta Kurier - $7", price: 7, width: 50, height: 50, depth: 50, weight: 25 },
  { value: "Pocztex Poczta Odbior Punkt", label: "Pocztex Poczta Odbior Punkt - $7", price: 7, width: 50, height: 50, depth: 50, weight: 25 },
  { value: "Inpost Kurier", label: "Inpost Kurier - $10", price: 10, width: 50, height: 50, depth: 50, weight: 25 },
  { value: "DPD Kurier", label: "DPD Kurier - $12", price: 12, width: 50, height: 50, depth: 50, weight: 25 },
  { value: "DHL Kurier", label: "DHL Kurier - $15", price: 15, width: 50, height: 50, depth: 50, weight: 25 },
  { value: "Odbior osobisty", label: "Odbior osobisty - $0", price: 0 },  // Odbiór osobisty bez wymiarów i wagi
];

export async function GET() {
  await dbConnect();

  try {
    let shippingOptions = await ShippingOption.find({ isActive: true });

    // Zawsze pokazujemy "Odbiór osobisty", niezależnie od innych opcji
    shippingOptions = shippingOptions.filter(option => {
      if (option.value === 'Odbior osobisty') {
        return true;
      }
      return option.width && option.height && option.depth && option.weight;
    });

    // Jeżeli opcje wysyłki są puste, dodajemy domyślne opcje
    if (shippingOptions.length === 0) {
      shippingOptions = await ShippingOption.insertMany(defaultShippingOptions);
    }

    console.log('Shipping Options:', shippingOptions); // Debug
    return NextResponse.json(shippingOptions);
  } catch (error) {
    console.error('Error fetching shipping options:', error); // Error log
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(req) {
  await dbConnect();

  try {
    const { value, label, price, width, height, depth, weight } = await req.json();

    // Tworzymy nową opcję wysyłki
    const newOption = new ShippingOption({
      value,
      label,
      price,
      width,
      height,
      depth,
      weight,
    });

    await newOption.save();
    console.log('New Shipping Option Added:', newOption); // Debug log
    return NextResponse.json(newOption, { status: 201 });
  } catch (error) {
    console.error('Error adding new shipping option:', error); // Error log
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(req) {
  await dbConnect();

  try {
    const { id } = await req.json();
    await ShippingOption.findByIdAndDelete(id);
    console.log('Deleted Shipping Option with ID:', id); // Debug log
    return NextResponse.json(null, { status: 204 });
  } catch (error) {
    console.error('Error deleting shipping option:', error); // Error log
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
