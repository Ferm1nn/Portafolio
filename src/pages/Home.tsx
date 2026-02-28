import { useRef } from 'react';
import { useMotion } from '../hooks/useMotion';
import { useIsMobile } from '../hooks/useIsMobile';
import { NetworkBackground } from '../components/NetworkBackground';
import { MobileBackground } from '../components/MobileBackground';
import { HeroSection } from '../sections/HeroSection';
import HomeContent from '../components/HomeContent';
import MobilePortfolio from '../components/MobilePortfolio';

export default function Home() {
  const pageRef = useRef<HTMLDivElement | null>(null);
  const isMobile = useIsMobile();
  useMotion(pageRef);

  if (isMobile) {
    return (
      <div ref={pageRef} className="relative z-0">
        <MobileBackground variant="network" />
        <MobilePortfolio />
      </div>
    );
  }

  return (
    <div ref={pageRef} className="relative z-0">
      <NetworkBackground />
      <HeroSection />
      <HomeContent />
    </div>
  );
}
