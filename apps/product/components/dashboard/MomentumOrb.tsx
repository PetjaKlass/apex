/** MomentumOrb (docs/.../momentum-orb.md). SVG-Ring 12-Uhr + Count-up (S3: mono+tnum).
 *  Ring + Zahl werden per requestAnimationFrame animiert — kein Animated/useNativeDriver
 *  (react-native-svg-web akzeptiert keine Animated.Value auf strokeDashoffset). */
import { useEffect, useRef, useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { useTheme } from '@/lib/theme';
import type { MomentumResult } from '@/lib/momentum/calculator';

export function MomentumOrb({
  data,
  size = 118,
  onPress,
}: {
  data: MomentumResult;
  size?: number;
  onPress?: () => void;
}) {
  const { colors } = useTheme();
  const stroke = 7;
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;

  const [shown, setShown] = useState(0);
  const [pctShown, setPctShown] = useState(0);
  const fromRef = useRef({ n: 0, p: 0 });

  useEffect(() => {
    const from = fromRef.current;
    const toN = data.momentum;
    const toP = data.pct;
    const t0 = Date.now();
    const dur = 900;
    let raf: number;
    const tick = () => {
      const t = Math.min((Date.now() - t0) / dur, 1);
      const e = 1 - Math.pow(1 - t, 3); // ease-out cubic
      const n = Math.round(from.n + (toN - from.n) * e);
      const p = from.p + (toP - from.p) * e;
      setShown(n);
      setPctShown(p);
      fromRef.current = { n, p };
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [data.momentum, data.pct]);

  const ring = (
    <View style={{ width: size, height: size }} className="items-center justify-center">
      <View className="absolute inset-0 items-center justify-center">
        <View
          style={{
            width: size + 24,
            height: size + 24,
            borderRadius: (size + 24) / 2,
            backgroundColor: colors.accent.glow,
          }}
        />
      </View>
      <Svg width={size} height={size} style={{ transform: [{ rotate: '-90deg' }] }}>
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke={colors.subtle}
          strokeWidth={stroke}
          fill="none"
        />
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke={colors.accent.base}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circ}
          strokeDashoffset={circ * (1 - pctShown)}
          fill="none"
        />
      </Svg>
      <Text
        className="text-fg-1 absolute font-mono text-[27px] font-semibold tracking-tight"
        style={{ letterSpacing: -1 }}
      >
        {shown.toLocaleString('de-DE')}
      </Text>
    </View>
  );

  return (
    <View className="flex-row items-center gap-6">
      {onPress ? (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`Momentum ${data.momentum}`}
          onPress={onPress}
        >
          {ring}
        </Pressable>
      ) : (
        ring
      )}
      <View className="flex-1 gap-2">
        <Text className="font-display text-fg-1 text-[17px] font-bold tracking-tight">
          Level {data.level} — {data.levelName}
        </Text>
        <View className="bg-subtle shadow-edge h-[5px] w-full max-w-[160px] overflow-hidden rounded-full">
          <View
            className="bg-accent h-full rounded-full"
            style={{ width: `${Math.round(data.pct * 100)}%` }}
          />
        </View>
        <Text className="text-fg-3 font-mono text-xs">
          {data.xpInLevel.toLocaleString('de-DE')} / {data.xpForNext.toLocaleString('de-DE')} XP
        </Text>
      </View>
    </View>
  );
}
