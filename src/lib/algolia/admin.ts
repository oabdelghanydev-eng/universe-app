/**
 * Algolia Admin Client
 * Used by Server Actions to sync listings to Algolia
 * 
 * Note: Algolia v5 SDK uses a different API than v4
 * Operations are done via algoliaAdmin.saveObject(), searchSingleIndex(), etc.
 */

import 'server-only';

import { algoliasearch } from 'algoliasearch';

if (!process.env.NEXT_PUBLIC_ALGOLIA_APP_ID || !process.env.ALGOLIA_ADMIN_KEY) {
    throw new Error('Missing Algolia Admin credentials');
}

export const algoliaAdmin = algoliasearch(
    process.env.NEXT_PUBLIC_ALGOLIA_APP_ID,
    process.env.ALGOLIA_ADMIN_KEY
);

export const LISTINGS_INDEX = 'listings';

/**
 * Helper to save an object to Algolia
 */
export async function saveToAlgolia(objectID: string, data: Record<string, unknown>) {
    return algoliaAdmin.saveObject({
        indexName: LISTINGS_INDEX,
        body: { objectID, ...data },
    });
}

/**
 * Helper to delete an object from Algolia
 */
export async function deleteFromAlgolia(objectID: string) {
    return algoliaAdmin.deleteObject({
        indexName: LISTINGS_INDEX,
        objectID,
    });
}

/**
 * Helper to partially update an object in Algolia
 */
export async function updateInAlgolia(objectID: string, data: Record<string, unknown>) {
    return algoliaAdmin.partialUpdateObject({
        indexName: LISTINGS_INDEX,
        objectID,
        attributesToUpdate: data,
    });
}

export default algoliaAdmin;
