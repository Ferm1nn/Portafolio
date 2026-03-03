import { useEffect, useRef } from 'react';
import gsap from 'gsap';

export function SkillsBackground() {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d', { alpha: true });
        if (!ctx) return;

        let width = 0, height = 0;
        const mouse = { x: -1000, y: -1000 };

        const packets = Array.from({ length: 80 }, () => ({
            x: 0, y: 0,
            vx: 0, vy: Math.random() * 1.5 + 0.5,
            length: Math.random() * 30 + 10,
            alpha: Math.random() * 0.4 + 0.1
        }));

        const resize = () => {
            width = canvas.clientWidth;
            height = canvas.clientHeight;
            // Handle high-DPI displays for crisp canvas rendering
            canvas.width = width * window.devicePixelRatio;
            canvas.height = height * window.devicePixelRatio;
            ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

            // Re-scatter packets on resize to prevent clustering
            packets.forEach(p => {
                p.x = Math.random() * width;
                p.y = Math.random() * height;
            });
        };
        resize();

        window.addEventListener('resize', resize);
        const ro = new ResizeObserver(resize);
        ro.observe(canvas);

        const onMouseMove = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            // Prevent background reaction when hovering over the layer stack
            if (target && target.closest('.tcp-stack')) {
                mouse.x = -1000;
                mouse.y = -1000;
            } else {
                mouse.x = e.clientX;
                mouse.y = e.clientY;
            }
        };
        window.addEventListener('mousemove', onMouseMove);

        const tick = () => {
            ctx.clearRect(0, 0, width, height);

            const layers = 5;
            const rowH = height / layers;
            const colW = width / 12;

            // 1. Draw layer grid and mouse ripple
            for (let r = 0; r <= layers; r++) {
                const y = r * rowH;

                // Draw horizontal layer separator
                ctx.beginPath();
                ctx.moveTo(0, y);
                ctx.lineTo(width, y);
                ctx.strokeStyle = 'rgba(34, 211, 238, 0.05)';
                ctx.lineWidth = 1;
                ctx.stroke();

                // Draw network nodes at column intersections
                for (let c = 0; c <= 12; c++) {
                    const x = c * colW;
                    const dx = mouse.x - x;
                    const dy = mouse.y - y;
                    const dist = Math.sqrt(dx * dx + dy * dy);

                    let radius = 1.5;
                    let alpha = 0.1;

                    // Mouse ripple effect on nodes
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

            // 2. Draw packets with subtle mouse gravity
            packets.forEach(p => {
                const dx = mouse.x - p.x;
                const dy = mouse.y - p.y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                // Gravitational pull towards cursor
                if (dist < 200) {
                    const force = (200 - dist) / 200;
                    p.vx += (dx / dist) * force * 0.15; // Pull X
                    p.vy += (dy / dist) * force * 0.15; // Pull Y
                } else {
                    // Dampen X drift back to 0
                    p.vx *= 0.95;
                    // Restore vertical falling speed if slowed
                    if (p.vy < 0.5) p.vy += 0.05;
                }

                p.x += p.vx;
                p.y += p.vy;

                // Vertical wrapping
                if (p.y > height + p.length) {
                    p.y = -p.length;
                    p.x = Math.random() * width;
                    p.vx = 0;
                    p.vy = Math.random() * 1.5 + 0.5;
                }
                // Horizontal wrapping
                if (p.x < 0) p.x += width;
                if (p.x > width) p.x -= width;

                // Draw packet trail (gradient)
                const grad = ctx.createLinearGradient(p.x, p.y, p.x - p.vx * 10, p.y - p.vy * 10 - p.length);
                grad.addColorStop(0, `rgba(34, 211, 238, ${p.alpha})`);
                grad.addColorStop(1, 'rgba(34, 211, 238, 0)');

                ctx.beginPath();
                ctx.moveTo(p.x, p.y);
                ctx.lineTo(p.x - p.vx * 10, p.y - p.length);
                ctx.strokeStyle = grad;
                ctx.lineWidth = 2;
                ctx.stroke();

                // Draw bright packet head
                ctx.beginPath();
                ctx.arc(p.x, p.y, 1.5, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(255, 255, 255, ${p.alpha + 0.3})`;
                ctx.fill();
            });
        };

        // Leverage GSAP's optimized ticker
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
