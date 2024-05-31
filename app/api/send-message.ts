// app\api\send-message.ts
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import ChatMessageModel from '@/lib/models/ChatMessageModel';

export async function POST(request: Request) {
  await dbConnect();

  const { sender, recipient, message } = await request.json();

  if (!sender || !recipient || !message) {
    return NextResponse.json({ success: false, error: 'All fields are required' }, { status: 400 });
  }

  try {
    const chatMessage = new ChatMessageModel({ sender, recipient, message });
    await chatMessage.save();
    return NextResponse.json({ success: true, data: chatMessage }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
