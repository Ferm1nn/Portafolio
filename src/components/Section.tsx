import type { PropsWithChildren } from 'react';

type SectionProps = PropsWithChildren<{
  id?: string;
  title: string;
  eyebrow?: string;
  description?: string;
  className?: string;
}>; // simple wrapper for consistent section spacing

export function Section({ id, title, eyebrow, description, children, className }: SectionProps) {
  return (
    <section id={id} className={`section reveal ${className ?? ''}`.trim()}>
      <div className="section-heading">
        {eyebrow && <p className="eyebrow">{eyebrow}</p>}
        <div className="section-title-row">
          <h2>{title}</h2>
          {description && <p className="section-description">{description}</p>}
        </div>
      </div>
      {children}
    </section>
  );
}
