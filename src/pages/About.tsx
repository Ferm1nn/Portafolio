import { useRef } from 'react';
import { PageIntro } from '../components/PageIntro';
import { Section } from '../components/Section';
import { profile, technicalSkills } from '../data/portfolioData';
import { AnimatedCard } from '../components/AnimatedCard';
import { useMotion } from '../hooks/useMotion';

export default function About() {
  const pageRef = useRef<HTMLDivElement | null>(null);
  useMotion(pageRef);

  return (
    <div ref={pageRef}>
      <PageIntro
        eyebrow="About"
        title="Profile summary"
        description="Network technician focused on cybersecurity, networking, and structured IT support."
      />

      <Section
        id="about-summary"
        eyebrow="Who I am"
        title="Grounded, reliable, and deliberate"
        description={profile.summary}
      >
        <div className="grid two">
          <AnimatedCard>
            <h3>How I work</h3>
            <ul className="bullet-list">
              <li>Structured troubleshooting across layers with clear documentation.</li>
              <li>Automation-first thinking with n8n, Supabase, and API integrations.</li>
              <li>Concise updates and maintainable, documented fixes for handoffs.</li>
              <li>Values maintainable handoffs and measurable reliability improvements.</li>
            </ul>
          </AnimatedCard>
        </div>
      </Section>

      <Section
        id="about-focus"
        eyebrow="Focus areas"
        title="Domains I lean on daily"
        description="Highlights from technical skills."
      >
        <div className="pill-row">
          {technicalSkills.flatMap((category) =>
            category.items.map((item) => (
              <span key={`${category.title}-${item}`} className="pill">
                {item}
              </span>
            )),
          )}
        </div>
      </Section>
    </div>
  );
}
