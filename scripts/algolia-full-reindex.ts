// Algolia Full Reindex Script
/**
 * Algolia Full Re-Index Script
 * Re-indexes ALL active listings from Firestore to Algolia
 * 
 * Usage: npx tsx scripts/algolia-full-reindex.ts
 * Run from project root directory!
 */

import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { algoliasearch } from 'algoliasearch';
import * as fs from 'fs';
import * as path from 'path';

// ============================================
// Initialize Firebase Admin (standalone)
// ============================================

function getAdminDb() {
    if (getApps().length === 0) {
        const credPath = process.env.GOOGLE_APPLICATION_CREDENTIALS;
        if (!credPath) {
            throw new Error('GOOGLE_APPLICATION_CREDENTIALS not set');
        }

        const fullPath = path.resolve(process.cwd(), credPath);
        const serviceAccount = JSON.parse(fs.readFileSync(fullPath, 'utf-8'));

        initializeApp({
            credential: cert(serviceAccount),
        });
    }
    return getFirestore();
}

// ============================================
// Initialize Algolia (standalone)
// ============================================

function getAlgoliaClient() {
    const appId = process.env.NEXT_PUBLIC_ALGOLIA_APP_ID;
    const adminKey = process.env.ALGOLIA_ADMIN_KEY;

    if (!appId || !adminKey) {
        throw new Error('Missing Algolia credentials');
    }

    return algoliasearch(appId, adminKey);
}

// ============================================
// Main Script
// ============================================

async function main() {
    console.log('🔄 Starting full Algolia re-index...\n');

    const db = getAdminDb();
    const algolia = getAlgoliaClient();
    const indexName = 'listings';

    // Get ALL active listings
    const listingsSnapshot = await db
        .collection('listings')
        .where('isDeleted', '==', false)
        .get();

    console.log(`📊 Found ${listingsSnapshot.size} active listings\n`);

    if (listingsSnapshot.size === 0) {
        console.log('ℹ️  No active listings to index.');
        return;
    }

    let successCount = 0;
    let errorCount = 0;

    for (const doc of listingsSnapshot.docs) {
        const data = doc.data();

        try {
            // Get user info for the listing
            const userDoc = await db.collection('users').doc(data.userId).get();
            const userData = userDoc.exists ? userDoc.data() : null;

            const algoliaObject = {
                objectID: doc.id,
                title: data.title || '',
                description: data.description || '',
                type: data.type || 'product',
                price: data.price || null,
                imagePaths: data.imagePaths || [],
                userId: data.userId,
                userName: userData?.fullName || 'Unknown',
                isDeleted: false,
                isFlagged: data.isFlagged || false,
                createdAt: data.createdAt?.toMillis?.() || Date.now(),
                updatedAt: data.updatedAt?.toMillis?.() || Date.now(),
            };

            await algolia.saveObject({
                indexName,
                body: algoliaObject,
            });

            console.log(`  ✅ ${doc.id}: ${data.title}`);
            successCount++;
        } catch (error) {
            console.error(`  ❌ ${doc.id}: ${error instanceof Error ? error.message : 'Unknown error'}`);
            errorCount++;
        }
    }

    console.log('\n' + '='.repeat(50));
    console.log(`📈 Results:`);
    console.log(`   ✅ Success: ${successCount}`);
    console.log(`   ❌ Errors: ${errorCount}`);
    console.log('='.repeat(50));
}

main()
    .then(() => {
        console.log('\n✅ Full re-index completed!');
        process.exit(0);
    })
    .catch((error) => {
        console.error('\n❌ Script failed:', error);
        process.exit(1);
    });

