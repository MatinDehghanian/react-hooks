import { useState, useEffect, useCallback } from 'react';

/**
 * `useMediaQuery` is a hook for responding to CSS media queries in JavaScript.
 * It evaluates a media query string and returns a boolean indicating whether the query matches.
 *
 * @param query - The CSS media query string.
 * @returns A boolean indicating if the media query currently matches.
 */
const getMatches = (mediaQuery: string): boolean => {
  if (typeof window === 'undefined' || typeof window.matchMedia === 'undefined') {
    return false;
  }
  return window.matchMedia(mediaQuery).matches;
};

function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState<boolean>(() => getMatches(query));

  const handleChange = useCallback((event: MediaQueryListEvent) => {
    setMatches(event.matches);
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined' || typeof window.matchMedia === 'undefined') {
      return;
    }

    const mediaQueryList = window.matchMedia(query);

    if (mediaQueryList.addEventListener) {
      mediaQueryList.addEventListener('change', handleChange);
      return () => mediaQueryList.removeEventListener('change', handleChange);
    } else {
      mediaQueryList.addListener(handleChange);
      return () => mediaQueryList.removeListener(handleChange);
    }
  }, [query, handleChange]);

  return matches;
}

export { useMediaQuery };