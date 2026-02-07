import React, { useState } from 'react';
import { Activity, ShieldCheck, Wifi } from 'lucide-react';
import { useTypewriter } from '../../hooks/useTypewriter';

const NetworkHealthCard = () => {
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState<any>(null);

    const { displayedText, isTyping } = useTypewriter(data ? JSON.stringify(data, null, 2) : '', 30);

    const runDiagnostic = async () => {
        setLoading(true);
        setData(null);

        try {
            const response = await fetch('/api/automation', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ endpoint: 'network-health', payload: {} }),
            });

            const result = await response.json();
            setData(result);
        } catch (error) {
            setData({ error: "Failed to fetch data" });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="relative flex flex-col overflow-hidden rounded-xl border border-slate-800 bg-slate-950 p-6 shadow-2xl">
            <div className="mb-4 flex items-center space-x-3">
                <div className="rounded-lg bg-emerald-500/10 p-2 text-emerald-400">
                    <Wifi className="h-6 w-6" />
                </div>
                <h3 className="font-mono text-lg font-bold text-slate-100">NetOps Mirror</h3>
            </div>

            <div className="flex-grow space-y-4">
                <p className="text-sm text-slate-400">
                    Simulate an L3 switch diagnostic scan via n8n webhook (Secured Proxy).
                </p>

                <div className="relative min-h-[120px] w-full rounded-lg border border-slate-800 bg-slate-900 p-4 font-mono text-xs text-emerald-400">
                    {loading ? (
                        <div className="flex items-center space-x-2 text-slate-500">
                            <Activity className="h-4 w-4 animate-spin" />
                            <span>ESTABLISHING CONNECTION...</span>
                        </div>
                    ) : data ? (
                        <pre className="whitespace-pre-wrap">{displayedText}{isTyping && <span className="animate-pulse">_</span>}</pre>
                    ) : (
                        <span className="text-slate-600">Waiting for trigger...</span>
                    )}
                </div>
            </div>

            <button
                onClick={runDiagnostic}
                disabled={loading}
                className="mt-6 flex w-full items-center justify-center rounded-lg bg-emerald-600 px-4 py-2 font-mono text-sm font-semibold text-white hover:bg-emerald-500 disabled:opacity-50"
            >
                {loading ? 'Scanning...' : 'Run Diagnostics'}
            </button>

            {/* Background Decor */}
            <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-emerald-500/5 blur-3xl" />
        </div>
    );
};

export default NetworkHealthCard;
