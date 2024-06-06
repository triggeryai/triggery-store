// app\api\admin\products\lack\route.ts
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import ProductLackShowOnOff from '@/lib/models/ProductLackShowOnOff';
import { auth } from '@/lib/auth';

export const PATCH = auth(async (req) => {
  await dbConnect();

  if (!req.auth || !req.auth.user || !req.auth.user.isAdmin) {
    console.error('Unauthorized request');
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  const { isOn } = await req.json();

  try {
    let status = await ProductLackShowOnOff.findOne();
    if (!status) {
      status = new ProductLackShowOnOff({ isOn });
    } else {
      status.isOn = isOn;
    }
    await status.save();

    return NextResponse.json({ success: true, data: status }, { status: 200 });
  } catch (error) {
    console.error('Error saving status:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
});

export const GET = auth(async (req) => {
  await dbConnect();

  if (!req.auth || !req.auth.user || !req.auth.user.isAdmin) {
    console.error('Unauthorized request');
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    let status = await ProductLackShowOnOff.findOne();
    if (!status) {
      status = new ProductLackShowOnOff({ isOn: false });
      await status.save();
    }

    return NextResponse.json({ success: true, data: status }, { status: 200 });
  } catch (error) {
    console.error('Error fetching status:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
});
