import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'الشروط والأحكام | UniVerse',
    description: 'الشروط والأحكام لاستخدام منصة UniVerse',
};

export default function TermsPage() {
    return (
        <main className="container mx-auto px-4 py-12 max-w-4xl">
            {/* Header */}
            <div className="mb-12">
                <Link href="/" className="text-indigo-600 hover:underline mb-4 inline-block">
                    ← العودة للرئيسية
                </Link>
                <h1 className="text-4xl font-bold text-gray-900 mb-4">
                    📜 الشروط والأحكام
                </h1>
                <p className="text-gray-600">
                    آخر تحديث: يناير 2026
                </p>
            </div>

            {/* Important Notice */}
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 mb-8">
                <p className="text-amber-800 font-medium">
                    ⚠️ باستخدامك لمنصة UniVerse، فإنك توافق على هذه الشروط والأحكام.
                    يرجى قراءتها بعناية.
                </p>
            </div>

            {/* Content */}
            <div className="prose prose-gray max-w-none space-y-8">
                <Section title="1. تعريفات">
                    <ul>
                        <li><strong>"المنصة":</strong> منصة UniVerse وجميع خدماتها</li>
                        <li><strong>"المستخدم":</strong> أي شخص يستخدم المنصة</li>
                        <li><strong>"الإعلان":</strong> أي منتج أو خدمة معروضة على المنصة</li>
                        <li><strong>"الإدارة":</strong> فريق إدارة منصة UniVerse</li>
                    </ul>
                </Section>

                <Section title="2. شروط الأهلية">
                    <ul>
                        <li>يجب أن تكون طالباً مسجلاً في الجامعة</li>
                        <li>يجب التحقق من هويتك عبر الرقم الأكاديمي</li>
                        <li>يجب أن تكون قادراً على الدخول في عقود قانونية</li>
                        <li>لا يسمح بالتسجيل بأكثر من حساب</li>
                    </ul>
                </Section>

                <Section title="3. قواعد النشر">
                    <p>عند نشر إعلان، يجب الالتزام بالتالي:</p>
                    <ul>
                        <li>المحتوى يجب أن يكون صادقاً ودقيقاً</li>
                        <li>الصور يجب أن تكون للمنتج/الخدمة الفعلية</li>
                        <li>السعر يجب أن يكون واضحاً (أو "تواصل للسعر")</li>
                        <li>رقم الهاتف يجب أن يكون صحيحاً وفعالاً</li>
                    </ul>

                    <h3 className="font-bold text-gray-900 mt-4">المحتوى المحظور:</h3>
                    <ul className="text-red-600">
                        <li>❌ المنتجات المقلدة أو المسروقة</li>
                        <li>❌ المحتوى الإباحي أو غير اللائق</li>
                        <li>❌ الأسلحة والمخدرات والمواد الممنوعة</li>
                        <li>❌ الخدمات غير القانونية</li>
                        <li>❌ الغش الأكاديمي (بيع الواجبات، الأبحاث، إلخ)</li>
                        <li>❌ الإعلانات المضللة أو الاحتيالية</li>
                    </ul>
                </Section>

                <Section title="4. المعاملات بين المستخدمين">
                    <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="font-medium text-gray-900">
                            ⚠️ UniVerse هي منصة للتواصل فقط وليست طرفاً في أي معاملة.
                        </p>
                    </div>
                    <ul>
                        <li>جميع المعاملات تتم بين البائع والمشتري مباشرة</li>
                        <li>المنصة غير مسؤولة عن جودة المنتجات أو الخدمات</li>
                        <li>المنصة غير مسؤولة عن أي خلافات أو نزاعات</li>
                        <li>ننصح بالتأكد من المنتج قبل الدفع</li>
                        <li>يفضل الالتقاء في أماكن عامة وآمنة</li>
                    </ul>
                </Section>

                <Section title="5. نظام البلاغات">
                    <ul>
                        <li>يمكن لأي مستخدم الإبلاغ عن إعلان مخالف</li>
                        <li>الإعلانات التي تحصل على 3 بلاغات أو أكثر تُخفى تلقائياً للمراجعة</li>
                        <li>البلاغات الكاذبة قد تؤدي لحظر الحساب</li>
                        <li>قرارات الإدارة نهائية</li>
                    </ul>
                </Section>

                <Section title="6. إنهاء الحساب">
                    <p>يحق للإدارة إنهاء أو تعليق حسابك في الحالات التالية:</p>
                    <ul>
                        <li>انتهاك هذه الشروط والأحكام</li>
                        <li>نشر محتوى محظور</li>
                        <li>الاحتيال أو محاولة الاحتيال</li>
                        <li>إساءة استخدام نظام البلاغات</li>
                        <li>أي سلوك يضر بالمنصة أو مستخدميها</li>
                    </ul>
                </Section>

                <Section title="7. إخلاء المسؤولية">
                    <ul>
                        <li>المنصة تُقدم "كما هي" بدون ضمانات</li>
                        <li>لا نضمن توفر الخدمة بشكل دائم</li>
                        <li>لا نتحمل مسؤولية أي خسائر ناتجة عن استخدام المنصة</li>
                        <li>لا نتحمل مسؤولية تصرفات المستخدمين الآخرين</li>
                    </ul>
                </Section>

                <Section title="8. الملكية الفكرية">
                    <ul>
                        <li>جميع حقوق المنصة محفوظة لـ UniVerse</li>
                        <li>المستخدم يمنح المنصة حق عرض محتوى إعلاناته</li>
                        <li>لا يجوز نسخ أو استخدام أي جزء من المنصة بدون إذن</li>
                    </ul>
                </Section>

                <Section title="9. التعديلات على الشروط">
                    <p>
                        يحق للإدارة تعديل هذه الشروط في أي وقت.
                        سنقوم بإشعارك بالتغييرات الجوهرية.
                        استمرارك في استخدام المنصة يعني موافقتك على الشروط المحدثة.
                    </p>
                </Section>

                <Section title="10. القانون الواجب التطبيق">
                    <p>
                        تخضع هذه الشروط لقوانين جمهورية مصر العربية.
                        أي نزاعات تُحل وفقاً للقوانين المحلية المعمول بها.
                    </p>
                </Section>

                <Section title="11. تواصل معنا">
                    <p>للاستفسارات حول الشروط والأحكام:</p>
                    <p className="bg-gray-50 p-4 rounded-lg">
                        📧 البريد الإلكتروني: legal@universe-app.com
                    </p>
                </Section>
            </div>

            {/* Agreement */}
            <div className="mt-12 bg-indigo-50 rounded-xl p-6 text-center">
                <p className="text-indigo-800">
                    ✅ باستخدامك للمنصة، فإنك تقر بأنك قرأت وفهمت وتوافق على هذه الشروط والأحكام.
                </p>
            </div>

            {/* Footer */}
            <div className="mt-12 pt-8 border-t border-gray-200 text-center text-sm text-gray-500">
                <Link href="/about" className="hover:text-indigo-600">عن المنصة</Link>
                <span className="mx-3">•</span>
                <Link href="/privacy" className="hover:text-indigo-600">سياسة الخصوصية</Link>
            </div>
        </main>
    );
}

// ============================================
// Section Component
// ============================================

function Section({ title, children }: { title: string; children: React.ReactNode }) {
    return (
        <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4">{title}</h2>
            <div className="text-gray-700 leading-relaxed space-y-3">{children}</div>
        </section>
    );
}
