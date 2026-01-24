// ListingForm - Create and edit listings
'use client';

import { useState, useRef } from 'react';
import type { ListingType, ContactMethod, ListingInput } from '@/types';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { Package, Wrench, Camera, MessageCircle, Phone, Save, Upload, Check, X } from 'lucide-react';

interface ListingFormProps {
    onSubmit: (data: ListingInput, images: File[]) => Promise<void>;
    initialData?: Partial<ListingInput>;
    isEdit?: boolean;
    requirePhone?: boolean;
    isLoading?: boolean;
}

export default function ListingForm({
    onSubmit,
    initialData,
    isEdit = false,
    requirePhone = false,
    isLoading = false,
}: ListingFormProps) {
    // Form state
    const [type, setType] = useState<ListingType>(initialData?.type || 'product');
    const [title, setTitle] = useState(initialData?.title || '');
    const [description, setDescription] = useState(initialData?.description || '');
    const [price, setPrice] = useState(initialData?.price?.toString() || '');
    const [contactMethod, setContactMethod] = useState<ContactMethod>(
        initialData?.contactMethod || 'whatsapp'
    );
    const [phoneNumber, setPhoneNumber] = useState(initialData?.phoneNumber || '');

    // Image state
    const [images, setImages] = useState<File[]>([]);
    const [existingImages, setExistingImages] = useState<string[]>(initialData?.images || []);
    const [existingImagePaths, setExistingImagePaths] = useState<string[]>(initialData?.imagePaths || []);
    const [imagePreviews, setImagePreviews] = useState<string[]>([]);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Validation
    const [errors, setErrors] = useState<Record<string, string>>({});

    const MAX_IMAGES = 5;
    const MAX_TITLE = 60;
    const MAX_DESCRIPTION = 500;
    const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB

    function validateForm(): boolean {
        const newErrors: Record<string, string> = {};

        if (!title.trim()) {
            newErrors.title = 'العنوان مطلوب';
        } else if (title.length > MAX_TITLE) {
            newErrors.title = `العنوان يجب أن يكون أقل من ${MAX_TITLE} حرف`;
        }

        if (!description.trim()) {
            newErrors.description = 'الوصف مطلوب';
        } else if (description.length > MAX_DESCRIPTION) {
            newErrors.description = `الوصف يجب أن يكون أقل من ${MAX_DESCRIPTION} حرف`;
        }

        if (price && isNaN(parseFloat(price))) {
            newErrors.price = 'السعر يجب أن يكون رقماً';
        }

        if (requirePhone && !phoneNumber.trim()) {
            newErrors.phoneNumber = 'رقم الهاتف مطلوب للتواصل';
        } else if (phoneNumber && !/^01[0125][0-9]{8}$/.test(phoneNumber)) {
            newErrors.phoneNumber = 'رقم الهاتف غير صحيح (مثال: 01012345678)';
        }

        const totalImages = images.length + existingImages.length;
        if (totalImages > MAX_IMAGES) {
            newErrors.images = `الحد الأقصى ${MAX_IMAGES} صور`;
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    }

    function handleImageSelect(e: React.ChangeEvent<HTMLInputElement>) {
        const files = Array.from(e.target.files || []);

        const validFiles = files.filter(file => {
            if (file.size > MAX_FILE_SIZE) {
                setErrors(prev => ({ ...prev, images: 'حجم الصورة يجب أن يكون أقل من 2MB' }));
                return false;
            }
            if (!file.type.startsWith('image/')) {
                setErrors(prev => ({ ...prev, images: 'يجب أن يكون الملف صورة' }));
                return false;
            }
            return true;
        });

        const totalImages = images.length + existingImages.length + validFiles.length;
        if (totalImages > MAX_IMAGES) {
            setErrors(prev => ({ ...prev, images: `الحد الأقصى ${MAX_IMAGES} صور` }));
            return;
        }

        setImages(prev => [...prev, ...validFiles]);

        validFiles.forEach(file => {
            const reader = new FileReader();
            reader.onload = (e) => {
                setImagePreviews(prev => [...prev, e.target?.result as string]);
            };
            reader.readAsDataURL(file);
        });

        setErrors(prev => {
            const { images: _, ...rest } = prev;
            return rest;
        });
    }

    function removeNewImage(index: number) {
        setImages(prev => prev.filter((_, i) => i !== index));
        setImagePreviews(prev => prev.filter((_, i) => i !== index));
    }

    function removeExistingImage(index: number) {
        setExistingImages(prev => prev.filter((_, i) => i !== index));
        setExistingImagePaths(prev => prev.filter((_, i) => i !== index));
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();

        if (!validateForm()) return;

        const formData: ListingInput = {
            type,
            title: title.trim(),
            description: description.trim(),
            price: price ? parseFloat(price) : undefined,
            contactMethod,
            phoneNumber: phoneNumber || undefined,
            images: existingImages,
            imagePaths: existingImagePaths,
        };

        await onSubmit(formData, images);
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {/* Type Selection */}
            <div>
                <label className="block text-sm font-medium text-[var(--text-secondary)] mb-3">
                    نوع الإعلان
                </label>
                <div className="grid grid-cols-2 gap-3">
                    <TypeButton
                        selected={type === 'product'}
                        onClick={() => setType('product')}
                        icon={<Package className="w-6 h-6" />}
                        label="منتج"
                        colorClass="text-cyan-400"
                    />
                    <TypeButton
                        selected={type === 'service'}
                        onClick={() => setType('service')}
                        icon={<Wrench className="w-6 h-6" />}
                        label="خدمة"
                        colorClass="text-violet-400"
                    />
                </div>
            </div>

            {/* Title */}
            <div>
                <label htmlFor="title" className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                    العنوان <span className="text-[var(--aurora-danger)]">*</span>
                </label>
                <input
                    id="title"
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    maxLength={MAX_TITLE}
                    placeholder="مثال: آيفون 13 برو ماكس"
                    className={`input ${errors.title ? 'input-error' : ''}`}
                />
                <div className="flex justify-between mt-1.5">
                    {errors.title && (
                        <span className="text-[var(--aurora-danger)] text-sm">{errors.title}</span>
                    )}
                    <span className="text-[var(--text-muted)] text-xs mr-auto">
                        {title.length}/{MAX_TITLE}
                    </span>
                </div>
            </div>

            {/* Description */}
            <div>
                <label htmlFor="description" className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                    الوصف <span className="text-[var(--aurora-danger)]">*</span>
                </label>
                <textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    maxLength={MAX_DESCRIPTION}
                    rows={4}
                    placeholder="اكتب وصفاً تفصيلياً..."
                    className={`input resize-none ${errors.description ? 'input-error' : ''}`}
                />
                <div className="flex justify-between mt-1.5">
                    {errors.description && (
                        <span className="text-[var(--aurora-danger)] text-sm">{errors.description}</span>
                    )}
                    <span className="text-[var(--text-muted)] text-xs mr-auto">
                        {description.length}/{MAX_DESCRIPTION}
                    </span>
                </div>
            </div>

            {/* Price */}
            <div>
                <label htmlFor="price" className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                    السعر (اختياري)
                </label>
                <div className="relative">
                    <input
                        id="price"
                        type="number"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        placeholder="0"
                        min="0"
                        className={`input pl-14 ${errors.price ? 'input-error' : ''}`}
                        dir="rtl"
                    />
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)] text-sm">
                        ج.م
                    </span>
                </div>
                {errors.price && (
                    <span className="text-[var(--aurora-danger)] text-sm mt-1 block">{errors.price}</span>
                )}
            </div>

            {/* Images */}
            <div>
                <label className="block text-sm font-medium text-[var(--text-secondary)] mb-3">
                    الصور (اختياري - حتى {MAX_IMAGES} صور)
                </label>

                <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
                    {/* Existing images */}
                    {existingImages.map((url, index) => (
                        <div key={`existing-${index}`} className="relative aspect-square group">
                            <img
                                src={url}
                                alt={`صورة ${index + 1}`}
                                className="w-full h-full object-cover rounded-xl ring-1 ring-[var(--glass-border)]"
                            />
                            <button
                                type="button"
                                onClick={() => removeExistingImage(index)}
                                className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg hover:bg-red-600"
                            >
                                <X className="w-3.5 h-3.5" />
                            </button>
                        </div>
                    ))}

                    {/* New image previews */}
                    {imagePreviews.map((preview, index) => (
                        <div key={`new-${index}`} className="relative aspect-square group">
                            <img
                                src={preview}
                                alt={`صورة جديدة ${index + 1}`}
                                className="w-full h-full object-cover rounded-xl ring-1 ring-[var(--glass-border)]"
                            />
                            <div className="absolute top-2 left-2">
                                <span className="badge badge-nebula text-xs">جديدة</span>
                            </div>
                            <button
                                type="button"
                                onClick={() => removeNewImage(index)}
                                className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg hover:bg-red-600"
                            >
                                <X className="w-3.5 h-3.5" />
                            </button>
                        </div>
                    ))}

                    {/* Add button */}
                    {images.length + existingImages.length < MAX_IMAGES && (
                        <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="aspect-square border-2 border-dashed border-slate-600 rounded-xl flex flex-col items-center justify-center text-slate-400 hover:border-cyan-500 hover:text-cyan-400 transition-colors group"
                        >
                            <Camera className="w-6 h-6 mb-1 group-hover:scale-110 transition-transform" />
                            <span className="text-xs">أضف صورة</span>
                        </button>
                    )}
                </div>

                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageSelect}
                    className="hidden"
                />

                {errors.images && (
                    <span className="text-[var(--aurora-danger)] text-sm mt-2 block">{errors.images}</span>
                )}
            </div>

            {/* Contact Method */}
            <div>
                <label className="block text-sm font-medium text-[var(--text-secondary)] mb-3">
                    طريقة التواصل المفضلة
                </label>
                <div className="grid grid-cols-2 gap-3">
                    <ContactButton
                        selected={contactMethod === 'whatsapp'}
                        onClick={() => setContactMethod('whatsapp')}
                        icon={<MessageCircle className="w-6 h-6" />}
                        label="واتساب"
                        color="success"
                    />
                    <ContactButton
                        selected={contactMethod === 'call'}
                        onClick={() => setContactMethod('call')}
                        icon={<Phone className="w-6 h-6" />}
                        label="مكالمة"
                        color="info"
                    />
                </div>
            </div>

            {/* Phone Number */}
            {requirePhone && (
                <div>
                    <label htmlFor="phoneNumber" className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                        رقم الهاتف للتواصل <span className="text-[var(--aurora-danger)]">*</span>
                    </label>
                    <input
                        id="phoneNumber"
                        type="tel"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        placeholder="01012345678"
                        className={`input ${errors.phoneNumber ? 'input-error' : ''}`}
                        dir="rtl"
                    />
                    {errors.phoneNumber && (
                        <span className="text-[var(--aurora-danger)] text-sm mt-1 block">{errors.phoneNumber}</span>
                    )}
                    <p className="text-[var(--text-muted)] text-xs mt-2">
                        سيتم حفظ رقم الهاتف للإعلانات القادمة
                    </p>
                </div>
            )}

            {/* Submit Button */}
            <button
                type="submit"
                disabled={isLoading}
                className="w-full btn btn-primary btn-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {isLoading ? (
                    <span className="flex items-center justify-center gap-2">
                        <LoadingSpinner size="sm" variant="white" />
                        جاري {isEdit ? 'التحديث' : 'النشر'}...
                    </span>
                ) : (
                    <span className="flex items-center justify-center gap-2">
                        {isEdit ? <Save className="w-5 h-5" /> : <Upload className="w-5 h-5" />}
                        {isEdit ? 'حفظ التعديلات' : 'نشر الإعلان'}
                    </span>
                )}
            </button>
        </form>
    );
}

// Type Selection Button - Liquid Glass Style
function TypeButton({
    selected,
    onClick,
    icon,
    label,
    gradient
}: {
    selected: boolean;
    onClick: () => void;
    icon: string;
    label: string;
    gradient: string;
}) {
    return (
        <button
            type="button"
            onClick={onClick}
            className={`relative py-4 px-4 rounded-xl transition-all duration-300 text-center ${selected
                ? 'glass-selected'
                : 'glass-unselected'
                }`}
        >
            <span className="text-2xl block mb-1">{icon}</span>
            <span className={`font-medium ${selected ? 'text-[var(--nebula-300)]' : 'text-[var(--text-primary)]'}`}>
                {label}
            </span>
            {selected && (
                <span className="absolute top-2 right-2 w-5 h-5 rounded-full bg-[var(--nebula-500)] flex items-center justify-center text-xs text-white shadow-lg">
                    ✓
                </span>
            )}
        </button>
    );
}

// Contact Method Button - Liquid Glass Style
function ContactButton({
    selected,
    onClick,
    icon,
    label,
    color
}: {
    selected: boolean;
    onClick: () => void;
    icon: string;
    label: string;
    color: 'success' | 'info';
}) {
    const colors = {
        success: {
            border: 'border-[var(--aurora-success)]',
            shadow: '0 0 25px rgba(16, 185, 129, 0.4)',
            bg: 'rgba(16, 185, 129, 0.12)',
            text: 'var(--aurora-success-light)',
        },
        info: {
            border: 'border-[var(--aurora-info)]',
            shadow: '0 0 25px rgba(14, 165, 233, 0.4)',
            bg: 'rgba(14, 165, 233, 0.12)',
            text: 'var(--aurora-info-light)',
        },
    };

    const colorConfig = colors[color];

    return (
        <button
            type="button"
            onClick={onClick}
            className={`py-4 px-4 rounded-xl transition-all duration-300 text-center ${selected
                ? `border-2 ${colorConfig.border} backdrop-blur-md`
                : 'glass-unselected'
                }`}
            style={selected ? {
                background: colorConfig.bg,
                boxShadow: `${colorConfig.shadow}, inset 0 1px 0 rgba(255,255,255,0.1)`,
            } : undefined}
        >
            <span className="text-2xl block mb-1">{icon}</span>
            <span
                className="font-medium"
                style={{ color: selected ? colorConfig.text : 'var(--text-primary)' }}
            >
                {label}
            </span>
        </button>
    );
}

