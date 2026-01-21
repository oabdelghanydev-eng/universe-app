// GlobalEffects - Global visual effects wrapper
'use client';

import CosmicBackground from '@/components/effects/CosmicBackground';

/**
 * Global Effects Provider
 * Renders cosmic background effects across all pages
 */
export default function GlobalEffects() {
    return (
        <CosmicBackground
            enableStars={true}
            enableOrbs={true}
            enableMeteors={false}
            enableGrid={false}
            enableGlowCursor={false}
        />
    );
}

