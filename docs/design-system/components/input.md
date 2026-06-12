# Input — Text, E-Mail, Passwort, Zahl, Suche

> `packages/ui/components/Input.tsx` · Phase 04 · Konventionen: siehe `README.md`

## Zweck
Einzeiliges Texteingabefeld in fünf Typen. Das Feld sitzt als Layer-3-Element („eingelassen") in seiner
Karte — `bg-subtle` kommuniziert die Tiefe ohne Rahmen-Theater. Label steht immer sichtbar über dem Feld;
Placeholder-only-Pattern ist verboten (A11y §18, Formular §9).

## Anatomie
```
Label 11px/600 text-2                  [*  Pflichtfeld]
┌─────────────────────────────────────────────────────┐  h 42
│  (Icon 16px text-3)   Wert 13px text-1   (Aktion)  │  r 14  bg-subtle
└─────────────────────────────────────────────────────┘  pad 10×16
  Hinweis oder Fehlermeldung 11px                         text-3 / danger
```
- Label: `font-ui` 11px weight 600 `text-2`, `margin-bottom 6px`; per `htmlFor`/`for` mit Input verknüpft.
- Pflichtmarkierung: `*` in `danger` hinter dem Label-Text, `aria-required="true"` auf dem Input.
- Linkes Icon optional (Typ `search`: Lupe fest; Typ `password`: Schloss fest); Aktion-Slot rechts
  (Passwort: Auge-Toggle; Suche: Clearing-X wenn Text vorhanden).
- Fehlermeldung unter dem Feld: 11px `danger`, `role="alert"`, `id` per `aria-describedby` verknüpft.
- Hinweistext (hint): 11px `text-3`, erscheint nur wenn kein Fehler aktiv, selbe `aria-describedby`-ID.

## Varianten & Größen
| Typ | Besonderheiten |
|---|---|
| `text` | Standard |
| `email` | `inputMode="email"`, `autoCapitalize="none"`, `autoCorrect={false}` |
| `password` | Auge-Icon rechts togglet `secureTextEntry`; Text niemals im State geloggt |
| `number` | `inputMode="decimal"`, `keyboardType="decimal-pad"` (native); rechts: Stepper ±1 optional |
| `search` | Lupe links fest, `role="searchbox"`, X-Button sobald `value.length > 0` |

| Größe | Höhe | pad-y | Schrift | Einsatz |
|---|---|---|---|---|
| `sm` | 34 | 7 | 12px | Dichte Listen, Inline-Filter |
| `md` (Default) | 42 | 10 | 13px | Formulare, Modals |
| `lg` | 50 | 14 | 14px | Onboarding, Solo-Felder |

## States
| State | Darstellung |
|---|---|
| `default` | `bg-subtle`, Border `border` (beide Themes — Eingabefelder brauchen Kante), `edge` |
| `hover` (Web) | `border-color: border-strong` 150ms springOut |
| `focus-visible` | `border-color: accent` + `box-shadow: 0 0 0 4px accent-glow, edge` (instant) |
| `filled` | Wert in `text-1`; keine sonstige Änderung |
| `error` | `border-color: danger`; Fehlermeldung sichtbar; Focus: Glow in `danger-glow` (6% alpha) |
| `disabled` | `opacity .4`, `cursor: not-allowed`, kein Hover/Focus |
| `readonly` | `bg-subtle` wie default, kein Focus-Ring, `cursor: default`, `aria-readonly="true"` |

## Mikro-Interaktion
- Focus: Border- und Glow-Wechsel instant (kein Tween — Fokus ist Orientierung, nicht Animation).
- Fehler-Einblendung: Fehlermeldung faded 150ms spring von `opacity 0, translateY -4px` → sichtbar.
- Suche X-Button: erscheint 150ms nach erstem Keystroke (opacity 0 → 1, scale .8 → 1, springy 200ms).
- Passwort-Auge: Toggle instant, kein Layout-Shift (Icon bleibt in gleicher Position).

## Verhalten & Edge Cases
- Label niemals durch Placeholder ersetzen; Placeholder verschwindet beim Tippen und darf kein Pflichtfeld beschriften.
- Maximale Label-Länge: 40 Zeichen; danach `text-overflow: ellipsis` (kein Wrap, Layout-Stabilität).
- Zahl-Typ: kein `type="number"` (Browser-Spinners unerwünscht); stattdessen `inputMode="decimal"` + Validierung.
- Paste in Passwort-Feld: erlaubt (Passwort-Manager-Konformität, WCAG 2.5.3).
- Autocomplete: `autoComplete`-Prop durchreichen; nie pauschal `off` setzen (bricht Passwort-Manager).
- Fehlermeldung und Hinweistext teilen sich `aria-describedby` — Fehler überschreibt Hint im DOM nicht,
  sondern schaltet die Sichtbarkeit per `hidden`-Attribut um.

## Plattform
- **Web:** `<label>` + `<input>` in `<div>`-Wrapper; `focus-visible` via CSS; Cursor `text`.
- **Native:** `View` + `Text` (Label) + `TextInput`; `accessibilityLabel` kombiniert Label + Hint/Error;
  `returnKeyType` je nach Formularkontext (`next` / `done`); Tastatur per `onSubmitEditing` weiterschalten.
- Border in beiden Themes: Light `border` (`rgba(20,18,12,.07)`), Dark `border` (`rgba(255,255,255,.075)`) —
  Ausnahme von der „Borders nur Dark"-Regel, da Eingabefelder strukturell eine Kante brauchen.

## Props (Vertrag)
```ts
export type InputProps = {
  type?: 'text'|'email'|'password'|'number'|'search'; // default 'text'
  size?: 'sm'|'md'|'lg';                              // default 'md'
  label: string;
  placeholder?: string;
  value: string;
  onChangeText: (v: string) => void;
  hint?: string;
  error?: string;
  required?: boolean;
  disabled?: boolean;
  readonly?: boolean;
  leftIcon?: IconComponent;
  rightAction?: React.ReactNode;     // Auge, X etc. — intern gerendert
  autoComplete?: string;
  returnKeyType?: 'next'|'done'|'search'|'go';
  onSubmitEditing?: () => void;
  'aria-describedby'?: string;       // bei externer Verkettung
};
```

## Abnahme-Checkliste
- [ ] Label sichtbar über Feld, `htmlFor`-Verknüpfung korrekt, kein Placeholder-only-Feld
- [ ] Focus-Glow instant, `border-color: accent`, `box-shadow: 0 0 0 4px accent-glow`
- [ ] Error: `border-color: danger`, Meldung 11px darunter, `aria-describedby` korrekt verknüpft
- [ ] Passwort-Toggle ohne Layout-Shift; Paste erlaubt
- [ ] Disabled `opacity .4`, kein Focus/Hover; Readonly kein Focus-Ring
- [ ] 5 Typen × 3 Größen × 2 Themes × 5 Akzente im Demo-Screen
- [ ] VoiceOver/TalkBack liest Label + Fehlertext in korrekter Reihenfolge
