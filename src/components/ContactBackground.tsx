import { useEffect, useRef } from 'react';
import gsap from 'gsap';

interface Packet {
    x: number; y: number;
    vx: number; vy: number;
    baseRad: number;
}

interface RadarPing {
    x: number; y: number;
    radius: number;
    active: boolean;
}

export function ContactBackground() {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d', { alpha: true });
        if (!ctx) return;

        let width = 0, height = 0;
        const mouse = { x: -1000, y: -1000 };

        const packets: Packet[] = [];
        const numPackets = 60; // Base background noise

        // Pool of user-initiated radar pings
        const pings: RadarPing[] = Array.from({ length: 6 }, () => ({ x: 0, y: 0, radius: 0, active: false }));
        let lastPingTime = 0;

        const resize = () => {
            width = canvas.clientWidth;
            height = canvas.clientHeight;
            canvas.width = width * window.devicePixelRatio;
            canvas.height = height * window.devicePixelRatio;
            ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

            if (packets.length === 0) {
                for (let i = 0; i < numPackets; i++) {
                    packets.push({
                        // Initial scatter completely random
                        x: Math.random() * window.innerWidth * 2,
                        y: Math.random() * window.innerHeight * 2,
                        vx: (Math.random() - 0.5) * 0.4,
                        vy: (Math.random() - 0.5) * 0.4,
                        baseRad: Math.random() * 1.5 + 0.5
                    });
                }
            }
        };

        window.addEventListener('resize', resize);
        const ro = new ResizeObserver(resize);
        ro.observe(canvas);
        resize();

        const onMouseMove = (e: MouseEvent) => {
            mouse.x = e.clientX;
            mouse.y = e.clientY;

            const now = Date.now();
            // Fire a new localized ping wave every 400ms while moving
            if (now - lastPingTime > 400) {
                const p = pings.find(ping => !ping.active);
                if (p) {
                    p.active = true;
                    p.x = mouse.x;
                    p.y = mouse.y;
                    p.radius = 0;
                    lastPingTime = now;
                }
            }
        };
        window.addEventListener('mousemove', onMouseMove);

        const tick = () => {
            ctx.clearRect(0, 0, width, height);

            // 1. Update and draw the subtle base background network
            packets.forEach((p, i) => {
                // Ensure packets eventually return to base speed after being pushed by radar
                p.vx *= 0.98;
                p.vy *= 0.98;

                // Add minimum drift
                if (Math.abs(p.vx) < 0.1) p.vx += (Math.random() - 0.5) * 0.1;
                if (Math.abs(p.vy) < 0.1) p.vy += (Math.random() - 0.5) * 0.1;

                p.x += p.vx;
                p.y += p.vy;

                // Wrap around edges
                if (p.x < 0) p.x += width;
                if (p.x > width) p.x -= width;
                if (p.y < 0) p.y += height;
                if (p.y > height) p.y -= height;

                // Draw packet node
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.baseRad, 0, Math.PI * 2);
                ctx.fillStyle = 'rgba(6, 182, 212, 0.15)';
                ctx.fill();

                // Connect to nearby nodes to form base network
                for (let j = i + 1; j < packets.length; j++) {
                    const o = packets[j];
                    const dx = p.x - o.x;
                    const dy = p.y - o.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < 100) {
                        ctx.beginPath();
                        ctx.moveTo(p.x, p.y);
                        ctx.lineTo(o.x, o.y);
                        // Faint connections
                        ctx.strokeStyle = `rgba(6, 182, 212, ${0.04 * (1 - dist / 100)})`;
                        ctx.stroke();
                    }
                }
            });

            // 2. Localized cursor tracking rings (always present on cursor)
            ctx.beginPath();
            ctx.arc(mouse.x, mouse.y, 15, 0, Math.PI * 2);
            ctx.strokeStyle = 'rgba(34, 211, 238, 0.4)';
            ctx.stroke();

            ctx.beginPath();
            ctx.arc(mouse.x, mouse.y, 25, 0, Math.PI * 2);
            ctx.strokeStyle = 'rgba(34, 211, 238, 0.1)';
            ctx.stroke();

            // 3. Update & Draw expanding Radar Pings
            pings.forEach(ping => {
                if (!ping.active) return;

                ping.radius += 3; // Expansion speed

                const maxRadius = 350;
                if (ping.radius > maxRadius) {
                    ping.active = false;
                    return;
                }

                // Fade out as it expands
                const opacity = 0.3 * (1 - ping.radius / maxRadius);

                // Draw ping wave
                ctx.beginPath();
                ctx.arc(ping.x, ping.y, ping.radius, 0, Math.PI * 2);
                ctx.strokeStyle = `rgba(34, 211, 238, ${opacity})`;
                ctx.lineWidth = 1.5;
                ctx.stroke();

                // Interaction: Particles get caught in the expanding wave
                packets.forEach(p => {
                    const dx = p.x - ping.x;
                    const dy = p.y - ping.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);

                    // If particle is caught right on the growing wave radius
                    if (Math.abs(dist - ping.radius) < 20) {
                        // Push outward along the wave trajectory radially
                        p.vx += (dx / dist) * 0.5 * opacity;
                        p.vy += (dy / dist) * 0.5 * opacity;

                        // Flash particle brightly as it gets hit by the wave
                        ctx.beginPath();
                        ctx.arc(p.x, p.y, p.baseRad + 1, 0, Math.PI * 2);
                        ctx.fillStyle = `rgba(255, 255, 255, ${opacity * 2.5})`;
                        ctx.fill();
                    }
                });
            });

        };

        gsap.ticker.add(tick);

        return () => {
            gsap.ticker.remove(tick);
            window.removeEventListener('resize', resize);
            window.removeEventListener('mousemove', onMouseMove);
            ro.disconnect();
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className="fixed top-0 left-0 w-full h-full pointer-events-none"
            style={{ zIndex: 0 }}
        />
    );
}
