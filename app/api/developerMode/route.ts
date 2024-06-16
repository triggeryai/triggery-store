// app/api/developerMode/route.ts
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import DeveloperMode from '@/lib/models/DeveloperMode';

export async function GET() {
  await dbConnect();

  try {
    const devMode = await DeveloperMode.findOne({});
    console.log('Developer Mode from DB:', devMode); // Debug line
    return NextResponse.json({ isDeveloperMode: devMode?.isDeveloperMode || false }, { status: 200 });
  } catch (error) {
    console.error('Error fetching developer mode status:', error); // Debug line
    return NextResponse.json({ message: 'Error fetching developer mode status' }, { status: 500 });
  }
}

