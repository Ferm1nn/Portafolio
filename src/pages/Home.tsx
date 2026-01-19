import { useRef } from 'react';
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
import { AnimatedCard } from '../components/AnimatedCard';
import { useMotion } from '../hooks/useMotion';

export default function Home() {
  const pageRef = useRef<HTMLDivElement | null>(null);
  useMotion(pageRef);

  return (
    <div ref={pageRef}>
      <section className="hero" data-parallax-root>
        <div className="hero-grid">
          <div className="hero-content">
            <p className="eyebrow">Network Technician / IT support</p>
            <h1>
              {profile.name}
              <span className="hero-role">{profile.role}</span>
            </h1>
            <p className="lead">{profile.summary}</p>
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
        </div>
      </section>

      <Section
        id="skills"
        eyebrow="Technical Skills"
        title="Built from real lab work and client delivery"
        description="IT support, networking, and automation foundations."
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
          {experiences.map((item, index) => (
            <TimelineItem key={item.role} index={index} {...item} />
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
          {education.map((item, index) => (
            <TimelineItem key={item.title} index={index} {...item} />
          ))}
        </div>
        <div className="cert-grid">
          {certifications.map((cert) => (
            <AnimatedCard className="cert-card" key={cert.name}>
              <div className="eyebrow">{cert.year}</div>
              <h4>{cert.name}</h4>
              <p className="muted">{cert.description}</p>
            </AnimatedCard>
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
        <AnimatedCard className="cta-panel">
          <div>
            <h3>Let&apos;s talk</h3>
            <p className="muted">Email, LinkedIn, or a quick call - whatever works for you.</p>
          </div>
          <div className="hero-actions">
            <CTAButton to="/contact">Contact</CTAButton>
          </div>
        </AnimatedCard>
      </Section>
    </div>
  );
}
