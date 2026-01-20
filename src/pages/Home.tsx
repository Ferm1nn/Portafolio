import { useRef } from 'react';
import { useMotion } from '../hooks/useMotion';
import { CTASection } from '../sections/CTASection';
import { EducationSection } from '../sections/EducationSection';
import { ExpandedSkillsSection } from '../sections/ExpandedSkillsSection';
import { ExperienceSection } from '../sections/ExperienceSection';
import { HeroSection } from '../sections/HeroSection';
import { SkillsSection } from '../sections/SkillsSection';

export default function Home() {
  const pageRef = useRef<HTMLDivElement | null>(null);
  useMotion(pageRef);

  return (
    <div ref={pageRef}>
      <HeroSection />
      <SkillsSection />
      <ExperienceSection />
      <EducationSection />
      <ExpandedSkillsSection />
      <CTASection />
    </div>
  );
}
