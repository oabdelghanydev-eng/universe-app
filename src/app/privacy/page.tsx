import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'سياسة الخصوصية | UniVerse',
    description: 'سياسة الخصوصية لمنصة UniVerse - كيف نحمي بياناتك ونضمن خصوصيتك',
};

export default function PrivacyPage() {
    return (
        <main className="container mx-auto px-4 py-12 max-w-4xl">
            {/* Header */}
            <div className="mb-12">
                <Link href="/" className="text-indigo-600 hover:underline mb-4 inline-block">
                    ← العودة للرئيسية
                </Link>
                <h1 className="text-4xl font-bold text-gray-900 mb-4">
                    🔒 سياسة الخصوصية
                </h1>
                <p className="text-gray-600">
                    آخر تحديث: يناير 2026
                </p>
            </div>

            {/* Content */}
            <div className="prose prose-gray max-w-none space-y-8">
                <Section title="1. المعلومات التي نجمعها">
                    <p>عند استخدامك لمنصة UniVerse، نقوم بجمع المعلومات التالية:</p>
                    <ul>
                        <li><strong>معلومات الحساب:</strong> الاسم، البريد الإلكتروني، الصورة الشخصية (من Google)</li>
                        <li><strong>معلومات التحقق:</strong> الرقم الأكاديمي للتحقق من هويتك كطالب</li>
                        <li><strong>رقم الهاتف:</strong> للتواصل مع المشترين/البائعين</li>
                        <li><strong>محتوى الإعلانات:</strong> العنوان، الوصف، الصور، السعر</li>
                    </ul>
                </Section>

                <Section title="2. كيف نستخدم معلوماتك">
                    <p>نستخدم المعلومات التي نجمعها للأغراض التالية:</p>
                    <ul>
                        <li>التحقق من هويتك كطالب جامعي</li>
                        <li>عرض إعلاناتك للمستخدمين الآخرين</li>
                        <li>تمكين التواصل بين البائعين والمشترين</li>
                        <li>تحسين خدماتنا وتجربة المستخدم</li>
                        <li>ضمان أمان المنصة ومنع الاحتيال</li>
                    </ul>
                </Section>

                <Section title="3. مشاركة المعلومات">
                    <p>نحن لا نبيع معلوماتك الشخصية. قد نشارك معلومات محدودة في الحالات التالية:</p>
                    <ul>
                        <li><strong>مع المستخدمين الآخرين:</strong> رقم هاتفك (عند نشر إعلان) والجزء المخفي من رقمك الأكاديمي</li>
                        <li><strong>لأغراض قانونية:</strong> عند الطلب من الجهات المختصة</li>
                        <li><strong>مقدمي الخدمات:</strong> مثل Firebase وAlgolia لتشغيل المنصة</li>
                    </ul>
                </Section>

                <Section title="4. أمان البيانات">
                    <p>نتخذ إجراءات أمنية لحماية بياناتك:</p>
                    <ul>
                        <li>تشفير البيانات أثناء النقل (HTTPS)</li>
                        <li>مصادقة آمنة عبر Google OAuth</li>
                        <li>قواعد أمان صارمة لقاعدة البيانات</li>
                        <li>فصل صلاحيات الوصول للبيانات</li>
                    </ul>
                </Section>

                <Section title="5. حقوقك">
                    <p>لديك الحق في:</p>
                    <ul>
                        <li>الوصول إلى بياناتك الشخصية</li>
                        <li>تصحيح المعلومات غير الدقيقة</li>
                        <li>حذف إعلاناتك في أي وقت</li>
                        <li>طلب حذف حسابك بالكامل</li>
                    </ul>
                </Section>

                <Section title="6. ملفات تعريف الارتباط (Cookies)">
                    <p>
                        نستخدم ملفات تعريف الارتباط للحفاظ على جلسة تسجيل الدخول الخاصة بك.
                        هذه ضرورية لعمل المنصة ولا تُستخدم للتتبع الإعلاني.
                    </p>
                </Section>

                <Section title="7. الاحتفاظ بالبيانات">
                    <ul>
                        <li>الإعلانات المحذوفة: تُحذف نهائياً بعد 30 يوم</li>
                        <li>بيانات الحساب: تُحتفظ بها طوال فترة استخدامك للمنصة</li>
                        <li>سجلات البلاغات: تُحتفظ بها لأغراض المراجعة والأمان</li>
                    </ul>
                </Section>

                <Section title="8. تحديثات السياسة">
                    <p>
                        قد نقوم بتحديث هذه السياسة من وقت لآخر.
                        سنقوم بإشعارك بأي تغييرات جوهرية عبر البريد الإلكتروني أو إشعار داخل المنصة.
                    </p>
                </Section>

                <Section title="9. تواصل معنا">
                    <p>
                        لأي استفسارات حول سياسة الخصوصية، يمكنك التواصل معنا عبر:
                    </p>
                    <p className="bg-gray-50 p-4 rounded-lg">
                        📧 البريد الإلكتروني: privacy@universe-app.com
                    </p>
                </Section>
            </div>

            {/* Footer */}
            <div className="mt-12 pt-8 border-t border-gray-200 text-center text-sm text-gray-500">
                <Link href="/about" className="hover:text-indigo-600">عن المنصة</Link>
                <span className="mx-3">•</span>
                <Link href="/terms" className="hover:text-indigo-600">الشروط والأحكام</Link>
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
