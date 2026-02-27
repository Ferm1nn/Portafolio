import { useEffect, useRef } from 'react';

export function NetworkBackground() {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        // --- Network Grid Animation (Canvas) ---
        const ctx = canvas.getContext('2d');
        let width: number, height: number;
        let particles: InstanceType<typeof Particle>[] = [];
        let animationFrameId: number;

        // Configuration
        const particleCount = 75;
        const connectionDistance = 150;
        const mouseDistance = 200;

        let mouse = { x: null as number | null, y: null as number | null };

        const handleMouseMove = (e: MouseEvent) => {
            mouse.x = e.clientX;
            mouse.y = e.clientY;
        };

        window.addEventListener('mousemove', handleMouseMove);

        class Particle {
            x: number;
            y: number;
            vx: number;
            vy: number;
            size: number;
            color: string;

            constructor() {
                this.x = Math.random() * width;
                this.y = Math.random() * height;
                this.vx = (Math.random() - 0.5) * 0.5; // Slow movement
                this.vy = (Math.random() - 0.5) * 0.5;
                this.size = Math.random() * 2 + 1;
                this.color = '#06b6d4'; // Cyan
            }

            update() {
                this.x += this.vx;
                this.y += this.vy;

                // Bounce off edges
                if (this.x < 0 || this.x > width) this.vx *= -1;
                if (this.y < 0 || this.y > height) this.vy *= -1;

                // Mouse interaction
                if (mouse.x != null && mouse.y != null) {
                    let dx = mouse.x - this.x;
                    let dy = mouse.y - this.y;
                    let distance = Math.sqrt(dx * dx + dy * dy);
                    if (distance < mouseDistance) {
                        const forceDirectionX = dx / distance;
                        const forceDirectionY = dy / distance;
                        const force = (mouseDistance - distance) / mouseDistance;
                        const directionX = forceDirectionX * force * 0.5;
                        const directionY = forceDirectionY * force * 0.5;
                        this.x -= directionX; // Move slightly away
                        this.y -= directionY;
                    }
                }
            }

            draw() {
                if (!ctx) return;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fillStyle = this.color;
                ctx.globalAlpha = 0.5;
                ctx.fill();
            }
        }

        function initParticles() {
            particles = [];
            for (let i = 0; i < particleCount; i++) {
                particles.push(new Particle());
            }
        }

        function animateCanvas() {
            if (!ctx) return;
            ctx.clearRect(0, 0, width, height);

            // Update and draw particles
            for (let i = 0; i < particles.length; i++) {
                particles[i].update();
                particles[i].draw();

                // Draw connections
                for (let j = i; j < particles.length; j++) {
                    let dx = particles[i].x - particles[j].x;
                    let dy = particles[i].y - particles[j].y;
                    let distance = Math.sqrt(dx * dx + dy * dy);

                    if (distance < connectionDistance) {
                        ctx.beginPath();
                        ctx.strokeStyle = `rgba(6, 182, 212, ${1 - distance / connectionDistance})`; // Cyan with fade
                        ctx.lineWidth = 1;
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.stroke();
                    }
                }
            }
            animationFrameId = requestAnimationFrame(animateCanvas);
        }

        function resize() {
            if (!canvas) return;
            // Use canvas.clientWidth/clientHeight instead of window.innerWidth/innerHeight.
            // On real mobile browsers, window.innerHeight can include browser chrome (address bar),
            // making the canvas taller than the visible viewport and causing vertical stretching.
            // clientWidth/clientHeight reflect the actual CSS-rendered size of the element.
            width = canvas.clientWidth;
            height = canvas.clientHeight;
            canvas.width = width;
            canvas.height = height;
            initParticles();
        }

        // Start Canvas
        resize();
        animateCanvas();

        // ResizeObserver is more reliable than the 'resize' event on mobile,
        // as it fires whenever the element's layout size changes (e.g., when
        // the browser address bar appears/disappears on scroll).
        const resizeObserver = new ResizeObserver(() => resize());
        resizeObserver.observe(canvas);
        window.addEventListener('resize', resize);

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('resize', resize);
            resizeObserver.disconnect();
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            id="network-canvas"
            className="fixed top-0 left-0 w-full h-full pointer-events-none"
            style={{ zIndex: 0, background: '#020617' }}
        />
    );
}
