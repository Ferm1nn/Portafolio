import { useRef } from 'react';
import { expandedSkills, profile, technicalSkills } from '../data/portfolioData';
import { Section } from '../components/Section';
import { ExpandedSkillCard, SkillCategoryCard } from '../components/SkillCard';
import { PageIntro } from '../components/PageIntro';
import { CTAButton } from '../components/CTAButton';
import { AnimatedCard } from '../components/AnimatedCard';
import { useMotion } from '../hooks/useMotion';

export default function Skills() {
  const pageRef = useRef<HTMLDivElement | null>(null);
  useMotion(pageRef);

  return (
    <div ref={pageRef}>
      <PageIntro
        eyebrow="Skills"
        title="Technical strengths grounded in real delivery"
        description="From structured troubleshooting to no-code automation, all mapped directly to Fermín Espinoza’s CV."
      />

      <Section
        id="technical-skills"
        eyebrow="CV Skills"
        title="Technical skills"
        description="IT support, networking, and automation capabilities grouped for clarity."
      >
        <div className="grid three">
          {technicalSkills.map((category) => (
            <SkillCategoryCard key={category.title} {...category} />
          ))}
        </div>
      </Section>

      <Section
        id="expanded-skills"
        eyebrow="New Adds"
        title="Expanded skills"
        description="Explicit coverage of no-code automation, programming depth, and deployment fluency."
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
        description={`Reach out via ${profile.email} or LinkedIn for engagements.`}
      >
        <AnimatedCard className="cta-panel">
          <div>
            <h3>Let’s build reliable workflows</h3>
            <p className="muted">Clear logic, documented handoffs, and maintainable automations.</p>
          </div>
          <CTAButton to="/contact">Contact</CTAButton>
        </AnimatedCard>
      </Section>
    </div>
  );
}
