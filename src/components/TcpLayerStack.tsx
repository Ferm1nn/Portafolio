import { useRef, useState, useCallback, useEffect } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import '../styles/TcpLayerStack.css';

/* ─── Data ──────────────────────────────────────────────────── */

interface Module {
    name: string;
    detail: string;
}

interface Layer {
    id: string;
    title: string;
    description: string;
    modules: Module[];
}

const layers: Layer[] = [
    {
        id: 'L5',
        title: 'APPLICATION',
        description:
            'Architecting the user interface and orchestrating intelligent, data-driven workflows. I leverage agentic AI and robust frontend frameworks to build scalable, self-sustaining systems.',
        modules: [
            { name: 'Modern Web Stack', detail: 'Vite + React (TS), Component-driven architecture, Strict typing.' },
            { name: 'AI-Agentic Workflow', detail: 'Using MCPs (Model Context Protocol) to integrate data contexts & enhance dev velocity.' },
            { name: 'RAG Implementation', detail: 'Designing Retrieval-Augmented Generation systems for grounded AI outputs.' },
            { name: 'Automation Specialist', detail: 'n8n logic-gated workflows for cross-platform orchestration.' },
            { name: 'API Interactions', detail: 'RESTful methods (GET/POST/PUT), Payload structure & Header manipulation.' },
        ],
    },
    {
        id: 'L4',
        title: 'TRANSPORT',
        description:
            'Defining the rules of data delivery. I ensure information is transmitted reliably and efficiently across the network stack.',
        modules: [
            { name: 'Protocol Selection', detail: 'TCP (Guaranteed Delivery) vs UDP (Low Latency/Streaming).' },
            { name: 'Session Multiplexing', detail: 'Socket & Port management for simultaneous service communication.' },
            { name: 'Flow Control', detail: 'Windowing mechanisms to optimize throughput without congestion.' },
            { name: 'Transport Security', detail: 'TLS/SSL handshake concepts for data-in-transit encryption.' },
        ],
    },
    {
        id: 'L3',
        title: 'NETWORK',
        description:
            'The backbone of connectivity. I engineer logical addressing schemes and secure tunnels to enable reachability between disparate networks.',
        modules: [
            { name: 'VPN Tunneling', detail: 'WireGuard infrastructure from scratch (Keys, Peers, wg0 interfaces).' },
            { name: 'Routing Logic', detail: 'Static Routes & Next-hop reachability verification.' },
            { name: 'IPv4 & Subnetting', detail: 'VLSM design for efficient address allocation.' },
            { name: 'Packet Analysis', detail: 'ICMP diagnostics (Ping/Traceroute) for path integrity.' },
        ],
    },
    {
        id: 'L2',
        title: 'DATA LINK',
        description:
            'Managing local traffic flow. I control frame delivery and segmentation to ensure a stable, collision-free local network.',
        modules: [
            { name: 'VLAN Segmentation', detail: '802.1Q tagging for traffic isolation.' },
            { name: 'Switching Operations', detail: 'MAC Address Table analysis & Frame Forwarding.' },
            { name: 'Loop Prevention', detail: 'STP (Spanning Tree) configuration for redundant topologies.' },
        ],
    },
    {
        id: 'L1',
        title: 'PHYSICAL',
        description:
            'The foundation of the stack. I handle the physical medium, ensuring signal integrity and hardware reliability.',
        modules: [
            { name: 'Cisco Hardware', detail: 'Physical racking, Console access, Device initialization.' },
            { name: 'Structured Cabling', detail: 'Cat5e/6 Termination (T568B) & Validation.' },
            { name: 'L1 Diagnostics', detail: 'Identifying CRC errors, runts, and signal attenuation.' },
        ],
    },
];

/* ─── Text Scramble Hook ────────────────────────────────────── */

const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*<>{}[]=/\\|';

function useTextScramble(text: string, trigger: boolean, durationMs = 600): string {
    const [display, setDisplay] = useState(text);
    const frameRef = useRef<number>(0);

    useEffect(() => {
        if (!trigger) {
            setDisplay(text);
            return;
        }

        const totalFrames = Math.max(12, Math.round(durationMs / 30));
        let frame = 0;

        const step = () => {
            frame++;
            const progress = frame / totalFrames;
            const revealedCount = Math.floor(progress * text.length);

            let result = '';
            for (let i = 0; i < text.length; i++) {
                if (text[i] === ' ') {
                    result += ' ';
                } else if (i < revealedCount) {
                    result += text[i];
                } else {
                    result += CHARS[Math.floor(Math.random() * CHARS.length)];
                }
            }
            setDisplay(result);

            if (frame < totalFrames) {
                frameRef.current = requestAnimationFrame(step);
            } else {
                setDisplay(text);
            }
        };

        frameRef.current = requestAnimationFrame(step);
        return () => cancelAnimationFrame(frameRef.current);
    }, [text, trigger, durationMs]);

    return display;
}

/* ─── Module Row (hooks at top level) ──────────────────────── */

interface ScrambledModuleRowProps {
    mod: Module;
    active: boolean;
}

function ScrambledModuleRow({ mod, active }: ScrambledModuleRowProps) {
    const nameText = useTextScramble(mod.name, active, 500);
    const detailText = useTextScramble(mod.detail, active, 800);

    return (
        <div className="tcp-module-row">
            <span className="tcp-module-name">{nameText}</span>
            <span className="tcp-module-detail">{detailText}</span>
        </div>
    );
}

/* ─── Individual Layer Panel ────────────────────────────────── */

interface LayerPanelProps {
    layer: Layer;
    isActive: boolean;
    onToggle: () => void;
}

function LayerPanel({ layer, isActive, onToggle }: LayerPanelProps) {
    const contentRef = useRef<HTMLDivElement>(null);
    const scannerRef = useRef<HTMLDivElement>(null);
    const chevronRef = useRef<SVGSVGElement>(null);

    // Scramble hook for description
    const descScrambled = useTextScramble(layer.description, isActive, 700);

    // GSAP expand / collapse
    useGSAP(() => {
        const content = contentRef.current;
        const scanner = scannerRef.current;
        const chevron = chevronRef.current;
        if (!content || !scanner || !chevron) return;

        if (isActive) {
            // Expand
            gsap.set(content, { height: 'auto', overflow: 'hidden' });
            const h = content.scrollHeight;
            gsap.fromTo(content, { height: 0 }, { height: h, duration: 0.5, ease: 'power3.inOut' });

            // Scanner sweep
            gsap.fromTo(
                scanner,
                { y: 0, opacity: 1 },
                { y: h, opacity: 0.3, duration: 1.2, ease: 'power1.inOut', delay: 0.15 },
            );

            // Chevron rotate
            gsap.to(chevron, { rotation: 180, duration: 0.35, ease: 'power2.out' });
        } else {
            // Collapse
            gsap.to(content, { height: 0, duration: 0.4, ease: 'power3.inOut' });
            gsap.set(scanner, { opacity: 0 });
            gsap.to(chevron, { rotation: 0, duration: 0.35, ease: 'power2.out' });
        }
    }, [isActive]);

    return (
        <div className="tcp-layer-wrapper">
            {/* Collapsed bar */}
            <button
                type="button"
                className={`tcp-layer-bar${isActive ? ' active' : ''}`}
                onClick={onToggle}
                aria-expanded={isActive}
            >
                <span className="tcp-layer-id">{layer.id}</span>
                <div className="tcp-layer-titles">
                    <span className="tcp-layer-title">{layer.title}</span>
                </div>
                <svg
                    ref={chevronRef}
                    className="tcp-layer-chevron"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                >
                    <polyline points="6 9 12 15 18 9" />
                </svg>
            </button>

            {/* Expandable content */}
            <div ref={contentRef} className="tcp-layer-content">
                {/* Scanner laser */}
                <div ref={scannerRef} className="tcp-scanner-line" />

                <div className="tcp-layer-content-inner">
                    <p className="tcp-layer-description">{descScrambled}</p>

                    <div className="tcp-modules-label">// MODULES</div>
                    <div className="tcp-modules-list">
                        {layer.modules.map((mod) => (
                            <ScrambledModuleRow key={mod.name} mod={mod} active={isActive} />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

/* ─── Main Stack Component ──────────────────────────────────── */

export function TcpLayerStack() {
    const [activeId, setActiveId] = useState<string | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    const handleToggle = useCallback((id: string) => {
        setActiveId((prev) => (prev === id ? null : id));
    }, []);

    // Stagger-in entrance animation
    useGSAP(
        () => {
            gsap.fromTo(
                '.tcp-layer-wrapper',
                { opacity: 0, x: -30 },
                {
                    opacity: 1,
                    x: 0,
                    duration: 0.5,
                    stagger: 0.08,
                    ease: 'power3.out',
                },
            );
        },
        { scope: containerRef },
    );

    return (
        <div ref={containerRef}>
            <div className="tcp-stack">
                {layers.map((layer) => (
                    <LayerPanel
                        key={layer.id}
                        layer={layer}
                        isActive={activeId === layer.id}
                        onToggle={() => handleToggle(layer.id)}
                    />
                ))}

                {/* Status bar */}
                <div className="tcp-stack-status">
                    <span className="tcp-status-dot" />
                    <span>
                        {activeId
                            ? `INSPECTING LAYER ${activeId} — ${layers.find((l) => l.id === activeId)?.title}`
                            : 'ALL LAYERS NOMINAL — SELECT TO INSPECT'}
                    </span>
                </div>
            </div>
        </div>
    );
}
