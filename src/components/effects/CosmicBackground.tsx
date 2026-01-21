// CosmicBackground - Animated space background effect
'use client';

import { useEffect, useRef, useState } from 'react';

/**
 * Hook to detect reduced motion preference
 */
function useReducedMotion(): boolean {
    const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

    useEffect(() => {
        const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
        setPrefersReducedMotion(mediaQuery.matches);

        const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
        mediaQuery.addEventListener('change', handler);
        return () => mediaQuery.removeEventListener('change', handler);
    }, []);

    return prefersReducedMotion;
}

/**
 * Animated Stars Background (Canvas)
 * High-performance canvas-based starfield
 */
export function StarsBackground({
    starCount = 150,
    speed = 0.5
}: {
    starCount?: number;
    speed?: number;
}) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const reducedMotion = useReducedMotion();

    useEffect(() => {
        if (reducedMotion) return;

        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let animationId: number;
        let stars: { x: number; y: number; size: number; opacity: number; twinkleSpeed: number }[] = [];

        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            initStars();
        };

        const initStars = () => {
            stars = [];
            for (let i = 0; i < starCount; i++) {
                stars.push({
                    x: Math.random() * canvas.width,
                    y: Math.random() * canvas.height,
                    size: Math.random() * 2 + 0.5,
                    opacity: Math.random(),
                    twinkleSpeed: Math.random() * 0.02 + 0.005,
                });
            }
        };

        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            stars.forEach((star) => {
                star.opacity += star.twinkleSpeed * speed;
                if (star.opacity > 1 || star.opacity < 0.2) {
                    star.twinkleSpeed *= -1;
                }

                ctx.beginPath();
                ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(255, 255, 255, ${star.opacity})`;
                ctx.fill();
            });

            animationId = requestAnimationFrame(animate);
        };

        resize();
        animate();

        window.addEventListener('resize', resize);

        return () => {
            window.removeEventListener('resize', resize);
            cancelAnimationFrame(animationId);
        };
    }, [starCount, speed, reducedMotion]);

    if (reducedMotion) return null;

    return (
        <canvas
            ref={canvasRef}
            className="fixed inset-0 pointer-events-none z-0"
            aria-hidden="true"
        />
    );
}

/**
 * CSS-based Stars (Lightweight)
 * Pure CSS animation - performant and accessible
 */
export function CSSStars() {
    const reducedMotion = useReducedMotion();

    if (reducedMotion) return null;

    return (
        <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden" aria-hidden="true">
            <div className="stars-layer-1" />
            <div className="stars-layer-2" />
            <div className="stars-layer-3" />
        </div>
    );
}

/**
 * Floating Orbs / Nebula Effect
 * Vibrant gradient orbs with ambient floating animation
 */
export function FloatingOrbs() {
    const reducedMotion = useReducedMotion();

    return (
        <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden" aria-hidden="true">
            {/* Large nebula orb - top right - Indigo */}
            <div
                className={`absolute w-[600px] h-[600px] rounded-full opacity-40 ${!reducedMotion ? 'animate-float-slow' : ''}`}
                style={{
                    top: '-15%',
                    right: '-15%',
                    background: 'radial-gradient(circle, rgba(99, 102, 241, 0.5) 0%, rgba(99, 102, 241, 0.2) 40%, transparent 70%)',
                    filter: 'blur(80px)',
                }}
            />
            {/* Medium stellar orb - bottom left - Purple */}
            <div
                className={`absolute w-[500px] h-[500px] rounded-full opacity-35 ${!reducedMotion ? 'animate-float-slower' : ''}`}
                style={{
                    bottom: '-20%',
                    left: '-15%',
                    background: 'radial-gradient(circle, rgba(139, 92, 246, 0.5) 0%, rgba(139, 92, 246, 0.2) 40%, transparent 70%)',
                    filter: 'blur(70px)',
                    animationDelay: reducedMotion ? undefined : '-3s',
                }}
            />
            {/* Cyan accent orb - center right */}
            <div
                className={`absolute w-[400px] h-[400px] rounded-full opacity-30 ${!reducedMotion ? 'animate-float-medium' : ''}`}
                style={{
                    top: '30%',
                    right: '10%',
                    background: 'radial-gradient(circle, rgba(34, 211, 238, 0.45) 0%, rgba(6, 182, 212, 0.15) 40%, transparent 70%)',
                    filter: 'blur(60px)',
                    animationDelay: reducedMotion ? undefined : '-5s',
                }}
            />
            {/* Rose/Pink accent orb - top left */}
            <div
                className={`absolute w-[350px] h-[350px] rounded-full opacity-25 ${!reducedMotion ? 'animate-float-slow' : ''}`}
                style={{
                    top: '10%',
                    left: '5%',
                    background: 'radial-gradient(circle, rgba(244, 63, 94, 0.4) 0%, rgba(236, 72, 153, 0.15) 40%, transparent 70%)',
                    filter: 'blur(50px)',
                    animationDelay: reducedMotion ? undefined : '-7s',
                }}
            />
        </div>
    );
}

/**
 * Aurora Effect - Animated gradient waves
 */
export function AuroraEffect() {
    const reducedMotion = useReducedMotion();

    if (reducedMotion) return null;

    return (
        <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden opacity-50" aria-hidden="true">
            <div className="aurora-wave aurora-wave-1" />
            <div className="aurora-wave aurora-wave-2" />
            <div className="aurora-wave aurora-wave-3" />
        </div>
    );
}

/**
 * Meteor Shower Effect
 * Uses deterministic positioning to avoid hydration mismatches
 */
export function MeteorShower({ count = 5 }: { count?: number }) {
    const reducedMotion = useReducedMotion();

    if (reducedMotion) return null;

    // Deterministic positions based on index
    const meteors = Array.from({ length: count }).map((_, i) => ({
        left: `${(i * 19 + 11) % 100}%`,
        top: `${(i * 13 + 5) % 50}%`,
        delay: `${i * 2.3}s`,
        duration: `${3 + (i % 2)}s`,
    }));

    return (
        <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden" aria-hidden="true">
            {meteors.map((m, i) => (
                <div
                    key={i}
                    className="meteor"
                    style={{
                        left: m.left,
                        top: m.top,
                        animationDelay: m.delay,
                        animationDuration: m.duration,
                    }}
                />
            ))}
        </div>
    );
}

/**
 * Grid Pattern Overlay
 * Subtle grid for depth perception
 */
export function GridPattern() {
    return (
        <div
            className="fixed inset-0 pointer-events-none z-0 opacity-[0.02]"
            aria-hidden="true"
            style={{
                backgroundImage: `
                    linear-gradient(rgba(255,255,255,0.08) 1px, transparent 1px),
                    linear-gradient(90deg, rgba(255,255,255,0.08) 1px, transparent 1px)
                `,
                backgroundSize: '60px 60px',
            }}
        />
    );
}

/**
 * Glow Cursor Effect
 * Follows mouse with subtle nebula glow
 */
export function GlowCursor() {
    const glowRef = useRef<HTMLDivElement>(null);
    const reducedMotion = useReducedMotion();

    useEffect(() => {
        if (reducedMotion) return;

        const glow = glowRef.current;
        if (!glow) return;

        const handleMouseMove = (e: MouseEvent) => {
            glow.style.left = `${e.clientX}px`;
            glow.style.top = `${e.clientY}px`;
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, [reducedMotion]);

    if (reducedMotion) return null;

    return (
        <div
            ref={glowRef}
            className="fixed w-[300px] h-[300px] pointer-events-none z-0 -translate-x-1/2 -translate-y-1/2 opacity-30 transition-opacity duration-300"
            style={{
                background: 'radial-gradient(circle, rgba(99, 102, 241, 0.3) 0%, transparent 70%)',
                filter: 'blur(40px)',
            }}
            aria-hidden="true"
        />
    );
}

/**
 * Combined Cosmic Background
 * All-in-one configurable cosmic effects component
 * Respects prefers-reduced-motion automatically
 */
export default function CosmicBackground({
    enableStars = true,
    enableOrbs = true,
    enableGrid = false,
    enableMeteors = false,
    enableGlowCursor = false,
}: {
    enableStars?: boolean;
    enableOrbs?: boolean;
    enableGrid?: boolean;
    enableMeteors?: boolean;
    enableGlowCursor?: boolean;
}) {
    return (
        <>
            {enableStars && <CSSStars />}
            {enableOrbs && <FloatingOrbs />}
            {enableGrid && <GridPattern />}
            {enableMeteors && <MeteorShower />}
            {enableGlowCursor && <GlowCursor />}
        </>
    );
}

