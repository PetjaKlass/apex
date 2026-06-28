/**
 * Telemetrie — aktiviert NUR bei gesetzten Envs (EU-Region; Accounts NEEDS C4/C5).
 * Bis dahin No-Op, damit Stage-1-Dogfooding ohne Tracking läuft (DSGVO-schonend).
 */
import { Platform } from 'react-native';

const POSTHOG_KEY = process.env.EXPO_PUBLIC_POSTHOG_KEY ?? '';
const POSTHOG_HOST = process.env.EXPO_PUBLIC_POSTHOG_HOST ?? 'https://eu.i.posthog.com';
const SENTRY_DSN = process.env.EXPO_PUBLIC_SENTRY_DSN ?? '';

export const TELEMETRY_ON = POSTHOG_KEY.length > 0 || SENTRY_DSN.length > 0;

type Props = Record<string, unknown>;
let captured: ((event: string, props?: Props) => void) | null = null;

export async function initTelemetry(): Promise<void> {
  if (SENTRY_DSN) {
    try {
      const Sentry = await import('@sentry/react-native');
      Sentry.init({
        dsn: SENTRY_DSN,
        environment: __DEV__ ? 'dev' : 'production',
        enabled: !__DEV__,
      });
    } catch {
      /* optional */
    }
  }
  if (POSTHOG_KEY && Platform.OS !== 'web') {
    try {
      const { PostHog } = await import('posthog-react-native');
      const ph = new PostHog(POSTHOG_KEY, { host: POSTHOG_HOST });
      captured = (event, props) => ph.capture(event, props as Record<string, never>);
    } catch {
      /* optional */
    }
  }
}

/** Event-Capture — No-Op solange keine Keys gesetzt sind. */
export function track(event: string, props?: Props): void {
  captured?.(event, props);
}
