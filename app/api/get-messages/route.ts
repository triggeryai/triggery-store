// app/api/get-messages/route.ts
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import ChatMessageModel from '@/lib/models/ChatMessageModel';
import { auth } from '@/lib/auth';

export const GET = auth(async (req) => {
  await dbConnect();

  if (!req.auth || !req.auth.user || !req.auth.user.isAdmin) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  const url = new URL(req.url);
  const recipient = url.searchParams.get('recipient');

  if (!recipient) {
    return NextResponse.json({ success: false, error: 'Recipient is required' }, { status: 400 });
  }

  try {
    const messages = await ChatMessageModel.find({ recipient }).sort({ timestamp: -1 });
    return NextResponse.json({ success: true, data: messages }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
});
