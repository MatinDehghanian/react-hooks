import { useState, useEffect, useCallback, useRef } from 'react';

/**
 * `useTimeout` is a custom hook for managing timeouts in React.
 * It provides functions to set, reset, and clear a timeout, while tracking its active state.
 *
 * @param callback - The function to be executed after the delay.
 * @param delay - Delay in milliseconds before the callback is called. Pass `null` to disable the timeout.
 * @returns An object with `isActive`, `reset`, and `clear` properties.
 */

function useTimeout(callback: () => void, delay: number | null) {
  const [isActive, setIsActive] = useState(false);
  const savedCallback = useRef(callback);
  const timerId = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  const clear = useCallback(() => {
    if (timerId.current !== null) {
      clearTimeout(timerId.current);
      timerId.current = null;
      setIsActive(false);
    }
  }, []);

  const reset = useCallback(() => {
    clear();
    if (delay !== null) {
      setIsActive(true);
      timerId.current = setTimeout(() => {
        savedCallback.current();
        setIsActive(false);
      }, delay);
    }
  }, [clear, delay]);

  useEffect(() => {
    if (delay !== null) {
      reset();
      return clear;
    }
  }, [delay, reset, clear]);

  return { isActive, reset, clear };
}

export { useTimeout };