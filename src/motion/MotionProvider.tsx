import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';

type MotionSettings = {
  prefersReducedMotion: boolean;
  isTouch: boolean;
  isLowPower: boolean;
  allowTilt: boolean;
  allowParallax: boolean;
  allowParticles: boolean;
};

type NavigatorConnection = {
  saveData?: boolean;
  effectiveType?: string;
};

const MotionContext = createContext<MotionSettings | undefined>(undefined);

const getDeviceState = () => {
  if (typeof window === 'undefined') {
    return { isTouch: false, isLowPower: false };
  }

  const coarsePointer = window.matchMedia?.('(pointer: coarse)').matches ?? false;
  const isTouch = coarsePointer || navigator.maxTouchPoints > 0;
  const connection = (navigator as Navigator & { connection?: NavigatorConnection }).connection;
  const saveData = connection?.saveData ?? false;
  const cores = navigator.hardwareConcurrency ?? 8;
  const isLowPower = saveData || cores <= 4;

  return { isTouch, isLowPower };
};

export function MotionProvider({ children }: { children: ReactNode }) {
  // Force animations on; disregard OS-level reduced motion for now to ensure GSAP runs.
  const prefersReducedMotion = false;
  const [deviceState, setDeviceState] = useState(getDeviceState);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleUpdate = () => setDeviceState(getDeviceState());
    const coarseQuery = window.matchMedia('(pointer: coarse)');

    coarseQuery.addEventListener('change', handleUpdate);
    window.addEventListener('resize', handleUpdate);

    return () => {
      coarseQuery.removeEventListener('change', handleUpdate);
      window.removeEventListener('resize', handleUpdate);
    };
  }, []);

  const value = useMemo(() => {
    const allowMotion = !prefersReducedMotion;
    const allowTilt = allowMotion && !deviceState.isTouch;
    const allowParallax = allowMotion;
    const allowParticles = allowMotion && !deviceState.isLowPower;

    return {
      prefersReducedMotion,
      isTouch: deviceState.isTouch,
      isLowPower: deviceState.isLowPower,
      allowTilt,
      allowParallax,
      allowParticles,
    };
  }, [prefersReducedMotion, deviceState.isTouch, deviceState.isLowPower]);

  useEffect(() => {
    if (typeof document === 'undefined') return;
    document.documentElement.dataset.motion = prefersReducedMotion ? 'reduced' : 'full';
  }, [prefersReducedMotion]);

  return <MotionContext.Provider value={value}>{children}</MotionContext.Provider>;
}

export function useMotionSettings() {
  const context = useContext(MotionContext);

  if (!context) {
    throw new Error('useMotionSettings must be used within a MotionProvider');
  }

  return context;
}
