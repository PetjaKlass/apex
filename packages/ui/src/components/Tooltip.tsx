/**
 * Tooltip — NUR Web-Hover/-Fokus, NIE Touch (tooltip.md, Anti-Pattern §20).
 * 600ms Delay; Intent-Continuity: <200ms nach letztem Tooltip → sofort.
 */
import { useRef, useState } from 'react';
import { Platform, Text, View } from 'react-native';
import { cn } from '../cn';

let lastHiddenAt = 0;

export type TooltipProps = { label: string; children: React.ReactNode };

export function Tooltip({ label, children }: TooltipProps) {
  const [open, setOpen] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  if (Platform.OS !== 'web') return <>{children}</>;

  const show = () => {
    const delay = Date.now() - lastHiddenAt < 200 ? 0 : 600;
    timer.current = setTimeout(() => setOpen(true), delay);
  };
  const hide = () => {
    if (timer.current) clearTimeout(timer.current);
    if (open) lastHiddenAt = Date.now();
    setOpen(false);
  };

  return (
    <View
      className="web:relative self-start"
      {...({ onMouseEnter: show, onMouseLeave: hide, onFocus: show, onBlur: hide } as object)}
    >
      {children}
      {open && (
        <View
          {...({ role: 'tooltip' } as object)}
          className={cn(
            'web:absolute web:bottom-full web:left-1/2 web:z-tooltip web:-translate-x-1/2 mb-2',
            'bg-card border-hairline shadow-card-edge max-w-[240px] rounded-sm border px-3 py-1.5'
          )}
        >
          <Text className="text-fg-1 text-xs" numberOfLines={3}>
            {label}
          </Text>
        </View>
      )}
    </View>
  );
}
