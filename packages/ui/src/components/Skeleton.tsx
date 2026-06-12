/**
 * Skeleton — Compound (Container/Avatar/Text/Card), bg-subtle, Radius wie Ziel (skeleton.md).
 * EIN Shimmer pro Seite: SkeletonProvider hält genau eine Loop-Animation; reduced motion = statisch.
 */
import { createContext, useContext, useEffect, useMemo, useRef } from 'react';
import { AccessibilityInfo, Animated, Easing, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { cn } from '../cn';

const ShimmerContext = createContext<Animated.Value | null>(null);

export function SkeletonProvider({ children }: { children: React.ReactNode }) {
  const v = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    let loop: Animated.CompositeAnimation | null = null;
    void AccessibilityInfo.isReduceMotionEnabled?.().then((reduced) => {
      if (reduced) return; // statisch (skeleton.md)
      loop = Animated.loop(
        Animated.timing(v, {
          toValue: 1,
          duration: 1500,
          easing: Easing.linear,
          useNativeDriver: true,
        })
      );
      loop.start();
    });
    return () => loop?.stop();
  }, [v]);
  return <ShimmerContext.Provider value={v}>{children}</ShimmerContext.Provider>;
}

function Shimmer({ width = 280 }: { width?: number }) {
  const v = useContext(ShimmerContext);
  const style = useMemo(
    () =>
      v
        ? {
            transform: [
              { translateX: v.interpolate({ inputRange: [0, 1], outputRange: [-width, width] }) },
            ],
          }
        : undefined,
    [v, width]
  );
  if (!v) return null;
  return (
    <Animated.View pointerEvents="none" className="absolute inset-0" style={style}>
      <LinearGradient
        colors={['transparent', 'rgba(255,255,255,0.06)', 'transparent']}
        start={{ x: 0, y: 0.5 }}
        end={{ x: 1, y: 0.5 }}
        style={{ flex: 1 }}
      />
    </Animated.View>
  );
}

function Base({ className, width }: { className?: string; width?: number }) {
  return (
    <View accessibilityElementsHidden className={cn('bg-subtle overflow-hidden', className)}>
      <Shimmer width={width} />
    </View>
  );
}

function Container({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <View accessibilityLabel="Lädt…" className={cn('flex-row items-center gap-3', className)}>
      {children}
    </View>
  );
}

function SkeletonAvatar({ size = 32 }: { size?: number }) {
  return <Base className="rounded-full" width={size} />;
}
// Größe via style (dynamisch):
function SkeletonAvatarSized({ size = 32 }: { size?: number }) {
  return (
    <View style={{ width: size, height: size }}>
      <Base className="h-full w-full rounded-full" width={size} />
    </View>
  );
}

function SkeletonText({
  lines = 1,
  width = '100%',
}: {
  lines?: number;
  width?: `${number}%` | number;
}) {
  return (
    <View className="flex-1 gap-2">
      {Array.from({ length: lines }).map((_, i) => (
        <View key={i} style={{ width: i === lines - 1 ? width : '100%' }}>
          <Base className="rounded-xs h-[13px]" />
        </View>
      ))}
    </View>
  );
}

function SkeletonCard({ height = 96 }: { height?: number }) {
  return (
    <View style={{ height }}>
      <Base className="h-full w-full rounded-lg" width={320} />
    </View>
  );
}

export const Skeleton = Object.assign(Base, {
  Container,
  Avatar: SkeletonAvatarSized,
  Text: SkeletonText,
  Card: SkeletonCard,
});
void SkeletonAvatar; // (ersetzt durch Sized-Variante)
