import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import BuilderOnOff from '@/lib/models/BuilderOnOff';
import { auth } from '@/lib/auth';

// PATCH handler
export const PATCH = auth(async (req: NextRequest): Promise<Response> => {
  console.log('Received PATCH request');
  
  await dbConnect();
  console.log('Database connected');

  if (!req.auth || !req.auth.user || !req.auth.user.isAdmin) {
    console.log('Unauthorized access attempt', req.auth ? req.auth.user : 'No user');
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 }) as Response;
  }

  const { isBuilderEnabled } = await req.json();
  console.log('isBuilderEnabled:', isBuilderEnabled);

  try {
    let status = await BuilderOnOff.findOne();
    if (!status) {
      console.log('No status found, creating new');
      status = new BuilderOnOff({ isBuilderEnabled });
    } else {
      console.log('Updating existing status');
      status.isBuilderEnabled = isBuilderEnabled;
    }
    await status.save();
    console.log('Status saved:', status);

    return NextResponse.json({ success: true, data: status }, { status: 200 }) as Response;
  } catch (error: any) {
    console.log('Error occurred:', error.message);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 }) as Response;
  }
});

// GET handler
export const GET = auth(async (request: NextRequest): Promise<Response> => {
  console.log('Received GET request');
  
  await dbConnect();
  console.log('Database connected');

  if (!request.auth || !request.auth.user || !request.auth.user.isAdmin) {
    console.log('Unauthorized access attempt', request.auth ? request.auth.user : 'No user');
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 }) as Response;
  }

  try {
    let status = await BuilderOnOff.findOne();
    if (!status) {
      console.log('No status found, creating default status');
      status = new BuilderOnOff({ isBuilderEnabled: false });
      await status.save();
      console.log('Default status created and saved');
    } else {
      console.log('Fetched existing status:', status);
    }

    return NextResponse.json({ success: true, data: status }, { status: 200 }) as Response;
  } catch (error: any) {
    console.log('Error occurred:', error.message);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 }) as Response;
  }
});
