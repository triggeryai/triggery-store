// app/api/admin/developerMode/route.ts
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import DeveloperMode from '@/lib/models/DeveloperMode';
import { auth } from '@/lib/auth';

export const PATCH = auth(async (req) => {
  await dbConnect();

  if (!req.auth || !req.auth.user || !req.auth.user.isAdmin) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  const { isDeveloperMode } = await req.json();

  try {
    let status = await DeveloperMode.findOne();
    if (!status) {
      status = new DeveloperMode({ isDeveloperMode: true }); // Set default to true if not found
    } else {
      status.isDeveloperMode = isDeveloperMode;
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
    let status = await DeveloperMode.findOne();
    if (!status) {
      // Create default entry if not found
      status = new DeveloperMode({ isDeveloperMode: true });
      await status.save();
    }

    return NextResponse.json({ success: true, data: status }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
});
