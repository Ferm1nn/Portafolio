import { Section } from '../components/Section';
import { Button } from '../components/Button';
import { SkillCard } from '../components/SkillCard';
import { technicalSkills } from '../data/portfolioData';

export function SkillsSection() {
  return (
    <Section
      id="skills"
      eyebrow="Capabilities"
      title="Support and automation that stays reliable in production"
      description="From structured troubleshooting to automation pipelines, each capability is grounded in lab practice and real delivery."
    >
      <div className="grid three">
        {technicalSkills.slice(0, 3).map((category) => (
          <SkillCard key={category.title} skill={category} />
        ))}
      </div>
      <div className="grid two">
        {technicalSkills.slice(3).map((category) => (
          <SkillCard key={category.title} skill={category} />
        ))}
      </div>
      <div className="section-cta">
        <Button to="/skills" variant="ghost">
          View all skills
        </Button>
      </div>
    </Section>
  );
}
