import { useState, useEffect } from 'react';
import { Section } from './Section';

// --- Types ---
type LogEntry = {
    id: number;
    timestamp: string;
    message: string;
    type: 'INFO' | 'WARN' | 'SUCCESS' | 'ERROR';
};

export function MissionControl() {
    // --- STATE: Agent Layer (Python) ---
    const [logs, setLogs] = useState<LogEntry[]>([
        { id: 1, timestamp: '14:00:01', message: 'Initializing NETWORK_AGENT_V1...', type: 'INFO' },
        { id: 2, timestamp: '14:00:02', message: 'Loading modules: [os, sys, socket, requests]', type: 'INFO' },
    ]);

    // --- STATE: Storage Layer (MongoDB) ---
    const [lastInsert, setLastInsert] = useState<string>('Just now');
    const [recordId, setRecordId] = useState<string>('64f8a9...');

    // --- EFFECT: Simulate Live Python Logs ---
    useEffect(() => {
        const messages = [
            { msg: 'Pinging target 192.168.1.5... [OK]', type: 'SUCCESS' },
            { msg: 'Scanning ports 20-8080...', type: 'INFO' },
            { msg: 'Packet captured (Size: 4kb)', type: 'WARN' },
            { msg: 'Handshake established (TLS 1.3)', type: 'SUCCESS' },
            { msg: 'Uploading payload to S3...', type: 'INFO' },
            { msg: 'Garbage collection started', type: 'INFO' },
            { msg: 'Heartbeat signal sent', type: 'SUCCESS' },
        ] as const;

        const interval = setInterval(() => {
            const randomMsg = messages[Math.floor(Math.random() * messages.length)];
            setLogs((prev) => {
                const newLog = {
                    id: Date.now(),
                    timestamp: new Date().toLocaleTimeString('en-US', { hour12: false }),
                    message: randomMsg.msg,
                    type: randomMsg.type,
                };
                return [...prev.slice(-8), newLog]; // Keep last 9
            });
        }, 2500);

        return () => clearInterval(interval);
    }, []);

    // --- EFFECT: Simulate Database Updates ---
    useEffect(() => {
        const interval = setInterval(() => {
            setLastInsert(new Date().toLocaleTimeString());
            setRecordId('64f' + Math.random().toString(16).substr(2, 6));
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    return (
        <Section
            id="mission-control"
            eyebrow="Mission Control"
            title="Live Operations Center"
            description="Real-time visualization of active workflows, agents, and data streams."
        >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-mono text-xs">

                {/* --- COLUMN 1: AGENT LAYER (PYTHON) --- */}
                <div className="relative group overflow-hidden rounded-xl border border-green-500/20 bg-black/50 backdrop-blur-md shadow-lg shadow-green-900/10">
                    {/* Header */}
                    <div className="flex items-center justify-between px-4 py-3 bg-green-900/10 border-b border-green-500/20">
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                            <span className="text-green-400 font-bold tracking-wider">NETWORK_AGENT_V1</span>
                        </div>
                        <span className="text-green-500/50">Python 3.11</span>
                    </div>

                    {/* Terminal Body */}
                    <div className="p-4 h-64 overflow-y-auto flex flex-col justify-end space-y-1">
                        {logs.map((log) => (
                            <div key={log.id} className="opacity-90">
                                <span className="text-gray-500 mr-2">[{log.timestamp}]</span>
                                <span className={
                                    log.type === 'SUCCESS' ? 'text-green-400' :
                                        log.type === 'WARN' ? 'text-yellow-400' :
                                            log.type === 'ERROR' ? 'text-red-400' : 'text-gray-300'
                                }>{log.message}</span>
                            </div>
                        ))}
                        <div className="flex items-center gap-1 animate-pulse text-green-500 mt-2">
                            <span>_</span>
                        </div>
                    </div>
                </div>


                {/* --- COLUMN 2: ORCHESTRATION LAYER (n8n) --- */}
                <div className="relative group overflow-hidden rounded-xl border border-orange-500/20 bg-black/50 backdrop-blur-md shadow-lg shadow-orange-900/10">
                    {/* Header */}
                    <div className="flex items-center justify-between px-4 py-3 bg-orange-900/10 border-b border-orange-500/20">
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-orange-500 animate-spin-slow" />
                            <span className="text-orange-400 font-bold tracking-wider">WORKFLOW_ENGINE</span>
                        </div>
                        <span className="text-orange-500/50">n8n:active</span>
                    </div>

                    {/* Flow Visualization */}
                    <div className="p-4 h-64 relative flex flex-col justify-between items-center py-8">
                        {/* SVG Logic Connection */}
                        <svg className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-30">
                            <path
                                d="M 50 20 L 50 50 L 50 80"
                                fill="none"
                                stroke="currentColor"
                                className="text-orange-500"
                                strokeWidth="2"
                                vectorEffect="non-scaling-stroke"
                            />
                        </svg>

                        {/* Nodes */}
                        <div className="relative z-10 flex flex-col items-center gap-8 w-full h-full justify-center">

                            {/* Node 1: Webhook */}
                            <div className="flex items-center gap-3 w-4/5 p-2 rounded border border-orange-500/30 bg-orange-500/5">
                                <div className="w-8 h-8 rounded bg-orange-500/20 flex items-center justify-center text-orange-400">
                                    ⚡
                                </div>
                                <div>
                                    <div className="text-orange-300 font-bold">Webhook Listener</div>
                                    <div className="text-[10px] text-gray-500">POST /api/intake</div>
                                </div>
                            </div>

                            {/* Animated Line Connector */}
                            <div className="w-0.5 h-6 bg-orange-500/20 relative overflow-hidden">
                                <div className="absolute top-0 left-0 w-full h-1/2 bg-orange-500 animate-slide-down"></div>
                            </div>

                            {/* Node 2: Transform */}
                            <div className="flex items-center gap-3 w-4/5 p-2 rounded border border-blue-500/30 bg-blue-500/5">
                                <div className="w-8 h-8 rounded bg-blue-500/20 flex items-center justify-center text-blue-400 animate-spin">
                                    ⚙️
                                </div>
                                <div>
                                    <div className="text-blue-300 font-bold">Data Transform</div>
                                    <div className="text-[10px] text-gray-500">JSON Parsing...</div>
                                </div>
                            </div>

                            {/* Animated Line Connector */}
                            <div className="w-0.5 h-6 bg-orange-500/20 relative overflow-hidden">
                                <div className="absolute top-0 left-0 w-full h-1/2 bg-orange-500 animate-slide-down delay-300"></div>
                            </div>

                            {/* Node 3: Router */}
                            <div className="flex items-center gap-3 w-4/5 p-2 rounded border border-purple-500/30 bg-purple-500/5">
                                <div className="w-8 h-8 rounded bg-purple-500/20 flex items-center justify-center text-purple-400">
                                    ⑂
                                </div>
                                <div>
                                    <div className="text-purple-300 font-bold">Router</div>
                                    <div className="text-[10px] text-gray-500">Cond: status == 200</div>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>


                {/* --- COLUMN 3: STORAGE LAYER (MongoDB) --- */}
                <div className="relative group overflow-hidden rounded-xl border border-blue-500/20 bg-black/50 backdrop-blur-md shadow-lg shadow-blue-900/10">
                    {/* Header */}
                    <div className="flex items-center justify-between px-4 py-3 bg-blue-900/10 border-b border-blue-500/20">
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-blue-500" />
                            <span className="text-blue-400 font-bold tracking-wider">DATA_LAKE</span>
                        </div>
                        <span className="text-blue-500/50">MongoDB Atlas</span>
                    </div>

                    {/* JSON Viewer */}
                    <div className="p-4 h-64 overflow-hidden font-mono text-[10px] leading-relaxed">
                        <div className="text-gray-500 mb-2">/* Connected to Cluster0. Last Insert: <span className="text-blue-400">{lastInsert}</span> */</div>
                        <pre className="text-gray-300">
                            {`{
  "_id": "ObjectId('${recordId}')",
  "source": "web_lead_form",
  "payload": {
    "user": "visitor_29384",
    "intent": "automation_request",
    "budget": "tier_2",
    "urgent": `}<span className="text-blue-400">true</span>{`
  },
  "metadata": {
    "ip": "104.23.1.99",
    "geo": "US-EAST-1",
    "processed": `}<span className="text-blue-400">true</span>{`
  },
  "__v": 0
}`}
                        </pre>
                    </div>
                </div>

            </div>
        </Section>
    );
}
