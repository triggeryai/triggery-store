// app/api/admin/tax/route.ts
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Tax from '@/lib/models/TaxModel';

const DEFAULT_TAX = {
  isActive: false,
  type: 'fixed',
  value: 0,
};

export async function GET() {
  await dbConnect();

  try {
    let tax = await Tax.findOne();
    if (!tax) {
      tax = new Tax(DEFAULT_TAX);
      await tax.save();
    }
    return NextResponse.json(tax, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: 'Server error', error }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  await dbConnect();

  const { isActive, type, value } = await req.json();

  try {
    let tax = await Tax.findOne();
    if (!tax) {
      tax = new Tax({ isActive, type, value });
    } else {
      tax.isActive = isActive;
      tax.type = type;
      tax.value = value;
    }
    await tax.save();
    return NextResponse.json(tax, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: 'Server error', error }, { status: 500 });
  }
}
