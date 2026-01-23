// Home Page - Landing and authenticated dashboard
import Link from 'next/link';
import { getServerSession } from '@/lib/auth';
import { adminDb } from '@/lib/firebase/admin';
import ListingsFeed from '@/components/features/ListingsFeed';
import { MeteorShower } from '@/components/effects/CosmicBackground';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
    const session = await getServerSession();

    let isRegistered = false;
    let userName = '';

    if (session) {
        const userDoc = await adminDb.collection('users').doc(session.uid).get();
        if (userDoc.exists) {
            isRegistered = true;
            userName = userDoc.data()?.fullName || '';
        }
    }

    if (session && isRegistered) {
        return <AuthenticatedHome userName={userName} />;
    } else if (session && !isRegistered) {
        return <CompleteRegistrationPrompt />;
    } else {
        return <LandingPage />;
    }
}

// ============================================
// Landing Page (for guests)
// ============================================
function LandingPage() {
    return (
        <div className="min-h-screen relative">
            {/* Extra Meteors for Landing Page Only */}
            <MeteorShower count={5} />

            {/* Hero Section */}
            <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden">
                {/* Background Decorations */}
                <div className="absolute inset-0 overflow-hidden">
                    {/* Gradient Orbs */}
                    <div className="absolute top-1/4 -right-32 w-96 h-96 bg-nebula-500/20 rounded-full blur-3xl animate-gentle-float" />
                    <div className="absolute bottom-1/4 -left-32 w-80 h-80 bg-stellar-500/15 rounded-full blur-3xl animate-gentle-float" style={{ animationDelay: '-2s' }} />
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-nebula-600/10 rounded-full blur-3xl" />
                </div>

                {/* Content */}
                <div className="relative z-10 container mx-auto px-4 text-center">
                    <div className="animate-fade-slide-up">
                        {/* Logo Mark */}
                        <div className="inline-flex items-center justify-center w-24 h-24 rounded-3xl glass-elevated mb-8 shadow-nebula animate-pulse-glow pulse-ring">
                            <span className="text-5xl">🎓</span>
                        </div>

                        {/* Title */}
                        <h1 className="text-5xl md:text-7xl font-extrabold mb-6">
                            <span className="text-shimmer">UniVerse</span>
                        </h1>

                        {/* Subtitle */}
                        <p className="text-xl md:text-3xl font-bold text-[var(--text-primary)] mb-4 max-w-3xl mx-auto leading-tight">
                            مجتمعك الجامعي، في مكان واحد 🚀
                        </p>
                        <p className="text-lg text-[var(--text-secondary)] mb-10 max-w-xl mx-auto leading-relaxed">
                            بيع كتبك، اشتري اللي ناقصك، وقدم خدماتك لزمايلك في الجامعة.
                            <br />
                            <span className="text-[var(--nebula-400)]">آمن. موثق. حصري للطلاب.</span>
                        </p>

                        {/* CTA Buttons */}
                        <div className="flex gap-4 justify-center flex-wrap">
                            <Link
                                href="/register"
                                className="btn btn-primary px-8 py-4 text-lg shadow-nebula-lg hover:scale-105 transition-transform"
                            >
                                سجل بإيميل الجامعة
                            </Link>
                            <Link
                                href="/login"
                                className="btn btn-secondary px-8 py-4 text-lg"
                            >
                                دخول
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Scroll Indicator */}
                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
                    <div className="w-6 h-10 rounded-full border-2 border-[var(--text-muted)] flex items-start justify-center p-2">
                        <div className="w-1.5 h-2.5 bg-[var(--text-muted)] rounded-full animate-pulse" />
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-24 relative">
                <div className="container mx-auto px-4">
                    {/* Section Header */}
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-[var(--text-primary)] mb-4">
                            لماذا UniVerse؟
                        </h2>
                        <p className="text-[var(--text-secondary)] max-w-xl mx-auto">
                            منصة مصممة خصيصاً لاحتياجات طلاب الجامعة
                        </p>
                    </div>

                    {/* Features Grid */}
                    <div className="grid md:grid-cols-3 gap-6">
                        <FeatureCard
                            icon="🔐"
                            title="أمان مضمون"
                            description="تسجيل عبر Google OAuth والتحقق من هوية الطالب قبل النشر"
                            gradient="from-nebula-500 to-nebula-600"
                        />
                        <FeatureCard
                            icon="📱"
                            title="تواصل مباشر"
                            description="تواصل فوري عبر واتساب أو مكالمة هاتفية مع البائع"
                            gradient="from-stellar-500 to-stellar-600"
                        />
                        <FeatureCard
                            icon="🔍"
                            title="بحث سريع"
                            description="ابحث عن أي منتج أو خدمة بسهولة وفلتر حسب النوع"
                            gradient="from-aurora-info to-nebula-500"
                        />
                    </div>
                </div>
            </section>

            {/* How it Works Section */}
            <section className="py-20 relative overflow-hidden">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-[var(--text-primary)] mb-4">
                            كيف يعمل UniVerse؟
                        </h2>
                        <p className="text-[var(--text-secondary)]">3 خطوات بسيطة للبدء</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8 relative z-10">
                        <StepCard
                            number="1"
                            title="سجل حسابك"
                            description="استخدم إيميلك الجامعي عشان نضمن إن كل المستخدمين طلاب حقيقيين."
                        />
                        <StepCard
                            number="2"
                            title="تصفح أو انشر"
                            description="دور على اللي ناقصك أو صور حاجاتك اللي مش محتاجها واعرضها للبيع."
                        />
                        <StepCard
                            number="3"
                            title="تواصل بأمان"
                            description="اتفق مع البائع أو المشتري عبر الواتساب وتقابلوا في الجامعة."
                        />
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="py-16 border-t border-b border-[var(--glass-border)] bg-[var(--glass-bg)]">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        <StatCard number="100%" label="طلاب موثقين" />
                        <StatCard number="24/7" label="متاح دائماً" />
                        <StatCard number="0ج" label="عمولة بيع" />
                        <StatCard number="∞" label="إعلانات مجانية" />
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-24">
                <div className="container mx-auto px-4 text-center">
                    <div className="card-elevated max-w-2xl mx-auto p-12 rounded-3xl">
                        <h2 className="text-2xl md:text-3xl font-bold text-[var(--text-primary)] mb-4">
                            جاهز للبدء؟
                        </h2>
                        <p className="text-[var(--text-secondary)] mb-8">
                            انضم إلى مجتمع طلاب الجامعة وابدأ البيع أو الشراء الآن
                        </p>
                        <Link
                            href="/register"
                            className="btn btn-primary px-10 py-4 text-lg"
                        >
                            إنشاء حساب مجاني
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
}

// ============================================
// Authenticated Home (for registered users)
// ============================================
function AuthenticatedHome({ userName }: { userName: string }) {
    const firstName = userName.split(' ')[0];
    const greeting = getGreeting();

    return (
        <div className="container mx-auto px-4 py-8">
            {/* Welcome Section */}
            <div className="mb-8 animate-fade-slide-up">
                <div className="flex items-center gap-2 mb-2">
                    <span className="text-2xl">👋</span>
                    <p className="text-[var(--text-muted)] font-medium">{greeting}</p>
                </div>
                <h1 className="text-2xl md:text-3xl font-bold text-[var(--text-primary)]">
                    منور يا {firstName} 🌟
                </h1>
            </div>

            {/* Quick Actions Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12 animate-fade-slide-up" style={{ animationDelay: '0.1s' }}>
                <ActionCard
                    href="/listing/new"
                    title="انشر إعلان جديد"
                    description="بيع كتب، أدوات، أو اعرض خدماتك لزمايلك"
                    icon="✨"
                    variant="primary"
                />
                <ActionCard
                    href="/profile"
                    title="إعلاناتي وملفي"
                    description="تابع حالة إعلاناتك، الرسايل، وتعديل بياناتك"
                    icon="👤"
                    variant="secondary"
                />
            </div>

            {/* Listings Feed */}
            <section>
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-[var(--text-primary)]">
                        تصفح الإعلانات
                    </h2>
                </div>
                <ListingsFeed />
            </section>
        </div>
    );
}

// ============================================
// Complete Registration Prompt
// ============================================
function CompleteRegistrationPrompt() {
    return (
        <div className="min-h-[70vh] flex items-center justify-center px-4">
            <div className="text-center max-w-md animate-fade-slide-up">
                <div className="inline-flex items-center justify-center w-24 h-24 rounded-2xl glass-elevated mb-8 animate-gentle-float">
                    <span className="text-5xl">📋</span>
                </div>
                <h1 className="text-2xl md:text-3xl font-bold text-[var(--text-primary)] mb-4">
                    أكمل تسجيلك
                </h1>
                <p className="text-[var(--text-secondary)] mb-8 leading-relaxed">
                    سجلت دخول بنجاح! الآن أدخل بياناتك الأكاديمية لإكمال التسجيل والبدء في استخدام المنصة.
                </p>
                <Link
                    href="/register"
                    className="btn btn-primary px-8 py-3.5 text-lg"
                >
                    أكمل التسجيل الآن
                </Link>
            </div>
        </div>
    );
}

// ============================================
// Feature Card Component
// ============================================
function FeatureCard({
    icon,
    title,
    description,
    gradient
}: {
    icon: string;
    title: string;
    description: string;
    gradient: string;
}) {
    return (
        <div className="card card-interactive p-6 rounded-2xl group">
            {/* Icon */}
            <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center mb-5 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                <span className="text-2xl">{icon}</span>
            </div>

            {/* Content */}
            <h3 className="text-xl font-bold text-[var(--text-primary)] mb-2">
                {title}
            </h3>
            <p className="text-[var(--text-secondary)] text-sm leading-relaxed">
                {description}
            </p>
        </div>
    );
}

// ============================================
// Stat Card Component
// ============================================
function StatCard({ number, label }: { number: string; label: string }) {
    return (
        <div className="text-center group">
            <div className="text-3xl md:text-4xl font-bold text-gradient mb-2 group-hover:scale-110 transition-transform duration-300">
                {number}
            </div>
            <div className="text-[var(--text-muted)] text-sm font-medium">
                {label}
            </div>
        </div>
    );
}

// ============================================
// Step Card Component (New)
// ============================================
function StepCard({ number, title, description }: { number: string; title: string; description: string }) {
    return (
        <div className="relative p-6 rounded-2xl glass hover:bg-[var(--glass-bg-elevated)] transition-colors text-center group">
            <div className="w-12 h-12 bg-[var(--nebula-500)] text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4 shadow-nebula group-hover:scale-110 transition-transform">
                {number}
            </div>
            <h3 className="text-xl font-bold text-[var(--text-primary)] mb-3">
                {title}
            </h3>
            <p className="text-[var(--text-secondary)] leading-relaxed">
                {description}
            </p>
        </div>
    );
}

// ============================================
// Action Card Component (New)
// ============================================
function ActionCard({
    href,
    title,
    description,
    icon,
    variant
}: {
    href: string;
    title: string;
    description: string;
    icon: string;
    variant: 'primary' | 'secondary'
}) {
    const isPrimary = variant === 'primary';
    return (
        <Link
            href={href}
            className={`flex items-start gap-4 p-6 rounded-2xl border transition-all duration-300 group
                ${isPrimary
                    ? 'bg-gradient-to-br from-nebula-500/10 to-nebula-600/5 border-nebula-500/20 hover:border-nebula-500/50 hover:shadow-nebula'
                    : 'glass border-[var(--glass-border)] hover:border-[var(--text-muted)] hover:bg-[var(--glass-bg-elevated)]'
                }`}
        >
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl shadow-sm transition-transform group-hover:scale-110
                ${isPrimary ? 'bg-nebula-500 text-white' : 'bg-[var(--surface-elevated)] text-[var(--text-primary)]'}`}>
                {icon}
            </div>
            <div>
                <h3 className="text-lg font-bold text-[var(--text-primary)] mb-1 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-nebula-400 group-hover:to-stellar-400 transition-colors">
                    {title}
                </h3>
                <p className="text-[var(--text-secondary)] text-sm leading-relaxed">
                    {description}
                </p>
            </div>
        </Link>
    );
}

// ============================================
// Helper: Get Greeting based on time
// ============================================
// Static greeting to avoid server timezone issues (Vercel uses UTC)
function getGreeting(): string {
    return 'مرحباً';
}

