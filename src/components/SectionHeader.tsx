type SectionHeaderProps = {
  title: string;
  eyebrow?: string;
  description?: string;
  align?: 'left' | 'center';
};

export function SectionHeader({ title, eyebrow, description, align = 'left' }: SectionHeaderProps) {
  return (
    <div className={`section-heading section-heading-${align}`}>
      {eyebrow && <p className="eyebrow">{eyebrow}</p>}
      <div className="section-title-row">
        <h2 data-split="words">{title}</h2>
        {description && <p className="section-description">{description}</p>}
      </div>
    </div>
  );
}
