import { useEffect, Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';

const Home = lazy(() => import('./pages/Home'));
const Skills = lazy(() => import('./pages/Skills'));
const Experience = lazy(() => import('./pages/Experience'));
const Projects = lazy(() => import('./pages/Projects'));
const About = lazy(() => import('./pages/About'));
const Contact = lazy(() => import('./pages/Contact'));

import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { RouteTransition } from './components/RouteTransition';
import { ScrollToTop } from './components/ScrollToTop';
import { AnimatedBackground } from './components/AnimatedBackground';
import { LinkConfirm } from './components/LinkConfirm';
import { useMotionSettings } from './motion/MotionProvider';

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

function App() {
  const { prefersReducedMotion } = useMotionSettings();

  useEffect(() => {
    ScrollTrigger.refresh();
  }, [prefersReducedMotion]);

  return (
    <div className="app-shell">
      <AnimatedBackground />
      <LinkConfirm />
      <Navbar />
      <ScrollToTop />
      <main className="content">
        <RouteTransition>
          {(location) => (
            <Suspense fallback={null}>
              <Routes location={location}>
                <Route path="/" element={<Home />} />
                <Route path="/skills" element={<Skills />} />
                <Route path="/experience" element={<Experience />} />
                <Route path="/projects" element={<Projects />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
              </Routes>
            </Suspense>
          )}
        </RouteTransition>
      </main>
      <Footer />
    </div>
  );
}

export default App;
