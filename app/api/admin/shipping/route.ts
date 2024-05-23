// app\api\admin\shipping\route.ts
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import BankAccount from '@/lib/models/BankAccountModel';

const DEFAULT_BANK_ACCOUNT = '0000 0000 0000 0000 0000 0000 0000';

export async function GET() {
  await dbConnect();

  try {
    let bankAccount = await BankAccount.findOne();
    if (!bankAccount) {
      // Create a new bank account with the default value if none exists
      bankAccount = new BankAccount({ accountNumber: DEFAULT_BANK_ACCOUNT });
      await bankAccount.save();
    }
    return NextResponse.json(bankAccount, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: 'Server error', error }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  await dbConnect();

  const { accountNumber } = await req.json();

  if (!accountNumber) {
    return NextResponse.json({ message: 'Account number is required' }, { status: 400 });
  }

  try {
    let bankAccount = await BankAccount.findOne();
    if (!bankAccount) {
      bankAccount = new BankAccount({ accountNumber });
    } else {
      bankAccount.accountNumber = accountNumber;
    }
    await bankAccount.save();
    return NextResponse.json(bankAccount, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: 'Server error', error }, { status: 500 });
  }
}
