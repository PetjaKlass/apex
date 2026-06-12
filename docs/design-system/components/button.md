# Button — Muster-Spec

> `packages/ui/components/Button.tsx` · Phase 04 · Konventionen: siehe `README.md` (werden hier nicht wiederholt)

## Zweck
Die eine Handlung, die Apex dem Nutzer gerade anbietet. Buttons sind **Pills** (`radius-full`) — eckige Buttons existieren in Apex nicht.

## Anatomie
```
[ (Icon 15px)  Label 13px/600  (Icon) ]   height 38 · padding-x 20
```
- Label: `font-ui`, 13px, weight 600, tracking −0.01em. Ein Button, ein Verb („Fokus starten", nie „OK").
- Icon optional links ODER rechts, nie beides. Icon = Labelgröße + 2px (15px), `currentColor`, gap 8.
- Icon-only: erlaubt ab Größe `md`, dann Pflicht-`aria-label`, Form = Kreis (width = height).

## Varianten
| Variante | Fläche | Text | Schatten | Verwendung |
|---|---|---|---|---|
| `primary` | `linear-gradient(145deg, accent-bright, accent)` | `text-inverse` | `0 6px 18px accent-glow` + `edge` | **Max. 1 pro View.** Die Tageshandlung. |
| `secondary` | `card` (opak) + Border nur Dark | `text-1` | `shadow-card` + `edge` | Standard-Aktionen |
| `ghost` | transparent, hover `bg-hover` | `text-2`→`text-1` | — | Tertiär, Dichte-Kontexte |
| `danger-ghost` | transparent, hover `danger` 10% | `danger` | — | Destruktiv (immer + Confirm-Modal) |
| `hero-secondary` | `rgba(255,255,255,.09)` + Border `…,.14` | `hero-text` | — | NUR auf OBTHero/dunklen Hero-Karten |

Kein `danger`-Fill (zu laut für Apex), kein „link"-Button (Inline-Links sind Text mit Underline).

## Größen
| Größe | Höhe | Pad-x | Text | Icon | Einsatz |
|---|---|---|---|---|---|
| `sm` | 32 | 16 | 12px | 13 | Kartenfuß, Chips-Nähe |
| `md` (Default) | 38 | 20 | 13px | 15 | überall |
| `lg` | 46 | 32 | 14px | 16 | Fokus-Controls, Onboarding, Marketing-CTA |

Touch: hitSlop auf ≥ 44 Gesamthöhe bei `sm`/`md` (native).

## States (zusätzlich zur Pflicht-Matrix im README)
- **hover (Web):** primary `filter: brightness(1.05)`; secondary `bg-hover`; 150ms springOut. Kein Lift, kein Schattenwechsel (Buttons wachsen nicht).
- **pressed:** `scale(.97)` 100ms linear + Haptik Light (nur primary/secondary, native).
- **loading:** Label bleibt (Breite friert via `min-width` aus gemessener Breite ein — kein Springen), Icon-Slot zeigt Spinner (`Loader2`, 720ms/U, linear). Button `disabled`, `aria-busy="true"`. Spinner erscheint erst nach 200ms (kein Flackern), bleibt min. 300ms.
- **disabled:** opacity .4; primary verliert Glow-Schatten (sonst „leuchtet tot").

## Mikro-Interaktion
Press: 0→100ms scale .97 → Release: 150ms spring zurück. Erfolgsfeedback gehört NICHT in den Button (kein grüner Blitz) — Erfolg kommuniziert der Toast/die Liste.

## Verhalten & Edge Cases
- Doppel-Submit: ab Klick `disabled` bis Promise settled; Handler idempotent aufrufen.
- Label-Truncation verboten — Button wächst horizontal; bricht das Layout, ist die Hierarchie falsch (Variante runterstufen).
- Min-Breite 64px (`sm` 48px), damit „Ja"/„Nein" nicht zu Punkten schrumpfen.
- Zwei Buttons nebeneinander: gap 12, primärer rechts (Web/Modal) bzw. oben (mobiler Stack).
- In Formularen: `type="submit"` nur der primäre; Enter löst genau ihn aus.

## Plattform
- **Web:** `<button>` (nie `<div role=button>` für echte Buttons), `cursor: pointer`, `:focus-visible`-Ring.
- **Native:** `Pressable` + `accessibilityRole="button"`, `accessibilityState={{disabled, busy}}`; Scale via Reanimated (UI-Thread).
- Gradient: Web CSS, native `expo-linear-gradient` (gleiche Stops 145°).

## Props (Vertrag)
```ts
export type ButtonProps = {
  variant?: 'primary'|'secondary'|'ghost'|'danger-ghost'|'hero-secondary'; // default 'secondary'
  size?: 'sm'|'md'|'lg';            // default 'md'
  icon?: IconComponent; iconSide?: 'left'|'right';   // default 'left'
  loading?: boolean; disabled?: boolean;
  onPress: () => void | Promise<void>;
  children: string;                  // Label ist Pflicht außer iconOnly
  iconOnly?: boolean; 'aria-label'?: string;  // Pflicht bei iconOnly
};
```

## Abnahme-Checkliste
- [ ] 5 Varianten × 3 Größen × beide Themes × 5 Akzente im Demo-Screen
- [ ] Loading friert Breite ein; Spinner-Timing 200/300ms; kein Doppel-Submit
- [ ] Focus-Ring instant, Kontrast ≥ 3:1 auf allen Flächen
- [ ] Haptik Light nur native, nur primary/secondary
- [ ] VoiceOver/TalkBack: Rolle, Label, busy/disabled korrekt
- [ ] Genau 1 `primary` pro View (Lint-Regel oder Review)
