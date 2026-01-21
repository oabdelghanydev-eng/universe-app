/**
 * Supabase Storage - Server-side Admin Client
 * Uses service_role key to bypass RLS (for Server Actions)
 * 
 * IMPORTANT: Only import this in Server Actions
 */

import 'server-only';

import { createClient } from '@supabase/supabase-js';

// Admin client with service role key (bypasses RLS)
export const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export const STORAGE_BUCKET = 'listings';

/**
 * Generate a unique image path
 * Format: {userId}/{listingId}/{randomId}.webp
 */
export function generateImagePath(
    userId: string,
    listingId: string
): string {
    const randomId = crypto.randomUUID();
    return `${userId}/${listingId}/${randomId}.webp`;
}

/**
 * Upload an image to Supabase Storage (server-side)
 * Uses service_role to bypass RLS
 */
export async function uploadImageAdmin(
    fileBuffer: Buffer,
    contentType: string,
    userId: string,
    listingId: string
): Promise<{ url: string; path: string } | { error: string }> {
    try {
        const path = generateImagePath(userId, listingId);

        const { data, error } = await supabaseAdmin.storage
            .from(STORAGE_BUCKET)
            .upload(path, fileBuffer, {
                cacheControl: '31536000', // 1 year (images don't change)
                upsert: false,
                contentType: contentType,
            });

        if (error) {
            console.error('Upload error:', error);
            return { error: error.message };
        }

        // Get public URL (bucket is private, use signed URL)
        const { data: urlData } = await supabaseAdmin.storage
            .from(STORAGE_BUCKET)
            .createSignedUrl(path, 60 * 60 * 24 * 365); // 1 year

        if (!urlData?.signedUrl) {
            return { error: 'Failed to get signed URL' };
        }

        return {
            url: urlData.signedUrl,
            path: data.path
        };
    } catch (error) {
        console.error('Upload exception:', error);
        return { error: 'Upload failed' };
    }
}

/**
 * Delete an image from Supabase Storage (server-side)
 */
export async function deleteImageAdmin(path: string): Promise<{ success: boolean; error?: string }> {
    try {
        const { error } = await supabaseAdmin.storage
            .from(STORAGE_BUCKET)
            .remove([path]);

        if (error) {
            console.error('Delete error:', error);
            return { success: false, error: error.message };
        }

        return { success: true };
    } catch (error) {
        console.error('Delete exception:', error);
        return { success: false, error: 'Delete failed' };
    }
}

/**
 * Delete multiple images at once
 */
export async function deleteImagesAdmin(paths: string[]): Promise<{ success: boolean; error?: string }> {
    if (paths.length === 0) return { success: true };

    try {
        const { error } = await supabaseAdmin.storage
            .from(STORAGE_BUCKET)
            .remove(paths);

        if (error) {
            console.error('Bulk delete error:', error);
            return { success: false, error: error.message };
        }

        return { success: true };
    } catch (error) {
        console.error('Bulk delete exception:', error);
        return { success: false, error: 'Bulk delete failed' };
    }
}

/**
 * Get a signed URL for an image (valid for 1 year)
 */
export async function getSignedUrlAdmin(path: string): Promise<string | null> {
    const { data } = await supabaseAdmin.storage
        .from(STORAGE_BUCKET)
        .createSignedUrl(path, 60 * 60 * 24 * 365); // 1 year

    return data?.signedUrl || null;
}

/**
 * Refresh signed URLs for multiple images
 */
export async function refreshSignedUrls(paths: string[]): Promise<Map<string, string>> {
    const urlMap = new Map<string, string>();

    const results = await Promise.all(
        paths.map(async (path) => {
            const url = await getSignedUrlAdmin(path);
            return { path, url };
        })
    );

    results.forEach(({ path, url }) => {
        if (url) urlMap.set(path, url);
    });

    return urlMap;
}
