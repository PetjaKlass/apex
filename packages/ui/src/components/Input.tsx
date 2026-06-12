/**
 * Input — 5 Typen, 3 Größen (docs/design-system/components/input.md).
 * Label IMMER sichtbar über dem Feld (Placeholder-only verboten). Layer-3: bg-subtle + Kante.
 * Kein Transition auf dem Feld selbst (Tipp-Latenz!), Focus-Wechsel instant.
 */
import { useId, useState } from 'react';
import { Platform, Pressable, Text, TextInput, View } from 'react-native';
import { Eye, EyeOff, Search, X } from 'lucide-react-native';
import { cn } from '../cn';
import { useUiColors } from '../theme';

export type InputType = 'text' | 'email' | 'password' | 'number' | 'search';
export type InputSize = 'sm' | 'md' | 'lg';

export type InputProps = {
  type?: InputType;
  size?: InputSize;
  label: string;
  placeholder?: string;
  value: string;
  onChangeText: (v: string) => void;
  hint?: string;
  error?: string;
  required?: boolean;
  disabled?: boolean;
  readonly?: boolean;
  autoComplete?: React.ComponentProps<typeof TextInput>['autoComplete'];
  returnKeyType?: 'next' | 'done' | 'search' | 'go';
  onSubmitEditing?: () => void;
};

const SIZE: Record<InputSize, { box: string; text: string; icon: number }> = {
  sm: { box: 'h-[34px] px-3', text: 'text-xs', icon: 14 },
  md: { box: 'h-[42px] px-4', text: 'text-sm', icon: 16 },
  lg: { box: 'h-[50px] px-4', text: 'text-base', icon: 18 },
};

const TYPE_PROPS: Record<InputType, Partial<React.ComponentProps<typeof TextInput>>> = {
  text: {},
  email: {
    inputMode: 'email',
    autoCapitalize: 'none',
    autoCorrect: false,
    keyboardType: 'email-address',
  },
  password: { autoCapitalize: 'none', autoCorrect: false },
  number: { inputMode: 'decimal', keyboardType: 'decimal-pad' },
  search: { inputMode: 'search', returnKeyType: 'search' },
};

export function Input({
  type = 'text',
  size = 'md',
  label,
  placeholder,
  value,
  onChangeText,
  hint,
  error,
  required = false,
  disabled = false,
  readonly = false,
  autoComplete,
  returnKeyType,
  onSubmitEditing,
}: InputProps) {
  const c = useUiColors();
  const s = SIZE[size];
  const id = useId();
  const describedBy = `${id}-desc`;
  const [focused, setFocused] = useState(false);
  const [secure, setSecure] = useState(type === 'password');
  const hasError = Boolean(error);
  const showClear = type === 'search' && value.length > 0 && !disabled && !readonly;

  return (
    <View className="w-full">
      <View className="mb-1.5 flex-row items-center gap-1">
        <Text
          className="text-2xs text-fg-2 font-semibold"
          numberOfLines={1}
          {...(Platform.OS === 'web' ? { htmlFor: id } : {})}
        >
          {label}
        </Text>
        {required && <Text className="text-2xs text-danger font-semibold">*</Text>}
      </View>

      <View
        className={cn(
          'shadow-edge flex-row items-center gap-2 rounded border',
          'bg-subtle',
          s.box,
          // States: instant, kein Tween (input.md §Mikro-Interaktion)
          hasError ? 'border-danger' : focused ? 'border-accent' : 'border-border',
          focused && !hasError && 'web:shadow-[0_0_0_4px_var(--accent-glow)]',
          focused && hasError && 'web:shadow-[0_0_0_4px_rgba(194,85,85,0.06)]',
          disabled && 'opacity-40'
        )}
      >
        {type === 'search' && <Search size={s.icon} color={c.fg3} />}
        <TextInput
          id={Platform.OS === 'web' ? id : undefined}
          className={cn(
            'text-fg-1 flex-1 py-0',
            s.text,
            Platform.OS === 'web' && 'web:outline-none'
          )}
          placeholder={placeholder}
          placeholderTextColor={c.fg3}
          value={value}
          onChangeText={onChangeText}
          editable={!disabled && !readonly}
          secureTextEntry={type === 'password' ? secure : false}
          onFocus={() => !readonly && setFocused(true)}
          onBlur={() => setFocused(false)}
          autoComplete={autoComplete}
          returnKeyType={returnKeyType}
          onSubmitEditing={onSubmitEditing}
          accessibilityLabel={label}
          accessibilityHint={error ?? hint}
          {...(Platform.OS === 'web'
            ? {
                'aria-required': required,
                'aria-invalid': hasError,
                'aria-describedby': describedBy,
              }
            : {})}
          {...TYPE_PROPS[type]}
        />
        {type === 'password' && (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={secure ? 'Passwort anzeigen' : 'Passwort verbergen'}
            onPress={() => setSecure((v) => !v)}
            hitSlop={8}
          >
            {secure ? <Eye size={s.icon} color={c.fg3} /> : <EyeOff size={s.icon} color={c.fg3} />}
          </Pressable>
        )}
        {showClear && (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Eingabe löschen"
            onPress={() => onChangeText('')}
            hitSlop={8}
          >
            <X size={s.icon} color={c.fg3} />
          </Pressable>
        )}
      </View>

      {(error ?? hint) && (
        <Text
          className={cn('mt-1.5 text-xs', hasError ? 'text-danger-fg' : 'text-fg-3')}
          {...(Platform.OS === 'web'
            ? { id: describedBy, role: hasError ? 'alert' : undefined }
            : {})}
        >
          {error ?? hint}
        </Text>
      )}
    </View>
  );
}
