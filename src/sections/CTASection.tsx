import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { Section } from '../components/Section';

export function CTASection() {
  return (
    <Section
      id="cta"
      eyebrow="Collaboration"
      title="Ready to automate, support, and scale"
      description="Reach out for automation builds, network troubleshooting, or deployment support."
    >
      <Card className="cta-panel" tilt={false}>
        <div>
          <h3 data-tilt-layer="title">Let us talk</h3>
          <p className="muted" data-tilt-layer="meta">
            Email, LinkedIn, or a quick call - whatever works for you.
          </p>
        </div>
        <div className="hero-actions">
          <Button to="/contact">Contact</Button>
        </div>
      </Card>
    </Section>
  );
}
