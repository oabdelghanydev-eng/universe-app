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
                <div className="container mx-auto px-4 py-6">
                    <div className="flex flex-col items-center gap-4 text-center">
                        {/* University Info */}
                        <div className="flex flex-col items-center gap-1">
                            <p className="text-sm text-[var(--text-muted)]">
                                تم التصميم والتنفيذ
                            </p>
                            <p className="text-sm font-semibold text-[var(--text-secondary)]">
                                بقسم تكنولوجيا المعلومات
                            </p>
                            <p className="text-xs text-[var(--text-muted)] mt-2">
                                تحت إدارة وإشراف
                            </p>
                            <p className="text-sm font-bold text-gradient flex items-center gap-2">
                                <span>🎓</span>
                                جامعة برج العرب التكنولوجية
                            </p>
                        </div>

                        {/* Copyright */}
                        <p className="text-xs text-[var(--text-muted)] mt-2">
                            © {currentYear} UniVerse. جميع الحقوق محفوظة.
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    );
}

