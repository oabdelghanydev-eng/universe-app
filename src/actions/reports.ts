// Report submission Server Actions
'use server';

import 'server-only';

/**
 * Report Server Actions
 * Handles report submission and auto-flagging logic
 */

import { adminDb } from '@/lib/firebase/admin';
import { getServerSession } from '@/lib/auth';
import { validateReport } from '@/lib/validation';
import { FieldValue } from 'firebase-admin/firestore';
import { algoliasearch } from 'algoliasearch';
import type { ActionResult } from '@/types';

// ============================================
// Types
// ============================================

export interface ReportInput {
    listingId: string;
    reason: 'inappropriate_content' | 'fraud' | 'spam' | 'other';
    details?: string;
}

// Algolia admin client for removing flagged listings
const algoliaAdmin = algoliasearch(
    process.env.NEXT_PUBLIC_ALGOLIA_APP_ID!,
    process.env.ALGOLIA_ADMIN_KEY!
);

// ============================================
// Constants
// ============================================

const AUTO_FLAG_THRESHOLD = 3; // Flag listing after 3 unique reports
const REPORT_COOLDOWN_MS = 24 * 60 * 60 * 1000; // 1 report per listing per 24h per user

// ============================================
// Submit Report
// ============================================

export async function submitReport(
    data: ReportInput
): Promise<ActionResult<{ reportId: string }>> {
    try {
        // Validate input
        const validation = validateReport(data);
        if (!validation.success) {
            const firstError = validation.error.issues[0];
            return {
                success: false,
                code: 'VAL_000',
                message: firstError?.message || 'بيانات غير صالحة'
            };
        }

        // Require authentication
        const session = await getServerSession();
        if (!session) {
            return {
                success: false,
                code: 'AUTH_001',
                message: 'يجب تسجيل الدخول أولاً'
            };
        }

        // Verify listing exists
        const listingDoc = await adminDb.collection('listings').doc(data.listingId).get();
        if (!listingDoc.exists) {
            return {
                success: false,
                code: 'NOT_FOUND',
                message: 'الإعلان غير موجود'
            };
        }

        const listingData = listingDoc.data()!;

        // Prevent self-reporting
        if (listingData.userId === session.uid) {
            return {
                success: false,
                code: 'SELF_REPORT',
                message: 'لا يمكنك الإبلاغ عن إعلانك'
            };
        }

        // Check if listing is already flagged
        if (listingData.isFlagged) {
            return {
                success: false,
                code: 'ALREADY_FLAGGED',
                message: 'هذا الإعلان قيد المراجعة بالفعل'
            };
        }

        // Check for duplicate report (same user, same listing, within cooldown)
        const cooldownTime = new Date(Date.now() - REPORT_COOLDOWN_MS);
        const existingReport = await adminDb
            .collection('reports')
            .where('reporterId', '==', session.uid)
            .where('listingId', '==', data.listingId)
            .where('createdAt', '>', cooldownTime)
            .limit(1)
            .get();

        if (!existingReport.empty) {
            return {
                success: false,
                code: 'DUPLICATE_REPORT',
                message: 'لقد أبلغت عن هذا الإعلان مسبقاً'
            };
        }

        // Create report document
        const reportRef = adminDb.collection('reports').doc();
        const reportData = {
            listingId: data.listingId,
            listingTitle: listingData.title,
            listingOwnerId: listingData.userId,
            reporterId: session.uid,
            reason: data.reason,
            details: data.details || null,
            status: 'pending',
            createdAt: FieldValue.serverTimestamp(),
            resolvedAt: null,
            resolvedBy: null,
            resolution: null,
        };

        await reportRef.set(reportData);

        // Count unique reports for this listing
        const reportsSnapshot = await adminDb
            .collection('reports')
            .where('listingId', '==', data.listingId)
            .where('status', '==', 'pending')
            .get();

        // Get unique reporters
        const uniqueReporters = new Set<string>();
        reportsSnapshot.docs.forEach(doc => {
            uniqueReporters.add(doc.data().reporterId);
        });

        // Auto-flag if threshold reached
        if (uniqueReporters.size >= AUTO_FLAG_THRESHOLD) {
            await autoFlagListing(data.listingId, uniqueReporters.size);
        }

        return {
            success: true,
            data: { reportId: reportRef.id }
        };
    } catch (error) {
        console.error('submitReport error:', error);
        return {
            success: false,
            code: 'NET_001',
            message: 'حدث خطأ في إرسال البلاغ'
        };
    }
}

// ============================================
// Auto-Flag Listing (internal)
// ============================================

async function autoFlagListing(listingId: string, reportCount: number): Promise<void> {
    console.log(`[AutoFlag] Flagging listing ${listingId} (${reportCount} reports)`);

    try {
        // Update listing to flagged
        await adminDb.collection('listings').doc(listingId).update({
            isFlagged: true,
            flaggedAt: FieldValue.serverTimestamp(),
        });

        // Remove from Algolia search
        await algoliaAdmin.deleteObject({
            indexName: 'listings',
            objectID: listingId,
        });

        console.log(`[AutoFlag] Successfully flagged and removed from search: ${listingId}`);
    } catch (error) {
        console.error(`[AutoFlag] Failed to flag listing ${listingId}:`, error);
        // Don't throw - the report was still created
    }
}

// ============================================
// Get Report Count (for UI display)
// ============================================

export async function hasUserReportedListing(
    listingId: string
): Promise<ActionResult<{ hasReported: boolean }>> {
    try {
        const session = await getServerSession();
        if (!session) {
            return { success: true, data: { hasReported: false } };
        }

        const cooldownTime = new Date(Date.now() - REPORT_COOLDOWN_MS);
        const existingReport = await adminDb
            .collection('reports')
            .where('reporterId', '==', session.uid)
            .where('listingId', '==', listingId)
            .where('createdAt', '>', cooldownTime)
            .limit(1)
            .get();

        return {
            success: true,
            data: { hasReported: !existingReport.empty }
        };
    } catch (error) {
        console.error('hasUserReportedListing error:', error);
        return { success: true, data: { hasReported: false } };
    }
}

