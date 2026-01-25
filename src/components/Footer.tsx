import { profile } from '../data/portfolioData';

export function Footer() {
  return (
    <footer className="footer">
      <div className="footer-contact">
        <div>
          <div className="eyebrow">Email</div>
          <a href={`mailto:${profile.email}`}>{profile.email}</a>
        </div>
        <div>
          <div className="eyebrow">LinkedIn</div>
          <a href={profile.linkedin} target="_blank" rel="noopener noreferrer">
            {profile.linkedin.replace('https://', '')}
          </a>
        </div>
        <div>
          <div className="eyebrow">Location</div>
          <span>{profile.location}</span>
        </div>
      </div>
      <div className="footer-note">Copyright {new Date().getFullYear()} {profile.name}. All rights reserved.</div>
    </footer>
  );
}
