import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { Zap, Router, Database } from 'lucide-react';
import { TECH_STACK, HIGHLIGHT_CARDS } from '../data/homeData';
import SystemCheckOverlay from './SystemCheckOverlay';
import { SentinelToast } from './SentinelToast';

gsap.registerPlugin(ScrollTrigger);

/**
 * MobilePortfolio — Mobile-optimized Home page content.
 *
 * Renders all Home sections in a single-column mobile-native layout that
 * scrolls cleanly over the fixed MobileBackground. Preserves the CSS class
 * names (.methodology-section, .tilt-card, .service-card, etc.) so the
 * scroll-reactive background color phases continue to trigger correctly.
 */
export default function MobilePortfolio() {
    const [isOverlayOpen, setIsOverlayOpen] = useState(false);
    const [showSentinel, setShowSentinel] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const marqueeRef = useRef<HTMLDivElement>(null);

    useGSAP(() => {
        // ─── Sentinel Toast trigger ───
        ScrollTrigger.create({
            trigger: containerRef.current,
            start: 'top 60%',
            onEnter: () => {
                const hasSeen = sessionStorage.getItem('has_seen_project_spotlight');
                if (!hasSeen) {
                    setShowSentinel(true);
                    sessionStorage.setItem('has_seen_project_spotlight', 'true');
                }
            },
            once: true,
        });

        // ─── Methodology text reveal ───
        const methodTexts = gsap.utils.toArray('.methodology-text');
        gsap.set(methodTexts, { opacity: 0, y: 16 });
        ScrollTrigger.create({
            trigger: '.methodology-section',
            start: 'top 85%',
            onEnter: () => {
                gsap.to(methodTexts, {
                    opacity: 1, y: 0, duration: 1,
                    stagger: 0.2, ease: 'expo.out',
                });
            },
            once: true,
        });

        // ─── Tilt cards entrance ───
        const tiltCards = gsap.utils.toArray('.tilt-card');
        gsap.set(tiltCards, { opacity: 0, x: 40 });
        ScrollTrigger.create({
            trigger: '.tilt-cards-container',
            start: 'top 85%',
            onEnter: () => {
                gsap.to(tiltCards, {
                    opacity: 1, x: 0, duration: 1,
                    stagger: 0.2, ease: 'expo.out',
                });
            },
            once: true,
        });

        // ─── Tech stack marquee ───
        if (marqueeRef.current) {
            gsap.to(marqueeRef.current, {
                xPercent: -50, ease: 'none',
                duration: 18, repeat: -1,
            });
        }

        // ─── Service cards entrance ───
        const cardEls = gsap.utils.toArray('.service-card');
        gsap.set(cardEls, { opacity: 0, y: 30 });
        ScrollTrigger.create({
            trigger: '.service-cards-container',
            start: 'top 85%',
            onEnter: () => {
                gsap.to(cardEls, {
                    y: 0, opacity: 1, duration: 1.2,
                    stagger: 0.2, ease: 'expo.out',
                });
            },
            once: true,
        });

        // ─── CTA pulse ───
        const ctaBtn = document.querySelector('.mobile-cta-btn');
        if (ctaBtn) {
            gsap.to(ctaBtn, {
                scale: 1.04,
                boxShadow: '0 0 18px rgba(6,182,212,0.5)',
                duration: 1.5, repeat: -1, yoyo: true,
                ease: 'sine.inOut',
            });
        }
    }, { scope: containerRef });

    return (
        <div ref={containerRef} className="relative z-10 w-full overflow-x-hidden">

            {/* Toast */}
            {showSentinel && <SentinelToast />}

            {/* ══════════════ SECTION: HERO ══════════════ */}
            <section
                id="hero"
                className="relative w-full flex items-center justify-center overflow-hidden bg-transparent"
                style={{ minHeight: '100dvh', paddingTop: '80px' }}
            >
                <div className="text-center px-5 max-w-md mx-auto flex flex-col items-center gap-4">
                    <p className="text-green-400 text-xs tracking-[0.2em] uppercase font-bold font-mono">
                        Network & Cybersecurity Analyst
                    </p>

                    <h1
                        className="text-4xl font-bold font-hud tracking-tight text-transparent bg-clip-text bg-gradient-to-b from-white to-slate-400 leading-[1.15]"
                        style={{ textShadow: '0 0 10px rgba(56,189,248,0.4)' }}
                    >
                        Fermin Espinoza
                    </h1>

                    <p className="text-slate-400 text-sm leading-relaxed font-light max-w-xs">
                        Systems Engineering student specializing in secure networking, automation, and L1-L3 technical support.
                    </p>

                    <div className="mt-4">
                        <Link
                            to="/contact"
                            className="inline-flex items-center justify-center bg-transparent border border-cyan-500 text-cyan-500 px-6 py-2.5 text-sm font-medium transition-all duration-200 hover:bg-cyan-500 hover:text-black rounded-sm font-hud tracking-wider"
                        >
                            CONTACT
                        </Link>
                    </div>
                </div>
            </section>

            {/* ══════════════ SECTION: METHODOLOGY ══════════════ */}
            <section className="relative w-full py-16 bg-[#050505]/80 overflow-hidden">
                <div className="px-5 max-w-md mx-auto">

                    {/* Text column */}
                    <div className="methodology-section flex flex-col gap-4 mb-10">
                        <h2 className="methodology-text text-3xl font-bold text-white leading-tight tracking-tight">
                            Connect. Automate.{' '}
                            <span className="text-white">Scale.</span>
                        </h2>

                        <p className="methodology-text text-base text-gray-300 font-light leading-relaxed border-l-2 border-white/20 pl-4">
                            Building the bridges between physical infrastructure and digital workflows.
                        </p>

                        <p className="methodology-text text-sm text-gray-400 leading-relaxed">
                            I specialize in Network Reliability and Security analysis. I design backend automation
                            systems using low code tools like n8n to create autonomous workflows, integrating
                            webhooks, APIs, databases, and conditional logic.
                        </p>
                    </div>

                    {/* Tilt cards (stacked vertically) */}
                    <div className="tilt-cards-container flex flex-col gap-3">
                        {/* Infrastructure */}
                        <div className="tilt-card relative w-full p-4 rounded-xl backdrop-blur-md bg-white/5 border border-white/10 flex items-center gap-4">
                            <div className="p-2.5 rounded-lg bg-black/40 border border-white/5 text-blue-400">
                                <Router size={22} strokeWidth={1.5} />
                            </div>
                            <div className="flex-1 min-w-0">
                                <h3 className="text-sm font-medium text-white tracking-wide">Infrastructure & Troubleshooting</h3>
                                <p className="text-xs text-gray-400 mt-0.5 font-light">L1-L3 Support, VLANs, & Packet Analysis.</p>
                            </div>
                        </div>

                        {/* n8n */}
                        <div className="tilt-card relative w-full p-4 rounded-xl backdrop-blur-md bg-white/5 border border-white/10 flex items-center gap-4">
                            <div className="p-2.5 rounded-lg bg-black/40 border border-white/5 text-orange-400">
                                <Zap size={22} strokeWidth={1.5} />
                            </div>
                            <div className="flex-1 min-w-0">
                                <h3 className="text-sm font-medium text-white tracking-wide">n8n Automation Engine</h3>
                                <p className="text-xs text-gray-400 mt-0.5 font-light">Complex Logic, Webhooks, & Error Handling.</p>
                            </div>
                            {/* Pulse border */}
                            <div className="absolute inset-0 rounded-xl border border-orange-500/20 animate-pulse opacity-50 pointer-events-none" />
                        </div>

                        {/* API */}
                        <div className="tilt-card relative w-full p-4 rounded-xl backdrop-blur-md bg-white/5 border border-white/10 flex items-center gap-4">
                            <div className="p-2.5 rounded-lg bg-black/40 border border-white/5 text-green-400">
                                <Database size={22} strokeWidth={1.5} />
                            </div>
                            <div className="flex-1 min-w-0">
                                <h3 className="text-sm font-medium text-white tracking-wide">API & Data Bridging</h3>
                                <p className="text-xs text-gray-400 mt-0.5 font-light">Rest APIs, JSON Transformation, & NoSQL.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ══════════════ SECTION: TECH STACK MARQUEE ══════════════ */}
            <section className="w-full py-6 bg-transparent border-t border-b border-white/5 mb-12">
                <div className="overflow-hidden">
                    <div ref={marqueeRef} className="flex gap-8 whitespace-nowrap px-4 items-center">
                        {/* 3 copies for seamless loop */}
                        {[...TECH_STACK, ...TECH_STACK, ...TECH_STACK].map((tech, index) => (
                            <div
                                key={`m-tech-${index}`}
                                className="flex items-center gap-2 opacity-60"
                            >
                                <tech.icon className="text-2xl text-gray-500" />
                                <span className="text-xs font-mono font-semibold tracking-wider text-slate-400">
                                    {tech.name}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ══════════════ SECTION: SERVICE PILLARS ══════════════ */}
            <section className="px-5 max-w-md mx-auto mb-16">
                <div className="service-cards-container flex flex-col gap-4">
                    {HIGHLIGHT_CARDS.map((card, index) => (
                        <div
                            key={index}
                            className={`service-card p-5 rounded-xl bg-[#0a0a0a]/80 backdrop-blur-md border ${card.border} relative overflow-hidden`}
                        >
                            {/* Icon */}
                            <div className={`w-10 h-10 mb-3 rounded-lg bg-black/50 flex items-center justify-center border border-white/10 ${card.color}`}>
                                <card.icon size={20} strokeWidth={1.5} />
                            </div>

                            <h3 className="text-lg font-bold text-white mb-1.5 font-mono tracking-tight">
                                {card.title}
                            </h3>
                            <p className="text-slate-400 leading-relaxed text-xs border-l-2 border-white/10 pl-3">
                                {card.desc}
                            </p>

                            {/* Decorative index */}
                            <div className={`absolute top-3 right-3 text-[10px] font-mono opacity-20 ${card.color}`}>
                                0{index + 1}
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* ══════════════ SECTION: CTA ══════════════ */}
            <section className="text-center px-5 pb-16">
                <div className="relative inline-block">
                    {/* Glow behind */}
                    <div className="absolute inset-0 bg-cyan-500/15 blur-3xl rounded-full scale-110 pointer-events-none" />

                    <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-500 mb-6 tracking-tight">
                        Ready to see the live data?
                    </h2>

                    <button
                        onClick={() => setIsOverlayOpen(true)}
                        className="mobile-cta-btn group relative px-6 py-3 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 font-mono text-sm tracking-widest uppercase border border-cyan-500/50 hover:border-cyan-400 rounded transition-all duration-300 flex items-center gap-2 mx-auto"
                    >
                        <span className="relative z-10">Run System Check</span>
                        <Zap className="w-4 h-4 group-hover:text-yellow-300 transition-colors animate-pulse" />

                        {/* Tech corner brackets */}
                        <div className="absolute top-0 left-0 w-1.5 h-1.5 border-t border-l border-cyan-500 -translate-x-0.5 -translate-y-0.5" />
                        <div className="absolute bottom-0 right-0 w-1.5 h-1.5 border-b border-r border-cyan-500 translate-x-0.5 translate-y-0.5" />
                    </button>

                    <SystemCheckOverlay
                        isOpen={isOverlayOpen}
                        onClose={() => setIsOverlayOpen(false)}
                    />
                </div>
            </section>

        </div>
    );
}
