import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'سياسة الخصوصية | UniVerse',
    description: 'سياسة الخصوصية لمنصة UniVerse - كيف نحمي بياناتك ونضمن خصوصيتك',
};

export default function PrivacyPage() {
    return (
        <main className="container mx-auto px-4 py-12 max-w-4xl animate-fade-slide-up">
            {/* Header */}
            <div className="mb-12">
                <Link href="/" className="text-[var(--nebula-400)] hover:text-[var(--nebula-300)] hover:underline mb-4 inline-flex items-center gap-2 transition-colors">
                    <span>←</span> العودة للرئيسية
                </Link>
                <div className="flex items-center gap-4 mb-4">
                    <div className="w-16 h-16 rounded-2xl glass-elevated flex items-center justify-center text-3xl">
                        🔒
                    </div>
                    <div>
                        <h1 className="text-3xl md:text-4xl font-bold text-[var(--text-primary)] mb-1">
                            سياسة الخصوصية
                        </h1>
                        <p className="text-[var(--text-muted)]">
                            آخر تحديث: يناير 2026
                        </p>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="space-y-8">
                <Section title="1. المعلومات التي نجمعها">
                    <p>عند استخدامك لمنصة UniVerse، نقوم بجمع المعلومات التالية:</p>
                    <ul className="list-disc list-inside space-y-1 marker:text-[var(--nebula-500)]">
                        <li><strong className="text-[var(--text-primary)]">معلومات الحساب:</strong> الاسم، البريد الإلكتروني، الصورة الشخصية (من Google)</li>
                        <li><strong className="text-[var(--text-primary)]">معلومات التحقق:</strong> الرقم الأكاديمي للتحقق من هويتك كطالب</li>
                        <li><strong className="text-[var(--text-primary)]">رقم الهاتف:</strong> للتواصل مع المشترين/البائعين</li>
                        <li><strong className="text-[var(--text-primary)]">محتوى الإعلانات:</strong> العنوان، الوصف، الصور، السعر</li>
                    </ul>
                </Section>

                <Section title="2. كيف نستخدم معلوماتك">
                    <p>نستخدم المعلومات التي نجمعها للأغراض التالية:</p>
                    <ul className="list-disc list-inside space-y-1 marker:text-[var(--nebula-500)]">
                        <li>التحقق من هويتك كطالب جامعي</li>
                        <li>عرض إعلاناتك للمستخدمين الآخرين</li>
                        <li>تمكين التواصل بين البائعين والمشترين</li>
                        <li>تحسين خدماتنا وتجربة المستخدم</li>
                        <li>ضمان أمان المنصة ومنع الاحتيال</li>
                    </ul>
                </Section>

                <Section title="3. مشاركة المعلومات">
                    <p>نحن لا نبيع معلوماتك الشخصية. قد نشارك معلومات محدودة في الحالات التالية:</p>
                    <ul className="list-disc list-inside space-y-1 marker:text-[var(--nebula-500)]">
                        <li><strong className="text-[var(--text-primary)]">مع المستخدمين الآخرين:</strong> رقم هاتفك (عند نشر إعلان) والجزء المخفي من رقمك الأكاديمي</li>
                        <li><strong className="text-[var(--text-primary)]">لأغراض قانونية:</strong> عند الطلب من الجهات المختصة</li>
                        <li><strong className="text-[var(--text-primary)]">مقدمي الخدمات:</strong> مثل Firebase وAlgolia لتشغيل المنصة</li>
                    </ul>
                </Section>

                <Section title="4. أمان البيانات">
                    <p>نتخذ إجراءات أمنية لحماية بياناتك:</p>
                    <ul className="list-disc list-inside space-y-1 marker:text-[var(--nebula-500)]">
                        <li>تشفير البيانات أثناء النقل (HTTPS)</li>
                        <li>مصادقة آمنة عبر Google OAuth</li>
                        <li>قواعد أمان صارمة لقاعدة البيانات</li>
                        <li>فصل صلاحيات الوصول للبيانات</li>
                    </ul>
                </Section>

                <Section title="5. حقوقك">
                    <p>لديك الحق في:</p>
                    <ul className="list-disc list-inside space-y-1 marker:text-[var(--nebula-500)]">
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
                    <ul className="list-disc list-inside space-y-1 marker:text-[var(--nebula-500)]">
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
                    <p className="mb-4">
                        لأي استفسارات حول سياسة الخصوصية، يمكنك التواصل معنا عبر:
                    </p>
                    <div className="card p-6 flex items-center gap-4 group hover:border-[var(--nebula-500)] transition-colors">
                        <span className="text-3xl group-hover:scale-110 transition-transform duration-200">📧</span>
                        <div>
                            <p className="text-sm text-[var(--text-muted)] mb-1">البريد الإلكتروني</p>
                            <a href="mailto:privacy@universe-app.com" className="text-[var(--nebula-400)] hover:text-[var(--nebula-300)] font-mono text-lg transition-colors">
                                privacy@universe-app.com
                            </a>
                        </div>
                    </div>
                </Section>
            </div>

            {/* Footer */}
            <div className="mt-16 pt-8 border-t border-[var(--glass-border)] text-center text-sm text-[var(--text-muted)]">
                <Link href="/about" className="hover:text-[var(--nebula-400)] transition-colors">عن المنصة</Link>
                <span className="mx-3 text-[var(--space-600)]">•</span>
                <Link href="/terms" className="hover:text-[var(--nebula-400)] transition-colors">الشروط والأحكام</Link>
            </div>
        </main>
    );
}

// ============================================
// Section Component
// ============================================

function Section({ title, children }: { title: string; children: React.ReactNode }) {
    return (
        <section className="card p-6 md:p-8 hover:bg-[var(--glass-bg-elevated)] transition-colors duration-300">
            <h2 className="text-xl font-bold text-[var(--text-primary)] mb-4 pb-2 border-b border-[var(--glass-border)] border-dashed">
                {title}
            </h2>
            <div className="text-[var(--text-secondary)] leading-relaxed space-y-3">{children}</div>
        </section>
    );
}
