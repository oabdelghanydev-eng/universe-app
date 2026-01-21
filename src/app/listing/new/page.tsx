'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ListingForm from '@/components/features/ListingForm';
import { createListing } from '@/actions/listings';
import { checkRegistrationStatus } from '@/actions/auth';
import type { ListingInput } from '@/types';

export default function NewListingPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [requirePhone, setRequirePhone] = useState(false);
    const [isCheckingAuth, setIsCheckingAuth] = useState(true);

    useEffect(() => {
        async function checkUser() {
            try {
                const result = await checkRegistrationStatus();

                if (!result.success || !result.data?.isLoggedIn) {
                    router.push('/login?redirect=/listing/new');
                    return;
                }

                if (!result.data.isRegistered) {
                    router.push('/register');
                    return;
                }

                setRequirePhone(true);
                setIsCheckingAuth(false);
            } catch (err) {
                console.error('Auth check error:', err);
                router.push('/login');
            }
        }

        checkUser();
    }, [router]);

    async function handleSubmit(data: ListingInput, images: File[]) {
        setIsLoading(true);
        setError(null);

        try {
            const imageData = await Promise.all(
                images.map(async (file) => {
                    return new Promise<{ base64: string; contentType: string }>((resolve, reject) => {
                        const reader = new FileReader();
                        reader.onload = () => {
                            const base64 = (reader.result as string).split(',')[1];
                            resolve({
                                base64,
                                contentType: file.type,
                            });
                        };
                        reader.onerror = reject;
                        reader.readAsDataURL(file);
                    });
                })
            );

            const result = await createListing(data, imageData);

            if (!result.success) {
                setError(result.message);

                if (result.code === 'VAL_001') {
                    setRequirePhone(true);
                }
                return;
            }

            router.push(`/listing/${result.data?.id}`);
        } catch (err) {
            console.error('Submit error:', err);
            setError('حدث خطأ في نشر الإعلان');
        } finally {
            setIsLoading(false);
        }
    }

    if (isCheckingAuth) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center">
                <div className="text-center">
                    <div className="relative w-16 h-16 mx-auto mb-4">
                        <div className="absolute inset-0 rounded-full border-2 border-[var(--space-600)] border-t-[var(--nebula-400)] animate-spin" />
                        <div className="absolute inset-3 rounded-full border-2 border-[var(--space-700)] border-b-[var(--stellar-400)] animate-spin" style={{ animationDirection: 'reverse', animationDuration: '0.75s' }} />
                    </div>
                    <p className="text-[var(--text-muted)]">جاري التحميل...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8 max-w-2xl animate-fade-slide-up">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-2xl md:text-3xl font-bold text-[var(--text-primary)] mb-2">
                    📤 نشر إعلان جديد
                </h1>
                <p className="text-[var(--text-secondary)]">
                    أضف تفاصيل إعلانك وسيتم نشره فوراً
                </p>
            </div>

            {/* Error Message */}
            {error && (
                <div className="card p-4 mb-6 border border-[var(--aurora-danger)]/30 bg-[var(--aurora-danger-muted)] rounded-xl">
                    <p className="text-[var(--aurora-danger)]">{error}</p>
                </div>
            )}

            {/* Form Card */}
            <div className="card-elevated p-6 md:p-8 rounded-2xl mb-8">
                <ListingForm
                    onSubmit={handleSubmit}
                    requirePhone={requirePhone}
                    isLoading={isLoading}
                />
            </div>

            {/* Tips */}
            <div className="card p-6 rounded-xl border-r-4 border-r-[var(--nebula-500)]">
                <h3 className="font-bold text-[var(--text-primary)] mb-4 flex items-center gap-2">
                    <span>💡</span>
                    نصائح لإعلان ناجح
                </h3>
                <ul className="space-y-3 text-[var(--text-secondary)] text-sm">
                    <li className="flex items-start gap-2">
                        <span className="text-[var(--nebula-400)]">•</span>
                        اكتب عنواناً واضحاً ومختصراً يصف المنتج
                    </li>
                    <li className="flex items-start gap-2">
                        <span className="text-[var(--nebula-400)]">•</span>
                        أضف وصفاً تفصيلياً مع ذكر حالة المنتج
                    </li>
                    <li className="flex items-start gap-2">
                        <span className="text-[var(--nebula-400)]">•</span>
                        أضف صوراً واضحة من زوايا مختلفة
                    </li>
                    <li className="flex items-start gap-2">
                        <span className="text-[var(--nebula-400)]">•</span>
                        حدد سعراً مناسباً للسوق
                    </li>
                </ul>
            </div>
        </div>
    );
}
