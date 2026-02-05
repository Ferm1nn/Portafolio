import { Link, NavLink, useLocation } from 'react-router-dom';
import { useState, useRef } from 'react';
import { Menu, X, ChevronRight } from 'lucide-react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { profile } from '../data/portfolioData';
import avatar from '../assets/profile-header.jpeg';
import { ProfileAvatar } from './ProfileAvatar';

gsap.registerPlugin(useGSAP);

const links = [
  { to: '/', label: 'Home' },
  { to: '/skills', label: 'Skills' },
  { to: '/experience', label: 'Experience' },
  { to: '/projects', label: 'Projects' },
  { to: '/about', label: 'About' },
];

export function Navbar() {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const containerRef = useRef<HTMLElement>(null);
  const borderBeamRef = useRef<HTMLDivElement>(null);
  const statusRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLAnchorElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close mobile menu on route change
  useGSAP(() => {
    setIsMenuOpen(false);
  }, { dependencies: [location.pathname] });

  // Entrance Animation
  useGSAP(() => {
    gsap.fromTo(containerRef.current,
      { y: -100, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, ease: "power3.out" }
    );
  }, { scope: containerRef });

  // "Live Wire" Border Animation
  useGSAP(() => {
    if (!borderBeamRef.current) return;

    const beam = borderBeamRef.current;

    // Create the "Beam" timeline
    // Shoots across with a random-ish delay feel via repeatDelay
    const tl = gsap.timeline({ repeat: -1, repeatDelay: 2.5 });

    tl.fromTo(beam,
      { left: '-20%', width: '20%', opacity: 0, background: 'linear-gradient(90deg, transparent, #22d3ee, transparent)' },
      {
        left: '120%',
        duration: 1.2,
        ease: "power2.inOut",
        opacity: 1,
        onStart: () => { gsap.set(beam, { opacity: 1 }); },
        onComplete: () => { gsap.set(beam, { opacity: 0 }); }
      }
    );

  }, { scope: containerRef });

  // "Voltage Flicker" Status Badge
  useGSAP(() => {
    if (!statusRef.current) return;

    // Rapid micro-flicker to simulate unstable energy
    gsap.to(statusRef.current, {
      opacity: 0.5,
      duration: 0.1,
      repeat: -1,
      yoyo: true,
      ease: "rough({ template: none.out, strength: 1, points: 20, taper: 'none', randomize: true, clamp: false})"
    });
  }, { scope: containerRef });

  // "Thunder" Hover Effect on Button
  const { contextSafe } = useGSAP({ scope: containerRef });

  const handleButtonHoverRaw = contextSafe(() => {
    if (!buttonRef.current) return;

    // Intense flash
    gsap.fromTo(buttonRef.current,
      { backgroundColor: '#ffffff', color: '#000000', borderColor: '#ffffff', boxShadow: '0 0 20px 5px rgba(255,255,255,0.5)' },
      { backgroundColor: 'rgba(6, 182, 212, 0.1)', color: '#22d3ee', borderColor: 'rgba(34, 211, 238, 0.5)', boxShadow: 'none', duration: 0.4, ease: "power2.out" }
    );
  });

  const handleButtonHover = () => {
    handleButtonHoverRaw();
  };

  // Mobile Menu Animation
  useGSAP(() => {
    if (!menuRef.current) return;

    if (isMenuOpen) {
      gsap.set(menuRef.current, { display: 'flex' });
      gsap.to(menuRef.current, { height: '100vh', opacity: 1, duration: 0.4, ease: "power3.out" });
    } else {
      gsap.to(menuRef.current, { height: 0, opacity: 0, duration: 0.3, ease: "power3.in", onComplete: () => { gsap.set(menuRef.current, { display: 'none' }); } });
    }
  }, [isMenuOpen]);

  return (
    <header
      ref={containerRef}
      className={`fixed top-0 w-full z-50 bg-[#050505]/80 backdrop-blur-md transition-all duration-300`}
    >
      {/* "Live Wire" Border */}
      <div className="absolute bottom-0 left-0 w-full h-[1px] bg-white/5 overflow-hidden">
        <div ref={borderBeamRef} className="absolute top-0 bottom-0 w-[20%] h-full bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-0"></div>
      </div>

      <div className="mx-auto flex h-20 w-full max-w-7xl items-center justify-between px-4 sm:px-6 relative z-10">

        {/* LEFT: Identity & Status */}
        <Link
          to="/"
          className="flex items-center gap-4 group"
          onClick={() => setIsMenuOpen(false)}
        >
          <div className="relative">
            <ProfileAvatar
              src={avatar}
              alt={`${profile.name} portrait`}
              isDark={true}
              className="h-10 w-10 ring-2 ring-white/10 group-hover:ring-cyan-400 transition-all duration-300"
            />
            {/* Mobile Status Dot */}
            <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-cyan-400 rounded-full border-2 border-[#050505] animate-pulse lg:hidden shadow-[0_0_10px_rgba(34,211,238,0.8)]"></div>
          </div>

          <div className="flex flex-col">
            <span className="text-white font-bold tracking-tight text-sm sm:text-base group-hover:text-cyan-400 transition-colors">
              {profile.name}
            </span>
            <div className="hidden lg:flex items-center gap-2" ref={statusRef}>
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500 shadow-[0_0_8px_rgba(34,211,238,0.8)]"></span>
              </span>
              <span className="text-[10px] font-mono text-cyan-400 tracking-wider shadow-cyan-500/50 drop-shadow-[0_0_2px_rgba(34,211,238,0.5)]">SYSTEM ONLINE</span>
            </div>
          </div>
        </Link>

        {/* CENTER: Navigation (The Console) */}
        <nav className="hidden lg:flex items-center gap-8">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) => `
                relative group flex items-center gap-1 font-mono text-sm transition-all duration-300
                ${isActive ? 'text-white' : 'text-gray-400 hover:text-white'}
              `}
            >
              {({ isActive }) => (
                <>
                  <span className={`transition-opacity duration-300 ${isActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'} text-cyan-400`}>
                    &gt;
                  </span>
                  {link.label}
                  {isActive && (
                    <div className="absolute -bottom-1 left-0 right-0 h-[1px] bg-cyan-400/50 shadow-[0_0_8px_rgba(34,211,238,0.8)]" />
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* RIGHT: Action (The Trigger) */}
        <div className="flex items-center gap-4">
          <Link
            to="/contact"
            ref={buttonRef}
            onMouseEnter={handleButtonHover}
            className="hidden sm:flex items-center justify-center px-6 py-2 text-sm font-mono tracking-wide
              text-cyan-400 bg-cyan-500/10 border border-cyan-500/30 rounded-sm
              transition-all duration-300 uppercase relative overflow-hidden group"
          >
            <span className="relative z-10">Initiate Contact</span>
          </Link>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden p-2 text-gray-400 hover:text-white transition-colors"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* MOBILE MENU OVERLAY */}
      <div
        ref={menuRef}
        className="fixed inset-0 top-[80px] z-40 lg:hidden bg-[#050505]/95 backdrop-blur-xl border-t border-white/5 overflow-hidden hidden"
        style={{ height: 0, opacity: 0 }}
      >
        <nav className="flex flex-col p-6 gap-2">
          <div className="mb-6 flex items-center gap-2 px-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
            </span>
            <span className="text-xs font-mono text-cyan-400 tracking-wider">SYSTEM STATUS: ONLINE</span>
          </div>

          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              onClick={() => setIsMenuOpen(false)}
              className={({ isActive }) => `
                group flex items-center justify-between p-4 rounded-sm border border-transparent
                transition-all duration-300 font-mono
                ${isActive
                  ? 'bg-white/5 border-white/10 text-white'
                  : 'text-gray-400 hover:bg-white/5 hover:text-white'
                }
              `}
            >
              <span className="flex items-center gap-3">
                <span className="text-cyan-500 opacity-50 group-hover:opacity-100">&gt;</span>
                {link.label}
              </span>
              <ChevronRight size={16} className="opacity-0 group-hover:opacity-100 transition-opacity text-cyan-500" />
            </NavLink>
          ))}

          <div className="mt-8 border-t border-white/10 pt-8">
            <Link
              to="/contact"
              onClick={() => setIsMenuOpen(false)}
              className="flex w-full items-center justify-center px-6 py-3 text-sm font-mono tracking-wide
                text-cyan-400 bg-cyan-500/10 border border-cyan-500/30 rounded-sm
                active:bg-cyan-500 active:text-white transition-all duration-300 uppercase"
            >
              Initiate Contact
            </Link>
          </div>
        </nav>
      </div>
    </header>
  );
}
