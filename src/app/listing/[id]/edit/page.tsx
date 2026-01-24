'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import ListingForm from '@/components/features/ListingForm';
import { getListing, updateListing, deleteListing } from '@/actions/listings';
import { checkRegistrationStatus } from '@/actions/auth';
import type { ListingInput, Listing } from '@/types';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import DeleteConfirmModal from '@/components/ui/DeleteConfirmModal';
import { Edit, Trash2, AlertCircle } from 'lucide-react';

interface EditListingPageProps {
    params: Promise<{ id: string }>;
}

export default function EditListingPage({ params }: EditListingPageProps) {
    const router = useRouter();
    const { id: listingId } = use(params);
    const [listing, setListing] = useState<Listing | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isCheckingAuth, setIsCheckingAuth] = useState(true);
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    useEffect(() => {
        async function init() {
            try {
                const authResult = await checkRegistrationStatus();
                if (!authResult.success || !authResult.data?.isLoggedIn || !authResult.data?.isRegistered) {
                    router.push('/login');
                    return;
                }

                const listingResult = await getListing(listingId);
                if (!listingResult.success || !listingResult.data) {
                    router.push('/');
                    return;
                }

                if (listingResult.data.userId !== authResult.data.user?.uid) {
                    router.push(`/listing/${listingId}`);
                    return;
                }

                setListing(listingResult.data);
                setIsCheckingAuth(false);
            } catch (err) {
                console.error('Init error:', err);
                router.push('/');
            }
        }

        init();
    }, [listingId, router]);

    async function handleSubmit(data: ListingInput, newImages: File[]) {
        if (!listingId || !listing) return;

        setIsLoading(true);
        setError(null);

        try {
            const imageData = await Promise.all(
                newImages.map(async (file) => {
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

            const removedImagePaths: string[] = [];
            listing.images.forEach((url, index) => {
                if (!data.images?.includes(url) && listing.imagePaths[index]) {
                    removedImagePaths.push(listing.imagePaths[index]);
                }
            });

            const result = await updateListing(
                listingId,
                data,
                imageData.length > 0 ? imageData : undefined,
                removedImagePaths.length > 0 ? removedImagePaths : undefined
            );

            if (!result.success) {
                setError(result.message);
                return;
            }

            router.push(`/listing/${listingId}`);
        } catch (err) {
            console.error('Update error:', err);
            setError('حدث خطأ في تحديث الإعلان');
        } finally {
            setIsLoading(false);
        }
    }

    async function handleDelete() {
        if (!listingId) return;

        setIsDeleting(true);
        try {
            const result = await deleteListing(listingId);

            if (!result.success) {
                setError(result.message);
                setShowDeleteModal(false);
                return;
            }

            router.push('/profile');
        } catch (err) {
            console.error('Delete error:', err);
            setError('حدث خطأ في حذف الإعلان');
        } finally {
            setIsDeleting(false);
            setShowDeleteModal(false);
        }
    }

    if (isCheckingAuth || !listing) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center">
                <LoadingSpinner size="lg" label="جاري التحميل..." />
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8 max-w-2xl animate-fade-slide-up">
            {/* Breadcrumb */}
            <nav className="mb-6 text-sm">
                <ol className="flex items-center gap-2 text-[var(--text-muted)]">
                    <li>
                        <Link href="/" className="hover:text-[var(--nebula-400)] transition-colors">
                            الرئيسية
                        </Link>
                    </li>
                    <li><span className="mx-2">/</span></li>
                    <li>
                        <Link href={`/listing/${listingId}`} className="hover:text-[var(--nebula-400)] transition-colors">
                            {listing.title}
                        </Link>
                    </li>
                    <li><span className="mx-2">/</span></li>
                    <li className="text-[var(--text-secondary)]">تعديل</li>
                </ol>
            </nav>

            {/* Header */}
            <div className="mb-8">
                <h1 className="text-2xl md:text-3xl font-bold text-[var(--text-primary)] mb-2 flex items-center gap-2">
                    <Edit className="w-8 h-8 text-cyan-400" />
                    تعديل الإعلان
                </h1>
                <p className="text-[var(--text-secondary)]">
                    قم بتعديل تفاصيل إعلانك
                </p>
            </div>

            {/* Error Message */}
            {error && (
                <div className="card p-4 mb-6 border border-red-500/30 bg-red-500/10 rounded-xl flex items-center gap-3">
                    <AlertCircle className="w-5 h-5 text-red-400" />
                    <p className="text-red-400">{error}</p>
                </div>
            )}

            {/* Form Card */}
            <div className="card-elevated p-6 md:p-8 rounded-2xl mb-8">
                <ListingForm
                    onSubmit={handleSubmit}
                    initialData={{
                        type: listing.type,
                        title: listing.title,
                        description: listing.description,
                        price: listing.price || undefined,
                        contactMethod: listing.contactMethod,
                        images: listing.images,
                        imagePaths: listing.imagePaths,
                    }}
                    isEdit={true}
                    isLoading={isLoading}
                />
            </div>

            {/* Delete Section */}
            {!listing.isDeleted && (
                <div className="card p-6 rounded-xl border border-red-500/20 bg-red-500/5">
                    <h3 className="font-bold text-red-400 mb-2 flex items-center gap-2">
                        <Trash2 className="w-5 h-5" />
                        حذف الإعلان
                    </h3>
                    <p className="text-[var(--text-secondary)] text-sm mb-4">
                        سيتم إخفاء الإعلان من الصفحة الرئيسية ونتائج البحث. يمكنك رؤيته في إعلاناتي.
                    </p>
                    <button
                        onClick={() => setShowDeleteModal(true)}
                        className="btn btn-danger px-4 py-2"
                    >
                        حذف الإعلان
                    </button>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            <DeleteConfirmModal
                isOpen={showDeleteModal}
                onClose={() => setShowDeleteModal(false)}
                onConfirm={handleDelete}
                title="تأكيد الحذف"
                message="هل أنت متأكد من حذف هذا الإعلان؟ لن يظهر للآخرين بعد الحذف."
                confirmText="نعم، احذف"
                cancelText="إلغاء"
            />
        </div>
    );
}
