import { useEffect, useRef } from 'react';
import gsap from 'gsap';

/**
 * SkillsMobileBg — Mobile-adapted replica of SkillsBackground.
 *
 * Same falling data-packet animation + layer grid, tuned for mobile:
 *   • 35 packets (vs 80 desktop)
 *   • Slightly slower fall speed
 *   • No mouse interaction (gravity pull, ripple)
 *   • Fewer grid columns (6 vs 12)
 *
 * Scroll-safe: No ResizeObserver, no window resize listener.
 * Canvas dimensions locked at mount using screen.availHeight.
 * Only orientationchange triggers a re-layout.
 */

interface PacketData {
    x: number;
    y: number;
    vx: number;
    vy: number;
    length: number;
    alpha: number;
}

export function SkillsMobileBg() {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d', { alpha: true });
        if (!ctx) return;

        let width = 0, height = 0;
        const packetCount = 35;
        const packets: PacketData[] = [];

        function scatterPackets() {
            packets.length = 0;
            for (let i = 0; i < packetCount; i++) {
                packets.push({
                    x: Math.random() * width,
                    y: Math.random() * height,
                    vx: 0,
                    vy: Math.random() * 1.0 + 0.3,
                    length: Math.random() * 25 + 8,
                    alpha: Math.random() * 0.35 + 0.08,
                });
            }
        }

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

        function handleOrientationChange() {
            setCanvasSize();
            scatterPackets();
        }

        // Touch interaction state
        const touch = { x: -1000, y: -1000 };

        const handleTouchMove = (e: TouchEvent) => {
            if (e.touches.length > 0) {
                const target = e.target as HTMLElement;
                // Prevent background reaction when touching over the layer stack
                if (target && target.closest('.tcp-stack')) {
                    touch.x = -1000;
                    touch.y = -1000;
                } else {
                    touch.x = e.touches[0].clientX;
                    touch.y = e.touches[0].clientY;
                }
            }
        };

        const handleTouchEnd = () => {
            touch.x = -1000;
            touch.y = -1000;
        };

        window.addEventListener('touchmove', handleTouchMove, { passive: true });
        window.addEventListener('touchstart', handleTouchMove, { passive: true });
        window.addEventListener('touchend', handleTouchEnd);

        // Initial setup
        setCanvasSize();
        scatterPackets();

        const tick = () => {
            ctx.clearRect(0, 0, width, height);

            // 1. Draw layer grid with touch ripple
            const layers = 5;
            const rowH = height / layers;
            const cols = 6;
            const colW = width / cols;

            for (let r = 0; r <= layers; r++) {
                const y = r * rowH;

                ctx.beginPath();
                ctx.moveTo(0, y);
                ctx.lineTo(width, y);
                ctx.strokeStyle = 'rgba(34, 211, 238, 0.04)';
                ctx.lineWidth = 1;
                ctx.stroke();

                for (let c = 0; c <= cols; c++) {
                    const x = c * colW;
                    const dx = touch.x - x;
                    const dy = touch.y - y;
                    const dist = Math.sqrt(dx * dx + dy * dy);

                    let radius = 1.5;
                    let alpha = 0.08;

                    // Touch ripple effect on nodes
                    if (dist < 150) {
                        const intensity = 1 - (dist / 150);
                        radius += intensity * 4;
                        alpha += intensity * 0.5;
                    }

                    ctx.beginPath();
                    ctx.arc(x, y, radius, 0, Math.PI * 2);
                    ctx.fillStyle = `rgba(34, 211, 238, ${alpha})`;
                    ctx.fill();
                }
            }

            // 2. Update and draw falling packets
            for (const p of packets) {
                const dx = touch.x - p.x;
                const dy = touch.y - p.y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                // Gravitational pull towards touch
                if (dist < 200) {
                    const force = (200 - dist) / 200;
                    p.vx += (dx / dist) * force * 0.15; // Pull X
                    p.vy += (dy / dist) * force * 0.15; // Pull Y
                } else {
                    // Dampen X drift back to 0
                    p.vx *= 0.95;
                    // Restore vertical falling speed if slowed
                    if (p.vy < 0.3) p.vy += 0.03;
                }

                p.x += p.vx;
                p.y += p.vy;

                if (p.y > height + p.length) {
                    p.y = -p.length;
                    p.x = Math.random() * width;
                    p.vx = 0;
                    p.vy = Math.random() * 1.0 + 0.3;
                }
                if (p.x < 0) p.x += width;
                if (p.x > width) p.x -= width;

                const grad = ctx.createLinearGradient(
                    p.x, p.y,
                    p.x - p.vx * 8, p.y - p.length
                );
                grad.addColorStop(0, `rgba(34, 211, 238, ${p.alpha})`);
                grad.addColorStop(1, 'rgba(34, 211, 238, 0)');

                ctx.beginPath();
                ctx.moveTo(p.x, p.y);
                ctx.lineTo(p.x - p.vx * 8, p.y - p.length);
                ctx.strokeStyle = grad;
                ctx.lineWidth = 1.5;
                ctx.stroke();

                ctx.beginPath();
                ctx.arc(p.x, p.y, 1.2, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(255, 255, 255, ${p.alpha + 0.2})`;
                ctx.fill();
            }
        };

        gsap.ticker.add(tick);

        window.addEventListener('orientationchange', handleOrientationChange);

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
