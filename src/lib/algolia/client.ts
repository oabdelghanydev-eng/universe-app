// Algolia search client initialization
/**
 * Algolia Search Client
 * Used by client components for search functionality
 */

import { algoliasearch } from 'algoliasearch';

if (!process.env.NEXT_PUBLIC_ALGOLIA_APP_ID || !process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_KEY) {
    throw new Error('Missing Algolia Search credentials');
}

const algoliaClient = algoliasearch(
    process.env.NEXT_PUBLIC_ALGOLIA_APP_ID,
    process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_KEY
);

export const searchIndexName = 'listings';
export { algoliaClient };

export default algoliaClient;

