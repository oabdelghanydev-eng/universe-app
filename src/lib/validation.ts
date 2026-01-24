// Validation schemas using Zod
/**
 * Zod Validation Schemas
 * Server-side validation for all user inputs
 */

import { z } from 'zod';
import xss from 'xss';

/**
 * Sanitize string to prevent XSS attacks
 * Uses the battle-tested 'xss' library for robust protection
 * 
 * - Strips all HTML tags (whitelisted: none)
 * - Removes dangerous attributes and protocols
 * - Vercel Serverless compatible (no jsdom dependency)
 */
function sanitize(input: string): string {
    return xss(input.trim(), {
        whiteList: {},           // No HTML tags allowed
        stripIgnoreTag: true,    // Remove all non-whitelisted tags
        stripIgnoreTagBody: ['script', 'style'], // Remove script/style content entirely
    });
}

// ============================================
// Listing Validation
// ============================================

export const listingSchema = z.object({
    type: z.enum(['product', 'service']),
    title: z
        .string()
        .min(1, 'العنوان مطلوب')
        .max(60, 'العنوان يجب أن يكون أقل من 60 حرف')
        .transform(sanitize),
    description: z
        .string()
        .min(1, 'الوصف مطلوب')
        .max(500, 'الوصف يجب أن يكون أقل من 500 حرف')
        .transform(sanitize),
    price: z
        .number()
        .positive('السعر يجب أن يكون موجباً')
        .optional(),
    contactMethod: z.enum(['whatsapp', 'call']),
    phoneNumber: z
        .string()
        .regex(/^01[0125][0-9]{8}$/, 'رقم الهاتف غير صحيح (مثال: 01012345678)')
        .optional(),
    images: z.array(z.string()).default([]),
    imagePaths: z.array(z.string()).default([]),
});

export type ListingSchemaInput = z.infer<typeof listingSchema>;

// ============================================
// Report Validation
// ============================================

export const reportSchema = z.object({
    listingId: z.string().min(1),
    reason: z.enum(['inappropriate_content', 'fraud', 'spam', 'other']),
    details: z
        .string()
        .max(500, 'التفاصيل يجب أن تكون أقل من 500 حرف')
        .transform(sanitize)
        .optional(),
});

export type ReportSchemaInput = z.infer<typeof reportSchema>;

// ============================================
// Phone Validation Helper
// ============================================

export const phoneSchema = z
    .string()
    .regex(/^01[0125][0-9]{8}$/, 'رقم الهاتف غير صحيح');

/**
 * Validate listing input and return result
 */
export function validateListing(data: unknown) {
    return listingSchema.safeParse(data);
}

/**
 * Validate report input and return result
 */
export function validateReport(data: unknown) {
    return reportSchema.safeParse(data);
}

