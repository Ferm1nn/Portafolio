import { Badge } from '../components/Badge';
import { Card } from '../components/Card';
import { Section } from '../components/Section';
import { projects } from '../data/portfolioData';

export function ProjectsSection() {
  return (
    <Section
      id="projects"
      eyebrow="Projects"
      title="Selected automation and networking builds"
      description="Real-world workflow and lab work, documented with clear outcomes."
    >
      <div className="grid three project-grid">
        {projects.map((project) => (
          <Card key={project.title} className="project-card">
            <div className="project-header">
              <h3 data-tilt-layer="title">{project.title}</h3>
              <div className="pill-row" data-tilt-layer="badges">
                {project.stack.map((item) => (
                  <Badge key={item}>{item}</Badge>
                ))}
              </div>
            </div>
            <div className="project-body" data-tilt-layer="bullets">
              <p className="muted">
                <strong>Problem:</strong> {project.problem}
              </p>
              <p className="muted">
                <strong>Solution:</strong> {project.solution}
              </p>
              <p className="muted">
                <strong>Outcome:</strong> {project.outcome}
              </p>
            </div>
            <div className="project-links" data-tilt-layer="meta">
              {project.links.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="pill link"
                  onClick={(event) => {
                    if (link.href === '#') {
                      event.preventDefault();
                    }
                  }}
                >
                  {link.label}
                </a>
              ))}
            </div>
          </Card>
        ))}
      </div>
    </Section>
  );
}
