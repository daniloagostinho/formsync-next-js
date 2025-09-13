import { useState, useCallback, useRef, useEffect } from 'react';

/**
 * Hook para otimizar estados que mudam frequentemente
 * Evita re-renders desnecessários usando useRef
 */
export function useOptimizedState<T>(initialValue: T) {
  const [state, setState] = useState(initialValue);
  const stateRef = useRef(initialValue);
  const [, forceUpdate] = useState({});

  const setOptimizedState = useCallback((newValue: T | ((prev: T) => T)) => {
    const value = typeof newValue === 'function' 
      ? (newValue as (prev: T) => T)(stateRef.current)
      : newValue;

    if (stateRef.current !== value) {
      stateRef.current = value;
      setState(value);
    }
  }, []);

  const forceRerender = useCallback(() => {
    forceUpdate({});
  }, []);

  return [state, setOptimizedState, forceRerender] as const;
}

/**
 * Hook para debounce de estados
 * Útil para inputs que causam muitos re-renders
 */
export function useDebouncedState<T>(
  initialValue: T, 
  delay: number
): [T, T, (value: T) => void] {
  const [immediateValue, setImmediateValue] = useState(initialValue);
  const [debouncedValue, setDebouncedValue] = useState(initialValue);
  const timeoutRef = useRef<NodeJS.Timeout>();

  const setValue = useCallback((value: T) => {
    setImmediateValue(value);
    
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    timeoutRef.current = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
  }, [delay]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return [immediateValue, debouncedValue, setValue];
}

/**
 * Hook para throttle de estados
 * Limita a frequência de atualizações
 */
export function useThrottledState<T>(
  initialValue: T,
  delay: number
): [T, (value: T) => void] {
  const [state, setState] = useState(initialValue);
  const lastUpdateRef = useRef(0);

  const setThrottledState = useCallback((value: T) => {
    const now = Date.now();
    
    if (now - lastUpdateRef.current >= delay) {
      setState(value);
      lastUpdateRef.current = now;
    }
  }, [delay]);

  return [state, setThrottledState];
}
