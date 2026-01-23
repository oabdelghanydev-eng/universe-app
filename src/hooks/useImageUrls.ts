// useImageUrls hook - Image URL resolution and caching
/**
 * useImageUrls Hook
 * 
 * Hydrates imagePaths to signed URLs for client components.
 * Uses batching and caching for efficiency.
 */

'use client';

import { useState, useEffect, useCallback } from 'react';

// Client-side cache for URLs
const urlCache = new Map<string, { url: string; expiresAt: number }>();
const CACHE_TTL = 30 * 60 * 1000; // 30 minutes

// Batch pending requests - scoped per batch window to avoid race conditions
interface PendingBatch {
    paths: string[];
    callbacks: ((urls: Record<string, string>) => void)[];
    timeout: NodeJS.Timeout | null;
}

let currentBatch: PendingBatch | null = null;

async function executeBatch(batch: PendingBatch): Promise<void> {
    const paths = [...new Set(batch.paths)];

    if (paths.length === 0) {
        batch.callbacks.forEach(cb => cb({}));
        return;
    }

    try {
        const response = await fetch('/api/images/hydrate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ paths }),
        });

        if (!response.ok) {
            throw new Error('Failed to hydrate images');
        }

        const data = await response.json();
        const urls = data.urls as Record<string, string>;

        // Cache the results
        const now = Date.now();
        for (const [path, url] of Object.entries(urls)) {
            urlCache.set(path, { url, expiresAt: now + CACHE_TTL });
        }

        // Notify only THIS batch's callbacks (scoped, no race condition)
        batch.callbacks.forEach(cb => cb(urls));
    } catch (error) {
        console.error('Image hydration error:', error);
        batch.callbacks.forEach(cb => cb({}));
    }
}

function queueHydration(paths: string[]): Promise<Record<string, string>> {
    return new Promise(resolve => {
        // Check cache first
        const cached: Record<string, string> = {};
        const uncached: string[] = [];
        const now = Date.now();

        for (const path of paths) {
            const entry = urlCache.get(path);
            if (entry && entry.expiresAt > now) {
                cached[path] = entry.url;
            } else {
                uncached.push(path);
            }
        }

        // If all cached, return immediately
        if (uncached.length === 0) {
            resolve(cached);
            return;
        }

        // Create new batch if none exists
        if (!currentBatch) {
            currentBatch = {
                paths: [],
                callbacks: [],
                timeout: null,
            };
        }

        // Add to current batch
        currentBatch.paths.push(...uncached);
        const batchRef = currentBatch; // Capture reference for closure
        currentBatch.callbacks.push((urls) => {
            resolve({ ...cached, ...urls });
        });

        // Schedule batch execution (debounced)
        if (!currentBatch.timeout) {
            currentBatch.timeout = setTimeout(() => {
                const batchToExecute = currentBatch;
                currentBatch = null; // Allow new batch to form
                if (batchToExecute) {
                    executeBatch(batchToExecute);
                }
            }, 50);
        }
    });
}

/**
 * Hook to get signed URLs for imagePaths
 */
export function useImageUrls(imagePaths: string[]): {
    urls: string[];
    isLoading: boolean;
} {
    const [urls, setUrls] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // Memoize paths by content to avoid infinite loops
    const pathsKey = imagePaths.join('|');

    useEffect(() => {
        if (imagePaths.length === 0) {
            setUrls([]);
            setIsLoading(false);
            return;
        }

        setIsLoading(true);

        queueHydration(imagePaths).then((urlMap) => {
            const orderedUrls = imagePaths
                .map(path => urlMap[path])
                .filter((url): url is string => !!url);
            setUrls(orderedUrls);
            setIsLoading(false);
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pathsKey]); // Only depend on pathsKey, not imagePaths array

    return { urls, isLoading };
}

/**
 * Get a single image URL (for cards)
 */
export function useFirstImageUrl(imagePaths: string[]): {
    url: string | null;
    isLoading: boolean;
} {
    const { urls, isLoading } = useImageUrls(imagePaths.slice(0, 1));
    return { url: urls[0] ?? null, isLoading };
}

export default useImageUrls;

