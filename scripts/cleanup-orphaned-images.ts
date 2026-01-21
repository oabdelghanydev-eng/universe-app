/**
 * Storage Cleanup Script
 * 
 * Cleans up orphaned images from deleted listings.
 * Run with: npx ts-node scripts/cleanup-orphaned-images.ts
 * 
 * Prerequisites:
 * - .env.local with Firebase Admin SDK credentials
 * 
 * WARNING: This script permanently deletes data!
 * Run with --dry-run first to see what would be deleted.
 */

import * as admin from 'firebase-admin';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

// Parse command line arguments
const isDryRun = process.argv.includes('--dry-run');
const retentionDays = parseInt(process.argv.find(arg => arg.startsWith('--days='))?.split('=')[1] || '30');

// Initialize Firebase Admin
if (!admin.apps.length) {
    const serviceAccount = JSON.parse(
        process.env.FIREBASE_SERVICE_ACCOUNT_KEY || '{}'
    );

    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
        storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    });
}

const db = admin.firestore();
const bucket = admin.storage().bucket();

interface ListingData {
    images: string[];
    deletedAt: admin.firestore.Timestamp;
    userId: string;
}

function extractStoragePath(imageUrl: string): string | null {
    try {
        // Firebase Storage URL format: 
        // https://firebasestorage.googleapis.com/v0/b/BUCKET/o/PATH?...
        const match = imageUrl.match(/\/o\/(.+?)\?/);
        if (match) {
            return decodeURIComponent(match[1]);
        }
        return null;
    } catch {
        return null;
    }
}

async function cleanupOrphanedImages(): Promise<void> {
    console.log('🧹 Starting storage cleanup...');
    console.log(`   Mode: ${isDryRun ? 'DRY RUN (no changes)' : '⚠️  LIVE (will delete files)'}`);
    console.log(`   Retention: ${retentionDays} days\n`);

    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - retentionDays);

    try {
        // Find listings deleted more than X days ago
        const deletedListings = await db
            .collection('listings')
            .where('isDeleted', '==', true)
            .where('deletedAt', '<', cutoffDate)
            .get();

        console.log(`Found ${deletedListings.size} listings deleted before ${cutoffDate.toISOString()}\n`);

        if (deletedListings.empty) {
            console.log('✅ No old deleted listings found!');
            return;
        }

        let imagesDeleted = 0;
        let listingsDeleted = 0;
        let errors = 0;

        for (const doc of deletedListings.docs) {
            const data = doc.data() as ListingData;
            console.log(`\n📋 Processing: ${doc.id}`);
            console.log(`   Images: ${data.images?.length || 0}`);

            // Delete images from Storage
            if (data.images && data.images.length > 0) {
                for (const imageUrl of data.images) {
                    const storagePath = extractStoragePath(imageUrl);

                    if (storagePath) {
                        try {
                            if (isDryRun) {
                                console.log(`   [DRY RUN] Would delete: ${storagePath}`);
                            } else {
                                await bucket.file(storagePath).delete();
                                console.log(`   ✅ Deleted: ${storagePath}`);
                            }
                            imagesDeleted++;
                        } catch (error) {
                            console.error(`   ❌ Failed to delete: ${storagePath}`, error);
                            errors++;
                        }
                    } else {
                        console.log(`   ⚠️  Could not parse URL: ${imageUrl}`);
                    }
                }
            }

            // Hard delete the listing document
            try {
                if (isDryRun) {
                    console.log(`   [DRY RUN] Would delete document: ${doc.id}`);
                } else {
                    await doc.ref.delete();
                    console.log(`   ✅ Deleted document: ${doc.id}`);
                }
                listingsDeleted++;
            } catch (error) {
                console.error(`   ❌ Failed to delete document: ${doc.id}`, error);
                errors++;
            }
        }

        console.log('\n📊 Summary:');
        console.log(`   🗑️  Images deleted: ${imagesDeleted}`);
        console.log(`   📄 Listings deleted: ${listingsDeleted}`);
        console.log(`   ❌ Errors: ${errors}`);

        if (isDryRun) {
            console.log('\n⚠️  This was a dry run. No files were actually deleted.');
            console.log('   Run without --dry-run to perform actual cleanup.');
        }

    } catch (error) {
        console.error('❌ Script error:', error);
        process.exit(1);
    }
}

// Run the script
cleanupOrphanedImages()
    .then(() => {
        console.log('\n✅ Script completed');
        process.exit(0);
    })
    .catch((error) => {
        console.error('\n❌ Script failed:', error);
        process.exit(1);
    });
