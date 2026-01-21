'use server';

/**
 * Authentication Server Actions
 * Handles user registration, session management, and verification
 */

import { cookies } from 'next/headers';
import { adminAuth, adminDb } from '@/lib/firebase/admin';
import { createSessionCookie, getServerSession, SESSION_CONFIG } from '@/lib/auth';
import { FieldValue } from 'firebase-admin/firestore';
import type { ActionResult } from '@/types';

// ============================================
// Create Session (after Google OAuth)
// ============================================

export async function createSession(idToken: string): Promise<ActionResult<{ isRegistered: boolean; uid: string }>> {
    try {
        // Verify the ID token first
        const decodedToken = await adminAuth.verifyIdToken(idToken);

        // Check if user exists in our system
        const userDoc = await adminDb.collection('users').doc(decodedToken.uid).get();

        // Create session cookie
        const sessionCookie = await createSessionCookie(idToken);

        // Set the cookie
        const cookieStore = await cookies();
        cookieStore.set(SESSION_CONFIG.name, sessionCookie, SESSION_CONFIG.options);

        return {
            success: true,
            data: {
                isRegistered: userDoc.exists,
                uid: decodedToken.uid
            }
        };
    } catch (error) {
        console.error('createSession error:', error);
        return {
            success: false,
            code: 'AUTH_001',
            message: 'فشل في إنشاء الجلسة'
        };
    }
}

// ============================================
// Verify and Register Student
// ============================================

interface RegisterStudentData {
    academicId: string;
    fullName: string;
}

export async function verifyAndRegisterStudent(
    data: RegisterStudentData
): Promise<ActionResult<{ uid: string }>> {
    try {
        const session = await getServerSession();
        if (!session) {
            return {
                success: false,
                code: 'AUTH_001',
                message: 'يجب تسجيل الدخول أولاً'
            };
        }

        const { academicId, fullName } = data;

        // Validate academic ID format (4-10 digits)
        if (!/^\d{4,10}$/.test(academicId)) {
            return {
                success: false,
                code: 'AUTH_002',
                message: 'الرقم الأكاديمي غير صالح'
            };
        }

        // Check if this academicId is already registered to another user
        const existingUserQuery = await adminDb
            .collection('users')
            .where('academicId', '==', academicId)
            .limit(1)
            .get();

        if (!existingUserQuery.empty) {
            return {
                success: false,
                code: 'AUTH_004',
                message: 'هذا الرقم الأكاديمي مسجل بالفعل'
            };
        }

        // Verify against students collection
        const studentDoc = await adminDb.collection('students').doc(academicId).get();

        if (!studentDoc.exists) {
            return {
                success: false,
                code: 'AUTH_002',
                message: 'الرقم الأكاديمي غير موجود في قاعدة البيانات'
            };
        }

        const studentData = studentDoc.data()!;

        // Verify name match (normalize whitespace)
        const normalizedInput = fullName.trim().replace(/\s+/g, ' ');
        const normalizedDB = studentData.fullName.trim().replace(/\s+/g, ' ');

        if (normalizedInput !== normalizedDB) {
            return {
                success: false,
                code: 'AUTH_003',
                message: 'الاسم غير مطابق للرقم الأكاديمي'
            };
        }

        // Check if student already registered
        if (studentData.isRegistered) {
            return {
                success: false,
                code: 'AUTH_004',
                message: 'هذا الرقم الأكاديمي مسجل بالفعل'
            };
        }

        // Atomic batch write: create user + mark student as registered
        const batch = adminDb.batch();

        // Create user document
        batch.set(adminDb.collection('users').doc(session.uid), {
            fullName: normalizedInput,
            academicId,
            email: session.email,
            photoURL: session.photoURL || null,
            phoneNumber: null,
            createdAt: FieldValue.serverTimestamp(),
            isVerified: true,
        });

        // Update student document
        batch.update(adminDb.collection('students').doc(academicId), {
            isRegistered: true,
            registeredAt: FieldValue.serverTimestamp(),
        });

        await batch.commit();

        return { success: true, data: { uid: session.uid } };
    } catch (error) {
        console.error('verifyAndRegisterStudent error:', error);
        // In development, show actual error message
        const errorMessage = process.env.NODE_ENV === 'development' && error instanceof Error
            ? error.message
            : 'حدث خطأ، حاول مرة أخرى';
        return {
            success: false,
            code: 'NET_002',
            message: errorMessage
        };
    }
}

// ============================================
// Check Registration Status
// ============================================

export async function checkRegistrationStatus(): Promise<ActionResult<{
    isLoggedIn: boolean;
    isRegistered: boolean;
    user?: { uid: string; email: string; fullName?: string };
}>> {
    try {
        const session = await getServerSession();

        if (!session) {
            return {
                success: true,
                data: { isLoggedIn: false, isRegistered: false }
            };
        }

        const userDoc = await adminDb.collection('users').doc(session.uid).get();

        if (!userDoc.exists) {
            return {
                success: true,
                data: {
                    isLoggedIn: true,
                    isRegistered: false,
                    user: { uid: session.uid, email: session.email }
                }
            };
        }

        const userData = userDoc.data()!;
        return {
            success: true,
            data: {
                isLoggedIn: true,
                isRegistered: true,
                user: {
                    uid: session.uid,
                    email: session.email,
                    fullName: userData.fullName
                }
            }
        };
    } catch (error) {
        console.error('checkRegistrationStatus error:', error);
        return {
            success: false,
            code: 'NET_002',
            message: 'حدث خطأ في التحقق من الحالة'
        };
    }
}

// ============================================
// Logout
// ============================================

export async function logoutUser(): Promise<ActionResult> {
    try {
        const cookieStore = await cookies();
        cookieStore.delete(SESSION_CONFIG.name);

        return { success: true };
    } catch (error) {
        console.error('logoutUser error:', error);
        return {
            success: false,
            code: 'NET_002',
            message: 'حدث خطأ في تسجيل الخروج'
        };
    }
}
