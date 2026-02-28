import { useMediaQuery } from './useMediaQuery';

/**
 * Returns true when the viewport is at or below the mobile breakpoint (768px).
 * Used to conditionally render lightweight CSS backgrounds instead of canvas.
 */
export function useIsMobile(): boolean {
    return useMediaQuery('(max-width: 768px)');
}
