// app/api/send-message/route.ts
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import ChatMessageModel from '@/lib/models/ChatMessageModel';
import { auth } from '@/lib/auth';

export const POST = auth(async (req) => {
  await dbConnect();

  if (!req.auth || !req.auth.user) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  const { recipient, message } = await req.json();

  try {
    const chatMessage = new ChatMessageModel({ sender: req.auth.user.name, recipient, message });
    await chatMessage.save();
    return NextResponse.json({ success: true, data: chatMessage }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
});
