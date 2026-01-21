/**
 * Type definitions for UniVerse application
 */

// ============================================
// User Types
// ============================================

export interface User {
    uid: string;
    fullName: string;
    academicId: string;
    email: string;
    photoURL: string | null;
    phoneNumber: string | null;
    createdAt: Date;
    isVerified: boolean;
}

export interface Student {
    academicId: string;
    fullName: string;
    isRegistered: boolean;
    registeredAt: Date | null;
}

// ============================================
// Listing Types
// ============================================

export type ListingType = 'product' | 'service';
export type ContactMethod = 'whatsapp' | 'call';

export interface Listing {
    id: string;
    userId: string;
    type: ListingType;
    title: string;
    description: string;
    price: number | null;
    // NOTE: `images` is computed at runtime from `imagePaths` via ImageService
    // Not stored in Firestore - prevents URL expiration issues
    images: string[];
    // Source of truth - permanent Supabase storage paths
    imagePaths: string[];
    contactMethod: ContactMethod;
    phoneNumber: string;
    isDeleted: boolean;
    deletedAt: Date | null;
    isFlagged: boolean;
    flaggedAt: Date | null;
    needsAlgoliaSync: boolean;
    lastAlgoliaSyncAt: Date | null;
    algoliaSyncError: string | null;
    createdAt: Date;
    updatedAt: Date;
}

export interface ListingInput {
    type: ListingType;
    title: string;
    description: string;
    price?: number;
    images: string[];
    imagePaths?: string[]; // For edit: current paths to preserve
    contactMethod: ContactMethod;
    phoneNumber?: string; // Required on first listing only
}

// ============================================
// Report Types
// ============================================

export type ReportReason =
    | 'inappropriate_content'
    | 'fraud'
    | 'spam'
    | 'other';

export type ReportStatus = 'pending' | 'reviewed' | 'resolved';

export interface Report {
    id: string;
    listingId: string;
    reportedBy: string;
    reason: ReportReason;
    details: string;
    status: ReportStatus;
    createdAt: Date;
}

// ============================================
// API Response Types
// ============================================

export type ActionResult<T = void> =
    | { success: true; data?: T }
    | { success: false; code: string; message: string };

// ============================================
// Algolia Types
// ============================================

export interface AlgoliaListing {
    objectID: string;
    title: string;
    description: string;
    type: ListingType;
    price: number | null;
    imagePaths: string[]; // Store paths, not URLs (URLs expire)
    userId: string;
    userName: string;
    isDeleted: boolean;
    isFlagged: boolean;
    createdAt: number;
    updatedAt: number;
}
