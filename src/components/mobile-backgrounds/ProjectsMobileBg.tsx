import { useEffect, useRef } from 'react';
import gsap from 'gsap';

/**
 * ProjectsMobileBg — Mobile-adapted replica of ProjectBackground (HexGrid).
 *
 * Same hex-grid canvas animation, tuned for mobile:
 *   • hexSize 18 (vs 25 desktop)
 *   • No mouse parallax or proximity lighting
 *   • Keeps automated node firing and grid rendering
 *
 * Scroll-safe: No ResizeObserver, no window resize listener.
 * Canvas locked at mount via screen.availHeight + inline 100vw×100vh CSS.
 * Only orientationchange triggers re-layout.
 */

interface Hex {
    col: number;
    row: number;
    cx: number;
    cy: number;
    active: number;
    exists: boolean;
}

export function ProjectsMobileBg() {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d', { alpha: true });
        if (!ctx) return;

        let width = 0, height = 0;

        const hexSize = 18;
        const hexWidth = Math.sqrt(3) * hexSize;
        const yOffset = hexSize * 1.5;

        let grid: Hex[] = [];
        let time = 0;

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

        function buildGrid() {
            grid = [];
            const cols = Math.ceil(width / hexWidth) + 1;
            const rows = Math.ceil(height / yOffset) + 1;

            for (let r = -1; r < rows; r++) {
                for (let c = -1; c < cols; c++) {
                    const cx = (c + (r % 2 === 0 ? 0 : 0.5)) * hexWidth;
                    const cy = r * yOffset;
                    const exists = Math.random() > 0.3;
                    grid.push({ col: c, row: r, cx, cy, active: 0, exists });
                }
            }
        }

        function handleOrientationChange() {
            setCanvasSize();
            buildGrid();
        }

        // Initial setup
        setCanvasSize();
        buildGrid();

        const drawHex = (x: number, y: number, size: number) => {
            ctx.beginPath();
            for (let i = 0; i < 6; i++) {
                const angle_rad = (Math.PI / 180) * (60 * i - 30);
                const hx = x + size * Math.cos(angle_rad);
                const hy = y + size * Math.sin(angle_rad);
                if (i === 0) ctx.moveTo(hx, hy);
                else ctx.lineTo(hx, hy);
            }
            ctx.closePath();
        };

        const tick = () => {
            ctx.clearRect(0, 0, width, height);
            time += 0.016;

            // 1. Calculate subtle parallax depth offset relative to center (only while touching)
            const pxX = isTouching ? (touch.x - width / 2) * 0.02 : 0;
            const pxY = isTouching ? (touch.y - height / 2) * 0.02 : 0;

            // 2. Localized ping effect around touch
            if (isTouching) {
                ctx.beginPath();
                ctx.arc(touch.x + pxX, touch.y + pxY, 100 + Math.sin(time * 2) * 10, 0, Math.PI * 2);
                ctx.strokeStyle = 'rgba(34, 211, 238, 0.08)';
                ctx.lineWidth = 1;
                ctx.stroke();
            }

            grid.forEach((h) => {
                if (!h.exists) return;

                if (h.active > 0) h.active -= 0.003;

                const drawX = h.cx + pxX;
                const drawY = h.cy + pxY;

                let strokeColor = 'rgba(34, 211, 238, 0.03)';
                let lineWidth = 1;

                if (isTouching) {
                    const dx = touch.x - drawX;
                    const dy = touch.y - drawY;
                    const dist = Math.sqrt(dx * dx + dy * dy);

                    if (dist < 120) {
                        const intensity = 1 - (dist / 120);
                        strokeColor = `rgba(34, 211, 238, ${0.03 + intensity * 0.4})`;
                    }
                }

                // Automated ambient pulse
                if (h.active <= 0 && Math.random() < 0.00005) {
                    h.active = 1;
                }

                if (h.active > 0) {
                    strokeColor = `rgba(6, 182, 212, ${Math.max(0.1, h.active)})`;
                    lineWidth = 1.5;

                    drawHex(drawX, drawY, hexSize * 0.5 * h.active);
                    ctx.fillStyle = `rgba(34, 211, 238, ${h.active * 0.15})`;
                    ctx.fill();
                    ctx.strokeStyle = strokeColor;
                    ctx.stroke();
                }

                drawHex(drawX, drawY, hexSize - 1);
                ctx.strokeStyle = strokeColor;
                ctx.lineWidth = lineWidth;
                ctx.stroke();
            });
        };

        const handleTouchMove = (e: TouchEvent) => {
            if (e.touches.length > 0) {
                touch.x = e.touches[0].clientX;
                touch.y = e.touches[0].clientY;
                isTouching = true;
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
