// Firebase Admin SDK for server-side operations
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
        // Priority 1: Use FIREBASE_SERVICE_ACCOUNT_KEY (JSON String)
        // Best for Vercel / Production where files aren't committed
        const serviceAccountJson = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
        if (serviceAccountJson) {
            try {
                const serviceAccount = JSON.parse(serviceAccountJson);
                return initializeApp({
                    credential: cert(serviceAccount),
                    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
                });
            } catch (error) {
                console.error('Error parsing FIREBASE_SERVICE_ACCOUNT_KEY:', error);
                // Fallthrough to try file path if JSON parse fails
            }
        }

        // Priority 2: Use GOOGLE_APPLICATION_CREDENTIALS (File Path)
        // Best for Local Development
        let serviceAccountPath = process.env.GOOGLE_APPLICATION_CREDENTIALS;
        if (serviceAccountPath) {
            // Resolve relative paths from project root
            if (serviceAccountPath.startsWith('./') || serviceAccountPath.startsWith('../')) {
                serviceAccountPath = resolve(process.cwd(), serviceAccountPath);
            }

            return initializeApp({
                credential: cert(serviceAccountPath),
                storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
            });
        }

        throw new Error(
            'Firebase Admin SDK: No credentials found. ' +
            'Set FIREBASE_SERVICE_ACCOUNT_KEY (JSON string) or GOOGLE_APPLICATION_CREDENTIALS (file path)'
        );
    }
    return getApps()[0];
}

const adminApp = getAdminApp();

export const adminAuth: Auth = getAuth(adminApp);
export const adminDb: Firestore = getFirestore(adminApp);
export const adminStorage: Storage = getStorage(adminApp);

export default adminApp;

