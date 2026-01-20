import { Section } from '../components/Section';
import { CTAButton } from '../components/CTAButton';
import { TimelineItem } from '../components/TimelineItem';
import { experiences } from '../data/portfolioData';

export function ExperienceSection() {
  return (
    <Section
      id="experience"
      eyebrow="Experience"
      title="Automation delivery and structured network labs"
      description="Hands-on delivery across integrations, documentation, and repeatable troubleshooting."
    >
      <div className="timeline-grid">
        {experiences.map((item, index) => (
          <TimelineItem key={item.role} index={index} {...item} />
        ))}
      </div>
      <div className="section-cta">
        <CTAButton to="/experience">View detailed experience</CTAButton>
      </div>
    </Section>
  );
}
