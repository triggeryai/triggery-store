// next-amazona-v2/app/api/admin/guest-checkout/route.ts
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import GuestCheckout from '@/lib/models/GuestCheckout';
import { auth } from '@/lib/auth';

export const PATCH = auth(async (req) => {
  await dbConnect();

  if (!req.auth || !req.auth.user || !req.auth.user.isAdmin) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  const { isGuestCheckoutEnabled } = await req.json();

  try {
    let status = await GuestCheckout.findOne();
    if (!status) {
      status = new GuestCheckout({ isGuestCheckoutEnabled: isGuestCheckoutEnabled });
    } else {
      status.isGuestCheckoutEnabled = isGuestCheckoutEnabled;
    }
    await status.save();

    return NextResponse.json({ success: true, data: status }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
});

export const GET = auth(async (req) => {
  await dbConnect();

  if (!req.auth || !req.auth.user || !req.auth.user.isAdmin) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    let status = await GuestCheckout.findOne();
    if (!status) {
      status = new GuestCheckout({ isGuestCheckoutEnabled: false });
      await status.save();
    }

    return NextResponse.json({ success: true, data: status }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
});
