import React from 'react';

/**
 * Paste this component inside your Projects Section (Feature Area).
 * It simulates a live network log terminal.
 */
const NetworkLogTerminal: React.FC = () => {
    const logs = [
        { time: "14:00:01", type: "INIT", color: "text-blue-400", msg: "Python Network Agent v1.0 started..." },
        { time: "14:00:02", type: "TARGET", color: "text-yellow-400", msg: "192.168.1.1 | STATUS: 200 OK" },
        { time: "14:00:03", type: "AUTH", color: "text-purple-400", msg: "Handshake established (TLS 1.3)" },
        { time: "14:00:03", type: "SUCCESS", color: "text-green-400", msg: "Data stored in MongoDB Atlas" },
        { time: "14:00:04", type: "INFO", color: "text-gray-400", msg: "Waiting for next webhook trigger..." }
    ];

    return (
        <div className="w-full max-w-lg mx-auto bg-[#050505] rounded-xl overflow-hidden shadow-2xl border border-gray-800 font-mono text-xs">
            {/* Window Header */}
            <div className="h-8 bg-gray-900 border-b border-gray-800 flex items-center px-4 gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500/80 hover:bg-red-500 transition-colors"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500/80 hover:bg-yellow-500 transition-colors"></div>
                <div className="w-3 h-3 rounded-full bg-green-500/80 hover:bg-green-500 transition-colors"></div>
                <div className="ml-auto text-gray-500">bash — 80x24</div>
            </div>

            {/* Terminal Body */}
            <div className="p-4 space-y-2 opacity-90">
                {logs.map((log, index) => (
                    <div key={index} className="flex gap-2">
                        <span className="text-gray-600">[{log.time}]</span>
                        <span className={`font-bold ${log.color}`}>{log.type}:</span>
                        <span className="text-gray-300">{log.msg}</span>
                    </div>
                ))}
                {/* Blinking Cursor Line */}
                <div className="flex gap-2 mt-2">
                    <span className="text-green-500">➜</span>
                    <span className="text-blue-400">~</span>
                    <span className="animate-pulse bg-gray-500 w-2 h-4 block"></span>
                </div>
            </div>
        </div>
    );
};

export default NetworkLogTerminal;
