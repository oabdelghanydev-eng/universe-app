import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'عن المنصة | UniVerse',
    description: 'تعرف على منصة UniVerse - منصة مغلقة لطلاب الجامعة لعرض وبيع المنتجات والخدمات',
};

export default function AboutPage() {
    return (
        <main className="container mx-auto px-4 py-12 max-w-4xl">
            {/* Header */}
            <div className="text-center mb-12">
                <h1 className="text-4xl font-bold text-gray-900 mb-4">
                    🎓 عن UniVerse
                </h1>
                <p className="text-xl text-gray-600">
                    منصة مغلقة وآمنة لطلاب الجامعة
                </p>
            </div>

            {/* Mission */}
            <section className="mb-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">🎯 مهمتنا</h2>
                <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-6">
                    <p className="text-gray-700 leading-relaxed">
                        UniVerse هي منصة مخصصة لطلاب الجامعة لعرض وشراء المنتجات والخدمات بشكل آمن.
                        نوفر بيئة موثوقة حيث كل مستخدم تم التحقق من هويته كطالب جامعي،
                        مما يضمن تعاملات آمنة بين الطلاب.
                    </p>
                </div>
            </section>

            {/* Features */}
            <section className="mb-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">✨ مميزاتنا</h2>
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
                <h2 className="text-2xl font-bold text-gray-900 mb-6">🚀 كيف تبدأ؟</h2>
                <div className="space-y-4">
                    <Step number={1} title="سجل حسابك" description="سجل دخولك بحساب Google ثم أدخل رقمك الأكاديمي للتحقق" />
                    <Step number={2} title="تصفح الإعلانات" description="ابحث عن المنتجات والخدمات التي تحتاجها" />
                    <Step number={3} title="انشر إعلانك" description="لديك شيء للبيع أو خدمة لتقديمها؟ انشر إعلانك مجاناً" />
                    <Step number={4} title="تواصل مباشرة" description="تواصل مع البائع أو المشتري عبر الواتساب أو الاتصال" />
                </div>
            </section>

            {/* CTA */}
            <section className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-xl p-8 text-center text-white">
                <h2 className="text-2xl font-bold mb-4">جاهز للبدء؟</h2>
                <p className="mb-6 opacity-90">انضم لمجتمع UniVerse الآن وابدأ في استكشاف الفرص</p>
                <div className="flex gap-4 justify-center flex-wrap">
                    <Link
                        href="/register"
                        className="px-6 py-3 bg-white text-indigo-600 rounded-lg font-medium hover:bg-gray-100 transition-colors"
                    >
                        سجل الآن
                    </Link>
                    <Link
                        href="/"
                        className="px-6 py-3 bg-transparent border-2 border-white rounded-lg font-medium hover:bg-white/10 transition-colors"
                    >
                        تصفح الإعلانات
                    </Link>
                </div>
            </section>

            {/* Footer links */}
            <div className="mt-12 text-center text-sm text-gray-500">
                <Link href="/privacy" className="hover:text-indigo-600">سياسة الخصوصية</Link>
                <span className="mx-3">•</span>
                <Link href="/terms" className="hover:text-indigo-600">الشروط والأحكام</Link>
            </div>
        </main>
    );
}

// ============================================
// Sub-components
// ============================================

function FeatureCard({ icon, title, description }: { icon: string; title: string; description: string }) {
    return (
        <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow">
            <div className="text-3xl mb-3">{icon}</div>
            <h3 className="font-bold text-gray-900 mb-2">{title}</h3>
            <p className="text-gray-600 text-sm">{description}</p>
        </div>
    );
}

function Step({ number, title, description }: { number: number; title: string; description: string }) {
    return (
        <div className="flex gap-4 items-start">
            <div className="w-10 h-10 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold shrink-0">
                {number}
            </div>
            <div>
                <h3 className="font-bold text-gray-900">{title}</h3>
                <p className="text-gray-600 text-sm">{description}</p>
            </div>
        </div>
    );
}
