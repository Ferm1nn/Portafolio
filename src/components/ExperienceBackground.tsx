import { useEffect, useRef } from 'react';

interface DropAgent {
    x: number;
    y: number;
    speed: number;
    length: number;
    active: boolean;
    columnCurrent: number; // Index of the column it's actively falling down
}

export default function ExperienceBackground() {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let animationFrameId: number;
        let width = canvas.clientWidth;
        let height = canvas.clientHeight;

        // Configuration
        const COLUMN_SPACING = 50; // px
        const LINE_COLOR = '#06b6d4';
        const LINE_OPACITY = 0.03;
        const DROP_HEAD_COLOR = '#22d3ee'; // Brighter cyan
        const POOL_SIZE = 60;

        // State
        let columns: number[] = []; // x-coordinates of vertical lines
        const drops: DropAgent[] = [];

        // Pulse state
        let pulseActive = false;
        let pulseColumnIndex = -1;
        let pulseOpacity = 0;

        // Resize Handler
        const handleResize = () => {
            width = canvas.clientWidth;
            height = canvas.clientHeight;
            canvas.width = width;
            canvas.height = height;

            // Recalculate columns
            columns = [];
            const numColumns = Math.ceil(width / COLUMN_SPACING);
            for (let i = 0; i < numColumns; i++) {
                columns.push(i * COLUMN_SPACING + (COLUMN_SPACING / 2));
            }
        };

        // Initialize Drops (Object Pool)
        const initDrops = () => {
            for (let i = 0; i < POOL_SIZE; i++) {
                drops.push({
                    x: 0,
                    y: height + 100, // Start off-screen
                    speed: 0,
                    length: 0,
                    active: false,
                    columnCurrent: -1
                });
            }
        };

        // Spawn a drop
        const spawnDrop = () => {
            // Find inactive drop
            const drop = drops.find(d => !d.active);
            if (drop && columns.length > 0) {
                const colIdx = Math.floor(Math.random() * columns.length);

                drop.active = true;
                drop.columnCurrent = colIdx;
                drop.x = columns[colIdx];
                drop.y = -Math.random() * 200 - 100; // Start slightly above screen
                drop.speed = Math.random() * 10 + 5; // Fast! 5-15px per frame
                drop.length = Math.random() * 100 + 50; // 50-150px long
            }
        };

        // Main Draw Loop
        const render = () => {
            // Clear
            ctx.clearRect(0, 0, width, height);

            // 1. Draw Static Layer (Cables)
            ctx.beginPath();
            ctx.strokeStyle = LINE_COLOR;
            ctx.lineWidth = 1;

            // Batch draw all lines for performance
            // We set global alpha once
            ctx.globalAlpha = LINE_OPACITY;

            for (const x of columns) {
                ctx.moveTo(x, 0);
                ctx.lineTo(x, height);
            }
            ctx.stroke();

            // 2. Pulse Interaction
            // 1% chance per frame to start a pulse if none active
            if (!pulseActive && Math.random() < 0.01) {
                pulseActive = true;
                pulseColumnIndex = Math.floor(Math.random() * columns.length);
                pulseOpacity = 0.2; // Max brightness
            }

            if (pulseActive && pulseColumnIndex !== -1) {
                const x = columns[pulseColumnIndex];
                ctx.beginPath();
                ctx.strokeStyle = LINE_COLOR;
                ctx.lineWidth = 2; // Slightly thicker
                ctx.globalAlpha = pulseOpacity;
                ctx.moveTo(x, 0);
                ctx.lineTo(x, height);
                ctx.stroke();

                // Fade out
                pulseOpacity -= 0.005;
                if (pulseOpacity <= 0) {
                    pulseActive = false;
                    pulseColumnIndex = -1;
                }
            }

            // 3. Draw Active Layer (Data Drops)
            // Occasionally spawn new drops
            if (Math.random() < 0.05) { // 5% chance per frame
                spawnDrop();
            }

            // Reset styles for drops
            ctx.lineWidth = 2;

            drops.forEach(drop => {
                if (!drop.active) return;

                // Update position
                drop.y += drop.speed;

                // Deactivate if off-screen (bottom)
                if (drop.y - drop.length > height) {
                    drop.active = false;
                    return;
                }

                // Draw gradient tail
                // Head is at (drop.x, drop.y)
                // Tail ends at (drop.x, drop.y - drop.length)
                const gradient = ctx.createLinearGradient(drop.x, drop.y, drop.x, drop.y - drop.length);
                gradient.addColorStop(0, DROP_HEAD_COLOR); // Head (Bright)
                gradient.addColorStop(0.1, DROP_HEAD_COLOR);
                gradient.addColorStop(1, 'rgba(6, 182, 212, 0)'); // Tail (Transparent)

                ctx.globalAlpha = 1; // Handled by gradient
                ctx.strokeStyle = gradient;
                ctx.beginPath();
                ctx.moveTo(drop.x, drop.y);
                ctx.lineTo(drop.x, drop.y - drop.length);
                ctx.stroke();
            });

            animationFrameId = requestAnimationFrame(render);
        };

        // Initialize
        handleResize();
        initDrops();
        render();

        window.addEventListener('resize', handleResize);
        const resizeObserver = new ResizeObserver(() => handleResize());
        resizeObserver.observe(canvas);

        return () => {
            window.removeEventListener('resize', handleResize);
            resizeObserver.disconnect();
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className="fixed inset-0 pointer-events-none"
            style={{
                zIndex: -1,
                background: 'var(--bg)', // Opaque to hide global background
            }}
        />
    );
}
