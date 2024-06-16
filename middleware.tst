// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import DeveloperMode from '@/lib/models/DeveloperMode';
import { auth } from '@/lib/auth';

export async function middleware(request: NextRequest) {
  const protectedPaths = [
    /\/shipping/,
    /\/payment/,
    /\/place-order/,
    /\/profile/,
    /\/order\/(.*)/,
    /\/admin/,
  ];

  const { pathname } = request.nextUrl;
  
  // Check if the path is protected
  if (protectedPaths.some((p) => p.test(pathname))) {
    await dbConnect();
    const status = await DeveloperMode.findOne();
    
    if (status && status.isDeveloperMode) {
      const session = await auth(request);
      if (!session?.user?.isAdmin) {
        // Redirect non-admin users to the developing mode page
        return NextResponse.redirect(new URL('/developing-mode', request.url));
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
