import { useRef } from 'react';
import { experiences, profile } from '../data/portfolioData';
import { PageIntro } from '../components/PageIntro';
import { Section } from '../components/Section';
import { TimelineItem } from '../components/TimelineItem';
import { CTAButton } from '../components/CTAButton';
import { Card } from '../components/Card';
import { useMotion } from '../hooks/useMotion';

export default function Experience() {
  const pageRef = useRef<HTMLDivElement | null>(null);
  useMotion(pageRef);

  return (
    <div ref={pageRef}>
      <PageIntro
        eyebrow="Experience"
        title="Automation delivery and networking labs"
        description="Client automation delivery plus structured networking practice grounded in Cisco lab work."
      />

      <Section id="experience-timeline" eyebrow="Roles" title="Work history">
        <div className="timeline-shell" data-timeline-section>
          <div className="timeline-progress-track" aria-hidden="true">
            <span className="timeline-progress" data-timeline-progress />
          </div>
          <div className="timeline-grid">
            {experiences.map((item, index) => (
              <TimelineItem key={item.role} index={index} {...item} />
            ))}
          </div>
        </div>
      </Section>

      <Section
        id="experience-cta"
        eyebrow="Let us collaborate"
        title="Available for automation builds and networking support"
        description="Fast prototypes, reliable rollouts, and documented fixes."
      >
        <Card className="cta-panel" tilt={false}>
          <div>
            <h3>Let us discuss your stack</h3>
            <p className="muted">
              From webhook-driven automations to L1-L3 troubleshooting, responses stay grounded in repeatable steps.
            </p>
          </div>
          <div className="hero-actions">
            <CTAButton to="/contact">Contact</CTAButton>
          </div>
        </Card>
        <p className="muted text-center">
          Prefer email? Reach out at <a href={`mailto:${profile.email}`}>{profile.email}</a>.
        </p>
      </Section>
    </div>
  );
}
