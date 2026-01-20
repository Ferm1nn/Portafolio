type PageIntroProps = {
  title: string;
  eyebrow?: string;
  description?: string;
};

export function PageIntro({ title, eyebrow, description }: PageIntroProps) {
  return (
    <div className="page-intro reveal" data-parallax-root>
      <div className="page-intro-art" aria-hidden="true">
        <span className="intro-orb orb-1" data-parallax data-parallax-speed="0.16" />
        <span className="intro-orb orb-2" data-parallax data-parallax-axis="x" data-parallax-speed="0.28" />
        <span className="intro-orb orb-3" data-parallax data-parallax-speed="0.4" />
      </div>
      <div className="page-intro-content">
        {eyebrow && <p className="eyebrow">{eyebrow}</p>}
        <h1 data-split="words">{title}</h1>
        {description && <p className="lead">{description}</p>}
      </div>
    </div>
  );
}
