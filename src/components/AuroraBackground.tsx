import { useEffect, useRef } from 'react';
import gsap from 'gsap';

export const AuroraBackground = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d', { alpha: true });
        if (!ctx) return;

        // --- Configuration ---
        const SPACING_X = 25;
        const SPACING_Y = 25;
        const COLORS = ['#06b6d4', '#a855f7']; // Cyan, Violet
        // Store colors in a way that matches our 2-pass strategy (even/odd)

        // Wave parameters (controlled by GSAP)
        const params = {
            time: 0,
            amplitude: 15, // Base amplitude
            frequency: 0.01
        };

        // --- State (Typed Arrays) ---
        // x, y, originalY per particle
        // We separate them into 3 Float32Arrays or one big interleaved one.
        // Interleaved [x, y, originalY, x, y, originalY...] is cache-friendly.
        let positions: Float32Array;
        let count = 0;
        let width = 0;
        let height = 0;

        // --- Initialization ---
        const init = () => {
            width = canvas.width = canvas.clientWidth;
            height = canvas.height = canvas.clientHeight;

            const cols = Math.ceil(width / SPACING_X) + 2;
            const rows = Math.ceil(height / SPACING_Y) + 2;
            count = cols * rows;

            // Allocating space: 3 floats per particle: x, y, originalY
            positions = new Float32Array(count * 3);

            let i = 0;
            for (let x = 0; x < cols; x++) {
                for (let y = 0; y < rows; y++) {
                    const px = x * SPACING_X;
                    const py = y * SPACING_Y;

                    // Index * 3 because of stride
                    const index = i * 3;
                    positions[index] = px;     // x
                    positions[index + 1] = py; // y
                    positions[index + 2] = py; // originalY

                    i++;
                }
            }
        };

        // --- resizing ---
        const handleResize = () => {
            init();
        };

        // --- Mouse Interaction ---
        let mouseTimeout: ReturnType<typeof setTimeout>;

        const onMouseMove = () => {
            // Spike amplitude on move
            gsap.to(params, {
                amplitude: 60, // Higher spike
                duration: 0.5,
                overwrite: true,
                ease: "power2.out"
            });

            if (mouseTimeout) clearTimeout(mouseTimeout);

            mouseTimeout = setTimeout(() => {
                // Return to calm
                gsap.to(params, {
                    amplitude: 15,
                    duration: 2.0,
                    ease: "sine.inOut"
                });
            }, 100);
        };

        // --- Animation Loop ---
        const render = (_time: number, _deltaTime: number, _frame: number) => {
            // GSAP ticker provides time in seconds since start
            // We can use that or accumulate our own.
            // Let's use our param.time which we manually increment for control or just use ticker time?
            // User formula: y = originalY + Math.sin((x * 0.01) + time) * Math.cos((y * 0.01) + time) * amplitude

            // Let's increment our own time for consistent speed control
            params.time += 0.02;

            ctx.clearRect(0, 0, width, height);

            const { amplitude, frequency, time: t } = params;

            // Update Loop - Recalculate Y positions
            for (let i = 0; i < count; i++) {
                const idx = i * 3;
                const x = positions[idx];
                const originalY = positions[idx + 2];

                // Double Sine Math
                // y = originalY + Math.sin((x * 0.01) + time) * Math.cos((y * 0.01) + time) * amplitude
                // Note: originalY is used as 'y' input in the formula for stability? Or current y? 
                // User said: cos((y * 0.01)... usually means the spatial y (originalY), not the animated y.
                const wave = Math.sin((x * frequency) + t) * Math.cos((originalY * frequency) + t) * amplitude;

                positions[idx + 1] = originalY + wave;
            }

            // Render Pass 1: Cyan (Even indices)
            ctx.fillStyle = COLORS[0];
            ctx.beginPath();
            // Optimization: Using rect 2x2 for speed. Arc is slower.
            // User asked for "dots", rects at 2px size look like dots.
            const dotSize = 2;

            for (let i = 0; i < count; i += 2) { // Step by 2
                const idx = i * 3;
                ctx.rect(positions[idx], positions[idx + 1], dotSize, dotSize);
            }
            ctx.fill();

            // Render Pass 2: Violet (Odd indices)
            ctx.fillStyle = COLORS[1];
            ctx.beginPath();
            for (let i = 1; i < count; i += 2) { // Start 1, step by 2
                const idx = i * 3;
                ctx.rect(positions[idx], positions[idx + 1], dotSize, dotSize);
            }
            ctx.fill();
        };

        // Start
        init();
        gsap.ticker.add(render);
        window.addEventListener('resize', handleResize);
        const resizeObserver = new ResizeObserver(() => handleResize());
        resizeObserver.observe(canvas);
        window.addEventListener('mousemove', onMouseMove);

        return () => {
            window.removeEventListener('resize', handleResize);
            resizeObserver.disconnect();
            window.removeEventListener('mousemove', onMouseMove);
            gsap.ticker.remove(render);
            if (mouseTimeout) clearTimeout(mouseTimeout);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className="fixed inset-0 pointer-events-none"
            style={{ zIndex: -1 }}
        />
    );
};
