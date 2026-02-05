import React from 'react';

/**
 * Paste this component inside your Automation Card (e.g., in the header or top-right corner).
 * It adds a "Live" status indicator with a pulsing effect and a tooltip on hover.
 */
const AutomationStatusBadge: React.FC = () => {
    return (
        <div className="group relative z-20 inline-flex items-center gap-2 px-3 py-1 bg-green-500/10 border border-green-500/30 rounded-full cursor-help transition-all duration-300 hover:bg-green-500/20 hover:border-green-500/50">
            {/* Pulsing Dot */}
            <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>

            {/* Text */}
            <span className="text-xs font-mono text-green-400 tracking-wider font-semibold">
                LIVE AGENT: ON
            </span>

            {/* Tooltip (Visible on Hover) */}
            <div className="absolute top-full right-0 mt-2 w-48 p-2 bg-black/90 border border-green-500/30 rounded-md backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none shadow-xl shadow-green-900/10">
                <div className="flex flex-col gap-1">
                    <div className="flex justify-between items-center text-[10px] text-gray-400 font-mono">
                        <span>Uptime:</span>
                        <span className="text-green-400">99.9%</span>
                    </div>
                    <div className="flex justify-between items-center text-[10px] text-gray-400 font-mono">
                        <span>Latency:</span>
                        <span className="text-green-400">12ms</span>
                    </div>
                    <div className="flex justify-between items-center text-[10px] text-gray-400 font-mono">
                        <span>Mem:</span>
                        <span className="text-green-400">42%</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AutomationStatusBadge;
