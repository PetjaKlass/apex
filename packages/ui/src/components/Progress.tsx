/**
 * Progress — Bar (5px, Gradient-Fill) + Ring (SVG, 12-Uhr-Start) (progress.md).
 * Live-Prozente: mono+tnum (S3). Indeterminate: wanderndes 30%-Segment.
 */
import { useEffect, useRef, useState } from 'react';
import { Animated, Easing, Platform, Text, View } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { cn } from '../cn';
import { useUiColors } from '../theme';

export type ProgressBarProps = {
  value?: number; // 0..max
  max?: number;
  indeterminate?: boolean;
  showValue?: boolean;
  label?: string;
};

export function ProgressBar({
  value = 0,
  max = 100,
  indeterminate = false,
  showValue = false,
  label,
}: ProgressBarProps) {
  const pct = Math.min(100, Math.max(0, (value / max) * 100));
  const x = useRef(new Animated.Value(0)).current;
  const [trackW, setTrackW] = useState(0);

  useEffect(() => {
    if (!indeterminate) return;
    const loop = Animated.loop(
      Animated.timing(x, {
        toValue: 1,
        duration: 1400,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    );
    loop.start();
    return () => loop.stop();
  }, [indeterminate, x]);

  return (
    <View
      accessibilityRole="progressbar"
      accessibilityValue={indeterminate ? undefined : { min: 0, max, now: value }}
      accessibilityLabel={label}
      className="w-full flex-row items-center gap-3"
    >
      <View
        className="bg-subtle shadow-edge h-[5px] flex-1 overflow-hidden rounded-full"
        onLayout={(e) => setTrackW(e.nativeEvent.layout.width)}
      >
        {indeterminate ? (
          <Animated.View
            className="bg-accent h-full w-[30%] rounded-full"
            style={{
              transform: [
                {
                  translateX: x.interpolate({
                    inputRange: [0, 1],
                    outputRange: [-0.3 * trackW, trackW],
                  }),
                },
              ],
            }}
          />
        ) : (
          <View
            className={cn(
              'bg-accent h-full rounded-full',
              Platform.OS === 'web' && 'web:transition-[width] web:duration-slow'
            )}
            style={{ width: `${pct}%` }}
          />
        )}
      </View>
      {showValue && !indeterminate && (
        <Text className="text-fg-2 min-w-[44px] text-right font-mono text-xs">
          {Math.round(pct)} %
        </Text>
      )}
    </View>
  );
}

export type ProgressRingProps = {
  value: number; // 0..max
  max?: number;
  size?: number; // px, default 64
  strokeWidth?: number;
  showValue?: boolean;
  label?: string;
};

export function ProgressRing({
  value,
  max = 100,
  size = 64,
  strokeWidth = 6,
  showValue = true,
  label,
}: ProgressRingProps) {
  const c = useUiColors();
  const r = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * r;
  const pct = Math.min(1, Math.max(0, value / max));

  return (
    <View
      accessibilityRole="progressbar"
      accessibilityValue={{ min: 0, max, now: value }}
      accessibilityLabel={label}
      style={{ width: size, height: size }}
      className="items-center justify-center"
    >
      <Svg width={size} height={size} style={{ transform: [{ rotate: '-90deg' }] }}>
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke={c.subtle}
          strokeWidth={strokeWidth}
          fill="none"
        />
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke={c.accent}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={circumference * (1 - pct)}
          fill="none"
        />
      </Svg>
      {showValue && (
        <Text className="text-fg-1 absolute font-mono text-xs font-semibold">
          {Math.round(pct * 100)}
          <Text className="text-2xs text-fg-2"> %</Text>
        </Text>
      )}
    </View>
  );
}
