/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
        './src/components/**/*.{js,ts,jsx,tsx,mdx}',
        './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
        extend: {
            /*
             * Colors are now defined in globals.css using @theme block
             * This follows Tailwind CSS v4 best practices:
             * - CSS-first configuration
             * - OKLCH color space
             * - Semantic naming (primary, secondary, surface, etc.)
             * 
             * Legacy color aliases (nebula, stellar, space) are maintained
             * in :root for backwards compatibility.
             */

            fontFamily: {
                sans: ['var(--font-ibm-plex)', 'IBM Plex Sans Arabic', 'Inter', 'system-ui', 'sans-serif'],
                display: ['var(--font-ibm-plex)', 'IBM Plex Sans Arabic', 'Inter', 'system-ui', 'sans-serif'],
                arabic: ['var(--font-ibm-plex)', 'IBM Plex Sans Arabic', 'sans-serif'],
            },
            fontSize: {
                'hero': ['4.5rem', { lineHeight: '1.1', fontWeight: '800' }],
                'h1': ['3rem', { lineHeight: '1.2', fontWeight: '700' }],
                'h2': ['2.25rem', { lineHeight: '1.3', fontWeight: '600' }],
                'h3': ['1.75rem', { lineHeight: '1.35', fontWeight: '600' }],
                'body': ['1.0625rem', { lineHeight: '1.7', fontWeight: '400' }], /* 17px base for better Arabic reading */
                'sm': ['0.9375rem', { lineHeight: '1.6', fontWeight: '400' }], /* 15px */
                'xs': ['0.8125rem', { lineHeight: '1.5', fontWeight: '500' }], /* 13px */
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
            transitionTimingFunction: {
                'out-expo': 'cubic-bezier(0.16, 1, 0.3, 1)',
                'out-back': 'cubic-bezier(0.34, 1.56, 0.64, 1)',
            },
            transitionDuration: {
                'fast': '150ms',
                'normal': '250ms',
                'slow': '400ms',
            },
        },
    },
    plugins: [],
}
