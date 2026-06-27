import { Redirect, Stack } from 'expo-router';
import { useAuth } from '@/lib/auth';

/** Full-Screen-Takeover außerhalb der Shell. Gate: fertig Onboardete → Dashboard. */
export default function OnboardingLayout() {
  const { session, profile, loading } = useAuth();
  if (!loading && !session) return <Redirect href="/sign-in" />;
  if (profile?.onboarded_at) return <Redirect href="/dashboard" />;
  return <Stack screenOptions={{ headerShown: false, animation: 'slide_from_right' }} />;
}
