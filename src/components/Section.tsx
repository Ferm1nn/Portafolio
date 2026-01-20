import type { PropsWithChildren } from 'react';
import { SectionHeader } from './SectionHeader';

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
      <SectionHeader title={title} eyebrow={eyebrow} description={description} />
      {children}
    </section>
  );
}
