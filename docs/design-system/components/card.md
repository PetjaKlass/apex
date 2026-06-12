# Card — Layer-2-Fläche

> `packages/ui/components/Card.tsx` · Phase 04 · Konventionen: siehe `README.md`

## Zweck

Strukturiert Inhalte auf Layer-2 — die einzige opake Fläche unterhalb der Pop-Ebene. Karten erzeugen Hierarchie durch Schatten und Lichtkante, nicht durch Farbe. Blur ist auf Karten verboten (Panel-Ebene-Vorbehalt).

## Anatomie

```
╭──────────────────────────────────────────╮  radius 20 · bg-card · shadow-card + edge
│ [section-header]   15px/600   [hint 12]  │  Sub-Slot: section-h — font-ui, text-2
│──────────────────────────────────────────│  Divider: 1px border
│                                          │
│  Slot: children                          │  padding clamp(16px, 1.5vw, 24px) ringsum
│                                          │
│ [footer-slot optional]                   │  z. B. Buttons-Zeile
╰──────────────────────────────────────────╯
```

Maße: Radius 20 (`radius-lg`). Padding: `clamp(16px, 1.5vw, 24px)` (CSS), nativ `space-4` mobile / `space-6` ab 400px. Section-Header-Slot: 15px/600/text-1 + Hint-Text 12px/text-3 rechtsbündig.

## Varianten

| Variante | Fläche | Border | Verwendung |
|---|---|---|---|
| `default` | `card` (#FFFFFF / #141417 opak) | Dark: `1px border`, Light: transparent | Standardfall |
| `hoverable` | wie default | wie default | Karte ist komplett klickbar (z. B. Vision-Card) |
| `subtle` | `bg-subtle` | Dark: `border`, Light: keiner | Eingebettete Blöcke in Karten (Layer-3-Emulation) |

`hoverable` ist der einzige Fall, in dem eine Karte auf Hover reagiert. Nur wenn die gesamte Karte eine Aktion auslöst — nie für dekorativen Lift. Verbote: Karte-in-Karte (Layer-Regel §3), Blur auf Karten.

## Größen

Keine festen Größenvarianten — Karten wachsen mit Inhalt. Max-Width-Einschränkung liegt beim Container/Grid, nicht bei der Karte.

## States

| State | Verhalten |
|---|---|
| `default` | shadow-card + edge |
| `hover` (nur Web, nur `hoverable`) | translateY(-2px), shadow-panel + edge, 150ms springOut |
| `focus-visible` (wenn Pressable) | 2px outline accent-bright, offset 2px — instant |
| `pressed` (nur `hoverable`, nativ) | bg-pressed Überlagerung, 100ms linear |
| `disabled` | opacity .4, kein Hover/Press |

Hover darf niemals Layout-Shift verursachen. Die translateY-Verschiebung bei `hoverable` ist der einzige erlaubte „Lift". Schatten selbst wird nicht animiert (Performance §8) — shadow-card bleibt im DOM, shadow-panel erscheint via Opacity-Trick oder direkt via class-swap.

## Mikro-Interaktion

Hover (Web, hoverable): 150ms springOut, translateY(-2px), shadow-panel. Release: sofort zurück (keine Rückfeder — Karten sind keine Buttons). Native Press: bg-pressed Overlay 100ms, kein Scale (Karten skalieren nicht). Haptik: Light auf Press, nur nativ, nur wenn `onPress` gesetzt.

## Verhalten & Edge Cases

- Karte ohne `onPress`: kein Hover-State, kein Cursor-Pointer, keine Pressable-Rolle.
- Karte mit `onPress`: Pressable-Wrapper + `accessibilityRole="button"` + Pflicht-`aria-label`.
- Section-Header-Slot: Divider (1px `border`) erscheint nur wenn `header` UND `children` beide befüllt sind.
- Footer-Slot: immer am unteren Rand, kein eigener Innenabstand — erbt padding der Karte.
- Inhalt darf vertikal scrollen wenn `scrollable` Prop gesetzt — dann overflow-y auto, max-height vom Parent-Container kontrolliert.
- Karten-Stapelung: niemals zwei Card-Komponenten direkt ineinander. Zweites Element ist `variant="subtle"` oder ein roher View mit bg-subtle.

## Plattform

- **Web:** `<div>` mit CSS-Klassen, Hover via `:hover`, Cursor `pointer` bei hoverable.
- **Native:** `Pressable` wenn `onPress`, sonst `View`. Scale verboten (nur bei Buttons). Radius 20 via StyleSheet.
- Konzentrische Radien: Innenelemente (Inputs, Chips) müssen Radius ≤ 14 haben (Außen 20 − Padding 6 min → konzentrisch ca. 13-14).

## Props (Vertrag)

```ts
export type CardProps = {
  variant?: 'default' | 'hoverable' | 'subtle';  // default 'default'
  header?: string;                                // section-h Slot
  hint?: string;                                  // rechts neben header, 12px text-3
  footer?: React.ReactNode;                       // footer Slot
  scrollable?: boolean;                           // overflow-y auto
  onPress?: () => void;                           // aktiviert hoverable-Verhalten
  'aria-label'?: string;                          // Pflicht wenn onPress gesetzt
  disabled?: boolean;
  children: React.ReactNode;
};
```

## Abnahme-Checkliste

- [ ] Light: kein sichtbarer Border, nur Schatten und edge sichtbar
- [ ] Dark: 1px hairline `border` + shadow-card + edge
- [ ] `hoverable` translateY(-2px) NUR bei gesetztem `onPress`; kein Layout-Shift
- [ ] Kein Blur, kein Gradient, keine Transparenz auf Kartenfläche
- [ ] Section-h: 15px/600/text-1, Hint 12px/text-3 — beide Themes, 5 Akzente
- [ ] Konzentrische Radien: Innenelemente überprüft
- [ ] Pressable: Rolle, Label, Focus-Ring, Haptik korrekt (nativ)
- [ ] Keine Card-in-Card-Nesting in Demo-Screen
