import { useMediaQuery } from '../use-media-query';

type Breakpoints = {
  xs: boolean; // < 640px
  sm: boolean; // ≥ 640px
  md: boolean; // ≥ 768px
  lg: boolean; // ≥ 1024px
  xl: boolean; // ≥ 1280px
  '2xl': boolean; // ≥ 1536px
};

function useBreakpoints(): Breakpoints {
  const xs = useMediaQuery('(max-width: 639px)');
  const sm = useMediaQuery('(min-width: 640px)');
  const md = useMediaQuery('(min-width: 768px)');
  const lg = useMediaQuery('(min-width: 1024px)');
  const xl = useMediaQuery('(min-width: 1280px)');
  const xxl = useMediaQuery('(min-width: 1536px)');

  return {
    xs,
    sm,
    md,
    lg,
    xl,
    '2xl': xxl,
  };
}

export { useBreakpoints };