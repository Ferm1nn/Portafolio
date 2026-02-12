import { useState, useEffect, useRef, useCallback } from 'react';
import gsap from 'gsap';
import { Wifi, Cpu, Activity, Laptop, Database, Globe, Shield, ChevronLeft, Terminal, X, CheckCircle } from 'lucide-react';

interface SystemCheckOverlayProps {
    isOpen: boolean;
    onClose: () => void;
}

interface SystemData {
    status: string;
    latency?: number;
    cpu?: number;
    ram?: number;
}

export default function SystemCheckOverlay({ isOpen, onClose }: SystemCheckOverlayProps) {
    const [timeLeft, setTimeLeft] = useState(10);
    const [data, setData] = useState<SystemData | null>(null);
    const [status, setStatus] = useState("ESTABLISHING UPLINK...");
    const [viewMode, setViewMode] = useState<'INTRO' | 'TERMINAL' | 'SUMMARY'>('INTRO');

    const backdropRef = useRef<HTMLDivElement>(null);
    const windowRef = useRef<HTMLDivElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);
    const latencyBarRef = useRef<HTMLDivElement>(null);
    const ramBarRef = useRef<HTMLDivElement>(null);
    const cpuBarRef = useRef<HTMLDivElement>(null);
    const prevViewRef = useRef(viewMode);

    // --- Animated Close ---
    const handleAnimatedClose = useCallback(() => {
        const tl = gsap.timeline({
            onComplete: () => {
                onClose();
            }
        });

        if (windowRef.current) {
            tl.to(windowRef.current, { scale: 0.9, opacity: 0, y: 10, duration: 0.25, ease: "power2.in" }, 0);
        }
        if (backdropRef.current) {
            tl.to(backdropRef.current, { opacity: 0, duration: 0.25 }, 0);
        }
    }, [onClose]);

    // --- Animated View Change ---
    const animateViewChange = useCallback((newMode: 'INTRO' | 'TERMINAL' | 'SUMMARY') => {
        if (!contentRef.current) {
            setViewMode(newMode);
            return;
        }
        gsap.to(contentRef.current, {
            opacity: 0,
            x: -20,
            duration: 0.15,
            onComplete: () => setViewMode(newMode),
        });
    }, []);

    const handleClose = () => {
        if (viewMode === 'TERMINAL') {
            animateViewChange('SUMMARY');
        } else {
            handleAnimatedClose();
        }
    };

    // --- Entrance animation ---
    useEffect(() => {
        if (!isOpen) return;

        if (backdropRef.current) {
            gsap.fromTo(backdropRef.current, { opacity: 0 }, { opacity: 1, duration: 0.3 });
        }
        if (windowRef.current) {
            gsap.fromTo(windowRef.current,
                { scale: 0.9, opacity: 0, y: 20 },
                { scale: 1, opacity: 1, y: 0, duration: 0.5, ease: "back.out(1.7)" }
            );
        }
        if (contentRef.current) {
            gsap.fromTo(contentRef.current,
                { opacity: 0, x: -20 },
                { opacity: 1, x: 0, duration: 0.3, delay: 0.2 }
            );
        }
    }, [isOpen]);

    // --- View mode transition (animate in new content) ---
    useEffect(() => {
        if (!isOpen || !contentRef.current) return;
        if (prevViewRef.current === viewMode) return;

        prevViewRef.current = viewMode;
        gsap.fromTo(contentRef.current,
            { opacity: 0, x: 20 },
            { opacity: 1, x: 0, duration: 0.3 }
        );
    }, [viewMode, isOpen]);

    // --- Progress bar animations ---
    useEffect(() => {
        if (viewMode !== 'TERMINAL' || !data) return;

        if (latencyBarRef.current) {
            gsap.to(latencyBarRef.current, { width: '100%', duration: 0.6, ease: 'circ.out' });
        }
        if (ramBarRef.current) {
            gsap.to(ramBarRef.current, { width: `${data.ram}%`, duration: 0.6, ease: 'circ.out' });
        }
        if (cpuBarRef.current) {
            const segments = cpuBarRef.current.children;
            gsap.to(segments, { opacity: 1, stagger: 0.01, duration: 0.2 });
        }
    }, [data, viewMode]);

    // --- Timer Logic ---
    useEffect(() => {
        if (!isOpen) {
            setTimeLeft(10);
            setData(null);
            setStatus("ESTABLISHING UPLINK...");
            setViewMode('INTRO');
            prevViewRef.current = 'INTRO';
            return;
        }

        if (viewMode !== 'TERMINAL') return;

        const timer = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    clearInterval(timer);
                    // Schedule the view change outside the state updater
                    setTimeout(() => animateViewChange('SUMMARY'), 0);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [isOpen, viewMode, animateViewChange]);

    // --- Data Polling Logic ---
    useEffect(() => {
        if (!isOpen) return;

        fetchData();
        const interval = setInterval(fetchData, 2000);

        return () => clearInterval(interval);
    }, [isOpen]);

    const fetchData = async () => {
        try {
            setStatus("STREAMING DATA...");
            const response = await fetch('/api/system-status');
            if (!response.ok) throw new Error('Network response was not ok');

            const jsonData = await response.json();
            setData(jsonData);
            setStatus("DATA_PACKET_RECEIVED [OK]");
        } catch {
            setStatus("CONNECTION_INTERRUPTED. MOCKING DATA...");
            setTimeout(() => {
                setData({
                    status: "ONLINE",
                    latency: Math.floor(Math.random() * 20) + 10,
                    cpu: Math.floor(Math.random() * 30) + 10,
                    ram: Math.floor(Math.random() * 40) + 20
                });
            }, 500);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">

            {/* 1. Backdrop */}
            <div
                ref={backdropRef}
                onClick={handleClose}
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />

            {/* 2. The Window Container */}
            <div
                ref={windowRef}
                className="relative w-full max-w-3xl h-auto bg-black/90 border border-green-500/30 rounded-xl shadow-[0_0_50px_rgba(34,197,94,0.15)] overflow-hidden font-mono flex flex-col"
                onClick={(e) => e.stopPropagation()}
            >

                {/* Header Bar */}
                <div className="flex items-center justify-between px-4 py-3 bg-zinc-900/80 border-b border-green-500/20 shrink-0">
                    <div className="flex gap-2">
                        <div className="w-3 h-3 rounded-full bg-red-500/80 hover:bg-red-500 transition-colors cursor-pointer" onClick={handleClose}></div>
                        <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
                        <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
                    </div>
                    <div className="text-xs text-zinc-500 select-none tracking-widest uppercase">
                        {viewMode === 'INTRO' ? 'SYSTEM_ARCHITECTURE_CHECK' :
                            viewMode === 'SUMMARY' ? 'DIAGNOSTIC_REPORT_GENERATED' :
                                'ROOT@PORTFOLIO-AGENT:~'}
                    </div>

                    {/* Back Button (Only in Terminal) */}
                    <div className="w-20 flex justify-end">
                        {viewMode === 'TERMINAL' && (
                            <button
                                onClick={() => animateViewChange('INTRO')}
                                className="text-xs flex items-center gap-1 text-zinc-500 hover:text-green-400 transition-colors"
                            >
                                <ChevronLeft size={12} /> BACK
                            </button>
                        )}
                    </div>
                </div>

                {/* Content Area */}
                <div ref={contentRef} className="relative p-8 min-h-[400px]">
                    {viewMode === 'INTRO' ? (
                        <div
                            className="h-full flex flex-col items-center justify-center text-center"
                        >
                            <h2 className="text-2xl font-bold text-white mb-8 tracking-tight">System Architecture Check</h2>

                            {/* 3-Step Flow - Horizontal now */}
                            <div className="flex items-start justify-center gap-8 mb-10 w-full max-w-2xl">
                                {/* Step 1 */}
                                <div className="flex flex-col items-center gap-3 w-1/3">
                                    <div className="p-4 bg-green-500/10 rounded-full border border-green-500/20">
                                        <Laptop size={32} className="text-green-400" />
                                    </div>
                                    <h3 className="font-bold text-green-300 text-sm">Local Agent</h3>
                                    <p className="text-xs text-zinc-500">My local Python script gathers my server's stats.</p>
                                </div>

                                {/* Arrow */}
                                <div className="mt-6 text-green-500/30">→</div>

                                {/* Step 2 */}
                                <div className="flex flex-col items-center gap-3 w-1/3">
                                    <div className="p-4 bg-green-500/10 rounded-full border border-green-500/20">
                                        <Database size={32} className="text-green-400" />
                                    </div>
                                    <h3 className="font-bold text-green-300 text-sm">MongoDB Atlas</h3>
                                    <p className="text-xs text-zinc-500">Data is pushed securely to the cloud.</p>
                                </div>

                                {/* Arrow */}
                                <div className="mt-6 text-green-500/30">→</div>

                                {/* Step 3 */}
                                <div className="flex flex-col items-center gap-3 w-1/3">
                                    <div className="p-4 bg-green-500/10 rounded-full border border-green-500/20">
                                        <Globe size={32} className="text-green-400" />
                                    </div>
                                    <h3 className="font-bold text-green-300 text-sm">Live Dashboard</h3>
                                    <p className="text-xs text-zinc-500">Next.js receives & displays the live telemetry.</p>
                                </div>
                            </div>

                            {/* Privacy Notice */}
                            <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-3 flex items-center gap-3 mb-8 max-w-lg">
                                <Shield size={18} className="text-green-500 shrink-0" />
                                <p className="text-xs text-zinc-400 text-left">
                                    <strong className="text-zinc-300">PRIVACY NOTICE:</strong> This connection retrieves telemetry from <span className="text-white">Fermin's local server</span>. No data is collected from your device.
                                </p>
                            </div>

                            {/* Action Button */}
                            <button
                                onClick={() => animateViewChange('TERMINAL')}
                                className="group relative px-6 py-3 bg-green-500 hover:bg-green-400 text-black font-bold rounded flex items-center gap-2 transition-all shadow-[0_0_20px_rgba(34,197,94,0.3)] hover:shadow-[0_0_30px_rgba(34,197,94,0.5)]"
                            >
                                <Terminal size={18} />
                                INITIALIZE UPLINK
                                <div className="absolute inset-0 rounded ring-2 ring-white/30 animate-pulse"></div>
                            </button>

                        </div>
                    ) : viewMode === 'TERMINAL' ? (
                        <div
                            className="h-full flex flex-col justify-between"
                        >
                            {/* Top Info */}
                            <div className="flex justify-between items-end mb-6 border-b border-green-500/20 pb-4">
                                <div>
                                    <div className="text-xs text-green-500/50 mb-1">SYSTEM_INTEGRITY</div>
                                    <div className="text-xl font-bold tracking-widest text-green-300">VERIFIED</div>
                                </div>
                                <div className="text-right">
                                    <div className="text-xs text-green-500/50 mb-1">AUTO_CLOSE</div>
                                    <div className="text-4xl font-bold font-mono text-red-400 animate-pulse">00:0{timeLeft}</div>
                                </div>
                            </div>

                            {/* Grid Stats */}
                            <div className="grid grid-cols-2 gap-6 mb-6">

                                {/* Latency */}
                                <div className="bg-green-500/5 p-5 rounded-lg border border-green-500/20">
                                    <div className="flex items-center gap-2 mb-3 text-green-300">
                                        <Wifi size={20} />
                                        <span className="text-sm font-bold tracking-wider">LATENCY</span>
                                    </div>
                                    <div className="text-4xl font-bold text-white mb-2">
                                        {data ? `${data.latency}ms` : '---'}
                                    </div>
                                    <div className="h-1.5 w-full bg-green-900/30 rounded-full overflow-hidden">
                                        <div
                                            ref={latencyBarRef}
                                            className="h-full bg-green-400"
                                            style={{ width: 0 }}
                                        />
                                    </div>
                                </div>

                                {/* RAM */}
                                <div className="bg-green-500/5 p-5 rounded-lg border border-green-500/20">
                                    <div className="flex items-center gap-2 mb-3 text-green-300">
                                        <Activity size={20} />
                                        <span className="text-sm font-bold tracking-wider">RAM_USAGE</span>
                                    </div>
                                    <div className="text-4xl font-bold text-white mb-2">
                                        {data?.ram ? `${data.ram}%` : '---'}
                                    </div>
                                    <div className="h-1.5 w-full bg-green-900/30 rounded-full overflow-hidden">
                                        <div
                                            ref={ramBarRef}
                                            className="h-full bg-green-400"
                                            style={{ width: 0 }}
                                        />
                                    </div>
                                </div>

                                {/* CPU (Full Width) */}
                                <div className="col-span-2 bg-green-500/5 p-5 rounded-lg border border-green-500/20">
                                    <div className="flex items-center justify-between mb-3 text-green-300">
                                        <div className="flex items-center gap-2">
                                            <Cpu size={20} />
                                            <span className="text-sm font-bold tracking-wider">CPU_LOAD</span>
                                        </div>
                                        <span className="font-mono text-xl">{data?.cpu ? `${data.cpu}%` : '---'}</span>
                                    </div>

                                    {/* Visual Progress Bar - Thicker */}
                                    <div ref={cpuBarRef} className="h-3 w-full bg-green-900/50 rounded overflow-hidden flex gap-1">
                                        {Array.from({ length: 30 }).map((_, i) => (
                                            <div
                                                key={i}
                                                className={`h-full flex-1 ${data?.cpu && (i / 30) * 100 < data.cpu
                                                    ? 'bg-green-400 shadow-[0_0_8px_currentColor]'
                                                    : 'bg-green-900/20'
                                                    }`}
                                                style={{ opacity: 0 }}
                                            />
                                        ))}
                                    </div>
                                </div>

                            </div>

                            {/* Footer Console */}
                            <div className="bg-black p-3 rounded text-xs font-mono text-green-500/80 border-t border-green-500/20 h-16 overflow-hidden flex items-center">
                                <span className="text-green-500 mr-2">{'>'}</span>
                                <span className="animate-pulse">{status}_</span>
                            </div>

                        </div>
                    ) : (
                        <div
                            className="h-full flex flex-col justify-start text-left"
                        >
                            <div className="border-b border-green-500/30 pb-4 mb-6">
                                <h2 className="text-xl font-mono font-bold text-green-400 flex items-center gap-2">
                                    <CheckCircle size={24} />
                                    DIAGNOSTIC_REPORT_GENERATED
                                </h2>
                            </div>

                            <div className="space-y-6 font-mono text-sm leading-relaxed text-zinc-300">
                                {/* Section 1 */}
                                <div>
                                    <h3 className="text-white font-bold mb-2 flex items-center gap-2">
                                        <span className="text-green-500">01.</span> REAL-TIME OBSERVABILITY
                                    </h3>
                                    <p className="pl-6 border-l border-zinc-700 ml-1">
                                        This interface mimics enterprise NOC (Network Operations Center) dashboards.
                                        It didn't just use static data; the frontend proactively polled the API
                                        every 2 seconds to render live telemetry.
                                    </p>
                                </div>

                                {/* Section 2 */}
                                <div>
                                    <h3 className="text-white font-bold mb-2 flex items-center gap-2">
                                        <span className="text-green-500">02.</span> THE HYBRID PIPELINE
                                    </h3>
                                    <p className="pl-6 border-l border-zinc-700 ml-1">
                                        You witnessed a full-stack handshake: My local Python Agent used raw sockets
                                        to verify network latency, pushed the logs to MongoDB Atlas, and the Next.js
                                        Edge API securely bridged that data to your browser.
                                    </p>
                                </div>

                                <div className="pt-2 text-green-500 animate-pulse">
                                    _ END OF LOG <span className="inline-block w-2 h-4 bg-green-500 ml-1 align-middle"></span>
                                </div>
                            </div>

                            {/* Close Button */}
                            <div className="mt-auto pt-6 flex justify-center">
                                <button
                                    onClick={handleAnimatedClose}
                                    className="px-6 py-2 bg-zinc-800 hover:bg-zinc-700 text-white font-mono rounded border border-zinc-600 hover:border-zinc-500 transition-all flex items-center gap-2"
                                >
                                    <X size={16} />
                                    CLOSE TERMINAL
                                </button>
                            </div>

                        </div>
                    )}
                </div>

            </div>
        </div>
    );
}
