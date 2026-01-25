import { useLayoutEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { useMotionSettings } from '../motion/MotionProvider';
import '../styles/SkillRadar.css';

interface SkillRadarProps {
  skills: Array<{ title: string; level: number }>;
}

export function SkillRadar({ skills }: SkillRadarProps) {
  const { prefersReducedMotion } = useMotionSettings();
  const containerRef = useRef<HTMLDivElement>(null);
  const [hoveredSkill, setHoveredSkill] = useState<string | null>(null);

  // Auto-scan effect state
  const [scanIndex, setScanIndex] = useState<number | null>(0);

  // Auto-cycle through skills when not hovering
  useLayoutEffect(() => {
    if (hoveredSkill) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setScanIndex(null);
      return;
    }

    // Interval for auto-scan
    const interval = setInterval(() => {
      setScanIndex((prev) => {
        if (prev === null) return 0;
        return (prev + 1) % skills.length;
      });
    }, 2000);

    return () => clearInterval(interval);
  }, [hoveredSkill, skills.length]);

  // Tooltip state
  const [tooltip, setTooltip] = useState<{
    visible: boolean;
    x: number;
    y: number;
    text: string;
    side: 'left' | 'right';
  }>({
    visible: false,
    x: 0,
    y: 0,
    text: '',
    side: 'right',
  });

  const tooltipRef = useRef<HTMLDivElement>(null);

  // Position calculation shared for SVG and Nodes
  const calculatePosition = (index: number, total: number, level: number) => {
    const angle = (index * 360) / total - 90;
    const radius = (level / 100) * 48; // 48% to fill more space
    // For SVG (0-100 coordinates)
    const x = 50 + radius * Math.cos((angle * Math.PI) / 180);
    const y = 50 + radius * Math.sin((angle * Math.PI) / 180);
    return { x, y, angle };
  };

  // Handle hover and smart placement
  const handleMouseEnter = (skill: { title: string; level: number }, _index: number, event: React.MouseEvent) => {
    setHoveredSkill(skill.title);

    if (!containerRef.current) return;
    const containerRect = containerRef.current.getBoundingClientRect();
    const target = event.currentTarget as HTMLElement;
    const targetRect = target.getBoundingClientRect();

    // Calculate relative position within container
    const relativeX = targetRect.left - containerRect.left + targetRect.width / 2;
    const relativeY = targetRect.top - containerRect.top;

    // Hemisphere logic: 
    // Left side of container -> tooltip on Right
    // Right side of container -> tooltip on Left
    // This INWARD logic guarantees labels stay inside the container
    const isRightHemisphere = relativeX > containerRect.width / 2;

    const side = isRightHemisphere ? 'left' : 'right';

    // Offset slightly
    // If on right, push LEFT (relativeX - 16)
    // If on left, push RIGHT (relativeX + 16)
    const tooltipX = isRightHemisphere ? relativeX - 16 : relativeX + 16;
    const tooltipY = relativeY;

    setTooltip({
      visible: true,
      x: tooltipX,
      y: tooltipY,
      text: skill.title,
      side,
    });
  };

  const handleMouseLeave = () => {
    setHoveredSkill(null);
    setTooltip((prev) => ({ ...prev, visible: false }));
  };

  useLayoutEffect(() => {
    if (!containerRef.current) return;
    const ctx = gsap.context(() => {
      // Entrance animation for nodes
      if (!prefersReducedMotion) {
        gsap.fromTo('.skill-point',
          { scale: 0, opacity: 0 },
          { scale: 1, opacity: 1, duration: 0.5, stagger: 0.05, ease: 'back.out(1.5)' }
        );
      }
    }, containerRef);
    return () => ctx.revert();
  }, [prefersReducedMotion]);

  return (
    <div className="skill-radar-container" ref={containerRef}>
      <div className="radar-bg">
        <svg className="radar-svg" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet">
          <defs>
            {/* Gradients removed in favor of solid stroke CSS for consistent visibility */}
          </defs>

          {/* Static Rings */}
          {[20, 40, 60, 80, 100].map((r) => (
            <circle key={r} cx="50" cy="50" r={r * 0.48} className="radar-ring" />
          ))}

          {/* Spokes & Shines */}
          {skills.map((skill, i) => {
            const angle = (i * 360) / skills.length - 90;
            const rad = (angle * Math.PI) / 180;
            // Using direct coordinates (Not rotation) to match layout perfectly
            const x2 = 50 + 48 * Math.cos(rad);
            const y2 = 50 + 48 * Math.sin(rad);

            // Active if hovered OR if it's the current scan target (and no hover is happening)
            const isActive = hoveredSkill === skill.title || (hoveredSkill === null && scanIndex === i);

            return (
              <g key={i}>
                {/* Base spoke */}
                <line x1="50" y1="50" x2={x2} y2={y2} className="radar-spoke" />

                {/* Shine effect */}
                <line
                  x1="50" y1="50" x2={x2} y2={y2}
                  className={`radar-shine ${isActive ? 'active-shine' : ''}`}
                />
              </g>
            );
          })}
        </svg>
      </div>

      <div className="skill-points">
        {skills.map((skill, index) => {
          const { x, y } = calculatePosition(index, skills.length, skill.level);
          const isHovered = hoveredSkill === skill.title;
          const isScanned = hoveredSkill === null && scanIndex === index;

          return (
            <div
              key={skill.title}
              className={`skill-point ${isHovered || isScanned ? 'hovered' : ''}`}
              style={{ left: `${x}%`, top: `${y}%` }}
              onMouseEnter={(e) => handleMouseEnter(skill, index, e)}
              onMouseLeave={handleMouseLeave}
              // Touch support
              onClick={(e) => handleMouseEnter(skill, index, e)}
            >
              <div className="skill-point-inner">
                <div className="skill-point-pulse" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Shared Smart Tooltip */}
      <div
        ref={tooltipRef}
        className={`skill-label ${tooltip.visible ? 'visible' : ''}`}
        style={{
          left: tooltip.x,
          top: tooltip.y,
          transform: tooltip.side === 'left' ? 'translate(-100%, -50%)' : 'translate(0, -50%)',
          marginLeft: tooltip.side === 'right' ? '12px' : '0',
          marginRight: tooltip.side === 'left' ? '12px' : '0',
          // Ensure it doesn't get clipped easily if near very edge
          maxWidth: '180px',
          whiteSpace: 'normal',
          textAlign: tooltip.side === 'left' ? 'right' : 'left'
        }}
      >
        <span className="skill-title">{tooltip.text}</span>
      </div>

      <div className="radar-center">
        <div className="radar-center-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 2L2 7L12 12L22 7L12 2Z" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M2 17L12 22L22 17" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M2 12L12 17L22 12" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <div className="radar-center-text">Skills</div>
      </div>
    </div>
  );
}
