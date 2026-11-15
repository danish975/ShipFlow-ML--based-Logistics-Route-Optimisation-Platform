import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Next.js 16: `middleware` was renamed to `proxy`.
//
// Only gate /dashboard on the presence of the access-token cookie. We do NOT
// redirect /login -> /dashboard here: the proxy can't validate the token, so a
// stale cookie would bounce between /login and /dashboard forever (the
// dashboard's profile check fails and sends the user back to /login).
export function proxy(request: NextRequest) {
  if (!request.cookies.has('accessToken')) {
    const loginUrl = new URL('/login', request.url);
    // Remember where the user was going; /login validates it before use.
    loginUrl.searchParams.set('next', request.nextUrl.pathname + request.nextUrl.search);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*'],
};
