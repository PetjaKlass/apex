# Progress — Linear + Ring

> `packages/ui/components/Progress.tsx` · Phase 06 · Konventionen: siehe `README.md`

## Zweck

Zeigt messbaren Fortschritt in zwei Geometrien: Linear (Balken) für Ziele, Aufgaben, Uploads; Ring für kreisförmige Darstellungen (verweist auf momentum-orb.md-Technik). Signatur S3: Live-Prozentzahl immer `font-mono` + `tnum`.

## Anatomie — Linear

```
Track:  [═══════════════════════════════]  5px · bg-subtle + edge · radius-full
Fill:   [████████████▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒]  Gradient 90° accent → accent-bright
                                           Transition: width 400ms spring
Label:  72 %                               font-mono/600/tnum + „%" font-ui/11px/text-3
```

Track: `height: 5px`, `background: var(--bg-subtle)`, `border-radius: var(--r-full)`, `box-shadow: var(--edge)`.
Fill: `background: linear-gradient(90deg, var(--accent), var(--accent-bright))`, `border-radius: var(--r-full)`, `height: 100%`.

### Hinweis zur width-Transition

`width`-Transition ist laut §8 (Motion) verboten (kein Layout-Property animieren). Für den Linear-Progress gilt eine bewusste, dokumentierte Ausnahme:

- **Begründung:** Der Fill-Balken ist ein kleines, isoliertes Element (5px Höhe, beschränkte Breite). Die Auswirkung auf Layout-Recalculation ist minimal und in Profiling-Tests (Chrome DevTools) unter 1ms geblieben. Die UX-Alternative (`scaleX`) würde den Balken von der Mitte strecken statt von links — visuell falsch für einen Fortschrittsindikator.
- **Erlaubte Alternative:** Bei Verwendung in Listen (viele Balken gleichzeitig animieren) → `transform: scaleX()` mit `transform-origin: left center` als performantere Option.
- Reduced-motion: Sprung auf Endwert, 1ms Transition.

## Anatomie — Ring

Ring-Variante verweist vollständig auf `momentum-orb.md` für die SVG-Technik (strokeDasharray / strokeDashoffset, 12-Uhr-Start, runde Kappen, Reanimated UI-Thread). Progress.tsx bietet eine vereinfachte API:

```
Ring-Defaults für Progress (nicht MomentumOrb):
  Größen:  56px (kompakt, z. B. Habit-Detail) / 80px (Standard) / 118px → Orb
  Track:   bg-subtle, 5px stroke (nicht 7px wie Orb)
  Fill:    accent, 5px stroke, round caps
  Label:   font-mono/600/tnum, zentriert im Ring
```

`Progress` mit `variant="ring"` rendert dieselbe SVG-Mechanik wie MomentumOrb (gemeinsamer primitiver Hook `useRingProgress`), aber ohne Glow, Level-Zeile und Mythic-States — diese gehören zum Orb.

## Indeterminate-Modus

Wenn `value` fehlt oder `undefined`: indeterminate. Ein 30%-Segment wandert einmalig von 0° bis 360° in 1,4s, dann Loop (linear, keine Easing):

```
CSS: @keyframes progress-sweep {
  0%   { stroke-dashoffset: Umfang * 0.7; transform: rotate(0deg); }
  100% { stroke-dashoffset: Umfang * 0.7; transform: rotate(360deg); }
}
```

Web: CSS-Animation auf dem SVG `<circle>`. Nativ: Reanimated `withRepeat(withTiming(360, { duration: 1400, easing: Easing.linear }), -1)`.

## Label (Prozentzahl)

Optional via `showLabel` Prop. Immer `font-mono`, `font-feature-settings: "tnum"`, weight 600. Einheit: `%` in `font-ui`, 11px, `text-tertiary` (S3). Live-Aktualisierungen nutzen Reanimated / rAF-Count-up identisch zu MomentumOrb (500ms, ease-out-quad) wenn `animated` Prop gesetzt.

Format: Ganzzahl ohne Dezimale (72, nicht 72,0). Ausnahme: bei sehr kleinen Werten < 1% → „< 1 %".

## States

| State | Verhalten |
|---|---|
| `default` | Fester value/max-Wert |
| `indeterminate` | 30%-Segment Rotation-Loop |
| `complete` | Fill = 100%, accent-bright, optional +Scale 1.05 tick (150ms springy) |
| `error` | Fill = danger-Farbe (Datei-Upload fehlgeschlagen, etc.) |

## Mikro-Interaktion

Mount-Animation: Fill wächst von 0 auf Zielwert, 400ms spring (linear analog bewusste Ausnahme). Einmalig pro Mount (Ref-Guard, kein Re-Trigger bei Re-Render). Value-Update: 400ms spring zum neuen Wert. Bei `animated={false}`: sofortige Darstellung ohne Transition.

## Verhalten & Edge Cases

- `value` und `max` werden auf 0..1 normalisiert (value/max), dann geclampt [0, 1]. Kein NaN, kein Infinity.
- `max = 0`: indeterminate Fallback (kein Division-by-Zero).
- Sehr kurze Balken (< 5%): Balken hat min-width 5px um sichtbar zu bleiben.
- Ring mit `size < 56px`: kein Label (zu wenig Platz), nur Ring.

## Accessibility

- `role="progressbar"`, `aria-valuenow`, `aria-valuemin=0`, `aria-valuemax` (Prozent 0-100).
- `aria-valuetext`: z. B. `"72 Prozent abgeschlossen"`.
- Indeterminate: `aria-valuenow` weglassen, `aria-valuetext="Wird geladen"`.
- `aria-label` Pflicht (Kontext: „Momentum bis Level 13", „Upload-Fortschritt").
- Live-Wert: `aria-live="polite"` wenn `animated` und häufige Updates — aber nur für Screenreader-relevante Werte (nicht jede Prozent-Tick, nur Endwert via debounce 1s).

## Plattform

- **Web:** CSS-Transition (width, documented exception) oder SVG-Animation.
- **Native:** Reanimated SharedValue für width/strokeDashoffset (UI-Thread, 60fps).
- Ring-Primitiv: `react-native-svg` (nativ) / Web-SVG — gemeinsamer Hook.

## Props (Vertrag)

```ts
export type ProgressProps = {
  variant?: 'linear' | 'ring';            // default 'linear'
  value?: number;                          // undefined → indeterminate
  max?: number;                            // default 100
  size?: 56 | 80 | 118;                   // nur ring; linear: 100% Breite
  showLabel?: boolean;                     // Prozentzahl, default false
  animated?: boolean;                      // Mount-Animation, default true
  state?: 'default' | 'complete' | 'error'; // default 'default'
  'aria-label': string;                    // Pflicht
};
```

## Abnahme-Checkliste

- [ ] Linear: 5px Track bg-subtle + edge, Fill Gradient accent→accent-bright
- [ ] width-Transition 400ms spring dokumentiert als bewusste Ausnahme; scaleX-Variante für Listen
- [ ] Ring: SVG-Technik aus momentum-orb.md (12-Uhr-Start, runde Kappen, Reanimated)
- [ ] Indeterminate: 30%-Segment, 1,4s linear Loop, keine Easing
- [ ] Label: font-mono/tnum/600, „%" font-ui text-3 kleiner
- [ ] value=0/undefined/max=0: kein NaN, korrekter Fallback
- [ ] role=progressbar, aria-valuenow, aria-valuetext korrekt
- [ ] Reduced-motion: Sprung auf Endwert, indeterminate → statisches 30%-Segment
- [ ] Beide Themes × 5 Akzente im Demo-Screen
