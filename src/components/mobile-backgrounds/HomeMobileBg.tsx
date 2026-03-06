import { useEffect, useRef } from 'react';

/**
 * HomeMobileBg — Mobile-adapted replica of HomeBackground.
 *
 * Same canvas particle-network animation, tuned for mobile:
 *   • 30 particles (vs 75 desktop)
 *   • connectionDistance 100 (vs 150)
 *   • Slower movement ±0.3 (vs ±0.5)
 *   • Smaller particle size
 *   • No mouse interaction (irrelevant on touch)
 *
 * Scroll-safe: No ResizeObserver, no window resize listener.
 * Canvas dimensions are locked at mount using screen.availHeight
 * to avoid address bar height fluctuations. Only orientationchange
 * triggers a true re-layout.
 */
export function HomeMobileBg() {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let width = 0;
        let height = 0;
        let animationFrameId: number;

        // Mobile-tuned configuration
        const particleCount = 30;
        const connectionDistance = 100;

        interface ParticleData {
            x: number;
            y: number;
            vx: number;
            vy: number;
            size: number;
        }

        const particles: ParticleData[] = [];

        function initParticles() {
            particles.length = 0;
            for (let i = 0; i < particleCount; i++) {
                particles.push({
                    x: Math.random() * width,
                    y: Math.random() * height,
                    vx: (Math.random() - 0.5) * 0.3,
                    vy: (Math.random() - 0.5) * 0.3,
                    size: Math.random() * 1.5 + 0.5,
                });
            }
        }

        function setCanvasSize() {
            // Use window.innerWidth for width (stable on mobile)
            // Use screen.availHeight for height — this is the FULL screen
            // height and does NOT change when the address bar hides/shows,
            // preventing all scroll-related resize jank.
            width = window.innerWidth;
            height = Math.max(window.innerHeight, screen.availHeight || window.innerHeight);
            canvas.width = width;
            canvas.height = height;
        }

        function handleOrientationChange() {
            setCanvasSize();
            // Reposition particles proportionally
            for (const p of particles) {
                p.x = Math.random() * width;
                p.y = Math.random() * height;
            }
        }

        // Initial setup
        setCanvasSize();
        initParticles();

        function animateCanvas() {
            if (!ctx) return;
            ctx.clearRect(0, 0, width, height);

            for (let i = 0; i < particles.length; i++) {
                const p = particles[i];
                p.x += p.vx;
                p.y += p.vy;

                if (p.x < 0 || p.x > width) p.vx *= -1;
                if (p.y < 0 || p.y > height) p.vy *= -1;

                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                ctx.fillStyle = '#06b6d4';
                ctx.globalAlpha = 0.5;
                ctx.fill();

                for (let j = i + 1; j < particles.length; j++) {
                    const q = particles[j];
                    const dx = p.x - q.x;
                    const dy = p.y - q.y;
                    const distance = Math.sqrt(dx * dx + dy * dy);

                    if (distance < connectionDistance) {
                        ctx.beginPath();
                        ctx.strokeStyle = `rgba(6, 182, 212, ${1 - distance / connectionDistance})`;
                        ctx.globalAlpha = 1;
                        ctx.lineWidth = 1;
                        ctx.moveTo(p.x, p.y);
                        ctx.lineTo(q.x, q.y);
                        ctx.stroke();
                    }
                }
            }
            ctx.globalAlpha = 1;
            animationFrameId = requestAnimationFrame(animateCanvas);
        }

        animateCanvas();

        // Only re-layout on orientation change (not scroll-driven resizes)
        window.addEventListener('orientationchange', handleOrientationChange);

        return () => {
            window.removeEventListener('orientationchange', handleOrientationChange);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            id="mobile-network-canvas"
            className="fixed top-0 left-0 pointer-events-none"
            style={{ zIndex: 0, background: '#020617', width: '100vw', height: '100vh' }}
        />
    );
}
