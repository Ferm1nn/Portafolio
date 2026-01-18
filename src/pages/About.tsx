import { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { PageIntro } from '../components/PageIntro';
import { Section } from '../components/Section';
import { CTAButton } from '../components/CTAButton';
import { profile, technicalSkills } from '../data/portfolioData';
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion';

gsap.registerPlugin(ScrollTrigger);

export default function About() {
  const pageRef = useRef<HTMLDivElement | null>(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      if (prefersReducedMotion) return;
      gsap.utils.toArray<HTMLElement>('.reveal').forEach((section) => {
        gsap.fromTo(
          section,
          { opacity: 0, y: 24 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: 'power2.out',
            scrollTrigger: { trigger: section, start: 'top 85%' },
          },
        );
      });
    }, pageRef);
    return () => ctx.revert();
  }, [prefersReducedMotion]);

  return (
    <div ref={pageRef}>
      <PageIntro
        eyebrow="About"
        title="Profile summary"
        description="Systems engineering student focused on automation, networking, and structured support."
      />

      <Section
        id="about-summary"
        eyebrow="Who I am"
        title="Grounded, reliable, and deliberate"
        description={profile.summary}
      >
        <div className="grid two">
          <div className="card">
            <h3>Contact</h3>
            <ul className="bullet-list">
              <li>
                Email: <a href={`mailto:${profile.email}`}>{profile.email}</a>
              </li>
              <li>
                LinkedIn:{' '}
                <a href={profile.linkedin} target="_blank" rel="noreferrer">
                  {profile.linkedin}
                </a>
              </li>
              <li>Location: {profile.location}</li>
              <li>Phone: {profile.phone}</li>
            </ul>
          </div>
          <div className="card">
            <h3>How I work</h3>
            <ul className="bullet-list">
              <li>Structured troubleshooting across layers with clear documentation.</li>
              <li>Automation-first thinking with n8n, Supabase, and API integrations.</li>
              <li>Concise updates and maintainable, documented fixes for handoffs.</li>
              <li>Values maintainable handoffs and measurable reliability improvements.</li>
            </ul>
            <div className="hero-actions">
              <CTAButton href="/Fermin_Espinoza_CV.pdf" download>
                Download CV
              </CTAButton>
              <CTAButton to="/contact" variant="ghost">
                Contact
              </CTAButton>
            </div>
          </div>
        </div>
      </Section>

      <Section
        id="about-focus"
        eyebrow="Focus areas"
        title="Domains I lean on daily"
        description="Highlights from the CV’s technical skills."
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
