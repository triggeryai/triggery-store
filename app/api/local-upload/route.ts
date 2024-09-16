// app/api/local-upload/route.ts
import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import dbConnect from '@/lib/dbConnect';
import ProductModel from '@/lib/models/ProductModel'; // Import modelu produktu

export const POST = async (req: Request) => {
  try {
    const formData = await req.formData(); // Odczyt danych z formularza
    const file = formData.get('file') as File; // Pobranie pliku z formularza
    const productId = formData.get('productId') as string; // Pobranie ID produktu

    // Ścieżka docelowa, gdzie zapisujemy plik
    const fileName = `${Date.now()}_${file.name}`;
    const filePath = path.join(process.cwd(), 'public/products', fileName);

    // Utworzenie strumienia zapisu
    const buffer = await file.arrayBuffer();
    fs.writeFileSync(filePath, Buffer.from(buffer));

    // Zapisz ścieżkę obrazu do bazy danych produktu
    await dbConnect();
    const product = await ProductModel.findById(productId);
    if (!product) {
      return NextResponse.json({ message: 'Produkt nie znaleziony' }, { status: 404 });
    }

    // Dodajemy ścieżkę pliku do tablicy images
    product.images.push(fileName);

    await product.save();

    return NextResponse.json({ message: 'Plik zapisany', filePath: `/products/${fileName}` });
  } catch (error) {
    console.error('Błąd podczas zapisywania pliku:', error);
    return NextResponse.json({ error: 'Nie udało się przesłać pliku' }, { status: 500 });
  }
};
