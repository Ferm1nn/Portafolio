import type { FormEvent } from 'react';
import { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { PageIntro } from '../components/PageIntro';
import { Section } from '../components/Section';
import { CTAButton } from '../components/CTAButton';
import { profile } from '../data/portfolioData';
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion';

gsap.registerPlugin(ScrollTrigger);

export default function Contact() {
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

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
  };

  return (
    <div ref={pageRef}>
      <PageIntro
        eyebrow="Contact"
        title="Let’s connect"
        description="Share the context, stack, and desired outcomes—responses stay practical and rooted in the CV skill set."
      />

      <Section id="contact-info" eyebrow="Direct lines" title="Contact details">
        <div className="grid two">
          <div className="card">
            <h3>Email</h3>
            <a className="lead" href={`mailto:${profile.email}`}>
              {profile.email}
            </a>
            <p className="muted">Preferred channel for automation briefs, support requests, or availability checks.</p>
          </div>
          <div className="card">
            <h3>LinkedIn</h3>
            <a className="lead" href={profile.linkedin} target="_blank" rel="noreferrer">
              {profile.linkedin}
            </a>
            <p className="muted">Connect for updates or to sync on work-in-progress items.</p>
          </div>
        </div>
        <div className="grid two">
          <div className="card">
            <h3>Location</h3>
            <p className="lead">{profile.location}</p>
            <p className="muted">Remote-friendly for async collaboration.</p>
          </div>
          <div className="card">
            <h3>CV</h3>
            <CTAButton href="/Fermin_Espinoza_CV.pdf" download>
              Download CV
            </CTAButton>
            <p className="muted">The same content that powers this portfolio.</p>
          </div>
        </div>
      </Section>

      <Section
        id="contact-form"
        eyebrow="Optional form"
        title="Send a quick note"
        description="Front-end only—no backend wiring. Use email/LinkedIn for guaranteed delivery."
      >
        <form className="contact-form card" onSubmit={handleSubmit}>
          <label>
            Name
            <input name="name" type="text" placeholder="Your name" required />
          </label>
          <label>
            Email
            <input name="email" type="email" placeholder="you@example.com" required />
          </label>
          <label>
            What do you need?
            <select name="topic" defaultValue="automation">
              <option value="automation">Automation build</option>
              <option value="networking">Networking support</option>
              <option value="consulting">Consulting</option>
              <option value="other">Other</option>
            </select>
          </label>
          <label>
            Message
            <textarea name="message" rows={4} placeholder="Context, tools, goals" />
          </label>
          <button type="submit" className="btn primary">
            Send (front-end only)
          </button>
        </form>
      </Section>
    </div>
  );
}
