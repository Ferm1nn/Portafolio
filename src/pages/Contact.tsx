import type { FormEvent } from 'react';
import { useRef } from 'react';
import { PageIntro } from '../components/PageIntro';
import { Section } from '../components/Section';
import { profile } from '../data/portfolioData';
import { AnimatedCard } from '../components/AnimatedCard';
import { useMotion } from '../hooks/useMotion';

export default function Contact() {
  const pageRef = useRef<HTMLDivElement | null>(null);
  useMotion(pageRef);

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
          <AnimatedCard>
            <h3>Email</h3>
            <a className="lead" href={`mailto:${profile.email}`}>
              {profile.email}
            </a>
            <p className="muted">Preferred channel for automation briefs, support requests, or availability checks.</p>
          </AnimatedCard>
          <AnimatedCard>
            <h3>LinkedIn</h3>
            <a className="lead" href={profile.linkedin} target="_blank" rel="noreferrer">
              {profile.linkedin}
            </a>
            <p className="muted">Connect for updates or to sync on work-in-progress items.</p>
          </AnimatedCard>
        </div>
        <div className="grid two">
          <AnimatedCard>
            <h3>Location</h3>
            <p className="lead">{profile.location}</p>
            <p className="muted">Remote-friendly for async collaboration.</p>
          </AnimatedCard>
          <AnimatedCard>
            <h3>CV</h3>
            <p className="muted">Happy to share details—just ask via email or LinkedIn.</p>
          </AnimatedCard>
        </div>
      </Section>

      <Section
        id="contact-form"
        eyebrow="Optional form"
        title="Send a quick note"
        description="Front-end only—no backend wiring. Use email/LinkedIn for guaranteed delivery."
      >
        <AnimatedCard>
          <form className="contact-form" onSubmit={handleSubmit}>
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
        </AnimatedCard>
      </Section>
    </div>
  );
}
