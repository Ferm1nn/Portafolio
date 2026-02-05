import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';

const AmbientCyberLayer: React.FC = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const tracesRef = useRef<SVGSVGElement>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            const paths = tracesRef.current?.querySelectorAll('path');

            if (paths) {
                // Animate each trace with a slow, heavy data flow feel
                paths.forEach((path, i) => {
                    // Stagger properties for "organic" machine feel
                    const duration = 40 + i * 10;
                    const direction = i % 2 === 0 ? 1 : -1;
                    const distance = 50; // Pixels to drift

                    // Slow sliding movement along the axis
                    gsap.to(path, {
                        y: `+=${distance * direction}`,
                        duration: duration,
                        repeat: -1,
                        yoyo: true,
                        ease: 'sine.inOut',
                    });

                    // Subtle opacity pulse to make it feel "live"
                    gsap.to(path, {
                        opacity: 0.05, // Pulse up from base 0.03
                        duration: duration * 0.5,
                        repeat: -1,
                        yoyo: true,
                        ease: 'sine.inOut',
                        delay: i * 2,
                    });
                });
            }
        }, containerRef);

        return () => ctx.revert();
    }, []);

    return (
        <div
            ref={containerRef}
            className="fixed inset-0 pointer-events-none overflow-hidden bg-transparent"
            style={{ zIndex: -2 }}
            aria-hidden="true"
        >
            <svg
                ref={tracesRef}
                className="absolute inset-0 w-full h-full"
                viewBox="0 0 100 100"
                preserveAspectRatio="none"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
            >
                {/* 
                   Trace 1: Left Vertical Mainline
                   Top-left to bottom-left area with a 90-degree jog.
                */}
                <path
                    d="M15 0 V40 H25 V100"
                    stroke="#06b6d4"
                    strokeWidth="3"
                    strokeOpacity="0.03"
                    vectorEffect="non-scaling-stroke"
                />

                {/* 
                   Trace 2: Right Structure Feed
                   Bottom-right to top-right with a 90-degree jog.
                */}
                <path
                    d="M85 100 V60 H75 V0"
                    stroke="#06b6d4"
                    strokeWidth="3"
                    strokeOpacity="0.03"
                    vectorEffect="non-scaling-stroke"
                />

                {/* 
                   Trace 3: Horizontal Cross-Link
                   Spans the width with a vertical step in the middle.
                */}
                <path
                    d="M0 75 H40 V25 H100"
                    stroke="#06b6d4"
                    strokeWidth="4" // Slightly thicker ("Power rail")
                    strokeOpacity="0.03"
                    vectorEffect="non-scaling-stroke"
                />

                {/* 
                   Trace 4: Central Vertical Spine
                   straight shot down the middle-ish.
                */}
                <path
                    d="M55 0 V100"
                    stroke="#06b6d4"
                    strokeWidth="2"
                    strokeOpacity="0.03"
                    vectorEffect="non-scaling-stroke"
                />
            </svg>
        </div>
    );
};

export default AmbientCyberLayer;
