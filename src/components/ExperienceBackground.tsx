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

export function ExperienceBackground() {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d', { alpha: true });
        if (!ctx) return;

        let width = 0, height = 0;
        const lines: Line[] = [];
        const payloads: Payload[] = [];
        const numLinesPerSide = 5;
        const numSegments = 6;

        let mouseX = -2000, mouseY = -2000;

        const buildTopology = () => {
            lines.length = 0;

            // Generate symmetric topology
            for (let i = 0; i < numLinesPerSide; i++) {
                const leftNodes: Node[] = [];
                const rightNodes: Node[] = [];

                // Left Zone spread: roughly 5% to 15% width
                // This naturally leaves 20%-80% mostly empty for the Center Clear Zone
                let currentXRatio = 0.05 + (i / (numLinesPerSide - 1)) * 0.1;

                for (let j = 0; j <= numSegments; j++) {
                    // Occasionally branch/merge with a neighbor
                    if (j > 0 && j < numSegments && Math.random() < 0.35) {
                        const step = Math.random() < 0.5 ? -1 : 1;
                        const neighborIdx = i + step;
                        if (neighborIdx >= 0 && neighborIdx < numLinesPerSide) {
                            currentXRatio = 0.05 + (neighborIdx / (numLinesPerSide - 1)) * 0.1;
                        }
                    }

                    // Add smooth organic jitter
                    const jitterX = (Math.random() - 0.5) * 0.04;
                    const xRatioLeft = currentXRatio + jitterX;

                    leftNodes.push({
                        xRatio: xRatioLeft,
                        yRatio: j / numSegments,
                        x: 0,
                        y: 0
                    });

                    rightNodes.push({
                        xRatio: 1 - xRatioLeft, // Perfect horizontal mirroring
                        yRatio: j / numSegments,
                        x: 0,
                        y: 0
                    });
                }

                lines.push({
                    id: i,
                    side: 'left',
                    nodes: leftNodes,
                    targetAlpha: 0.1,
                    currentAlpha: 0.1
                });

                lines.push({
                    id: i + numLinesPerSide,
                    side: 'right',
                    nodes: rightNodes,
                    targetAlpha: 0.1,
                    currentAlpha: 0.1
                });
            }
        };

        const resize = () => {
            width = canvas.clientWidth;
            height = canvas.clientHeight;
            canvas.width = width * window.devicePixelRatio;
            canvas.height = height * window.devicePixelRatio;
            ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

            if (lines.length === 0) buildTopology();

            lines.forEach(line => {
                line.nodes.forEach(node => {
                    node.x = node.xRatio * width;
                    node.y = node.yRatio * height;
                });
            });
        };

        function getPointAtProgress(prog: number, line: Line) {
            const numSegs = line.nodes.length - 1;
            let tTotal = prog * numSegs;
            let segment = Math.floor(tTotal);

            if (segment >= numSegs) {
                segment = numSegs - 1;
                tTotal = numSegs;
            }
            if (segment < 0) {
                segment = 0;
                tTotal = 0;
            }

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

        const spawnPayloadPair = (baseIndex: number = -1, speedFactor: number = 1, startProgress: number = 0) => {
            if (payloads.length >= 30) return;

            const leftIdx = baseIndex >= 0 ? baseIndex : Math.floor(Math.random() * numLinesPerSide);
            const rightIdx = leftIdx + numLinesPerSide;

            const speed = (0.0015 + Math.random() * 0.002) * speedFactor;

            payloads.push({
                lineId: leftIdx,
                progress: startProgress,
                speed
            });

            // Symmetrical right payload, slightly offset in time via negative progress
            const delayOffset = -1 * (0.05 + Math.random() * 0.08);
            payloads.push({
                lineId: rightIdx,
                progress: startProgress + delayOffset,
                speed
            });
        };

        const tick = () => {
            ctx.clearRect(0, 0, width, height);

            // Spawn ambient automated workflows occasionally
            if (payloads.length < 16 && Math.random() < 0.015) {
                spawnPayloadPair();
            }

            const leftZoneBound = width * 0.3; // Give a slight margin beyond 20% for interaction
            const rightZoneBound = width * 0.7;

            // Smooth opacity transitions governed by symmetrical mouse zones
            lines.forEach(line => {
                let target = 0.1; // Base 0.1 opacity as requested

                const inLeft = line.side === 'left' && mouseX > 0 && mouseX < leftZoneBound;
                const inRight = line.side === 'right' && mouseX > rightZoneBound;

                if (inLeft || inRight) {
                    let minDist = 9999;
                    for (let prog = 0; prog <= 1; prog += 0.05) {
                        const pt = getPointAtProgress(prog, line);
                        const dist = Math.hypot(mouseX - pt.x, mouseY - pt.y);
                        if (dist < minDist) minDist = dist;
                    }

                    const softRadius = 300;
                    if (minDist < softRadius) {
                        const intensity = 1 - (minDist / softRadius);
                        target = 0.1 + (0.2 * intensity); // Glow up to 0.3
                    }
                }

                line.targetAlpha = target;
                line.currentAlpha += (line.targetAlpha - line.currentAlpha) * 0.05;
            });

            ctx.lineCap = 'round';
            ctx.lineJoin = 'round';

            // Draw Symmetrical Base Flow Lines
            lines.forEach(line => {
                ctx.beginPath();
                ctx.moveTo(line.nodes[0].x, line.nodes[0].y);
                for (let j = 1; j < line.nodes.length; j++) {
                    const prev = line.nodes[j - 1];
                    const curr = line.nodes[j];
                    const cp1x = prev.x;
                    const cp1y = prev.y + (curr.y - prev.y) / 2;
                    const cp2x = curr.x;
                    const cp2y = curr.y - (curr.y - prev.y) / 2;
                    ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, curr.x, curr.y);
                }
                ctx.strokeStyle = `rgba(34, 211, 238, ${line.currentAlpha})`;
                ctx.lineWidth = 1.5;
                ctx.stroke();
            });

            // Update & Draw Webhooks / Payloads
            for (let i = payloads.length - 1; i >= 0; i--) {
                const pkt = payloads[i];
                pkt.progress += pkt.speed;

                // Allow some buffer before deleting so tails have completely drained out
                if (pkt.progress > 1.3) {
                    payloads.splice(i, 1);
                    continue;
                }

                if (pkt.progress < 0) continue; // Waiting to spawn for symmetrical delay

                const line = lines[pkt.lineId];
                if (!line) continue;

                // Trail Rendering
                const tailLength = 0.15;
                const numTailSegments = 12;
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

                // Core Head
                if (pkt.progress >= 0 && pkt.progress <= 1) {
                    const head = getPointAtProgress(pkt.progress, line);
                    ctx.beginPath();
                    ctx.arc(head.x, head.y, 2, 0, Math.PI * 2);
                    ctx.fillStyle = '#00FFFF';
                    ctx.shadowColor = '#00FFFF';
                    ctx.shadowBlur = 12;
                    ctx.fill();
                    ctx.shadowBlur = 0; // reset
                }
            }

            // Vignette depth-of-field overlay (preserves deep dark edges and frames center)
            const gradient = ctx.createRadialGradient(
                width / 2, height / 2, Math.min(width, height) * 0.3,
                width / 2, height / 2, Math.max(width, height) * 0.8
            );
            gradient.addColorStop(0, 'rgba(6, 11, 25, 0)');
            gradient.addColorStop(1, 'rgba(6, 11, 25, 0.95)');
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, width, height);
        };

        const onMouseMove = (e: MouseEvent) => {
            const rect = canvas.getBoundingClientRect();
            const currX = e.clientX - rect.left;
            const currY = e.clientY - rect.top;
            const prevX = currX - e.movementX;

            mouseX = currX;
            mouseY = currY;

            // Trigger manual webhooks if crossing quickly through a side
            if (Math.abs(e.movementX) > 8) {
                const isLeftCrossover = mouseX < width * 0.3;
                const isRightCrossover = mouseX > width * 0.7;

                lines.filter(l => (l.side === 'left' && isLeftCrossover) || (l.side === 'right' && isRightCrossover)).forEach(line => {
                    const numSegs = line.nodes.length - 1;
                    const segment = Math.min(numSegs - 1, Math.floor((currY / height) * numSegs));
                    if (segment < 0 || segment >= numSegs) return;

                    const node0 = line.nodes[segment];
                    const node1 = line.nodes[segment + 1];
                    const t = Math.max(0, Math.min(1, (currY - node0.y) / (node1.y - node0.y)));

                    const u = 1 - t;
                    const tt = t * t;
                    const uu = u * u;
                    const uuu = uu * u;
                    const ttt = tt * t;

                    const cp1x = node0.x;
                    const cp2x = node1.x;

                    const lineX = uuu * (node0.x) + 3 * uu * t * (cp1x) + 3 * u * tt * (cp2x) + ttt * (node1.x);

                    const crossedRight = prevX <= lineX && currX >= lineX;
                    const crossedLeft = prevX >= lineX && currX <= lineX;

                    if (crossedRight || crossedLeft) {
                        // Spawn paired fast webhook trace payload on intersection
                        spawnPayloadPair(line.id % numLinesPerSide, 2.5, currY / height);
                    }
                });
            }
        };

        const onMouseLeave = () => {
            mouseX = -2000;
            mouseY = -2000;
        };

        window.addEventListener('mousemove', onMouseMove);
        document.body.addEventListener('mouseleave', onMouseLeave);

        resize();
        window.addEventListener('resize', resize);
        const ro = new ResizeObserver(resize);
        ro.observe(canvas);

        gsap.ticker.add(tick);

        return () => {
            gsap.ticker.remove(tick);
            window.removeEventListener('resize', resize);
            window.removeEventListener('mousemove', onMouseMove);
            document.body.removeEventListener('mouseleave', onMouseLeave);
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
