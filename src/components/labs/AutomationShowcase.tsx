import React, { useState, useRef, useEffect } from 'react';
import { Terminal, Shield, Play, Activity, Lock, Unlock, Cpu, Wifi, Info } from 'lucide-react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { useTypewriter } from '../../hooks/useTypewriter';
import SentinelContextCard from './SentinelContextCard';

interface SimulationResult {
    redTeamLogs: string;
    blueTeamLogs: string;
}

const AutomationShowcase = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const leftPanelRef = useRef<HTMLDivElement>(null);
    const rightPanelRef = useRef<HTMLDivElement>(null);
    const controlsRef = useRef<HTMLDivElement>(null);

    const [scenario, setScenario] = useState('Brute Force');
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<SimulationResult | null>(null);
    const [showInfo, setShowInfo] = useState(false);

    // Faster Typewriter (10ms)
    const redTeamTypewriter = useTypewriter(result?.redTeamLogs || '', 10);
    const blueTeamTypewriter = useTypewriter(result?.blueTeamLogs || '', 10);

    useGSAP(() => {
        const tl = gsap.timeline({ defaults: { ease: 'power4.out' } });

        // Initial Entrance
        tl.set(containerRef.current, { visibility: 'visible' });

        // Slide in panels from sides (Locking mechanism effect)
        tl.fromTo(leftPanelRef.current,
            { x: -100, opacity: 0 },
            { x: 0, opacity: 1, duration: 1 }
        );

        tl.fromTo(rightPanelRef.current,
            { x: 100, opacity: 0 },
            { x: 0, opacity: 1, duration: 1 },
            "<" // Start at same time
        );

        // Fade in controls last
        tl.fromTo(controlsRef.current,
            { y: -20, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.5 }
        );

    }, { scope: containerRef });

    const initiateSimulation = async () => {
        setLoading(true);
        setResult(null);

        try {
            const response = await fetch('/api/automation', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    endpoint: 'sentinel-attack-sim',
                    payload: { scenario }
                }),
            });

            const data = await response.json();

            if (data.error) {
                setResult({
                    redTeamLogs: `[ERROR] Connection Failed: ${data.error}`,
                    blueTeamLogs: `[SYSTEM] Neural Engine Offline. Check configuration.`
                });
            } else {
                setResult(data);
            }
        } catch (error) {
            setResult({
                redTeamLogs: `[ERROR] Critical Network Failure.`,
                blueTeamLogs: `[SYSTEM] Local Defense Protocol Initiated.`
            });
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

            {/* Top Bar: Controls */}
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
                        <div className="flex items-center space-x-2">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                            </span>
                            <p className="text-xs text-emerald-500 font-mono tracking-wider">SYSTEM ONLINE // AWAITING THREAT VECTOR</p>
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
                        disabled={loading}
                        className="bg-slate-950 border border-slate-700 text-slate-300 text-sm rounded px-3 py-2 font-mono focus:ring-1 focus:ring-rose-500 focus:border-rose-500 outline-none transition-all uppercase"
                    >
                        <option>Brute Force</option>
                        <option>SQL Injection</option>
                        <option>DDoS Simulation</option>
                    </select>

                    <button
                        onClick={initiateSimulation}
                        disabled={loading}
                        className={`group relative flex items-center space-x-2 bg-rose-600 hover:bg-rose-500 text-white px-6 py-2 rounded font-mono text-sm font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden ${!loading && 'hover:shadow-[0_0_20px_rgba(225,29,72,0.6)]'}`}
                    >
                        <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                        {loading ? (
                            <>
                                <Activity className="w-4 h-4 animate-spin" />
                                <span>SIMULATION ACTIVE</span>
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

            {/* War Room Layout */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-1 h-[600px] bg-slate-950 border border-slate-800 relative overflow-hidden">

                {/* Scanline Overlay */}
                <div className="absolute inset-0 pointer-events-none z-20 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_4px,3px_100%] opacity-20"></div>

                {/* Left Panel: Red Team */}
                <div ref={leftPanelRef} className="relative flex flex-col border-r border-rose-900/30 bg-red-950/10">
                    {/* Header */}
                    <div className="flex items-center justify-between p-3 bg-red-950/30 border-b border-rose-900/30">
                        <div className="flex items-center space-x-2 text-rose-500">
                            <Unlock className="w-4 h-4" />
                            <h3 className="font-mono text-xs font-bold tracking-[0.2em]">INCOMING_THREAT_STREAM</h3>
                        </div>
                        <Wifi className="w-4 h-4 text-rose-800 animate-pulse" />
                    </div>

                    {/* Terminal Content */}
                    <div className="flex-grow p-6 font-mono text-xs md:text-sm text-rose-500/90 leading-relaxed whitespace-pre-wrap overflow-y-auto custom-scrollbar font-bold shadow-[inset_0_0_20px_rgba(0,0,0,0.5)]">
                        {loading ? (
                            <div className="flex flex-col space-y-2">
                                <span className="animate-pulse">[!] ESTABLISHING C2 CONNECTION...</span>
                                <span className="animate-pulse delay-75">[!] BYPASSING FIREWALL RULES...</span>
                                <span className="animate-pulse delay-150">[!] INJECTING PAYLOAD...</span>
                                <div className="w-full bg-rose-900/20 h-1 mt-4 rounded overflow-hidden">
                                    <div className="bg-rose-600 h-full animate-[progress_2s_ease-in-out_infinite] w-full origin-left"></div>
                                </div>
                            </div>
                        ) : result ? (
                            <>
                                {redTeamTypewriter.displayedText}
                                {redTeamTypewriter.isTyping && <span className="animate-pulse inline-block w-2 h-4 bg-rose-500 ml-1"></span>}
                            </>
                        ) : (
                            <span className="text-rose-900/50">Waiting for target acquisition...</span>
                        )}
                    </div>
                </div>

                {/* Right Panel: Blue Team */}
                <div ref={rightPanelRef} className="relative flex flex-col bg-cyan-950/10">
                    {/* Header */}
                    <div className="flex items-center justify-between p-3 bg-cyan-950/30 border-b border-cyan-900/30">
                        <div className="flex items-center space-x-2 text-cyan-500">
                            <Shield className="w-4 h-4" />
                            <h3 className="font-mono text-xs font-bold tracking-[0.2em]">SENTINEL_DEFENSE_LOG</h3>
                        </div>
                        <Activity className="w-4 h-4 text-cyan-800 animate-pulse" />
                    </div>

                    {/* Terminal Content */}
                    <div className="flex-grow p-6 font-mono text-xs md:text-sm text-cyan-400/90 leading-relaxed whitespace-pre-wrap overflow-y-auto custom-scrollbar shadow-[inset_0_0_20px_rgba(0,0,0,0.5)]">
                        {loading ? (
                            <div className="flex flex-col space-y-2">
                                <div className="text-cyan-600 flex items-center space-x-2">
                                    <span className="animate-spin">⏵</span>
                                    <span>NEURAL LINK ACTIVE</span>
                                </div>
                                <span className="text-cyan-700 animate-pulse">Running heuristic analysis...</span>
                            </div>
                        ) : result ? (
                            <>
                                {blueTeamTypewriter.displayedText}
                                {blueTeamTypewriter.isTyping && <span className="animate-pulse inline-block w-2 h-4 bg-cyan-500 ml-1"></span>}
                            </>
                        ) : (
                            <div className="flex flex-col items-center justify-center h-full text-cyan-900/40 space-y-4">
                                <Shield className="w-16 h-16 opacity-20" />
                                <span>SYSTEM SECURE</span>
                            </div>
                        )}
                    </div>
                </div>

            </div>
        </div>
    );
};

export default AutomationShowcase;
