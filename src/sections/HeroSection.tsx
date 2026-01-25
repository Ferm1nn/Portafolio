import { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { CTAButton } from '../components/CTAButton';
import { Badge } from '../components/Badge';
import { Card } from '../components/Card';
import { SkillRadar } from '../components/SkillRadar';
import { heroMetrics, profile } from '../data/portfolioData';
import { useGSAPContext } from '../lib/animations/hooks/useGSAPContext';
import { splitTextToSpans } from '../lib/animations/helpers/splitText';
import { useMotionSettings } from '../motion/MotionProvider';

gsap.registerPlugin(ScrollTrigger);

export function HeroSection() {
  const { prefersReducedMotion, isTouch } = useMotionSettings();
  const heroRef = useRef<HTMLElement | null>(null);
  const titleRef = useRef<HTMLHeadingElement | null>(null);
  const metricsRef = useRef<HTMLDivElement | null>(null);
  const addToContext = useGSAPContext(heroRef);

  // Skill proficiency data for radar visualization
  const skillData = [
    { title: 'Networking', level: 85 },
    { title: 'IT Support', level: 90 },
    { title: 'AI Automation', level: 80 },
    { title: 'Python', level: 70 },
    { title: 'Cybersecurity', level: 78 },
    { title: 'Linux', level: 72 },
  ];
  const focusAreas = ['Network Support Technician', 'Cybersecurity', 'Automations'];

  useLayoutEffect(() => {
    if (!heroRef.current) return;

    return addToContext(() => {
      const mm = gsap.matchMedia();

      mm.add("(min-width: 768px)", () => {
        const titleWords = splitTextToSpans(titleRef.current);
        const subhead = heroRef.current?.querySelector<HTMLElement>('.hero-lead');
        const summary = heroRef.current?.querySelector<HTMLElement>('.hero-summary');
        const actions = heroRef.current?.querySelector<HTMLElement>('.hero-actions');

        if (prefersReducedMotion) {
          gsap.set([titleWords, subhead, summary, actions], { opacity: 1, y: 0 });
          return;
        }

        if (!subhead || !summary || !actions) return;

        const tl = gsap.timeline();
        tl.fromTo(
          titleWords,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out', stagger: 0.06 },
        )
          .fromTo(subhead, { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }, '-=0.3')
          .fromTo(summary, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }, '-=0.35')
          .fromTo(actions, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }, '-=0.35');

        // Desktop-only float animation
        if (!isTouch) {
          const floatCards = heroRef.current?.querySelectorAll<HTMLElement>('[data-float]');
          floatCards?.forEach((card) => {
            gsap.to(card, {
              y: gsap.utils.random(2, 6),
              duration: gsap.utils.random(3, 6),
              ease: 'sine.inOut',
              yoyo: true,
              repeat: -1,
              delay: gsap.utils.random(0, 1.5),
            });
          });
        }
      });

      mm.add("(max-width: 767px)", () => {
        // Lighter mobile animation
        const elements = heroRef.current?.querySelectorAll<HTMLElement>('.hero-title, .hero-lead, .hero-summary, .hero-actions');
        if (elements) {
          gsap.fromTo(elements,
            { opacity: 0, y: 10 },
            { opacity: 1, y: 0, duration: 0.6, stagger: 0.1, ease: 'power2.out', clearProps: 'all' }
          );
        }
      });

      // Shared logic (Metrics counter) - careful with mobile perf, but simple counters are usually okay.
      // Keeping it inside mm or outside depends on if we want it on mobile. User said "heavy effects" only on desktop.
      // Metrics are critical content, let's keep them but maybe simplify?
      // User said "Mobile branch... fewer targets... simpler reveal". 
      // I'll keep logic outside matchMedia for metrics as it uses ScrollTrigger which is fine, 
      // OR put it in both. I'll put it in a separate shared block or just outside if it's safe.
      // Metrics counter is fine.

      if (metricsRef.current) {
        const metricValues = Array.from(metricsRef.current.querySelectorAll<HTMLElement>('[data-metric-value]'));
        metricValues.forEach((element) => {
          const targetValue = Number(element.dataset.metricValue ?? 0);
          if (prefersReducedMotion) {
            element.textContent = `${targetValue}`;
            return;
          }

          const counter = { value: 0 };
          gsap.to(counter, {
            value: targetValue,
            duration: 1.2,
            ease: 'power2.out',
            onUpdate: () => {
              element.textContent = Math.round(counter.value).toString();
            },
            scrollTrigger: {
              trigger: metricsRef.current,
              start: 'top 85%', // slightly earlier on mobile potentially
              once: true,
            },
          });
        });
      }

      return () => mm.revert();
    });
  }, [addToContext, isTouch, prefersReducedMotion]);

  return (
    <section className="hero" id="hero" ref={heroRef}>
      <div className="hero-grid">
        <div className="hero-content">
          <p className="eyebrow">Network Technician / IT Support</p>
          <h1 className="hero-title" ref={titleRef}>
            {profile.name}
          </h1>
          <p className="hero-role">{profile.role}</p>
          <p className="lead hero-lead">{profile.headline}</p>
          <p className="hero-summary">{profile.summary}</p>
          <div className="hero-actions">
            <CTAButton to="/contact">Contact</CTAButton>
            <CTAButton to="/projects" variant="ghost">
              View projects
            </CTAButton>
          </div>
          <div className="hero-meta">
            <Badge>{profile.location}</Badge>
            <a className="pill link" href={`mailto:${profile.email}`}>
              {profile.email}
            </a>
            <a className="pill link" href={profile.linkedin} target="_blank" rel="noreferrer">
              LinkedIn
            </a>
          </div>
        </div>
        <div className="hero-aside">
          <Card className="hero-card" tilt>
            <SkillRadar skills={skillData} />
            <h3 data-tilt-layer="title" style={{ marginTop: '1rem' }}>Focus areas</h3>
            <div className="pill-row" data-tilt-layer="badges">
              {focusAreas.map((focus) => (
                <Badge key={focus}>{focus}</Badge>
              ))}
            </div>
          </Card>
          <div className="hero-metrics" ref={metricsRef}>
            {heroMetrics.map((metric) => (
              <Card key={metric.label} className="metric-card" tilt={false} data-float>
                <div className="metric-value">
                  <span data-metric-value={metric.value}>{metric.value}</span>
                  {metric.suffix && <span className="metric-suffix">{metric.suffix}</span>}
                </div>
                <div className="metric-label">{metric.label}</div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
