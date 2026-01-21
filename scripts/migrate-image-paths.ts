#!/usr/bin/env npx ts-node
/**
 * Migration Script - Update image path format
 *
 * Migration Script: Populate imagePaths from existing images URLs
 * 
 * This script is needed for existing listings that were created before
 * the imagePaths field was introduced. It extracts storage paths from
 * signed URLs and populates the imagePaths field.
 * 
 * Usage:
 *   npx ts-node scripts/migrate-image-paths.ts --dry-run
 *   npx ts-node scripts/migrate-image-paths.ts
 * 
 * IMPORTANT: Run with --dry-run first to preview changes!
 */

import * as admin from 'firebase-admin';

// Initialize Firebase Admin
if (!process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
    console.error('Missing FIREBASE_SERVICE_ACCOUNT_KEY environment variable');
    process.exit(1);
}

const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

interface ListingData {
    images?: string[];
    imagePaths?: string[];
}

/**
 * Extract storage path from a Supabase signed URL
 * Example URL: https://xxx.supabase.co/storage/v1/object/sign/listings/userId/listingId/uuid.webp?token=...
 * Returns: userId/listingId/uuid.webp
 */
function extractPathFromUrl(url: string): string | null {
    try {
        const urlObj = new URL(url);
        const pathname = urlObj.pathname;

        // Pattern: /storage/v1/object/sign/listings/{path}
        const match = pathname.match(/\/storage\/v1\/object\/sign\/listings\/(.+)/);
        if (match && match[1]) {
            return match[1];
        }

        // Alternative pattern for public URLs
        const publicMatch = pathname.match(/\/storage\/v1\/object\/public\/listings\/(.+)/);
        if (publicMatch && publicMatch[1]) {
            return publicMatch[1];
        }

        return null;
    } catch {
        return null;
    }
}

async function migrateListings(dryRun: boolean = true) {
    console.log(`\n🔄 Starting migration (dry-run: ${dryRun})\n`);

    const snapshot = await db.collection('listings').get();

    let migratedCount = 0;
    let skippedCount = 0;
    let errorCount = 0;

    for (const doc of snapshot.docs) {
        const data = doc.data() as ListingData;
        const listingId = doc.id;

        // Skip if already has imagePaths
        if (data.imagePaths && data.imagePaths.length > 0) {
            console.log(`⏭️  Skipping ${listingId}: already has imagePaths`);
            skippedCount++;
            continue;
        }

        // Skip if no images
        if (!data.images || data.images.length === 0) {
            console.log(`⏭️  Skipping ${listingId}: no images`);
            skippedCount++;
            continue;
        }

        // Extract paths from URLs
        const imagePaths: string[] = [];
        for (const url of data.images) {
            const path = extractPathFromUrl(url);
            if (path) {
                imagePaths.push(path);
            } else {
                console.warn(`⚠️  Could not extract path from URL: ${url.substring(0, 50)}...`);
            }
        }

        if (imagePaths.length === 0) {
            console.warn(`⚠️  No paths extracted for ${listingId}`);
            errorCount++;
            continue;
        }

        if (dryRun) {
            console.log(`📋 Would migrate ${listingId}:`);
            console.log(`   Images: ${data.images.length}`);
            console.log(`   Paths: ${imagePaths.join(', ')}`);
        } else {
            try {
                await doc.ref.update({ imagePaths });
                console.log(`✅ Migrated ${listingId}: ${imagePaths.length} paths`);
                migratedCount++;
            } catch (error) {
                console.error(`❌ Failed to migrate ${listingId}:`, error);
                errorCount++;
            }
        }
    }

    console.log(`\n📊 Summary:`);
    console.log(`   Total: ${snapshot.docs.length}`);
    console.log(`   Migrated: ${migratedCount}`);
    console.log(`   Skipped: ${skippedCount}`);
    console.log(`   Errors: ${errorCount}`);

    if (dryRun) {
        console.log(`\n💡 Run without --dry-run to apply changes`);
    }
}

// Main
const args = process.argv.slice(2);
const dryRun = args.includes('--dry-run');

migrateListings(dryRun)
    .then(() => {
        console.log('\n✅ Migration complete');
        process.exit(0);
    })
    .catch((error) => {
        console.error('\n❌ Migration failed:', error);
        process.exit(1);
    });

