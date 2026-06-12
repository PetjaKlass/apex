# Badge — Chips, Tags, Delta, Count

> `packages/ui/components/Badge.tsx` · Phase 05 · Konventionen: siehe `README.md`

## Zweck
Vier semantisch verschiedene Badge-Familien für Zustandsinformation, Kategorisierung, Veränderungen und
Navigation. Farbe trägt immer Bedeutung (S2); keine dekorativen Farbflächen. Live-Zahlen in Badges
(Counter, Streak) folgen Signatur S3: `font-mono` + `tnum`, damit Ziffern beim Zählen nicht springen.

## Anatomie & Familien

### 1. Chip — Statuszustände, Sync, Tags mit Dot
```
╭──────────────────────╮  r-full  h auto  pad 3×10
│  ● Label 11px/500    │  border: border  bg: card-glass  edge
╰──────────────────────╯  text-2  Dot 7px  gap 5
```
- Dot: 7px, `border-radius: full`; Farbe trägt Bedeutung (success/warning/danger/onhold/accent).
- Dot-only-Variante (kein Label): erlaubt als Pulse-Indikator (Sync-Dot) in Topbar-Chips.
- Accent-Variante (`chip-accent`): `bg: accent-dim`, `border: transparent`, `color: accent`.
- Status-Chips NUR mit semantischer Bedeutung (S2): z. B. Sync-Online, Streak-Risiko, Aufgaben-Priorität.
  Farbe-auf-Tint niemals dekorativ.

### 2. Tag — Kategorien, Felder, Labels
```
╭──────────╮  r-full  pad 2×9  bg-subtle  text-2  11px/500  kein Border
╰──────────╯
```
- Leichter als Chip (kein Border, kein edge), für dichte Kontexte (Task-Meta, Filter-Liste).
- Optional: `onRemove`-Prop zeigt X-Icon 12px rechts; Tap entfernt Tag.
- Niemals für Statusinformation — dafür Chip verwenden.

### 3. Delta — Veränderungswerte (KPI, Statistiken)
```
╭──────────────────╮  r-full  pad 3×8
│  ↑ +12,4 %       │  font-mono  11px/600  tnum  gap 3
╰──────────────────╯
```
| Variante | Farbe | Hintergrund | Pfeil |
|---|---|---|---|
| `up` | `success` | `success` 12%-Tint | `↑` (TrendingUp 10px) |
| `down` | `danger` | `danger` 12%-Tint | `↓` (TrendingDown 10px) |
| `flat` | `text-3` | `bg-subtle` | `—` (Minus 10px) |

- Zahlen in deutschem Format: Komma als Dezimaltrennzeichen, Tausenderpunkt (z. B. „1.240,5 %").
- `font-mono` + `font-feature-settings: "tnum"` Pflicht — S3, kein Cabinet Grotesk.
- Einheit (`%`, `€`, `h`) in `font-ui` `text-3`, ~45% der Wertgröße, aber in Delta immer gleich 11px
  da Delta selbst klein ist (Einheit unverändert, nur Schriftfamilie wechselt).

### 4. Count — Navigations-Zähler (ungelesen, ausstehend)
```
Nav-Item                              [4]
                                      mono 11px  text-3  kein bg  kein border
```
- Lebt `margin-left: auto` im Nav-Item-Slot.
- `font-mono` + `tnum`; `color: text-3` (dezent — ruft nicht nach Aufmerksamkeit).
- Ab 10 Einträgen: zeige `„9+"` (kein dreistelliges Flackern).
- Kein Badge-Pill-Rahmen — reiner Zahl-Text (Sidebar-Kontext hat eigene Einrahmung durch Nav-Item).
- Rot-Dot-Variante (`unseen`): 7px `danger`-Dot statt Zahl (z. B. Benachrichtigungen ohne genaue Zahl).

## Varianten & Größen
| Familie | Größe (fix) | Schrift | Einsatz |
|---|---|---|---|
| Chip | pad 3×10, auto-h | 11px/500 | Status, Sync, Priorität |
| Tag | pad 2×9, auto-h | 11px/500 | Kategorie, Filter |
| Delta | pad 3×8, auto-h | 11px/600 mono | KPI, Stats |
| Count | inline | 11px/400 mono | Nav-Sidebar |

Keine expliziten Größenvarianten — die Familien haben fixe Maße, da sie immer kontextgebunden auftreten.

## States
| State | Chip | Tag | Delta | Count |
|---|---|---|---|---|
| default | wie Anatomie | wie Anatomie | wie Anatomie | text-3 |
| hover (klickbar) | `bg-hover` 150ms | `bg-hover` 150ms | — | — |
| pressed (klickbar) | `scale(.96)` | `scale(.96)` | — | — |
| live update | — | — | Zahl zählt via tnum (kein Layout-Shift) | Zahl zählt |
| loading | Statt Inhalt: 30px Skeleton-Shimmer | — | — | — |

Chips und Tags sind nur klickbar wenn `onPress`-Prop gesetzt; sonst `cursor: default`.

## Mikro-Interaktion
- Counter-Wechsel (Count, Delta-Zahl, Streak in HabitCard): Ziffer ändert sich direkt ohne Animation
  der Zahl selbst — `tnum` sorgt dafür, dass kein Layout-Shift entsteht. Für XP-Count-Up
  (XP-Toast) gilt `requestAnimationFrame`-Loop, aber das ist Toast-Logik, nicht Badge-Logik.
- Chip-Dot-Pulse (Sync-Status): `opacity 1 → .5 → 1` Loop 2,6s ease-in-out — Atemrhythmus
  signalisiert „lebendig", kein aggressives Blinken. Kein Regelkonflikt: §3b („Puls-Loops ≥ 4s")
  nimmt den Sync-Dot ausdrücklich aus — er ist der einzige erlaubte schnellere Puls der App.
- Streak-Badge (risk): `color: warning`, `bg: warning 11%-Tint` — Farbwechsel 200ms springOut;
  Farbe = Handlungsaufforderung, nicht Dekoration (S2).
- Remove-X auf Tag: 150ms springy scale(.8 → 1) beim Einblenden; Tap → Tag faded 150ms aus,
  Nachbar-Tags schliessen Gap (kein Layout-Jump: `width`-Transition ist verboten, stattdessen
  Container reflows still).

## Verhalten & Edge Cases
- Chip `accent`-Variante ist immer akzentfarbig unabhängig vom semantischen Kontext — prüfen ob
  Informationsgehalt vorhanden; sonst Tag oder plain Text verwenden.
- Delta `down` zeigt Gefälle als Information, nicht Alarm (kein `danger`-Glow, nur die Tint-Fläche).
  Rot ist nur visuell gleichwertig danger — semantisch heisst es „Wert gefallen", nicht „Fehler".
- Count `9+`-Schwelle: ab dem Moment wo `count > 9` wechselt der Text; niemals `10`, `11` etc.
- Streak-Badge ist kein `Badge`-Komponent im engeren Sinne — er ist Teil von `HabitCard` und nutzt
  die Chip-Tokens direkt; `Badge`-Komponente exportiert die Token-Klassen für diesen Einsatz.
- Kein Konfetti, kein Pulse bei Streak-Milestone direkt im Badge (HabitCard-Logik, nicht Badge).

## Plattform
- **Web:** `<span>` für non-interactive; `<button>` wenn `onPress` gesetzt. `currentColor` für Icons.
- **Native:** `View` + `Text`; `Pressable` wenn klickbar; `accessibilityRole="button"` dann Pflicht
  + `accessibilityLabel` (vollständiger Text, z. B. „Status: Online" statt nur Dot).
- Sync-Dot-Animation: Web via CSS `@keyframes`; Native via Reanimated `withRepeat(withTiming(...))`.

## Props (Vertrag)
```ts
export type ChipProps = {
  label?: string;
  dot?: 'success'|'warning'|'danger'|'onhold'|'accent'|'info';
  variant?: 'default'|'accent';
  onPress?: () => void;
  'aria-label'?: string;            // Pflicht bei dot-only
};

export type TagProps = {
  label: string;
  onRemove?: () => void;
  onPress?: () => void;
};

export type DeltaProps = {
  value: number;                    // z. B. 12.4
  unit?: string;                    // z. B. '%' oder '€'
  direction?: 'up'|'down'|'flat';  // default: aus value abgeleitet (>0 up, <0 down, =0 flat)
  format?: 'percent'|'absolute';   // default 'percent'
};

export type CountProps = {
  count: number;
  max?: number;                     // default 9; über max wird '+' angehängt
  variant?: 'number'|'unseen-dot'; // default 'number'
};
```

## Abnahme-Checkliste
- [ ] 4 Familien visuell klar unterscheidbar; Chip mit Dot, Tag mit Remove, Delta up/down/flat, Count 9+
- [ ] Delta-Zahlen: `font-mono` + `tnum`, deutsches Format (Komma, Tausenderpunkt)
- [ ] Chip-Dot-Pulse 2,6s; Streak-Badge Farbe only bei risk (S2)
- [ ] Count: zeigt `9+` ab count > 9; kein dreistelliges Flackern
- [ ] Klickbare Badges: `cursor: pointer`, hover, pressed, korrekte ARIA-Rolle
- [ ] Dot-only Chip: `aria-label` Pflicht; Farbe nie alleinige Information (Icon + label als Fallback)
- [ ] 2 Themes × 5 Akzente im Demo-Screen; alle Familien × Varianten abgedeckt
