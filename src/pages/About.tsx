import { useRef } from 'react';
import { Section } from '../components/Section';
import { profile, technicalSkills } from '../data/portfolioData';
import { Card } from '../components/Card';
import { Badge } from '../components/Badge';
import { useMotion } from '../hooks/useMotion';
import { useIsMobile } from '../hooks/useIsMobile';
import { CircuitBackground } from '../components/CircuitBackground';
import { MobileBackground } from '../components/MobileBackground';
import { EducationSection } from '../sections/EducationSection';

export default function About() {
  const pageRef = useRef<HTMLDivElement | null>(null);
  const isMobile = useIsMobile();
  useMotion(pageRef);

  return (
    <div ref={pageRef} style={{ position: 'relative' }}>
      {isMobile ? <MobileBackground variant="circuit" /> : <CircuitBackground />}
      <div className="page-intro reveal">
        <div className="page-intro-content">
          <p className="eyebrow">About</p>
          <h1 data-split="words">Profile summary</h1>
          <p className="lead">Network technician focused on cybersecurity, networking, and structured IT support.</p>
        </div>
      </div>

      <Section
        id="about-summary"
        eyebrow="Who I am"
        title="Grounded, reliable, and deliberate"
        description={profile.summary}
      >
        <div className="grid two">
          <Card>
            <h3 data-tilt-layer="title">How I work</h3>
            <ul className="bullet-list" data-tilt-layer="bullets">
              <li>Structured troubleshooting across layers with clear documentation.</li>
              <li>Automation-first thinking with n8n, Supabase, and API integrations.</li>
              <li>Concise updates and maintainable, documented fixes for handoffs.</li>
              <li>Outcome-driven delivery with measurable improvements [ADD METRIC].</li>
            </ul>
          </Card>
          <Card>
            <h3 data-tilt-layer="title">What I prioritize</h3>
            <ul className="bullet-list" data-tilt-layer="bullets">
              <li>Clear runbooks and reusable troubleshooting steps.</li>
              <li>Automation that removes manual handoffs and errors.</li>
              <li>Stable networking fundamentals validated end to end.</li>
              <li>Fast feedback loops and reliable communication.</li>
            </ul>
          </Card>
        </div>
      </Section>

      <Section
        id="about-focus"
        eyebrow="Focus areas"
        title="Domains I lean on daily"
        description="Highlights pulled directly from the capability map."
      >
        <div className="pill-row">
          {technicalSkills.flatMap((category) =>
            category.tools.map((item) => (
              <Badge key={`${category.title}-${item}`}>{item}</Badge>
            )),
          )}
        </div>
      </Section>

      <EducationSection />
    </div>
  );
}
