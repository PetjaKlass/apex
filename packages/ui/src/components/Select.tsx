/**
 * Select — KEIN natives <select> (select.md). Trigger im Input-Look + Chevron.
 * Web: Dropdown auf Pop-Ebene (panelStrong, r20, shadow-pop) mit Tastatur-Navigation.
 * Native: Bottom-Sheet via RN-Modal (Vollausbau-Sheet kommt mit modal.md in Phase 06).
 */
import { useMemo, useRef, useState } from 'react';
import { FlatList, Modal, Platform, Pressable, Text, View } from 'react-native';
import { Check, ChevronDown } from 'lucide-react-native';
import { cn } from '../cn';
import { tapLight } from '../haptics';
import { useUiColors } from '../theme';

export type SelectOption = { value: string; label: string; disabled?: boolean };
export type SelectGroup = { label: string; options: SelectOption[] };

export type SelectProps = {
  size?: 'sm' | 'md' | 'lg';
  label: string;
  placeholder?: string;
  value: string | null;
  onChange: (value: string) => void;
  options: SelectOption[] | SelectGroup[];
  error?: string;
  hint?: string;
  required?: boolean;
  disabled?: boolean;
  maxHeight?: number;
};

const SIZE = {
  sm: { box: 'h-[34px] px-3', text: 'text-xs', icon: 14 },
  md: { box: 'h-[42px] px-4', text: 'text-sm', icon: 16 },
  lg: { box: 'h-[50px] px-4', text: 'text-base', icon: 18 },
} as const;

type Row = { kind: 'group'; label: string } | { kind: 'option'; option: SelectOption };

function flatten(options: SelectProps['options']): Row[] {
  if (options.length > 0 && 'options' in (options[0] as object)) {
    return (options as SelectGroup[]).flatMap((g) => [
      { kind: 'group' as const, label: g.label },
      ...g.options.map((option) => ({ kind: 'option' as const, option })),
    ]);
  }
  return (options as SelectOption[]).map((option) => ({ kind: 'option' as const, option }));
}

export function Select({
  size = 'md',
  label,
  placeholder = 'Auswählen…',
  value,
  onChange,
  options,
  error,
  hint,
  required,
  disabled,
  maxHeight = 320,
}: SelectProps) {
  const c = useUiColors();
  const s = SIZE[size];
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const rows = useMemo(() => flatten(options), [options]);
  const selectable = useMemo(
    () =>
      rows.map((r, i) => ({ r, i })).filter(({ r }) => r.kind === 'option' && !r.option.disabled),
    [rows]
  );
  const selected = useMemo(
    () =>
      rows.find(
        (r): r is Extract<Row, { kind: 'option' }> =>
          r.kind === 'option' && r.option.value === value
      ),
    [rows, value]
  );
  const hasError = Boolean(error);
  const triggerRef = useRef<View>(null);

  const openMenu = () => {
    if (disabled) return;
    tapLight();
    const sel = selectable.findIndex(({ r }) => r.kind === 'option' && r.option.value === value);
    setActive(sel >= 0 ? sel : 0);
    setOpen(true);
  };

  const commit = (opt: SelectOption) => {
    onChange(opt.value);
    setOpen(false);
  };

  const onKeyDown =
    Platform.OS === 'web'
      ? (e: { key: string; preventDefault(): void }) => {
          if (!open && (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowDown')) {
            e.preventDefault();
            openMenu();
            return;
          }
          if (!open) return;
          if (e.key === 'Escape') setOpen(false);
          else if (e.key === 'ArrowDown') {
            e.preventDefault();
            setActive((a) => Math.min(a + 1, selectable.length - 1));
          } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            setActive((a) => Math.max(a - 1, 0));
          } else if (e.key === 'Home') setActive(0);
          else if (e.key === 'End') setActive(selectable.length - 1);
          else if (e.key === 'Enter') {
            e.preventDefault();
            const row = selectable[active]?.r;
            if (row?.kind === 'option') commit(row.option);
          }
        }
      : undefined;

  const menuRows = (
    <View className="p-1" style={{ maxHeight }}>
      <FlatList
        data={rows}
        keyExtractor={(_, i) => String(i)}
        renderItem={({ item, index }) => {
          if (item.kind === 'group') {
            return (
              <View className="border-border border-t px-3 pb-1 pt-2 first:border-t-0">
                <Text className="text-2xs text-fg-3 font-semibold uppercase tracking-widest">
                  {item.label}
                </Text>
              </View>
            );
          }
          const isSelected = item.option.value === value;
          const selIdx = selectable.findIndex(({ i }) => i === index);
          const isActive = selIdx === active;
          return (
            <Pressable
              accessibilityRole={Platform.OS === 'web' ? ('option' as never) : 'button'}
              accessibilityState={{ selected: isSelected, disabled: item.option.disabled }}
              disabled={item.option.disabled}
              onPress={() => commit(item.option)}
              onHoverIn={() => selIdx >= 0 && setActive(selIdx)}
              className={cn(
                'h-9 flex-row items-center gap-2 rounded-sm px-3',
                isActive && 'bg-hover',
                item.option.disabled && 'opacity-40'
              )}
            >
              <Text
                numberOfLines={1}
                className={cn(
                  'flex-1 text-sm',
                  isSelected ? 'text-accent-text font-semibold' : 'text-fg-1'
                )}
              >
                {item.option.label}
              </Text>
              {isSelected && <Check size={14} color={c.accent} />}
            </Pressable>
          );
        }}
      />
    </View>
  );

  return (
    <View className="w-full" ref={triggerRef}>
      <View className="mb-1.5 flex-row items-center gap-1">
        <Text className="text-2xs text-fg-2 font-semibold" numberOfLines={1}>
          {label}
        </Text>
        {required && <Text className="text-2xs text-danger font-semibold">*</Text>}
      </View>

      <View className={cn(Platform.OS === 'web' && 'web:relative')}>
        <Pressable
          accessibilityRole={Platform.OS === 'web' ? ('combobox' as never) : 'button'}
          accessibilityLabel={label}
          accessibilityState={{ expanded: open, disabled }}
          accessibilityHint={error ?? hint}
          disabled={disabled}
          onPress={() => (open ? setOpen(false) : openMenu())}
          {...(onKeyDown ? { onKeyDown } : {})}
          className={cn(
            'bg-subtle shadow-edge flex-row items-center gap-2 rounded border',
            s.box,
            hasError
              ? 'border-danger'
              : open
                ? 'border-accent web:shadow-[0_0_0_4px_var(--accent-glow)]'
                : 'border-border',
            disabled && 'opacity-40',
            'web:outline-none'
          )}
        >
          <Text
            numberOfLines={1}
            className={cn('flex-1', s.text, selected ? 'text-fg-1' : 'text-fg-3')}
          >
            {selected ? selected.option.label : placeholder}
          </Text>
          <View style={{ transform: [{ rotate: open ? '180deg' : '0deg' }] }}>
            <ChevronDown size={s.icon} color={c.fg3} />
          </View>
        </Pressable>

        {/* Web: Dropdown unterhalb des Triggers */}
        {Platform.OS === 'web' && open && (
          <>
            <Pressable
              accessibilityLabel="Schließen"
              onPress={() => setOpen(false)}
              className="web:fixed web:inset-0 web:z-overlay"
            />
            <View className="web:absolute web:left-0 web:right-0 web:top-full web:z-dropdown border-panel-border bg-panel-strong shadow-pop-edge web:backdrop-blur-2xl mt-2 rounded-lg border">
              {menuRows}
            </View>
          </>
        )}
      </View>

      {/* Native: Bottom-Sheet (Minimal — modal.md-Vollausbau in Phase 06) */}
      {Platform.OS !== 'web' && (
        <Modal
          visible={open}
          transparent
          animationType="slide"
          onRequestClose={() => setOpen(false)}
        >
          <Pressable
            className="flex-1 bg-black/40"
            accessibilityLabel="Schließen"
            onPress={() => setOpen(false)}
          />
          <View className="bg-card shadow-pop-edge rounded-t-2xl pb-8 pt-2">
            <View className="bg-subtle mb-2 h-1 w-9 self-center rounded-full" />
            <Text className="text-2xs text-fg-3 px-4 pb-2 font-semibold uppercase tracking-widest">
              {label}
            </Text>
            {menuRows}
          </View>
        </Modal>
      )}

      {(error ?? hint) && (
        <Text
          className={cn('mt-1.5 text-xs', hasError ? 'text-danger-fg' : 'text-fg-3')}
          {...(Platform.OS === 'web' ? { role: hasError ? 'alert' : undefined } : {})}
        >
          {error ?? hint}
        </Text>
      )}
    </View>
  );
}
