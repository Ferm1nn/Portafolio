import { useRef } from 'react';
import { useMotion } from '../hooks/useMotion';
import { useIsMobile } from '../hooks/useIsMobile';
import { NetworkBackground } from '../components/NetworkBackground';

import { HeroSection } from '../sections/HeroSection';
import HomeContent from '../components/HomeContent';


export default function Home() {
  const pageRef = useRef<HTMLDivElement | null>(null);
  const isMobile = useIsMobile();
  useMotion(pageRef);



  return (
    <div ref={pageRef} className="relative z-0">
      <NetworkBackground />
      <HeroSection />
      <HomeContent />
    </div>
  );
}
