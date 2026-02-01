import { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { CTAButton } from '../components/CTAButton';
import { profile } from '../data/portfolioData';
import { useGSAPContext } from '../lib/animations/hooks/useGSAPContext';
import { splitTextToSpans } from '../lib/animations/helpers/splitText';
import { useMotionSettings } from '../motion/MotionProvider';

gsap.registerPlugin(ScrollTrigger);

export function HeroSection() {
  const { prefersReducedMotion, isTouch } = useMotionSettings();
  const heroRef = useRef<HTMLElement | null>(null);
  const titleRef = useRef<HTMLHeadingElement | null>(null);
  // Removed metricsRef as metrics are moved to Skills page
  const addToContext = useGSAPContext(heroRef);

  useLayoutEffect(() => {
    if (!heroRef.current) return;

    return addToContext(() => {
      const mm = gsap.matchMedia();

      mm.add("(min-width: 768px)", () => {
        const titleWords = splitTextToSpans(titleRef.current);
        const subhead = heroRef.current?.querySelector<HTMLElement>('.hero-lead');
        const summary = heroRef.current?.querySelector<HTMLElement>('.hero-summary');
        const actions = heroRef.current?.querySelector<HTMLElement>('.hero-actions');

        if (prefersReducedMotion) {
          gsap.set([titleWords, subhead, summary, actions], { opacity: 1, y: 0 });
          return;
        }

        if (!subhead || !summary || !actions) return;

        const tl = gsap.timeline();
        tl.fromTo(
          titleWords,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out', stagger: 0.06 },
        )
          .fromTo(subhead, { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }, '-=0.3')
          .fromTo(summary, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }, '-=0.35')
          .fromTo(actions, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }, '-=0.35');

        // Desktop-only float animation (removed data-float targets in simplified version, but keeping logic if we add more later)
      });

      mm.add("(max-width: 767px)", () => {
        // Lighter mobile animation
        const elements = heroRef.current?.querySelectorAll<HTMLElement>('.hero-title, .hero-lead, .hero-summary, .hero-actions');
        if (elements) {
          gsap.fromTo(elements,
            { opacity: 0, y: 10 },
            { opacity: 1, y: 0, duration: 0.6, stagger: 0.1, ease: 'power2.out', clearProps: 'all' }
          );
        }
      });

      return () => mm.revert();
    });
  }, [addToContext, isTouch, prefersReducedMotion]);

  return (
    <section className="hero relative w-full min-h-screen flex items-center justify-center overflow-hidden" id="hero" ref={heroRef}>

      {/* 2. RADIAL GRADIENT OVERLAY (The Fix - Readability) */}
      <div
        className="absolute inset-0 z-10 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at center, rgba(15,23,42,0.8) 0%, rgba(15,23,42,0.5) 40%, transparent 80%)' }}
      ></div>

      {/* 3. CONTENT (Centered & Balanced & Lifted) */}
      <div className="relative z-20 container mx-auto px-6 h-full flex flex-col items-center justify-center text-center pb-32" style={{ maxWidth: '100%', width: '100%' }}>

        {/* Constrained Width for Readability */}
        <div className="max-w-4xl flex flex-col items-center space-y-6">

          {/* Role Tag - Clean & Techy */}
          <span className="inline-block py-1 px-4 text-xs font-mono font-bold tracking-[0.2em] text-cyan-400 border border-cyan-500/30 rounded-full bg-cyan-950/30 backdrop-blur-sm shadow-[0_0_10px_rgba(6,182,212,0.2)] mb-2">
            {profile.role.toUpperCase()}
          </span>

          {/* Name - Balanced Scale */}
          <h1 className="hero-title font-bold text-white tracking-tight leading-tight" ref={titleRef} style={{ fontSize: 'clamp(3rem, 5vw, 6rem)', textShadow: '0 4px 20px rgba(0,0,0,0.5)' }}>
            Fermin <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 font-extrabold filter drop-shadow-[0_2px_10px_rgba(6,182,212,0.3)]">Espinoza</span>
          </h1>

          {/* Bio - Readable & Centered */}
          <div className="space-y-6">
            <p className="hero-lead text-xl md:text-2xl text-slate-100 font-medium drop-shadow-md">
              {profile.headline}
            </p>
            <p className="hero-summary text-slate-300 leading-relaxed text-lg font-normal drop-shadow-md max-w-2xl mx-auto">
              {profile.summary}
            </p>
          </div>

          {/* Buttons - Balanced Spacing */}
          <div className="hero-actions flex flex-wrap justify-center gap-5 pt-6">
            <CTAButton
              to="/contact"
              className="px-8 py-3 bg-cyan-500 hover:bg-cyan-400 text-black font-bold rounded-full shadow-[0_0_20px_rgba(6,182,212,0.4)] hover:shadow-[0_0_30px_rgba(6,182,212,0.6)] transition-all duration-300 transform hover:-translate-y-1 border-none"
            >
              Contact Me
            </CTAButton>
            <CTAButton
              to="/projects"
              variant="ghost"
              className="px-8 py-3 bg-slate-900/40 hover:bg-gray-900/60 text-white font-semibold border border-slate-600 rounded-full backdrop-blur-sm transition-all duration-300 hover:border-white"
            >
              View Projects
            </CTAButton>
          </div>

          {/* Social / Location - Centered Row */}
          <div className="hero-meta flex items-center justify-center gap-8 text-sm text-slate-400 font-medium pt-8 w-full drop-shadow-md">
            <span className="flex items-center gap-2 tracking-wider">
              🇨🇷 {profile.location}
            </span>
            <a href={`mailto:${profile.email}`} className="hover:text-cyan-400 transition-colors flex items-center gap-2 tracking-wider group">
              <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full group-hover:shadow-[0_0_10px_cyan] transition-all"></span>
              {profile.email}
            </a>
            <a href={profile.linkedin} target="_blank" rel="noreferrer" className="hover:text-cyan-400 transition-colors flex items-center gap-2 tracking-wider group">
              <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full group-hover:shadow-[0_0_10px_cyan] transition-all"></span>
              LinkedIn
            </a>
          </div>

        </div>

      </div>
    </section>
  );
}
