/** Haptik-Adapter: native expo-haptics, Web/fehlend = No-Op (design-system §9). */
import { Platform } from 'react-native';

type HapticsModule = typeof import('expo-haptics');

let haptics: HapticsModule | null = null;
if (Platform.OS !== 'web') {
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    haptics = require('expo-haptics') as HapticsModule;
  } catch {
    haptics = null;
  }
}

export function tapLight(): void {
  void haptics?.impactAsync(haptics.ImpactFeedbackStyle.Light);
}
