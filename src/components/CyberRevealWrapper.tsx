import { useRef, useLayoutEffect, useState, type ReactNode } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

type RevealVariant = 'decrypt' | 'scan' | 'glitch';

interface CyberRevealWrapperProps {
    children?: ReactNode;
    variant?: RevealVariant;
    className?: string;
    text?: string; // Required for 'decrypt' if not wrapping text directly
    delay?: number;
}

const CHARS = 'ABCDEF0123456789!@#$%^&*()_+-=[]{}|;:,.<>?';

export function CyberRevealWrapper({
    children,
    variant = 'scan',
    className = '',
    text = '',
    delay = 0
}: CyberRevealWrapperProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const [decodedText, setDecodedText] = useState(variant === 'decrypt' ? '' : text);

    useLayoutEffect(() => {
        const el = containerRef.current;
        if (!el) return;

        const ctx = gsap.context(() => {
            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: el,
                    start: 'top 85%', // Trigger slightly before it enters fully
                    toggleActions: 'play none none reverse',
                },
                delay: delay,
            });

            if (variant === 'decrypt') {
                // Decrypt Effect: Scramble Text
                const targetText = text || (typeof children === 'string' ? children : '');
                const length = targetText.length;
                const scrambleObj = { val: 0 };

                tl.to(scrambleObj, {
                    val: 1,
                    duration: 1.5,
                    ease: 'power2.inOut',
                    onUpdate: () => {
                        const progress = scrambleObj.val;
                        let result = '';
                        for (let i = 0; i < length; i++) {
                            if (i < Math.floor(progress * length)) {
                                result += targetText[i];
                            } else {
                                result += CHARS[Math.floor(Math.random() * CHARS.length)];
                            }
                        }
                        setDecodedText(result);
                    },
                });

                // Fade in container
                tl.fromTo(el, { opacity: 0 }, { opacity: 1, duration: 0.5, ease: 'power2.out' }, 0);
            }
            else if (variant === 'scan') {
                // Scan Effect: Clip Path + Glowing Line
                // Initial state: Hidden by clip-path
                gsap.set(el, { clipPath: 'inset(0 0 100% 0)' });

                // The scan line element is added via CSS/pseudo-element logic manually or animate properties
                tl.to(el, {
                    clipPath: 'inset(0 0 0% 0)',
                    duration: 1.2,
                    ease: 'power3.inOut',
                });
            }
            else if (variant === 'glitch') {
                // Glitch Effect: RGB Split + Skew + Snap in
                // Start hidden and shifted
                gsap.set(el, { opacity: 0, scale: 0.9 });

                // Keyframe-like timeline for glitch
                tl.to(el, { opacity: 1, scale: 1, duration: 0.1, ease: 'rough' })
                    .to(el, { skewX: 20, duration: 0.05, ease: 'power4.inOut' })
                    .to(el, { skewX: -20, duration: 0.05, ease: 'power4.inOut' })
                    .to(el, { skewX: 0, duration: 0.05, ease: 'power4.inOut' })
                    // Chromatic aberration simulation using text-shadow or filter (complex to do purely js, simplified here)
                    .to(el, { x: 5, duration: 0.05, ease: 'steps(1)' })
                    .to(el, { x: -5, duration: 0.05, ease: 'steps(1)' })
                    .to(el, { x: 0, duration: 0.05 });
            }

        }, containerRef);

        return () => ctx.revert();
    }, [variant, text, children, delay]);

    if (variant === 'decrypt') {
        return (
            <div ref={containerRef} className={`font-mono ${className}`}>
                {decodedText}
            </div>
        );
    }

    if (variant === 'scan') {
        return (
            <div ref={containerRef} className={`relative overflow-hidden ${className}`}>
                {children}
                {/* Scan Line Overlay */}
                <div
                    className="absolute bottom-0 left-0 right-0 h-[2px] bg-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.8)] z-10 scan-line"
                    style={{
                        transform: 'translateY(100%)', // Default state will be handled by parent clip-path logically or we animate this separately if needed. 
                        // Actually, for the "reveal", the clip path on parent reveals content. 
                        // To make a line move DOWN, we might need a separate tween.
                    }}
                />
            </div>
        );
    }

    // Glitch
    return (
        <div ref={containerRef} className={`${className}`}>
            {children}
        </div>
    );
}
