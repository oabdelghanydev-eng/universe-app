// Cleanup Script - Remove soft-deleted listings
/**
 * cleanup-deleted-listings.ts
 * 
 * Hard delete listings that have been soft-deleted for more than N days.
 * Also removes associated images from Firebase Storage.
 * 
 * Source of Truth: Firestore (queries deleted listings, then cleans Storage)
 * 
 * Usage:
 *   npx ts-node scripts/cleanup-deleted-listings.ts --dry-run
 *   npx ts-node scripts/cleanup-deleted-listings.ts
 *   npx ts-node scripts/cleanup-deleted-listings.ts --days=60
 */

import * as fs from 'fs';
import * as path from 'path';
import * as admin from 'firebase-admin';

// Initialize Firebase Admin
const serviceAccount = JSON.parse(
    process.env.FIREBASE_SERVICE_ACCOUNT_KEY ||
    fs.readFileSync(path.join(__dirname, '../serviceAccountKey.json'), 'utf8')
);

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET || `${serviceAccount.project_id}.appspot.com`,
});

const db = admin.firestore();
const bucket = admin.storage().bucket();

interface CleanupResult {
    listingsFound: number;
    listingsDeleted: number;
    imagesDeleted: number;
    errors: string[];
}

function parseArgs(): { dryRun: boolean; retentionDays: number } {
    const args = process.argv.slice(2);

    let dryRun = false;
    let retentionDays = 30;

    for (const arg of args) {
        if (arg === '--dry-run') {
            dryRun = true;
        } else if (arg.startsWith('--days=')) {
            retentionDays = parseInt(arg.split('=')[1], 10);
            if (isNaN(retentionDays) || retentionDays < 1) {
                console.error('Error: --days must be a positive integer');
                process.exit(1);
            }
        } else if (arg === '--help') {
            console.log(`
Usage: npx ts-node scripts/cleanup-deleted-listings.ts [options]

Options:
  --dry-run     Show what would be deleted without making changes
  --days=N      Retention period in days (default: 30)
  --help        Show this help message

Algorithm:
  1. Query Firestore for listings where isDeleted=true AND deletedAt < (now - N days)
  2. For each listing:
     a. Delete all images from Storage path: listings/{userId}/{listingId}/*
     b. Hard delete the Firestore document
  3. Log results
`);
            process.exit(0);
        }
    }

    return { dryRun, retentionDays };
}

async function deleteStorageFolder(userId: string, listingId: string, dryRun: boolean): Promise<number> {
    const prefix = `listings/${userId}/${listingId}/`;

    try {
        const [files] = await bucket.getFiles({ prefix });

        if (files.length === 0) {
            return 0;
        }

        if (!dryRun) {
            await Promise.all(files.map(file => file.delete()));
        }

        return files.length;
    } catch (error) {
        console.error(`  ⚠️  Error deleting images for ${listingId}:`, error);
        return 0;
    }
}

async function cleanupDeletedListings(dryRun: boolean, retentionDays: number): Promise<CleanupResult> {
    const result: CleanupResult = {
        listingsFound: 0,
        listingsDeleted: 0,
        imagesDeleted: 0,
        errors: [],
    };

    // Calculate cutoff date
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - retentionDays);
    const cutoffTimestamp = admin.firestore.Timestamp.fromDate(cutoffDate);

    console.log(`📅 Cutoff date: ${cutoffDate.toISOString()}`);
    console.log(`   (Listings deleted before this date will be removed)\n`);

    // Query deleted listings past retention
    const query = db.collection('listings')
        .where('isDeleted', '==', true)
        .where('deletedAt', '<', cutoffTimestamp)
        .orderBy('deletedAt', 'asc');

    const snapshot = await query.get();
    result.listingsFound = snapshot.size;

    if (snapshot.empty) {
        console.log('✅ No listings found past retention period');
        return result;
    }

    console.log(`📊 Found ${snapshot.size} listings to clean up\n`);

    for (const doc of snapshot.docs) {
        const data = doc.data();
        const listingId = doc.id;
        const userId = data.userId;
        const deletedAt = data.deletedAt?.toDate?.() || 'unknown';

        console.log(`Processing: ${listingId}`);
        console.log(`  User: ${userId}`);
        console.log(`  Deleted at: ${deletedAt}`);
        console.log(`  Title: ${data.title || 'N/A'}`);

        // Delete storage images
        const imagesDeleted = await deleteStorageFolder(userId, listingId, dryRun);
        result.imagesDeleted += imagesDeleted;
        console.log(`  Images: ${imagesDeleted} ${dryRun ? '(would be deleted)' : 'deleted'}`);

        // Delete Firestore document
        if (!dryRun) {
            try {
                await doc.ref.delete();
                result.listingsDeleted++;
                console.log(`  ✅ Document deleted`);
            } catch (error) {
                result.errors.push(`Failed to delete ${listingId}: ${error}`);
                console.log(`  ❌ Failed to delete document: ${error}`);
            }
        } else {
            result.listingsDeleted++;
            console.log(`  📝 Would delete document`);
        }

        console.log('');
    }

    return result;
}

async function main() {
    const { dryRun, retentionDays } = parseArgs();

    console.log(`\n${'='.repeat(60)}`);
    console.log(`🗑️  Cleanup Deleted Listings Script`);
    console.log(`${'='.repeat(60)}`);
    console.log(`🔧 Mode: ${dryRun ? 'DRY RUN (no changes)' : 'LIVE CLEANUP'}`);
    console.log(`📆 Retention: ${retentionDays} days\n`);

    try {
        const result = await cleanupDeletedListings(dryRun, retentionDays);

        console.log(`${'='.repeat(60)}`);
        console.log(`📊 Cleanup Summary:`);
        console.log(`   Listings found: ${result.listingsFound}`);
        console.log(`   Listings deleted: ${result.listingsDeleted}`);
        console.log(`   Images deleted: ${result.imagesDeleted}`);

        if (result.errors.length > 0) {
            console.log(`\n⚠️  Errors (${result.errors.length}):`);
            result.errors.forEach(e => console.log(`   - ${e}`));
        }

        if (dryRun) {
            console.log(`\n⚠️  DRY RUN - No changes were made`);
            console.log(`   Run without --dry-run to delete permanently`);
        } else {
            console.log(`\n✅ Cleanup completed successfully`);
        }

    } catch (error) {
        console.error('\n❌ Error:', error);
        process.exit(1);
    }

    process.exit(0);
}

main();

