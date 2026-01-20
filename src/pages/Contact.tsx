import type { FormEvent } from 'react';
import { useRef } from 'react';
import { PageIntro } from '../components/PageIntro';
import { Section } from '../components/Section';
import { profile } from '../data/portfolioData';
import { Card } from '../components/Card';
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
        title="Let us connect"
        description="Share the context, stack, and desired outcomes. Responses stay practical and rooted in hands-on delivery."
      />

      <Section id="contact-info" eyebrow="Direct lines" title="Contact details">
        <div className="grid two">
          <Card tilt={false}>
            <h3 data-tilt-layer="title">Email</h3>
            <a className="lead" href={`mailto:${profile.email}`}>
              {profile.email}
            </a>
            <p className="muted">Preferred channel for automation briefs, support requests, or availability checks.</p>
          </Card>
          <Card tilt={false}>
            <h3 data-tilt-layer="title">LinkedIn</h3>
            <a className="lead" href={profile.linkedin} target="_blank" rel="noreferrer">
              {profile.linkedin}
            </a>
            <p className="muted">Connect for updates or to sync on work-in-progress items.</p>
          </Card>
        </div>
        <div className="grid two">
          <Card tilt={false}>
            <h3 data-tilt-layer="title">Location</h3>
            <p className="lead">{profile.location}</p>
            <p className="muted">Remote-friendly for async collaboration.</p>
          </Card>
          <Card tilt={false}>
            <h3 data-tilt-layer="title">CV</h3>
            <p className="muted">Happy to share details. Ask via email or LinkedIn.</p>
          </Card>
        </div>
      </Section>

      <Section
        id="contact-form"
        eyebrow="Optional form"
        title="Send a quick note"
        description="Front-end only. Use email or LinkedIn for guaranteed delivery."
      >
        <Card tilt={false}>
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
        </Card>
      </Section>
    </div>
  );
}
