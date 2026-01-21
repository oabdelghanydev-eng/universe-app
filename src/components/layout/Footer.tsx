// Footer Component - Site footer
import Link from 'next/link';

export default function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="mt-auto border-t border-[var(--glass-border)]">
            {/* Main Footer Content */}
            <div className="container mx-auto px-4 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* Brand Column */}
                    <div className="md:col-span-2">
                        <Link href="/" className="inline-flex items-center gap-2 text-xl font-bold mb-4">
                            <span className="text-2xl">🎓</span>
                            <span className="text-gradient">UniVerse</span>
                        </Link>
                        <p className="text-[var(--text-secondary)] text-sm max-w-xs leading-relaxed">
                            منصة مغلقة وآمنة لطلاب الجامعة لعرض وبيع المنتجات والخدمات.
                            تواصل مباشر وموثوق بين الطلاب.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="font-semibold text-[var(--text-primary)] mb-4 text-sm uppercase tracking-wider">
                            روابط سريعة
                        </h3>
                        <ul className="space-y-3">
                            <li>
                                <Link
                                    href="/about"
                                    className="text-[var(--text-muted)] hover:text-[var(--nebula-400)] transition-colors text-sm"
                                >
                                    عن المنصة
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/listing/new"
                                    className="text-[var(--text-muted)] hover:text-[var(--nebula-400)] transition-colors text-sm"
                                >
                                    إنشاء إعلان
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/profile"
                                    className="text-[var(--text-muted)] hover:text-[var(--nebula-400)] transition-colors text-sm"
                                >
                                    إعلاناتي
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Legal */}
                    <div>
                        <h3 className="font-semibold text-[var(--text-primary)] mb-4 text-sm uppercase tracking-wider">
                            قانوني
                        </h3>
                        <ul className="space-y-3">
                            <li>
                                <Link
                                    href="/privacy"
                                    className="text-[var(--text-muted)] hover:text-[var(--nebula-400)] transition-colors text-sm"
                                >
                                    سياسة الخصوصية
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/terms"
                                    className="text-[var(--text-muted)] hover:text-[var(--nebula-400)] transition-colors text-sm"
                                >
                                    الشروط والأحكام
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* Bottom Bar */}
            <div className="border-t border-[var(--glass-border)]">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-sm text-[var(--text-muted)]">
                        <p>
                            © {currentYear} UniVerse. جميع الحقوق محفوظة.
                        </p>
                        <p className="flex items-center gap-1">
                            صُنع بـ
                            <span className="text-[var(--aurora-danger)] animate-pulse">❤</span>
                            في مصر
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    );
}

