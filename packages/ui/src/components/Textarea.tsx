/** Textarea — wächst mit Inhalt (kein Resize-Handle), Zeichenzähler ab maxLength (textarea.md). */
import { useState } from 'react';
import { Platform, Text, TextInput, View } from 'react-native';
import { cn } from '../cn';
import { useUiColors } from '../theme';

export type TextareaProps = {
  size?: 'sm' | 'md' | 'lg';
  label: string;
  placeholder?: string;
  value: string;
  onChangeText: (v: string) => void;
  maxLength?: number;
  maxHeight?: number;
  hint?: string;
  error?: string;
  required?: boolean;
  disabled?: boolean;
  readonly?: boolean;
};

const SIZE = {
  sm: { text: 'text-xs', minH: 68 },
  md: { text: 'text-sm', minH: 84 },
  lg: { text: 'text-base', minH: 100 },
} as const;

export function Textarea({
  size = 'md',
  label,
  placeholder,
  value,
  onChangeText,
  maxLength,
  maxHeight = 320,
  hint,
  error,
  required,
  disabled,
  readonly,
}: TextareaProps) {
  const c = useUiColors();
  const s = SIZE[size];
  const [focused, setFocused] = useState(false);
  const [height, setHeight] = useState<number>(s.minH);
  const hasError = Boolean(error);
  const nearLimit = maxLength !== undefined && value.length >= maxLength * 0.9;

  return (
    <View className="w-full">
      <View className="mb-1.5 flex-row items-center gap-1">
        <Text className="text-2xs text-fg-2 font-semibold" numberOfLines={1}>
          {label}
        </Text>
        {required && <Text className="text-2xs text-danger font-semibold">*</Text>}
      </View>
      <TextInput
        multiline
        className={cn(
          'bg-subtle text-fg-1 shadow-edge w-full rounded border px-4 py-3',
          s.text,
          hasError ? 'border-danger' : focused ? 'border-accent' : 'border-border',
          focused && !hasError && 'web:shadow-[0_0_0_4px_var(--accent-glow)]',
          disabled && 'opacity-40',
          Platform.OS === 'web' && 'web:outline-none web:resize-none'
        )}
        style={[
          { height: Math.min(Math.max(height, s.minH), maxHeight) },
          // Web: UA-Fokus-Rechteck entfernen (Fokus = Akzent-Rand + Glow)
          Platform.OS === 'web' ? ({ outlineStyle: 'none' } as object) : null,
        ]}
        onContentSizeChange={(e) => setHeight(e.nativeEvent.contentSize.height + 24)}
        placeholder={placeholder}
        placeholderTextColor={c.fg3}
        value={value}
        onChangeText={onChangeText}
        maxLength={maxLength}
        editable={!disabled && !readonly}
        onFocus={() => !readonly && setFocused(true)}
        onBlur={() => setFocused(false)}
        accessibilityLabel={label}
        accessibilityHint={error ?? hint}
      />
      <View className="mt-1.5 flex-row">
        {(error ?? hint) && (
          <Text
            className={cn('flex-1 text-xs', hasError ? 'text-danger-fg' : 'text-fg-3')}
            {...(Platform.OS === 'web' ? { role: hasError ? 'alert' : undefined } : {})}
          >
            {error ?? hint}
          </Text>
        )}
        {maxLength !== undefined && (
          <Text
            className={cn('ml-auto font-mono text-xs', nearLimit ? 'text-danger-fg' : 'text-fg-3')}
          >
            {value.length}/{maxLength}
          </Text>
        )}
      </View>
    </View>
  );
}
