import { useRef } from 'react';
import { heroMetrics } from '../data/portfolioData';
import { Card } from '../components/Card';
import { useMotion } from '../hooks/useMotion';
import { TcpLayerStack } from '../components/TcpLayerStack';
import { ReactiveMeshBackground } from '../components/ReactiveMeshBackground';
import AmbientCyberLayer from '../components/AmbientCyberLayer';

export default function Skills() {
  const pageRef = useRef<HTMLDivElement | null>(null);
  useMotion(pageRef);

  return (
    <div ref={pageRef} style={{ position: 'relative' }}>
      <AmbientCyberLayer />
      <ReactiveMeshBackground />
      <div className="page-intro reveal">
        <div className="page-intro-content">
          <p className="eyebrow">Skills</p>
          <h1 data-split="words">Technical Competencies: The TCP/IP Model</h1>
          <p className="lead">A comprehensive demonstration of my grounded skills, architected across the 5-layer TCP/IP stack.</p>
        </div>
      </div>

      {/* Full-width container for the Monolith Stack */}
      <div style={{ width: '100%', padding: '0 5vw', marginBottom: '4rem', display: 'flex', justifyContent: 'center' }}>
        <TcpLayerStack />
      </div>

      <div className="container" style={{ marginBottom: '4rem' }}>
        {/* Metrics row */}
        <div className="grid three" style={{ gap: '1rem' }}>
          {heroMetrics.map((metric) => (
            <Card key={metric.label} className="metric-card" tilt={false} style={{ padding: '1rem', textAlign: 'center' }}>
              <div className="metric-value" style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--accent)' }}>
                {metric.value}
                {metric.suffix && <span className="metric-suffix" style={{ fontSize: '1rem', color: 'var(--text-muted)' }}>{metric.suffix}</span>}
              </div>
              <div className="metric-label" style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{metric.label}</div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

