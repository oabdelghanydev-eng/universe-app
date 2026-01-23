import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'الشروط والأحكام | UniVerse',
    description: 'الشروط والأحكام لاستخدام منصة UniVerse',
};

export default function TermsPage() {
    return (
        <main className="container mx-auto px-4 py-12 max-w-4xl animate-fade-slide-up">
            {/* Header */}
            <div className="mb-12">
                <Link href="/" className="text-[var(--nebula-400)] hover:text-[var(--nebula-300)] hover:underline mb-4 inline-flex items-center gap-2 transition-colors">
                    <span>←</span> العودة للرئيسية
                </Link>
                <div className="flex items-center gap-4 mb-4">
                    <div className="w-16 h-16 rounded-2xl glass-elevated flex items-center justify-center text-3xl">
                        📜
                    </div>
                    <div>
                        <h1 className="text-3xl md:text-4xl font-bold text-[var(--text-primary)] mb-1">
                            الشروط والأحكام
                        </h1>
                        <p className="text-[var(--text-muted)]">
                            آخر تحديث: يناير 2026
                        </p>
                    </div>
                </div>
            </div>

            {/* Important Notice */}
            <div className="bg-[var(--aurora-warning-muted)] border border-[var(--aurora-warning)]/30 rounded-xl p-6 mb-8 flex gap-4">
                <span className="text-2xl">⚠️</span>
                <p className="text-[var(--aurora-warning)] font-medium leading-relaxed">
                    باستخدامك لمنصة UniVerse، فإنك توافق على هذه الشروط والأحكام.
                    يرجى قراءتها بعناية.
                </p>
            </div>

            {/* Content */}
            <div className="space-y-8">
                <Section title="1. تعريفات">
                    <ul className="list-disc list-inside space-y-2 marker:text-[var(--nebula-500)]">
                        <li><strong className="text-[var(--text-primary)]">"المنصة":</strong> منصة UniVerse وجميع خدماتها</li>
                        <li><strong className="text-[var(--text-primary)]">"المستخدم":</strong> أي شخص يستخدم المنصة</li>
                        <li><strong className="text-[var(--text-primary)]">"الإعلان":</strong> أي منتج أو خدمة معروضة على المنصة</li>
                        <li><strong className="text-[var(--text-primary)]">"الإدارة":</strong> فريق إدارة منصة UniVerse</li>
                    </ul>
                </Section>

                <Section title="2. شروط الأهلية">
                    <ul className="list-disc list-inside space-y-1 marker:text-[var(--nebula-500)]">
                        <li>يجب أن تكون طالباً مسجلاً في الجامعة</li>
                        <li>يجب التحقق من هويتك عبر الرقم الأكاديمي</li>
                        <li>يجب أن تكون قادراً على الدخول في عقود قانونية</li>
                        <li>لا يسمح بالتسجيل بأكثر من حساب</li>
                    </ul>
                </Section>

                <Section title="3. قواعد النشر">
                    <p className="mb-2">عند نشر إعلان، يجب الالتزام بالتالي:</p>
                    <ul className="list-disc list-inside space-y-1 marker:text-[var(--nebula-500)]">
                        <li>المحتوى يجب أن يكون صادقاً ودقيقاً</li>
                        <li>الصور يجب أن تكون للمنتج/الخدمة الفعلية</li>
                        <li>السعر يجب أن يكون واضحاً (أو "تواصل للسعر")</li>
                        <li>رقم الهاتف يجب أن يكون صحيحاً وفعالاً</li>
                    </ul>

                    <h3 className="font-bold text-[var(--text-primary)] mt-6 mb-3">المحتوى المحظور:</h3>
                    <ul className="text-[var(--aurora-danger)] space-y-2">
                        <li className="flex items-start gap-2"><span>❌</span> المنتجات المقلدة أو المسروقة</li>
                        <li className="flex items-start gap-2"><span>❌</span> المحتوى الإباحي أو غير اللائق</li>
                        <li className="flex items-start gap-2"><span>❌</span> الأسلحة والمخدرات والمواد الممنوعة</li>
                        <li className="flex items-start gap-2"><span>❌</span> الخدمات غير القانونية</li>
                        <li className="flex items-start gap-2"><span>❌</span> الغش الأكاديمي (بيع الواجبات، الأبحاث، إلخ)</li>
                        <li className="flex items-start gap-2"><span>❌</span> الإعلانات المضللة أو الاحتيالية</li>
                    </ul>
                </Section>

                <Section title="4. المعاملات بين المستخدمين">
                    <div className="bg-[var(--glass-bg)] border border-[var(--glass-border)] p-4 rounded-lg mb-4">
                        <p className="font-medium text-[var(--text-primary)] flex items-center gap-2">
                            <span>⚠️</span>
                            UniVerse هي منصة للتواصل فقط وليست طرفاً في أي معاملة.
                        </p>
                    </div>
                    <ul className="list-disc list-inside space-y-1 marker:text-[var(--nebula-500)]">
                        <li>جميع المعاملات تتم بين البائع والمشتري مباشرة</li>
                        <li>المنصة غير مسؤولة عن جودة المنتجات أو الخدمات</li>
                        <li>المنصة غير مسؤولة عن أي خلافات أو نزاعات</li>
                        <li>ننصح بالتأكد من المنتج قبل الدفع</li>
                        <li>يفضل الالتقاء في أماكن عامة وآمنة</li>
                    </ul>
                </Section>

                <Section title="5. نظام البلاغات">
                    <ul className="list-disc list-inside space-y-1 marker:text-[var(--nebula-500)]">
                        <li>يمكن لأي مستخدم الإبلاغ عن إعلان مخالف</li>
                        <li>الإعلانات التي تحصل على 3 بلاغات أو أكثر تُخفى تلقائياً للمراجعة</li>
                        <li>البلاغات الكاذبة قد تؤدي لحظر الحساب</li>
                        <li>قرارات الإدارة نهائية</li>
                    </ul>
                </Section>

                <Section title="6. إنهاء الحساب">
                    <p className="mb-2">يحق للإدارة إنهاء أو تعليق حسابك في الحالات التالية:</p>
                    <ul className="list-disc list-inside space-y-1 marker:text-[var(--nebula-500)]">
                        <li>انتهاك هذه الشروط والأحكام</li>
                        <li>نشر محتوى محظور</li>
                        <li>الاحتيال أو محاولة الاحتيال</li>
                        <li>إساءة استخدام نظام البلاغات</li>
                        <li>أي سلوك يضر بالمنصة أو مستخدميها</li>
                    </ul>
                </Section>

                <Section title="7. إخلاء المسؤولية">
                    <ul className="list-disc list-inside space-y-1 marker:text-[var(--nebula-500)]">
                        <li>المنصة تُقدم "كما هي" بدون ضمانات</li>
                        <li>لا نضمن توفر الخدمة بشكل دائم</li>
                        <li>لا نتحمل مسؤولية أي خسائر ناتجة عن استخدام المنصة</li>
                        <li>لا نتحمل مسؤولية تصرفات المستخدمين الآخرين</li>
                    </ul>
                </Section>

                <Section title="8. الملكية الفكرية">
                    <ul className="list-disc list-inside space-y-1 marker:text-[var(--nebula-500)]">
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
                    <p className="mb-4">للاستفسارات حول الشروط والأحكام:</p>
                    <div className="card p-6 flex items-center gap-4 group hover:border-[var(--nebula-500)] transition-colors">
                        <span className="text-3xl group-hover:scale-110 transition-transform duration-200">📧</span>
                        <div>
                            <p className="text-sm text-[var(--text-muted)] mb-1">البريد الإلكتروني</p>
                            <a href="mailto:legal@universe-app.com" className="text-[var(--nebula-400)] hover:text-[var(--nebula-300)] font-mono text-lg transition-colors">
                                legal@universe-app.com
                            </a>
                        </div>
                    </div>
                </Section>
            </div>

            {/* Agreement */}
            <div className="mt-12 glass-elevated border border-[var(--nebula-500)]/30 rounded-xl p-6 text-center shadow-[var(--glass-glow)]">
                <p className="text-[var(--text-primary)] flex items-center justify-center gap-2 text-lg font-medium">
                    <span className="text-2xl">✅</span>
                    باستخدامك للمنصة، فإنك تقر بأنك قرأت وفهمت وتوافق على هذه الشروط والأحكام.
                </p>
            </div>

            {/* Footer */}
            <div className="mt-16 pt-8 border-t border-[var(--glass-border)] text-center text-sm text-[var(--text-muted)]">
                <Link href="/about" className="hover:text-[var(--nebula-400)] transition-colors">عن المنصة</Link>
                <span className="mx-3 text-[var(--space-600)]">•</span>
                <Link href="/privacy" className="hover:text-[var(--nebula-400)] transition-colors">سياسة الخصوصية</Link>
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
