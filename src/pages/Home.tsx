import { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  certifications,
  education,
  expandedSkills,
  experiences,
  profile,
  technicalSkills,
} from '../data/portfolioData';
import { Section } from '../components/Section';
import { CTAButton } from '../components/CTAButton';
import { ExpandedSkillCard, SkillCategoryCard } from '../components/SkillCard';
import { TimelineItem } from '../components/TimelineItem';
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion';

gsap.registerPlugin(ScrollTrigger);

export default function Home() {
  const heroRef = useRef<HTMLDivElement | null>(null);
  const pageRef = useRef<HTMLDivElement | null>(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      if (prefersReducedMotion) return;

      gsap.utils.toArray<HTMLElement>('.reveal').forEach((section) => {
        gsap.fromTo(
          section,
          { opacity: 0, y: 32 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: section,
              start: 'top 80%',
            },
          },
        );
      });

      gsap.utils.toArray<HTMLElement>('.parallax-layer').forEach((layer, index) => {
        gsap.to(layer, {
          y: (index + 1) * -25,
          ease: 'none',
          scrollTrigger: {
            trigger: heroRef.current,
            start: 'top top',
            end: 'bottom top',
            scrub: true,
          },
        });
      });
    }, pageRef);

    return () => ctx.revert();
  }, [prefersReducedMotion]);

  return (
    <div ref={pageRef}>
      <section className="hero" ref={heroRef}>
        <div className="parallax-layer layer-1" />
        <div className="parallax-layer layer-2" />
        <div className="parallax-layer layer-3" />
        <div className="hero-grid">
          <div className="hero-content">
            <p className="eyebrow">AI Automation · Networking · Support</p>
            <h1>
              {profile.name}
              <span className="hero-role">{profile.role}</span>
            </h1>
            <p className="lead">{profile.summary}</p>
            <div className="hero-actions">
              <CTAButton to="/contact">Contact</CTAButton>
              <CTAButton href="/Fermin_Espinoza_CV.pdf" download variant="ghost">
                Download CV
              </CTAButton>
            </div>
            <div className="hero-meta">
              <span className="pill">{profile.location}</span>
              <a className="pill link" href={`mailto:${profile.email}`}>
                {profile.email}
              </a>
              <a className="pill link" href={profile.linkedin} target="_blank" rel="noreferrer">
                LinkedIn
              </a>
            </div>
          </div>
          <div className="card hero-panel">
            <div className="eyebrow">Profile</div>
            <ul className="bullet-list">
              <li>Structured troubleshooting across L1–L3 networking and support.</li>
              <li>Automation-first mindset: n8n, Supabase, API integrations.</li>
              <li>Clear documentation and handoffs for reliable operations.</li>
            </ul>
            <div className="hero-tags">
              {['Supabase', 'n8n', 'API integrations', 'IPv4 / TCP/IP', 'Automation', 'ACLs'].map((item) => (
                <span key={item} className="pill">
                  {item}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      <Section
        id="skills"
        eyebrow="Technical Skills"
        title="Built from real lab work and client delivery"
        description="IT support, networking, and automation foundations anchored in the CV."
      >
        <div className="grid three">
          {technicalSkills.slice(0, 3).map((category) => (
            <SkillCategoryCard key={category.title} {...category} />
          ))}
        </div>
        <div className="grid two">
          {technicalSkills.slice(3).map((category) => (
            <SkillCategoryCard key={category.title} {...category} />
          ))}
        </div>
        <div className="section-cta">
          <CTAButton to="/skills" variant="ghost">
            View all skills
          </CTAButton>
        </div>
      </Section>

      <Section
        id="experience"
        eyebrow="Experience"
        title="Freelance AI automation and networking labs"
        description="Hands-on delivery across automation, integrations, and structured network troubleshooting."
      >
        <div className="timeline-grid">
          {experiences.map((item) => (
            <TimelineItem key={item.role} {...item} />
          ))}
        </div>
        <div className="section-cta">
          <CTAButton to="/experience">View detailed experience</CTAButton>
        </div>
      </Section>

      <Section
        id="education"
        eyebrow="Education & Certifications"
        title="Learning paths that support delivery"
        description="Academic progress plus Cisco-aligned certifications."
      >
        <div className="grid two">
          {education.map((item) => (
            <TimelineItem key={item.title} {...item} />
          ))}
        </div>
        <div className="cert-grid">
          {certifications.map((cert) => (
            <div className="card cert-card" key={cert.name}>
              <div className="eyebrow">{cert.year}</div>
              <h4>{cert.name}</h4>
              <p className="muted">{cert.description}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section
        id="expanded"
        eyebrow="Expanded Skills"
        title="Clarity on the new capabilities"
        description="Explicit coverage of no-code automation, programming, and deployment know-how."
      >
        <div className="grid three">
          {expandedSkills.slice(0, 3).map((skill) => (
            <ExpandedSkillCard key={skill.title} {...skill} />
          ))}
        </div>
        <div className="grid three">
          {expandedSkills.slice(3).map((skill) => (
            <ExpandedSkillCard key={skill.title} {...skill} />
          ))}
        </div>
        <div className="section-cta">
          <CTAButton to="/skills" variant="ghost">
            Explore expanded skills
          </CTAButton>
        </div>
      </Section>

      <Section
        id="cta"
        eyebrow="Collaboration"
        title="Ready to automate, support, and scale"
        description="Reach out for automation builds, network troubleshooting, or deployment support."
      >
        <div className="cta-panel card">
          <div>
            <h3>Let&apos;s talk</h3>
            <p className="muted">Email, LinkedIn, or a quick call—whatever works for you.</p>
          </div>
          <div className="hero-actions">
            <CTAButton to="/contact">Contact</CTAButton>
            <CTAButton href="/Fermin_Espinoza_CV.pdf" download variant="ghost">
              Download CV
            </CTAButton>
          </div>
        </div>
      </Section>
    </div>
  );
}
