import type { VercelRequest, VercelResponse } from '@vercel/node';

// --- Configuration & Types ---

interface ContactFormBody {
    name: string;
    email: string;
    topic: string;
    message: string;
}

// Simple in-memory rate limiter: Map<IP, Timestamp>
// In a real serverless encironment, this state might be lost between cold starts,
// but it suffices for basic "spam click" protection on a single running instance.
const rateLimitMap = new Map<string, number>();
const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute

export default async function handler(req: VercelRequest, res: VercelResponse) {
    // 1. Method Check
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    // 2. Env Var Check
    const { CONTACT_WEBHOOK_URL, CONTACT_WEBHOOK_TOKEN, CONTACT_WEBHOOK_TIMEOUT_MS } = process.env;

    if (!CONTACT_WEBHOOK_URL) {
        console.error('Missing CONTACT_WEBHOOK_URL env var');
        return res.status(503).json({
            error: 'Service Unavailable: Server configuration is missing.',
        });
    }

    // 3. Rate Limiting (Basic IP-based)
    const clientIp = (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress || 'unknown';
    const now = Date.now();
    const lastRequestTime = rateLimitMap.get(clientIp);

    if (lastRequestTime && now - lastRequestTime < 2000) {
        // 2 seconds cooldown between requests to prevent massive spam
        return res.status(429).json({ error: 'Too Many Requests. Please wait a moment.' });
    }
    rateLimitMap.set(clientIp, now);

    // Clean up old entries occasionally (optional optimization, not strictly needed for this scale)
    if (rateLimitMap.size > 1000) rateLimitMap.clear();

    // 4. Input Validation
    const body = req.body as Partial<ContactFormBody>;
    const { name, email, topic, message } = body;

    if (!name || typeof name !== 'string' || name.length > 100) {
        return res.status(400).json({ error: 'Invalid name' });
    }
    if (!email || typeof email !== 'string' || email.length > 100 || !email.includes('@')) {
        return res.status(400).json({ error: 'Invalid email' });
    }
    if (!topic || typeof topic !== 'string' || topic.length > 50) {
        return res.status(400).json({ error: 'Invalid topic' });
    }
    if (!message || typeof message !== 'string' || message.length > 5000) {
        return res.status(400).json({ error: 'Invalid message' });
    }

    // 5. Forward to Webhook
    const controller = new AbortController();
    const timeoutVal = CONTACT_WEBHOOK_TIMEOUT_MS ? parseInt(CONTACT_WEBHOOK_TIMEOUT_MS, 10) : 7000;
    const timeoutId = setTimeout(() => controller.abort(), timeoutVal);

    try {
        const payload = {
            action: 'contact_submission',
            timestamp: new Date().toISOString(),
            userAgent: req.headers['user-agent'] || 'unknown',
            referrer: req.headers.referer || 'unknown',
            data: { name, email, topic, message },
        };

        const headers: Record<string, string> = {
            'Content-Type': 'application/json',
        };

        if (CONTACT_WEBHOOK_TOKEN) {
            // Use Bearer auth or a custom header depending on what n8n expects.
            // Standardizing on Bearer for generic token usage.
            headers['Authorization'] = `Bearer ${CONTACT_WEBHOOK_TOKEN}`;
        }

        const webhookRes = await fetch(CONTACT_WEBHOOK_URL, {
            method: 'POST',
            headers,
            body: JSON.stringify(payload),
            signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (!webhookRes.ok) {
            console.error(`Webhook failed with status ${webhookRes.status}`);
            // Do not leak upstream error details
            return res.status(502).json({ error: 'Upstream Error' });
        }

        // Success
        return res.status(200).json({ ok: true });

    } catch (error: unknown) {
        clearTimeout(timeoutId);

        if (error instanceof Error && error.name === 'AbortError') {
            console.error('Webhook timed out');
            return res.status(504).json({ error: 'Gateway Timeout' });
        }

        console.error('Webhook fetch error:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}
