/**
 * Toast — 5 Typen inkl. XP (toast.md). Provider-Singleton, max 5, Prioritäten,
 * Hover-Pause mit Restzeit (Web), persistent-Errors, Focus-Mode-Puffer-API,
 * XP-Zahl zählt 500ms hoch (S3: mono+tnum).
 */
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { Animated, Easing, Platform, Pressable, Text, View } from 'react-native';
import { AlertCircle, AlertTriangle, CheckCircle2, Info, X, Zap } from 'lucide-react-native';
import { cn } from '../cn';
import { useUiColors } from '../theme';

export type ToastType = 'success' | 'error' | 'warning' | 'info' | 'xp';

export type ToastOptions = {
  type: ToastType;
  message: string;
  sub?: string;
  xp?: number; // nur type 'xp'
  persistent?: boolean; // error: bleibt bis Dismiss
};

type ToastItem = ToastOptions & { id: number; createdAt: number };

const DURATION: Record<ToastType, number> = {
  success: 3000,
  error: 5000,
  warning: 4000,
  info: 3000,
  xp: 3000,
};
const PRIORITY: Record<ToastType, number> = { error: 0, warning: 1, xp: 2, info: 3, success: 3 };

type ToastApi = {
  show: (opts: ToastOptions) => void;
  dismiss: (id: number) => void;
  /** Focus-Mode (§16): true = puffern statt zeigen; bei false wird der Puffer geflusht. */
  setSuppressed: (suppressed: boolean) => void;
};

const ToastContext = createContext<ToastApi | null>(null);

export function useToast(): ToastApi {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast muss innerhalb von <ToastProvider> verwendet werden.');
  return ctx;
}

let nextId = 1;

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<ToastItem[]>([]);
  const suppressed = useRef(false);
  const buffer = useRef<ToastItem[]>([]);

  const dismiss = useCallback((id: number) => {
    setItems((list) => list.filter((t) => t.id !== id));
  }, []);

  const push = useCallback((item: ToastItem) => {
    setItems((list) => {
      const next = [...list, item].sort(
        (a, b) => PRIORITY[a.type] - PRIORITY[b.type] || a.id - b.id
      );
      return next.slice(0, 5); // max 5 — älteste Niedrig-Prio fliegt
    });
  }, []);

  const show = useCallback(
    (opts: ToastOptions) => {
      const item: ToastItem = { ...opts, id: nextId++, createdAt: Date.now() };
      if (suppressed.current) buffer.current.push(item);
      else push(item);
    },
    [push]
  );

  const setSuppressed = useCallback(
    (s: boolean) => {
      suppressed.current = s;
      if (!s) {
        const flush = buffer.current.splice(0);
        flush.forEach((t, i) => setTimeout(() => push(t), i * 200)); // 200ms-Stagger (§15)
      }
    },
    [push]
  );

  const api = useMemo(() => ({ show, dismiss, setSuppressed }), [show, dismiss, setSuppressed]);

  return (
    <ToastContext.Provider value={api}>
      {children}
      <View
        pointerEvents="box-none"
        className="z-toast web:items-end web:pr-5 web:pt-5 absolute inset-x-0 top-0 items-center px-4 pt-4"
        {...(Platform.OS === 'web' ? { 'aria-live': 'polite' } : {})}
      >
        <View pointerEvents="box-none" className="w-full max-w-[360px] gap-2">
          {items.map((t) => (
            <ToastView key={t.id} item={t} onDismiss={() => dismiss(t.id)} />
          ))}
        </View>
      </View>
    </ToastContext.Provider>
  );
}

function ToastView({ item, onDismiss }: { item: ToastItem; onDismiss: () => void }) {
  const c = useUiColors();
  const anim = useRef(new Animated.Value(0)).current;
  const remaining = useRef(item.persistent ? Infinity : DURATION[item.type]);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const startedAt = useRef(0);
  const [xpShown, setXpShown] = useState(0);

  const leave = useCallback(() => {
    Animated.timing(anim, {
      toValue: 0,
      duration: 200,
      easing: Easing.in(Easing.quad),
      useNativeDriver: true,
    }).start(onDismiss);
  }, [anim, onDismiss]);

  const startTimer = useCallback(() => {
    if (!Number.isFinite(remaining.current)) return;
    startedAt.current = Date.now();
    timer.current = setTimeout(leave, remaining.current);
  }, [leave]);

  const pauseTimer = useCallback(() => {
    if (timer.current) {
      clearTimeout(timer.current);
      remaining.current -= Date.now() - startedAt.current; // Restzeit, kein Reset (toast.md)
    }
  }, []);

  useEffect(() => {
    Animated.timing(anim, {
      toValue: 1,
      duration: 300,
      easing: Easing.bezier(0.16, 1, 0.3, 1),
      useNativeDriver: true,
    }).start();
    startTimer();
    // XP-Count-up 500ms (rAF, ease-out)
    if (item.type === 'xp' && item.xp) {
      const t0 = Date.now();
      const tick = () => {
        const p = Math.min((Date.now() - t0) / 500, 1);
        setXpShown(Math.round((item.xp ?? 0) * (1 - Math.pow(1 - p, 2))));
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    }
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const ICON: Record<ToastType, React.ReactNode> = {
    success: <CheckCircle2 size={16} color={c.success} />,
    error: <AlertCircle size={16} color={c.danger} />,
    warning: <AlertTriangle size={16} color={c.dangerFg === c.fg1 ? c.fg1 : '#C98B2E'} />,
    info: <Info size={16} color={c.fg2} />,
    xp: <Zap size={16} color={c.accent} />,
  };

  return (
    <Animated.View
      style={{
        opacity: anim,
        transform: [
          { translateY: anim.interpolate({ inputRange: [0, 1], outputRange: [-10, 0] }) },
        ],
      }}
      {...(Platform.OS === 'web'
        ? {
            onMouseEnter: pauseTimer,
            onMouseLeave: startTimer,
            role: item.type === 'error' ? 'alert' : 'status',
          }
        : {})}
      className={cn(
        'bg-panel-strong shadow-pop-edge web:backdrop-blur-xl flex-row items-center gap-3 rounded-lg border px-4 py-3',
        item.type === 'xp' ? 'border-accent-border' : 'border-panel-border'
      )}
    >
      {ICON[item.type]}
      <View className="flex-1">
        <Text className="text-fg-1 text-sm">
          {item.type === 'xp' && item.xp !== undefined ? (
            <Text className="text-accent-text font-mono font-semibold">+{xpShown} XP</Text>
          ) : (
            item.message
          )}
        </Text>
        {(item.sub ?? (item.type === 'xp' ? item.message : undefined)) && (
          <Text className="text-fg-3 text-xs">{item.sub ?? item.message}</Text>
        )}
      </View>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Toast schließen"
        onPress={leave}
        hitSlop={8}
      >
        <X size={14} color={c.fg3} />
      </Pressable>
    </Animated.View>
  );
}
