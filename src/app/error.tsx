// Error Boundary - Global error handling
'use client';

import { useEffect } from 'react';
import Link from 'next/link';

interface ErrorProps {
    error: Error & { digest?: string };
    reset: () => void;
}

export default function ErrorPage({ error, reset }: ErrorProps) {
    useEffect(() => {
        console.error('Application error:', error);
    }, [error]);

    return (
        <div className="min-h-[70vh] flex items-center justify-center px-4">
            <div className="text-center max-w-md animate-fade-slide-up">
                {/* Illustration */}
                <div className="relative w-24 h-24 mx-auto mb-8">
                    {/* Outer glow */}
                    <div className="absolute inset-0 rounded-full bg-[var(--aurora-danger)]/20 blur-xl animate-pulse" />
                    {/* Icon container */}
                    <div className="relative w-full h-full rounded-2xl glass-elevated flex items-center justify-center">
                        <span className="text-5xl">⚠️</span>
                    </div>
                </div>

                {/* Heading */}
                <h1 className="text-2xl md:text-3xl font-bold text-[var(--text-primary)] mb-3">
                    حدث خطأ غير متوقع
                </h1>

                {/* Description */}
                <p className="text-[var(--text-secondary)] mb-6">
                    نعتذر عن هذا الخطأ. فريقنا يعمل على حل المشكلة.
                </p>

                {/* Error Digest */}
                {error.digest && (
                    <div className="card p-3 mb-6 rounded-lg">
                        <p className="text-xs text-[var(--text-muted)] font-mono">
                            Error ID: {error.digest}
                        </p>
                    </div>
                )}

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-3 justify-center mb-10">
                    <button
                        onClick={reset}
                        className="btn btn-primary px-6 py-3"
                    >
                        🔄 إعادة المحاولة
                    </button>
                    <Link
                        href="/"
                        className="btn btn-secondary px-6 py-3"
                    >
                        🏠 العودة للرئيسية
                    </Link>
                </div>

                {/* Tips */}
                <div className="card p-6 rounded-xl text-right">
                    <p className="font-semibold text-[var(--text-primary)] mb-3 flex items-center gap-2">
                        <span>💡</span>
                        نصائح
                    </p>
                    <ul className="text-sm text-[var(--text-secondary)] space-y-2">
                        <li className="flex items-start gap-2">
                            <span className="text-[var(--nebula-400)]">•</span>
                            جرب تحديث الصفحة
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-[var(--nebula-400)]">•</span>
                            تأكد من اتصالك بالإنترنت
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-[var(--nebula-400)]">•</span>
                            إذا استمرت المشكلة، تواصل معنا
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
}

