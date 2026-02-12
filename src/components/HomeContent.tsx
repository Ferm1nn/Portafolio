
import { useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { Zap, Router, Database, type LucideIcon } from 'lucide-react';
import { TECH_STACK, HIGHLIGHT_CARDS } from '../data/homeData';
import SystemCheckOverlay from './SystemCheckOverlay';

gsap.registerPlugin(ScrollTrigger);

// --- Methodology Types & Components ---

interface MethodologyCardProps {
    icon: LucideIcon;
    title: string;
    subtitle: string;
    glowColor: string;
    pulse?: boolean;
}

const TiltCard: React.FC<MethodologyCardProps> = ({ icon: Icon, title, subtitle, glowColor, pulse }) => {
    const ref = useRef<HTMLDivElement>(null);
    const [isHovered, setIsHovered] = useState(false);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!ref.current) return;
        const rect = ref.current.getBoundingClientRect();
        const xPct = (e.clientX - rect.left) / rect.width - 0.5;
        const yPct = (e.clientY - rect.top) / rect.height - 0.5;

        gsap.to(ref.current, {
            rotateX: yPct * -20,
            rotateY: xPct * 20,
            duration: 0.4,
            ease: "power2.out",
            overwrite: 'auto',
        });
    };

    const handleMouseLeave = () => {
        if (!ref.current) return;
        gsap.to(ref.current, {
            rotateX: 0,
            rotateY: 0,
            duration: 0.6,
            ease: "elastic.out(1, 0.5)",
        });
        setIsHovered(false);
    };

    const handleMouseEnter = () => {
        setIsHovered(true);
    };

    const getGlowClass = () => {
        switch (glowColor) {
            case 'blue': return 'shadow-[0_0_30px_-5px_rgba(59,130,246,0.5)] border-blue-500/30';
            case 'purple': return 'shadow-[0_0_30px_-5px_rgba(168,85,247,0.5)] border-purple-500/30';
            case 'green': return 'shadow-[0_0_30px_-5px_rgba(34,197,94,0.5)] border-green-500/30';
            case 'orange': return 'shadow-[0_0_30px_-5px_rgba(249,115,22,0.5)] border-orange-500/30';
            default: return 'shadow-none border-white/10';
        }
    };

    const getIconColor = () => {
        switch (glowColor) {
            case 'blue': return 'text-blue-400';
            case 'purple': return 'text-purple-400';
            case 'green': return 'text-green-400';
            case 'orange': return 'text-orange-400';
            default: return 'text-white';
        }
    };

    return (
        <div
            ref={ref}
            style={{ transformStyle: "preserve-3d" }}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            onMouseEnter={handleMouseEnter}
            className={`
                tilt-card relative w-full p-6 mb-6 rounded-xl
                backdrop-blur-md bg-white/5 border 
                transition-all duration-300
                flex items-center gap-6 group cursor-default
                ${isHovered ? getGlowClass() : 'border-white/10'}
            `}
        >
            {/* Icon Container */}
            <div className={`p-3 rounded-lg bg-black/40 border border-white/5 ${getIconColor()} group-hover:scale-110 transition-transform duration-300`}>
                <Icon size={28} strokeWidth={1.5} />
            </div>

            {/* Text Container */}
            <div className="flex-1">
                <h3 className="text-lg font-medium text-white tracking-wide group-hover:text-white/90 transition-colors">
                    {title}
                </h3>
                <p className="text-sm text-gray-400 mt-1 font-light tracking-wide group-hover:text-gray-300 transition-colors">
                    {subtitle}
                </p>
            </div>

            {/* Pulse Effect for n8n */}
            {pulse && (
                <div className="absolute inset-0 rounded-xl border border-orange-500/20 animate-pulse opacity-50 pointer-events-none" />
            )}

            {/* Subtle sheen effect */}
            <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
        </div>
    );
};


export default function HomeContent() {
    const [isOverlayOpen, setIsOverlayOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const marqueeRef = useRef<HTMLDivElement>(null);
    const cardsRef = useRef<HTMLDivElement>(null);
    const ctaButtonRef = useRef<HTMLButtonElement>(null);

    useGSAP(() => {

        // --- Section 0: Methodology Text Reveal ---
        const methodologyTexts = gsap.utils.toArray('.methodology-text');
        gsap.set(methodologyTexts, { opacity: 0, y: 20 });

        ScrollTrigger.create({
            trigger: '.methodology-section',
            start: "top 80%",
            onEnter: () => {
                gsap.to(methodologyTexts, {
                    opacity: 1,
                    y: 0,
                    duration: 0.8,
                    stagger: 0.2,
                    ease: "power2.out",
                });
            },
            once: true,
        });

        // --- Tilt Cards Entrance ---
        const tiltCards = gsap.utils.toArray('.tilt-card');
        gsap.set(tiltCards, { opacity: 0, x: 50 });

        ScrollTrigger.create({
            trigger: '.tilt-cards-container',
            start: "top 80%",
            onEnter: () => {
                gsap.to(tiltCards, {
                    opacity: 1,
                    x: 0,
                    duration: 0.6,
                    stagger: 0.2,
                    ease: "power2.out",
                });
            },
            once: true,
        });

        // --- Section 1: Infinite Marquee ---
        const marqueeContent = marqueeRef.current;
        if (marqueeContent) {
            const duration = 20;
            gsap.to(marqueeContent, {
                xPercent: -50,
                ease: "none",
                duration: duration,
                repeat: -1,
            });
        }

        // --- Section 2: Service Pillars (Cards) ---
        const cardElements = gsap.utils.toArray('.service-card');

        gsap.set(cardElements, {
            opacity: 0,
            y: 50,
        });

        if (cardElements[0]) gsap.set(cardElements[0], { x: -100 });
        if (cardElements[1]) gsap.set(cardElements[1], { x: 0 });
        if (cardElements[2]) gsap.set(cardElements[2], { x: 100 });

        ScrollTrigger.create({
            trigger: cardsRef.current,
            start: "top 80%",
            onEnter: () => {
                gsap.to(cardElements, {
                    x: 0,
                    y: 0,
                    opacity: 1,
                    duration: 1,
                    stagger: 0.2,
                    ease: "power3.out",
                });
            },
            once: true
        });

        // --- Section 3: Pulsing CTA ---
        if (ctaButtonRef.current) {
            gsap.to(ctaButtonRef.current, {
                scale: 1.05,
                boxShadow: "0 0 20px rgba(6, 182, 212, 0.6)",
                duration: 1.5,
                repeat: -1,
                yoyo: true,
                ease: "sine.inOut"
            });
        }

    }, { scope: containerRef });

    return (
        <div ref={containerRef} className="relative z-10 w-full overflow-hidden pb-20">

            {/* SECTION 0: The Mindset (Methodology) */}
            <section className="relative w-full py-24 lg:py-32 bg-[#050505] overflow-hidden">
                {/* Background Ambience */}
                <div className="absolute top-0 right-0 w-1/3 h-full bg-blue-900/5 blur-[120px] pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-1/3 h-full bg-purple-900/5 blur-[120px] pointer-events-none" />

                <div className="max-w-7xl mx-auto px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">

                        {/* Column 1: The Doctrine */}
                        <div className="methodology-section flex flex-col gap-6">
                            {/* Label */}
                            <div className="methodology-text">
                                <span className="font-mono text-cyan-400 text-sm tracking-widest uppercase shadow-[0_0_10px_rgba(34,211,238,0.3)]">
                                    // Operational_Strategy
                                </span>
                            </div>

                            {/* Headline */}
                            <h2
                                className="methodology-text text-5xl lg:text-7xl font-bold text-white leading-[1.1] tracking-tight"
                            >
                                Connect. Automate. <br />
                                <span className="text-white">Scale.</span>
                            </h2>

                            {/* Sub-headline */}
                            <p
                                className="methodology-text text-xl text-gray-300 font-light max-w-lg leading-relaxed border-l-2 border-white/20 pl-6 my-4"
                            >
                                Building the bridges between physical infrastructure and digital workflows.
                            </p>

                            {/* Body */}
                            <p
                                className="methodology-text text-gray-400 text-base leading-relaxed max-w-lg"
                            >
                                I specialize in Network Reliability. Once the infrastructure is stable (L1-L3).
                                <br />
                                <br />
                                I design backend automation systems using n8n as an orchestration layer, integrating webhooks, APIs, databases, and conditional logic to eliminate manual processes and create self-operating pipelines.
                            </p>

                        </div>

                        {/* Column 2: The 3 Pillars (Visual Hook) */}
                        <div className="relative [perspective:1000px]">
                            {/* Decorative line connecting cards */}
                            <div className="absolute left-8 top-10 bottom-10 w-px bg-gradient-to-b from-transparent via-white/10 to-transparent z-0" />

                            <div className="tilt-cards-container relative z-10 flex flex-col gap-4">
                                <TiltCard
                                    icon={Router}
                                    title="Infrastructure & Troubleshooting"
                                    subtitle="L1-L3 Support, VLANs, & Packet Analysis."
                                    glowColor="blue"
                                />
                                <TiltCard
                                    icon={Zap}
                                    title="n8n Automation Engine"
                                    subtitle="Complex Logic, Webhooks, & Error Handling."
                                    glowColor="orange"
                                    pulse={true}
                                />
                                <TiltCard
                                    icon={Database}
                                    title="API & Data Bridging"
                                    subtitle="Rest APIs, JSON Transformation, & NoSQL."
                                    glowColor="green"
                                />
                            </div>
                        </div>

                    </div>
                </div>
            </section>

            {/* SECTION 1: The Infinite Tech Stack (The Bridge) */}
            <section className="w-full py-10 bg-transparent border-t border-b border-white/5 backdrop-blur-sm mb-20">
                <div className="max-w-[100%] overflow-hidden flex relative mask-linear-fade">
                    {/* Wrapper for the seamless loop */}
                    <div ref={marqueeRef} className="flex gap-16 whitespace-nowrap px-10 items-center">
                        {/* Original Set */}
                        {TECH_STACK.map((tech, index) => (
                            <div key={`tech-${index}`} className="flex items-center gap-4 group opacity-60 hover:opacity-100 transition-opacity duration-300">
                                <tech.icon className={`text-4xl text-gray-500 transition-colors duration-300 ${tech.color}`} />
                                <span className="text-lg font-mono font-semibold tracking-wider text-slate-300 group-hover:text-white transition-colors duration-300">{tech.name}</span>
                            </div>
                        ))}
                        {/* Duplicated Set for Loop */}
                        {TECH_STACK.map((tech, index) => (
                            <div key={`tech-dup-${index}`} className="flex items-center gap-4 group opacity-60 hover:opacity-100 transition-opacity duration-300">
                                <tech.icon className={`text-4xl text-gray-500 transition-colors duration-300 ${tech.color}`} />
                                <span className="text-lg font-mono font-semibold tracking-wider text-slate-300 group-hover:text-white transition-colors duration-300">{tech.name}</span>
                            </div>
                        ))}
                        {/* Triplicated Set for Safety on wide screens */}
                        {TECH_STACK.map((tech, index) => (
                            <div key={`tech-trip-${index}`} className="flex items-center gap-4 group opacity-60 hover:opacity-100 transition-opacity duration-300">
                                <tech.icon className={`text-4xl text-gray-500 transition-colors duration-300 ${tech.color}`} />
                                <span className="text-lg font-mono font-semibold tracking-wider text-slate-300 group-hover:text-white transition-colors duration-300">{tech.name}</span>
                            </div>
                        ))}
                        {/* Quadruplicated Set for Safety on ultra-wide screens */}
                        {TECH_STACK.map((tech, index) => (
                            <div key={`tech-quad-${index}`} className="flex items-center gap-4 group opacity-60 hover:opacity-100 transition-opacity duration-300">
                                <tech.icon className={`text-4xl text-gray-500 transition-colors duration-300 ${tech.color}`} />
                                <span className="text-lg font-mono font-semibold tracking-wider text-slate-300 group-hover:text-white transition-colors duration-300">{tech.name}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* SECTION 2: The Service Pillars (The Cards) */}
            <section ref={cardsRef} className="max-w-7xl mx-auto px-6 mb-32">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {HIGHLIGHT_CARDS.map((card, index) => (
                        <div
                            key={index}
                            className={`service-card p-8 rounded-2xl bg-[#0a0a0a]/80 backdrop-blur-md border ${card.border} hover:bg-[#111] transition-colors duration-500 group relative overflow-hidden`}
                        >
                            {/* Hover Glow Gradient */}
                            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                            <div className={`w-14 h-14 mb-6 rounded-xl bg-black/50 flex items-center justify-center border border-white/10 group-hover:border-white/20 transition-colors ${card.color}`}>
                                <card.icon size={28} strokeWidth={1.5} />
                            </div>

                            <h3 className="text-2xl font-bold text-white mb-3 font-mono tracking-tight">{card.title}</h3>
                            <p className="text-slate-400 leading-relaxed text-sm border-l-2 border-white/10 pl-4">
                                {card.desc}
                            </p>

                            {/* Decorative Corner */}
                            <div className={`absolute top-4 right-4 text-xs font-mono opacity-20 ${card.color}`}>0{index + 1}</div>
                            <div className="absolute bottom-4 right-4 w-2 h-2 rounded-full bg-white/10 group-hover:bg-white/30 transition-colors"></div>
                        </div>
                    ))}
                </div>
            </section>

            {/* SECTION 3: The "Execute" CTA */}
            <section className="text-center pb-20">
                <div className="inline-block relative">
                    {/* Pulse Effect Behind */}
                    <div className="absolute inset-0 bg-cyan-500/20 blur-3xl rounded-full scale-110 pointer-events-none"></div>

                    <h2 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-500 mb-10 tracking-tight">
                        Ready to see the live data?
                    </h2>

                    <button
                        ref={ctaButtonRef}
                        onClick={() => setIsOverlayOpen(true)}
                        className="group relative px-8 py-4 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 font-mono text-lg tracking-widest uppercase border border-cyan-500/50 hover:border-cyan-400 rounded transition-all duration-300 flex items-center gap-3 mx-auto"
                    >
                        <span className="relative z-10">Run System Check</span>
                        <Zap className="w-5 h-5 group-hover:text-yellow-300 transition-colors animate-pulse" />

                        {/* Glitch/Tech Decors */}
                        <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-cyan-500 -translate-x-1 -translate-y-1"></div>
                        <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-cyan-500 translate-x-1 translate-y-1"></div>
                    </button>
                    {/* System Check Overlay */}
                    <SystemCheckOverlay
                        isOpen={isOverlayOpen}
                        onClose={() => setIsOverlayOpen(false)}
                    />
                </div>
            </section>

        </div>
    );
}
