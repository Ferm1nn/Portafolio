import { useEffect, useRef } from 'react';
import gsap from 'gsap';

interface Hex {
    col: number;
    row: number;
    cx: number;
    cy: number;
    active: number;
    exists: boolean;
}

export function ProjectBackground() {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d', { alpha: true });
        if (!ctx) return;

        let width = 0, height = 0;
        const mouse = { x: -1000, y: -1000 };

        // Hex grid math
        const hexSize = 25;
        const hexWidth = Math.sqrt(3) * hexSize;
        const yOffset = hexSize * 1.5;

        let grid: Hex[] = [];
        let time = 0;

        const resize = () => {
            width = canvas.clientWidth;
            height = canvas.clientHeight;
            canvas.width = width * window.devicePixelRatio;
            canvas.height = height * window.devicePixelRatio;
            ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

            grid = [];
            const cols = Math.ceil(width / hexWidth) + 1;
            const rows = Math.ceil(height / yOffset) + 1;

            for (let r = -1; r < rows; r++) {
                for (let c = -1; c < cols; c++) {
                    const cx = (c + (r % 2 === 0 ? 0 : 0.5)) * hexWidth;
                    const cy = r * yOffset;
                    // Introduce sparsity to make it non-uniform (70% exist)
                    const exists = Math.random() > 0.3;
                    grid.push({ col: c, row: r, cx, cy, active: 0, exists });
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
        };
        window.addEventListener('mousemove', onMouseMove);

        const drawHex = (x: number, y: number, size: number) => {
            ctx.beginPath();
            for (let i = 0; i < 6; i++) {
                const angle_rad = Math.PI / 180 * (60 * i - 30);
                const hx = x + size * Math.cos(angle_rad);
                const hy = y + size * Math.sin(angle_rad);
                if (i === 0) ctx.moveTo(hx, hy);
                else ctx.lineTo(hx, hy);
            }
            ctx.closePath();
        };

        const tick = () => {
            ctx.clearRect(0, 0, width, height);
            time += 0.016; // Simulate delta time

            // 1. Calculate subtle parallax depth offset relative to center
            const pxX = (mouse.x - width / 2) * 0.03;
            const pxY = (mouse.y - height / 2) * 0.03;

            // 2. Draw localized "ping/inspection" effect around cursor
            ctx.beginPath();
            // Ping expanding and contracting subtly based on time
            ctx.arc(mouse.x + pxX, mouse.y + pxY, 120 + Math.sin(time * 2) * 15, 0, Math.PI * 2);
            ctx.strokeStyle = 'rgba(34, 211, 238, 0.08)';
            ctx.lineWidth = 1;
            ctx.stroke();

            // 3. Render Grid
            grid.forEach(h => {
                if (!h.exists) return;

                // Decay active node firing state
                if (h.active > 0) h.active -= 0.015;

                // Apply parallax offset
                const drawX = h.cx + pxX;
                const drawY = h.cy + pxY;

                const dx = mouse.x - drawX;
                const dy = mouse.y - drawY;
                const dist = Math.sqrt(dx * dx + dy * dy);

                let opacity = 0.03; // Base very faint grid
                let lineWidth = 1;
                let strokeColor = `rgba(34, 211, 238, ${opacity})`;

                // Mouse proximity lighting (inspection mode)
                if (dist < 150) {
                    const intensity = 1 - (dist / 150);
                    strokeColor = `rgba(34, 211, 238, ${0.03 + intensity * 0.4})`;
                }

                // If currently "fired" via automated system simulation
                if (h.active > 0) {
                    // Intense cyan glow
                    strokeColor = `rgba(6, 182, 212, ${Math.max(0.1, h.active)})`;
                    lineWidth = 1.5;

                    // Intricate interior pattern for active nodes
                    drawHex(drawX, drawY, hexSize * 0.5 * h.active);
                    ctx.fillStyle = `rgba(34, 211, 238, ${h.active * 0.15})`;
                    ctx.fill();
                    ctx.strokeStyle = strokeColor;
                    ctx.stroke();
                }

                // Draw outer hex
                drawHex(drawX, drawY, hexSize - 1);
                ctx.strokeStyle = strokeColor;
                ctx.lineWidth = lineWidth;
                ctx.stroke();
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
