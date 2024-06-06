// app\api\support-status\route.ts
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import SupportChatOffOn from '@/lib/models/SupportChatOffOn';

export const GET = async () => {
  await dbConnect();

  let status = await SupportChatOffOn.findOne();
  if (!status) {
    status = new SupportChatOffOn({ isOff: false });
    await status.save();
  }
  return NextResponse.json({ isOff: status.isOff }, { status: 200 });
};
