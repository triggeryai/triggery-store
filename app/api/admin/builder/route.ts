import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import BuilderOnOff from '@/lib/models/BuilderOnOff';
import { auth } from '@/lib/auth';

export const PATCH = auth(async (req) => {
  await dbConnect();

  if (!req.auth || !req.auth.user || !req.auth.user.isAdmin) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  const { isBuilderEnabled } = await req.json();

  try {
    let status = await BuilderOnOff.findOne();
    if (!status) {
      status = new BuilderOnOff({ isBuilderEnabled });
    } else {
      status.isBuilderEnabled = isBuilderEnabled;
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
    let status = await BuilderOnOff.findOne();
    if (!status) {
      status = new BuilderOnOff({ isBuilderEnabled: false });
      await status.save();
    }

    return NextResponse.json({ success: true, data: status }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
});
