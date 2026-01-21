/**
 * Configure Algolia Index Settings
 * Sets up filterable attributes and searchable attributes
 * 
 * Usage: npx tsx scripts/algolia-configure.ts
 */

import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

import { algoliasearch } from 'algoliasearch';

async function main() {
    const appId = process.env.NEXT_PUBLIC_ALGOLIA_APP_ID;
    const adminKey = process.env.ALGOLIA_ADMIN_KEY;

    if (!appId || !adminKey) {
        throw new Error('Missing Algolia credentials');
    }

    const client = algoliasearch(appId, adminKey);
    const indexName = 'listings';

    console.log('⚙️  Configuring Algolia index settings...\n');

    await client.setSettings({
        indexName,
        indexSettings: {
            // Searchable attributes (what users can search)
            searchableAttributes: [
                'title',
                'description',
                'userName',
            ],
            // Attributes for filtering (used in queries)
            attributesForFaceting: [
                'filterOnly(isDeleted)',
                'filterOnly(isFlagged)',
                'filterOnly(type)',
                'filterOnly(userId)',
            ],
            // Custom ranking
            customRanking: [
                'desc(createdAt)',
            ],
            // Attributes to retrieve
            attributesToRetrieve: [
                'objectID',
                'title',
                'description',
                'type',
                'price',
                'imagePaths',
                'userName',
                'userId',
                'isDeleted',
                'isFlagged',
                'createdAt',
                'updatedAt',
            ],
        },
    });

    console.log('✅ Algolia index configured successfully!');
    console.log('\nSettings applied:');
    console.log('  - Searchable: title, description, userName');
    console.log('  - Filterable: isDeleted, isFlagged, type, userId');
    console.log('  - Ranking: by createdAt (newest first)');
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error('❌ Error:', error);
        process.exit(1);
    });
