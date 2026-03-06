import { useEffect, useRef } from 'react';
import gsap from 'gsap';

interface Node {
    xRatio: number;
    yRatio: number;
    x: number;
    y: number;
}

interface Line {
    id: number;
    side: 'left' | 'right';
    nodes: Node[];
    targetAlpha: number;
    currentAlpha: number;
}

interface Payload {
    lineId: number;
    progress: number;
    speed: number;
}

/**
 * ExperienceMobileBg — Mobile-adapted replica of ExperienceBackground.
 *
 * Scroll-safe: No ResizeObserver, no window resize listener.
 * Canvas locked at mount via screen.availHeight + inline 100vw×100vh CSS.
 * Only orientationchange triggers re-layout.
 */
export function ExperienceMobileBg() {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d', { alpha: true });
        if (!ctx) return;

        let width = 0, height = 0;
        const lines: Line[] = [];
        const payloads: Payload[] = [];
        const numLinesPerSide = 3;
        const numSegments = 6;

        const buildTopology = () => {
            lines.length = 0;

            for (let i = 0; i < numLinesPerSide; i++) {
                const leftNodes: Node[] = [];
                const rightNodes: Node[] = [];

                let currentXRatio = 0.05 + (i / (numLinesPerSide - 1)) * 0.15;

                for (let j = 0; j <= numSegments; j++) {
                    if (j > 0 && j < numSegments && Math.random() < 0.35) {
                        const step = Math.random() < 0.5 ? -1 : 1;
                        const neighborIdx = i + step;
                        if (neighborIdx >= 0 && neighborIdx < numLinesPerSide) {
                            currentXRatio = 0.05 + (neighborIdx / (numLinesPerSide - 1)) * 0.15;
                        }
                    }

                    const jitterX = (Math.random() - 0.5) * 0.06;
                    const xRatioLeft = currentXRatio + jitterX;

                    leftNodes.push({ xRatio: xRatioLeft, yRatio: j / numSegments, x: 0, y: 0 });
                    rightNodes.push({ xRatio: 1 - xRatioLeft, yRatio: j / numSegments, x: 0, y: 0 });
                }

                lines.push({ id: i, side: 'left', nodes: leftNodes, targetAlpha: 0.15, currentAlpha: 0.15 });
                lines.push({ id: i + numLinesPerSide, side: 'right', nodes: rightNodes, targetAlpha: 0.15, currentAlpha: 0.15 });
            }
        };

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

        function applyNodePositions() {
            lines.forEach(line => {
                line.nodes.forEach(node => {
                    node.x = node.xRatio * width;
                    node.y = node.yRatio * height;
                });
            });
        }

        function handleOrientationChange() {
            setCanvasSize();
            applyNodePositions();
        }

        // Initial setup
        setCanvasSize();
        buildTopology();
        applyNodePositions();

        function getPointAtProgress(prog: number, line: Line) {
            const numSegs = line.nodes.length - 1;
            let tTotal = prog * numSegs;
            let segment = Math.floor(tTotal);

            if (segment >= numSegs) { segment = numSegs - 1; tTotal = numSegs; }
            if (segment < 0) { segment = 0; tTotal = 0; }

            let t = tTotal - segment;
            if (prog >= 1.0) t = 1.0;
            if (prog <= 0.0) t = 0.0;

            const p0 = line.nodes[segment];
            const p1 = line.nodes[segment + 1];

            const cp1 = { x: p0.x, y: p0.y + (p1.y - p0.y) / 2 };
            const cp2 = { x: p1.x, y: p1.y - (p1.y - p0.y) / 2 };

            const u = 1 - t;
            const tt = t * t;
            const uu = u * u;
            const uuu = uu * u;
            const ttt = tt * t;

            const x = uuu * p0.x + 3 * uu * t * cp1.x + 3 * u * tt * cp2.x + ttt * p1.x;
            const y = uuu * p0.y + 3 * uu * t * cp1.y + 3 * u * tt * cp2.y + ttt * p1.y;
            return { x, y };
        }

        const spawnPayloadPair = () => {
            if (payloads.length >= 10) return;

            const leftIdx = Math.floor(Math.random() * numLinesPerSide);
            const rightIdx = leftIdx + numLinesPerSide;

            const speed = (0.001 + Math.random() * 0.001);
            payloads.push({ lineId: leftIdx, progress: 0, speed });

            const delayOffset = -1 * (0.05 + Math.random() * 0.08);
            payloads.push({ lineId: rightIdx, progress: delayOffset, speed });
        };

        const tick = () => {
            ctx.clearRect(0, 0, width, height);

            if (payloads.length < 6 && Math.random() < 0.01) {
                spawnPayloadPair();
            }

            ctx.lineCap = 'round';
            ctx.lineJoin = 'round';

            // Draw Base Flow Lines
            lines.forEach(line => {
                ctx.beginPath();
                ctx.moveTo(line.nodes[0].x, line.nodes[0].y);
                for (let j = 1; j < line.nodes.length; j++) {
                    const prev = line.nodes[j - 1];
                    const curr = line.nodes[j];
                    ctx.bezierCurveTo(prev.x, prev.y + (curr.y - prev.y) / 2, curr.x, curr.y - (curr.y - prev.y) / 2, curr.x, curr.y);
                }
                ctx.strokeStyle = `rgba(34, 211, 238, ${line.currentAlpha})`;
                ctx.lineWidth = 1.5;
                ctx.stroke();
            });

            // Update & Draw Payloads
            for (let i = payloads.length - 1; i >= 0; i--) {
                const pkt = payloads[i];
                pkt.progress += pkt.speed;

                if (pkt.progress > 1.3) { payloads.splice(i, 1); continue; }
                if (pkt.progress < 0) continue;

                const line = lines[pkt.lineId];
                if (!line) continue;

                const tailLength = 0.15;
                const numTailSegments = 10;
                for (let j = 0; j < numTailSegments; j++) {
                    const p1 = pkt.progress - (j / numTailSegments) * tailLength;
                    const p2 = pkt.progress - ((j + 1) / numTailSegments) * tailLength;
                    if (p1 <= 0 || p2 >= 1.0) continue;

                    const clamp1 = Math.max(0, Math.min(1, p1));
                    const clamp2 = Math.max(0, Math.min(1, p2));
                    if (clamp1 === clamp2) continue;

                    const pt1 = getPointAtProgress(clamp1, line);
                    const pt2 = getPointAtProgress(clamp2, line);

                    ctx.beginPath();
                    ctx.moveTo(pt1.x, pt1.y);
                    ctx.lineTo(pt2.x, pt2.y);
                    ctx.strokeStyle = `rgba(0, 255, 255, ${(1 - j / numTailSegments) * 0.8})`;
                    ctx.lineWidth = 2.5;
                    ctx.stroke();
                }

                if (pkt.progress >= 0 && pkt.progress <= 1) {
                    const head = getPointAtProgress(pkt.progress, line);
                    ctx.beginPath();
                    ctx.arc(head.x, head.y, 2, 0, Math.PI * 2);
                    ctx.fillStyle = '#00FFFF';
                    ctx.shadowColor = '#00FFFF';
                    ctx.shadowBlur = 10;
                    ctx.fill();
                    ctx.shadowBlur = 0;
                }
            }

            // Vignette overlay
            const gradient = ctx.createRadialGradient(
                width / 2, height / 2, Math.min(width, height) * 0.3,
                width / 2, height / 2, Math.max(width, height) * 0.8
            );
            gradient.addColorStop(0, 'rgba(6, 11, 25, 0)');
            gradient.addColorStop(1, 'rgba(6, 11, 25, 0.95)');
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, width, height);
        };

        gsap.ticker.add(tick);
        window.addEventListener('orientationchange', handleOrientationChange);

        return () => {
            gsap.ticker.remove(tick);
            window.removeEventListener('orientationchange', handleOrientationChange);
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
