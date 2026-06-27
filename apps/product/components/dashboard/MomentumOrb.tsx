/** MomentumOrb (docs/.../momentum-orb.md). SVG-Ring 12-Uhr + Count-up (S3: mono+tnum). */
import { useEffect, useState } from 'react';
import { Animated, Easing, Pressable, Text, View } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { useTheme } from '@/lib/theme';
import type { MomentumResult } from '@/lib/momentum/calculator';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

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

  const [offset] = useState(() => new Animated.Value(circ));
  const [shown, setShown] = useState(0);

  useEffect(() => {
    Animated.timing(offset, {
      toValue: circ * (1 - data.pct),
      duration: 1000,
      easing: Easing.bezier(0.16, 1, 0.3, 1),
      useNativeDriver: true,
    }).start();
    // Count-up auf den absoluten Momentum-Wert (500ms, ease-out)
    const from = shown;
    const to = data.momentum;
    const t0 = Date.now();
    let raf: number;
    const tick = () => {
      const p = Math.min((Date.now() - t0) / 500, 1);
      setShown(Math.round(from + (to - from) * (1 - Math.pow(1 - p, 2))));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
        <AnimatedCircle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke={colors.accent.base}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circ}
          strokeDashoffset={offset}
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
