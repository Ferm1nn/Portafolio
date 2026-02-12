import { Button } from '../components/Button';
import { Section } from '../components/Section';
import { SkillCard } from '../components/SkillCard';
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
          <SkillCard key={skill.title} skill={skill} />
        ))}
      </div>
      <div className="grid three">
        {expandedSkills.slice(3).map((skill) => (
          <ExpandedSkillCard key={skill.title} {...skill} />
        ))}
      </div>
      <div className="section-cta">
        <Button to="/skills" variant="ghost">
          Explore expanded skills
        </Button>
      </div>
    </Section>
  );
}
