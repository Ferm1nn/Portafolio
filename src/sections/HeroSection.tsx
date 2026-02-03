import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Link } from 'react-router-dom';

gsap.registerPlugin(ScrollTrigger);

export function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // --- 2. Text Reveal (Scramble Effect) ---
    const finalName = "Fermin Espinoza";
    const subtitleElement = container.querySelector('#subtitle') as HTMLElement;
    const descriptionElement = container.querySelector('#description') as HTMLElement;

    // Reset initial state
    if (textRef.current) {
      textRef.current.innerText = "";
      textRef.current.classList.remove('live-wire');
    }
    if (subtitleElement) gsap.set(subtitleElement, { opacity: 0 });
    if (descriptionElement) gsap.set(descriptionElement, { opacity: 0 });

    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%^&*";
    const scrambleProxy = { value: 0 };

    const tl = gsap.timeline();
    // 1. Subtitle Fade In
    if (subtitleElement) tl.to(subtitleElement, { opacity: 1, duration: 1, y: 0, ease: "power2.out", delay: 0.5 });

    // 2. Scramble Tween
    tl.to(scrambleProxy, {
      value: finalName.length,
      duration: 1.5,
      ease: "none",
      delay: -0.5,
      onUpdate: () => {
        if (!textRef.current) return;
        const iterations = scrambleProxy.value;
        textRef.current.innerText = finalName
          .split("")
          .map((_letter, index) => {
            if (index < iterations) {
              return finalName[index];
            }
            return chars[Math.floor(Math.random() * chars.length)];
          })
          .join("");
      },
      onComplete: () => {
        // 3. Live Wire Trigger
        if (textRef.current) {
          textRef.current.classList.add('live-wire');
        }
      }
    });

    // 4. Description Fade In
    if (descriptionElement) tl.to(descriptionElement, { opacity: 1, y: 0, duration: 1, ease: "power2.out" }, "+=0.5");


    // --- 3. Magnetic Button ---
    const magneticArea = container.querySelector('.magnetic-area') as HTMLElement;
    const btn = container.querySelector('#magnetic-btn') as HTMLElement;

    const handleMagnetMove = (e: MouseEvent) => {
      if (!magneticArea || !btn) return;
      const rect = magneticArea.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;

      gsap.to(btn, {
        x: x * 0.5,
        y: y * 0.5,
        duration: 0.3,
        ease: "power2.out"
      });
    };

    const handleMagnetLeave = () => {
      if (!btn) return;
      gsap.to(btn, {
        x: 0,
        y: 0,
        duration: 1,
        ease: "elastic.out(1, 0.3)"
      });
    };

    if (magneticArea) {
      magneticArea.addEventListener('mousemove', handleMagnetMove as any);
      magneticArea.addEventListener('mouseleave', handleMagnetLeave);
    }

    // --- Buttons Fade In ---
    const actions = container.querySelector('.hero-actions');
    if (actions) gsap.fromTo(actions, { opacity: 0 }, { opacity: 1, duration: 1, delay: 2.5 });

    return () => {
      if (magneticArea) {
        magneticArea.removeEventListener('mousemove', handleMagnetMove as any);
        magneticArea.removeEventListener('mouseleave', handleMagnetLeave);
      }
      tl.kill();
    };
  }, []);

  return (
    <section className="hero relative w-full min-h-screen flex items-center justify-center overflow-hidden bg-transparent" id="hero" ref={containerRef}>

      {/* Hero Content */}
      <div className="content-layer text-center p-8 max-w-4xl relative z-10 flex flex-col items-center">
        <p className="text-blue-500 text-lg mb-4 tracking-widest uppercase opacity-0 font-mono" id="subtitle">
          Network Technician & Cybersecurity
        </p>

        {/* Decryption Text - GRADIENT + LIVE WIRE */}
        <h1
          ref={textRef}
          className="inline-block text-5xl md:text-7xl font-bold mb-6 font-mono tracking-tighter min-h-[5rem] sm:min-h-[6rem] text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-violet-500 pb-2"
          id="scramble-text">
          {/* Text injected by JS */}
        </h1>

        <div className="text-slate-400 mb-12 max-w-xl mx-auto text-lg leading-relaxed opacity-0" id="description">
          <p>Systems Engineering and Cybersecurity student specializing in secure networking, automation, and comprehensive L1-L3 technical support.</p>
        </div>

        {/* Magnetic Button */}
        <div className="hero-actions opacity-0">
          <div className="magnetic-area inline-block relative p-5 -m-5">
            <Link to="/contact" id="magnetic-btn" className="relative group bg-transparent border border-cyan-500/30 hover:border-cyan-500 text-cyan-500 px-8 py-3 rounded-full text-lg font-medium transition-colors duration-300 overflow-hidden inline-flex items-center justify-center">
              <span className="relative z-10 group-hover:text-white transition-colors duration-300">Contact Me</span>
              <div className="absolute inset-0 bg-cyan-500/10 scale-0 group-hover:scale-100 rounded-full transition-transform duration-300 origin-center"></div>
              <div className="absolute inset-0 bg-cyan-500 blur-xl opacity-0 group-hover:opacity-40 transition-opacity duration-300"></div>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
