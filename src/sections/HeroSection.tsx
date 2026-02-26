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
      // Removed live-wire reset
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
        // 3. Scanline/Glitch Trigger
        if (textRef.current) {
          // Optional: Add specific class if needed, or rely on hover
        }
      }
    });

    // 4. Description Fade In
    if (descriptionElement) tl.to(descriptionElement, { opacity: 1, y: 0, duration: 1, ease: "power2.out" }, "+=0.5");


    // --- 3. Magnetic Button ---
    const magneticArea = container.querySelector('.magnetic-area') as HTMLElement;
    const btn = container.querySelector('#magnetic-btn') as HTMLElement;

    const handleMagnetMoveBtn = (e: Event) => {
      const mouseEvent = e as MouseEvent;
      if (!magneticArea || !btn) return;
      const rect = magneticArea.getBoundingClientRect();
      const x = mouseEvent.clientX - rect.left - rect.width / 2;
      const y = mouseEvent.clientY - rect.top - rect.height / 2;

      gsap.to(btn, {
        x: x * 0.5,
        y: y * 0.5,
        duration: 0.3,
        ease: "power2.out"
      });
    };

    const handleMagnetLeaveBtn = () => {
      if (!btn) return;
      gsap.to(btn, {
        x: 0,
        y: 0,
        duration: 1,
        ease: "elastic.out(1, 0.3)"
      });
    };

    if (magneticArea) {
      magneticArea.addEventListener('mousemove', handleMagnetMoveBtn);
      magneticArea.addEventListener('mouseleave', handleMagnetLeaveBtn);
    }

    // --- Buttons Fade In ---
    const actions = container.querySelector('.hero-actions');
    if (actions) gsap.fromTo(actions, { opacity: 0 }, { opacity: 1, duration: 1, delay: 2.5 });

    return () => {
      if (magneticArea) {
        magneticArea.removeEventListener('mousemove', handleMagnetMoveBtn);
        magneticArea.removeEventListener('mouseleave', handleMagnetLeaveBtn);
      }
      tl.kill();
    };
  }, []);

  return (
    <section className="hero relative w-full min-h-screen flex items-center justify-center overflow-hidden bg-transparent font-sans" id="hero" ref={containerRef}>


      {/* Hero Content */}
      <div className="content-layer text-center p-8 max-w-4xl relative z-10 flex flex-col items-center">
        <p className="text-green-400 text-sm md:text-base mb-4 tracking-widest uppercase opacity-0 font-code font-bold" id="subtitle">
          Network & Cybersecurity Analyst
        </p>

        {/* Decryption Text - HUD STYLE */}
        <h1
          ref={textRef}
          aria-label="Fermin Espinoza"
          className="glitch-hover inline-block text-5xl md:text-7xl font-bold mb-6 font-hud tracking-tight min-h-[5rem] sm:min-h-[6rem] text-transparent bg-clip-text bg-gradient-to-b from-white to-slate-400 pb-2 drop-shadow-[0_0_10px_rgba(56,189,248,0.6)]"
          id="scramble-text">
          {/* Text injected by JS */}
        </h1>

        <div className="text-slate-400 mb-12 max-w-xl mx-auto text-lg leading-relaxed opacity-0 font-light" id="description">
          <p>Systems Engineering student with hands on Network & Cybersecurity specializing in secure networking, automation, and comprehensive L1-L3 technical support.</p>
        </div>

        {/* Angular HUD Button */}
        <div className="hero-actions opacity-0">
          <div className="magnetic-area inline-block relative p-5 -m-5">
            <Link to="/contact" id="magnetic-btn" aria-label="Contact Fermin Espinoza" className="relative group bg-transparent border border-cyan-500 text-cyan-500 px-8 py-3 text-lg font-medium transition-all duration-200 overflow-hidden inline-flex items-center justify-center hover:bg-cyan-500 hover:text-black hover:shadow-[0_0_20px_rgba(6,182,212,0.6)] clip-path-polygon-[0_0,100%_0,100%_80%,90%_100%,0_100%] rounded-none">
              <span className="relative z-10 font-hud tracking-wider">CONTACT</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
