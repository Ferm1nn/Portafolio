import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';

const DISPLAY_DURATION = 10; // seconds visible before auto-dismiss

export function SentinelToast() {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const el = containerRef.current;
        if (!el) return;

        // Initial hidden state: Slide in from bottom, slightly scaled down
        gsap.set(el, { y: 40, opacity: 0, scale: 0.98 });

        const tl = gsap.timeline({ delay: 0.2 });

        // ── 1. ENTRANCE (Clean, Smooth Slide) ────────────────
        tl.to(el, {
            y: 0,
            opacity: 1,
            scale: 1,
            duration: 0.8,
            ease: 'power3.out',
        });

        // ── 2. EXIT (after 10s) ──────────────────────────────
        tl.to(el, {
            y: 20,
            opacity: 0,
            scale: 0.98,
            duration: 0.6,
            ease: 'power2.in',
        }, `+=${DISPLAY_DURATION}`);

        return () => { tl.kill(); };
    }, []);

    return (
        <div
            ref={containerRef}
            className="fixed bottom-8 right-8 z-[9999] max-w-sm w-full pointer-events-auto"
            style={{ opacity: 0 }}
        >
            <Link
                to="/projects"
                state={{ launchSentinel: true }}
                className="block relative group"
                aria-label="Watch Cybersecurity Automation Demo"
            >
                <div className="relative bg-[#0A0A0A] border border-[#333] hover:border-[#555] rounded-lg p-5 shadow-2xl transition-colors duration-300">

                    {/* Header Row */}
                    <div className="flex items-center justify-between mb-2">
                        <h3 className="text-white font-semibold text-sm tracking-tight">
                            Cybersecurity Automation Demo!
                        </h3>
                        {/* Subtle 'New' Badge or similar accent if desired, mostly clean */}
                        <span className="flex h-2 w-2 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]"></span>
                    </div>

                    {/* Body Text */}
                    <p className="text-[#A1A1AA] text-sm leading-relaxed mb-4">
                        Click here to watch a live demo of my autonomous security system.
                    </p>

                    {/* Call to Action (Text Link style) */}
                    <div className="flex items-center text-white text-xs font-medium group-hover:text-blue-400 transition-colors">
                        <span>Watch Demo</span>
                        <svg
                            className="w-3 h-3 ml-1 transform group-hover:translate-x-0.5 transition-transform"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                    </div>

                </div>
            </Link>
        </div>
    );
}
