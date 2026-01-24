import React from 'react';

interface BrandTextProps {
    className?: string;
    size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'custom';
}

export default function BrandText({ className = '', size = 'custom' }: BrandTextProps) {
    const sizeClasses = {
        sm: 'text-xl',
        md: 'text-2xl',
        lg: 'text-4xl',
        xl: 'text-5xl md:text-7xl',
        '2xl': 'text-6xl md:text-8xl',
        custom: '',
    };

    return (
        <span dir="ltr" className={`font-extrabold tracking-tight ${sizeClasses[size]} ${className} inline-block`}>
            <span className="text-white">Uni</span><span className="text-shimmer">Verse</span>
        </span>
    );
}
