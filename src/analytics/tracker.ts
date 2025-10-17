type AnalyticsEvent = {
  name: string;
  payload?: Record<string, any>;
  ts?: string;
};

export function track(name: string, payload?: Record<string, any>) {
  const evt: AnalyticsEvent = { name, payload, ts: new Date().toISOString() };
  try {
    const base = (import.meta as any).env.VITE_API_BASE_URL as string;
    const url = base ? `${base}/api/analytics` : '/api/analytics';
    const body = JSON.stringify(evt);
    // Prefer sendBeacon for fire-and-forget
    if (navigator.sendBeacon) {
      const blob = new Blob([body], { type: 'application/json' });
      navigator.sendBeacon(url, blob);
      return;
    }
    fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body }).catch(() => {});
  } catch {}
}

