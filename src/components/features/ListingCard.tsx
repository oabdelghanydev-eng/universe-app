'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useFirstImageUrl } from '@/hooks/useImageUrls';

// ============================================
// Types
// ============================================

interface ListingCardProps {
    id: string;
    title: string;
    description: string;
    type: 'product' | 'service';
    price: number | null;
    imagePaths: string[];
    imageCount?: number;
    userName: string;
    createdAt: number;
}

// ============================================
// Constants
// ============================================

const TYPE_STYLES = {
    product: {
        gradient: 'from-nebula-500 to-nebula-600',
        icon: '📦',
        label: 'منتج',
    },
    service: {
        gradient: 'from-stellar-500 to-stellar-600',
        icon: '🛠️',
        label: 'خدمة',
    },
} as const;

// ============================================
// Helper: Format date to Arabic
// ============================================

function formatDate(timestamp: number): string {
    if (!timestamp || isNaN(timestamp)) {
        return '';
    }

    try {
        const now = Date.now();
        const diff = now - timestamp;
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));

        if (days === 0) return 'اليوم';
        if (days === 1) return 'أمس';
        if (days < 7) return `منذ ${days} أيام`;

        return new Date(timestamp).toLocaleDateString('ar-EG', {
            month: 'short',
            day: 'numeric',
        });
    } catch {
        return '';
    }
}

// ============================================
// Component: ListingCard
// ============================================

export default function ListingCard({
    id,
    title,
    description,
    type,
    price,
    imagePaths,
    imageCount,
    createdAt,
}: ListingCardProps) {
    const [imageError, setImageError] = useState(false);
    const { url: firstImageUrl, isLoading: imageLoading } = useFirstImageUrl(imagePaths);
    const typeConfig = TYPE_STYLES[type];
    const formattedDate = formatDate(createdAt);
    const hasValidImage = firstImageUrl && !imageError;
    const totalImages = imageCount ?? imagePaths.length;

    return (
        <Link
            href={`/listing/${id}`}
            className="group block card card-interactive rounded-xl overflow-hidden focus:outline-none focus:ring-2 focus:ring-[var(--nebula-500)] focus:ring-offset-2 focus:ring-offset-[var(--space-950)]"
            aria-label={`عرض تفاصيل: ${title}`}
        >
            {/* Image Section */}
            <div className="aspect-[4/3] bg-[var(--space-800)] relative overflow-hidden">
                {imageLoading ? (
                    <div className="w-full h-full skeleton" />
                ) : hasValidImage ? (
                    <img
                        src={firstImageUrl}
                        alt=""
                        className="w-full h-full object-cover transition-transform duration-500 ease-out-expo group-hover:scale-105"
                        loading="lazy"
                        onError={() => setImageError(true)}
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center">
                        <span className="text-5xl text-[var(--text-muted)] opacity-50">
                            {typeConfig.icon}
                        </span>
                    </div>
                )}

                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[var(--space-950)]/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                {/* Type Badge */}
                <span className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r ${typeConfig.gradient} text-white shadow-lg`}>
                    {typeConfig.label}
                </span>

                {/* Image Count Badge */}
                {totalImages > 1 && (
                    <span className="absolute bottom-3 left-3 px-2 py-1 glass rounded-md text-xs text-white font-medium">
                        📷 {totalImages}
                    </span>
                )}
            </div>

            {/* Content Section */}
            <div className="p-4">
                {/* Title */}
                <h3 className="font-bold text-[var(--text-primary)] line-clamp-1 mb-1.5 group-hover:text-[var(--nebula-400)] transition-colors">
                    {title}
                </h3>

                {/* Description */}
                <p className="text-[var(--text-secondary)] text-sm line-clamp-2 mb-4 min-h-[2.5rem]">
                    {description}
                </p>

                {/* Footer: Price & Date */}
                <div className="flex items-center justify-between">
                    {/* Price */}
                    {price != null && price > 0 ? (
                        <span className="font-bold text-[var(--nebula-400)]">
                            {price.toLocaleString('ar-EG')} ج.م
                        </span>
                    ) : (
                        <span className="text-[var(--text-muted)] text-sm">تواصل للسعر</span>
                    )}

                    {/* Date */}
                    {formattedDate && (
                        <time
                            className="text-[var(--text-muted)] text-xs"
                            dateTime={new Date(createdAt).toISOString()}
                        >
                            {formattedDate}
                        </time>
                    )}
                </div>
            </div>
        </Link>
    );
}

// ============================================
// Component: ListingCardSkeleton
// ============================================

export function ListingCardSkeleton() {
    return (
        <div
            className="card rounded-xl overflow-hidden"
            aria-hidden="true"
        >
            {/* Image skeleton */}
            <div className="aspect-[4/3] skeleton" />

            {/* Content skeleton */}
            <div className="p-4 space-y-3">
                {/* Title */}
                <div className="h-5 skeleton rounded w-3/4" />
                {/* Description line 1 */}
                <div className="h-4 skeleton rounded w-full" />
                {/* Description line 2 */}
                <div className="h-4 skeleton rounded w-2/3" />
                {/* Footer */}
                <div className="flex justify-between pt-2">
                    <div className="h-5 skeleton rounded w-20" />
                    <div className="h-4 skeleton rounded w-16" />
                </div>
            </div>
        </div>
    );
}
