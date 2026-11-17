export type AnalyticsEventName =
  | 'cta_schedule_hero'
  | 'cta_explore_solutions'
  | 'cta_nav_assessment'
  | 'cta_assessment_section'
  | 'process_stage_select'
  | 'faq_toggle'
  | 'form_started'
  | 'form_validation_error'
  | 'form_submit_success'
  | 'form_submit_error';

declare global {
  interface Window {
    dataLayer?: Array<Record<string, unknown>>;
  }
}

export function trackEvent(
  event: AnalyticsEventName,
  metadata: Record<string, string | number | boolean> = {}
): void {
  const payload = {
    event,
    page: '/logistics',
    timestamp: new Date().toISOString(),
    ...metadata,
  };

  if (typeof window !== 'undefined' && Array.isArray(window.dataLayer)) {
    window.dataLayer.push(payload);
  }

  // Non-blocking first-party analytics beacon
  const basePath = import.meta.env.BASE_URL || '/';
  const normalizedBase = basePath.endsWith('/') ? basePath.slice(0, -1) : basePath;
  const endpoint = `${normalizedBase}/api/logistics/analytics`;

  try {
    if (typeof navigator !== 'undefined' && typeof navigator.sendBeacon === 'function') {
      const blob = new Blob([JSON.stringify(payload)], { type: 'application/json' });
      navigator.sendBeacon(endpoint, blob);
    } else {
      void fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        keepalive: true,
      });
    }
  } catch {
    // Analytics must never interrupt user navigation or form submission
  }
}
