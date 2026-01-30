import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    // Only protect dashboard routes (except login page)
    const isDashboardRoute = request.nextUrl.pathname.startsWith('/dashboard');
    const isLoginPage = request.nextUrl.pathname === '/dashboard/login';

    if (isDashboardRoute && !isLoginPage) {
        // Check for session cookie
        const sessionCookie = request.cookies.get('admin_session');

        if (!sessionCookie) {
            // Redirect to login page
            const loginUrl = new URL('/dashboard/login', request.url);
            loginUrl.searchParams.set('redirect', request.nextUrl.pathname);
            return NextResponse.redirect(loginUrl);
        }

        // Verify the session is not too old (24 hours)
        try {
            const decoded = Buffer.from(sessionCookie.value, 'base64').toString();
            const timestamp = parseInt(decoded.split(':')[1]);
            const hoursSinceLogin = (Date.now() - timestamp) / (1000 * 60 * 60);

            if (hoursSinceLogin > 24) {
                // Session expired, redirect to login
                const loginUrl = new URL('/dashboard/login', request.url);
                return NextResponse.redirect(loginUrl);
            }
        } catch {
            // Invalid session, redirect to login
            const loginUrl = new URL('/dashboard/login', request.url);
            return NextResponse.redirect(loginUrl);
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/dashboard/:path*']
};
