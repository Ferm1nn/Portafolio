import { useRef } from 'react';
import { expandedSkills, profile, technicalSkills } from '../data/portfolioData';
import { Section } from '../components/Section';
import { ExpandedSkillCard, SkillCategoryCard } from '../components/SkillCard';
import { PageIntro } from '../components/PageIntro';
import { CTAButton } from '../components/CTAButton';
import { Card } from '../components/Card';
import { useMotion } from '../hooks/useMotion';

export default function Skills() {
  const pageRef = useRef<HTMLDivElement | null>(null);
  useMotion(pageRef);

  return (
    <div ref={pageRef}>
      <PageIntro
        eyebrow="Skills"
        title="Technical strengths grounded in real delivery"
        description="From structured troubleshooting to no-code automation, every skill maps back to lab work and real delivery."
      />

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
