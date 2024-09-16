import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import CaptchaOnOff from '@/lib/models/CaptchaOnOff';

export async function GET() {
  await dbConnect();

  try {
    // Pobierz status Captcha z kolekcji CaptchaOnOff
    const captchaStatus = await CaptchaOnOff.findOne();

    if (!captchaStatus) {
      return NextResponse.json(
        { success: false, error: 'Captcha setting not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        isCaptchaEnabled: captchaStatus.isCaptchaEnabled,
      },
    });
  } catch (error) {
    console.error('Error fetching captcha status:', error);
    return NextResponse.json(
      { success: false, error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
