import { useRef, useLayoutEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ExperienceBackground } from '../components/ExperienceBackground';
import { ExperienceMobileBg } from '../components/mobile-backgrounds';
import { useMotion } from '../hooks/useMotion';
import { useMotionSettings } from '../motion/MotionProvider';
import '../styles/NeuralTimeline.css';

gsap.registerPlugin(ScrollTrigger);

/* ── Experience Data ── */
interface TimelineEntry {
  date: string;
  title: string;
  bullets: string[];
  tags: string[];
  side: 'left' | 'right';
}

const timelineData: TimelineEntry[] = [


  {
    date: '2022 – 2026',
    title: 'Personal Projects & Networking Labs',
    bullets: [
      'Built and deployed a private, self-hosted WireGuard VPN from scratch.',
      'Performed deep-dive packet analysis and diagnostics using Wireshark.',
      'Configured layer 2-3 topologies, deploying 802.1Q VLAN tagging and Spanning Tree Protocol (STP).',
      'Actively advancing defensive security skills through TryHackMe and Hack The Box SOC analyst pathways.',
    ],
    tags: ['WireGuard', 'Wireshark', 'VLAN', 'STP', 'TryHackMe', 'Hack The Box'],
    side: 'left',
  },
  {
    date: '2025 – Present',
    title: 'Freelance Web Developer & Automation Architect',
    bullets: [
      'Developed web apps utilizing Vite, React, and Node Package Manager (NPM) CLI for full-stack environments.',
      'Designed backend solutions using self-hosted n8n for webhook-driven workflows.',
      'Implemented secure backend authentication flows utilizing strong database password encryption (salting and hashing).',
    ],
    tags: ['React', 'Vite', 'n8n', 'Node.js', 'Supabase', 'Webhooks'],
    side: 'right',
  },
  {
    date: '03/2022 – 05/2025',
    title: 'Catering Assistant – Events & Private Services',
    bullets: [
      'Developed strong customer service, communication, and problem-solving skills in fast-paced environments.',
    ],
    tags: ['Customer Service', 'Communication', 'Problem Solving', 'Teamwork', 'Time Management', 'Adaptability', 'Attention to Detail'],
    side: 'left',
  },
];

export default function Experience() {
  const pageRef = useRef<HTMLDivElement | null>(null);
  const timelineRef = useRef<HTMLDivElement | null>(null);
  const spineRef = useRef<SVGLineElement | null>(null);
  const { prefersReducedMotion } = useMotionSettings();

  useMotion(pageRef);

  /* ── GSAP animations ── */
  useLayoutEffect(() => {
    if (prefersReducedMotion) {
      // Show everything immediately
      const root = timelineRef.current;
      if (!root) return;
      root.querySelectorAll<HTMLElement>('.neural-entry').forEach((el) => {
        el.style.opacity = '1';
        el.style.transform = 'none';
        el.style.filter = 'none';
      });
      root.querySelectorAll<HTMLElement>('.neural-tag').forEach((el) => {
        el.style.opacity = '1';
      });
      return;
    }

    const root = timelineRef.current;
    const spine = spineRef.current;
    if (!root || !spine) return;

    const ctx = gsap.context(() => {
      const cleanups: Array<() => void> = [];

      /* ── 1. Spine draw ── */
      const spineLength = spine.getTotalLength();
      gsap.set(spine, {
        strokeDasharray: spineLength,
        strokeDashoffset: spineLength,
      });

      const spineTween = gsap.to(spine, {
        strokeDashoffset: 0,
        ease: 'none',
        scrollTrigger: {
          trigger: root,
          start: 'top 80%',
          end: 'bottom 30%',
          scrub: 0.6,
        },
      });
      cleanups.push(() => {
        spineTween.scrollTrigger?.kill();
        spineTween.kill();
      });

      /* ── 2. Entries: slide-in + scanline + tags ── */
      const entries = root.querySelectorAll<HTMLElement>('.neural-entry');
      entries.forEach((entry) => {
        const isLeft = entry.classList.contains('neural-entry--left');
        const xOffset = isLeft ? -80 : 80;

        // Card slide-in
        const cardTl = gsap.timeline({
          scrollTrigger: {
            trigger: entry,
            start: 'top 85%',
            toggleActions: 'play none none none',
          },
        });

        cardTl.fromTo(
          entry,
          { x: xOffset, opacity: 0, filter: 'blur(8px)' },
          {
            x: 0,
            opacity: 1,
            filter: 'blur(0px)',
            duration: 0.8,
            ease: 'power3.out',
          },
        );

        // Scanline sweep
        const scanline = entry.querySelector<HTMLElement>('.neural-card');
        if (scanline) {
          cardTl.fromTo(
            scanline,
            { '--scanline-x': '-100%' },
            { '--scanline-x': '200%', duration: 0.9, ease: 'power1.inOut' },
            '-=0.3',
          );
          // Drive the pseudo-element via a CSS custom property
          gsap.set(scanline, { '--scanline-x': '-100%' });
        }

        // Sonar ping on node
        const node = entry.querySelector<HTMLElement>('.neural-node-ping');
        if (node) {
          cardTl.fromTo(
            node,
            { scale: 0.5, opacity: 0.8 },
            { scale: 2.5, opacity: 0, duration: 0.8, ease: 'power2.out' },
            '-=0.6',
          );
        }

        // Stagger tags
        const tags = entry.querySelectorAll<HTMLElement>('.neural-tag');
        if (tags.length) {
          cardTl.fromTo(
            tags,
            { opacity: 0, y: 10, scale: 0.9 },
            {
              opacity: 1,
              y: 0,
              scale: 1,
              duration: 0.4,
              stagger: 0.08,
              ease: 'back.out(1.5)',
            },
            '-=0.3',
          );
        }

        cleanups.push(() => {
          cardTl.scrollTrigger?.kill();
          cardTl.kill();
        });
      });

      return () => cleanups.forEach((fn) => fn());
    }, root);

    return () => ctx.revert();
  }, [prefersReducedMotion]);

  return (
    <div ref={pageRef} className="relative z-0 min-h-screen">
      {/* Desktop background (≥768px) */}
      <div className="hidden md:block">
        <ExperienceBackground />
      </div>
      {/* Mobile background (<768px) */}
      <div className="md:hidden">
        <ExperienceMobileBg />
      </div>
      {/* ── Page Intro ── */}
      <div className="page-intro reveal">
        <div className="page-intro-content">
          <p className="eyebrow">Experience</p>
          <h1 data-split="words">Experience Timeline</h1>
          <p className="lead">
            A timeline of my professional experience in a neural-inspired design.
          </p>
        </div>
      </div>

      {/* ── Timeline ── */}
      <div ref={timelineRef} className="neural-timeline">
        {/* SVG Spine */}
        <svg className="neural-spine" aria-hidden="true" preserveAspectRatio="none">
          <line
            ref={spineRef}
            x1="50%"
            y1="0"
            x2="50%"
            y2="100%"
            className="neural-spine-line"
            vectorEffect="non-scaling-stroke"
          />
        </svg>

        {/* Entries */}
        <div className="neural-entries">
          {timelineData.map((entry, idx) => (
            <div
              key={idx}
              className={`neural-entry neural-entry--${entry.side}`}
            >
              {/* Node on the spine */}
              <div className="neural-node">
                <div className="neural-node-dot" />
                <div className="neural-node-ping" />
              </div>

              {/* Connector line from spine to card */}
              <div className="neural-connector" />

              {/* Card */}
              <div className="neural-card">
                <span className="neural-card-date">{entry.date}</span>
                <h3>{entry.title}</h3>
                <ul className="neural-card-description">
                  {entry.bullets.map((bullet, bIdx) => (
                    <li key={bIdx}>{bullet}</li>
                  ))}
                </ul>
                <div className="neural-tags">
                  {entry.tags.filter(tag => tag.trim() !== '').map((tag) => (
                    <span key={tag} className="neural-tag">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
