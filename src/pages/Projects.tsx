import { Terminal, Code2 } from 'lucide-react';
import ProjectPlaceholder from '../components/projects/ProjectPlaceholder';
import { HexGridBackground } from '../components/HexGridBackground';
import AutomationShowcase from '../components/labs/AutomationShowcase';

const Projects = () => {
  return (
    <div className="min-h-screen px-4 pt-24 pb-16 md:px-8">
      <HexGridBackground />
      <div className="mx-auto max-w-6xl">

        {/* Page Header */}
        <div className="mb-16">
          <h1 className="text-4xl font-bold tracking-tight text-white md:text-5xl">
            Projects <span className="text-cyan-500">&</span> Automations
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-slate-400">
            A showcase of full-stack engineering, network automation, and real-world client builds.
          </p>
        </div>

        {/* Section 1: Selected Client Projects */}
        <section className="mb-20">
          <div className="mb-8 flex items-center space-x-2">
            <Code2 className="h-5 w-5 text-cyan-500" />
            <h2 className="text-xl font-semibold text-white tracking-wide">SELECTED CLIENT PROJECTS</h2>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <ProjectPlaceholder />
            <ProjectPlaceholder />
          </div>
        </section>

        {/* Section 2: Interactive Automation Lab */}
        <section>
          <div className="mb-8 flex items-center space-x-3">
            <div className="rounded bg-rose-500/10 p-2 ring-1 ring-rose-500/20">
              <Terminal className="h-6 w-6 text-rose-400" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">Sentinel: Adversarial AI Security Core</h2>
              <p className="text-sm text-slate-500">Live Red Team vs Blue Team simulation managed by n8n.</p>
            </div>
          </div>

          <AutomationShowcase />
        </section>

      </div>
    </div>
  );
};

export default Projects;
