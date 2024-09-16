import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import ShippingOption from '@/lib/models/ShippingPriceModel';
import Product from '@/lib/models/ProductModel'; // Model produktów, jeśli potrzebujesz ich wymiarów

// Funkcja licząca objętość produktu
const calculateVolume = (width, height, depth) => width * height * depth;

// Funkcja licząca liczbę paczek
const calculatePackages = (products, shippingBox) => {
  let totalVolume = 0;

  // Suma objętości produktów w koszyku
  products.forEach((product) => {
    totalVolume += calculateVolume(product.width, product.height, product.depth) * product.qty;
  });

  // Objętość paczki wysyłkowej
  const boxVolume = calculateVolume(shippingBox.width, shippingBox.height, shippingBox.depth);

  // Obliczenie liczby paczek
  return Math.ceil(totalVolume / boxVolume);
};

export async function POST(req) {
  await dbConnect();

  try {
    const { shippingMethod, products } = await req.json();
    
    // Znajdź opcję wysyłki
    const shippingOption = await ShippingOption.findOne({ value: shippingMethod });
    if (!shippingOption) {
      return NextResponse.json({ error: 'Shipping option not found' }, { status: 404 });
    }

    // Oblicz liczbę paczek
    const numOfPackages = calculatePackages(products, {
      width: shippingOption.width,
      height: shippingOption.height,
      depth: shippingOption.depth,
    });

    // Oblicz całkowity koszt wysyłki
    const totalShippingCost = numOfPackages * shippingOption.price;

    return NextResponse.json({
      numOfPackages,
      totalShippingCost,
    });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
