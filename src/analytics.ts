export type AnalyticsEvent = {
  name: string;
  params?: Record<string, string | number | boolean>;
};

type Gtag = (...args: unknown[]) => void;

declare global {
  interface Window {
    gtag?: Gtag;
  }
}

export function trackEvent(name: string, params?: AnalyticsEvent['params']): void {
  if (typeof window === 'undefined' || typeof window.gtag !== 'function') return;
  window.gtag('event', name, params ?? {});
}
