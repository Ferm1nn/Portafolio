import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

type BidirectionalRevealOptions = {
    element: HTMLElement;
    start?: string;
    end?: string;
    yOffset?: number;
    duration?: number;
};

export function createBidirectionalReveal({
    element,
    start = 'top 85%',
    end = 'bottom 15%',
    yOffset = 50,
    duration = 0.6,
}: BidirectionalRevealOptions) {
    // Prevent double initialization
    if (element.dataset.revealBidirectional === 'true') return () => undefined;
    element.dataset.revealBidirectional = 'true';

    // Ensure element is prepared for animation
    // autoAlpha handles opacity + visibility:hidden to prevent interaction when hidden
    gsap.set(element, {
        autoAlpha: 0,
        y: yOffset,
        willChange: 'transform, opacity, visibility'
    });

    // Use a 'fromTo' attached directly to the ScrollTrigger for 'play reverse play reverse' logic
    // This is the standard, robust way to handle bi-directional scroll animations in GSAP
    const tl = gsap.timeline({
        scrollTrigger: {
            trigger: element,
            start,
            end,
            toggleActions: 'play reverse play reverse',
            // markers: false, // Debugging
            invalidateOnRefresh: true, // Recalculate on resize
        }
    });

    tl.to(element, {
        autoAlpha: 1,
        y: 0,
        duration: duration,
        ease: 'power3.out',
        // overwrites: 'auto' // ensure no conflicts
    });

    return () => {
        // Cleanup
        if (tl.scrollTrigger) tl.scrollTrigger.kill();
        tl.kill();
        element.style.willChange = '';
        delete element.dataset.revealBidirectional;
    };
}
