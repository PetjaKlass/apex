import { useEffect, useRef, useState } from 'react';
import { Animated, Easing, Platform, Pressable, View } from 'react-native';
import { Sidebar } from './Sidebar';

/** Mobile/Tablet: Sidebar als einschiebender Drawer (<1024px). */
export function MobileDrawer({
  open,
  onClose,
  pathname,
}: {
  open: boolean;
  onClose: () => void;
  pathname: string;
}) {
  // Lazy-Init über useState: Animated.Value einmal erzeugen, kein ref-Read im Render
  // (React-Compiler-Lint). Startwerte bewusst geschlossen — erstes useEffect korrigiert.
  const [x] = useState(() => new Animated.Value(-300));
  const [fade] = useState(() => new Animated.Value(0));
  // closing: true während der Ausblend-Animation, damit der Drawer bis zum Ende gemountet bleibt.
  const [closing, setClosing] = useState(false);
  const wasOpen = useRef(open);

  useEffect(() => {
    if (wasOpen.current && !open) setClosing(true);
    wasOpen.current = open;
    Animated.parallel([
      Animated.timing(x, {
        toValue: open ? 0 : -300,
        duration: open ? 300 : 200,
        easing: Easing.bezier(0.16, 1, 0.3, 1),
        useNativeDriver: true,
      }),
      Animated.timing(fade, {
        toValue: open ? 1 : 0,
        duration: 250,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),
    ]).start(({ finished }) => {
      if (finished && !open) setClosing(false);
    });
  }, [open, x, fade]);

  useEffect(() => {
    if (Platform.OS !== 'web' || !open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open && !closing) return null;

  return (
    <View pointerEvents={open ? 'auto' : 'none'} className="z-overlay absolute inset-0">
      <Animated.View style={{ opacity: fade }} className="absolute inset-0">
        <Pressable
          accessibilityLabel="Schließen"
          onPress={onClose}
          className="web:backdrop-blur-sm flex-1 bg-black/45"
        />
      </Animated.View>
      <Animated.View
        style={{ transform: [{ translateX: x }], width: 264 }}
        className="absolute bottom-0 left-0 top-0 p-3"
      >
        <Sidebar pathname={pathname} onNavigate={onClose} />
      </Animated.View>
    </View>
  );
}
