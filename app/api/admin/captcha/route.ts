import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import CaptchaOnOff from '@/lib/models/CaptchaOnOff';
import { auth } from '@/lib/auth';

export const PATCH = auth(async (req) => {
  await dbConnect();

  if (!req.auth || !req.auth.user || !req.auth.user.isAdmin) {
    console.error('Unauthorized access attempt');
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { isCaptchaEnabled, captchaKey } = await req.json();
    console.log('Received data:', { isCaptchaEnabled, captchaKey });

    let status = await CaptchaOnOff.findOne();
    if (!status) {
      console.log('No existing CaptchaOnOff entry, creating a new one');
      status = new CaptchaOnOff({ isCaptchaEnabled: !!isCaptchaEnabled, captchaKey });
    } else {
      console.log('Updating existing CaptchaOnOff entry');
      if (typeof isCaptchaEnabled !== 'undefined') {
        status.isCaptchaEnabled = isCaptchaEnabled;
      }
      if (captchaKey) {
        status.captchaKey = captchaKey;
      }
    }

    await status.save();
    console.log('Captcha status updated successfully:', status);

    return NextResponse.json({ success: true, data: status }, { status: 200 });
  } catch (error) {
    console.error('Error updating captcha status:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
});

export const GET = auth(async (req) => {
  await dbConnect();

  if (!req.auth || !req.auth.user || !req.auth.user.isAdmin) {
    console.error('Unauthorized access attempt');
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    let status = await CaptchaOnOff.findOne();
    if (!status) {
      console.log('No existing CaptchaOnOff entry, creating a new one');
      status = new CaptchaOnOff({ isCaptchaEnabled: true, captchaKey: 'default_key' });
      await status.save();
    }

    console.log('Captcha status fetched successfully:', status);
    return NextResponse.json({ success: true, data: status }, { status: 200 });
  } catch (error) {
    console.error('Error fetching captcha status:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
});
