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

/**
 * ContactMobileBg — Mobile-adapted replica of ContactBackground.
 *
 * Same canvas network + expanding radar ping logic, tuned for mobile:
 *   • 30 packets (instead of 60).
 *   • No mouse tracking — radar pings spawn automatically near the bottom-center.
 *
 * Scroll-safe: No ResizeObserver, no window resize listener.
 * Canvas locked at mount via screen.availHeight + inline 100vw×100vh CSS.
 * Only orientationchange triggers re-layout.
 */
export function ContactMobileBg() {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d', { alpha: true });
        if (!ctx) return;

        let width = 0, height = 0;

        const packets: Packet[] = [];
        const numPackets = 30;

        const pings: RadarPing[] = Array.from({ length: 6 }, () => ({ x: 0, y: 0, radius: 0, active: false }));
        let lastPingTime = 0;

        let touch = { x: -1000, y: -1000 };
        let isTouching = false;

        function setCanvasSize() {
            if (!canvas || !ctx) return;
            width = window.innerWidth;
            height = Math.max(window.innerHeight, screen.availHeight || window.innerHeight);

            const dpr = window.devicePixelRatio;
            ctx.setTransform(1, 0, 0, 1, 0, 0);
            canvas.width = width * dpr;
            canvas.height = height * dpr;
            ctx.scale(dpr, dpr);
        }

        function initPackets() {
            packets.length = 0;
            for (let i = 0; i < numPackets; i++) {
                packets.push({
                    x: Math.random() * width,
                    y: Math.random() * height,
                    vx: (Math.random() - 0.5) * 0.4,
                    vy: (Math.random() - 0.5) * 0.4,
                    baseRad: Math.random() * 1.5 + 0.5
                });
            }
        }

        function handleOrientationChange() {
            setCanvasSize();
            // Reposition proportionally
            for (const p of packets) {
                p.x = Math.random() * width;
                p.y = Math.random() * height;
            }
        }

        // Initial setup
        setCanvasSize();
        initPackets();

        const tick = () => {
            ctx.clearRect(0, 0, width, height);

            const now = Date.now();
            // Base automated ping every ~6 seconds if not touching
            if (!isTouching && now - lastPingTime > (5000 + Math.random() * 2000)) {
                const p = pings.find(ping => !ping.active);
                if (p) {
                    p.active = true;
                    p.x = width / 2;
                    p.y = height * 0.85;
                    p.radius = 0;
                    lastPingTime = now;
                }
            }

            // 1. Update and draw particles
            packets.forEach((p, i) => {
                p.vx *= 0.98;
                p.vy *= 0.98;

                if (Math.abs(p.vx) < 0.1) p.vx += (Math.random() - 0.5) * 0.1;
                if (Math.abs(p.vy) < 0.1) p.vy += (Math.random() - 0.5) * 0.1;

                p.x += p.vx;
                p.y += p.vy;

                if (p.x < 0) p.x += width;
                if (p.x > width) p.x -= width;
                if (p.y < 0) p.y += height;
                if (p.y > height) p.y -= height;

                ctx.beginPath();
                ctx.arc(p.x, p.y, p.baseRad, 0, Math.PI * 2);
                ctx.fillStyle = 'rgba(6, 182, 212, 0.2)';
                ctx.fill();

                for (let j = i + 1; j < packets.length; j++) {
                    const o = packets[j];
                    const dx = p.x - o.x;
                    const dy = p.y - o.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < 100) {
                        ctx.beginPath();
                        ctx.moveTo(p.x, p.y);
                        ctx.lineTo(o.x, o.y);
                        ctx.strokeStyle = `rgba(6, 182, 212, ${0.05 * (1 - dist / 100)})`;
                        ctx.stroke();
                    }
                }
            });

            // Localized touch rings if currently touching
            if (isTouching) {
                ctx.beginPath();
                ctx.arc(touch.x, touch.y, 15, 0, Math.PI * 2);
                ctx.strokeStyle = 'rgba(34, 211, 238, 0.4)';
                ctx.stroke();

                ctx.beginPath();
                ctx.arc(touch.x, touch.y, 25, 0, Math.PI * 2);
                ctx.strokeStyle = 'rgba(34, 211, 238, 0.1)';
                ctx.stroke();
            }

            // 2. Expand and draw Radar Pings
            pings.forEach(ping => {
                if (!ping.active) return;

                ping.radius += 2.5;
                const maxRadius = Math.max(width, height) * 0.7;

                if (ping.radius > maxRadius) {
                    ping.active = false;
                    return;
                }

                const opacity = 0.3 * (1 - ping.radius / maxRadius);

                ctx.beginPath();
                ctx.arc(ping.x, ping.y, ping.radius, 0, Math.PI * 2);
                ctx.strokeStyle = `rgba(34, 211, 238, ${opacity})`;
                ctx.lineWidth = 1.5;
                ctx.stroke();

                packets.forEach(p => {
                    const dx = p.x - ping.x;
                    const dy = p.y - ping.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);

                    if (Math.abs(dist - ping.radius) < 20) {
                        p.vx += (dx / dist) * 0.4 * opacity;
                        p.vy += (dy / dist) * 0.4 * opacity;

                        ctx.beginPath();
                        ctx.arc(p.x, p.y, p.baseRad + 1, 0, Math.PI * 2);
                        ctx.fillStyle = `rgba(255, 255, 255, ${opacity * 2.5})`;
                        ctx.fill();
                    }
                });
            });
        };

        const handleTouchMove = (e: TouchEvent) => {
            if (e.touches.length > 0) {
                touch.x = e.touches[0].clientX;
                touch.y = e.touches[0].clientY;
                isTouching = true;

                const now = Date.now();
                if (now - lastPingTime > 400) {
                    const p = pings.find(ping => !ping.active);
                    if (p) {
                        p.active = true;
                        p.x = touch.x;
                        p.y = touch.y;
                        p.radius = 0;
                        lastPingTime = now;
                    }
                }
            }
        };

        const handleTouchEnd = () => {
            isTouching = false;
        };

        gsap.ticker.add(tick);
        window.addEventListener('orientationchange', handleOrientationChange);
        window.addEventListener('touchmove', handleTouchMove, { passive: true });
        window.addEventListener('touchstart', handleTouchMove, { passive: true });
        window.addEventListener('touchend', handleTouchEnd);

        return () => {
            gsap.ticker.remove(tick);
            window.removeEventListener('orientationchange', handleOrientationChange);
            window.removeEventListener('touchmove', handleTouchMove);
            window.removeEventListener('touchstart', handleTouchMove);
            window.removeEventListener('touchend', handleTouchEnd);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className="fixed top-0 left-0 pointer-events-none"
            style={{ zIndex: 0, width: '100vw', height: '100vh' }}
        />
    );
}
