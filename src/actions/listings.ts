// Listings CRUD Server Actions
'use server';

import 'server-only';

/**
 * Listings Server Actions
 * Handles CRUD operations for listings
 */

import { adminDb } from '@/lib/firebase/admin';
import { getServerSession } from '@/lib/auth';
import { getImageService } from '@/lib/storage';
import { saveToAlgolia, updateInAlgolia } from '@/lib/algolia/admin';
import { validateListing } from '@/lib/validation';
import { FieldValue } from 'firebase-admin/firestore';
import type { ActionResult, ListingInput, Listing, AlgoliaListing } from '@/types';

// ============================================
// Create Listing
// ============================================

interface CreateListingResult {
    id: string;
}

export async function createListing(
    data: ListingInput,
    imageData: { base64: string; contentType: string }[]
): Promise<ActionResult<CreateListingResult>> {
    try {
        // Validate input
        const validation = validateListing(data);
        if (!validation.success) {
            const firstError = validation.error.issues[0];
            return {
                success: false,
                code: 'VAL_000',
                message: firstError?.message || 'بيانات غير صالحة'
            };
        }

        const session = await getServerSession();
        if (!session) {
            return {
                success: false,
                code: 'AUTH_001',
                message: 'يجب تسجيل الدخول أولاً'
            };
        }

        // Get user data
        const userDoc = await adminDb.collection('users').doc(session.uid).get();
        if (!userDoc.exists) {
            return {
                success: false,
                code: 'AUTH_002',
                message: 'المستخدم غير موجود'
            };
        }

        // Rate limiting: max 10 listings per 24 hours
        // SECURITY: Fail-closed - if we can't verify rate limit, reject the request
        try {
            const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
            const recentListingsSnapshot = await adminDb
                .collection('listings')
                .where('userId', '==', session.uid)
                .where('createdAt', '>', oneDayAgo)
                .count()
                .get();

            if (recentListingsSnapshot.data().count >= 10) {
                return {
                    success: false,
                    code: 'RATE_LIMIT',
                    message: 'تجاوزت الحد اليومي للإعلانات (10 إعلانات/يوم)'
                };
            }
        } catch (rateLimitError) {
            // FAIL-CLOSED: If rate limit check fails, reject the request
            // This prevents abuse if the index is unavailable
            console.error('Rate limit check failed:', rateLimitError);
            return {
                success: false,
                code: 'RATE_LIMIT_ERROR',
                message: 'تعذر التحقق من الحد اليومي، حاول مرة أخرى'
            };
        }

        const userData = userDoc.data()!;

        // Check if phone number is required (user has no saved phone)
        let phoneNumber = userData.phoneNumber;

        // Always require phone if user doesn't have one saved
        if (!phoneNumber) {
            if (!data.phoneNumber) {
                return {
                    success: false,
                    code: 'VAL_001',
                    message: 'رقم الهاتف مطلوب'
                };
            }
            phoneNumber = data.phoneNumber;
        }

        // Validate phone number format (validate the final phone number, regardless of source)
        if (phoneNumber && !/^01[0125][0-9]{8}$/.test(phoneNumber)) {
            return {
                success: false,
                code: 'VAL_002',
                message: 'رقم الهاتف غير صحيح'
            };
        }

        // Create listing document reference (to get ID for image paths)
        const listingRef = adminDb.collection('listings').doc();
        const listingId = listingRef.id;

        // Upload images using ImageService
        const imageService = getImageService();
        const uploadResult = await imageService.uploadImages(imageData, session.uid, listingId);

        if ('error' in uploadResult) {
            return {
                success: false,
                code: 'UPLOAD_001',
                message: 'فشل في رفع الصور'
            };
        }

        const { paths: imagePaths } = uploadResult;

        // Create listing document
        // NOTE: We only store imagePaths (permanent), not URLs (which expire)
        // URLs are generated on-demand via ImageService.hydrateListing()
        const now = FieldValue.serverTimestamp();
        const listingData = {
            userId: session.uid,
            type: data.type,
            title: data.title,
            description: data.description,
            price: data.price || null,
            imagePaths: imagePaths, // Permanent storage paths
            contactMethod: data.contactMethod,
            phoneNumber: phoneNumber,
            isDeleted: false,
            deletedAt: null,
            isFlagged: false,
            flaggedAt: null,
            needsAlgoliaSync: false,
            lastAlgoliaSyncAt: null,
            algoliaSyncError: null,
            createdAt: now,
            updatedAt: now,
        };

        // Batch write: create listing + update user phone if first listing
        const batch = adminDb.batch();

        batch.set(listingRef, listingData);

        if (data.phoneNumber && data.phoneNumber !== userData.phoneNumber) {
            batch.update(adminDb.collection('users').doc(session.uid), {
                phoneNumber: data.phoneNumber,
            });
        }

        await batch.commit();

        // Sync to Algolia
        // NOTE: Store imagePaths (permanent), not URLs (which expire)
        try {
            const algoliaObject: AlgoliaListing = {
                objectID: listingId,
                title: data.title,
                description: data.description,
                type: data.type,
                price: data.price || null,
                imagePaths: imagePaths, // Permanent paths, not expiring URLs
                userId: session.uid,
                userName: userData.fullName,
                isDeleted: false,
                isFlagged: false,
                createdAt: Date.now(),
                updatedAt: Date.now(),
            };

            await saveToAlgolia(listingId, algoliaObject as unknown as Record<string, unknown>);

            // Update sync status
            await listingRef.update({
                lastAlgoliaSyncAt: FieldValue.serverTimestamp(),
            });
        } catch (algoliaError) {
            console.error('Algolia sync error:', algoliaError);
            // Mark for retry
            await listingRef.update({
                needsAlgoliaSync: true,
                algoliaSyncError: algoliaError instanceof Error ? algoliaError.message : 'Unknown error',
            });
        }

        return {
            success: true,
            data: { id: listingId }
        };
    } catch (error) {
        console.error('createListing error:', {
            name: error instanceof Error ? error.name : 'Unknown',
            message: error instanceof Error ? error.message : String(error),
            stack: error instanceof Error ? error.stack : undefined,
        });
        return {
            success: false,
            code: 'NET_001',
            message: 'حدث خطأ في إنشاء الإعلان'
        };
    }
}

// ============================================
// Get Listing (by ID)
// ============================================

export async function getListing(listingId: string): Promise<ActionResult<Listing>> {
    try {
        const session = await getServerSession();

        const listingDoc = await adminDb.collection('listings').doc(listingId).get();

        if (!listingDoc.exists) {
            return {
                success: false,
                code: 'NOT_FOUND',
                message: 'الإعلان غير موجود'
            };
        }

        const data = listingDoc.data()!;

        // Check visibility rules
        const isOwner = session?.uid === data.userId;
        const isVisible = !data.isDeleted && !data.isFlagged;

        if (!isVisible && !isOwner) {
            return {
                success: false,
                code: 'NOT_FOUND',
                message: 'الإعلان غير موجود'
            };
        }

        // Build listing object with paths only (images will be hydrated)
        const listingWithPaths = {
            id: listingId,
            userId: data.userId,
            type: data.type,
            title: data.title,
            description: data.description,
            price: data.price,
            imagePaths: data.imagePaths || [],
            contactMethod: data.contactMethod,
            phoneNumber: data.phoneNumber,
            isDeleted: data.isDeleted,
            deletedAt: data.deletedAt?.toDate() || null,
            isFlagged: data.isFlagged,
            flaggedAt: data.flaggedAt?.toDate() || null,
            needsAlgoliaSync: data.needsAlgoliaSync,
            lastAlgoliaSyncAt: data.lastAlgoliaSyncAt?.toDate() || null,
            algoliaSyncError: data.algoliaSyncError,
            createdAt: data.createdAt?.toDate(),
            updatedAt: data.updatedAt?.toDate(),
        };

        // Hydrate with fresh signed URLs
        const imageService = getImageService();
        const listing = await imageService.hydrateListing(listingWithPaths) as Listing;

        return { success: true, data: listing };
    } catch (error) {
        console.error('getListing error:', error);
        return {
            success: false,
            code: 'NET_001',
            message: 'حدث خطأ في جلب الإعلان'
        };
    }
}

// ============================================
// Update Listing
// ============================================

export async function updateListing(
    listingId: string,
    data: Partial<ListingInput>,
    newImageData?: { base64: string; contentType: string }[],
    removedImagePaths?: string[]
): Promise<ActionResult> {
    try {
        const session = await getServerSession();
        if (!session) {
            return {
                success: false,
                code: 'AUTH_001',
                message: 'يجب تسجيل الدخول أولاً'
            };
        }

        // Get listing
        const listingRef = adminDb.collection('listings').doc(listingId);
        const listingDoc = await listingRef.get();

        if (!listingDoc.exists) {
            return {
                success: false,
                code: 'NOT_FOUND',
                message: 'الإعلان غير موجود'
            };
        }

        const listingData = listingDoc.data()!;

        // Check ownership
        if (listingData.userId !== session.uid) {
            return {
                success: false,
                code: 'FORBIDDEN',
                message: 'لا يمكنك تعديل هذا الإعلان'
            };
        }

        // Get user data for Algolia
        const userDoc = await adminDb.collection('users').doc(session.uid).get();
        const userData = userDoc.data()!;

        // Get image service
        const imageService = getImageService();

        // Handle image removals
        if (removedImagePaths && removedImagePaths.length > 0) {
            await imageService.deleteImages(removedImagePaths);
        }

        // Handle new image uploads (only track paths, not URLs)
        let uploadedPaths: string[] = [];

        if (newImageData && newImageData.length > 0) {
            const uploadResult = await imageService.uploadImages(newImageData, session.uid, listingId);

            if ('error' in uploadResult) {
                return {
                    success: false,
                    code: 'UPLOAD_001',
                    message: 'فشل في رفع الصور الجديدة'
                };
            }

            uploadedPaths = uploadResult.paths;
        }

        // Calculate final paths (only paths matter, URLs are generated on-demand)
        const currentPaths = listingData.imagePaths || [];
        const keptPaths = currentPaths.filter(
            (path: string) => !removedImagePaths?.includes(path)
        );
        const finalPaths = [...keptPaths, ...uploadedPaths];

        // Update listing (only store paths, not URLs)
        const updateData: Record<string, unknown> = {
            ...(data.type && { type: data.type }),
            ...(data.title && { title: data.title }),
            ...(data.description && { description: data.description }),
            ...(data.price !== undefined && { price: data.price || null }),
            ...(data.contactMethod && { contactMethod: data.contactMethod }),
            imagePaths: finalPaths,
            updatedAt: FieldValue.serverTimestamp(),
        };

        await listingRef.update(updateData);

        // Sync to Algolia (store paths, not URLs)
        try {
            const algoliaObject: Partial<AlgoliaListing> = {
                objectID: listingId,
                ...(data.title && { title: data.title }),
                ...(data.description && { description: data.description }),
                ...(data.type && { type: data.type }),
                ...(data.price !== undefined && { price: data.price || null }),
                imagePaths: finalPaths,
                userName: userData.fullName,
                updatedAt: Date.now(),
            };

            await updateInAlgolia(listingId, algoliaObject);

            await listingRef.update({
                lastAlgoliaSyncAt: FieldValue.serverTimestamp(),
                needsAlgoliaSync: false,
                algoliaSyncError: null,
            });
        } catch (algoliaError) {
            console.error('Algolia sync error:', algoliaError);
            await listingRef.update({
                needsAlgoliaSync: true,
                algoliaSyncError: algoliaError instanceof Error ? algoliaError.message : 'Unknown error',
            });
        }

        return { success: true };
    } catch (error) {
        console.error('updateListing error:', error);
        return {
            success: false,
            code: 'NET_001',
            message: 'حدث خطأ في تحديث الإعلان'
        };
    }
}

// ============================================
// Delete Listing (Soft Delete)
// ============================================

export async function deleteListing(listingId: string): Promise<ActionResult> {
    try {
        const session = await getServerSession();
        if (!session) {
            return {
                success: false,
                code: 'AUTH_001',
                message: 'يجب تسجيل الدخول أولاً'
            };
        }

        const listingRef = adminDb.collection('listings').doc(listingId);
        const listingDoc = await listingRef.get();

        if (!listingDoc.exists) {
            return {
                success: false,
                code: 'NOT_FOUND',
                message: 'الإعلان غير موجود'
            };
        }

        const listingData = listingDoc.data()!;

        // Check ownership
        if (listingData.userId !== session.uid) {
            return {
                success: false,
                code: 'FORBIDDEN',
                message: 'لا يمكنك حذف هذا الإعلان'
            };
        }

        // Soft delete
        await listingRef.update({
            isDeleted: true,
            deletedAt: FieldValue.serverTimestamp(),
            updatedAt: FieldValue.serverTimestamp(),
        });

        // Update Algolia
        try {
            await updateInAlgolia(listingId, { isDeleted: true });
        } catch (algoliaError) {
            console.error('Algolia delete sync error:', algoliaError);
            // Non-critical - listing is still soft-deleted in Firestore
        }

        return { success: true };
    } catch (error) {
        console.error('deleteListing error:', error);
        return {
            success: false,
            code: 'NET_001',
            message: 'حدث خطأ في حذف الإعلان'
        };
    }
}

// ============================================
// Get User Listings
// ============================================

export async function getUserListings(): Promise<ActionResult<Listing[]>> {
    try {
        const session = await getServerSession();
        if (!session) {
            return {
                success: false,
                code: 'AUTH_001',
                message: 'يجب تسجيل الدخول أولاً'
            };
        }

        const snapshot = await adminDb
            .collection('listings')
            .where('userId', '==', session.uid)
            .orderBy('createdAt', 'desc')
            .get();

        // Build listings with paths only (images will be hydrated)
        const listingsWithPaths = snapshot.docs.map(doc => {
            const data = doc.data();
            return {
                id: doc.id,
                userId: data.userId,
                type: data.type,
                title: data.title,
                description: data.description,
                price: data.price,
                imagePaths: data.imagePaths || [],
                contactMethod: data.contactMethod,
                phoneNumber: data.phoneNumber,
                isDeleted: data.isDeleted,
                deletedAt: data.deletedAt?.toDate() || null,
                isFlagged: data.isFlagged,
                flaggedAt: data.flaggedAt?.toDate() || null,
                needsAlgoliaSync: data.needsAlgoliaSync,
                lastAlgoliaSyncAt: data.lastAlgoliaSyncAt?.toDate() || null,
                algoliaSyncError: data.algoliaSyncError,
                createdAt: data.createdAt?.toDate(),
                updatedAt: data.updatedAt?.toDate(),
            };
        });

        // Batch hydrate with fresh signed URLs (efficient)
        const imageService = getImageService();
        const listings = await imageService.hydrateListings(listingsWithPaths) as Listing[];

        return { success: true, data: listings };
    } catch (error) {
        console.error('getUserListings error:', error);
        return {
            success: false,
            code: 'NET_001',
            message: 'حدث خطأ في جلب الإعلانات'
        };
    }
}

