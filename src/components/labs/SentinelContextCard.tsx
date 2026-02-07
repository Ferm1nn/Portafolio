import React from 'react';
import { Info, ShieldCheck, Cpu, X } from 'lucide-react';

interface SentinelContextCardProps {
    onClose?: () => void;
}

const SentinelContextCard: React.FC<SentinelContextCardProps> = ({ onClose }) => {
    return (
        <div className="relative overflow-hidden rounded-lg border border-cyan-500/20 bg-slate-900/90 p-6 shadow-2xl backdrop-blur-md max-w-3xl w-full mx-4">

            {onClose && (
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 z-10 text-slate-500 hover:text-rose-500 transition-colors"
                >
                    <X className="w-5 h-5" />
                </button>
            )}

            {/* Decorative Corner Brackets */}
            <div className="absolute top-0 left-0 h-4 w-4 border-t-2 border-l-2 border-cyan-500/50 rounded-tl-sm"></div>
            <div className="absolute top-0 right-0 h-4 w-4 border-t-2 border-r-2 border-cyan-500/50 rounded-tr-sm"></div>
            <div className="absolute bottom-0 left-0 h-4 w-4 border-b-2 border-l-2 border-cyan-500/50 rounded-bl-sm"></div>
            <div className="absolute bottom-0 right-0 h-4 w-4 border-b-2 border-r-2 border-cyan-500/50 rounded-br-sm"></div>

            {/* Header */}
            <div className="flex items-center space-x-3 mb-4 border-b border-white/5 pb-3">
                <Info className="w-5 h-5 text-cyan-400" />
                <h3 className="font-mono text-sm font-bold tracking-widest text-cyan-100">
                    SYSTEM_ARCHITECTURE // <span className="text-cyan-400">SENTINEL_CORE</span>
                </h3>
            </div>

            {/* Main Content */}
            <div className="flex flex-col md:flex-row gap-6">
                <div className="flex-1 space-y-3">
                    <p className="text-slate-300 text-sm leading-relaxed">
                        This system orchestrates a live adversarial conflict between two autonomous <strong className="text-white">AI Neural Agents</strong>.
                    </p>
                    <ul className="text-sm space-y-2 ml-1">
                        <li className="flex items-center space-x-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
                            <span className="text-slate-400">The <span className="text-rose-400 font-medium">Red Team</span> generates novel attack vectors.</span>
                        </li>
                        <li className="flex items-center space-x-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-cyan-500"></span>
                            <span className="text-slate-400">The <span className="text-cyan-400 font-medium">Blue Team</span> analyzes telemetry to neutralize threats.</span>
                        </li>
                    </ul>
                </div>

                {/* Security Footer/Disclaimer */}
                <div className="flex-1 rounded border border-slate-700/50 bg-slate-950/50 p-3 flex flex-col justify-center">
                    <div className="flex items-center space-x-2 mb-2">
                        <ShieldCheck className="w-4 h-4 text-slate-500" />
                        <span className="font-mono text-xs font-bold text-slate-500 uppercase tracking-wider">Secure Sandbox Protocol</span>
                    </div>
                    <p className="text-xs text-slate-500 leading-relaxed">
                        All data displayed is synthetically generated for demonstration purposes. This simulation acts within a closed environment and does not access, scan, or compromise your local network or personal device.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default SentinelContextCard;
