import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import ProductModel from '@/lib/models/ProductModel';

export async function GET(req: Request, { params }: { params: { slug: string } }) {
  await dbConnect();

  try {
    const product = await ProductModel.findOne({ slug: params.slug }).select('countInStock');

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json({ countInStock: product.countInStock });
  } catch (error) {
    console.error('Error fetching product stock:', error); // Log błędu
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
