'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { GraduationCap, ClipboardCheck, AlertCircle, Lock } from 'lucide-react';
import { auth } from '@/lib/firebase/client';
import { createSession, verifyAndRegisterStudent, checkRegistrationStatus } from '@/actions/auth';

type Step = 'google' | 'verify';

export default function RegisterPage() {
    const router = useRouter();
    const [step, setStep] = useState<Step>('google');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [academicId, setAcademicId] = useState('');
    const [fullName, setFullName] = useState('');

    useEffect(() => {
        async function checkAuth() {
            const result = await checkRegistrationStatus();
            if (result.success && result.data?.isLoggedIn) {
                if (result.data.isRegistered) {
                    router.push('/');
                } else {
                    setStep('verify');
                }
            }
        }
        checkAuth();
    }, [router]);

    async function handleGoogleSignUp() {
        setLoading(true);
        setError(null);

        try {
            const provider = new GoogleAuthProvider();
            const result = await signInWithPopup(auth, provider);
            const idToken = await result.user.getIdToken();
            const sessionResult = await createSession(idToken);

            if (!sessionResult.success) {
                setError(sessionResult.message);
                return;
            }

            if (sessionResult.data?.isRegistered) {
                router.push('/');
            } else {
                setStep('verify');
            }
        } catch (err) {
            console.error('Sign up error:', err);
            setError('حدث خطأ، حاول مرة أخرى');
        } finally {
            setLoading(false);
        }
    }

    async function handleVerifyStudent(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const result = await verifyAndRegisterStudent({
                academicId: academicId.trim(),
                fullName: fullName.trim(),
            });

            if (!result.success) {
                setError(result.message);
                return;
            }

            router.push('/');
        } catch (err) {
            console.error('Verification error:', err);
            setError('حدث خطأ، حاول مرة أخرى');
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="min-h-[80vh] flex items-center justify-center px-4">
            <div className="w-full max-w-md animate-fade-slide-up">
                {/* Progress Indicator */}
                <div className="flex items-center justify-center gap-3 mb-8">
                    <div className={`w-3 h-3 rounded-full transition-all duration-300 ${step === 'google'
                        ? 'bg-[var(--nebula-500)] ring-4 ring-[var(--nebula-500)]/30'
                        : 'bg-[var(--nebula-500)]'
                        }`} />
                    <div className={`w-8 h-0.5 ${step === 'verify' ? 'bg-[var(--nebula-500)]' : 'bg-[var(--space-600)]'}`} />
                    <div className={`w-3 h-3 rounded-full transition-all duration-300 ${step === 'verify'
                        ? 'bg-[var(--nebula-500)] ring-4 ring-[var(--nebula-500)]/30'
                        : 'bg-[var(--space-600)]'
                        }`} />
                </div>

                {/* Card */}
                <div className="card-elevated p-8 rounded-2xl">
                    {step === 'google' ? (
                        <>
                            {/* Header */}
                            <div className="text-center mb-8">
                                <div className="inline-flex items-center justify-center w-16 h-16 rounded-xl glass mb-6">
                                    <GraduationCap className="w-8 h-8 text-cyan-400" />
                                </div>
                                <h1 className="text-2xl font-bold text-[var(--text-primary)] mb-2">
                                    إنشاء حساب
                                </h1>
                                <p className="text-[var(--text-secondary)]">
                                    انضم إلى مجتمع UniVerse
                                </p>
                            </div>

                            {/* Error */}
                            {error && (
                                <div className="card p-4 mb-6 border border-red-500/30 bg-red-500/10 rounded-xl flex items-center justify-center gap-2">
                                    <AlertCircle className="w-5 h-5 text-red-400" />
                                    <p className="text-red-400 text-sm text-center">
                                        {error}
                                    </p>
                                </div>
                            )}

                            {/* Google Button */}
                            <button
                                onClick={handleGoogleSignUp}
                                disabled={loading}
                                className="w-full flex items-center justify-center gap-3 bg-white hover:bg-gray-50 text-gray-700 font-medium rounded-xl px-6 py-3.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
                            >
                                {loading ? (
                                    <span className="w-5 h-5 border-2 border-gray-300 border-t-nebula-600 rounded-full animate-spin" />
                                ) : (
                                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                                    </svg>
                                )}
                                {loading ? 'جاري التحميل...' : 'التسجيل عبر Google'}
                            </button>

                            {/* Divider */}
                            <div className="relative my-8">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-[var(--glass-border)]" />
                                </div>
                                <div className="relative flex justify-center text-xs">
                                    <span className="px-4 bg-[var(--glass-bg-elevated)] text-[var(--text-muted)]">
                                        أو
                                    </span>
                                </div>
                            </div>

                            {/* Login Link */}
                            <div className="text-center">
                                <span className="text-[var(--text-secondary)]">لديك حساب بالفعل؟ </span>
                                <Link
                                    href="/login"
                                    className="text-[var(--nebula-400)] font-medium hover:text-[var(--nebula-300)] transition-colors"
                                >
                                    تسجيل الدخول
                                </Link>
                            </div>
                        </>
                    ) : (
                        <>
                            {/* Header - Step 2 */}
                            <div className="text-center mb-8">
                                <div className="inline-flex items-center justify-center w-16 h-16 rounded-xl glass mb-6">
                                    <ClipboardCheck className="w-8 h-8 text-cyan-400" />
                                </div>
                                <h1 className="text-2xl font-bold text-[var(--text-primary)] mb-2">
                                    التحقق من الهوية
                                </h1>
                                <p className="text-[var(--text-secondary)]">
                                    أدخل بياناتك الأكاديمية للتحقق
                                </p>
                            </div>

                            {/* Error */}
                            {error && (
                                <div className="card p-4 mb-6 border border-red-500/30 bg-red-500/10 rounded-xl flex items-center justify-center gap-2">
                                    <AlertCircle className="w-5 h-5 text-red-400" />
                                    <p className="text-red-400 text-sm text-center">
                                        {error}
                                    </p>
                                </div>
                            )}

                            {/* Form */}
                            <form onSubmit={handleVerifyStudent} className="space-y-5">
                                <div>
                                    <label
                                        htmlFor="academicId"
                                        className="block text-sm font-medium text-[var(--text-secondary)] mb-2"
                                    >
                                        الرقم الأكاديمي
                                    </label>
                                    <input
                                        id="academicId"
                                        type="text"
                                        value={academicId}
                                        onChange={(e) => setAcademicId(e.target.value)}
                                        placeholder="مثال: 20210001"
                                        pattern="\d{4,10}"
                                        required
                                        className="input"
                                    />
                                </div>

                                <div>
                                    <label
                                        htmlFor="fullName"
                                        className="block text-sm font-medium text-[var(--text-secondary)] mb-2"
                                    >
                                        الاسم الكامل (كما هو مسجل في الجامعة)
                                    </label>
                                    <input
                                        id="fullName"
                                        type="text"
                                        value={fullName}
                                        onChange={(e) => setFullName(e.target.value)}
                                        placeholder="أحمد محمد علي"
                                        required
                                        className="input"
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading || !academicId || !fullName}
                                    className="w-full btn btn-primary py-3.5 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {loading ? (
                                        <span className="flex items-center gap-2">
                                            <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                            جاري التحقق...
                                        </span>
                                    ) : (
                                        'تأكيد التسجيل'
                                    )}
                                </button>
                            </form>

                            {/* Note */}
                            <p className="mt-6 text-sm text-[var(--text-muted)] text-center">
                                يجب أن يتطابق الاسم والرقم الأكاديمي مع البيانات المسجلة في الجامعة
                            </p>
                        </>
                    )}
                </div>

                {/* Security Note */}
                <p className="text-center text-[var(--text-muted)] text-xs mt-6 flex items-center justify-center gap-1.5">
                    <Lock className="w-3 h-3" />
                    بياناتك محمية ولن يتم مشاركتها
                </p>
            </div>
        </div>
    );
}
