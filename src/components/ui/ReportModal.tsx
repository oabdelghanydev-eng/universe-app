// ReportModal - Report listing dialog
'use client';

/**
 * Report Modal Component
 * Used to report inappropriate listings
 */

import { useState, useEffect, useRef } from 'react';

// ============================================
// Types
// ============================================

export interface ReportModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (reason: ReportReason, details?: string) => Promise<boolean>;
    listingTitle: string;
}

export type ReportReason = 'inappropriate_content' | 'fraud' | 'spam' | 'other';

interface ReasonOption {
    value: ReportReason;
    label: string;
    icon: string;
}

// ============================================
// Constants
// ============================================

const REASON_OPTIONS: ReasonOption[] = [
    { value: 'inappropriate_content', label: 'محتوى غير لائق', icon: '🚫' },
    { value: 'fraud', label: 'احتيال أو نصب', icon: '⚠️' },
    { value: 'spam', label: 'إعلان مزعج (سبام)', icon: '📧' },
    { value: 'other', label: 'سبب آخر', icon: '📋' },
];

// ============================================
// Component
// ============================================

export default function ReportModal({
    isOpen,
    onClose,
    onSubmit,
    listingTitle,
}: ReportModalProps) {
    const [selectedReason, setSelectedReason] = useState<ReportReason | null>(null);
    const [details, setDetails] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const modalRef = useRef<HTMLDivElement>(null);

    // Reset state when modal opens/closes
    useEffect(() => {
        if (isOpen) {
            setSelectedReason(null);
            setDetails('');
            setError(null);
        }
    }, [isOpen]);

    // Close on escape key
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && isOpen) {
                onClose();
            }
        };

        document.addEventListener('keydown', handleEscape);
        return () => document.removeEventListener('keydown', handleEscape);
    }, [isOpen, onClose]);

    // Close on backdrop click
    const handleBackdropClick = (e: React.MouseEvent) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    // Handle submit
    const handleSubmit = async () => {
        if (!selectedReason) {
            setError('اختر سبب البلاغ');
            return;
        }

        setIsSubmitting(true);
        setError(null);

        try {
            const success = await onSubmit(
                selectedReason,
                details.trim() || undefined
            );

            if (success) {
                onClose();
            }
        } catch {
            setError('حدث خطأ في إرسال البلاغ');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div
            className="modal-backdrop"
            onClick={handleBackdropClick}
            role="dialog"
            aria-modal="true"
            aria-labelledby="report-modal-title"
        >
            <div
                ref={modalRef}
                className="card-elevated rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto animate-fade-slide-up"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="p-6 border-b border-[var(--glass-border)]">
                    <div className="flex items-center justify-between">
                        <h2 id="report-modal-title" className="text-xl font-bold text-[var(--text-primary)]">
                            🚨 الإبلاغ عن إعلان
                        </h2>
                        <button
                            onClick={onClose}
                            className="w-8 h-8 rounded-lg flex items-center justify-center text-[var(--text-muted)] hover:bg-[var(--glass-bg)] hover:text-[var(--text-primary)] transition-colors"
                            aria-label="إغلاق"
                        >
                            ✕
                        </button>
                    </div>
                    <p className="text-sm text-[var(--text-muted)] mt-2 line-clamp-1">
                        {listingTitle}
                    </p>
                </div>

                {/* Content */}
                <div className="p-6 space-y-5">
                    {/* Reason Selection */}
                    <div>
                        <label className="block text-sm font-medium text-[var(--text-secondary)] mb-3">
                            سبب البلاغ <span className="text-[var(--aurora-danger)]">*</span>
                        </label>
                        <div className="space-y-2">
                            {REASON_OPTIONS.map((option) => (
                                <button
                                    key={option.value}
                                    onClick={() => setSelectedReason(option.value)}
                                    className={`w-full flex items-center gap-3 p-3.5 rounded-xl transition-all ${selectedReason === option.value
                                            ? 'bg-[var(--aurora-danger-muted)] border border-[var(--aurora-danger)] text-[var(--aurora-danger)]'
                                            : 'card hover:bg-[var(--glass-bg-elevated)] text-[var(--text-primary)]'
                                        }`}
                                >
                                    <span className="text-xl">{option.icon}</span>
                                    <span className="font-medium">{option.label}</span>
                                    {selectedReason === option.value && (
                                        <span className="mr-auto text-[var(--aurora-danger)]">✓</span>
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Details (optional) */}
                    <div>
                        <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                            تفاصيل إضافية (اختياري)
                        </label>
                        <textarea
                            value={details}
                            onChange={(e) => setDetails(e.target.value)}
                            placeholder="اكتب تفاصيل إضافية للمساعدة في المراجعة..."
                            className="input resize-none"
                            rows={3}
                            maxLength={500}
                            dir="rtl"
                        />
                        <p className="text-xs text-[var(--text-muted)] mt-1.5 text-left">
                            {details.length}/500
                        </p>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="card p-4 border border-[var(--aurora-danger)]/30 bg-[var(--aurora-danger-muted)] rounded-xl">
                            <p className="text-[var(--aurora-danger)] text-sm">{error}</p>
                        </div>
                    )}

                    {/* Info */}
                    <div className="card p-4 rounded-xl space-y-2">
                        <p className="text-xs text-[var(--text-muted)] flex items-center gap-2">
                            <span>📋</span>
                            سيتم مراجعة البلاغ من قبل الإدارة.
                        </p>
                        <p className="text-xs text-[var(--text-muted)] flex items-center gap-2">
                            <span>⚠️</span>
                            البلاغات الكاذبة قد تؤدي لحظر حسابك.
                        </p>
                    </div>
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-[var(--glass-border)] flex gap-3">
                    <button
                        onClick={onClose}
                        disabled={isSubmitting}
                        className="flex-1 btn btn-secondary py-2.5"
                    >
                        إلغاء
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={isSubmitting || !selectedReason}
                        className="flex-1 btn btn-danger py-2.5 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isSubmitting ? (
                            <span className="flex items-center justify-center gap-2">
                                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                جاري الإرسال...
                            </span>
                        ) : (
                            '🚨 إرسال البلاغ'
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}

