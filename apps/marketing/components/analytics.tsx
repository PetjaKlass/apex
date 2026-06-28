import Script from 'next/script';

/**
 * Analytics — aktiviert sich NUR, wenn die jeweilige Env gesetzt ist (Decision Audit 4.3:
 * Plausible optional). Plausible ist cookieless (kein Consent-Banner nötig).
 */
export function Analytics() {
  const plausible = process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN;
  if (!plausible) return null;
  return (
    <Script
      defer
      data-domain={plausible}
      src="https://plausible.io/js/script.js"
      strategy="afterInteractive"
    />
  );
}
