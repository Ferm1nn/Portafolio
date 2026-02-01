import { useRef } from 'react';
import { expandedSkills, profile, technicalSkills, heroMetrics } from '../data/portfolioData';
import { Section } from '../components/Section';
import { ExpandedSkillCard, SkillCategoryCard } from '../components/SkillCard';
import { PageIntro } from '../components/PageIntro';
import { CTAButton } from '../components/CTAButton';
import { Card } from '../components/Card';
import { useMotion } from '../hooks/useMotion';
import { SkillRadar } from '../components/SkillRadar';
import { Badge } from '../components/Badge';

export default function Skills() {
  const pageRef = useRef<HTMLDivElement | null>(null);
  useMotion(pageRef);

  // Skill proficiency data for radar visualization (Moved from Hero)
  const skillData = [
    { title: 'Networking', level: 85 },
    { title: 'IT Support', level: 90 },
    { title: 'AI Automation', level: 80 },
    { title: 'Python', level: 70 },
    { title: 'Cybersecurity', level: 78 },
    { title: 'Linux', level: 72 },
  ];
  const focusAreas = ['Network Support Technician', 'Cybersecurity', 'Automations'];

  return (
    <div ref={pageRef}>
      <PageIntro
        eyebrow="Skills"
        title="Technical strengths grounded in real delivery"
        description="From structured troubleshooting to no-code automation, every skill maps back to lab work and real delivery."
      />

      <div className="container" style={{ marginBottom: '4rem' }}>
        <div className="grid two" style={{ alignItems: 'start' }}>
          <Card className="skill-radar-card" tilt>
            <SkillRadar skills={skillData} />
            <h3 data-tilt-layer="title" style={{ marginTop: '1rem', textAlign: 'center' }}>Focus areas</h3>
            <div className="pill-row" data-tilt-layer="badges" style={{ justifyContent: 'center' }}>
              {focusAreas.map((focus) => (
                <Badge key={focus}>{focus}</Badge>
              ))}
            </div>
          </Card>

          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', height: '100%' }}>
            <h3>Visualized Expertise</h3>
            <p className="muted">
              This radar chart represents my core competencies and their relative strength based on years of experience and lab work.
            </p>
            <ul style={{ marginTop: '1rem', listStyle: 'disc', paddingLeft: '1.5rem', marginBottom: '2rem' }} className="muted">
              <li><strong>Networking & IT Support</strong> form the foundation of my work.</li>
              <li><strong>Automation & Python</strong> act as force multipliers.</li>
              <li><strong>Cybersecurity</strong> principles is applied across all layers.</li>
            </ul>

            <div className="grid three" style={{ gap: '1rem' }}>
              {heroMetrics.map((metric) => (
                <Card key={metric.label} className="metric-card" tilt={false} style={{ padding: '1rem', textAlign: 'center' }}>
                  <div className="metric-value" style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--accent)' }}>
                    {metric.value}
                    {metric.suffix && <span className="metric-suffix" style={{ fontSize: '1rem', color: 'var(--text-muted)' }}>{metric.suffix}</span>}
                  </div>
                  <div className="metric-label" style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{metric.label}</div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>

      <Section
        id="technical-skills"
        eyebrow="Core skills"
        title="Technical capabilities"
        description="IT support, networking, and automation grouped for clarity and fast scanning."
      >
        <div className="grid three">
          {technicalSkills.map((category) => (
            <SkillCategoryCard key={category.title} {...category} />
          ))}
        </div>
      </Section>

      <Section
        id="expanded-skills"
        eyebrow="Expanded coverage"
        title="Additional capabilities"
        description="No-code automation, programming depth, and deployment fluency when projects demand it."
      >
        <div className="grid three">
          {expandedSkills.map((skill) => (
            <ExpandedSkillCard key={skill.title} {...skill} />
          ))}
        </div>
        <div className="section-cta">
          <CTAButton to="/contact">Discuss a build</CTAButton>
        </div>
      </Section>

      <Section
        id="skills-cta"
        eyebrow="Collaboration"
        title="Available for automation, integration, and support work"
        description={`Reach out via ${profile.email} or LinkedIn for current availability.`}
      >
        <Card className="cta-panel" tilt={false}>
          <div>
            <h3>Let us build reliable workflows</h3>
            <p className="muted">Clear logic, documented handoffs, and maintainable automations.</p>
          </div>
          <CTAButton to="/contact">Contact</CTAButton>
        </Card>
      </Section>
    </div>
  );
}

