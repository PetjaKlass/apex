# Toggle — Switch (An/Aus)

> `packages/ui/components/Toggle.tsx` · Phase 05 · Konventionen: siehe `README.md`

## Zweck
Binärer Ein/Aus-Schalter für Einstellungen und Präferenzen, bei denen die Änderung sofort wirkt
(kein Speichern-Button nötig). Unterscheidet sich von Checkbox durch seine physische Schaltmetapher:
Knob gleitet im Track. Einsatz ausschließlich für immediate-effect-Optionen; für Formular-Auswahl ist
Checkbox vorzuziehen.

## Anatomie
```
Track 44×26  r-full                  Knob 20×20  r-full  weiss
┌─────────────────────────┐           ╭────╮
│ ○                       │  aus       │    │  pos: left 3, top 3
└─────────────────────────┘           ╰────╯
bg: bg-pressed

┌─────────────────────────┐           ╭────╮
│                       ● │  an        │    │  translateX 18px
└─────────────────────────┘           ╰────╯
bg: accent-Verlauf (accent-bright → accent)

Label 13px/500 text-1                 ← rechts neben Track, klickbarer Bereich
Sublabel 11px text-3 (opt.)
```
- Track: 44×26px, `border-radius: full`, kein Border.
- Knob: 20×20px, `border-radius: full`, `background: #fff`, `box-shadow: 0 1px 3px rgba(0,0,0,.25)`.
- Knob-Position: aus = `left 3, top 3`; an = `translateX(18px)`.
- Track-Shadow: `edge` (inset Lichtkante).
- Label steht rechts neben dem Track (nicht links), ist Teil des Tap-Targets.

## States
| State | Track | Knob |
|---|---|---|
| `off` | `bg-pressed` | links (x=3) |
| `on` | `linear-gradient(145deg, accent-bright, accent)` | rechts (translateX 18px) |
| `hover` (Web, off) | Track `bg-pressed` heller (brightness 1.06) 150ms | — |
| `hover` (Web, on) | Track `filter: brightness(1.05)` 150ms | — |
| `focus-visible` | `outline: 2px solid accent-bright, offset 2px` (instant) am Track | — |
| `pressed` | Track `scale(.94)` 100ms linear → 150ms spring zurück | Knob mitgeführt |
| `loading` | Track opacity .5, Knob-Spin-Overlay (Lucide Loader2 10px, 720ms) | kein Toggle möglich |
| `disabled` | `opacity .4`, `cursor: not-allowed`, kein Hover/Press | — |

## Mikro-Interaktion
- Knob-Gleiten: 200ms springy (`cubic-bezier(0.34,1.56,0.64,1)`) — minimales Overshoot erzeugt das
  physische „Schnappen". Nicht linear, nicht spring (spring 0.16,1,0.3,1 wäre zu weich).
- Track-Farbe: gleichzeitig mit Knob, 200ms springy.
- Pressed: Track scale .94 auf Press, zurück 150ms spring auf Release. Knob nicht separat skaliert.
- Haptik (native): `impactAsync(Medium)` bei jedem Toggle — das „Click"-Gefühl ist der Kern der
  Schaltmetapher (§9: Toggle switch → Medium).
- Loading-State: kein Layout-Shift; Spinner-Overlay erscheint nach 200ms (kein Flackern bei schnellen Ops).

## Verhalten & Edge Cases
- Gesamte Zeile (Track + Label) ist ein Tap-Target. `<label>`-Wrapping auf Web; hitSlop auf Native.
- hitSlop: Track visuell 44×26, Mindest-Touch-Target 44×44 — hitSlop vertikal je 9px.
- Doppel-Tap-Schutz: `onPress` setzt `loading = true` bis Promise settled; zweiter Tap hat keine Wirkung.
- Label-Länge: bricht um, Track bleibt oben links fixiert (`align-items: flex-start` wenn Sublabel).
- Wenn `onChange` ein Promise zurückgibt, togglet der Track optimistisch sofort und revertiert bei
  Fehler (Toast via `toast.md`); kein Warten auf Server.
- Sublabel (optionale Erklärung): 11px `text-3`, unter dem Hauptlabel, erhöht nur die Texthöhe,
  nicht die Track-Höhe.

## Plattform
- **Web:** `<button role="switch" aria-checked>` (kein `<input type="checkbox">` — Switch ist
  semantisch eigenständig). CSS-Transition für Knob (`transform`) und Track (`background-color`).
  Cursor `pointer`.
- **Native:** `Pressable` mit `accessibilityRole="switch"`, `accessibilityState={{ checked: value }}`.
  Reanimated `useSharedValue` + `withSpring` für UI-Thread-Animation des Knobs.

## Props (Vertrag)
```ts
export type ToggleProps = {
  value: boolean;
  onToggle: (next: boolean) => void | Promise<void>;
  label: string;
  sublabel?: string;
  disabled?: boolean;
  loading?: boolean;
  'aria-describedby'?: string;
};
```

## Abnahme-Checkliste
- [ ] Knob 20×20 weiss mit Schatten; Track 44×26; korrekte Positionen off/on
- [ ] Animation 200ms springy (Overshoot spürbar, kein lineares Gleiten)
- [ ] Haptik Medium native bei jedem Toggle
- [ ] Optimistisches Toggle + Revert bei Promise-Fehler
- [ ] Gesamte Zeile klickbar; hitSlop ≥ 44×44 native
- [ ] Loading-State: Spinner nach 200ms, kein zweiter Toggle möglich
- [ ] VoiceOver/TalkBack: `role="switch"`, State „Ein/Aus" korrekt, Label lesbar
