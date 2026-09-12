import { useEffect, useState, type ReactNode } from 'react';
import Lenis from 'lenis';
import 'lenis/dist/lenis.css';

type SmoothScrollProps = {
  children: ReactNode;
};

export function useScrollProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let raf = 0;
    let latest = 0;
    const update = () => {
      setProgress(latest);
      raf = 0;
    };
    const onScroll = () => {
      const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      latest = Math.min(1, Math.max(0, window.scrollY / max));
      if (!raf) raf = requestAnimationFrame(update);
    };

    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return progress;
}

export default function SmoothScroll({ children }: SmoothScrollProps) {
  useEffect(() => {
    const media = window.matchMedia?.('(prefers-reduced-motion: reduce)');
    if (media?.matches) return;

    const lenis = new Lenis({
      autoRaf: true,
      smoothWheel: true,
      lerp: 0.085,
      anchors: true,
      stopInertiaOnNavigate: true,
    });

    const onScroll = (event: { scroll: number; progress: number }) => {
      document.documentElement.style.setProperty('--lenis-scroll', `${event.scroll}px`);
      document.documentElement.style.setProperty('--lenis-progress', String(event.progress));
      document.documentElement.style.setProperty('--scroll-progress', String(event.progress));
    };

    lenis.on('scroll', onScroll);
    return () => {
      lenis.off('scroll', onScroll);
      lenis.destroy();
    };
  }, []);

  return <>{children}</>;
}
