import { Github, Linkedin, Mail, Phone } from 'lucide-react';
import { profile } from '../data/portfolioData';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full h-auto md:h-20 bg-[#050505]/80 backdrop-blur-md border-t border-white/10 z-40 relative">
      <div className="mx-auto flex flex-col md:flex-row h-full w-full max-w-7xl items-center justify-between px-6 py-6 md:py-0 gap-4 md:gap-0">

        {/* LEFT: Identity (Copyright) */}
        <div className="flex items-center order-2 md:order-1">
          <span className="font-mono text-xs text-gray-500 uppercase tracking-widest">
            &copy; {currentYear} {profile.name} <span className="hidden sm:inline">// ALL RIGHTS RESERVED.</span>
          </span>
        </div>

        {/* RIGHT: Business Card Contact Details */}
        <div className="flex flex-col md:flex-row items-center gap-4 md:gap-8 order-1 md:order-2">

          {/* Email */}
          <a
            href={`mailto:${profile.email}`}
            className="flex items-center gap-2 group"
            aria-label="Email"
          >
            <Mail size={16} className="text-gray-500 group-hover:text-cyan-400 transition-colors duration-300" />
            <span className="text-xs md:text-sm text-gray-400 group-hover:text-white transition-colors duration-300 font-medium">
              {profile.email}
            </span>
          </a>

          {/* Separator (Desktop) */}
          <div className="hidden md:block h-3 w-px bg-white/10"></div>

          {/* Phone */}
          <a
            href={`tel:${profile.phone.replace(/\s+/g, '')}`}
            className="flex items-center gap-2 group"
            aria-label="Phone"
          >
            <Phone size={16} className="text-gray-500 group-hover:text-cyan-400 transition-colors duration-300" />
            <span className="text-xs md:text-sm text-gray-400 group-hover:text-white transition-colors duration-300 font-medium">
              {profile.phone}
            </span>
          </a>

          {/* Separator (Desktop) */}
          <div className="hidden md:block h-3 w-px bg-white/10"></div>

          {/* GitHub */}
          <a
            href={profile.github}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 group"
            aria-label="GitHub"
          >
            <Github size={16} className="text-gray-500 group-hover:text-white transition-colors duration-300" />
            <span className="text-xs md:text-sm text-gray-400 group-hover:text-white transition-colors duration-300 font-medium">
              GitHub
            </span>
          </a>

          {/* Separator (Desktop) */}
          <div className="hidden md:block h-3 w-px bg-white/10"></div>

          {/* LinkedIn */}
          <a
            href={profile.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 group"
            aria-label="LinkedIn"
          >
            <Linkedin size={16} className="text-gray-500 group-hover:text-blue-400 transition-colors duration-300" />
            <span className="text-xs md:text-sm text-gray-400 group-hover:text-white transition-colors duration-300 font-medium">
              LinkedIn
            </span>
          </a>

        </div>

      </div>
    </footer>
  );
}
