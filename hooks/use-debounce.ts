import { useCallback, useEffect, useRef } from 'react';

/**
 * `useDebounce` creates a debounced version of a function. Useful for delaying a function call, like for input field validation or API calls in response to user input.
 *
 * @param callback - The function to debounce.
 * @param delay - The number of milliseconds to delay the function call.
 * @param options - Optional settings including `maxWait`, `leading`, and `trailing` execution.
 * @return - An array containing the debounced function and a `cancel` function to cancel the debounce.
 */


function useDebounce<T extends (...args: any[]) => void>(
  callback: T,
  delay: number = 500,
  options: {
    maxWait?: number;
    leading?: boolean;
    trailing?: boolean;
  } = {},
): [T, () => void] {
  const { maxWait, leading = false, trailing = true } = options;
  const timerIdRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const maxTimerIdRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastInvokeTimeRef = useRef<number | null>(null);
  const callbackRef = useRef(callback);

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  useEffect(() => {
    return () => {
      if (timerIdRef.current) clearTimeout(timerIdRef.current);
      if (maxTimerIdRef.current) clearTimeout(maxTimerIdRef.current);
    };
  }, []);

  const debounced = useCallback((...args: Parameters<T>) => {
    const now = Date.now();
    const isLeading = leading && lastInvokeTimeRef.current === null;

    const invoke = () => {
      lastInvokeTimeRef.current = Date.now();
      callbackRef.current(...args);
      timerIdRef.current = null;
      maxTimerIdRef.current = null;
    };

    if (isLeading) {
      invoke();
      return;
    }

    if (timerIdRef.current) clearTimeout(timerIdRef.current);

    if (maxWait && !maxTimerIdRef.current && trailing) {
      maxTimerIdRef.current = setTimeout(invoke, maxWait);
    }

    if (trailing) {
      timerIdRef.current = setTimeout(invoke, delay);
    }
  }, [delay, leading, trailing, maxWait]);

  const cancel = useCallback(() => {
    if (timerIdRef.current) clearTimeout(timerIdRef.current);
    if (maxTimerIdRef.current) clearTimeout(maxTimerIdRef.current);
    timerIdRef.current = null;
    maxTimerIdRef.current = null;
    lastInvokeTimeRef.current = null;
  }, []);

  return [debounced as unknown as T, cancel];
}

export { useDebounce };