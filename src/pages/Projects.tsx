import { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { PageIntro } from '../components/PageIntro';
import { Section } from '../components/Section';
import { CTAButton } from '../components/CTAButton';
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion';

gsap.registerPlugin(ScrollTrigger);

export default function Projects() {
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
        eyebrow="Projects"
        title="Portfolio expansion placeholder"
        description="No project cards here yet—reserved for future case studies once they ship."
      />

      <Section
        id="projects-empty"
        eyebrow="In progress"
        title="Projects page ready for future additions"
        description="This space stays clean until new case studies are ready to share."
      >
        <div className="empty-state card">
          <p className="lead">No projects listed yet.</p>
          <p className="muted">Check back soon or reach out directly for relevant work samples.</p>
          <div className="hero-actions">
            <CTAButton to="/contact">Contact</CTAButton>
            <CTAButton href="/Fermin_Espinoza_CV.pdf" download variant="ghost">
              Download CV
            </CTAButton>
          </div>
        </div>
      </Section>
    </div>
  );
}
