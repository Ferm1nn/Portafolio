import type { Education, Experience } from '../data/portfolioData';
import { AnimatedCard } from './AnimatedCard';

type TimelineItemProps = {
  type?: 'experience' | 'education';
  index?: number;
} & (Experience | Education);

export function TimelineItem({ index, ...props }: TimelineItemProps) {
  const isExperience = (props as Experience).organisation !== undefined;
  const direction = typeof index === 'number' ? (index % 2 === 0 ? 'left' : 'right') : 'left';

  return (
    <AnimatedCard
      className="timeline-item"
      data-direction={direction}
      data-timeline-item="true"
    >
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
    </AnimatedCard>
  );
}
