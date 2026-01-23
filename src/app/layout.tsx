// Root Layout - Application shell
import type { Metadata } from 'next';
import { IBM_Plex_Sans_Arabic } from 'next/font/google';
import './globals.css';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import GlobalEffects from '@/components/effects/GlobalEffects';

const ibmPlexSansArabic = IBM_Plex_Sans_Arabic({
    subsets: ['arabic'],
    weight: ['100', '200', '300', '400', '500', '600', '700'],
    variable: '--font-ibm-plex',
    display: 'swap',
});

export const metadata: Metadata = {
    title: 'UniVerse - منصة طلاب الجامعة',
    description: 'منصة مغلقة لطلاب الجامعة لعرض وبيع المنتجات والخدمات',
    keywords: ['جامعة', 'طلاب', 'بيع', 'شراء', 'خدمات', 'منتجات'],
};

export const viewport = {
    width: 'device-width',
    initialScale: 1,
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="ar" dir="rtl" className={ibmPlexSansArabic.variable}>
            <body className="min-h-screen font-sans antialiased flex flex-col">
                {/* Cosmic Background Effects - Visible on all pages */}
                <GlobalEffects />

                <Header />
                {/* Main content with top padding for fixed header */}
                <main className="flex-1 pt-16 relative z-10">
                    {children}
                </main>
                <Footer />
            </body>
        </html>
    );
}

