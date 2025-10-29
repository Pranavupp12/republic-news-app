import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// 1. Define your domains (Update if needed, or use environment variables)
const PUBLIC_HOST = process.env.NEXT_PUBLIC_APP_URL || 'republicnews.com'; 
const DASHBOARD_HOST = `dashboard.${PUBLIC_HOST}`;

// 2. Specify paths that should always be public, even on the dashboard domain
const PUBLIC_PATHS = ['/login', '/signup']; 

export function middleware(request: NextRequest) {
  // 3. Get the host and pathname
  const url = request.nextUrl.clone();
  const host = request.headers.get('host') || PUBLIC_HOST;
  const pathname = url.pathname;

  // 4. Handle the dashboard subdomain
  if (host === DASHBOARD_HOST) {
    // Rewrite paths to /dashboard/* unless it's a public path
    if (PUBLIC_PATHS.some(path => pathname.startsWith(path))) {
      return NextResponse.next(); // Allow access to login/signup
    }
    
    url.pathname = `/dashboard${pathname}`; // Rewrite e.g., /settings to /dashboard/settings
    return NextResponse.rewrite(url);
  }

  // 5. Handle the main domain (prevent access to /dashboard)
  if (host === PUBLIC_HOST) {
    if (pathname.startsWith('/dashboard')) {
      // Redirect to the dashboard subdomain's equivalent path
      const newPath = pathname.substring('/dashboard'.length); // Remove /dashboard prefix
      const newUrl = new URL(newPath || '/', `https://${DASHBOARD_HOST}`);
      return NextResponse.redirect(newUrl);
    }
  }

  // Allow other requests
  return NextResponse.next();
}

// 6. Matcher: Run on most paths, excluding static assets/API
export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.png$).*)',
  ],
};