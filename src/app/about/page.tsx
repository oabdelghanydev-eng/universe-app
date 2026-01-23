import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'عن المنصة | UniVerse',
    description: 'تعرف على منصة UniVerse - منصة مغلقة لطلاب الجامعة لعرض وبيع المنتجات والخدمات',
};

export default function AboutPage() {
    return (
        <main className="container mx-auto px-4 py-12 max-w-4xl animate-fade-slide-up">
            {/* Header */}
            <div className="text-center mb-12">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl glass-elevated mb-6 animate-gentle-float">
                    <span className="text-4xl">🎓</span>
                </div>
                <h1 className="text-4xl md:text-5xl font-bold text-[var(--text-primary)] mb-4">
                    عن <span className="text-gradient">UniVerse</span>
                </h1>
                <p className="text-xl text-[var(--text-secondary)]">
                    منصة مغلقة وآمنة لطلاب الجامعة
                </p>
            </div>

            {/* Mission */}
            <section className="mb-12">
                <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-4 flex items-center gap-2">
                    <span>🎯</span> مهمتنا
                </h2>
                <div className="card-elevated p-8 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--nebula-500)]/10 blur-3xl rounded-full pointer-events-none" />
                    <p className="text-[var(--text-secondary)] leading-relaxed text-lg relative z-10">
                        UniVerse هي منصة مخصصة لطلاب الجامعة لعرض وشراء المنتجات والخدمات بشكل آمن.
                        نوفر بيئة موثوقة حيث كل مستخدم تم التحقق من هويته كطالب جامعي،
                        مما يضمن تعاملات آمنة بين الطلاب.
                    </p>
                </div>
            </section>

            {/* Features */}
            <section className="mb-12">
                <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-6 flex items-center gap-2">
                    <span>✨</span> مميزاتنا
                </h2>
                <div className="grid md:grid-cols-2 gap-6">
                    <FeatureCard
                        icon="🔐"
                        title="أمان مضمون"
                        description="نظام تحقق من هوية الطالب باستخدام الرقم الأكاديمي"
                    />
                    <FeatureCard
                        icon="🔍"
                        title="بحث سريع"
                        description="ابحث عن أي منتج أو خدمة بسهولة مع فلاتر متقدمة"
                    />
                    <FeatureCard
                        icon="📱"
                        title="تواصل مباشر"
                        description="تواصل فوري عبر واتساب أو مكالمة هاتفية"
                    />
                    <FeatureCard
                        icon="🛡️"
                        title="حماية المستخدمين"
                        description="نظام بلاغات فعال لضمان تجربة آمنة للجميع"
                    />
                </div>
            </section>

            {/* How it works */}
            <section className="mb-12">
                <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-6 flex items-center gap-2">
                    <span>🚀</span> كيف تبدأ؟
                </h2>
                <div className="space-y-4">
                    <Step number={1} title="سجل حسابك" description="سجل دخولك بحساب Google ثم أدخل رقمك الأكاديمي للتحقق" />
                    <Step number={2} title="تصفح الإعلانات" description="ابحث عن المنتجات والخدمات التي تحتاجها" />
                    <Step number={3} title="انشر إعلانك" description="لديك شيء للبيع أو خدمة لتقديمها؟ انشر إعلانك مجاناً" />
                    <Step number={4} title="تواصل مباشرة" description="تواصل مع البائع أو المشتري عبر الواتساب أو الاتصال" />
                </div>
            </section>

            {/* CTA */}
            <section className="relative rounded-2xl p-8 text-center overflow-hidden">
                {/* Background Gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-[var(--nebula-600)] to-[var(--stellar-600)] opacity-90" />

                <div className="relative z-10">
                    <h2 className="text-3xl font-bold text-white mb-4">جاهز للبدء؟</h2>
                    <p className="mb-8 text-white/90 text-lg">انضم لمجتمع UniVerse الآن وابدأ في استكشاف الفرص</p>
                    <div className="flex gap-4 justify-center flex-wrap">
                        <Link
                            href="/register"
                            className="px-8 py-3.5 bg-white text-[var(--nebula-600)] rounded-xl font-bold hover:shadow-lg hover:scale-105 transition-all duration-200"
                        >
                            سجل الآن
                        </Link>
                        <Link
                            href="/"
                            className="px-8 py-3.5 bg-transparent border-2 border-white text-white rounded-xl font-bold hover:bg-white/10 transition-all duration-200"
                        >
                            تصفح الإعلانات
                        </Link>
                    </div>
                </div>
            </section>

            {/* Footer links */}
            <div className="mt-12 text-center text-sm text-[var(--text-muted)]">
                <Link href="/privacy" className="hover:text-[var(--nebula-400)] transition-colors">سياسة الخصوصية</Link>
                <span className="mx-3 text-[var(--space-600)]">•</span>
                <Link href="/terms" className="hover:text-[var(--nebula-400)] transition-colors">الشروط والأحكام</Link>
            </div>
        </main>
    );
}

// ============================================
// Sub-components
// ============================================

function FeatureCard({ icon, title, description }: { icon: string; title: string; description: string }) {
    return (
        <div className="card p-6 hover:border-[var(--nebula-500)]/50 transition-colors group">
            <div className="text-4xl mb-4 transform group-hover:scale-110 transition-transform duration-300">{icon}</div>
            <h3 className="font-bold text-[var(--text-primary)] mb-2 text-lg">{title}</h3>
            <p className="text-[var(--text-secondary)] leading-relaxed">{description}</p>
        </div>
    );
}

function Step({ number, title, description }: { number: number; title: string; description: string }) {
    return (
        <div className="card p-4 flex gap-4 items-center group hover:bg-[var(--glass-bg-elevated)] transition-colors">
            <div className="w-12 h-12 rounded-xl bg-[var(--nebula-500)]/20 text-[var(--nebula-400)] flex items-center justify-center font-bold text-xl shrink-0 group-hover:bg-[var(--nebula-500)] group-hover:text-white transition-all duration-300">
                {number}
            </div>
            <div>
                <h3 className="font-bold text-[var(--text-primary)] text-lg mb-1">{title}</h3>
                <p className="text-[var(--text-secondary)]">{description}</p>
            </div>
        </div>
    );
}
