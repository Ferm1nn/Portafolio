import { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
import { Flip } from 'gsap/all';
import Home from './pages/Home';
import Skills from './pages/Skills';
import Experience from './pages/Experience';
import Projects from './pages/Projects';
import About from './pages/About';
import Contact from './pages/Contact';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { RouteTransition } from './components/RouteTransition';
import { ScrollToTop } from './components/ScrollToTop';
import { AnimatedBackground } from './components/AnimatedBackground';
import { LinkConfirm } from './components/LinkConfirm';
import { useMotionSettings } from './motion/MotionProvider';

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin, Flip);

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
            <Routes location={location}>
              <Route path="/" element={<Home />} />
              <Route path="/skills" element={<Skills />} />
              <Route path="/experience" element={<Experience />} />
              <Route path="/projects" element={<Projects />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
            </Routes>
          )}
        </RouteTransition>
      </main>
      <Footer />
    </div>
  );
}

export default App;
