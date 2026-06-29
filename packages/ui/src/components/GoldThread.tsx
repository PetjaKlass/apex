/**
 * GoldThread — Signatur S1 als ECHTER Verlauf (expo-linear-gradient).
 * NativeWind unterstützt KEINE CSS-Verläufe (bg-gradient-* sind No-Ops) → diese Komponente.
 * Vertikal: accent-bright → accent (45%) → transparent (92%). Breite 2px.
 * `fill`: absolut, füllt die Elternhöhe (z. B. OBTHero linke Innenkante).
 */
import { View, type ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useUiColors } from '../theme';

export function GoldThread({
  height = 48,
  dimmed = false,
  fill = false,
  style,
}: {
  height?: number;
  dimmed?: boolean;
  fill?: boolean;
  style?: ViewStyle;
}) {
  const c = useUiColors();
  const box: ViewStyle = fill
    ? {
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        width: 2,
        borderRadius: 1,
        overflow: 'hidden',
        opacity: dimmed ? 0.4 : 1,
      }
    : { width: 2, height, borderRadius: 1, overflow: 'hidden', opacity: dimmed ? 0.4 : 1 };
  return (
    <View style={[box, style]} aria-hidden>
      <LinearGradient
        colors={[c.accentBright, c.accent, 'transparent']}
        locations={[0, 0.45, 0.92]}
        style={{ flex: 1 }}
      />
    </View>
  );
}
