// app/api/get-messages/route.ts
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import ChatMessageModel from '@/lib/models/ChatMessageModel';
import { auth } from '@/lib/auth';

export const GET = auth(async (req) => {
  await dbConnect();

  const { searchParams } = new URL(req.url);
  const user = searchParams.get('user');

  if (!user && (!req.auth || !req.auth.user || !req.auth.user.isAdmin)) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const query = user
      ? { $or: [{ sender: user }, { recipient: user }] }
      : { $or: [{ recipient: 'admin' }, { sender: 'admin' }] };

    const messages = await ChatMessageModel.find(query).sort({ timestamp: -1 });

    return NextResponse.json({ success: true, data: messages }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
});
