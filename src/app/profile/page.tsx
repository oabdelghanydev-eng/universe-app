'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { getUserListings, deleteListing } from '@/actions/listings';
import { checkRegistrationStatus } from '@/actions/auth';
import type { Listing } from '@/types';

export default function ProfilePage() {
    const router = useRouter();
    const [listings, setListings] = useState<Listing[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [userName, setUserName] = useState('');
    const [deleteId, setDeleteId] = useState<string | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function loadData() {
            try {
                const authResult = await checkRegistrationStatus();
                if (!authResult.success || !authResult.data?.isLoggedIn || !authResult.data?.isRegistered) {
                    router.push('/login');
                    return;
                }

                setUserName(authResult.data.user?.fullName || '');

                const listingsResult = await getUserListings();
                if (listingsResult.success && listingsResult.data) {
                    setListings(listingsResult.data);
                } else if (!listingsResult.success) {
                    setError(listingsResult.message || 'فشل في تحميل الإعلانات');
                }
            } catch (err) {
                console.error('Load error:', err);
            } finally {
                setIsLoading(false);
            }
        }

        loadData();
    }, [router]);

    async function handleDelete(listingId: string) {
        setIsDeleting(true);
        try {
            const result = await deleteListing(listingId);
            if (result.success) {
                setListings(prev =>
                    prev.map(l => l.id === listingId ? { ...l, isDeleted: true } : l)
                );
            }
        } catch (err) {
            console.error('Delete error:', err);
        } finally {
            setIsDeleting(false);
            setDeleteId(null);
        }
    }

    if (isLoading) {
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

    const activeListings = listings.filter(l => !l.isDeleted);
    const deletedListings = listings.filter(l => l.isDeleted);

    return (
        <div className="container mx-auto px-4 py-8 max-w-4xl animate-fade-slide-up">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-2xl md:text-3xl font-bold text-[var(--text-primary)] mb-2">
                    👤 إعلاناتي
                </h1>
                <p className="text-[var(--text-secondary)]">
                    مرحباً {userName.split(' ')[0]}، هنا يمكنك إدارة إعلاناتك
                </p>
            </div>

            {/* Error Message */}
            {error && (
                <div className="card p-4 mb-6 border border-[var(--aurora-danger)]/30 bg-[var(--aurora-danger-muted)] rounded-xl">
                    <p className="text-[var(--aurora-danger)]">{error}</p>
                </div>
            )}

            {/* Quick Stats */}
            <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="card p-5 rounded-xl text-center">
                    <div className="text-3xl font-bold text-gradient mb-1">
                        {activeListings.length}
                    </div>
                    <div className="text-[var(--text-muted)] text-sm">إعلانات نشطة</div>
                </div>
                <div className="card p-5 rounded-xl text-center">
                    <div className="text-3xl font-bold text-[var(--text-muted)] mb-1">
                        {deletedListings.length}
                    </div>
                    <div className="text-[var(--text-muted)] text-sm">إعلانات محذوفة</div>
                </div>
            </div>

            {/* New Listing Button */}
            <Link
                href="/listing/new"
                className="btn btn-primary w-full py-3.5 mb-8 flex items-center justify-center gap-2"
            >
                <span className="text-xl">+</span>
                انشر إعلان جديد
            </Link>

            {/* Active Listings */}
            <section className="mb-10">
                <h2 className="text-xl font-bold text-[var(--text-primary)] mb-4">
                    الإعلانات النشطة
                </h2>

                {activeListings.length === 0 ? (
                    <div className="card p-10 rounded-2xl text-center">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-xl glass-elevated mb-4 animate-gentle-float">
                            <span className="text-3xl">📭</span>
                        </div>
                        <h3 className="font-semibold text-[var(--text-primary)] mb-2">
                            لا توجد إعلانات نشطة
                        </h3>
                        <p className="text-[var(--text-secondary)] text-sm mb-4">
                            ابدأ بنشر أول إعلان لك
                        </p>
                        <Link href="/listing/new" className="btn btn-primary">
                            انشر إعلان
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {activeListings.map(listing => (
                            <ProfileListingCard
                                key={listing.id}
                                listing={listing}
                                onDelete={() => setDeleteId(listing.id)}
                            />
                        ))}
                    </div>
                )}
            </section>

            {/* Deleted Listings */}
            {deletedListings.length > 0 && (
                <section>
                    <h2 className="text-lg font-semibold text-[var(--text-muted)] mb-4">
                        الإعلانات المحذوفة
                    </h2>
                    <div className="space-y-4 opacity-60">
                        {deletedListings.map(listing => (
                            <ProfileListingCard
                                key={listing.id}
                                listing={listing}
                                isDeleted
                            />
                        ))}
                    </div>
                </section>
            )}

            {/* Delete Confirmation Modal */}
            {deleteId && (
                <div className="modal-backdrop">
                    <div className="card-elevated p-6 rounded-2xl max-w-md w-full animate-fade-slide-up">
                        <div className="text-center mb-6">
                            <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-[var(--aurora-danger-muted)] mb-4">
                                <span className="text-2xl">🗑️</span>
                            </div>
                            <h3 className="text-xl font-bold text-[var(--text-primary)] mb-2">
                                تأكيد الحذف
                            </h3>
                            <p className="text-[var(--text-secondary)]">
                                هل أنت متأكد من حذف هذا الإعلان؟
                            </p>
                        </div>
                        <div className="flex gap-3">
                            <button
                                onClick={() => setDeleteId(null)}
                                className="flex-1 btn btn-secondary py-2.5"
                                disabled={isDeleting}
                            >
                                إلغاء
                            </button>
                            <button
                                onClick={() => handleDelete(deleteId)}
                                className="flex-1 btn btn-danger py-2.5"
                                disabled={isDeleting}
                            >
                                {isDeleting ? 'جاري الحذف...' : 'نعم، احذف'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

// Profile Listing Card Component
function ProfileListingCard({
    listing,
    onDelete,
    isDeleted = false
}: {
    listing: Listing;
    onDelete?: () => void;
    isDeleted?: boolean;
}) {
    const createdDate = listing.createdAt
        ? new Date(listing.createdAt).toLocaleDateString('ar-EG', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        })
        : '';

    const typeConfig = {
        product: { gradient: 'from-nebula-500 to-nebula-600', label: 'منتج' },
        service: { gradient: 'from-stellar-500 to-stellar-600', label: 'خدمة' },
    };

    const config = typeConfig[listing.type];

    return (
        <div className="card rounded-xl overflow-hidden">
            <div className="flex">
                {/* Image */}
                <div className="w-28 sm:w-36 h-28 sm:h-36 bg-[var(--space-800)] flex-shrink-0">
                    {listing.images[0] ? (
                        <img
                            src={listing.images[0]}
                            alt={listing.title}
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center">
                            <span className="text-3xl text-[var(--text-muted)] opacity-50">
                                {listing.type === 'product' ? '📦' : '🛠️'}
                            </span>
                        </div>
                    )}
                </div>

                {/* Content */}
                <div className="flex-1 p-4 flex flex-col justify-between min-w-0">
                    <div>
                        <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                            <span className={`text-xs px-2 py-0.5 rounded-full bg-gradient-to-r ${config.gradient} text-white font-medium`}>
                                {config.label}
                            </span>
                            {isDeleted && (
                                <span className="badge badge-danger text-xs">
                                    محذوف
                                </span>
                            )}
                        </div>
                        <h3 className="font-bold text-[var(--text-primary)] line-clamp-1 mb-1">
                            {listing.title}
                        </h3>
                        {listing.price && (
                            <p className="text-[var(--nebula-400)] font-medium text-sm">
                                {listing.price.toLocaleString('ar-EG')} ج.م
                            </p>
                        )}
                    </div>
                    <div className="text-xs text-[var(--text-muted)]">
                        {createdDate}
                    </div>
                </div>

                {/* Actions */}
                {!isDeleted && (
                    <div className="flex flex-col border-r border-[var(--glass-border)]">
                        <Link
                            href={`/listing/${listing.id}`}
                            className="flex-1 px-4 flex items-center justify-center text-[var(--text-muted)] hover:bg-[var(--glass-bg)] hover:text-[var(--text-primary)] transition-colors"
                            title="عرض"
                        >
                            👁️
                        </Link>
                        <Link
                            href={`/listing/${listing.id}/edit`}
                            className="flex-1 px-4 flex items-center justify-center text-[var(--text-muted)] hover:bg-[var(--glass-bg)] hover:text-[var(--text-primary)] transition-colors border-t border-[var(--glass-border)]"
                            title="تعديل"
                        >
                            ✏️
                        </Link>
                        <button
                            onClick={onDelete}
                            className="flex-1 px-4 flex items-center justify-center text-[var(--aurora-danger)] hover:bg-[var(--aurora-danger-muted)] transition-colors border-t border-[var(--glass-border)]"
                            title="حذف"
                        >
                            🗑️
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
