import { trackEvent } from './analytics';

type LayoutShiftEntry = PerformanceEntry & { value?: number; hadRecentInput?: boolean };
type LargestContentfulPaintEntry = PerformanceEntry & { startTime: number; size?: number };

export function installPerformanceObservers() {
  if (typeof window === 'undefined' || typeof PerformanceObserver === 'undefined') return;

  try {
    const lcpObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries() as LargestContentfulPaintEntry[];
      const last = entries.at(-1);
      if (!last) return;
      window.setTimeout(() => trackEvent('web_vital_lcp', { value_ms: Math.round(last.startTime) }), 0);
    });
    lcpObserver.observe({ type: 'largest-contentful-paint', buffered: true });
  } catch {
    // Unsupported browsers simply skip this metric.
  }

  try {
    let clsValue = 0;
    const clsObserver = new PerformanceObserver((list) => {
      for (const entry of list.getEntries() as LayoutShiftEntry[]) {
        if (!entry.hadRecentInput) clsValue += entry.value || 0;
      }
      trackEvent('web_vital_cls', { value: Number(clsValue.toFixed(4)) });
    });
    clsObserver.observe({ type: 'layout-shift', buffered: true });
  } catch {
    // Unsupported browsers simply skip this metric.
  }
}
