import type { Education, Experience } from '../data/portfolioData';

type TimelineItemProps = { type?: 'experience' | 'education' } & (Experience | Education);

export function TimelineItem(props: TimelineItemProps) {
  const isExperience = (props as Experience).organisation !== undefined;

  return (
    <div className="timeline-item card">
      <div className="timeline-meta">
        <p className="eyebrow">{props.period}</p>
        <h3>{isExperience ? (props as Experience).role : (props as Education).title}</h3>
        <p className="muted">
          {isExperience
            ? `${(props as Experience).organisation} · ${(props as Experience).location}`
            : (props as Education).institution}
        </p>
      </div>
      {isExperience && (props as Experience).bullets && (
        <ul className="bullet-list">
          {(props as Experience).bullets.map((bullet) => (
            <li key={bullet}>{bullet}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
