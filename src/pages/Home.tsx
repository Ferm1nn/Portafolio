import { useRef } from 'react';
import { useMotion } from '../hooks/useMotion';
import { HomeBackground } from '../components/HomeBackground';
import { HomeMobileBg } from '../components/mobile-backgrounds';

import { HeroSection } from '../sections/HeroSection';
import HomeContent from '../components/HomeContent';


export default function Home() {
  const pageRef = useRef<HTMLDivElement | null>(null);
  useMotion(pageRef);

  return (
    <div ref={pageRef} className="relative z-0">
      {/* Desktop background (≥768px) */}
      <div className="hidden md:block">
        <HomeBackground />
      </div>
      {/* Mobile background (<768px) */}
      <div className="md:hidden">
        <HomeMobileBg />
      </div>
      <HeroSection />
      <HomeContent />
    </div>
  );
}
