import { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { experiences, profile } from '../data/portfolioData';
import { PageIntro } from '../components/PageIntro';
import { Section } from '../components/Section';
import { TimelineItem } from '../components/TimelineItem';
import { CTAButton } from '../components/CTAButton';
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion';

gsap.registerPlugin(ScrollTrigger);

export default function Experience() {
  const pageRef = useRef<HTMLDivElement | null>(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      if (prefersReducedMotion) return;
      gsap.utils.toArray<HTMLElement>('.reveal').forEach((section) => {
        gsap.fromTo(
          section,
          { opacity: 0, y: 24 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: 'power2.out',
            scrollTrigger: { trigger: section, start: 'top 85%' },
          },
        );
      });
    }, pageRef);
    return () => ctx.revert();
  }, [prefersReducedMotion]);

  return (
    <div ref={pageRef}>
      <PageIntro
        eyebrow="Experience"
        title="Freelance AI automation and networking labs"
        description="Client automation delivery plus structured networking practice grounded in Cisco lab work."
      />

      <Section
        id="experience-timeline"
        eyebrow="Roles"
        title="Work history"
        description="Directly from Fermín Espinoza’s CV."
      >
        <div className="timeline-grid">
          {experiences.map((item) => (
            <TimelineItem key={item.role} {...item} />
          ))}
        </div>
      </Section>

      <Section
        id="experience-cta"
        eyebrow="Let’s collaborate"
        title="Available for automation builds and networking support"
        description="Fast prototypes, reliable rollouts, and documented fixes."
      >
        <div className="cta-panel card">
          <div>
            <h3>Let’s discuss your stack</h3>
            <p className="muted">
              From webhook-driven automations to L1–L3 troubleshooting, responses stay grounded in repeatable steps.
            </p>
          </div>
          <div className="hero-actions">
            <CTAButton to="/contact">Contact</CTAButton>
            <CTAButton href="/Fermin_Espinoza_CV.pdf" download variant="ghost">
              Download CV
            </CTAButton>
          </div>
        </div>
        <p className="muted text-center">
          Prefer email? Reach out at <a href={`mailto:${profile.email}`}>{profile.email}</a>.
        </p>
      </Section>
    </div>
  );
}
