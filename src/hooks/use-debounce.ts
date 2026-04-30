import { useState, useEffect } from 'react';

/**
 * @hook useDebounce
 * @description THE PULSE DAMPER (PROTOCOL 88)
 * Prevents network chattiness by delaying state updates until the user pauses.
 */
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}
