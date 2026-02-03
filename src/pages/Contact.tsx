import type { FormEvent } from 'react';
import { useRef, useState } from 'react';
import { PageIntro } from '../components/PageIntro';
import { Section } from '../components/Section';
import { profile } from '../data/portfolioData';
import { Card } from '../components/Card';
import { useMotion } from '../hooks/useMotion';

type FormStatus = 'idle' | 'submitting' | 'success' | 'error';

export default function Contact() {
  const pageRef = useRef<HTMLDivElement | null>(null);
  const formRef = useRef<HTMLFormElement | null>(null);
  const [status, setStatus] = useState<FormStatus>('idle');
  useMotion(pageRef);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!formRef.current) return;

    setStatus('submitting');

    const formData = new FormData(formRef.current);
    const data = {
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      topic: formData.get('topic') as string,
      message: formData.get('message') as string,
    };

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        throw new Error('Submission failed');
      }

      setStatus('success');
      formRef.current.reset();
    } catch (error) {
      console.error('Contact form error:', error);
      setStatus('error');
    }
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
        eyebrow="Form"
        title="Send a quick note"
        description="Use email or LinkedIn for guaranteed delivery."
      >
        <Card tilt={false}>
          {status === 'success' ? (
            <div className="p-8 text-center">
              <h3 className="text-2xl font-bold mb-4">Message sent!</h3>
              <p className="muted mb-6">Thanks for reaching out. I'll get back to you shortly.</p>
              <button onClick={() => setStatus('idle')} className="btn primary">Send another</button>
            </div>
          ) : (
            <form ref={formRef} className="contact-form" onSubmit={handleSubmit}>
              <label>
                Name
                <input name="name" type="text" placeholder="Your name" required disabled={status === 'submitting'} />
              </label>
              <label>
                Email
                <input
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                  required
                  disabled={status === 'submitting'}
                />
              </label>
              <label>
                What do you need?
                <select name="topic" defaultValue="automation" disabled={status === 'submitting'}>
                  <option value="automation">Automation build</option>
                  <option value="networking">Networking support</option>
                  <option value="consulting">Consulting</option>
                  <option value="other">Other</option>
                </select>
              </label>
              <label>
                Message
                <textarea
                  name="message"
                  rows={4}
                  placeholder="Context, tools, goals"
                  required
                  disabled={status === 'submitting'}
                />
              </label>

              {status === 'error' && (
                <p className="text-red-500 mb-4">Something went wrong. Please try again or email directly.</p>
              )}

              <button type="submit" className="btn primary" disabled={status === 'submitting'}>
                {status === 'submitting' ? 'Sending...' : 'Send Message'}
              </button>
            </form>
          )}
        </Card>
      </Section>
    </div>
  );
}

