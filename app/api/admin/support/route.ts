// app\api\admin\support\route.ts
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import SupportChatOffOn from '@/lib/models/SupportChatOffOn';
import { auth } from '@/lib/auth';

export const PATCH = auth(async (req) => {
  await dbConnect();

  if (!req.auth || !req.auth.user || !req.auth.user.isAdmin) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  const { isOff } = await req.json();

  try {
    let status = await SupportChatOffOn.findOne();
    if (!status) {
      status = new SupportChatOffOn({ isOff });
    } else {
      status.isOff = isOff;
    }
    await status.save();

    return NextResponse.json({ success: true, data: status }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
});
