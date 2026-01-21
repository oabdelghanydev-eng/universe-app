// DeleteConfirmModal - Confirmation dialog for deletions
'use client';

import { useState } from 'react';

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
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl p-6 max-w-md w-full">
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {title}
                </h3>
                <p className="text-gray-600 mb-6">
                    {message}
                </p>
                <div className="flex gap-3">
                    <button
                        onClick={onClose}
                        className="flex-1 btn bg-gray-100 hover:bg-gray-200 text-gray-700 py-2"
                        disabled={isDeleting}
                    >
                        {cancelText}
                    </button>
                    <button
                        onClick={handleConfirm}
                        className="flex-1 btn bg-red-500 hover:bg-red-600 text-white py-2"
                        disabled={isDeleting}
                    >
                        {isDeleting ? 'جاري الحذف...' : confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
}

