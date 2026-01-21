/**
 * Algolia Retry Sync Script
 * 
 * Manually sync listings that failed to sync to Algolia.
 * Run with: npx ts-node scripts/algolia-retry-sync.ts
 * 
 * Prerequisites:
 * - .env.local with Firebase Admin SDK credentials
 * - .env.local with ALGOLIA_ADMIN_KEY
 */

import * as admin from 'firebase-admin';
import { algoliasearch } from 'algoliasearch';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

// Initialize Firebase Admin
if (!admin.apps.length) {
    const serviceAccountPath = process.env.GOOGLE_APPLICATION_CREDENTIALS;

    if (serviceAccountPath) {
        admin.initializeApp({
            credential: admin.credential.cert(serviceAccountPath),
            projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
        });
    } else {
        throw new Error('GOOGLE_APPLICATION_CREDENTIALS not set');
    }
}

const db = admin.firestore();

// Initialize Algolia Admin Client (v5 API)
const algoliaClient = algoliasearch(
    process.env.NEXT_PUBLIC_ALGOLIA_APP_ID!,
    process.env.ALGOLIA_ADMIN_KEY!
);
const LISTINGS_INDEX = 'listings';

interface ListingData {
    title: string;
    description: string;
    type: 'product' | 'service';
    price: number | null;
    imagePaths: string[];
    userId: string;
    createdAt: admin.firestore.Timestamp;
    isDeleted: boolean;
    isFlagged: boolean;
}

async function retrySyncFailedListings(): Promise<void> {
    console.log('🔄 Starting Algolia sync retry...\n');

    try {
        const failedListings = await db
            .collection('listings')
            .where('needsAlgoliaSync', '==', true)
            .where('isDeleted', '==', false)
            .limit(100)
            .get();

        console.log(`Found ${failedListings.size} listings to retry\n`);

        if (failedListings.empty) {
            console.log('✅ No listings need syncing!');
            return;
        }

        let successCount = 0;
        let failCount = 0;

        for (const doc of failedListings.docs) {
            const data = doc.data() as ListingData;

            try {
                // v5 API: use saveObject with indexName
                // NOTE: Store imagePaths (permanent), not URLs
                await algoliaClient.saveObject({
                    indexName: LISTINGS_INDEX,
                    body: {
                        objectID: doc.id,
                        title: data.title,
                        description: data.description,
                        type: data.type,
                        price: data.price || null,
                        imagePaths: data.imagePaths || [],
                        userId: data.userId,
                        createdAt: data.createdAt.toMillis(),
                        isDeleted: false,
                        isFlagged: false
                    }
                });

                await doc.ref.update({
                    needsAlgoliaSync: false,
                    lastAlgoliaSyncAt: admin.firestore.FieldValue.serverTimestamp(),
                    algoliaSyncError: null
                });

                console.log(`✅ Synced: ${doc.id} - "${data.title}"`);
                successCount++;
            } catch (error) {
                const errorMessage = error instanceof Error ? error.message : 'Unknown error';
                console.error(`❌ Failed: ${doc.id} - ${errorMessage}`);

                // Update error message in Firestore
                await doc.ref.update({
                    algoliaSyncError: errorMessage
                });

                failCount++;
            }
        }

        console.log('\n📊 Summary:');
        console.log(`   ✅ Success: ${successCount}`);
        console.log(`   ❌ Failed: ${failCount}`);
        console.log(`   📋 Total: ${failedListings.size}`);

    } catch (error) {
        console.error('❌ Script error:', error);
        process.exit(1);
    }
}

// Run the script
retrySyncFailedListings()
    .then(() => {
        console.log('\n✅ Script completed');
        process.exit(0);
    })
    .catch((error) => {
        console.error('\n❌ Script failed:', error);
        process.exit(1);
    });

