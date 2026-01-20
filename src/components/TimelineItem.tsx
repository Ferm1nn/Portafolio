import type { Education, Experience } from '../data/portfolioData';
import { Badge } from './Badge';
import { ExpandableCard } from './ExpandableCard';

type TimelineItemProps = {
  type?: 'experience' | 'education';
  index?: number;
} & (Experience | Education);

export function TimelineItem({ index, ...props }: TimelineItemProps) {
  const isExperience = (props as Experience).organisation !== undefined;
  const direction = typeof index === 'number' ? (index % 2 === 0 ? 'left' : 'right') : 'left';
  const experience = props as Experience;
  const education = props as Education;

  const modalContent = isExperience ? (
    <>
      <div className="expand-section">
        <h4>Overview</h4>
        <p className="muted">{experience.context}</p>
      </div>
      <div className="expand-section">
        <h4>Tools</h4>
        <div className="pill-row">
          {experience.tools.map((tool) => (
            <Badge key={tool}>{tool}</Badge>
          ))}
        </div>
      </div>
      <div className="expand-section">
        <h4>What I delivered</h4>
        <ul className="expand-list">
          {experience.bullets.map((bullet) => (
            <li key={bullet}>{bullet}</li>
          ))}
        </ul>
      </div>
      <div className="expand-section">
        <h4>What I shipped</h4>
        <ul className="expand-list">
          {experience.shipped.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>
      <div className="expand-section">
        <h4>Proof / metrics</h4>
        <p className="muted">[ADD METRIC: outcome]</p>
      </div>
      <div className="expand-section">
        <h4>Links</h4>
        <p className="muted">[ADD LINK: case study]</p>
      </div>
    </>
  ) : (
    <>
      <div className="expand-section">
        <h4>What it enabled</h4>
        <p className="muted">{education.enabled}</p>
      </div>
      <div className="expand-section">
        <h4>Key topics</h4>
        <div className="pill-row">
          {education.topics.map((topic) => (
            <Badge key={topic}>{topic}</Badge>
          ))}
        </div>
      </div>
      <div className="expand-section">
        <h4>Status</h4>
        <p className="muted">{education.status}</p>
      </div>
      <div className="expand-section">
        <h4>Links</h4>
        <p className="muted">[ADD LINK: coursework]</p>
      </div>
    </>
  );

  return (
    <ExpandableCard
      className="timeline-item"
      data-direction={direction}
      data-timeline-item="true"
      modalTitle={isExperience ? experience.role : education.title}
      modalContent={modalContent}
    >
      <div className="timeline-meta">
        <p className="eyebrow">{props.period}</p>
        <h3 data-tilt-layer="title">{isExperience ? experience.role : education.title}</h3>
        <p className="muted" data-tilt-layer="meta">
          {isExperience ? `${experience.organisation} | ${experience.location}` : education.institution}
        </p>
        {isExperience && (
          <p className="muted" data-tilt-layer="meta">
            {experience.context}
          </p>
        )}
      </div>
      {isExperience ? (
        <>
          <div className="pill-row" data-tilt-layer="badges">
            {experience.tools.map((tool) => (
              <Badge key={tool}>{tool}</Badge>
            ))}
          </div>
          <ul className="bullet-list" data-tilt-layer="bullets">
            {experience.bullets.map((bullet) => (
              <li key={bullet}>{bullet}</li>
            ))}
          </ul>
        </>
      ) : (
        <div className="pill-row" data-tilt-layer="badges">
          {education.topics.map((topic) => (
            <Badge key={topic}>{topic}</Badge>
          ))}
        </div>
      )}
    </ExpandableCard>
  );
}
