'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { deleteListing } from '@/actions/listings';
import { submitReport } from '@/actions/reports';
import ReportModal, { type ReportReason } from '@/components/ui/ReportModal';
import {
    Package,
    Wrench,
    CheckCircle2,
    User,
    MessageCircle,
    Phone,
    Edit,
    Trash2,
    AlertTriangle,
    Calendar
} from 'lucide-react';

interface SerializedListing {
    id: string;
    userId: string;
    type: 'product' | 'service';
    title: string;
    description: string;
    price: number | null;
    images: string[];
    imagePaths: string[];
    contactMethod: 'whatsapp' | 'call';
    phoneNumber: string;
    isDeleted: boolean;
    deletedAt: string | null;
    isFlagged: boolean;
    flaggedAt: string | null;
    createdAt: string | null;
    updatedAt: string | null;
}

interface SellerInfo {
    fullName: string;
    photoURL: string | null;
    academicId: string;
}

interface ListingDetailClientProps {
    listing: SerializedListing;
    seller: SellerInfo | null;
    isOwner: boolean;
}

export default function ListingDetailClient({ listing, seller, isOwner }: ListingDetailClientProps) {
    const router = useRouter();
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showReportModal, setShowReportModal] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [activeImage, setActiveImage] = useState(0);

    const createdDate = listing.createdAt
        ? new Date(listing.createdAt).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        })
        : '';

    const maskedAcademicId = seller?.academicId
        ? `${seller.academicId.slice(0, 2)}**${seller.academicId.slice(-4)}`
        : '';

    const whatsappLink = listing.phoneNumber
        ? `https://wa.me/20${listing.phoneNumber.slice(1)}?text=${encodeURIComponent(
            `مرحباً، أنا مهتم بإعلانك: ${listing.title}`
        )}`
        : '#';

    const callLink = `tel:${listing.phoneNumber}`;

    const typeConfig = {
        product: { gradient: 'from-nebula-500 to-nebula-600', icon: <Package className="w-4 h-4" />, label: 'منتج' },
        service: { gradient: 'from-stellar-500 to-stellar-600', icon: <Wrench className="w-4 h-4" />, label: 'خدمة' },
    };

    const config = typeConfig[listing.type];

    async function handleDelete() {
        setIsDeleting(true);
        setError(null);

        try {
            const result = await deleteListing(listing.id);

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

    async function handleReport(reason: ReportReason, details?: string): Promise<boolean> {
        setError(null);
        setSuccessMessage(null);

        const result = await submitReport({
            listingId: listing.id,
            reason,
            details,
        });

        if (!result.success) {
            setError(result.message);
            return false;
        }

        setSuccessMessage('تم إرسال البلاغ بنجاح');
        setTimeout(() => setSuccessMessage(null), 5000);
        return true;
    }

    return (
        <div className="container mx-auto px-4 py-8 max-w-5xl animate-fade-slide-up">
            {/* Breadcrumb */}
            <nav className="mb-6 text-sm">
                <ol className="flex items-center gap-2 text-[var(--text-muted)]">
                    <li>
                        <Link href="/" className="hover:text-[var(--nebula-400)] transition-colors">
                            الرئيسية
                        </Link>
                    </li>
                    <li>
                        <span className="mx-2">/</span>
                    </li>
                    <li className="text-[var(--text-secondary)] truncate max-w-[200px]">
                        {listing.title}
                    </li>
                </ol>
            </nav>

            {/* Messages */}
            {error && (
                <div className="card p-4 mb-6 border border-[var(--aurora-danger)]/30 bg-[var(--aurora-danger-muted)] rounded-xl">
                    <p className="text-[var(--aurora-danger)]">{error}</p>
                </div>
            )}

            {successMessage && (
                <div className="card p-4 mb-6 border border-emerald-500/30 bg-emerald-500/10 rounded-xl flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                    <p className="text-emerald-400">{successMessage}</p>
                </div>
            )}

            <div className="grid lg:grid-cols-2 gap-8">
                {/* Images Section */}
                <div className="space-y-4">
                    {listing.images.length > 0 ? (
                        <>
                            {/* Main Image */}
                            <div className="aspect-square bg-[var(--space-800)] rounded-2xl overflow-hidden card">
                                <img
                                    src={listing.images[activeImage]}
                                    alt={listing.title}
                                    className="w-full h-full object-cover"
                                />
                            </div>

                            {/* Thumbnails */}
                            {listing.images.length > 1 && (
                                <div className="grid grid-cols-4 gap-2">
                                    {listing.images.map((img, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => setActiveImage(idx)}
                                            className={`aspect-square bg-[var(--space-800)] rounded-lg overflow-hidden transition-all duration-200 ${activeImage === idx
                                                ? 'ring-2 ring-[var(--nebula-500)] ring-offset-2 ring-offset-[var(--space-950)]'
                                                : 'opacity-60 hover:opacity-100'
                                                }`}
                                        >
                                            <img
                                                src={img}
                                                alt={`${listing.title} - صورة ${idx + 1}`}
                                                className="w-full h-full object-cover"
                                            />
                                        </button>
                                    ))}
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="aspect-square bg-slate-900 rounded-2xl flex items-center justify-center card">
                            <div className="text-slate-700">
                                {config.label === 'منتج' ?
                                    <Package className="w-24 h-24 stroke-1" /> :
                                    <Wrench className="w-24 h-24 stroke-1" />
                                }
                            </div>
                        </div>
                    )}
                </div>

                {/* Details Section */}
                <div className="space-y-6">
                    {/* Type & Status Badges */}
                    <div className="flex items-center gap-2 flex-wrap">
                        <span className={`px-3 py-1.5 rounded-full text-sm font-semibold bg-gradient-to-r ${config.gradient} text-white flex items-center gap-1.5`}>
                            {config.icon} {config.label}
                        </span>
                        {listing.isDeleted && (
                            <span className="badge badge-danger">
                                محذوف
                            </span>
                        )}
                        {listing.isFlagged && (
                            <span className="badge badge-danger">
                                مُبلغ عنه
                            </span>
                        )}
                    </div>

                    {/* Title */}
                    <h1 className="text-2xl md:text-3xl font-bold text-[var(--text-primary)]">
                        {listing.title}
                    </h1>

                    {/* Price */}
                    {listing.price && (
                        <div className="text-3xl md:text-4xl font-bold text-gradient">
                            {listing.price.toLocaleString('en-US')} ج.م
                        </div>
                    )}

                    {/* Description */}
                    <div className="card p-5 rounded-xl">
                        <h3 className="text-sm font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-3">
                            الوصف
                        </h3>
                        <p className="text-[var(--text-secondary)] whitespace-pre-wrap leading-relaxed">
                            {listing.description}
                        </p>
                    </div>

                    {/* Seller Info */}
                    <div className="card p-5 rounded-xl">
                        <h3 className="text-sm font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-4">
                            الناشر
                        </h3>
                        <div className="flex items-center gap-4">
                            {seller?.photoURL ? (
                                <img
                                    src={seller.photoURL}
                                    alt={seller.fullName}
                                    className="w-14 h-14 rounded-xl object-cover ring-2 ring-[var(--glass-border)]"
                                />
                            ) : (
                                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-nebula-500 to-stellar-500 flex items-center justify-center text-white">
                                    <User className="w-7 h-7" />
                                </div>
                            )}
                            <div>
                                <p className="font-semibold text-[var(--text-primary)]">
                                    {seller?.fullName || 'مستخدم'}
                                </p>
                                <p className="text-sm text-[var(--text-muted)]">
                                    رقم الطالب: {maskedAcademicId}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Contact Buttons */}
                    {!listing.isDeleted && (
                        <div className="space-y-3">
                            {listing.contactMethod === 'whatsapp' ? (
                                <a
                                    href={whatsappLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="btn btn-success w-full py-3.5 text-lg flex items-center justify-center gap-2"
                                >
                                    <MessageCircle className="w-5 h-5" />
                                    تواصل على واتساب
                                </a>
                            ) : (
                                <a
                                    href={callLink}
                                    className="w-full btn py-3.5 text-lg bg-gradient-to-r from-sky-500 to-blue-600 text-white shadow-lg flex items-center justify-center gap-2 hover:shadow-blue-500/25 transition-all"
                                >
                                    <Phone className="w-5 h-5" />
                                    اتصال مباشر
                                </a>
                            )}
                        </div>
                    )}

                    {/* Owner Actions */}
                    {isOwner && (
                        <div className="flex gap-3 pt-4 border-t border-[var(--glass-border)]">
                            <Link
                                href={`/listing/${listing.id}/edit`}
                                className="flex-1 btn btn-secondary py-2.5 text-center flex items-center justify-center gap-2"
                            >
                                <Edit className="w-4 h-4" />
                                تعديل
                            </Link>
                            {!listing.isDeleted && (
                                <button
                                    onClick={() => setShowDeleteModal(true)}
                                    className="flex-1 btn btn-danger py-2.5 flex items-center justify-center gap-2"
                                >
                                    <Trash2 className="w-4 h-4" />
                                    حذف
                                </button>
                            )}
                        </div>
                    )}

                    {/* Report Button */}
                    {!isOwner && !listing.isDeleted && !listing.isFlagged && (
                        <div className="pt-4 border-t border-[var(--glass-border)]">
                            <button
                                onClick={() => setShowReportModal(true)}
                                className="w-full btn btn-ghost text-slate-400 hover:text-red-400 py-2.5 text-sm flex items-center justify-center gap-2"
                            >
                                <AlertTriangle className="w-4 h-4" />
                                الإبلاغ عن هذا الإعلان
                            </button>
                        </div>
                    )}

                    {/* Meta Info */}
                    <div className="text-sm text-[var(--text-muted)] pt-4 border-t border-[var(--glass-border)] flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        تم النشر في {createdDate}
                    </div>
                </div>
            </div>

            {/* Delete Modal */}
            {showDeleteModal && (
                <div className="modal-backdrop">
                    <div className="card-elevated p-6 rounded-2xl max-w-md w-full animate-fade-slide-up">
                        <div className="text-center mb-6">
                            <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-red-500/10 mb-4 text-red-500">
                                <Trash2 className="w-7 h-7" />
                            </div>
                            <h3 className="text-xl font-bold text-[var(--text-primary)] mb-2">
                                تأكيد الحذف
                            </h3>
                            <p className="text-[var(--text-secondary)]">
                                هل أنت متأكد من حذف هذا الإعلان؟ لن يظهر للآخرين بعد الحذف.
                            </p>
                        </div>
                        <div className="flex gap-3">
                            <button
                                onClick={() => setShowDeleteModal(false)}
                                className="flex-1 btn btn-secondary py-2.5"
                                disabled={isDeleting}
                            >
                                إلغاء
                            </button>
                            <button
                                onClick={handleDelete}
                                className="flex-1 btn btn-danger py-2.5"
                                disabled={isDeleting}
                            >
                                {isDeleting ? 'جاري الحذف...' : 'نعم، احذف'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Report Modal */}
            <ReportModal
                isOpen={showReportModal}
                onClose={() => setShowReportModal(false)}
                onSubmit={handleReport}
                listingTitle={listing.title}
            />
        </div>
    );
}
