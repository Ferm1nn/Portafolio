import React, { useState } from 'react';
import { Globe, ScanLine, Search } from 'lucide-react';
import { useTypewriter } from '../../hooks/useTypewriter';

const IpIntelligenceCard = () => {
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState<any>(null);
    const [ip, setIp] = useState('');

    const { displayedText, isTyping } = useTypewriter(data ? JSON.stringify(data, null, 2) : '', 20);

    const runScan = async () => {
        if (!ip) return;
        setLoading(true);
        setData(null);

        try {
            const response = await fetch('/api/automation', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ endpoint: 'ip-intel', payload: { ip } }),
            });

            const result = await response.json();
            setData(result);
        } catch (error) {
            setData({ error: "Scan failed" });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="relative flex flex-col overflow-hidden rounded-xl border border-slate-800 bg-slate-950 p-6 shadow-2xl">
            <div className="mb-4 flex items-center space-x-3">
                <div className="rounded-lg bg-cyan-500/10 p-2 text-cyan-400">
                    <Globe className="h-6 w-6" />
                </div>
                <h3 className="font-mono text-lg font-bold text-slate-100">IP Intelligence</h3>
            </div>

            <div className="flex-grow space-y-4">
                <p className="text-sm text-slate-400">
                    Enrich raw IP data with ISP and Geo-Location info via secure API.
                </p>

                <div className="flex space-x-2">
                    <input
                        type="text"
                        placeholder="8.8.8.8"
                        value={ip}
                        onChange={(e) => setIp(e.target.value)}
                        className="w-full rounded bg-slate-900 px-3 py-1 font-mono text-sm text-slate-300 ring-1 ring-slate-700 focus:outline-none focus:ring-cyan-500"
                    />
                    <button
                        onClick={runScan}
                        disabled={loading || !ip}
                        className="rounded bg-slate-800 p-2 text-cyan-400 hover:bg-slate-700 disabled:opacity-50"
                    >
                        <Search className="h-4 w-4" />
                    </button>
                </div>

                <div className="relative min-h-[120px] w-full rounded-lg border border-slate-800 bg-slate-900 p-4 font-mono text-xs text-cyan-400">
                    {loading ? (
                        <div className="flex items-center space-x-2 text-slate-500">
                            <ScanLine className="h-4 w-4 animate-pulse" />
                            <span>QUERYING DB...</span>
                        </div>
                    ) : data ? (
                        <pre className="whitespace-pre-wrap">{displayedText}{isTyping && <span className="animate-pulse">_</span>}</pre>
                    ) : (
                        <span className="text-slate-600">Awaiting Input...</span>
                    )}
                </div>
            </div>

            {/* Background Decor */}
            <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-cyan-500/5 blur-3xl" />
        </div>
    );
};

export default IpIntelligenceCard;
