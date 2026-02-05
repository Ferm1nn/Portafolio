import { useState, useEffect } from 'react';

export const SystemBootLoader = () => {
    const [isVisible, setIsVisible] = useState(true);
    const [shouldRender, setShouldRender] = useState(true);

    useEffect(() => {
        // Determine when to hide the loader
        const handleLoad = () => {
            // Small delay to ensure smooth transition
            setTimeout(() => setIsVisible(false), 1500);
        };

        // If document is already loaded
        if (document.readyState === 'complete') {
            handleLoad();
        } else {
            window.addEventListener('load', handleLoad);
            // Fallback in case load event already fired or takes too long
            const timeout = setTimeout(handleLoad, 3000);
            return () => {
                window.removeEventListener('load', handleLoad);
                clearTimeout(timeout);
            };
        }
    }, []);

    useEffect(() => {
        if (!isVisible) {
            // Wait for CSS transition to finish before unmounting
            const timeout = setTimeout(() => setShouldRender(false), 500);
            return () => clearTimeout(timeout);
        }
    }, [isVisible]);

    if (!shouldRender) return null;

    return (
        <div
            className={`fixed inset-0 z-[9999] flex items-center justify-center bg-[#020617] transition-opacity duration-500 ease-out ${isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'
                }`}
        >
            <div className="font-mono text-[#06b6d4] text-xl md:text-2xl tracking-widest animate-pulse">
                INITIALIZING SYSTEM...
            </div>
        </div>
    );
};
