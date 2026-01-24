'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ListingForm from '@/components/features/ListingForm';
import { createListing } from '@/actions/listings';
import { checkRegistrationStatus } from '@/actions/auth';
import type { ListingInput } from '@/types';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { Upload, Lightbulb, CheckCircle2, AlertCircle } from 'lucide-react';

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
                <LoadingSpinner size="lg" label="جاري التحميل..." />
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8 max-w-2xl animate-fade-slide-up">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-2xl md:text-3xl font-bold text-slate-100 mb-2 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-violet-600 flex items-center justify-center">
                        <Upload className="w-5 h-5 text-white" />
                    </div>
                    نشر إعلان جديد
                </h1>
                <p className="text-slate-400">
                    أضف تفاصيل إعلانك وسيتم نشره فوراً
                </p>
            </div>

            {/* Error Message */}
            {error && (
                <div className="p-4 mb-6 border border-red-500/30 bg-red-500/10 rounded-xl flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                    <p className="text-red-400">{error}</p>
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
            <div className="bg-slate-900/50 p-6 rounded-xl border-r-4 border-r-amber-500">
                <h3 className="font-bold text-slate-100 mb-4 flex items-center gap-2">
                    <Lightbulb className="w-5 h-5 text-amber-400" />
                    نصائح لإعلان ناجح
                </h3>
                <ul className="space-y-3 text-slate-400 text-sm">
                    <li className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-cyan-400 mt-0.5 flex-shrink-0" />
                        اكتب عنواناً واضحاً ومختصراً يصف المنتج
                    </li>
                    <li className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-cyan-400 mt-0.5 flex-shrink-0" />
                        أضف وصفاً تفصيلياً مع ذكر حالة المنتج
                    </li>
                    <li className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-cyan-400 mt-0.5 flex-shrink-0" />
                        أضف صوراً واضحة من زوايا مختلفة
                    </li>
                    <li className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-cyan-400 mt-0.5 flex-shrink-0" />
                        حدد سعراً مناسباً للسوق
                    </li>
                </ul>
            </div>
        </div>
    );
}
