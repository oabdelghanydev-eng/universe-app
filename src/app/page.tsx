// Home Page - Landing and authenticated dashboard
import Link from 'next/link';
import { getServerSession } from '@/lib/auth';
import { adminDb } from '@/lib/firebase/admin';
import ListingsFeed from '@/components/features/ListingsFeed';
import { MeteorShower } from '@/components/effects/CosmicBackground';
import BrandText from '@/components/ui/BrandText';
import {
    ShieldCheck,
    Search,
    UserPlus,
    Rocket,
    Clock,
    Coins,
    CheckCircle2,
    Users,
    Hand,
    Sparkles,
    User,
    ClipboardList
} from 'lucide-react';

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
                        <div className="flex justify-center mb-8">
                            <div className="flex items-center gap-3 select-none group scale-150" dir="ltr">
                                <div className="relative flex items-center justify-center transition-transform duration-500 group-hover:scale-105" style={{ width: 96, height: 96 }}>
                                    <svg width="100%" height="100%" viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg" className="overflow-visible">
                                        <defs>
                                            <linearGradient id="cyanStreamLogo" x1="100%" y1="0%" x2="0%" y2="100%">
                                                <stop offset="0%" stopColor="#67e8f9"></stop>
                                                <stop offset="50%" stopColor="#22d3ee"></stop>
                                                <stop offset="100%" stopColor="#06b6d4"></stop>
                                            </linearGradient>
                                            <linearGradient id="purpleStreamLogo" x1="100%" y1="0%" x2="0%" y2="100%">
                                                <stop offset="0%" stopColor="#a855f7"></stop>
                                                <stop offset="50%" stopColor="#d946ef"></stop>
                                                <stop offset="100%" stopColor="#c026d3"></stop>
                                            </linearGradient>
                                            <filter id="cyanGlowLogo" x="-100%" y="-100%" width="300%" height="300%">
                                                <feGaussianBlur stdDeviation="12" result="blur"></feGaussianBlur>
                                                <feFlood floodColor="#22d3ee" floodOpacity="0.8"></feFlood>
                                                <feComposite in2="blur" operator="in"></feComposite>
                                                <feMerge>
                                                    <feMergeNode></feMergeNode>
                                                    <feMergeNode in="SourceGraphic"></feMergeNode>
                                                </feMerge>
                                            </filter>
                                            <filter id="purpleGlowLogo" x="-100%" y="-100%" width="300%" height="300%">
                                                <feGaussianBlur stdDeviation="10" result="blur"></feGaussianBlur>
                                                <feFlood floodColor="#d946ef" floodOpacity="0.75"></feFlood>
                                                <feComposite in2="blur" operator="in"></feComposite>
                                                <feMerge>
                                                    <feMergeNode></feMergeNode>
                                                    <feMergeNode in="SourceGraphic"></feMergeNode>
                                                </feMerge>
                                            </filter>
                                        </defs>
                                        <g filter="url(#cyanGlowLogo)" opacity="0.4">
                                            <path d="M 480 30 C 430 30, 400 60, 370 140 C 355 180, 355 240, 385 320 C 405 380, 360 460, 256 470 C 150 480, 80 420, 90 340 C 100 260, 150 220, 120 140 C 100 80, 60 50, 30 40" fill="none" stroke="url(#cyanStreamLogo)" strokeWidth="56" strokeLinecap="round"></path>
                                        </g>
                                        <g filter="url(#purpleGlowLogo)" opacity="0.35">
                                            <path d="M 460 55 C 415 55, 385 85, 355 160 C 342 200, 342 255, 370 330 C 388 385, 345 445, 256 450 C 170 455, 105 400, 112 325 C 120 250, 165 210, 138 135 C 118 80, 78 58, 45 50" fill="none" stroke="url(#purpleStreamLogo)" strokeWidth="44" strokeLinecap="round"></path>
                                        </g>
                                        <path d="M 488 25 C 435 25, 408 55, 378 135 C 362 175, 362 235, 392 315 C 412 375, 368 465, 256 478 C 145 490, 70 425, 82 342 C 92 262, 142 222, 112 142 C 92 82, 52 45, 20 35" fill="none" stroke="#67e8f9" strokeWidth="8" strokeLinecap="round" strokeDasharray="100 800" className="animate-[dash-flow_5s_linear_infinite]"></path>
                                        <path d="M 488 25 C 435 25, 408 55, 378 135 C 362 175, 362 235, 392 315 C 412 375, 368 465, 256 478 C 145 490, 70 425, 82 342 C 92 262, 142 222, 112 142 C 92 82, 52 45, 20 35" fill="none" stroke="#67e8f9" strokeWidth="8" strokeLinecap="round" strokeOpacity="0.25"></path>
                                        <path d="M 482 32 C 432 32, 402 62, 372 142 C 358 182, 358 242, 388 322 C 408 382, 362 462, 256 472 C 148 482, 75 422, 86 340 C 96 260, 146 220, 116 140 C 96 80, 56 48, 25 38" fill="none" stroke="url(#cyanStreamLogo)" strokeWidth="13" strokeLinecap="round"></path>
                                        <path d="M 445 68 C 405 68, 375 95, 345 168 C 330 208, 330 262, 360 338 C 378 392, 335 440, 256 442 C 178 448, 115 395, 122 318 C 130 245, 175 205, 148 130 C 128 75, 88 62, 55 58" fill="none" stroke="#d946ef" strokeWidth="10" strokeLinecap="round" strokeDasharray="80 600" className="animate-[dash-flow-reverse_6s_linear_infinite]"></path>
                                        <path d="M 445 68 C 405 68, 375 95, 345 168 C 330 208, 330 262, 360 338 C 378 392, 335 440, 256 442 C 178 448, 115 395, 122 318 C 130 245, 175 205, 148 130 C 128 75, 88 62, 55 58" fill="none" stroke="#d946ef" strokeWidth="10" strokeLinecap="round" strokeOpacity="0.25"></path>
                                        <path d="M 420 95 C 382 95, 358 118, 328 185 C 312 225, 312 275, 342 352 C 360 405, 318 425, 256 422 C 195 425, 138 380, 142 305 C 150 235, 192 195, 168 125 C 148 70, 108 80, 78 75" fill="none" stroke="#22d3ee" strokeWidth="3" strokeLinecap="round" filter="url(#cyanGlow_logo)"></path>
                                        <g fill="#e2e8f0" opacity="0.65">
                                            <circle cx="470" cy="50" r="1.5"></circle>
                                            <circle cx="360" cy="180" r="1.2"></circle>
                                            <circle cx="390" cy="375" r="1.5"></circle>
                                            <circle cx="200" cy="465" r="1.5"></circle>
                                            <circle cx="100" cy="360" r="1.2"></circle>
                                            <circle cx="150" cy="250" r="1"></circle>
                                            <circle cx="40" cy="55" r="1.2"></circle>
                                        </g>
                                    </svg>
                                </div>
                            </div>
                        </div>

                        {/* Title */}
                        <h1 className="text-5xl md:text-7xl font-extrabold mb-6" dir="ltr">
                            <span className="text-white">Uni</span><span className="text-shimmer">Verse</span>
                        </h1>

                        {/* Subtitle */}
                        <p className="text-xl md:text-3xl font-bold text-[var(--text-primary)] mb-4 max-w-3xl mx-auto leading-tight flex items-center justify-center gap-3">
                            مجتمعك الجامعي، في مكان واحد
                            <Rocket className="w-8 h-8 text-[var(--nebula-400)] animate-gentle-float" />
                        </p>
                        <p className="text-lg text-[var(--text-secondary)] mb-10 max-w-xl mx-auto leading-relaxed">
                            اعرض منتجاتك، اشتري اللي ناقصك، وقدم خدماتك لزمايلك في الجامعة.
                            <br />
                            <span className="text-[var(--nebula-400)]">آمن. موثق. حصري للطلاب.</span>
                        </p>

                        {/* CTA Buttons */}
                        <div className="flex gap-4 justify-center flex-wrap">
                            <Link
                                href="/register"
                                className="btn btn-primary btn-lg shadow-nebula-lg hover:scale-105 transition-transform"
                            >
                                سجل بإيميل الجامعة
                            </Link>
                            <Link
                                href="/login"
                                className="btn btn-secondary btn-lg"
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

            {/* Features Section - Bento Grid */}
            <section className="py-24 relative overflow-hidden" dir="rtl">
                <div className="container mx-auto px-4">
                    {/* Section Header */}
                    <div className="text-center mb-16 relative z-10">
                        <h2 className="text-4xl md:text-6xl font-extrabold mb-6 flex flex-col md:flex-row items-center justify-center gap-3">
                            <span className="text-slate-100">لماذا</span>
                            <BrandText size="custom" className="text-4xl md:text-6xl" />
                            <span className="text-slate-100 md:hidden">؟</span>
                        </h2>
                        <p className="text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
                            أكثر من مجرد سوق.. هو مجتمع متكامل مصمم خصيصاً لطلاب جامعة برج العرب التكنولوجية
                        </p>
                    </div>

                    {/* Bento Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto relative z-10">

                        {/* Card 1: Safety (Large) - Right aligned text, Icon on left */}
                        <div className="md:col-span-2 group relative overflow-hidden rounded-3xl bg-slate-900/50 border border-slate-800 p-8 transition-all hover:border-cyan-500/50 hover:shadow-lg hover:shadow-cyan-500/20 backdrop-blur-sm">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-cyan-500/20 transition-colors" />
                            <div className="relative z-10 h-full flex flex-col md:flex-row items-start gap-8">
                                <div className="flex-1 text-right">
                                    <h3 className="text-2xl font-bold text-slate-100 mb-3 flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-cyan-500/20 flex items-center justify-center">
                                            <ShieldCheck className="w-6 h-6 text-cyan-400" />
                                        </div>
                                        أمان وهوية موثقة 100%
                                    </h3>
                                    <p className="text-slate-400 text-lg leading-relaxed mb-6">
                                        بيئة مغلقة للطلاب فقط. يتم التحقق من كل مستخدم عبر البريد الجامعي الرسمي (Google OAuth) والرقم الأكاديمي.
                                    </p>
                                    <div className="inline-flex items-center gap-2 text-sm text-cyan-300 bg-cyan-500/10 px-4 py-2 rounded-full border border-cyan-500/20">
                                        <CheckCircle2 className="w-4 h-4" />
                                        <span>مقارنة مع بيانات شئون الطلبة</span>
                                    </div>
                                </div>
                                {/* Decorative Visual for Large Card */}
                                <div className="hidden md:flex flex-col items-center justify-center w-48 h-full bg-slate-800/30 rounded-2xl border border-slate-700/50 p-4">
                                    <ShieldCheck className="w-16 h-16 text-cyan-500/50 mb-2" />
                                    <span className="text-xs text-cyan-200/50 font-mono">Verified Student</span>
                                </div>
                            </div>
                        </div>

                        {/* Card 2: Speed (Standard) */}
                        <div className="md:col-span-1 group relative overflow-hidden rounded-3xl bg-slate-900/50 border border-slate-800 p-8 transition-all hover:border-blue-500/50 hover:shadow-lg hover:shadow-blue-500/20 backdrop-blur-sm text-right">
                            <div className="absolute bottom-0 left-0 w-40 h-40 bg-blue-500/10 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2" />
                            <div className="relative z-10 flex flex-col items-start h-full">
                                <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center mb-6 shadow-lg group-hover:rotate-12 transition-transform duration-300">
                                    <Search className="w-6 h-6 text-blue-400" />
                                </div>
                                <h3 className="text-xl font-bold text-slate-100 mb-3">بحث ذكي ولحظي</h3>
                                <p className="text-slate-400 leading-relaxed mb-4">
                                    محرك بحث فائق السرعة (<span className="text-blue-400 font-mono font-bold">50ms</span>) يوصلك للي محتاجه فوراً.
                                </p>
                            </div>
                        </div>

                        {/* Card 3: Free (Standard) */}
                        <div className="md:col-span-1 group relative overflow-hidden rounded-3xl bg-slate-900/50 border border-slate-800 p-8 transition-all hover:border-emerald-500/50 hover:shadow-lg hover:shadow-emerald-500/20 backdrop-blur-sm text-right">
                            <div className="absolute top-0 right-0 w-40 h-40 bg-emerald-500/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />
                            <div className="relative z-10 flex flex-col items-start h-full">
                                <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300">
                                    <Coins className="w-6 h-6 text-emerald-400" />
                                </div>
                                <h3 className="text-xl font-bold text-slate-100 mb-3">صفر تكلفة</h3>
                                <p className="text-slate-400 leading-relaxed">
                                    منصة مجانية بالكامل. لا عمولات على البيع، ولا رسوم خفية.
                                </p>
                            </div>
                        </div>

                        {/* Card 4: Community (Large) */}
                        <div className="md:col-span-2 group relative overflow-hidden rounded-3xl bg-slate-900/50 border border-slate-800 p-8 transition-all hover:border-rose-500/50 hover:shadow-lg hover:shadow-rose-500/20 backdrop-blur-sm">
                            <div className="absolute top-0 left-0 w-64 h-64 bg-rose-500/10 rounded-full blur-3xl -translate-y-1/2 -translate-x-1/2 group-hover:bg-rose-500/20 transition-colors" />
                            <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
                                <div className="flex-1 text-right">
                                    <h3 className="text-2xl font-bold text-slate-100 mb-3 flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-rose-500/20 flex items-center justify-center">
                                            <UserPlus className="w-6 h-6 text-rose-400" />
                                        </div>
                                        مجتمع طلابي متكامل
                                    </h3>
                                    <p className="text-slate-400 text-lg leading-relaxed">
                                        مش بس بيع وشراء.. تقدر تتبادل خبرات، تلاقي شريك سكن، أو حتى تعرض خدماتك.
                                    </p>
                                </div>
                                {/* Mini Stats Visual for Large Card */}
                                <div className="flex gap-4">
                                    <div className="flex flex-col items-center justify-center px-6 py-4 bg-slate-800/50 rounded-2xl border border-slate-700 hover:border-rose-500/50 transition-colors min-w-[110px]">
                                        <Users className="w-6 h-6 text-rose-400 mb-2" />
                                        <div className="text-xl font-bold text-white mb-0.5">+1000</div>
                                        <div className="text-xs text-slate-400">طالب نشط</div>
                                    </div>
                                    <div className="flex flex-col items-center justify-center px-6 py-4 bg-slate-800/50 rounded-2xl border border-slate-700 hover:border-rose-500/50 transition-colors min-w-[110px]">
                                        <Clock className="w-6 h-6 text-rose-400 mb-2" />
                                        <div className="text-xl font-bold text-white mb-0.5">24/7</div>
                                        <div className="text-xs text-slate-400">متاح دائماً</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </section>

            {/* How it Works Section - Presentation Style */}
            <section className="py-24 relative overflow-hidden" dir="rtl">
                {/* Background Gradient */}
                <div className="absolute inset-0 bg-gradient-to-b from-slate-950/80 via-slate-900/50 to-slate-950/80" />

                <div className="container mx-auto px-4 relative z-10">
                    {/* Section Header */}
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-5xl font-extrabold mb-4 flex flex-col md:flex-row items-center justify-center gap-3">
                            <span className="text-slate-100">إزاي تبدأ في</span>
                            <BrandText size="custom" className="text-3xl md:text-5xl" />
                            <span className="text-slate-100">؟</span>
                        </h2>
                        <p className="text-lg text-slate-400">3 خطوات سهلة وتكون جاهز</p>
                    </div>

                    {/* Steps Cards - Presentation Style */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto mb-16">

                        {/* Step 1: Register */}
                        <div className="group relative">
                            {/* Floating Number Badge */}
                            <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-20">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-400 to-cyan-600 flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-cyan-500/30 group-hover:scale-110 transition-transform">
                                    1
                                </div>
                            </div>
                            {/* Card */}
                            <div className="pt-8 pb-6 px-6 bg-slate-900/80 backdrop-blur-sm border border-slate-800 rounded-2xl text-center hover:border-cyan-500/40 hover:shadow-lg hover:shadow-cyan-500/10 transition-all">
                                <h3 className="text-lg font-bold text-slate-100 mb-2">سجل بإيميل الجامعة</h3>
                                <p className="text-sm text-slate-400 leading-relaxed">
                                    عشان نضمن أمانك، التسجيل متاح فقط لطلاب الجامعة باستخدام الإيميل الجامعي.
                                </p>
                            </div>
                        </div>

                        {/* Step 2: Browse/Post */}
                        <div className="group relative">
                            <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-20">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-rose-400 to-rose-600 flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-rose-500/30 group-hover:scale-110 transition-transform">
                                    2
                                </div>
                            </div>
                            <div className="pt-8 pb-6 px-6 bg-slate-900/80 backdrop-blur-sm border border-slate-800 rounded-2xl text-center hover:border-rose-500/40 hover:shadow-lg hover:shadow-rose-500/10 transition-all">
                                <h3 className="text-lg font-bold text-slate-100 mb-2">ارفع إعلانك أو تصفح</h3>
                                <p className="text-sm text-slate-400 leading-relaxed">
                                    صور كتبك القديمة، أدواتك، أو أي حاجة مش محتاجها وارفعها في ثواني، أو دور على اللي ناقصك.
                                </p>
                            </div>
                        </div>

                        {/* Step 3: Complete */}
                        <div className="group relative">
                            <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-20">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-blue-500/30 group-hover:scale-110 transition-transform">
                                    3
                                </div>
                            </div>
                            <div className="pt-8 pb-6 px-6 bg-slate-900/80 backdrop-blur-sm border border-slate-800 rounded-2xl text-center hover:border-blue-500/40 hover:shadow-lg hover:shadow-blue-500/10 transition-all">
                                <h3 className="text-lg font-bold text-slate-100 mb-2">تواصل وتمم البيعة</h3>
                                <p className="text-sm text-slate-400 leading-relaxed">
                                    اتفق مع البائع أو المشتري عبر الواتساب، وتقابلوا في الحرم الجامعي للاستلام.
                                </p>
                            </div>
                        </div>

                    </div>

                    {/* Stats Bar - Presentation Style */}
                    <div className="max-w-4xl mx-auto">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {/* Stat 1: Unlimited */}
                            <div className="text-center py-6 px-4 bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-xl hover:border-slate-700 transition-colors">
                                <div className="text-3xl md:text-4xl font-bold text-slate-200 mb-1">∞</div>
                                <div className="text-sm text-slate-500">إعلانات مجانية</div>
                            </div>
                            {/* Stat 2: Zero Cost */}
                            <div className="text-center py-6 px-4 bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-xl hover:border-slate-700 transition-colors">
                                <div className="text-3xl md:text-4xl font-bold text-cyan-400 mb-1">0</div>
                                <div className="text-sm text-slate-500">صفر تكلفة</div>
                            </div>
                            {/* Stat 3: 24/7 */}
                            <div className="text-center py-6 px-4 bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-xl hover:border-slate-700 transition-colors">
                                <div className="text-3xl md:text-4xl font-bold text-rose-400 mb-1">24/7</div>
                                <div className="text-sm text-slate-500">متاح دائماً</div>
                            </div>
                            {/* Stat 4: 100% Verified */}
                            <div className="text-center py-6 px-4 bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-xl hover:border-slate-700 transition-colors">
                                <div className="text-3xl md:text-4xl font-bold text-emerald-400 mb-1">100%</div>
                                <div className="text-sm text-slate-500">طلاب موثقين</div>
                            </div>
                        </div>
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
                    <Hand className="w-6 h-6 text-[var(--nebula-400)]" />
                    <p className="text-[var(--text-muted)] font-medium">{greeting}</p>
                </div>
                <h1 className="text-2xl md:text-3xl font-bold text-[var(--text-primary)] flex items-center gap-2">
                    منور يا {firstName}
                    <Sparkles className="w-6 h-6 text-[var(--accent-400)]" />
                </h1>
            </div>

            {/* Quick Actions Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12 animate-fade-slide-up" style={{ animationDelay: '0.1s' }}>
                <ActionCard
                    href="/listing/new"
                    title="انشر إعلان جديد"
                    description="بيع كتب، أدوات، أو اعرض خدماتك لزمايلك"
                    icon={<Sparkles className="w-6 h-6" />}
                    variant="primary"
                />
                <ActionCard
                    href="/profile"
                    title="إعلاناتي وملفي"
                    description="تابع حالة إعلاناتك، الرسايل، وتعديل بياناتك"
                    icon={<User className="w-6 h-6" />}
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
                    <ClipboardList className="w-12 h-12 text-[var(--nebula-400)]" />
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
    icon: React.ReactNode;
    title: string;
    description: string;
    gradient: string;
}) {
    return (
        <div className="card card-interactive p-6 rounded-2xl group">
            {/* Icon */}
            <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center mb-5 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                {icon}
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
// Action Card Component
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
    icon: React.ReactNode;
    variant: 'primary' | 'secondary'
}) {
    const isPrimary = variant === 'primary';
    return (
        <Link
            href={href}
            className={`flex items-start gap-4 p-6 rounded-2xl border transition-all duration-300 group
                ${isPrimary
                    ? 'bg-gradient-to-br from-cyan-500/10 via-violet-500/5 to-transparent border-cyan-500/30 hover:border-cyan-400/60 hover:shadow-lg hover:shadow-cyan-500/20'
                    : 'bg-gradient-to-br from-rose-500/10 via-slate-800/50 to-transparent border-slate-700/50 hover:border-rose-400/40 hover:shadow-lg hover:shadow-rose-500/10'
                }`}
        >
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-lg transition-all duration-300 group-hover:scale-110
                ${isPrimary
                    ? 'bg-gradient-to-br from-cyan-500 to-violet-600 text-white'
                    : 'bg-gradient-to-br from-rose-500 to-orange-500 text-white'}`}>
                {icon}
            </div>
            <div>
                <h3 className={`text-lg font-bold mb-1 transition-colors
                    ${isPrimary
                        ? 'text-slate-100 group-hover:text-cyan-400'
                        : 'text-slate-100 group-hover:text-rose-400'}`}>
                    {title}
                </h3>
                <p className="text-slate-400 text-sm leading-relaxed">
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

