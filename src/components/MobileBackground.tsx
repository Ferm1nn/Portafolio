import React, { useRef, useEffect, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * MobileBackground — CSS-only backgrounds for mobile viewports.
 *
 * Two modes:
 *   1. Static variants (mesh, hex, circuit, aurora) — used on inner pages
 *   2. Scroll-reactive "network" variant — used on Home page, ties background
 *      colors and animation speed to scroll position via GSAP ScrollTrigger
 *
 * Scroll phases for "network" variant:
 *   Phase 1 (Hero)       → Cyber blue   #06b6d4 / #0f3a68
 *   Phase 2 (Methodology) → Matrix green #00ffcc / #0a3d2a
 *   Phase 3 (CTA)        → Threat red   #ff3366 / #3d0a1a
 *
 * Uses 100dvh, position: fixed, CSS transforms/opacity for GPU compositing.
 */

type MobileBackgroundVariant = 'network' | 'mesh' | 'hex' | 'circuit' | 'aurora';

interface MobileBackgroundProps {
    variant: MobileBackgroundVariant;
}

/* ════════════════════════ Shared ════════════════════════ */

const baseStyle: React.CSSProperties = {
    position: 'fixed',
    inset: 0,
    width: '100vw',
    height: '100dvh',
    pointerEvents: 'none',
    zIndex: -1,
    overflow: 'hidden',
};

/* ════════════════════════ Static Keyframes ════════════════════════ */

const staticKeyframes = `
@keyframes mb-pulse {
  0%, 100% { opacity: 0.4; transform: scale(1); }
  50%      { opacity: 0.75; transform: scale(1.12); }
}
@keyframes mb-float {
  0%   { transform: translate(0, 0) rotate(0deg); }
  33%  { transform: translate(12px, -18px) rotate(1deg); }
  66%  { transform: translate(-8px, 10px) rotate(-0.5deg); }
  100% { transform: translate(0, 0) rotate(0deg); }
}
@keyframes mb-rise {
  0%   { transform: translateY(0) scale(1); opacity: 0.3; }
  50%  { transform: translateY(-15px) scale(1.2); opacity: 0.6; }
  100% { transform: translateY(0) scale(1); opacity: 0.3; }
}
@keyframes mb-scan {
  0%   { top: -10%; opacity: 0; }
  10%  { opacity: 0.8; }
  90%  { opacity: 0.8; }
  100% { top: 110%; opacity: 0; }
}
@keyframes mb-drop {
  0%   { top: -20%; opacity: 0; }
  10%  { opacity: 1; }
  80%  { opacity: 1; }
  100% { top: 120%; opacity: 0; }
}
@keyframes mb-aurora {
  0%   { background-position: 0% 50%; }
  50%  { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}
@keyframes mb-breathe {
  0%, 100% { opacity: 0.15; box-shadow: 0 0 4px rgba(6,182,212,0.2); }
  50%      { opacity: 0.5; box-shadow: 0 0 12px rgba(6,182,212,0.5); }
}
`;

/* ══════════════════════════════════════════════════════════════════
   SCROLL-REACTIVE NETWORK VARIANT (Home page only)
   ══════════════════════════════════════════════════════════════════ */

interface ScrollPhaseColors {
    primary: string;      // Node / glow color
    primaryGlow: string;  // Box-shadow glow
    glowBg: string;       // Radial gradient center
    dotGrid: string;      // Dot pattern fill
    lineSvg: string;      // SVG line stroke
}

const PHASES: ScrollPhaseColors[] = [
    // Phase 0 — Cyber Blue (Hero)
    {
        primary: '#06b6d4',
        primaryGlow: 'rgba(6,182,212,0.6)',
        glowBg: 'rgba(6,182,212,0.14)',
        dotGrid: 'rgba(6,182,212,0.2)',
        lineSvg: 'rgba(6,182,212,0.08)',
    },
    // Phase 1 — Matrix Green (Methodology / System Architecture)
    {
        primary: '#00ffcc',
        primaryGlow: 'rgba(0,255,204,0.6)',
        glowBg: 'rgba(0,255,204,0.14)',
        dotGrid: 'rgba(0,255,204,0.2)',
        lineSvg: 'rgba(0,255,204,0.08)',
    },
    // Phase 2 — Threat Red (Sentinel / CTA)
    {
        primary: '#ff3366',
        primaryGlow: 'rgba(255,51,102,0.6)',
        glowBg: 'rgba(255,51,102,0.14)',
        dotGrid: 'rgba(255,51,102,0.2)',
        lineSvg: 'rgba(255,51,102,0.08)',
    },
];

const ScrollReactiveNetwork: React.FC = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const glowRef = useRef<HTMLDivElement>(null);
    const floatGlowRef = useRef<HTMLDivElement>(null);
    const dotGridRef = useRef<HTMLDivElement>(null);
    const nodesRef = useRef<(HTMLDivElement | null)[]>([]);
    const linesRef = useRef<SVGSVGElement>(null);
    const scanLineRef = useRef<HTMLDivElement>(null);

    // Track current phase for animation speed changes
    const [activePhase, setActivePhase] = useState(0);

    useEffect(() => {
        const ctx = gsap.context(() => {
            // ─── Phase triggers ───
            // We target sections inside HomeContent by their class/structure.
            // Hero = #hero, Methodology = .methodology-section, CTA = last section

            // Phase 1: Blue → Green (when methodology section enters)
            ScrollTrigger.create({
                trigger: '.methodology-section',
                start: 'top 80%',
                end: 'bottom 20%',
                onEnter: () => animateToPhase(1),
                onLeaveBack: () => animateToPhase(0),
            });

            // Phase 2: Green → Red (when service cards / CTA enters)
            ScrollTrigger.create({
                trigger: '.service-card',
                start: 'top 60%',
                end: 'bottom 20%',
                onEnter: () => animateToPhase(2),
                onLeaveBack: () => animateToPhase(1),
            });
        });

        return () => ctx.revert();
    }, []);

    const animateToPhase = (phaseIndex: number) => {
        const phase = PHASES[phaseIndex];
        setActivePhase(phaseIndex);

        // ─── Radial glow ───
        if (glowRef.current) {
            gsap.to(glowRef.current, {
                background: `radial-gradient(ellipse at center, ${phase.glowBg} 0%, transparent 60%)`,
                duration: 1.2,
                ease: 'power2.inOut',
            });
        }

        // ─── Floating accent glow ───
        if (floatGlowRef.current) {
            gsap.to(floatGlowRef.current, {
                background: `radial-gradient(ellipse at center, ${phase.glowBg.replace('0.14', '0.1')} 0%, transparent 65%)`,
                duration: 1.2,
                ease: 'power2.inOut',
            });
        }

        // ─── Dot grid ───
        if (dotGridRef.current) {
            gsap.to(dotGridRef.current, {
                backgroundImage: `radial-gradient(circle, ${phase.dotGrid} 1px, transparent 1px)`,
                duration: 1.2,
                ease: 'power2.inOut',
            });
        }

        // ─── Connection nodes ───
        nodesRef.current.forEach((node, i) => {
            if (!node) return;
            gsap.to(node, {
                background: phase.primary,
                boxShadow: `0 0 12px ${phase.primaryGlow}, 0 0 24px ${phase.primaryGlow.replace('0.6', '0.3')}`,
                duration: 0.8 + i * 0.1,
                ease: 'power2.inOut',
            });
        });

        // ─── SVG connection lines ───
        if (linesRef.current) {
            const lines = linesRef.current.querySelectorAll('line');
            lines.forEach((line) => {
                gsap.to(line, {
                    attr: { stroke: phase.primary },
                    duration: 1.0,
                    ease: 'power2.inOut',
                });
            });
        }

        // ─── Scan line (shows on phase 1+, hidden on phase 0) ───
        if (scanLineRef.current) {
            if (phaseIndex > 0) {
                gsap.to(scanLineRef.current, {
                    opacity: 1,
                    background: `linear-gradient(90deg, transparent 0%, ${phase.primary}99 30%, ${phase.primary} 50%, ${phase.primary}99 70%, transparent 100%)`,
                    boxShadow: `0 0 20px ${phase.primaryGlow}, 0 0 60px ${phase.primaryGlow.replace('0.6', '0.15')}`,
                    duration: 0.8,
                    ease: 'power2.inOut',
                });
            } else {
                gsap.to(scanLineRef.current, {
                    opacity: 0,
                    duration: 0.5,
                });
            }
        }
    };

    // Node configuration
    const nodes = [
        { top: '15%', left: '20%', delay: '0s', size: 6 },
        { top: '35%', left: '75%', delay: '2s', size: 5 },
        { top: '60%', left: '40%', delay: '4s', size: 7 },
        { top: '80%', left: '85%', delay: '1s', size: 4 },
        { top: '45%', left: '10%', delay: '3s', size: 5 },
        { top: '70%', left: '60%', delay: '5s', size: 6 },
    ];

    // Animation speed based on phase
    const speedMultiplier = activePhase === 0 ? 1 : activePhase === 1 ? 0.7 : 1.3;

    return (
        <div ref={containerRef} style={{ ...baseStyle, background: '#020617' }}>
            {/* Primary radial glow */}
            <div
                ref={glowRef}
                style={{
                    position: 'absolute', top: '20%', left: '50%',
                    width: '130vw', height: '55vh',
                    transform: 'translateX(-50%)',
                    background: `radial-gradient(ellipse at center, ${PHASES[0].glowBg} 0%, transparent 60%)`,
                    animation: `mb-pulse ${7 * speedMultiplier}s ease-in-out infinite`,
                }}
            />

            {/* Floating accent glow */}
            <div
                ref={floatGlowRef}
                style={{
                    position: 'absolute', bottom: '5%', right: '-5%',
                    width: '55vw', height: '35vh',
                    background: `radial-gradient(ellipse at center, ${PHASES[0].glowBg.replace('0.14', '0.1')} 0%, transparent 65%)`,
                    animation: `mb-float ${16 * speedMultiplier}s ease-in-out infinite`,
                }}
            />

            {/* Dot particle field */}
            <div
                ref={dotGridRef}
                style={{
                    position: 'absolute', inset: 0,
                    backgroundImage: `radial-gradient(circle, ${PHASES[0].dotGrid} 1px, transparent 1px)`,
                    backgroundSize: '28px 28px',
                    opacity: 0.5,
                }}
            />

            {/* Floating connection nodes */}
            {nodes.map((node, i) => (
                <div
                    key={i}
                    ref={(el) => { nodesRef.current[i] = el; }}
                    style={{
                        position: 'absolute', top: node.top, left: node.left,
                        width: node.size, height: node.size,
                        borderRadius: '50%',
                        background: PHASES[0].primary,
                        boxShadow: `0 0 12px ${PHASES[0].primaryGlow}, 0 0 24px ${PHASES[0].primaryGlow.replace('0.6', '0.3')}`,
                        animation: `mb-rise ${(5 + i) * speedMultiplier}s ease-in-out ${node.delay} infinite`,
                    }}
                />
            ))}

            {/* SVG connection lines */}
            <svg
                ref={linesRef}
                style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.12 }}
            >
                <line x1="20%" y1="15%" x2="75%" y2="35%" stroke={PHASES[0].primary} strokeWidth="0.5" />
                <line x1="75%" y1="35%" x2="40%" y2="60%" stroke={PHASES[0].primary} strokeWidth="0.5" />
                <line x1="40%" y1="60%" x2="10%" y2="45%" stroke={PHASES[0].primary} strokeWidth="0.5" />
                <line x1="10%" y1="45%" x2="20%" y2="15%" stroke={PHASES[0].primary} strokeWidth="0.5" />
                <line x1="40%" y1="60%" x2="85%" y2="80%" stroke={PHASES[0].primary} strokeWidth="0.5" />
                <line x1="60%" y1="70%" x2="85%" y2="80%" stroke={PHASES[0].primary} strokeWidth="0.5" />
            </svg>

            {/* Scan line — appears in phase 1+, cycles top to bottom */}
            <div
                ref={scanLineRef}
                style={{
                    position: 'absolute', left: 0, width: '100%', height: '2px',
                    background: `linear-gradient(90deg, transparent 0%, ${PHASES[0].primary}99 30%, ${PHASES[0].primary} 50%, ${PHASES[0].primary}99 70%, transparent 100%)`,
                    boxShadow: `0 0 20px ${PHASES[0].primaryGlow}, 0 0 60px ${PHASES[0].primaryGlow.replace('0.6', '0.15')}`,
                    animation: 'mb-scan 6s linear infinite',
                    opacity: 0,
                }}
            />
        </div>
    );
};

/* ══════════════════════════════════════════════════════════════════
   STATIC VARIANTS (inner pages)
   ══════════════════════════════════════════════════════════════════ */

const MeshVariant: React.FC = () => (
    <div style={{ ...baseStyle, background: '#020617' }}>
        <div style={{
            position: 'absolute', inset: 0,
            backgroundImage: `linear-gradient(rgba(6,182,212,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(6,182,212,0.04) 1px, transparent 1px)`,
            backgroundSize: '40px 40px',
        }} />
        {[
            { top: '20%', left: '25%', delay: '0s' }, { top: '20%', left: '65%', delay: '1.5s' },
            { top: '50%', left: '45%', delay: '0.8s' }, { top: '50%', left: '85%', delay: '2.5s' },
            { top: '80%', left: '15%', delay: '3s' }, { top: '80%', left: '55%', delay: '1.2s' },
            { top: '35%', left: '5%', delay: '2s' }, { top: '65%', left: '75%', delay: '0.5s' },
        ].map((node, i) => (
            <div key={i} style={{
                position: 'absolute', top: node.top, left: node.left,
                width: 4, height: 4, borderRadius: '50%', background: '#06b6d4',
                animation: `mb-breathe ${3 + (i % 3)}s ease-in-out ${node.delay} infinite`,
            }} />
        ))}
        <div style={{
            position: 'absolute', top: '30%', left: '50%',
            width: '120vw', height: '50vh', transform: 'translateX(-50%)',
            background: 'radial-gradient(ellipse at center, rgba(6,182,212,0.08) 0%, transparent 55%)',
            animation: 'mb-pulse 10s ease-in-out infinite',
        }} />
        <div style={{
            position: 'absolute', top: '0', right: '-10%',
            width: '50vw', height: '30vh',
            background: 'radial-gradient(ellipse at center, rgba(168,85,247,0.07) 0%, transparent 60%)',
            animation: 'mb-float 18s ease-in-out infinite',
        }} />
    </div>
);

const HexVariant: React.FC = () => (
    <div style={{ ...baseStyle, background: '#020617' }}>
        <div style={{
            position: 'absolute', inset: 0,
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='56' height='100' viewBox='0 0 56 100'%3E%3Cpath d='M28 66L0 50L0 16L28 0L56 16L56 50L28 66L28 100' fill='none' stroke='rgba(34,211,238,0.07)' stroke-width='1'/%3E%3Cpath d='M28 0L28 34L0 50L0 84L28 100L56 84L56 50L28 34' fill='none' stroke='rgba(34,211,238,0.04)' stroke-width='1'/%3E%3C/svg%3E")`,
            backgroundSize: '56px 100px', opacity: 0.9,
        }} />
        <div style={{
            position: 'absolute', left: 0, width: '100%', height: '2px',
            background: 'linear-gradient(90deg, transparent 0%, rgba(34,211,238,0.6) 30%, rgba(34,211,238,0.8) 50%, rgba(34,211,238,0.6) 70%, transparent 100%)',
            boxShadow: '0 0 20px rgba(34,211,238,0.4), 0 0 60px rgba(34,211,238,0.15)',
            animation: 'mb-scan 8s linear infinite',
        }} />
        <div style={{
            position: 'absolute', top: '10%', left: '50%',
            width: '100vw', height: '35vh', transform: 'translateX(-50%)',
            background: 'radial-gradient(ellipse at center, rgba(34,211,238,0.1) 0%, transparent 55%)',
            animation: 'mb-pulse 9s ease-in-out infinite',
        }} />
        <div style={{
            position: 'absolute', bottom: '15%', left: '-5%',
            width: '45vw', height: '25vh',
            background: 'radial-gradient(ellipse at center, rgba(34,211,238,0.06) 0%, transparent 60%)',
            animation: 'mb-float 14s ease-in-out infinite',
        }} />
    </div>
);

const CircuitVariant: React.FC = () => (
    <div style={{ ...baseStyle, background: '#020617' }}>
        <div style={{
            position: 'absolute', inset: 0,
            backgroundImage: `
        linear-gradient(0deg, transparent 49.5%, rgba(34,211,238,0.035) 49.5%, rgba(34,211,238,0.035) 50.5%, transparent 50.5%),
        linear-gradient(90deg, transparent 49.5%, rgba(34,211,238,0.025) 49.5%, rgba(34,211,238,0.025) 50.5%, transparent 50.5%)
      `,
            backgroundSize: '55px 55px',
        }} />
        {[
            { left: '15%', delay: '0s', dur: '6s', width: 2, color: 'rgba(34,211,238,0.5)', height: '80px' },
            { left: '35%', delay: '2s', dur: '8s', width: 1.5, color: 'rgba(34,211,238,0.4)', height: '60px' },
            { left: '55%', delay: '1s', dur: '7s', width: 2, color: 'rgba(34,211,238,0.6)', height: '100px' },
            { left: '75%', delay: '3s', dur: '5s', width: 1.5, color: 'rgba(34,211,238,0.35)', height: '50px' },
            { left: '90%', delay: '4s', dur: '9s', width: 1, color: 'rgba(34,211,238,0.3)', height: '70px' },
            { left: '25%', delay: '5s', dur: '7.5s', width: 1.5, color: 'rgba(168,85,247,0.3)', height: '65px' },
            { left: '65%', delay: '2.5s', dur: '6.5s', width: 1, color: 'rgba(168,85,247,0.25)', height: '55px' },
        ].map((drop, i) => (
            <div key={i} style={{
                position: 'absolute', left: drop.left,
                width: drop.width, height: drop.height,
                background: `linear-gradient(to bottom, ${drop.color}, transparent)`,
                borderRadius: '0 0 2px 2px',
                animation: `mb-drop ${drop.dur} linear ${drop.delay} infinite`,
            }} />
        ))}
        {[
            { top: '20%', left: '15%' }, { top: '45%', left: '55%' },
            { top: '70%', left: '35%' }, { top: '30%', left: '75%' }, { top: '85%', left: '90%' },
        ].map((node, i) => (
            <div key={`node-${i}`} style={{
                position: 'absolute', top: node.top, left: node.left,
                width: 6, height: 6, borderRadius: '1px',
                border: '1px solid rgba(34,211,238,0.3)',
                animation: `mb-breathe ${4 + i}s ease-in-out ${i * 0.7}s infinite`,
            }} />
        ))}
        <div style={{
            position: 'absolute', top: '40%', left: '50%',
            width: '100vw', height: '40vh', transform: 'translateX(-50%)',
            background: 'radial-gradient(ellipse at center, rgba(6,182,212,0.06) 0%, transparent 50%)',
            animation: 'mb-pulse 12s ease-in-out infinite',
        }} />
    </div>
);

const AuroraVariant: React.FC = () => (
    <div style={{
        ...baseStyle,
        background: 'linear-gradient(160deg, #020617 0%, #0c1222 35%, #0a0f1f 65%, #020617 100%)',
    }}>
        <div style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(270deg, rgba(6,182,212,0.1), rgba(168,85,247,0.08), rgba(6,182,212,0.06), rgba(168,85,247,0.1))',
            backgroundSize: '400% 400%',
            animation: 'mb-aurora 20s ease infinite',
        }} />
        <div style={{
            position: 'absolute', inset: 0,
            backgroundImage: 'radial-gradient(circle, rgba(6,182,212,0.12) 1px, transparent 1px)',
            backgroundSize: '25px 25px', opacity: 0.5,
            animation: 'mb-float 25s ease-in-out infinite',
        }} />
        <div style={{
            position: 'absolute', inset: 0,
            backgroundImage: 'radial-gradient(circle, rgba(168,85,247,0.1) 1px, transparent 1px)',
            backgroundSize: '25px 25px', backgroundPosition: '12px 12px', opacity: 0.4,
            animation: 'mb-float 30s ease-in-out 2s infinite reverse',
        }} />
        <div style={{
            position: 'absolute', top: '35%', left: '50%',
            width: '100vw', height: '45vh', transform: 'translateX(-50%)',
            background: 'radial-gradient(ellipse at center, rgba(168,85,247,0.08) 0%, transparent 55%)',
            animation: 'mb-pulse 11s ease-in-out infinite',
        }} />
    </div>
);

/* ════════════════════════ Variant Map ════════════════════════ */

const STATIC_VARIANT_MAP: Record<string, React.FC> = {
    mesh: MeshVariant,
    hex: HexVariant,
    circuit: CircuitVariant,
    aurora: AuroraVariant,
};

/* ════════════════════════ Public Component ════════════════════════ */

export function MobileBackground({ variant }: MobileBackgroundProps) {
    // Network variant uses the scroll-reactive version
    if (variant === 'network') {
        return (
            <>
                <style>{staticKeyframes}</style>
                <ScrollReactiveNetwork />
            </>
        );
    }

    // All other variants use static backgrounds
    const Variant = STATIC_VARIANT_MAP[variant];
    if (!Variant) return null;

    return (
        <>
            <style>{staticKeyframes}</style>
            <Variant />
        </>
    );
}
