// Authentication utilities for Firebase Auth
/**
 * Server-side Session Management
 * Handles session cookie verification and user session retrieval
 */

import 'server-only';

import { cookies } from 'next/headers';
import { adminAuth } from './firebase/admin';

export interface Session {
    uid: string;
    email: string;
    photoURL?: string;
}

/**
 * Get the current user session from the session cookie
 * Returns null if no valid session exists
 */
export async function getServerSession(): Promise<Session | null> {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('session')?.value;

    if (!sessionCookie) {
        return null;
    }

    try {
        // Verify the session cookie and check if it's been revoked
        const decodedToken = await adminAuth.verifySessionCookie(sessionCookie, true);

        return {
            uid: decodedToken.uid,
            email: decodedToken.email || '',
            photoURL: decodedToken.picture || undefined,
        };
    } catch (error) {
        // Invalid or expired session - clear the cookie
        console.error('Session verification failed:', error);
        return null;
    }
}

/**
 * Create a session cookie from a Firebase ID token
 */
export async function createSessionCookie(idToken: string): Promise<string> {
    // Session expires in 5 days
    const expiresIn = 60 * 60 * 24 * 5 * 1000; // 5 days in milliseconds

    const sessionCookie = await adminAuth.createSessionCookie(idToken, { expiresIn });
    return sessionCookie;
}

/**
 * Session cookie configuration
 */
export const SESSION_CONFIG = {
    name: 'session',
    options: {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax' as const,
        maxAge: 60 * 60 * 24 * 5, // 5 days in seconds
        path: '/',
    },
};

