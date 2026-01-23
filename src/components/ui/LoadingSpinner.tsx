import React from 'react';

type SpinnerSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

interface LoadingSpinnerProps {
    size?: SpinnerSize;
    variant?: 'primary' | 'white' | 'cosmic';
    label?: string;
    className?: string;
}

export default function LoadingSpinner({
    size = 'md',
    variant = 'cosmic',
    label,
    className = ''
}: LoadingSpinnerProps) {
    // Size configurations
    const sizeConfig = {
        xs: 'w-4 h-4',
        sm: 'w-5 h-5',
        md: 'w-10 h-10',
        lg: 'w-16 h-16',
        xl: 'w-20 h-20'
    };

    // Render Cosmic Spinner (Dual Ring)
    if (variant === 'cosmic') {
        const dimensions = sizeConfig[size];

        return (
            <div className={`flex flex-col items-center justify-center ${className}`}>
                <div className={`relative ${dimensions} mx-auto ${label ? 'mb-4' : ''}`}>
                    {/* Outer ring */}
                    <div className="absolute inset-0 rounded-full border-2 border-[var(--space-600)] border-t-[var(--nebula-400)] animate-spin" />

                    {/* Inner ring (counter-rotation effect) */}
                    <div
                        className="absolute inset-[15%] rounded-full border-2 border-[var(--space-700)] border-b-[var(--stellar-400)] animate-spin"
                        style={{ animationDirection: 'reverse', animationDuration: '0.75s' }}
                    />

                    {/* Center dot (only for larger sizes) */}
                    {(size === 'lg' || size === 'xl') && (
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-[15%] h-[15%] rounded-full bg-gradient-to-br from-nebula-400 to-stellar-400 animate-pulse" />
                        </div>
                    )}
                </div>
                {label && (
                    <p className="text-[var(--text-muted)] text-sm animate-pulse">
                        {label}
                    </p>
                )}
            </div>
        );
    }

    // Render Simple Spinner (Single Ring)
    const baseClasses = "rounded-full animate-spin border-2";
    const variantClasses = {
        primary: "border-[var(--nebula-500)] border-t-transparent",
        white: "border-white border-t-transparent"
    };

    return (
        <div className={`flex flex-col items-center justify-center ${className}`}>
            <div className={`${sizeConfig[size]} ${baseClasses} ${variantClasses[variant]}`} />
            {label && (
                <span className="mt-2 text-sm text-[var(--text-muted)]">
                    {label}
                </span>
            )}
        </div>
    );
}
