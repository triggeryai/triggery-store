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

  const { recipient, message } = await req.json();

  if (!recipient || !message) {
    return NextResponse.json({ success: false, error: 'Recipient and message are required' }, { status: 400 });
  }

  try {
    const replyMessage = new ChatMessageModel({
      sender: 'admin',
      recipient,
      message,
      timestamp: new Date()
    });

    await replyMessage.save();

    return NextResponse.json({ success: true, data: replyMessage }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
});
