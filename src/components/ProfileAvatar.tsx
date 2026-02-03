import { useRef, useLayoutEffect } from 'react';
import gsap from 'gsap';

interface ProfileAvatarProps {
    src: string;
    alt: string;
    isDark?: boolean;
}

/**
 * ProfileAvatar Component with GSAP Micro-interactions
 * 
 * Pure GSAP implementation - no motion settings required
 * 
 * Features:
 * - Scales 3.5x on hover with elastic bounce effect
 * - Expands from top-left corner (down and right)
 * - Adds cyan glow and full color on hover
 * - Sets z-index to 50 to overlay navbar content
 * - Smooth retraction with power2.out ease
 */
export function ProfileAvatar({ src, alt, isDark = true }: ProfileAvatarProps) {
    const wrapperRef = useRef<HTMLDivElement>(null);
    const imgRef = useRef<HTMLImageElement>(null);
    const glowRef = useRef<HTMLDivElement>(null);
    const timelineRef = useRef<gsap.core.Timeline | null>(null);

    // Initialize GSAP timeline
    useLayoutEffect(() => {
        if (!imgRef.current || !glowRef.current || !wrapperRef.current) return;

        const timeline = gsap.timeline({ paused: true });

        // Hover IN animation - Elastic bounce expansion
        timeline.to(wrapperRef.current, {
            zIndex: 50,
            duration: 0.01,
        }, 0);

        timeline.to(imgRef.current, {
            scale: 3.5,
            filter: 'grayscale(0)',
            duration: 0.6,
            ease: 'elastic.out(1, 0.3)',
        }, 0);

        timeline.to(glowRef.current, {
            opacity: 1,
            duration: 0.4,
            ease: 'power2.out',
        }, 0);

        timelineRef.current = timeline;

        return () => {
            timeline.kill();
        };
    }, []);

    const handleMouseEnter = () => {
        if (!timelineRef.current) return;
        timelineRef.current.play();
    };

    const handleMouseLeave = () => {
        if (!timelineRef.current) return;

        // Smooth retraction with power2.out
        gsap.to(imgRef.current, {
            scale: 1,
            filter: 'grayscale(0.2)',
            duration: 0.5,
            ease: 'power2.out',
        });

        gsap.to(glowRef.current, {
            opacity: 0,
            duration: 0.4,
            ease: 'power2.out',
        });

        gsap.to(wrapperRef.current, {
            zIndex: 'auto',
            duration: 0.01,
            delay: 0.5,
        });

        timelineRef.current.pause(0);
    };

    return (
        <div
            ref={wrapperRef}
            className="relative h-10 w-10"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            style={{
                transformOrigin: 'top left',
            }}
        >
            {/* Glow effect layer - positioned behind */}
            <div
                ref={glowRef}
                className="absolute inset-0 rounded-xl pointer-events-none"
                style={{
                    opacity: 0,
                    boxShadow: '0 0 24px 8px rgba(6, 182, 212, 0.6), 0 0 48px 12px rgba(6, 182, 212, 0.3)',
                    transformOrigin: 'top left',
                }}
            />

            {/* Image with border - NO overflow hidden to allow scaling */}
            <div
                className={`relative h-full w-full rounded-xl border transition-colors duration-300 ${isDark
                    ? 'border-cyan-500/20 hover:border-cyan-400/40'
                    : 'border-indigo-500/20 hover:border-indigo-400/40'
                    }`}
                style={{
                    transformOrigin: 'top left',
                }}
            >
                <img
                    ref={imgRef}
                    src={src}
                    alt={alt}
                    className="h-full w-full object-cover rounded-xl"
                    style={{
                        filter: 'grayscale(0.2)',
                        transformOrigin: 'top left',
                    }}
                />
            </div>
        </div>
    );
}
