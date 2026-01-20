import { CTAButton } from '../components/CTAButton';
import { Section } from '../components/Section';
import { ExpandedSkillCard } from '../components/SkillCard';
import { expandedSkills } from '../data/portfolioData';

export function ExpandedSkillsSection() {
  return (
    <Section
      id="expanded"
      eyebrow="Expanded Skills"
      title="Coverage beyond the core stack"
      description="Explicit coverage of automation, programming depth, and deployment fluency."
    >
      <div className="grid three">
        {expandedSkills.slice(0, 3).map((skill) => (
          <ExpandedSkillCard key={skill.title} {...skill} />
        ))}
      </div>
      <div className="grid three">
        {expandedSkills.slice(3).map((skill) => (
          <ExpandedSkillCard key={skill.title} {...skill} />
        ))}
      </div>
      <div className="section-cta">
        <CTAButton to="/skills" variant="ghost">
          Explore expanded skills
        </CTAButton>
      </div>
    </Section>
  );
}
