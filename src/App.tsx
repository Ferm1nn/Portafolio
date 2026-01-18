import { Routes, Route } from 'react-router-dom';
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

function App() {
  return (
    <div className="app-shell">
      <Navbar />
      <ScrollToTop />
      <main className="content">
        <RouteTransition>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/skills" element={<Skills />} />
            <Route path="/experience" element={<Experience />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
          </Routes>
        </RouteTransition>
      </main>
      <Footer />
    </div>
  );
}

export default App;
