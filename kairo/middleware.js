import { NextResponse } from 'next/server';

export function middleware(request) {
  const { pathname } = request.nextUrl;

  // Check if the request is for the dashboard
  if (pathname.startsWith('/dashboard')) {
    // In a client-side rendered app with localStorage tokens, we can't verify the token in middleware
    // The authentication check will be handled in the dashboard component itself
    // This middleware is mainly for future server-side token validation if needed
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*'],
};