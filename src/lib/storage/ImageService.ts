// ImageService - Image upload and processing
/**
 * Image Service - Higher-level abstraction for listing images
 * 
 * Responsibilities:
 * - Transform listings with paths to listings with URLs
 * - Handle image upload/delete operations
 * - Provide caching layer for performance
 */

import 'server-only';

import { getStorageService, StorageService, UploadResult, StorageError } from './StorageService';
import type { Listing } from '@/types';

// ============================================
// Types
// ============================================

export interface ListingWithUrls extends Omit<Listing, 'images'> {
    images: string[]; // Now contains fresh signed URLs
}

export interface ImageUploadResult {
    success: true;
    path: string;
    url: string;
}

export interface ImageUploadError {
    success: false;
    error: string;
}

// ============================================
// Image Service Class
// ============================================

export class ImageService {
    private readonly storage: StorageService;

    constructor(storage?: StorageService) {
        this.storage = storage || getStorageService();
    }

    /**
     * Upload multiple images for a listing
     * Returns paths (for Firestore) and URLs (for immediate display)
     */
    async uploadImages(
        imageData: { base64: string; contentType: string }[],
        userId: string,
        listingId: string
    ): Promise<{ paths: string[]; urls: string[] } | { error: string }> {
        const paths: string[] = [];
        const urls: string[] = [];

        for (const { base64, contentType } of imageData) {
            const buffer = Buffer.from(base64, 'base64');
            const result = await this.storage.upload(buffer, contentType, userId, listingId);

            if ('code' in result) {
                // Rollback: delete already uploaded images
                if (paths.length > 0) {
                    await this.storage.deleteMany(paths);
                }
                return { error: result.message };
            }

            paths.push(result.path);
            urls.push(result.url);
        }

        return { paths, urls };
    }

    /**
     * Delete multiple images by their paths
     */
    async deleteImages(paths: string[]): Promise<boolean> {
        return this.storage.deleteMany(paths);
    }

    /**
     * Hydrate a listing with fresh signed URLs
     * Converts imagePaths to signed URLs
     */
    async hydrateListing<T extends { imagePaths: string[] }>(
        listing: T
    ): Promise<T & { images: string[] }> {
        if (!listing.imagePaths || listing.imagePaths.length === 0) {
            return { ...listing, images: [] };
        }

        const urlMap = await this.storage.getSignedUrls(listing.imagePaths);
        const images = listing.imagePaths
            .map(path => urlMap.get(path))
            .filter((url): url is string => url !== undefined);

        return { ...listing, images };
    }

    /**
     * Hydrate multiple listings with fresh signed URLs
     * Uses batch URL generation for efficiency
     */
    async hydrateListings<T extends { imagePaths: string[] }>(
        listings: T[]
    ): Promise<(T & { images: string[] })[]> {
        // Collect all unique paths
        const allPaths = new Set<string>();
        for (const listing of listings) {
            listing.imagePaths?.forEach(path => allPaths.add(path));
        }

        // Batch generate URLs
        const urlMap = await this.storage.getSignedUrls(Array.from(allPaths));

        // Hydrate each listing
        return listings.map(listing => {
            const images = (listing.imagePaths || [])
                .map(path => urlMap.get(path))
                .filter((url): url is string => url !== undefined);
            return { ...listing, images };
        });
    }

    /**
     * Get signed URL for a single path
     */
    async getSignedUrl(path: string): Promise<string | null> {
        return this.storage.getSignedUrl(path);
    }
}

// ============================================
// Singleton Instance
// ============================================

let imageServiceInstance: ImageService | null = null;

export function getImageService(): ImageService {
    if (!imageServiceInstance) {
        imageServiceInstance = new ImageService();
    }
    return imageServiceInstance;
}

export default getImageService;

