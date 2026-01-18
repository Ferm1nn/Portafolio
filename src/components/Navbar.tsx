import { Link, NavLink } from 'react-router-dom';
import { profile } from '../data/portfolioData';

const links = [
  { to: '/', label: 'Home' },
  { to: '/skills', label: 'Skills' },
  { to: '/experience', label: 'Experience' },
  { to: '/projects', label: 'Projects' },
  { to: '/about', label: 'About' },
  { to: '/contact', label: 'Contact' },
];

export function Navbar() {
  return (
    <header className="navbar">
      <div className="nav-brand">
        <Link to="/" className="nav-logo">
          <span className="logo-mark" aria-hidden>
            FE
          </span>
          <div>
            <div className="brand-name">{profile.name}</div>
            <div className="brand-role">{profile.role}</div>
          </div>
        </Link>
      </div>
      <nav className="nav-links" aria-label="Primary">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
            end={link.to === '/'}
          >
            {link.label}
          </NavLink>
        ))}
      </nav>
      <div className="nav-actions">
        <a className="btn ghost" href="/Fermin_Espinoza_CV.pdf" download>
          Download CV
        </a>
        <NavLink to="/contact" className="btn primary">
          Contact
        </NavLink>
      </div>
    </header>
  );
}
