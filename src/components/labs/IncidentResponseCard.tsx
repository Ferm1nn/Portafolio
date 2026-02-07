import { useState } from 'react';
import { BellRing, Siren } from 'lucide-react';
import { useTypewriter } from '../../hooks/useTypewriter';

const IncidentResponseCard = () => {
    const [loading, setLoading] = useState<'critical' | 'low' | null>(null);
    const [data, setData] = useState<any>(null);

    const { displayedText, isTyping } = useTypewriter(data ? JSON.stringify(data, null, 2) : '', 30);

    const triggerAlert = async (type: 'critical' | 'low') => {
        setLoading(type);
        setData(null);

        const payload = type === 'critical'
            ? { severity: "CRITICAL", origin: "frontend_demo" }
            : { severity: "LOW", origin: "frontend_demo" };

        try {
            const response = await fetch('/api/automation', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ endpoint: 'incident-response', payload }),
            });

            const result = await response.json();
            setData(result);
        } catch (error) {
            setData({ error: "Failed to trigger workflow" });
        } finally {
            setLoading(null);
        }
    };

    return (
        <div className="relative flex flex-col overflow-hidden rounded-xl border border-slate-800 bg-slate-950 p-6 shadow-2xl">
            <div className="mb-4 flex items-center space-x-3">
                <div className="rounded-lg bg-amber-500/10 p-2 text-amber-400">
                    <Siren className="h-6 w-6" />
                </div>
                <h3 className="font-mono text-lg font-bold text-slate-100">Incident Response</h3>
            </div>

            <div className="flex-grow space-y-4">
                <p className="text-sm text-slate-400">
                    Trigger automated logic branches based on severity via secure API proxy.
                </p>

                <div className="relative min-h-[120px] w-full rounded-lg border border-slate-800 bg-slate-900 p-4 font-mono text-xs text-amber-400">
                    {loading ? (
                        <div className="flex items-center space-x-2 text-slate-500">
                            <BellRing className="h-4 w-4 animate-bounce" />
                            <span>ROUTING ALERT...</span>
                        </div>
                    ) : data ? (
                        <pre className="whitespace-pre-wrap">{displayedText}{isTyping && <span className="animate-pulse">_</span>}</pre>
                    ) : (
                        <span className="text-slate-600">System Normal...</span>
                    )}
                </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3">
                <button
                    onClick={() => triggerAlert('critical')}
                    disabled={!!loading}
                    className="flex items-center justify-center rounded-lg bg-red-900/50 px-3 py-2 font-mono text-xs font-semibold text-red-200 ring-1 ring-red-700 hover:bg-red-800 disabled:opacity-50"
                >
                    CRITICAL ALERT
                </button>
                <button
                    onClick={() => triggerAlert('low')}
                    disabled={!!loading}
                    className="flex items-center justify-center rounded-lg bg-yellow-900/30 px-3 py-2 font-mono text-xs font-semibold text-yellow-200 ring-1 ring-yellow-700 hover:bg-yellow-800 disabled:opacity-50"
                >
                    LOW WARNING
                </button>
            </div>

            {/* Background Decor */}
            <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-amber-500/5 blur-3xl" />
        </div>
    );
};

export default IncidentResponseCard;
