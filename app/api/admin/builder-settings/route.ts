import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import BuilderSettings from '@/lib/models/BuilderSettings';
import { auth } from '@/lib/auth';

export const PATCH = auth(async (req) => {
  await dbConnect();

  if (!req.auth || !req.auth.user || !req.auth.user.isAdmin) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  const { headerClasses, logoSrc, logoWidth, logoHeight, isDark } = await req.json();

  try {
    let settings = await BuilderSettings.findOne();
    if (!settings) {
      settings = new BuilderSettings({ headerClasses, logoSrc, logoWidth, logoHeight, isDark });
    } else {
      settings.headerClasses = headerClasses;
      settings.logoSrc = logoSrc;
      settings.logoWidth = logoWidth;
      settings.logoHeight = logoHeight;
      settings.isDark = isDark;
    }
    await settings.save();

    return NextResponse.json({ success: true, data: settings }, { status: 200 });
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
    let settings = await BuilderSettings.findOne();
    if (!settings) {
      settings = new BuilderSettings({ 
        headerClasses: 'navbar justify-between bg-base-300', 
        logoSrc: '/logo_domestico.png', 
        logoWidth: 70, 
        logoHeight: 70, 
        isDark: false 
      });
      await settings.save();
    }

    return NextResponse.json({ success: true, data: settings }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
});
