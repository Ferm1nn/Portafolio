import { useRef, useEffect } from 'react';
import gsap from 'gsap';

interface Traveler {
    x: number;
    y: number;
    vx: number;
    vy: number;
    baseSpeed: number;
    color: string;
}

export function CircuitBackground() {
    const bgCanvasRef = useRef<HTMLCanvasElement>(null);
    const uiCanvasRef = useRef<HTMLCanvasElement>(null);
    const mouseRef = useRef({ x: -1000, y: -1000 });

    useEffect(() => {
        const bgCanvas = bgCanvasRef.current;
        const uiCanvas = uiCanvasRef.current;

        if (!bgCanvas || !uiCanvas) return;

        const bgCtx = bgCanvas.getContext('2d');
        const uiCtx = uiCanvas.getContext('2d');

        if (!bgCtx || !uiCtx) return;

        const travelers: Traveler[] = [];
        const gridSize = 30;
        const baseVal = 2;
        const turnChance = 0.05;
        const maxTravelers = 40;
        const connectionRadius = 120;

        // Resize handler for both canvases
        const resize = () => {
            bgCanvas.width = window.innerWidth;
            bgCanvas.height = window.innerHeight;
            uiCanvas.width = window.innerWidth;
            uiCanvas.height = window.innerHeight;
        };
        window.addEventListener('resize', resize);
        resize();

        const handleMouseMove = (e: MouseEvent) => {
            mouseRef.current.x = e.clientX;
            mouseRef.current.y = e.clientY;
        };
        window.addEventListener('mousemove', handleMouseMove);

        const spawnTraveler = (): Traveler => {
            const cols = Math.floor(bgCanvas.width / gridSize);
            const rows = Math.floor(bgCanvas.height / gridSize);

            const x = Math.floor(Math.random() * cols) * gridSize;
            const y = Math.floor(Math.random() * rows) * gridSize;

            const isHorizontal = Math.random() > 0.5;
            const vx = isHorizontal ? (Math.random() > 0.5 ? baseVal : -baseVal) : 0;
            const vy = !isHorizontal ? (Math.random() > 0.5 ? baseVal : -baseVal) : 0;

            return {
                x,
                y,
                vx,
                vy,
                baseSpeed: baseVal,
                color: '#22d3ee', // Default Bright Cyan
            };
        };

        for (let i = 0; i < maxTravelers; i++) {
            if (bgCanvas.width > 0 && bgCanvas.height > 0) {
                travelers.push(spawnTraveler());
            }
        }

        const tick = () => {
            // --- LAYER 1: BACKGROUND (Trails) ---
            // Use fillRect fade hack only on background canvas
            bgCtx.fillStyle = 'rgba(2, 6, 23, 0.1)';
            bgCtx.fillRect(0, 0, bgCanvas.width, bgCanvas.height);

            // --- LAYER 2: UI (Interaction) ---
            // Clear UI canvas explicitly every frame
            uiCtx.clearRect(0, 0, uiCanvas.width, uiCanvas.height);

            // Respawn logic
            if (travelers.length < maxTravelers) {
                travelers.push(spawnTraveler());
            }

            for (let i = 0; i < travelers.length; i++) {
                const t = travelers[i];

                // --- PHYSICS ---
                const dx = t.x - mouseRef.current.x;
                const dy = t.y - mouseRef.current.y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                let multiplier = 1;
                let pColor = '#22d3ee';

                if (dist < connectionRadius) {
                    multiplier = 2; // Surge Speed
                    pColor = '#ffffff'; // White Surge

                    // Draw Connection on UI Layer (Transient)
                    uiCtx.beginPath();
                    uiCtx.moveTo(mouseRef.current.x, mouseRef.current.y);
                    uiCtx.lineTo(t.x, t.y);
                    uiCtx.strokeStyle = `rgba(255, 255, 255, ${0.4 * (1 - dist / connectionRadius)})`;
                    uiCtx.lineWidth = 0.5;
                    uiCtx.stroke();
                }

                // Move
                const moveX = t.vx * multiplier;
                const moveY = t.vy * multiplier;

                t.x += moveX;
                t.y += moveY;

                // Turn Logic
                if (Math.abs(t.x) % gridSize < Math.abs(moveX) && Math.abs(t.y) % gridSize < Math.abs(moveY)) {
                    if (Math.random() < turnChance) {
                        if (t.vx !== 0) {
                            t.vx = 0;
                            t.vy = Math.random() > 0.5 ? baseVal : -baseVal;
                        } else {
                            t.vy = 0;
                            t.vx = Math.random() > 0.5 ? baseVal : -baseVal;
                        }
                    }
                }

                // Reset
                if (t.x < 0 || t.x > bgCanvas.width || t.y < 0 || t.y > bgCanvas.height) {
                    const newT = spawnTraveler();
                    t.x = newT.x;
                    t.y = newT.y;
                    t.vx = newT.vx;
                    t.vy = newT.vy;
                }

                // Draw Particle Head on Background Layer (so it leaves trails when moving)
                bgCtx.fillStyle = pColor;
                bgCtx.shadowBlur = dist < connectionRadius ? 15 : 5; // Glow
                bgCtx.shadowColor = pColor;
                bgCtx.fillRect(t.x, t.y, 2, 2);
                bgCtx.shadowBlur = 0;
            }
        };

        gsap.ticker.add(tick);

        return () => {
            window.removeEventListener('resize', resize);
            window.removeEventListener('mousemove', handleMouseMove);
            gsap.ticker.remove(tick);
        };
    }, []);

    return (
        <>
            {/* Layer 1: Persistent Background (Trails) */}
            <canvas
                ref={bgCanvasRef}
                style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: '100vw',
                    height: '100vh',
                    zIndex: -2, // Behind UI layer
                    pointerEvents: 'none',
                    opacity: 1,
                    backgroundColor: '#020617',
                }}
            />
            {/* Layer 2: Transient UI (Lines) */}
            <canvas
                ref={uiCanvasRef}
                style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: '100vw',
                    height: '100vh',
                    zIndex: -1, // On top of background
                    pointerEvents: 'none',
                    background: 'transparent', // Clear background for overlay
                }}
            />
        </>
    );
}
