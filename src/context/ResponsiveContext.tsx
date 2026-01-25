/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, type ReactNode } from 'react';
import { useMediaQuery } from '../hooks/useMediaQuery';

type ResponsiveContextType = {
    isMobile: boolean;
};

const ResponsiveContext = createContext<ResponsiveContextType | undefined>(undefined);

export function ResponsiveProvider({ children }: { children: ReactNode }) {
    const isMobile = useMediaQuery('(max-width: 767px)');

    return (
        <ResponsiveContext.Provider value={{ isMobile }}>
            {children}
        </ResponsiveContext.Provider>
    );
}

export function useResponsive() {
    const context = useContext(ResponsiveContext);
    if (context === undefined) {
        throw new Error('useResponsive must be used within a ResponsiveProvider');
    }
    return context;
}
