import { useState, useLayoutEffect } from 'react';

export function useMediaQuery(query: string): boolean {
    // Initialize with correct value if possible, default to false for SSR consistency or initial render
    const [matches, setMatches] = useState(() => {
        if (typeof window !== 'undefined') {
            return window.matchMedia(query).matches;
        }
        return false;
    });

    useLayoutEffect(() => {
        if (typeof window === 'undefined') return;

        const media = window.matchMedia(query);

        // Initial check
        if (media.matches !== matches) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setMatches(media.matches);
        }

        const listener = (event: MediaQueryListEvent) => {
            setMatches(event.matches);
        };

        // Modern browsers
        if (media.addEventListener) {
            media.addEventListener('change', listener);
            return () => media.removeEventListener('change', listener);
        }
        // Fallback for older browsers (Safari < 14)
        else {
            media.addListener(listener);
            return () => media.removeListener(listener);
        }
    }, [query, matches]);

    return matches;
}
