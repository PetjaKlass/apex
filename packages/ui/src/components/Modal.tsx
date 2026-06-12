/**
 * Modal — Dialog / Sheet / Drawer auf der Pop-Ebene (modal.md).
 * panelStrong + (Web-)Blur, r32, shadow-pop. KEINE Modal-Stacks — Inhalt wechselt im selben Modal.
 * Sheet: Grabber + Swipe-down. ESC/Backdrop schließen (außer blocking).
 */
import { useEffect, useRef } from 'react';
import {
  Animated,
  Easing,
  Modal as RNModal,
  PanResponder,
  Platform,
  Pressable,
  ScrollView,
  Text,
  View,
} from 'react-native';
import { X } from 'lucide-react-native';
import { cn } from '../cn';
import { useUiColors } from '../theme';

export type ModalVariant = 'dialog' | 'sheet' | 'drawer';

export type ModalProps = {
  visible: boolean;
  onClose: () => void;
  variant?: ModalVariant;
  title?: string;
  blocking?: boolean; // kein ESC/Backdrop-Close
  footer?: React.ReactNode;
  children: React.ReactNode;
};

export function Modal({
  visible,
  onClose,
  variant = 'dialog',
  title,
  blocking = false,
  footer,
  children,
}: ModalProps) {
  const c = useUiColors();
  const anim = useRef(new Animated.Value(0)).current;
  const dragY = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(anim, {
      toValue: visible ? 1 : 0,
      duration: visible ? 250 : 200,
      easing: visible ? Easing.bezier(0.16, 1, 0.3, 1) : Easing.bezier(0.4, 0, 0.2, 1),
      useNativeDriver: true,
    }).start();
    if (visible) dragY.setValue(0);
  }, [visible, anim, dragY]);

  // ESC (Web)
  useEffect(() => {
    if (Platform.OS !== 'web' || !visible || blocking) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [visible, blocking, onClose]);

  // Sheet: Swipe-down zum Schließen
  const pan = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, g) => variant === 'sheet' && g.dy > 6,
      onPanResponderMove: (_, g) => g.dy > 0 && dragY.setValue(g.dy),
      onPanResponderRelease: (_, g) => {
        if (g.dy > 80 || g.vy > 0.8) onClose();
        else Animated.spring(dragY, { toValue: 0, useNativeDriver: true }).start();
      },
    })
  ).current;

  const transform =
    variant === 'sheet'
      ? [
          {
            translateY: Animated.add(
              anim.interpolate({ inputRange: [0, 1], outputRange: [400, 0] }),
              dragY
            ),
          },
        ]
      : variant === 'drawer'
        ? [{ translateX: anim.interpolate({ inputRange: [0, 1], outputRange: [400, 0] }) }]
        : [{ scale: anim.interpolate({ inputRange: [0, 1], outputRange: [0.96, 1] }) }];

  const surface = cn(
    'bg-panel-strong border border-panel-border shadow-pop-edge web:backdrop-blur-2xl',
    variant === 'dialog' && 'w-full max-w-[640px] rounded-2xl p-8',
    variant === 'sheet' && 'w-full rounded-t-2xl px-6 pb-10 pt-2',
    variant === 'drawer' && 'h-full w-full max-w-[400px] p-8'
  );

  return (
    <RNModal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={() => !blocking && onClose()}
    >
      <Animated.View style={{ flex: 1, opacity: anim }}>
        <Pressable
          accessibilityLabel="Schließen"
          disabled={blocking}
          onPress={onClose}
          className="web:backdrop-blur-md absolute inset-0 bg-black/45"
        />
        <View
          pointerEvents="box-none"
          className={cn(
            'flex-1',
            variant === 'dialog' && 'items-center justify-center p-4',
            variant === 'sheet' && 'justify-end',
            variant === 'drawer' && 'items-end'
          )}
        >
          <Animated.View
            style={{ transform, maxHeight: variant === 'dialog' ? '84%' : '92%' }}
            className={surface}
            {...(variant === 'sheet' ? pan.panHandlers : {})}
            {...(Platform.OS === 'web'
              ? { role: 'dialog', 'aria-modal': true, 'aria-label': title }
              : {})}
          >
            {variant === 'sheet' && (
              <View className="bg-pressed mb-3 h-1 w-9 self-center rounded-full" />
            )}
            {(title || !blocking) && (
              <View className="mb-4 flex-row items-start gap-4">
                {title && (
                  <Text className="font-display text-fg-1 flex-1 text-xl font-bold tracking-tight">
                    {title}
                  </Text>
                )}
                {!blocking && (
                  <Pressable
                    accessibilityRole="button"
                    accessibilityLabel="Schließen"
                    onPress={onClose}
                    hitSlop={8}
                    className="border-border bg-card-glass shadow-edge h-[34px] w-[34px] items-center justify-center rounded-full border"
                  >
                    <X size={15} color={c.fg2} />
                  </Pressable>
                )}
              </View>
            )}
            <ScrollView bounces={false} className="shrink">
              {children}
            </ScrollView>
            {footer && <View className="border-border mt-6 border-t pt-4">{footer}</View>}
          </Animated.View>
        </View>
      </Animated.View>
    </RNModal>
  );
}
