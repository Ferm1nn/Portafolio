import { useEffect, useRef } from 'react';

interface Hexagon {
    x: number;
    y: number;
    opacity: number;
    isPulsing: boolean;
    pulsePhase: number; // 0 to Math.PI
    pulseSpeed: number;
}

export function HexGridBackground() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    // Store simulation state in refs to avoid re-renders
    const hexsRef = useRef<Hexagon[]>([]);
    const mouseRef = useRef({ x: -1000, y: -1000 });
    const requestRef = useRef<number | null>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Configuration
        const hexRadius = 25; // Adjust for density
        const hexWidth = Math.sqrt(3) * hexRadius;
        const hexHeight = 2 * hexRadius;
        const xSpacing = hexWidth;
        const ySpacing = hexHeight * 0.75;
        // const strokeColor = '34, 211, 238'; // Cyan #22d3ee - Removed unused variable
        const baseOpacity = 0.1;
        const activeOpacity = 1;
        const decayFactor = 0.95; // Custom decay for "slow mo" feel
        const pulseProbability = 0.0005; // Chance per frame per hex to start pulsing

        const initGrid = () => {
            const width = canvas.width;
            const height = canvas.height;
            const cols = Math.ceil(width / xSpacing) + 2;
            const rows = Math.ceil(height / ySpacing) + 2;
            const newHexs: Hexagon[] = [];

            for (let row = 0; row < rows; row++) {
                for (let col = 0; col < cols; col++) {
                    const xOffset = (row % 2) * (hexWidth / 2);
                    const x = col * xSpacing + xOffset - hexWidth;
                    const y = row * ySpacing - hexHeight;

                    newHexs.push({
                        x,
                        y,
                        opacity: baseOpacity,
                        isPulsing: false,
                        pulsePhase: 0,
                        pulseSpeed: 0.02 + Math.random() * 0.03, // Random pulse speeds
                    });
                }
            }
            hexsRef.current = newHexs;
        };

        const drawHex = (ctx: CanvasRenderingContext2D, x: number, y: number, radius: number) => {
            ctx.beginPath();
            for (let i = 0; i < 6; i++) {
                const angle = (Math.PI / 3) * i + Math.PI / 6; // Rotate 30 degrees for flat top/bottom if needed, currently pointy top? 
                // Standard geometric formula:
                // x = r * cos(a)
                // y = r * sin(a)
                // For pointy top: angles are 30, 90, 150... (pi/6, pi/2, ...)
                const px = x + radius * Math.cos(angle);
                const py = y + radius * Math.sin(angle);
                if (i === 0) ctx.moveTo(px, py);
                else ctx.lineTo(px, py);
            }
            ctx.closePath();
            ctx.stroke();
        };

        const render = () => {
            // Clear canvas
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Update and Draw
            // const now = performance.now(); // Removed unused variable

            ctx.lineWidth = 0.5;

            hexsRef.current.forEach((hex) => {
                // 1. Mouse Interaction (Sonar)
                const dx = hex.x - mouseRef.current.x;
                const dy = hex.y - mouseRef.current.y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < 150) {
                    // Immediate light up
                    hex.opacity = activeOpacity;
                    // Cancel pulse if interacted
                    hex.isPulsing = false;
                } else {
                    // 2. Decay Logic
                    if (hex.opacity > baseOpacity) {
                        hex.opacity *= decayFactor;
                        // Clamp to base if close enough
                        if (hex.opacity < baseOpacity + 0.01) hex.opacity = baseOpacity;
                    } else if (hex.opacity < baseOpacity && !hex.isPulsing) {
                        hex.opacity = baseOpacity;
                    }
                }

                // 3. Automatic Pulse
                if (!hex.isPulsing && hex.opacity <= baseOpacity + 0.01) {
                    if (Math.random() < pulseProbability) {
                        hex.isPulsing = true;
                        hex.pulsePhase = 0;
                    }
                }

                if (hex.isPulsing) {
                    hex.pulsePhase += hex.pulseSpeed;
                    // Sine wave for pulse: base + (active - base) * sin(phase)
                    // Actually, simplest is 0 to PI (bump up and down)
                    if (hex.pulsePhase >= Math.PI) {
                        hex.isPulsing = false;
                        hex.opacity = baseOpacity;
                    } else {
                        const pulseIntensity = Math.sin(hex.pulsePhase);
                        // Pulse usually shouldn't be as bright as mouse hover, maybe 0.6?
                        // Or user said "blink on and off", we'll go to 0.6
                        hex.opacity = baseOpacity + (0.6 - baseOpacity) * pulseIntensity;
                    }
                }

                // Apply opacity
                // User wants: stroke thin lines. Base color faint slate/blue (rgba(30, 41, 59, 0.1)).
                // Bright Cyan #22d3ee when active.
                // We can interpolate color or just use Opacity on the Cyan.
                // If we only fade opacity of Cyan, it might look weird if base is slate.
                // Let's draw base grid first? Or just render everything in Cyan with variable opacity?
                // "Base Color: Very faint Slate/Blue... animate its opacity to 1 (Bright Cyan)".
                // This suggests the color changes too.

                // Strategy: 
                // Always draw Cyan, but control Alpha.
                // Base state alpha 0.1 corresponds to the faint look? 
                // Slate/Blue (30,41,59) is dark. Cyan (34,211,238) is bright.
                // I will interpolate manually or just use Cyan for everything but very low opacity?
                // User explicitly asked for Slate/Blue base.
                // So:
                // if opacity <= baseOpacity -> use Slate/Blue (30,41,59) with alpha 0.1?
                // if opacity > baseOpacity -> use Cyan with higher alpha?
                // Implementation:
                // Let's mix colors.

                let r, g, b, a;
                if (hex.opacity <= baseOpacity + 0.001 && !hex.isPulsing) {
                    // Base state
                    r = 30; g = 41; b = 59; a = 0.1;
                } else {
                    // Active state (interpolating is nicer)
                    // t goes from 0 to 1 as opacity goes from base to active
                    const t = Math.min((hex.opacity - baseOpacity) / (activeOpacity - baseOpacity), 1);
                    // Lerp Color
                    // Slate: 30, 41, 59
                    // Cyan: 34, 211, 238
                    r = 30 + (34 - 30) * t;
                    g = 41 + (211 - 41) * t;
                    b = 59 + (238 - 59) * t;
                    a = hex.opacity;
                }

                ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${a})`;
                drawHex(ctx, hex.x, hex.y, hexRadius);
            });

            requestRef.current = requestAnimationFrame(render);
        };

        const handleResize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            initGrid();
        };

        // Initial setup
        handleResize();
        requestRef.current = requestAnimationFrame(render);

        // Event Listeners
        window.addEventListener('resize', handleResize);
        window.addEventListener('mousemove', (e) => {
            // Need mouse pos relative to canvas if canvas is not fixed full screen
            // If canvas is absolute in a relative container, e.clientX might differ if scrolled?
            // User says "calculate distance from cursor".
            // If the grid is "locked in place" (fixed), clientX/Y is fine.
            // If it scrolls, we need relative pos.
            // Let's assume it fills the viewport or we use getBoundingClientRect.
            const rect = canvas.getBoundingClientRect();
            mouseRef.current = {
                x: e.clientX - rect.left,
                y: e.clientY - rect.top
            };
        });

        return () => {
            window.removeEventListener('resize', handleResize);
            // Remove mouse listener? It was window listener.
            // Better to attach mousemove to window to catch fast movements, but coordinate calc needs care.
            // Actually, if we attach to canvas, we miss when mouse leaves canvas?
            // Component specific interactions usually attach to element.
            // "Trigger: On mousemove"
            if (requestRef.current !== null) cancelAnimationFrame(requestRef.current);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className="fixed inset-0 -z-10 pointer-events-none"
        // z-10 to be behind everything. Fixed to viewport. Pointer-events-none allows clicks through.
        />
    );
}
