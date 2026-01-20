import { useRef } from 'react';
import { PageIntro } from '../components/PageIntro';
import { Section } from '../components/Section';
import { CTAButton } from '../components/CTAButton';
import { Card } from '../components/Card';
import { useMotion } from '../hooks/useMotion';
import { ProjectsSection } from '../sections/ProjectsSection';

export default function Projects() {
  const pageRef = useRef<HTMLDivElement | null>(null);
  useMotion(pageRef);

  return (
    <div ref={pageRef}>
      <PageIntro
        eyebrow="Projects"
        title="Automation and networking case studies"
        description="Outcome-driven builds with clear problems, solutions, and measurable impact placeholders."
      />

      <ProjectsSection />

      <Section
        id="projects-cta"
        eyebrow="Need a build?"
        title="Share the context and desired outcome"
        description="I can scope automation and support work quickly with clear deliverables."
      >
        <Card className="cta-panel" tilt={false}>
          <div>
            <h3>Request a walkthrough</h3>
            <p className="muted">Send a short brief with tools, constraints, and timing.</p>
          </div>
          <div className="hero-actions">
            <CTAButton to="/contact">Contact</CTAButton>
          </div>
        </Card>
      </Section>
    </div>
  );
}
