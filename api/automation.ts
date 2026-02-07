import type { VercelRequest, VercelResponse } from '@vercel/node';

// Rate Limiter State (In-memory, per instance)
const rateLimitMap = new Map<string, number>();

export default async function handler(req: VercelRequest, res: VercelResponse) {
    // 1. Method Check
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    // 2. Body Validation
    const { endpoint, payload } = req.body;

    if (endpoint !== 'sentinel-attack-sim') {
        return res.status(404).json({ error: 'Endpoint Not Found. Only sentinel-attack-sim is supported.' });
    }

    // 3. Env Var Check
    const n8nUrl = process.env.N8N_SENTINEL_URL;

    if (!n8nUrl) {
        console.error(`Missing N8N_SENTINEL_URL`);
        return res.status(503).json({ error: 'Server Config Error: Missing Env Var' });
    }

    // 4. Rate Limiting (2 seconds per IP)
    const clientIp = (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress || 'unknown';
    const now = Date.now();
    const lastRequestTime = rateLimitMap.get(clientIp);

    if (lastRequestTime && now - lastRequestTime < 2000) {
        return res.status(429).json({ error: 'Rate limit exceeded. Please wait 2 seconds.' });
    }
    rateLimitMap.set(clientIp, now);

    // Clean up safely
    if (rateLimitMap.size > 1000) rateLimitMap.clear();

    // 5. Proxy Request to n8n
    try {
        const response = await fetch(n8nUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload || {}),
        });

        if (!response.ok) {
            console.error(`n8n Error: ${response.statusText}`);
            return res.status(502).json({ error: 'Upstream Error' });
        }

        const data = await response.json();
        return res.status(200).json(data);

    } catch (error) {
        console.error('Proxy Error:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}
