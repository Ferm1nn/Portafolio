import type { ExpandedSkill, SkillCategory } from '../data/portfolioData';

type SkillCardProps = {
  title: string;
  items?: string[];
  highlight?: string;
  bullets?: string[];
};

export function SkillCard({ title, items, highlight, bullets }: SkillCardProps) {
  return (
    <div className="card skill-card">
      <div className="card-header">
        <h3>{title}</h3>
        {highlight && <p className="muted">{highlight}</p>}
      </div>
      {items && (
        <ul className="pill-list">
          {items.map((item) => (
            <li key={item} className="pill">
              {item}
            </li>
          ))}
        </ul>
      )}
      {bullets && (
        <ul className="bullet-list">
          {bullets.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      )}
    </div>
  );
}

export function ExpandedSkillCard({ title, focus, bullets }: ExpandedSkill) {
  return <SkillCard title={title} highlight={focus} bullets={bullets} />;
}

export function SkillCategoryCard({ title, items }: SkillCategory) {
  return <SkillCard title={title} items={items} />;
}
