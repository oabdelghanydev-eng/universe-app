// Root Layout - Application shell
import type { Metadata } from 'next';
import { Cairo } from 'next/font/google';
import './globals.css';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import GlobalEffects from '@/components/effects/GlobalEffects';

const cairo = Cairo({
    subsets: ['arabic', 'latin'],
    display: 'swap',
    variable: '--font-cairo',
});

export const metadata: Metadata = {
    title: 'UniVerse - منصة طلاب الجامعة',
    description: 'منصة مغلقة لطلاب الجامعة لعرض وبيع المنتجات والخدمات',
    keywords: ['جامعة', 'طلاب', 'بيع', 'شراء', 'خدمات', 'منتجات'],
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="ar" dir="rtl" className={cairo.variable}>
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

