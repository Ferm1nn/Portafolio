import { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useMotionSettings } from '../motion/MotionProvider';

// Register the ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

interface ParallaxBulletListProps {
    items: string[];
    className?: string;
}

export function ParallaxBulletList({ items, className = '' }: ParallaxBulletListProps) {
    const containerRef = useRef<HTMLUListElement>(null);
    // Access reduced motion preference from our provider (which wraps window.matchMedia)
    const { prefersReducedMotion } = useMotionSettings();

    useLayoutEffect(() => {
        // Accessibility: Strictly skip custom animations if the user prefers reduced motion.
        // This ensures we respect system settings and avoid inducing motion sickness.
        if (prefersReducedMotion || !containerRef.current) return;

        // Select all bullet items within this specific list container
        const listItems = containerRef.current.querySelectorAll('.bullet-item');
        if (!listItems.length) return;

        // Performance: GSAP Context is used for proper cleanup (reverting changes)
        // when the component unmounts, preventing memory leaks and ghost animations.
        const ctx = gsap.context(() => {

            // Performance: We use a single Timeline for the entire list sequence.
            // This is more efficient than creating individual ScrollTriggers for each item,
            // as it reduces the overhead of scroll event listeners and intersection calculations.
            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: 'top 85%', // Trigger when top of list hits 85% of viewport height
                    end: 'bottom 15%', // End when bottom of list hits 15% of viewport height

                    // Behavior request: "play reverse play reverse"
                    // 1. Enter viewport: play (animate in)
                    // 2. Leave viewport (scrolling past): reverse (animate out/up)
                    // 3. Enter back (scrolling up): play (animate in)
                    // 4. Leave back (scrolling up past top): reverse (animate out/up)
                    toggleActions: 'play reverse play reverse',
                }
            });

            // Performance: 'will-change: transform, opacity'
            // We explicitly hint the browser to promote these elements to their own compositing layers.
            // This allows the GPU to handle the opacity and transform changes (compositing)
            // without triggering expensive main-thread layout or paint operations (reflows).
            gsap.set(listItems, {
                y: -50,       // Start 50px ABOVE natural position
                opacity: 0,   // Start invisible
                willChange: 'transform, opacity'
            });

            tl.to(listItems, {
                y: 0,        // Slide down to natural position (translate3d implicitly used by GSAP)
                opacity: 1,  // Fade in
                duration: 0.5,
                stagger: 0.1, // Slight delay between items for the "waterfall" effect
                ease: 'power2.out',
                // Note on cleanup: We let GSAP handle the style reset via ctx.revert() on unmount.
                // The 'will-change' property persists here to ensure smooth reversal.
            });

        }, containerRef);

        // Cleanup function: Reverts all GSAP modifications (inline styles) when component unmounts
        return () => ctx.revert();
    }, [prefersReducedMotion]); // Re-run if motion preference changes

    return (
        <ul
            ref={containerRef}
            className={`parallax-bullet-list ${className}`}
            // Ensure basic list styling if no external CSS is provided
            style={{ listStyle: 'none', padding: 0, margin: 0 }}
        >
            {items.map((item, index) => (
                <li
                    key={index}
                    className="bullet-item"
                    style={{
                        // Basic layout styling - can be moved to CSS class
                        marginBottom: '1rem',
                        // Default visibility ensured for reduced motion users (since GSAP .set() won't run)
                    }}
                >
                    {item}
                </li>
            ))}
        </ul>
    );
}
