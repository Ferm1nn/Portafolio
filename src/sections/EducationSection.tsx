import { Badge } from '../components/Badge';
import { Card } from '../components/Card';
import { Section } from '../components/Section';
import { TimelineItem } from '../components/TimelineItem';
import { certifications, education } from '../data/portfolioData';

export function EducationSection() {
  return (
    <Section
      id="education"
      eyebrow="Education & Certifications"
      title="Learning paths that support delivery"
      description="Academic progress plus Cisco-aligned certifications to back up hands-on lab work."
    >
      <div className="grid two">
        {education.map((item, index) => (
          <TimelineItem key={item.title} index={index} {...item} />
        ))}
      </div>
      <div className="cert-grid">
        {certifications.map((cert) => (
          <Card className="cert-card" key={cert.name} tilt={false}>
            <div className="cert-meta">
              <Badge>{cert.status}</Badge>
              <span className="muted">{cert.year}</span>
            </div>
            <h4 data-tilt-layer="title">{cert.name}</h4>
            <p className="muted" data-tilt-layer="meta">
              {cert.description}
            </p>
          </Card>
        ))}
      </div>
    </Section>
  );
}
