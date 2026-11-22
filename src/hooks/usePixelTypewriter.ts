import { useEffect, useState } from 'react';

export function usePixelTypewriter(text: string, speedMs = 26, resetKey?: string | number) {
  const [visibleCount, setVisibleCount] = useState(0);

  useEffect(() => {
    setVisibleCount(0);
    if (!text) return;

    const prefersReduced =
      typeof window !== 'undefined' &&
      window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

    if (prefersReduced) {
      setVisibleCount(text.length);
      return;
    }

    const timer = window.setInterval(() => {
      setVisibleCount((prev) => {
        if (prev >= text.length) {
          window.clearInterval(timer);
          return prev;
        }
        return prev + 1;
      });
    }, speedMs);

    return () => window.clearInterval(timer);
  }, [text, speedMs, resetKey]);

  const isDone = visibleCount >= text.length;
  const finishNow = () => setVisibleCount(text.length);

  return {
    typedText: text.slice(0, visibleCount),
    isDone,
    finishNow,
  };
}
