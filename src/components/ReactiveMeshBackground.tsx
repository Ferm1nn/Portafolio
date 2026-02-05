import { useEffect, useRef } from 'react';
import gsap from 'gsap';

/**
 * DEEP ARCHITECTURAL ANALYSIS
 * 
 * 1. Physics (Magnetic Repulsion & Springs):
 *    - To simulate "magnetic repulsion" efficiently, we calculate the vector distance 
 *      between the mouse and each node. If within a threshold radius, we apply a 
 *      velocity vector moving AWAY from the mouse center.
 *    - To maintain the grid structure, we apply a "Spring Force" (Hooke's Law) 
 *      pulling each node back to its `originalX` and `originalY`.
 *    - Velocity is dampened (friction) every frame to prevent infinite oscillation.
 * 
 * 2. Performance (Float32Array & Batching):
 *    - Object Arrays (e.g., Array<{x, y}>) cause massive Garbage Collection overhead 
 *      at 60fps with 2000+ points.
 *    - Float32Array stores raw binary data. We use a "Stride" of 6: 
 *      [x, y, originalX, originalY, vx, vy] repeated for every point.
 *    - Batch Rendering: Context switches (changing color, linewidth) are the bottleneck.
 *      We perform ONE `ctx.stroke()` call for all grid lines by building a single 
 *      huge path. This reduces draw calls from ~4000 to 1.
 * 
 * 3. Aesthetics (Dormant to Active):
 *    - We use a central `mouseEnergy` float (0 to 1) controlled by GSAP.
 *    - Colors are interpolated based on two factors:
 *      a) Global `mouseEnergy` (dims/brightens the whole system).
 *      b) Local `displacement` (how far a point is from its origin).
 *    - High displacement = Cyan/Violet glow. Low displacement = Dark Blue.
 */

export const ReactiveMeshBackground = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d', { alpha: true });
        if (!ctx) return;

        // --- Configuration ---
        const CONFIG = {
            SPACING: 40,
            CONNECTION_DIST: 45, // Slightly larger than spacing to ensure diagonals or flex don't break
            MOUSE_RADIUS: 200,
            REPULSION_STRENGTH: 2.0,
            SPRING_STRENGTH: 0.05,
            FRICTION: 0.90,
            // Colors
            COLOR_DORMANT: { r: 15, g: 23, b: 42 }, // Dark slate
            COLOR_ACTIVE: { r: 6, g: 182, b: 212 }, // Cyan
            COLOR_HOT: { r: 168, g: 85, b: 247 },   // Violet
        };

        // --- State ---
        let width = 0;
        let height = 0;
        let cols = 0;
        let rows = 0;
        let count = 0;

        // Physics Data: Stride = 6 [x, y, ox, oy, vx, vy]
        let data: Float32Array;
        // Density Data: Stride = 1 [density] (0.0 to 1.0)
        let densities: Float32Array;

        const mouse = { x: -1000, y: -1000 };
        const state = { energy: 0 }; // 0 = Dormant, 1 = Awake

        // --- Initialization ---
        const init = () => {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;

            cols = Math.ceil(width / CONFIG.SPACING) + 1;
            rows = Math.ceil(height / CONFIG.SPACING) + 1;
            count = cols * rows;

            data = new Float32Array(count * 6);
            densities = new Float32Array(count);

            let i = 0;
            for (let y = 0; y < rows; y++) {
                for (let x = 0; x < cols; x++) {
                    const px = x * CONFIG.SPACING;
                    const py = y * CONFIG.SPACING;

                    const idx = i * 6;
                    data[idx] = px;      // x
                    data[idx + 1] = py;  // y
                    data[idx + 2] = px;  // ox
                    data[idx + 3] = py;  // oy
                    data[idx + 4] = 0;   // vx
                    data[idx + 5] = 0;   // vy

                    // Random density for sparse topology
                    densities[i] = Math.random();

                    i++;
                }
            }
        };

        // --- Interaction ---
        const onMouseMove = (e: MouseEvent) => {
            mouse.x = e.clientX;
            mouse.y = e.clientY;
            // Ensure system wakes up if mouse is moving, even if mouseenter didn't fire
            gsap.to(state, { energy: 1, duration: 0.5, ease: "power2.out", overwrite: true });
        };

        const onMouseEnter = () => {
            gsap.to(state, { energy: 1, duration: 0.5, ease: "power2.out" });
        };

        const onMouseLeave = () => {
            gsap.to(state, { energy: 0, duration: 1.5, ease: "power2.out" });
            mouse.x = -1000;
            mouse.y = -1000;
        };

        // --- Helpers ---
        // Fast color interpolation (Lerp)
        const lerp = (start: number, end: number, t: number) => start + (end - start) * t;

        // --- Render Loop ---
        const render = () => {
            ctx.clearRect(0, 0, width, height);

            // 1. UPDATE PHYSICS
            // -----------------
            for (let i = 0; i < count; i++) {
                const idx = i * 6;
                const x = data[idx];
                const y = data[idx + 1];
                const ox = data[idx + 2];
                const oy = data[idx + 3];
                // vx, vy at +4, +5

                // Mouse Repulsion
                const dx = x - mouse.x;
                const dy = y - mouse.y;
                // Optimization: Squared distance check avoids sqrt unless necessary
                const distSq = dx * dx + dy * dy;
                const radiusSq = CONFIG.MOUSE_RADIUS * CONFIG.MOUSE_RADIUS;

                if (state.energy > 0.01 && distSq < radiusSq) {
                    const dist = Math.sqrt(distSq);
                    const force = (1 - dist / CONFIG.MOUSE_RADIUS) * CONFIG.REPULSION_STRENGTH * state.energy;

                    // Apply repulsion vector
                    // Note: using (dx/dist) normalizes the vector
                    const fx = (dx / dist) * force;
                    const fy = (dy / dist) * force;

                    data[idx + 4] += fx;
                    data[idx + 5] += fy;
                }

                // Spring Return
                const springX = (ox - x) * CONFIG.SPRING_STRENGTH;
                const springY = (oy - y) * CONFIG.SPRING_STRENGTH;

                data[idx + 4] += springX;
                data[idx + 5] += springY;

                // Friction / Damping
                data[idx + 4] *= CONFIG.FRICTION;
                data[idx + 5] *= CONFIG.FRICTION;

                // Apply Velocity
                data[idx] += data[idx + 4];
                data[idx + 1] += data[idx + 5];
            }

            // 2. BATCH DRAW CONNECTIONS (The Mesh)
            // ------------------------------------
            // We draw all grid lines in ONE path for performance.
            // "Sparse & Breathing" Logic:
            // - Check density to skip lines (Sparsity)
            // - Modulate opacity with sine wave (Breathing)
            // - BUT if mouse is near (Active), force draw everything locally.

            const time = gsap.ticker.time; // Current time in seconds

            ctx.lineWidth = 1;

            // Implementation of Bucketed Batching
            // We'll use 5 paths for different "shimmer phases"
            const paths = [
                new Path2D(), new Path2D(), new Path2D(), new Path2D(), new Path2D()
            ];

            for (let y = 0; y < rows; y++) {
                for (let x = 0; x < cols; x++) {
                    const i = y * cols + x;
                    const idx = i * 6;

                    const density = densities[i];

                    // Interaction/Active Check
                    // We want to force draw if active. 
                    // Let's use the mouse distance check again for the "Active" override.
                    const px = data[idx];
                    const py = data[idx + 1];
                    const dx = px - mouse.x;
                    const dy = py - mouse.y;
                    const distSq = dx * dx + dy * dy;

                    // If active (energy > 0) and close to mouse, ignore sparsity
                    const isActive = state.energy > 0.01 && distSq < (CONFIG.MOUSE_RADIUS * CONFIG.MOUSE_RADIUS);

                    if (density > 0.5 || isActive) {
                        const rightIdx = (i + 1) * 6;
                        const downIdx = (i + cols) * 6;

                        // Pick a bucket based on index to randomize phase
                        const bucket = i % 5;
                        const path = paths[bucket];

                        // Draw Right
                        if (x < cols - 1) {
                            path.moveTo(px, py);
                            path.lineTo(data[rightIdx], data[rightIdx + 1]);
                        }
                        // Draw Down
                        if (y < rows - 1) {
                            path.moveTo(px, py);
                            path.lineTo(data[downIdx], data[downIdx + 1]);
                        }
                    }
                }
            }

            // Stroke the batches with oscillating opacity
            for (let j = 0; j < 5; j++) {
                // Phase shift per bucket
                const phase = j * (Math.PI / 5) * 2;
                // breathing: base 0.15 + sine * 0.05
                // Using a slow time factor
                const alpha = 0.15 + Math.sin(time * 2 + phase) * 0.05;

                // Color: Dark Slate standard, but we need to respect the RGB
                ctx.strokeStyle = `rgba(${CONFIG.COLOR_DORMANT.r}, ${CONFIG.COLOR_DORMANT.g}, ${CONFIG.COLOR_DORMANT.b}, ${alpha})`;
                ctx.stroke(paths[j]);
            }

            // ------------------------------------

            // 3. DRAW MAJOR NODES (The "Servers")
            // -----------------------------------

            ctx.fillStyle = `rgba(${CONFIG.COLOR_ACTIVE.r}, ${CONFIG.COLOR_ACTIVE.g}, ${CONFIG.COLOR_ACTIVE.b}, 0.3)`;
            // We can batch these rects too
            ctx.beginPath();

            for (let i = 0; i < count; i++) {
                if (densities[i] > 0.9) {
                    const idx = i * 6;
                    const x = data[idx];
                    const y = data[idx + 1];

                    // 2x2 square
                    ctx.rect(x - 1, y - 1, 2, 2);
                }
            }
            ctx.fill();

            // 4. DRAW ACTIVE NODES (The Neurons)
            if (state.energy > 0.01) {
                for (let i = 0; i < count; i++) {
                    const idx = i * 6;
                    const x = data[idx];
                    const y = data[idx + 1];
                    const ox = data[idx + 2];
                    const oy = data[idx + 3];

                    // Displacement Magnitude
                    const ddx = x - ox;
                    const ddy = y - oy;
                    const displacement = Math.sqrt(ddx * ddx + ddy * ddy);

                    // Only draw if displaced or close to mouse (optimization)
                    if (displacement > 0.5) {
                        // Color Logic
                        const intensity = Math.min(displacement / 40, 1);
                        const alpha = intensity * state.energy;
                        const size = 1 + intensity * 2;

                        let r, g, b;
                        if (intensity > 0.8) {
                            r = CONFIG.COLOR_HOT.r;
                            g = CONFIG.COLOR_HOT.g;
                            b = CONFIG.COLOR_HOT.b;
                        } else {
                            r = CONFIG.COLOR_ACTIVE.r;
                            g = CONFIG.COLOR_ACTIVE.g;
                            b = CONFIG.COLOR_ACTIVE.b;
                        }

                        ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${alpha})`;
                        ctx.beginPath();
                        ctx.arc(x, y, size, 0, Math.PI * 2);
                        ctx.fill();
                    }
                }
            }
        };

        // --- Lifecycle ---
        init();
        gsap.ticker.add(render);

        window.addEventListener('resize', init);
        window.addEventListener('mousemove', onMouseMove);
        // Bind enter/leave to document or window? Usually specific element is better, 
        // but component covers full screen?
        // User requested "On mouse enter/leave". Assuming Window for full page background.
        document.addEventListener('mouseenter', onMouseEnter);
        document.addEventListener('mouseleave', onMouseLeave);

        return () => {
            window.removeEventListener('resize', init);
            window.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('mouseenter', onMouseEnter);
            document.removeEventListener('mouseleave', onMouseLeave);
            gsap.ticker.remove(render);
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
