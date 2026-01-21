/**
 * API Route: Hydrate Image Paths to Signed URLs
 * 
 * Used by client components to get fresh signed URLs for Algolia results.
 * This is needed because Algolia stores paths (permanent), not URLs.
 * 
 * POST /api/images/hydrate
 * Body: { paths: string[] }
 * Response: { urls: Record<string, string> }
 */

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from '@/lib/auth';
import { getStorageService } from '@/lib/storage';

export async function POST(request: NextRequest) {
    try {
        // Require authentication
        const session = await getServerSession();
        if (!session) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        // Parse request body
        const body = await request.json();
        const paths: string[] = body.paths;

        if (!Array.isArray(paths) || paths.length === 0) {
            return NextResponse.json(
                { error: 'Invalid paths array' },
                { status: 400 }
            );
        }

        // Limit to prevent abuse
        if (paths.length > 50) {
            return NextResponse.json(
                { error: 'Too many paths (max 50)' },
                { status: 400 }
            );
        }

        // Generate signed URLs using StorageService
        const storageService = getStorageService();
        const urlMap = await storageService.getSignedUrls(paths);

        // Build response map
        const urls: Record<string, string> = {};
        urlMap.forEach((url: string, path: string) => {
            urls[path] = url;
        });

        return NextResponse.json({ urls });
    } catch (error) {
        console.error('[API] Image hydration error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

