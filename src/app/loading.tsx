// Loading State - Global loading indicator
export default function Loading() {
    return (
        <div className="min-h-[70vh] flex items-center justify-center">
            <div className="text-center">
                {/* Orbital Loader */}
                <div className="relative w-20 h-20 mx-auto mb-6">
                    {/* Outer ring */}
                    <div className="absolute inset-0 rounded-full border-2 border-[var(--space-600)] border-t-[var(--nebula-400)] animate-spin" />

                    {/* Inner ring (counter-rotation effect) */}
                    <div className="absolute inset-3 rounded-full border-2 border-[var(--space-700)] border-b-[var(--stellar-400)] animate-spin" style={{ animationDirection: 'reverse', animationDuration: '0.75s' }} />

                    {/* Center dot */}
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-3 h-3 rounded-full bg-gradient-to-br from-nebula-400 to-stellar-400 animate-pulse" />
                    </div>
                </div>

                {/* Text */}
                <p className="text-[var(--text-muted)] text-sm">
                    جاري التحميل...
                </p>
            </div>
        </div>
    );
}

