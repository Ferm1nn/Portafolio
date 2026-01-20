import { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { CTAButton } from '../components/CTAButton';
import { Badge } from '../components/Badge';
import { Card } from '../components/Card';
import { SkillRadar } from '../components/SkillRadar';
import { heroMetrics, profile, technicalSkills } from '../data/portfolioData';
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
    { title: 'Automation', level: 80 },
    { title: 'Python', level: 70 },
    { title: 'n8n', level: 85 },
    { title: 'Supabase', level: 75 },
  ];

  useLayoutEffect(() => {
    if (!heroRef.current) return;

    return addToContext(() => {
      const titleWords = splitTextToSpans(titleRef.current);
      const subhead = heroRef.current?.querySelector<HTMLElement>('.hero-lead');
      const summary = heroRef.current?.querySelector<HTMLElement>('.hero-summary');
      const actions = heroRef.current?.querySelector<HTMLElement>('.hero-actions');

      if (prefersReducedMotion) {
        gsap.set([titleWords, subhead, summary, actions], { opacity: 1, y: 0 });
      } else {
        const tl = gsap.timeline();
        tl.fromTo(
          titleWords,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out', stagger: 0.06 },
        )
          .fromTo(subhead, { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }, '-=0.3')
          .fromTo(summary, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }, '-=0.35')
          .fromTo(actions, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }, '-=0.35');
      }

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
              start: 'top 80%',
              once: true,
            },
          });
        });
      }

      if (!prefersReducedMotion && !isTouch) {
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
              {technicalSkills.slice(0, 3).map((skill) => (
                <Badge key={skill.title}>{skill.title}</Badge>
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
