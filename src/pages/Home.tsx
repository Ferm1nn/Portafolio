import { useRef } from 'react';
import { useMotion } from '../hooks/useMotion';
import { NetworkBackground } from '../components/NetworkBackground';
import { HeroSection } from '../sections/HeroSection';
import HomeContent from '../components/HomeContent';

export default function Home() {
  const pageRef = useRef<HTMLDivElement | null>(null);
  useMotion(pageRef);

  return (
    <div ref={pageRef} className="relative z-0">
      <NetworkBackground />
      <HeroSection />
      <HomeContent />
    </div>
  );
}
