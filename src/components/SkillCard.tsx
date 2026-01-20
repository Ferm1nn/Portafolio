import type { Capability } from '../data/portfolioData';
import { Badge } from './Badge';
import { ExpandableCard } from './ExpandableCard';

type SkillCardProps = {
  skill: Capability;
};

export function SkillCard({ skill }: SkillCardProps) {
  const modalContent = (
    <>
      <div className="expand-section">
        <h4>Overview</h4>
        <p className="muted">{skill.summary}</p>
      </div>
      <div className="expand-section">
        <h4>Tools</h4>
        <div className="pill-row">
          {skill.tools.map((tool) => (
            <Badge key={tool}>{tool}</Badge>
          ))}
        </div>
      </div>
      <div className="expand-section">
        <h4>What I delivered</h4>
        <ul className="expand-list">
          {skill.bullets.map((bullet) => (
            <li key={bullet}>{bullet}</li>
          ))}
        </ul>
      </div>
      <div className="expand-section">
        <h4>Proof / metrics</h4>
        <p className="muted">{skill.proof}</p>
      </div>
      {skill.issues && (
        <div className="expand-section">
          <h4>Typical issues</h4>
          <ul className="expand-list">
            {skill.issues.map((issue) => (
              <li key={issue}>{issue}</li>
            ))}
          </ul>
        </div>
      )}
      <div className="expand-section">
        <h4>Links</h4>
        <p className="muted">[ADD LINK: related work]</p>
      </div>
    </>
  );

  return (
    <ExpandableCard modalTitle={skill.title} modalContent={modalContent} className="skill-card">
      <div className="card-header">
        <h3 data-tilt-layer="title">{skill.title}</h3>
        <p className="muted" data-tilt-layer="meta">
          {skill.summary}
        </p>
      </div>
      <div className="pill-row" data-tilt-layer="badges">
        {skill.tools.map((tool) => (
          <Badge key={tool}>{tool}</Badge>
        ))}
      </div>
      <ul className="bullet-list" data-tilt-layer="bullets">
        {skill.bullets.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
      <p className="muted proof-line" data-tilt-layer="meta">
        {skill.proof}
      </p>
    </ExpandableCard>
  );
}

export function ExpandedSkillCard(skill: Capability) {
  return <SkillCard skill={skill} />;
}

export function SkillCategoryCard(skill: Capability) {
  return <SkillCard skill={skill} />;
}
