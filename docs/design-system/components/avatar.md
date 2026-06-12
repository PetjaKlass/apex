# Avatar — Initialen-Fallback, Status-Punkt

> `packages/ui/components/Avatar.tsx` · Phase 05 · Konventionen: siehe `README.md`

## Zweck

Repräsentiert eine Person mit Photo oder, bei fehlendem Photo, mit deterministischen Initialen auf Farbfläche. Person-Icon als Fallback ist verboten (§20 Anti-Pattern: „sieht aus wie ein kaputtes Bild"). Jeder Nutzer bekommt eine unverwechselbare Farbe, die aus dem Namen berechnet wird.

## Anatomie

```
╭──────╮           Kreis · border-radius: 9999px
│  PK  │           Initialen: font-ui / 600 / text-inverse (auf Farbfläche)
╰──────╯
     ●             Status-Punkt optional: 8px Kreis unten rechts + 2px Canvas-Ring (Trenner)
```

Maße der Initialen-Schriftgröße je Avatar-Größe:

| Größe | Durchmesser | Initials px | Verwendung |
|---|---|---|---|
| `xs` | 24px | 9px | Kommentarlisten, kompakte Rows |
| `sm` | 28px | 10px | Sidebar-Footer, kompakte Karten |
| `md` | 32px | 11px | Standard (Task-Rows, Habit-Cards) |
| `lg` | 40px | 13px | Kartenheader, Profilzeilen |
| `xl` | 64px | 20px | Profilseite, Onboarding |

## Farbsystem

### Selbst-Avatar (eigener Nutzer)

Immer `linear-gradient(145deg, var(--accent-bright), var(--accent))`. Initialen `var(--text-inverse)`. Folgt dem gewählten Akzent — zeigt dem Nutzer sofort „das bin ich".

### Duo-Partner / andere Nutzer

Deterministischer Pastelton aus einer festen 8-Farben-Palette, berechnet aus dem Nutzernamen:

```ts
const PALETTE = [
  { bg: '#E8D5C4', text: '#6B4A2A' },  // warm sand
  { bg: '#C9DDE8', text: '#2A4E6B' },  // muted blue
  { bg: '#D4E8C9', text: '#2A6B3A' },  // sage green
  { bg: '#E8C9D4', text: '#6B2A44' },  // dusty rose
  { bg: '#D9C9E8', text: '#4A2A6B' },  // lavender
  { bg: '#E8E2C9', text: '#6B5A2A' },  // parchment
  { bg: '#C9E8E2', text: '#2A6B5A' },  // teal mist
  { bg: '#E8D9C9', text: '#6B4A2A' },  // apricot
];

function avatarColor(name: string) {
  const hash = [...name].reduce((acc, c) => acc + c.charCodeAt(0), 0);
  return PALETTE[hash % PALETTE.length];
}
```

Farben sind theme-aware: Dark-Mode erhöht den Kontrast via `color-mix(in srgb, palette.bg 85%, #141417)` für die Fläche. Die Paletten-Werte oben sind Light-Mode-Basiswerte. Gleicher Name → immer gleiche Farbe, auf allen Geräten deterministisch.

## Status-Punkt

Optionaler Punkt unten rechts (8px × 8px, radius-full):

| Status | Farbe | Bedeutung |
|---|---|---|
| `online` | `var(--success)` | Aktuell aktiv |
| `offline` | `var(--bg-subtle)` + `border` | Nicht aktiv |

Trenn-Ring: 2px `var(--canvas)`-Farbe via `box-shadow: 0 0 0 2px var(--canvas)` — der Ring liegt zwischen Punkt und Avatar-Rand, schafft visuelle Trennung ohne extra DOM-Element.

Kein `busy`, kein `away` — Apex ist kein Chat-Tool, Status bleibt binär.

## Bild-Laden

`expo-image` mit Blurhash-Placeholder (nie leeres Rechteck):

```ts
<Image
  source={{ uri: user.avatarUrl }}
  placeholder={{ blurhash: user.avatarBlurHash }}
  contentFit="cover"
  transition={200}   // 200ms opacity fade
  style={{ width: size, height: size, borderRadius: 9999 }}
/>
```

Wenn Bild geladen → Photo sichtbar. Wenn Ladefehler oder kein URL → Initialen-Fallback (nie Person-Icon). Initialen werden immer im Hintergrund gehalten (opacity 0 wenn Photo aktiv, opacity 1 bei Fehler).

## States

`default · loading (blurhash) · image-loaded · image-error (Initialen fallback)`

Kein Hover-State (Avatar ist kein Button). Wenn Avatar klickbar (`onPress`): Pressable-Wrapper, `accessibilityRole="button"`, `aria-label`, Focus-Ring.

## Verhalten & Edge Cases

- Initialen: max. 2 Zeichen. Vorname[0] + Nachname[0], Großbuchstaben. Bei Einzel-Namen: erste 2 Buchstaben.
- Keine Darstellung ohne Name-Prop — Avatar braucht immer `name` für Initials und Farbhash.
- Avatar-Gruppe (mehrere nebeneinander): negativer Margin −8px, z-index steigend, Höchstens 4 sichtbar + „+N"-Badge für Rest.

## Accessibility

- `accessibilityLabel`: `"{Name}'s Avatar"` immer gesetzt.
- `role="img"`.
- Status-Punkt: `accessibilityLabel` auf Avatar erweitern: `"{Name}'s Avatar, online"`.
- Farbkontrast Initialen auf Pastell-Hintergrund: mindestens 4.5:1 (Palette vorgetestet, Light + Dark).

## Plattform

- **Web:** `<img>` via expo-image oder native `<img>` mit CSS-Fallback.
- **Native:** `expo-image` mit blurhash, identisches API.
- Status-Punkt: absolut positioniert, `bottom: 0, right: 0`, auf beiden Plattformen.

## Props (Vertrag)

```ts
export type AvatarProps = {
  name: string;                              // für Initialen + Farbhash — Pflicht
  src?: string;                              // Photo-URL
  blurhash?: string;                         // Placeholder für expo-image
  size?: 'xs'|'sm'|'md'|'lg'|'xl';          // default 'md'
  self?: boolean;                            // eigener Nutzer → Accent-Gradient
  status?: 'online'|'offline';              // Status-Punkt, default kein Punkt
  onPress?: () => void;
  'aria-label'?: string;                     // überschreibt default Label
};
```

## Abnahme-Checkliste

- [ ] 5 Größen × beide Themes × 5 Akzente (self=true) im Demo-Screen
- [ ] Deterministische Pastellfarben: gleicher Name → gleiche Farbe, Light + Dark
- [ ] Kein Person-Icon-Fallback unter keinen Umständen
- [ ] Blurhash → Photo-Überblendung 200ms; Fehler → Initialen sofort sichtbar
- [ ] Status-Punkt: 2px Canvas-Ring korrekt via box-shadow, kein DOM-Element extra
- [ ] Kontrast Initialen auf allen 8 Pastellfarben ≥ 4.5:1 (Light + Dark)
- [ ] accessibilityLabel korrekt inkl. Status; role=img
- [ ] Avatar-Gruppe: negativer Margin, z-index-Ordnung, +N-Badge ab 5
- [ ] hitSlop ≥ 44 wenn klickbar (nativ); cursor pointer Web
