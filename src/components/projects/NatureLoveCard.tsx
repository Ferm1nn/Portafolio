import { useRef, useCallback, useState } from 'react';
import gsap from 'gsap';
import { ExternalLink } from 'lucide-react';
import '../../styles/NatureLoveCard.css';

/* ── Project data ──────────────────────────────────────── */
const PROJECT = {
    title: 'NatureLoveCR',
    subtitle: 'Custom E-Commerce Platform  ·  Costa Rica',
    liveUrl: 'https://www.naturelovecr.com/',
    overview:
        'A custom-built web platform developed from scratch for NatureLoveCR, featuring full customization, advanced security, and backend process automation.',
    features: [
        '100% custom-built architecture (zero generic templates used).',
        'Advanced security implementations to protect sensitive user data and transaction flows.',
        'End-to-end automation for order processing, inventory syncing, and system notifications.',
    ],
    impact: [
        'Ultra-fast loading times (Under 2 seconds).',
        'Fully automated order management pipeline.',
        'Significant reduction of human error in sales operations and shipping logistics.',
    ],
};

/* ── Component ─────────────────────────────────────────── */
const NatureLoveCard = () => {
    const [isExpanded, setIsExpanded] = useState(false);
    const tlRef = useRef<gsap.core.Timeline | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const specsRef = useRef<HTMLDivElement>(null);
    const sweepRef = useRef<HTMLDivElement>(null);
    const panelsRef = useRef<(HTMLDivElement | null)[]>([]);

    const setPanelRef = useCallback(
        (index: number) => (el: HTMLDivElement | null) => {
            panelsRef.current[index] = el;
        },
        [],
    );

    /* ── Toggle expand / collapse ─────────────────────────── */
    const handleToggle = useCallback(() => {
        /* If a timeline exists and is not yet reversed, reverse it. */
        if (tlRef.current) {
            if (isExpanded) {
                tlRef.current.reverse();
                setIsExpanded(false);
            } else {
                tlRef.current.play();
                setIsExpanded(true);
            }
            return;
        }

        /* Build the expand timeline on first click. */
        const specs = specsRef.current;
        const sweep = sweepRef.current;
        const panels = panelsRef.current.filter(Boolean) as HTMLElement[];
        if (!specs || !sweep || panels.length === 0) return;

        const tl = gsap.timeline({
            paused: true,
            defaults: { ease: 'power3.inOut' },
            onReverseComplete: () => {
                gsap.set(specs, { clearProps: 'height' });
                gsap.set(sweep, { clearProps: 'all' });
                panels.forEach((p) => gsap.set(p, { clearProps: 'all' }));
            },
        });

        /* 1 · Sweep bar across the top */
        tl.to(sweep, { opacity: 1, duration: 0.15 })
            .to(sweep, { scaleX: 1, duration: 0.6, ease: 'power2.out' }, '<')
            .to(sweep, { opacity: 0, duration: 0.3 }, '+=0.1');

        /* 2 · Expand the specs container height */
        tl.fromTo(
            specs,
            { height: 0 },
            { height: 'auto', duration: 0.55, ease: 'power3.out' },
            '-=0.35',
        );

        /* 3 · Stagger-in data panels */
        tl.to(
            panels,
            {
                opacity: 1,
                y: 0,
                duration: 0.4,
                stagger: 0.12,
                ease: 'power2.out',
            },
            '-=0.25',
        );

        tlRef.current = tl;
        tl.play();
        setIsExpanded(true);
    }, [isExpanded]);

    /* ── Render ───────────────────────────────────────────── */
    return (
        <div className="nlc-card" ref={containerRef}>
            {/* Sweep bar */}
            <div className="nlc-sweep-bar" ref={sweepRef} />

            {/* Corners */}
            <span className="nlc-corner nlc-corner--tl" aria-hidden />
            <span className="nlc-corner nlc-corner--tr" aria-hidden />
            <span className="nlc-corner nlc-corner--bl" aria-hidden />
            <span className="nlc-corner nlc-corner--br" aria-hidden />

            {/* Mockup */}
            <div className="nlc-mockup-wrap">
                <img
                    className="nlc-mockup-pc"
                    src="/naturelove-pc.png"
                    alt="NatureLoveCR PC View"
                    loading="lazy"
                />
                <img
                    className="nlc-mockup-mobile"
                    src="/naturelove-mobile.jpeg"
                    alt="NatureLoveCR Mobile View"
                    loading="lazy"
                />
                <div className="nlc-mockup-vignette" aria-hidden />
            </div>

            {/* Body */}
            <div className="nlc-body">
                <h3 className="nlc-title">{PROJECT.title}</h3>
                <p className="nlc-subtitle">{PROJECT.subtitle}</p>

                <div className="nlc-actions">
                    <button
                        className="nlc-analyze-btn"
                        onClick={handleToggle}
                        data-expanded={isExpanded}
                        aria-expanded={isExpanded}
                    >
                        <span className="nlc-btn-scanline" aria-hidden />
                        {isExpanded ? '[ COLLAPSE ]' : '[ ANALYZE DEPLOYMENT ]'}
                    </button>

                    <a
                        className="nlc-launch-link"
                        href={PROJECT.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        Launch Deployment
                        <ExternalLink size={13} strokeWidth={2} />
                    </a>
                </div>
            </div>

            {/* ── Expandable specs ──────────────────────────────── */}
            <div className="nlc-specs-container" ref={specsRef}>
                <div className="nlc-specs-inner">
                    {/* Overview panel */}
                    <div className="nlc-data-panel" ref={setPanelRef(0)}>
                        <p className="nlc-panel-label">Overview</p>
                        <p className="nlc-panel-text">{PROJECT.overview}</p>
                    </div>

                    {/* Features panel */}
                    <div className="nlc-data-panel" ref={setPanelRef(1)}>
                        <p className="nlc-panel-label">Key Features</p>
                        <div className="nlc-panel-text">
                            <ul>
                                {PROJECT.features.map((f, i) => (
                                    <li key={i}>{f}</li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    {/* Impact panel */}
                    <div className="nlc-data-panel" ref={setPanelRef(2)}>
                        <p className="nlc-panel-label">Business Impact</p>
                        <div className="nlc-panel-text">
                            <ul>
                                {PROJECT.impact.map((item, i) => (
                                    <li key={i}>{item}</li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NatureLoveCard;
