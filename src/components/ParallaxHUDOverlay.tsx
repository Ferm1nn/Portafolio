import { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { CyberRevealWrapper } from './CyberRevealWrapper';

gsap.registerPlugin(ScrollTrigger);

interface ParallaxHUDOverlayProps {
    className?: string;
    intensity?: number;
}

export function ParallaxHUDOverlay({ className = '', intensity = 1 }: ParallaxHUDOverlayProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const layerRefs = useRef<(HTMLDivElement | null)[]>([]);

    useLayoutEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const layers = layerRefs.current.filter(Boolean);
        if (!layers.length) return;

        // Constraint 1: Transform Separation Strategy
        // ScrollTrigger -> yPercent (Vertical Parallax)
        // Mouse -> x, y (pixels) (depth simulation)

        const ctx = gsap.context(() => {
            // 1. Idle "Breathing" Animation (Constraint 3)
            // Subtle oscillation to keep the interface alive
            layers.forEach((layer, i) => {
                gsap.to(layer, {
                    scale: 1.05,
                    opacity: 0.8,
                    duration: 3 + i, // Staggered duration
                    repeat: -1,
                    yoyo: true,
                    ease: 'sine.inOut',
                });

                // Setup ScrollTrigger for each layer (yPercent)
                // Layer 1 (Back): Slowest
                // Layer 3 (Front): Fastest
                const scrollSpeed = (i + 1) * 15;
                gsap.to(layer, {
                    yPercent: -scrollSpeed,
                    ease: 'none',
                    scrollTrigger: {
                        trigger: container,
                        start: 'top top',
                        end: 'bottom top',
                        scrub: true,
                    },
                });
            });
        }, containerRef);

        // 2. Mouse Interaction (Constraint 2)
        // Use gsap.quickTo for high performance 60fps
        const xSetters = layers.map((layer) => gsap.quickTo(layer, 'x', { duration: 0.6, ease: 'power3.out' }));
        const ySetters = layers.map((layer) => gsap.quickTo(layer, 'y', { duration: 0.6, ease: 'power3.out' }));

        const handleMouseMove = (e: MouseEvent) => {
            const { clientX, clientY } = e;
            const { innerWidth, innerHeight } = window;

            // Calculate normalized mouse position (-1 to 1)
            const xNorm = (clientX / innerWidth) * 2 - 1;
            const yNorm = (clientY / innerHeight) * 2 - 1;

            layers.forEach((_, i) => {
                // Depth Lag: Layer 3 moves most, Layer 1 moves least
                // Inversion: Moving mouse UP (negative y) should move elements DOWN (positive y) -> multiply by negative
                const depthFactor = (i + 1) * 20 * intensity;

                // Inverted movement
                const xTarget = xNorm * -depthFactor;
                const yTarget = yNorm * -depthFactor;

                xSetters[i](xTarget);
                ySetters[i](yTarget);
            });
        };

        window.addEventListener('mousemove', handleMouseMove);

        return () => {
            ctx.revert();
            window.removeEventListener('mousemove', handleMouseMove);
        };
    }, [intensity]);

    // Visual Assets (Cybersecurity/Tech Theme)
    // Using pure SVGs for performance and lack of external dependencies in this snippet

    return (
        <div
            ref={containerRef}
            className={`absolute inset-0 z-50 pointer-events-none overflow-hidden ${className}`}
            aria-hidden="true"
        >
            {/* Layer 1: Background - Faint Grid / Connecting Lines */}
            <div
                ref={el => { layerRefs.current[0] = el; }}
                className="absolute inset-0 flex items-center justify-center opacity-40"
            >
                <svg viewBox="0 0 1000 1000" className="w-full h-full text-cyan-500 fill-current">
                    <circle cx="500" cy="500" r="400" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="10 20" className="animate-spin" style={{ animationDuration: '60s' }} />
                    <path d="M100,500 L900,500 M500,100 L500,900" stroke="currentColor" strokeWidth="0.5" />
                    <circle cx="500" cy="500" r="200" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.5" />
                </svg>
            </div>

            {/* Layer 2: Mid - Data Nodes */}
            <div
                ref={el => { layerRefs.current[1] = el; }}
                className="absolute inset-0 flex items-center justify-center opacity-60 mix-blend-screen"
            >
                <svg viewBox="0 0 1000 1000" className="w-[120%] h-[120%] text-blue-400">
                    {/* Random scattered nodes */}
                    <circle cx="250" cy="300" r="4" fill="currentColor" />
                    <circle cx="750" cy="300" r="4" fill="currentColor" />
                    <circle cx="250" cy="700" r="4" fill="currentColor" />
                    <circle cx="750" cy="700" r="4" fill="currentColor" />

                    {/* Connecting lines */}
                    <line x1="250" y1="300" x2="350" y2="400" stroke="currentColor" strokeWidth="1" />
                    <line x1="750" y1="300" x2="650" y2="400" stroke="currentColor" strokeWidth="1" />
                </svg>
            </div>

            {/* Layer 3: Front - Floating High-Tech Elements (Closest) */}
            <div
                ref={el => { layerRefs.current[2] = el; }}
                className="absolute inset-0 flex items-center justify-center opacity-80"
            >
                <div className="relative w-full h-full max-w-4xl max-h-4xl">
                    {/* Floating 'Widgets' */}
                    <div className="absolute top-[20%] left-[10%] w-32 h-32 border border-cyan-500/30 rounded-lg backdrop-blur-sm bg-cyan-900/10 flex items-center justify-center">
                        <CyberRevealWrapper variant="decrypt" text="SYS.MONITOR" className="text-[10px] text-cyan-400 font-mono" />
                    </div>

                    <CyberRevealWrapper variant="glitch" className="absolute bottom-[20%] right-[10%]">
                        <div className="w-48 h-24 border-t-2 border-b-2 border-blue-500/30 bg-blue-900/5" />
                    </CyberRevealWrapper>

                    {/* Decorative circles */}
                    <CyberRevealWrapper variant="scan" className="absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2">
                        <div className="w-[600px] h-[600px] border border-white/5 rounded-full" />
                    </CyberRevealWrapper>
                </div>
            </div>
        </div>
    );
}
