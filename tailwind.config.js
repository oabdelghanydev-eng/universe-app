/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
        './src/components/**/*.{js,ts,jsx,tsx,mdx}',
        './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
        extend: {
            colors: {
                // Deep Space - Background Tiers
                space: {
                    950: '#030712',
                    900: '#0a1020',
                    800: '#111827',
                    700: '#1f2937',
                    600: '#374151',
                    500: '#4b5563',
                },
                // Nebula - Primary Accent
                nebula: {
                    300: '#a5b4fc',
                    400: '#818cf8',
                    500: '#6366f1',
                    600: '#4f46e5',
                    700: '#4338ca',
                },
                // Stellar - Secondary Accent
                stellar: {
                    300: '#c4b5fd',
                    400: '#a78bfa',
                    500: '#8b5cf6',
                    600: '#7c3aed',
                },
                // Aurora - Semantic Colors
                aurora: {
                    success: '#34d399',
                    warning: '#fbbf24',
                    danger: '#f87171',
                    info: '#38bdf8',
                },
                // Stardust - Text
                stardust: {
                    primary: '#f8fafc',
                    secondary: '#94a3b8',
                    muted: '#64748b',
                    disabled: '#475569',
                },
                // Glass
                glass: {
                    bg: 'rgba(15, 23, 42, 0.85)',
                    elevated: 'rgba(30, 41, 59, 0.9)',
                    subtle: 'rgba(15, 23, 42, 0.6)',
                    border: 'rgba(148, 163, 184, 0.1)',
                    'border-strong': 'rgba(148, 163, 184, 0.2)',
                },
            },
            fontFamily: {
                sans: ['Cairo', 'Inter', 'system-ui', 'sans-serif'],
                display: ['Cairo', 'Inter', 'system-ui', 'sans-serif'],
                arabic: ['Cairo', 'sans-serif'],
            },
            fontSize: {
                'hero': ['4rem', { lineHeight: '1.1', fontWeight: '800' }],
                'h1': ['2.5rem', { lineHeight: '1.2', fontWeight: '700' }],
                'h2': ['2rem', { lineHeight: '1.25', fontWeight: '600' }],
                'h3': ['1.5rem', { lineHeight: '1.3', fontWeight: '600' }],
                'body': ['1rem', { lineHeight: '1.6', fontWeight: '400' }],
                'sm': ['0.875rem', { lineHeight: '1.5', fontWeight: '400' }],
                'xs': ['0.75rem', { lineHeight: '1.4', fontWeight: '500' }],
            },
            spacing: {
                '18': '4.5rem',
                '22': '5.5rem',
            },
            borderRadius: {
                'xl': '1rem',
                '2xl': '1.5rem',
                '3xl': '2rem',
            },
            boxShadow: {
                'glass': '0 8px 32px rgba(0, 0, 0, 0.3), 0 0 60px rgba(99, 102, 241, 0.08)',
                'glass-lg': '0 12px 48px rgba(0, 0, 0, 0.4), 0 0 80px rgba(99, 102, 241, 0.12)',
                'nebula': '0 4px 14px rgba(99, 102, 241, 0.35)',
                'nebula-lg': '0 6px 20px rgba(99, 102, 241, 0.45)',
                'glow': '0 0 30px rgba(99, 102, 241, 0.3)',
            },
            backdropBlur: {
                'glass': '20px',
                'glass-sm': '12px',
                'glass-lg': '24px',
            },
            transitionTimingFunction: {
                'out-expo': 'cubic-bezier(0.16, 1, 0.3, 1)',
                'out-back': 'cubic-bezier(0.34, 1.56, 0.64, 1)',
            },
            transitionDuration: {
                'fast': '150ms',
                'normal': '250ms',
                'slow': '400ms',
            },
            animation: {
                'orbit-float': 'orbit-float 3s ease-in-out infinite',
                'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
                'fade-slide-up': 'fade-slide-up 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards',
                'shimmer': 'shimmer 1.5s infinite linear',
                'gentle-float': 'gentle-float 4s ease-in-out infinite',
            },
            keyframes: {
                'orbit-float': {
                    '0%, 100%': { transform: 'translateY(0) scale(1)' },
                    '50%': { transform: 'translateY(-8px) scale(1.01)' },
                },
                'pulse-glow': {
                    '0%, 100%': {
                        boxShadow: '0 0 20px rgba(99, 102, 241, 0.35)',
                        opacity: '1'
                    },
                    '50%': {
                        boxShadow: '0 0 40px rgba(99, 102, 241, 0.5)',
                        opacity: '0.8'
                    },
                },
                'fade-slide-up': {
                    from: { opacity: '0', transform: 'translateY(20px)' },
                    to: { opacity: '1', transform: 'translateY(0)' },
                },
                'shimmer': {
                    '0%': { backgroundPosition: '-200% 0' },
                    '100%': { backgroundPosition: '200% 0' },
                },
                'gentle-float': {
                    '0%, 100%': { transform: 'translateY(0)' },
                    '50%': { transform: 'translateY(-10px)' },
                },
            },
        },
    },
    plugins: [],
}
