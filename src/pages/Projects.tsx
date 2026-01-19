import { useRef } from 'react';
import { PageIntro } from '../components/PageIntro';
import { Section } from '../components/Section';
import { CTAButton } from '../components/CTAButton';
import { AnimatedCard } from '../components/AnimatedCard';
import { useMotion } from '../hooks/useMotion';

export default function Projects() {
  const pageRef = useRef<HTMLDivElement | null>(null);
  useMotion(pageRef);

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
        <AnimatedCard className="empty-state">
          <p className="lead">No projects listed yet.</p>
          <p className="muted">Check back soon or reach out directly for relevant work samples.</p>
          <div className="hero-actions">
            <CTAButton to="/contact">Contact</CTAButton>
          </div>
        </AnimatedCard>
      </Section>
    </div>
  );
}
