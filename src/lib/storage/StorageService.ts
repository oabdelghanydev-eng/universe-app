// StorageService - Abstract storage operations
/**
 * Storage Service - OOP Architecture for Supabase Storage
 * 
 * Principles:
 * - Single Responsibility: Each class has one job
 * - Open/Closed: Extensible without modifying existing code
 * - Dependency Inversion: Depend on abstractions
 * 
 * Key Design Decision:
 * - Store only `imagePaths` (permanent) in Firestore
 * - Generate signed URLs on-demand with caching
 * - URLs cached for 1 hour, regenerated automatically
 */

import 'server-only';

import { createClient, SupabaseClient } from '@supabase/supabase-js';

// ============================================
// Types & Interfaces
// ============================================

export interface StorageConfig {
    url: string;
    serviceKey: string;
    bucket: string;
    signedUrlTTL: number; // seconds
    cacheTTL: number; // milliseconds
}

export interface UploadResult {
    path: string;
    url: string;
}

export interface StorageError {
    code: string;
    message: string;
}

// ============================================
// URL Cache (In-Memory with TTL)
// ============================================

interface CacheEntry {
    url: string;
    expiresAt: number;
}

class SignedUrlCache {
    private cache: Map<string, CacheEntry> = new Map();
    private readonly ttlMs: number;

    constructor(ttlMs: number = 60 * 60 * 1000) { // Default 1 hour
        this.ttlMs = ttlMs;
    }

    get(path: string): string | null {
        const entry = this.cache.get(path);
        if (!entry) return null;

        if (Date.now() > entry.expiresAt) {
            this.cache.delete(path);
            return null;
        }

        return entry.url;
    }

    set(path: string, url: string): void {
        this.cache.set(path, {
            url,
            expiresAt: Date.now() + this.ttlMs,
        });
    }

    invalidate(path: string): void {
        this.cache.delete(path);
    }

    clear(): void {
        this.cache.clear();
    }

    get size(): number {
        return this.cache.size;
    }
}

// ============================================
// Storage Service (Main Class)
// ============================================

export class StorageService {
    private readonly client: SupabaseClient;
    private readonly bucket: string;
    private readonly signedUrlTTL: number;
    private readonly urlCache: SignedUrlCache;

    constructor(config: StorageConfig) {
        this.client = createClient(config.url, config.serviceKey);
        this.bucket = config.bucket;
        this.signedUrlTTL = config.signedUrlTTL;
        this.urlCache = new SignedUrlCache(config.cacheTTL);
    }

    /**
     * Generate a unique storage path
     */
    generatePath(userId: string, listingId: string): string {
        const randomId = crypto.randomUUID();
        return `${userId}/${listingId}/${randomId}.webp`;
    }

    /**
     * Upload a file and return the path (NOT the URL)
     * URLs are generated on-demand via getSignedUrl()
     */
    async upload(
        buffer: Buffer,
        contentType: string,
        userId: string,
        listingId: string
    ): Promise<UploadResult | StorageError> {
        const path = this.generatePath(userId, listingId);

        const { error } = await this.client.storage
            .from(this.bucket)
            .upload(path, buffer, {
                cacheControl: '31536000', // 1 year (browser cache)
                upsert: false,
                contentType,
            });

        if (error) {
            console.error('[StorageService] Upload error:', error);
            return { code: 'UPLOAD_FAILED', message: error.message };
        }

        // Generate initial signed URL for immediate use
        const url = await this.getSignedUrl(path);
        if (!url) {
            return { code: 'URL_GENERATION_FAILED', message: 'Failed to generate signed URL' };
        }

        return { path, url };
    }

    /**
     * Get a signed URL for a path (with caching)
     */
    async getSignedUrl(path: string): Promise<string | null> {
        // Check cache first
        const cached = this.urlCache.get(path);
        if (cached) return cached;

        // Generate new signed URL
        const { data, error } = await this.client.storage
            .from(this.bucket)
            .createSignedUrl(path, this.signedUrlTTL);

        if (error || !data?.signedUrl) {
            console.error('[StorageService] Signed URL error:', error);
            return null;
        }

        // Cache the URL
        this.urlCache.set(path, data.signedUrl);
        return data.signedUrl;
    }

    /**
     * Get signed URLs for multiple paths (batch with caching)
     */
    async getSignedUrls(paths: string[]): Promise<Map<string, string>> {
        const result = new Map<string, string>();
        const uncachedPaths: string[] = [];

        // Check cache for each path
        for (const path of paths) {
            const cached = this.urlCache.get(path);
            if (cached) {
                result.set(path, cached);
            } else {
                uncachedPaths.push(path);
            }
        }

        // Batch generate URLs for uncached paths
        if (uncachedPaths.length > 0) {
            const { data, error } = await this.client.storage
                .from(this.bucket)
                .createSignedUrls(uncachedPaths, this.signedUrlTTL);

            if (!error && data) {
                for (const item of data) {
                    if (item.signedUrl && item.path) {
                        result.set(item.path, item.signedUrl);
                        this.urlCache.set(item.path, item.signedUrl);
                    }
                }
            }
        }

        return result;
    }

    /**
     * Delete a single file
     */
    async delete(path: string): Promise<boolean> {
        const { error } = await this.client.storage
            .from(this.bucket)
            .remove([path]);

        if (error) {
            console.error('[StorageService] Delete error:', error);
            return false;
        }

        this.urlCache.invalidate(path);
        return true;
    }

    /**
     * Delete multiple files
     */
    async deleteMany(paths: string[]): Promise<boolean> {
        if (paths.length === 0) return true;

        const { error } = await this.client.storage
            .from(this.bucket)
            .remove(paths);

        if (error) {
            console.error('[StorageService] Bulk delete error:', error);
            return false;
        }

        paths.forEach(path => this.urlCache.invalidate(path));
        return true;
    }

    /**
     * Get cache statistics (for monitoring)
     */
    getCacheStats(): { size: number } {
        return { size: this.urlCache.size };
    }
}

// ============================================
// Singleton Instance (Module-level)
// ============================================

let storageServiceInstance: StorageService | null = null;

export function getStorageService(): StorageService {
    if (!storageServiceInstance) {
        if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
            throw new Error('Missing Supabase configuration');
        }

        storageServiceInstance = new StorageService({
            url: process.env.NEXT_PUBLIC_SUPABASE_URL,
            serviceKey: process.env.SUPABASE_SERVICE_ROLE_KEY,
            bucket: 'listings',
            signedUrlTTL: 60 * 60 * 24 * 7, // 7 days (Supabase-side)
            cacheTTL: 60 * 60 * 1000, // 1 hour (in-memory cache)
        });
    }

    return storageServiceInstance;
}

// ============================================
// Default Export for convenience
// ============================================

export default getStorageService;

