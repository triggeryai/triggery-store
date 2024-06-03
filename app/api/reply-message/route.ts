// app/api/reply-message/route.ts
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import ChatMessageModel from '@/lib/models/ChatMessageModel';
import { auth } from '@/lib/auth';

export const POST = auth(async (req) => {
  await dbConnect();

  if (!req.auth || !req.auth.user || !req.auth.user.isAdmin) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  const { messageId, reply } = await req.json();

  if (!messageId || !reply) {
    return NextResponse.json({ success: false, error: 'Message ID and reply are required' }, { status: 400 });
  }

  try {
    const message = await ChatMessageModel.findById(messageId);
    if (!message) {
      return NextResponse.json({ success: false, error: 'Message not found' }, { status: 404 });
    }

    message.reply = reply;
    await message.save();

    return NextResponse.json({ success: true, data: message }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
});
