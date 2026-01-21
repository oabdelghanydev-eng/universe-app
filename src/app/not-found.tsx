import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'الصفحة غير موجودة | UniVerse',
    description: 'عذراً، الصفحة التي تبحث عنها غير موجودة',
};

export default function NotFoundPage() {
    return (
        <div className="min-h-[70vh] flex items-center justify-center px-4">
            <div className="text-center max-w-md animate-fade-slide-up">
                {/* Illustration */}
                <div className="relative mb-8">
                    {/* Floating icon */}
                    <div className="inline-flex items-center justify-center w-28 h-28 rounded-3xl glass-elevated animate-gentle-float">
                        <span className="text-6xl">🔭</span>
                    </div>

                    {/* Decorative orbs */}
                    <div className="absolute -top-4 -right-4 w-8 h-8 rounded-full bg-[var(--nebula-500)]/30 blur-md" />
                    <div className="absolute -bottom-2 -left-6 w-6 h-6 rounded-full bg-[var(--stellar-500)]/30 blur-md" />
                </div>

                {/* 404 */}
                <h1 className="text-6xl md:text-8xl font-extrabold mb-4">
                    <span className="text-gradient">404</span>
                </h1>

                {/* Heading */}
                <h2 className="text-xl md:text-2xl font-bold text-[var(--text-primary)] mb-3">
                    تائه في الفضاء؟
                </h2>

                {/* Description */}
                <p className="text-[var(--text-secondary)] mb-8">
                    يبدو أن الصفحة التي تبحث عنها غير موجودة أو تم نقلها إلى مكان آخر.
                </p>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-3 justify-center mb-10">
                    <Link
                        href="/"
                        className="btn btn-primary px-6 py-3"
                    >
                        🏠 العودة للرئيسية
                    </Link>
                    <Link
                        href="/listing/new"
                        className="btn btn-secondary px-6 py-3"
                    >
                        ➕ إنشاء إعلان
                    </Link>
                </div>

                {/* Helpful Links */}
                <div className="pt-8 border-t border-[var(--glass-border)]">
                    <p className="text-sm text-[var(--text-muted)] mb-4">روابط مفيدة</p>
                    <div className="flex justify-center gap-6 text-sm">
                        <Link
                            href="/about"
                            className="text-[var(--nebula-400)] hover:text-[var(--nebula-300)] transition-colors"
                        >
                            عن المنصة
                        </Link>
                        <Link
                            href="/profile"
                            className="text-[var(--nebula-400)] hover:text-[var(--nebula-300)] transition-colors"
                        >
                            إعلاناتي
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
