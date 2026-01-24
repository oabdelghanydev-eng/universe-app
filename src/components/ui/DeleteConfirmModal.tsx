// DeleteConfirmModal - Confirmation dialog for deletions
'use client';

import { useState } from 'react';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { Trash2 } from 'lucide-react';

interface DeleteConfirmModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => Promise<void>;
    title?: string;
    message?: string;
    confirmText?: string;
    cancelText?: string;
}

export default function DeleteConfirmModal({
    isOpen,
    onClose,
    onConfirm,
    title = 'تأكيد الحذف',
    message = 'هل أنت متأكد من حذف هذا العنصر؟',
    confirmText = 'نعم، احذف',
    cancelText = 'إلغاء',
}: DeleteConfirmModalProps) {
    const [isDeleting, setIsDeleting] = useState(false);

    if (!isOpen) return null;

    async function handleConfirm() {
        setIsDeleting(true);
        try {
            await onConfirm();
        } finally {
            setIsDeleting(false);
        }
    }

    return (
        <div className="modal-backdrop">
            <div className="card-elevated p-6 max-w-md w-full animate-fade-slide-up">
                <div className="text-center mb-6">
                    <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-red-500/10 mb-4 text-red-500">
                        <Trash2 className="w-7 h-7" />
                    </div>
                    <h3 className="text-xl font-bold text-[var(--text-primary)] mb-2">
                        {title}
                    </h3>
                    <p className="text-[var(--text-secondary)]">
                        {message}
                    </p>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={onClose}
                        className="flex-1 btn btn-secondary py-2.5"
                        disabled={isDeleting}
                    >
                        {cancelText}
                    </button>
                    <button
                        onClick={handleConfirm}
                        className="flex-1 btn btn-danger py-2.5 flex justify-center items-center gap-2"
                        disabled={isDeleting}
                    >
                        {isDeleting ? (
                            <>
                                <LoadingSpinner size="sm" variant="white" />
                                <span>جاري الحذف...</span>
                            </>
                        ) : confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
}

