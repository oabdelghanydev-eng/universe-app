/**
 * Firebase Admin SDK Configuration
 * Used for server-side operations (Server Actions)
 * 
 * IMPORTANT: This file should ONLY be imported in server-side code
 */

import 'server-only';

import { initializeApp, getApps, cert, type App } from 'firebase-admin/app';
import { getAuth, type Auth } from 'firebase-admin/auth';
import { getFirestore, type Firestore } from 'firebase-admin/firestore';
import { getStorage, type Storage } from 'firebase-admin/storage';
import { resolve } from 'path';

function getAdminApp(): App {
    if (getApps().length === 0) {
        // Try to use GOOGLE_APPLICATION_CREDENTIALS file path first
        // Falls back to FIREBASE_SERVICE_ACCOUNT_KEY JSON string for Vercel
        let serviceAccountPath = process.env.GOOGLE_APPLICATION_CREDENTIALS;
        const serviceAccountJson = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;

        if (serviceAccountPath) {
            // Resolve relative paths from project root
            if (serviceAccountPath.startsWith('./') || serviceAccountPath.startsWith('../')) {
                serviceAccountPath = resolve(process.cwd(), serviceAccountPath);
            }

            // Local development - uses file path
            return initializeApp({
                credential: cert(serviceAccountPath),
                storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
            });
        } else if (serviceAccountJson) {
            // Production (Vercel) - uses JSON string
            const serviceAccount = JSON.parse(serviceAccountJson);
            return initializeApp({
                credential: cert(serviceAccount),
                storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
            });
        } else {
            throw new Error(
                'Firebase Admin SDK: No credentials found. ' +
                'Set GOOGLE_APPLICATION_CREDENTIALS or FIREBASE_SERVICE_ACCOUNT_KEY'
            );
        }
    }
    return getApps()[0];
}

const adminApp = getAdminApp();

export const adminAuth: Auth = getAuth(adminApp);
export const adminDb: Firestore = getFirestore(adminApp);
export const adminStorage: Storage = getStorage(adminApp);

export default adminApp;
