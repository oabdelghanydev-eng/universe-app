// Authentication Middleware - Route protection
/**
 * Next.js Middleware
 * Handles session cookie renewal and protected route redirects
 */

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Routes that require authentication
const PROTECTED_ROUTES = [
    '/profile',
    '/listing/new',
];

// Routes that require authentication AND edit permission
const EDIT_ROUTE_PATTERN = /^\/listing\/[^/]+\/edit$/;

// Auth routes that should redirect to home if already logged in
// Note: /register is NOT included - user might be logged in but not yet verified
const AUTH_ROUTES = ['/login'];

export function middleware(request: NextRequest) {
    const session = request.cookies.get('session')?.value;
    const { pathname } = request.nextUrl;

    // Check if route is protected
    const isProtectedRoute =
        PROTECTED_ROUTES.some(route => pathname.startsWith(route)) ||
        EDIT_ROUTE_PATTERN.test(pathname);

    // Check if route is an auth route
    const isAuthRoute = AUTH_ROUTES.some(route => pathname.startsWith(route));

    // No session - redirect to login for protected routes
    if (!session && isProtectedRoute) {
        const loginUrl = new URL('/login', request.url);
        loginUrl.searchParams.set('redirect', pathname);
        return NextResponse.redirect(loginUrl);
    }

    // Has session - redirect away from auth routes
    if (session && isAuthRoute) {
        return NextResponse.redirect(new URL('/', request.url));
    }

    // Renew session cookie on each request (sliding session)
    if (session) {
        const response = NextResponse.next();

        response.cookies.set('session', session, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 60 * 60 * 24 * 5, // 5 days
            path: '/',
        });

        return response;
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        /*
         * Match all request paths except:
         * - api routes
         * - _next/static (static files)
         * - _next/image (image optimization)
         * - favicon.ico
         * - public files
         */
        '/((?!api|_next/static|_next/image|favicon.ico|.*\\.png$|.*\\.jpg$|.*\\.svg$).*)',
    ],
};

