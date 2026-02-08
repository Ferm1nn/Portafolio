import { useState, useRef } from 'react';
import { Shield, Play, Activity, Unlock, Cpu, Wifi, Info, ShieldCheck, ShieldAlert } from 'lucide-react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import SentinelContextCard from './SentinelContextCard';

interface AnalysisResult {
    threat_detected: boolean;
    attack_type: string;
    confidence_score: number;
    evidence: string;
    action_taken: string;
    analysis_summary: string;
}

interface SentinelResponse {
    raw_logs: string[];
    analysis: AnalysisResult;
}

const AutomationShowcase = () => {
    // Refs for DOM manipulation (No re-renders)
    const containerRef = useRef<HTMLDivElement>(null);
    const leftPanelRef = useRef<HTMLDivElement>(null);
    const rightPanelRef = useRef<HTMLDivElement>(null);
    const controlsRef = useRef<HTMLDivElement>(null);
    const logsContainerRef = useRef<HTMLDivElement>(null);
    const confidenceRef = useRef<HTMLSpanElement>(null);
    const rightPanelContentRef = useRef<HTMLDivElement>(null);

    // State for Data Handling & UI Toggles only
    const [scenario, setScenario] = useState('Brute Force');
    const [loading, setLoading] = useState(false);
    const [showInfo, setShowInfo] = useState(false);
    const [data, setData] = useState<SentinelResponse | null>(null);
    const [error, setError] = useState<string | null>(null);

    // Status State (for the header badge)
    const [status, setStatus] = useState<'IDLE' | 'ATTACK' | 'SECURE'>('IDLE');

    useGSAP(() => {
        const tl = gsap.timeline({ defaults: { ease: 'power4.out' } });

        // Initial Interactive Entrance
        tl.set(containerRef.current, { visibility: 'visible' });

        // Locking Mechanism Reveal
        tl.fromTo(leftPanelRef.current,
            { x: -50, opacity: 0 },
            { x: 0, opacity: 1, duration: 1 }
        );
        tl.fromTo(rightPanelRef.current,
            { x: 50, opacity: 0 },
            { x: 0, opacity: 1, duration: 1 },
            "<"
        );
        tl.fromTo(controlsRef.current,
            { y: -20, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.5 },
            "-=0.5"
        );

    }, { scope: containerRef });

    // The Cinematic Animation Sequence
    useGSAP(() => {
        if (!data || loading) return;

        const mm = gsap.matchMedia();
        const logs = logsContainerRef.current?.children;
        const timeline = gsap.timeline();

        // Check for reduced motion preference
        mm.add("(prefers-reduced-motion: no-preference)", () => {
            // Phase 1: Attack (Red Team)
            setStatus('ATTACK');

            if (logs && logs.length > 0) {
                timeline.to(logs, {
                    autoAlpha: 1,
                    x: 0,
                    stagger: 0.1, // 100ms per line
                    duration: 0.3,
                    ease: "power2.out",
                    onUpdate: () => {
                        // Auto-scroll to bottom during animation 
                        if (logsContainerRef.current) {
                            logsContainerRef.current.scrollTop = logsContainerRef.current.scrollHeight;
                        }
                    }
                });
            }

            // Phase 2: Defense (Blue Team)
            timeline.call(() => setStatus('SECURE')); // Switch status badge

            timeline.to(rightPanelContentRef.current, {
                autoAlpha: 1,
                duration: 0.8
            }, "+=0.2"); // Small pause before analysis reveal

            // Phase 3: Verdict (Confidence Score)
            if (confidenceRef.current) {
                timeline.fromTo(confidenceRef.current,
                    { innerText: 0 },
                    {
                        innerText: data.analysis.confidence_score,
                        duration: 1.5,
                        snap: { innerText: 1 }, // Snap to whole numbers
                        ease: "power1.inOut"
                    },
                    "<"
                );
            }
        });

        // Fallback for reduced motion
        mm.add("(prefers-reduced-motion: reduce)", () => {
            setStatus('SECURE');
            gsap.set(logs!, { autoAlpha: 1, x: 0 });
            gsap.set(rightPanelContentRef.current, { autoAlpha: 1 });
            if (confidenceRef.current) confidenceRef.current.innerText = data.analysis.confidence_score.toString();
        });

    }, { scope: containerRef, dependencies: [data, loading] });


    const initiateSimulation = async () => {
        setLoading(true);
        setError(null);
        setData(null);
        setStatus('IDLE');

        // Reset animations manually before new fetching
        if (logsContainerRef.current) gsap.set(logsContainerRef.current.children, { autoAlpha: 0, x: -10 });
        gsap.set(rightPanelContentRef.current, { autoAlpha: 0 });

        try {
            const response = await fetch('/api/automation', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    endpoint: 'sentinel-attack-sim',
                    payload: { scenario }
                }),
            });

            const rawData = await response.json();

            if (rawData.error) {
                throw new Error(rawData.error);
            }

            // CRITICAL: Parse the array response
            const responseData = Array.isArray(rawData) ? rawData[0] : rawData;

            if (!responseData?.raw_logs) {
                throw new Error("Invalid Data Structure");
            }

            setData(responseData);

        } catch (err: any) {
            setError(err.message || "Unknown Error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full max-w-7xl mx-auto my-12 invisible" ref={containerRef}>

            {showInfo && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
                    <div className="absolute inset-0" onClick={() => setShowInfo(false)}></div>
                    <div className="relative z-10 w-full max-w-3xl animate-in fade-in zoom-in-95 duration-200">
                        <SentinelContextCard onClose={() => setShowInfo(false)} />
                    </div>
                </div>
            )}

            {/* Controls Bar */}
            <div ref={controlsRef} className="flex flex-col md:flex-row items-center justify-between mb-2 bg-slate-950/90 p-4 border-b border-rose-500/20 backdrop-blur-md sticky top-0 z-10 rounded-t-lg">
                <div className="flex items-center space-x-4 mb-4 md:mb-0">
                    <div className="relative">
                        <div className="absolute -inset-1 rounded-full bg-rose-500/20 animate-ping"></div>
                        <div className="relative p-2 bg-slate-900 rounded-full border border-rose-500/50">
                            <Cpu className="w-6 h-6 text-rose-500" />
                        </div>
                    </div>
                    <div>
                        <h2 className="text-2xl font-mono font-bold text-white tracking-widest uppercase">Sentinel <span className="text-rose-500">Core</span></h2>
                        <div className="flex items-center space-x-2 font-mono text-xs font-bold tracking-wider">
                            {status === 'ATTACK' && (
                                <span className="text-rose-500 animate-pulse flex items-center gap-2">
                                    <span className="w-2 h-2 rounded-full bg-rose-500"></span>
                                    SYSTEM ALERT: INTRUSION DETECTED
                                </span>
                            )}
                            {status === 'SECURE' && (
                                <span className="text-emerald-500 flex items-center gap-2">
                                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                                    ANALYSIS COMPLETE: THREAT NEUTRALIZED
                                </span>
                            )}
                            {status === 'IDLE' && (
                                <span className="text-emerald-500/50 flex items-center gap-2">
                                    <span className="w-2 h-2 rounded-full bg-emerald-500/50"></span>
                                    SYSTEM ONLINE // AWAITING THREAT VECTOR
                                </span>
                            )}
                        </div>
                    </div>
                </div>

                <div className="flex items-center space-x-4 bg-slate-900 p-2 rounded border border-slate-800">
                    <button
                        onClick={() => setShowInfo(!showInfo)}
                        className={`flex items-center space-x-2 px-3 py-2 rounded border transition-all ${showInfo ? 'bg-cyan-500/20 border-cyan-500 text-cyan-400' : 'bg-slate-950 border-slate-700 text-slate-400 hover:text-cyan-400 hover:border-cyan-500/50'}`}
                    >
                        <Info className="w-4 h-4" />
                        <span className="font-mono text-sm font-bold">INFO</span>
                    </button>
                    <select
                        value={scenario}
                        onChange={(e) => setScenario(e.target.value)}
                        disabled={loading || status === 'ATTACK'}
                        className="bg-slate-950 border border-slate-700 text-slate-300 text-sm rounded px-3 py-2 font-mono focus:ring-1 focus:ring-rose-500 focus:border-rose-500 outline-none transition-all uppercase"
                    >
                        <option>Brute Force</option>
                        <option>SQL Injection</option>
                        <option>DDoS Simulation</option>
                    </select>

                    <button
                        onClick={initiateSimulation}
                        disabled={loading || status === 'ATTACK'}
                        className={`group relative flex items-center space-x-2 bg-rose-600 hover:bg-rose-500 text-white px-6 py-2 rounded font-mono text-sm font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden ${!loading && 'hover:shadow-[0_0_20px_rgba(225,29,72,0.6)]'}`}
                    >
                        <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                        {loading ? (
                            <>
                                <Activity className="w-4 h-4 animate-spin" />
                                <span>INITIALIZING...</span>
                            </>
                        ) : (
                            <>
                                <Play className="w-4 h-4 fill-current" />
                                <span className="group-hover:animate-pulse">INITIATE SIMULATION</span>
                            </>
                        )}
                    </button>
                </div>
            </div>

            {/* Operations Console */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-1 h-[600px] bg-slate-950 border border-slate-800 relative overflow-hidden">

                {/* Scanline Overlay */}
                <div className="absolute inset-0 pointer-events-none z-20 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_4px,3px_100%] opacity-20"></div>

                {/* Left Panel: Red Team */}
                <div ref={leftPanelRef} className="relative flex flex-col border-r border-rose-900/30 bg-red-950/10">
                    <div className="flex items-center justify-between p-3 bg-red-950/30 border-b border-rose-900/30">
                        <div className="flex items-center space-x-2 text-rose-500">
                            <Unlock className="w-4 h-4" />
                            <h3 className="font-mono text-xs font-bold tracking-[0.2em] glitch-text">INCOMING_THREAT_STREAM</h3>
                        </div>
                        <Wifi className="w-4 h-4 text-rose-800 animate-pulse" />
                    </div>

                    <div className="flex-grow p-6 font-mono text-xs md:text-sm text-rose-500/90 leading-relaxed overflow-y-auto custom-scrollbar font-bold shadow-[inset_0_0_20px_rgba(0,0,0,0.5)]" ref={logsContainerRef}>
                        {error ? (
                            <div className="flex items-center space-x-2 text-rose-500 animate-pulse">
                                <ShieldAlert className="w-5 h-5" />
                                <span>CONNECTION_LOST // RETRYING ({error})</span>
                            </div>
                        ) : !data && !loading ? (
                            <span className="text-rose-900/50">Waiting for target acquisition...</span>
                        ) : (
                            // Render ALL logs immediately, let GSAP handle visibility
                            data?.raw_logs.map((log, i) => (
                                <div key={i} className="break-all border-l-2 border-rose-900 pl-2 opacity-0 transform -translate-x-2 mb-1">
                                    <span className="text-rose-700 mr-2">{'>'}</span>
                                    {log}
                                </div>
                            ))
                        )}
                        {loading && (
                            <div className="flex flex-col space-y-2">
                                <span className="animate-pulse">[!] ESTABLISHING C2 CONNECTION...</span>
                                <span className="animate-pulse delay-75">[!] BYPASSING FIREWALL RULES...</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Panel: Blue Team */}
                <div ref={rightPanelRef} className="relative flex flex-col bg-cyan-950/10">
                    <div className="flex items-center justify-between p-3 bg-cyan-950/30 border-b border-cyan-900/30">
                        <div className="flex items-center space-x-2 text-cyan-500">
                            <Shield className="w-4 h-4" />
                            <h3 className="font-mono text-xs font-bold tracking-[0.2em]">SENTINEL_DEFENSE_LOG</h3>
                        </div>
                        <Activity className="w-4 h-4 text-cyan-800 animate-pulse" />
                    </div>

                    <div className="flex-grow p-6 font-mono text-xs md:text-sm text-cyan-400/90 leading-relaxed overflow-y-auto custom-scrollbar shadow-[inset_0_0_20px_rgba(0,0,0,0.5)] flex flex-col justify-center">
                        {/* Content Wrapper for GSAP Reveal */}
                        <div ref={rightPanelContentRef} className="opacity-0 space-y-6">
                            {data && (
                                <>
                                    <div className="border border-cyan-500/30 bg-cyan-950/50 p-4 rounded">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-cyan-600 text-xs uppercase tracking-widest">Confidence Score</span>
                                            <span className="text-2xl font-bold text-cyan-400">
                                                <span ref={confidenceRef}>0</span>%
                                            </span>
                                        </div>
                                        {/* Progress Bar (Visual only, animates via CSS width or separate GSAP) */}
                                        <div className="w-full bg-cyan-900/30 h-1.5 rounded-full overflow-hidden">
                                            <div className="h-full bg-cyan-500 w-full animate-[progress_1.5s_ease-out]"></div>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <div>
                                            <h4 className="text-cyan-700 text-xs mb-1 uppercase tracking-wider">Attack Vector Detected</h4>
                                            <div className="flex items-center space-x-2 text-red-400">
                                                <ShieldAlert className="w-4 h-4" />
                                                <span className="font-bold border-b border-red-500/30">{data.analysis.attack_type.toUpperCase()}</span>
                                            </div>
                                        </div>

                                        <div>
                                            <h4 className="text-cyan-700 text-xs mb-1 uppercase tracking-wider">Analysis Summary</h4>
                                            <p className="text-cyan-300 leading-relaxed bg-cyan-950/30 p-2 rounded border-l-2 border-cyan-500">
                                                {data.analysis.analysis_summary}
                                            </p>
                                        </div>

                                        <div>
                                            <h4 className="text-cyan-700 text-xs mb-1 uppercase tracking-wider">Automated Response</h4>
                                            <div className="flex items-start space-x-2 text-emerald-400">
                                                <ShieldCheck className="w-4 h-4 mt-0.5" />
                                                <span className="font-bold">{data.analysis.action_taken}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mt-auto border-t border-cyan-900/30 pt-4 flex justify-between text-xs text-cyan-800">
                                        <span>TICKET_ID: #SEC-{Math.floor(Math.random() * 9000) + 1000}</span>
                                        <span>AUTO_RESOLVED</span>
                                    </div>
                                </>
                            )}
                        </div>

                        {!data && !loading && !error && (
                            <div className="flex flex-col items-center justify-center h-full text-cyan-900/40 space-y-4 absolute inset-0">
                                <Shield className="w-16 h-16 opacity-20" />
                                <span>SYSTEM SECURE</span>
                            </div>
                        )}

                        {loading && (
                            <div className="flex flex-col space-y-2 opacity-50 absolute inset-0 items-center justify-center">
                                <div className="text-cyan-600 flex items-center space-x-2">
                                    <span className="animate-spin">⏵</span>
                                    <span>NEURAL LINK ACTIVE</span>
                                </div>
                                <span className="text-cyan-700 animate-pulse">Monitoring stream...</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AutomationShowcase;
