type PageIntroProps = {
  title: string;
  eyebrow?: string;
  description?: string;
};

export function PageIntro({ title, eyebrow, description }: PageIntroProps) {
  return (
    <div className="page-intro reveal">
      {eyebrow && <p className="eyebrow">{eyebrow}</p>}
      <h1>{title}</h1>
      {description && <p className="lead">{description}</p>}
    </div>
  );
}
