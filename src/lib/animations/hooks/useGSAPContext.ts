import { useCallback, useLayoutEffect, useRef, type RefObject } from 'react';
import gsap from 'gsap';

export function useGSAPContext(scopeRef: RefObject<HTMLElement | null>) {
  const contextRef = useRef<gsap.Context | null>(null);

  const addToContext = useCallback(
    (callback: () => void | (() => void)) => {
      const scope = scopeRef.current;
      if (!scope) return;
      contextRef.current?.revert();
      contextRef.current = gsap.context(callback, scope);
      return () => {
        contextRef.current?.revert();
        contextRef.current = null;
      };
    },
    [scopeRef],
  );

  useLayoutEffect(() => {
    return () => {
      contextRef.current?.revert();
      contextRef.current = null;
    };
  }, []);

  return addToContext;
}
