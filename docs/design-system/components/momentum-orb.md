# MomentumOrb — Ring + Live-Zahl

> `apps/product/components/dashboard/MomentumOrb.tsx` · Phase 12 (statisch) / 17 (Engine) · Konventionen: `README.md`

## Zweck
Macht den abstrakten Momentum-Wert körperlich: ein ruhiger Ring, der sich füllt, und eine Zahl, die zählt. Signatur S3 in Reinform — der Ring gehört zur Goldenen-Faden-Familie (S1).

## Anatomie
```
   ◜◝    Ring 118px (Dashboard) / 84px (kompakt)
  ( 72% )  Track: bg-subtle, 7px · Fill: accent, 7px, round caps, Start 12 Uhr
   ◟◞    Zahl: mono/600, 27px (+ unit 13px) — Level-Variante
hinter dem Ring: radialer accent-glow (inset −14px, ≤8% Alpha)
daneben: Level-Zeile (display 17/700) + Progress-Bar + „2.840 / 3.200 XP" (mono, text-3)
```
Zwei Anzeige-Modi (gleiche Komponente):
- `mode="level"`: Ring = Fortschritt zum nächsten Level (0–100 %), Zahl = Prozent.
- `mode="momentum"`: Ring = Momentum relativ zur persönlichen 30-Tage-Spitze, Zahl = absoluter Wert (847). Stat-Card-Kontext.

## Verhalten
- **Mount:** Fill animiert von 0 auf Zielwert, 1s spring, einmalig pro Screen-Besuch (nicht bei jedem Re-Render — Ref-Guard).
- **Live-Update** (XP-Ereignis): Zahl zählt in 500ms hoch (rAF, ease-out-quad), `tnum` verhindert Springen; Ring gleitet zum neuen Offset (1s spring); einmaliger `scale 1.06`-Tick der Zahl (200ms springy). Mehrere Events in <1s werden gebündelt (ein Count zum Endwert).
- **Momentum-Decay** (negativ, täglicher Server-Job): KEINE Live-Animation — neuer Wert erscheint beim nächsten App-Start einfach. Verluste werden nicht inszeniert (Voice & Tone: direkt, nie strafend).
- **Mythic** (>2000, Stage 3): Glow-Alpha 8%→14% + sehr langsames Atmen (7s). Kein Partikel-Standard; Partikel sind Phase-30-Showcase, default off.

## Werte-Logik (Phase 17 Engine, hier nur Anzeige-Vertrag)
- Komponente rechnet NICHT — sie bekommt `value`, `max`, `level`, `xpInLevel`, `xpForNext` fertig.
- `max=0`/fehlende Daten → Skeleton-Variante (Ring als statischer Track + Schimmer), nie NaN.

## States
default · loading (Skeleton) · updating (Count-up) · mythic. Kein Hover-State (nicht interaktiv); optionaler `onPress` → Achievements-Seite (dann Pressable + role).

## Plattform
- Ring: SVG (`react-native-svg` / Web-SVG), `strokeDasharray = 2πr`, Offset animiert via Reanimated (`useAnimatedProps`) — UI-Thread, 60fps.
- Count-up: Web rAF; native Reanimated `withTiming` auf SharedValue + `runOnJS`-freies Text-Update (AnimatedText oder `react-native-redash` ReText-Muster).
- Reduced Motion: Ring & Zahl springen instant auf Zielwert.

## Props (Vertrag)
```ts
export type MomentumOrbProps = {
  mode: 'level'|'momentum';
  value: number; max: number;          // Ring-Füllung = value/max (clamped 0..1)
  display: number;                     // die große Zahl (Prozent ODER absolut)
  unit?: '%';                          // S3: Einheit klein
  level?: { n: number; name: string; xpInLevel: number; xpForNext: number };
  size?: 118|84;
  mythic?: boolean;
  onPress?(): void;
};
```

## Abnahme-Checkliste
- [ ] Count-up ruckelfrei, Ziffernbreite stabil (tnum), Bündelung bei Event-Burst
- [ ] Mount-Animation einmalig; Decay ohne Animation
- [ ] Ringstart exakt 12 Uhr, runde Kappen, 5 Akzente sauber (Fill = reines accent)
- [ ] Skeleton bei fehlenden Daten, nie NaN/Infinity
- [ ] Screenreader: „Momentum 847, Level 12 Operator, 72 % bis Level 13" (eine Ansage, `accessibilityLiveRegion="polite"` bei Updates)
