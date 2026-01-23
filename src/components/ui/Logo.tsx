import React from 'react';

interface LogoProps {
    className?: string;
    showText?: boolean;
    size?: 'sm' | 'md' | 'lg' | 'xl';
}

export default function Logo({ className = '', showText = true, size = 'md' }: LogoProps) {
    const sizeClasses = {
        sm: 'h-8 text-xl',
        md: 'h-10 text-2xl',
        lg: 'h-16 text-4xl',
        xl: 'h-24 text-6xl',
    };

    const iconSizes = {
        sm: 32,
        md: 40,
        lg: 64,
        xl: 96,
    };

    const currentIconSize = iconSizes[size];

    return (
        <div className={`flex items-center gap-3 select-none group ${className}`} dir="ltr">
            {/* Galaxy Serpentine Loop Logo */}
            <div
                className={`relative flex items-center justify-center transition-transform duration-500 group-hover:scale-105`}
                style={{ width: currentIconSize, height: currentIconSize }}
            >
                <svg
                    width="100%"
                    height="100%"
                    viewBox="0 0 512 512"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="overflow-visible"
                >
                    <defs>
                        <linearGradient id="cyanStreamLogo" x1="100%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor="#67e8f9" />
                            <stop offset="50%" stopColor="#22d3ee" />
                            <stop offset="100%" stopColor="#06b6d4" />
                        </linearGradient>

                        <linearGradient id="purpleStreamLogo" x1="100%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor="#a855f7" />
                            <stop offset="50%" stopColor="#d946ef" />
                            <stop offset="100%" stopColor="#c026d3" />
                        </linearGradient>

                        <filter id="cyanGlowLogo" x="-100%" y="-100%" width="300%" height="300%">
                            <feGaussianBlur stdDeviation="12" result="blur" />
                            <feFlood floodColor="#22d3ee" floodOpacity="0.8" />
                            <feComposite in2="blur" operator="in" />
                            <feMerge>
                                <feMergeNode />
                                <feMergeNode in="SourceGraphic" />
                            </feMerge>
                        </filter>

                        <filter id="purpleGlowLogo" x="-100%" y="-100%" width="300%" height="300%">
                            <feGaussianBlur stdDeviation="10" result="blur" />
                            <feFlood floodColor="#d946ef" floodOpacity="0.75" />
                            <feComposite in2="blur" operator="in" />
                            <feMerge>
                                <feMergeNode />
                                <feMergeNode in="SourceGraphic" />
                            </feMerge>
                        </filter>
                    </defs>

                    {/* Cyan Glow Back */}
                    <g filter="url(#cyanGlowLogo)" opacity="0.4">
                        <path d="M 480 30 C 430 30, 400 60, 370 140 C 355 180, 355 240, 385 320 C 405 380, 360 460, 256 470 C 150 480, 80 420, 90 340 C 100 260, 150 220, 120 140 C 100 80, 60 50, 30 40"
                            fill="none" stroke="url(#cyanStreamLogo)" strokeWidth="56" strokeLinecap="round" />
                    </g>

                    {/* Purple Glow Back */}
                    <g filter="url(#purpleGlowLogo)" opacity="0.35">
                        <path d="M 460 55 C 415 55, 385 85, 355 160 C 342 200, 342 255, 370 330 C 388 385, 345 445, 256 450 C 170 455, 105 400, 112 325 C 120 250, 165 210, 138 135 C 118 80, 78 58, 45 50"
                            fill="none" stroke="url(#purpleStreamLogo)" strokeWidth="44" strokeLinecap="round" />
                    </g>

                    {/* Cyan Animated Line */}
                    <path d="M 488 25 C 435 25, 408 55, 378 135 C 362 175, 362 235, 392 315 C 412 375, 368 465, 256 478 C 145 490, 70 425, 82 342 C 92 262, 142 222, 112 142 C 92 82, 52 45, 20 35"
                        fill="none" stroke="#67e8f9" strokeWidth="8" strokeLinecap="round" filter="url(#cyanGlowLogo)"
                        strokeDasharray="100 800" className="animate-[dash-flow_5s_linear_infinite]" />
                    <path d="M 488 25 C 435 25, 408 55, 378 135 C 362 175, 362 235, 392 315 C 412 375, 368 465, 256 478 C 145 490, 70 425, 82 342 C 92 262, 142 222, 112 142 C 92 82, 52 45, 20 35"
                        fill="none" stroke="#67e8f9" strokeWidth="8" strokeLinecap="round" strokeOpacity="0.25" />

                    <path d="M 482 32 C 432 32, 402 62, 372 142 C 358 182, 358 242, 388 322 C 408 382, 362 462, 256 472 C 148 482, 75 422, 86 340 C 96 260, 146 220, 116 140 C 96 80, 56 48, 25 38"
                        fill="none" stroke="url(#cyanStreamLogo)" strokeWidth="13" strokeLinecap="round" />

                    {/* Purple Animated Line */}
                    <path d="M 445 68 C 405 68, 375 95, 345 168 C 330 208, 330 262, 360 338 C 378 392, 335 440, 256 442 C 178 448, 115 395, 122 318 C 130 245, 175 205, 148 130 C 128 75, 88 62, 55 58"
                        fill="none" stroke="#d946ef" strokeWidth="10" strokeLinecap="round"
                        strokeDasharray="80 600" className="animate-[dash-flow-reverse_6s_linear_infinite]" />
                    <path d="M 445 68 C 405 68, 375 95, 345 168 C 330 208, 330 262, 360 338 C 378 392, 335 440, 256 442 C 178 448, 115 395, 122 318 C 130 245, 175 205, 148 130 C 128 75, 88 62, 55 58"
                        fill="none" stroke="#d946ef" strokeWidth="10" strokeLinecap="round" strokeOpacity="0.25" />

                    {/* Innermost Cyan */}
                    <path d="M 420 95 C 382 95, 358 118, 328 185 C 312 225, 312 275, 342 352 C 360 405, 318 425, 256 422 C 195 425, 138 380, 142 305 C 150 235, 192 195, 168 125 C 148 70, 108 80, 78 75"
                        fill="none" stroke="#22d3ee" strokeWidth="3" strokeLinecap="round" filter="url(#cyanGlow_logo)" />

                    {/* Stars */}
                    <g fill="#e2e8f0" opacity="0.65">
                        <circle cx="470" cy="50" r="1.5" />
                        <circle cx="360" cy="180" r="1.2" />
                        <circle cx="390" cy="375" r="1.5" />
                        <circle cx="200" cy="465" r="1.5" />
                        <circle cx="100" cy="360" r="1.2" />
                        <circle cx="150" cy="250" r="1" />
                        <circle cx="40" cy="55" r="1.2" />
                    </g>

                </svg>
            </div>

            {/* Text Logo */}
            {showText && (
                <div className={`font-extrabold tracking-tight ${sizeClasses[size].split(' ')[1]} flex items-center`}>
                    <span className="text-white">Uni</span>
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-fuchsia-500 to-violet-500 bg-[length:200%_auto] animate-[shimmer-text_8s_linear_infinite]">
                        Verse
                    </span>
                </div>
            )}
        </div>
    );
}
