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

  useLayoutEffect(() => {
    if (!containerRef.current) return;

    const ctx = gsap.context(() => {
      const circles = containerRef.current?.querySelectorAll('.radar-circle');
      const points = containerRef.current?.querySelectorAll('.skill-point');
      const bg = containerRef.current?.querySelector('.radar-bg');

      if (!circles || !points) return;

      if (prefersReducedMotion) {
        // Immediately show elements without animation
        gsap.set(circles, { opacity: 1, scale: 1 });
        gsap.set(points, { opacity: 1, scale: 1 });
        return;
      }

      // Animate the radar circles using fromTo
      gsap.fromTo(circles,
        { scale: 0, opacity: 0 },
        {
          scale: 1,
          opacity: 1,
          duration: 1,
          stagger: 0.1,
          ease: 'elastic.out(1, 0.5)',
        }
      );

      // Animate skill points using fromTo
      gsap.fromTo(points,
        { scale: 0, opacity: 0 },
        {
          scale: 1,
          opacity: 1,
          duration: 0.6,
          stagger: 0.08,
          ease: 'back.out(1.7)',
          delay: 0.5,
        }
      );

      // Continuous rotation animation
      if (bg) {
        gsap.to(bg, {
          rotation: 360,
          duration: 60,
          ease: 'none',
          repeat: -1,
        });
      }

      // Pulse animation for skill points (subtle)
      gsap.to(points, {
        scale: 1.05,
        duration: 2,
        delay: 1.5,
        stagger: {
          each: 0.3,
          repeat: -1,
          yoyo: true,
        },
        ease: 'sine.inOut',
      });
    }, containerRef);

    return () => ctx.revert();
  }, [prefersReducedMotion]);

  const calculatePosition = (index: number, total: number, level: number) => {
    const angle = (index * 360) / total - 90; // Start from top
    const radius = (level / 100) * 45; // 45% of container
    const x = 50 + radius * Math.cos((angle * Math.PI) / 180);
    const y = 50 + radius * Math.sin((angle * Math.PI) / 180);
    return { x, y, angle };
  };

  return (
    <div className="skill-radar-container" ref={containerRef}>
      <div className="radar-bg">
        {/* Concentric circles */}
        {[20, 40, 60, 80, 100].map((percent) => (
          <div
            key={percent}
            className="radar-circle"
            style={{
              width: `${percent}%`,
              height: `${percent}%`,
            }}
          />
        ))}

        {/* Radar lines */}
        {Array.from({ length: skills.length }).map((_, i) => {
          const angle = (i * 360) / skills.length - 90;
          return (
            <div
              key={i}
              className="radar-line"
              style={{
                transform: `rotate(${angle + 90}deg)`,
              }}
            />
          );
        })}
      </div>

      {/* Skill points */}
      <div className="skill-points">
        {skills.map((skill, index) => {
          const { x, y } = calculatePosition(index, skills.length, skill.level);
          const isHovered = hoveredSkill === skill.title;

          return (
            <div
              key={skill.title}
              className={`skill-point ${isHovered ? 'hovered' : ''}`}
              style={{
                left: `${x}%`,
                top: `${y}%`,
              }}
              onMouseEnter={() => setHoveredSkill(skill.title)}
              onMouseLeave={() => setHoveredSkill(null)}
            >
              <div className="skill-point-inner">
                <div className="skill-point-pulse" />
              </div>
              <div className="skill-label">
                <span className="skill-title">{skill.title}</span>
                <span className="skill-level">{skill.level}%</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Center info */}
      <div className="radar-center">
        <div className="radar-center-icon">
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M12 2L2 7L12 12L22 7L12 2Z"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M2 17L12 22L22 17"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M2 12L12 17L22 12"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <div className="radar-center-text">Skills</div>
      </div>
    </div>
  );
}
