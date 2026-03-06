import { useRef, useLayoutEffect } from 'react';
import { useMotion } from '../hooks/useMotion';
import { useIsMobile } from '../hooks/useIsMobile';
import { useMotionSettings } from '../motion/MotionProvider';
import { AboutBackground } from '../components/AboutBackground';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import '../styles/AnalystDossier.css';

gsap.registerPlugin(ScrollTrigger);

/* ── Data ── */
const dossierFields = [
  { label: 'Name', value: 'Fermin Espinoza' },
  { label: 'Role', value: 'Systems Engineering Student / Junior Network & Cybersecurity Analyst' },
  { label: 'Proficiency', value: 'Bilingual — Spanish (Native) / English (C1)' },
  { label: 'Objective', value: 'SOC Analyst Role' },
];

const coreTraits = [
  'Rapid Learning & Adaptability',
  'Incident Handling',
  'Technical Initiative & Ownership',
];

interface IntelRecord {
  title: string;
  institution: string;
  period: string;
  status: 'Completed' | 'In Progress';
}

const intelRecords: IntelRecord[] = [
  {
    title: 'B.Sc. Systems Engineering',
    institution: 'Universidad Fidélitas',
    period: 'Jan 2025 – Expected 2027',
    status: 'In Progress',
  },
  {
    title: 'Cisco CCNA 200-301 Candidate',
    institution: 'Cisco',
    period: 'Expected March 2026',
    status: 'In Progress',
  },
  {
    title: 'Cisco CCNA Academic Training (Modules 1–3)',
    institution: 'Cisco Networking Academy',
    period: '2024 – 2025',
    status: 'Completed',
  },
  {
    title: 'TryHackMe Cyber Security 101 Candidate',
    institution: 'TryHackMe',
    period: 'Expected April 2026',
    status: 'In Progress',
  },
  {
    title: 'High School Diploma',
    institution: 'Saint George High School',
    period: 'Dec 2024',
    status: 'Completed',
  },
];

export default function About() {
  const pageRef = useRef<HTMLDivElement | null>(null);
  const timelineRef = useRef<HTMLDivElement | null>(null);
  const isMobile = useIsMobile();
  const { prefersReducedMotion } = useMotionSettings();
  useMotion(pageRef);

  /* ── GSAP Animations ── */
  useLayoutEffect(() => {
    const root = timelineRef.current;
    if (!root || prefersReducedMotion) {
      // If reduced motion, just show everything immediately
      if (root && prefersReducedMotion) {
        root.querySelectorAll<HTMLElement>('.dossier-trait').forEach((t) => {
          t.style.opacity = '1';
          t.style.transform = 'scale(1)';
        });
        root.querySelectorAll<HTMLElement>('.intel-row').forEach((r) => {
          r.style.opacity = '1';
          r.style.transform = 'translateY(0)';
        });
      }
      return;
    }

    const ctx = gsap.context(() => {
      /* ── 1. Typewriter Effect for Dossier Fields ── */
      const fieldValues = root.querySelectorAll<HTMLElement>('.dossier-field-value');
      const cursors = root.querySelectorAll<HTMLElement>('.dossier-cursor');

      fieldValues.forEach((el, idx) => {
        const fullText = el.getAttribute('data-text') || '';
        el.textContent = '';

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: root.querySelector('.dossier-card'),
            start: 'top 80%',
            once: true,
          },
          delay: idx * 0.6,
        });

        // Type each character
        const chars = fullText.split('');
        chars.forEach((_, charIdx) => {
          tl.to(el, {
            duration: 0.025,
            onComplete: () => {
              el.textContent = fullText.substring(0, charIdx + 1);
            },
          }, `+=${charIdx === 0 ? 0 : 0.025}`);
        });

        // Hide cursor for this field after typing completes (except the last field)
        if (idx < fieldValues.length - 1 && cursors[idx]) {
          tl.to(cursors[idx], { opacity: 0, duration: 0.1 }, '+=0.1');
        }
      });

      /* ── 2. Trait Badges ── */
      const traits = root.querySelectorAll<HTMLElement>('.dossier-trait');
      gsap.fromTo(
        traits,
        { opacity: 0, scale: 0.8, y: 10 },
        {
          opacity: 1,
          scale: 1,
          y: 0,
          duration: 0.5,
          stagger: 0.15,
          ease: 'back.out(1.7)',
          scrollTrigger: {
            trigger: root.querySelector('.dossier-traits'),
            start: 'top 85%',
            once: true,
          },
          delay: dossierFields.length * 0.6 + 0.5, // After typewriter completes
        },
      );

      /* ── 3. Intel Table Rows ── */
      const rows = root.querySelectorAll<HTMLElement>('.intel-row');
      gsap.fromTo(
        rows,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          stagger: 0.12,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: root.querySelector('.intel-table'),
            start: 'top 80%',
            once: true,
          },
        },
      );

      /* ── 4. Access Log Progress Bar ── */
      const fill = root.querySelector<HTMLElement>('.access-log-fill');
      if (fill) {
        gsap.to(fill, {
          scaleY: 1,
          ease: 'none',
          scrollTrigger: {
            trigger: root,
            start: 'top top',
            end: 'bottom bottom',
            scrub: 0.3,
          },
        });
      }
    }, root);

    return () => ctx.revert();
  }, [prefersReducedMotion]);

  return (
    <div ref={pageRef} style={{ position: 'relative' }}>
      <AboutBackground />

      {/* Page Intro */}
      <div className="page-intro reveal">
        <div className="page-intro-content">
          <p className="eyebrow">About</p>
          <h1 data-split="words">About Me</h1>
          <p className="lead">
            Professional background and qualifications for employment verification.
          </p>
        </div>
      </div>

      {/* Dossier Content */}
      <div ref={timelineRef} className="dossier-container">
        {/* Access Log Bar (desktop only) */}
        {!isMobile && (
          <div className="access-log">
            <span className="access-log-label">Access Log</span>
            <div className="access-log-track">
              <div className="access-log-fill" />
            </div>
          </div>
        )}

        {/* ── Personnel Dossier Card ── */}
        <div className="dossier-card">
          {/* Corner accents */}
          <div className="dossier-corner dossier-corner--tl" />
          <div className="dossier-corner dossier-corner--tr" />
          <div className="dossier-corner dossier-corner--bl" />
          <div className="dossier-corner dossier-corner--br" />

          <div className="dossier-card-content">
            {/* Card Header */}
            <div className="dossier-header">
              <span className="dossier-header-title">
                ◈ About the Candidate
              </span>
              <span className="dossier-header-id">
                FILE-ID: FE-2025-0042
              </span>
            </div>

            {/* Fields */}
            <div className="dossier-fields">
              {dossierFields.map((field) => (
                <div className="dossier-field" key={field.label}>
                  <span className="dossier-field-label">{field.label}:</span>
                  <span className="dossier-field-value" data-text={field.value}>
                    {prefersReducedMotion ? field.value : ''}
                    {!prefersReducedMotion && <span className="dossier-cursor" />}
                  </span>
                </div>
              ))}
            </div>

            {/* Trait Badges */}
            <div className="dossier-divider">
              <span className="dossier-divider-label">Core Traits</span>
              <div className="dossier-divider-line" />
            </div>

            <div className="dossier-traits">
              {coreTraits.map((trait) => (
                <div
                  className="dossier-trait"
                  key={trait}
                  style={prefersReducedMotion ? { opacity: 1, transform: 'scale(1)' } : undefined}
                >
                  <span className="dossier-trait-dot" />
                  {trait}: <strong>Confirmed</strong>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Intel Records Table ── */}
        <div className="dossier-divider">
          <span className="dossier-divider-label">◈ Intelligence Records // Query Results</span>
          <div className="dossier-divider-line" />
        </div>

        <table className="intel-table">
          <thead>
            <tr className="intel-table-head">
              <th>Record</th>
              <th>Period</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {intelRecords.map((record) => {
              const statusClass = record.status === 'Completed' ? 'completed' : 'in-progress';
              return (
                <tr
                  className="intel-row"
                  key={record.title}
                  style={prefersReducedMotion ? { opacity: 1, transform: 'translateY(0)' } : undefined}
                >
                  <td data-label="Record">
                    <div className="intel-title">{record.title}</div>
                    <div className="intel-institution">{record.institution}</div>
                  </td>
                  <td data-label="Period">
                    <span className="intel-period">{record.period}</span>
                  </td>
                  <td data-label="Status">
                    <span className={`intel-status intel-status--${statusClass}`}>
                      <span className={`status-dot status-dot--${statusClass}`} />
                      {record.status}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
