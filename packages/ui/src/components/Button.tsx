/**
 * Button — Apex Muster-Komponente (docs/design-system/components/button.md).
 * Pills only. 5 Varianten × 3 Größen. Loading friert Breite ein (200ms-Delay, 300ms-Min-Hold).
 * Haptik Light nur primary/secondary, nur nativ.
 */
import { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Platform,
  Pressable,
  Text,
  View,
  type LayoutChangeEvent,
} from 'react-native';
import { cn } from '../cn';
import { tapLight } from '../haptics';
import { useUiColors } from '../theme';

export type IconComponent = React.ComponentType<{ size?: number; color?: string }>;

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger-ghost' | 'hero-secondary';
export type ButtonSize = 'sm' | 'md' | 'lg';

export type ButtonProps = {
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: IconComponent;
  iconSide?: 'left' | 'right';
  iconOnly?: boolean;
  loading?: boolean;
  disabled?: boolean;
  onPress: () => void | Promise<void>;
  children?: string;
  accessibilityLabel?: string;
  /** Spinner-Farbe (Token-Anbindung folgt mit Theme-Hook-Injection, siehe log Phase 04). */
  spinnerColor?: string;
};

const VARIANT: Record<ButtonVariant, { box: string; text: string }> = {
  primary: { box: 'bg-accent shadow-card-edge', text: 'text-accent-on' },
  secondary: { box: 'bg-card border border-border shadow-card-edge', text: 'text-fg-1' },
  ghost: { box: 'bg-transparent', text: 'text-fg-2' },
  'danger-ghost': { box: 'bg-transparent', text: 'text-danger-fg' },
  'hero-secondary': { box: 'bg-white/10 border border-white/15', text: 'text-hero-text' },
};

const SIZE: Record<ButtonSize, { box: string; text: string; icon: number; minW: number }> = {
  sm: { box: 'h-8 px-4', text: 'text-xs', icon: 13, minW: 48 },
  md: { box: 'h-[38px] px-5', text: 'text-sm', icon: 15, minW: 64 },
  lg: { box: 'h-[46px] px-8', text: 'text-base', icon: 16, minW: 64 },
};

export function Button({
  variant = 'secondary',
  size = 'md',
  icon: Icon,
  iconSide = 'left',
  iconOnly = false,
  loading = false,
  disabled = false,
  onPress,
  children,
  accessibilityLabel,
  spinnerColor,
}: ButtonProps) {
  const c = useUiColors();
  const v = VARIANT[variant];
  const s = SIZE[size];
  const isBlocked = disabled || loading;

  // Spinner-Choreografie: erscheint erst nach 200ms, bleibt dann min. 300ms (button.md §States).
  const [showSpinner, setShowSpinner] = useState(false);
  const frozenWidth = useRef<number | null>(null);
  const [width, setWidth] = useState<number | undefined>(undefined);
  useEffect(() => {
    let appear: ReturnType<typeof setTimeout> | undefined;
    let hold: ReturnType<typeof setTimeout> | undefined;
    if (loading) {
      appear = setTimeout(() => setShowSpinner(true), 200);
      setWidth(frozenWidth.current ?? undefined); // Breite einfrieren — kein Springen
    } else {
      hold = setTimeout(() => {
        setShowSpinner(false);
        setWidth(undefined);
      }, 300);
    }
    return () => {
      if (appear) clearTimeout(appear);
      if (hold) clearTimeout(hold);
    };
  }, [loading]);

  const onLayout = (e: LayoutChangeEvent) => {
    if (!loading) frozenWidth.current = e.nativeEvent.layout.width;
  };

  const handlePress = () => {
    if (isBlocked) return;
    if (variant === 'primary' || variant === 'secondary') tapLight();
    void onPress();
  };

  const label = children ?? '';
  if (iconOnly && !accessibilityLabel && process.env.NODE_ENV !== 'production') {
    console.warn('[Button] iconOnly verlangt accessibilityLabel (button.md).');
  }

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? label}
      accessibilityState={{ disabled: isBlocked, busy: loading }}
      disabled={isBlocked}
      onPress={handlePress}
      onLayout={onLayout}
      style={width !== undefined ? { width } : undefined}
      className={cn(
        'flex-row items-center justify-center gap-2 rounded-full',
        'duration-instant transition-transform active:scale-[0.97]',
        'web:outline-none web:focus-visible:outline web:focus-visible:outline-2 web:focus-visible:outline-offset-2 web:focus-visible:outline-accent-bright',
        v.box,
        s.box,
        iconOnly &&
          (size === 'sm' ? 'w-8 px-0' : size === 'md' ? 'w-[38px] px-0' : 'w-[46px] px-0'),
        !iconOnly && (size === 'sm' ? 'min-w-[48px]' : 'min-w-[64px]'),
        disabled && 'opacity-40',
        disabled && variant === 'primary' && 'shadow-none'
      )}
    >
      {showSpinner ? (
        <ActivityIndicator
          size="small"
          color={spinnerColor ?? (variant === 'primary' ? c.accentOn : c.fg2)}
        />
      ) : (
        Icon &&
        iconSide === 'left' && (
          <Icon size={s.icon} color={Platform.OS === 'web' ? 'currentColor' : undefined} />
        )
      )}
      {!iconOnly && label.length > 0 && (
        <Text className={cn('tracking-snug font-semibold', v.text, s.text)} numberOfLines={1}>
          {label}
        </Text>
      )}
      {!showSpinner && Icon && iconSide === 'right' && (
        <Icon size={s.icon} color={Platform.OS === 'web' ? 'currentColor' : undefined} />
      )}
    </Pressable>
  );
}
