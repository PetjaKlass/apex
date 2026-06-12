# Skeleton — Shimmer-Lade-Skelette

> `packages/ui/components/Skeleton.tsx` · Phase 06 · Konventionen: siehe `README.md`

## Zweck

Struktureller Platzhalter, der die Form des eingehenden Inhalts spiegelt. Verhindert Layout-Shift beim Laden, gibt dem Nutzer sofortige Rückmeldung über die Seitenstruktur. Skeleton erscheint immer sofort (0ms Delay), nicht erst nach einer Wartezeit.

## Bausteine (Sub-Komponenten)

```
Skeleton.Container   — Wrapper mit Layout-Flexbox/Row
Skeleton.Avatar      — Kreis, Größen wie Avatar-Spec
Skeleton.Text        — Textzeile, konfigurierbare Breite + Zeilenanzahl
Skeleton.Card        — Rechteck mit radius-lg (20px), volle Höhe konfigurierbar
Skeleton.Stack       — vertikaler Stack mit gap-2 (8px), für Textzeilen-Gruppen
```

Alle Bausteine: `background: var(--bg-subtle)`, `border-radius` passend zum Ziel-Element, Shimmer via `::after`.

## Anatomie & Maße

```
Skeleton.Avatar:  Kreis · Größen: 24/28/32/40/64px (wie Avatar-Spec)
Skeleton.Text:    Höhe 13px (=text-sm) · border-radius 6px · Breite via prop
Skeleton.Card:    Höhe via prop oder 100% · border-radius 20px (radius-lg)
Skeleton.Container: display flex · gap konfigurierbar (default 12px)
Skeleton.Stack:   display flex, flex-direction column · gap 8px
```

Textzeilen-Defaults:

| lines | Breiten (heuristisch) |
|---|---|
| 1 | 60% |
| 2 | 100%, 45% |
| 3 | 100%, 80%, 35% |

Letzte Zeile immer kürzer — spiegelt natürlich auslaufenden Text.

## Shimmer-Animation

```css
/* EINE @keyframes-Definition pro Seite, nicht pro Skeleton-Element */
@keyframes apex-shimmer {
  0%   { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
}

.skeleton-base {
  position: relative;
  overflow: hidden;
  background: var(--bg-subtle);
}

.skeleton-base::after {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(
    90deg,
    transparent 0%,
    rgba(255, 255, 255, 0.06) 50%,
    transparent 100%
  );
  animation: apex-shimmer 1.5s infinite linear;
  /* CSS-Custom-Property-Sync: alle Skeletons einer Seite teilen dieselbe
     Animation-Instanz via animation-delay: calc(var(--shimmer-offset, 0s))
     — verhindert mehrere GPU-Animationen */
}
```

Dark-Mode: Shimmer-Highlight `rgba(255,255,255,0.06)`. Light-Mode: `rgba(255,255,255,0.70)` (starkes Weiß auf Greige `bg-subtle`).

**Wichtig: EINE Animation pro Seite.** Nicht jedes Skeleton-Element startet eine eigene CSS-Animation. Implementierung: globale CSS-Animation + alle Elemente nutzen dieselbe `animation-name`. Alternativ: CSS-Variable `--shimmer-delay` synchronisiert die Phase.

### Nativ (Reanimated)

```ts
// Shared SharedValue für alle Skeletons einer Seite
const shimmerProgress = useSharedValue(0);

useEffect(() => {
  shimmerProgress.value = withRepeat(
    withTiming(1, { duration: 1500, easing: Easing.linear }),
    -1, false
  );
  return () => cancelAnimation(shimmerProgress);
}, []);

// Jedes Skeleton-Element interpoliert dieselbe SharedValue
const animatedStyle = useAnimatedStyle(() => ({
  transform: [{ translateX: interpolate(shimmerProgress.value, [0,1], [-width, width]) }]
}));
```

Shimmer-Provider-Kontext liefert `shimmerProgress` an alle Skeleton-Kinder — ein Loop, viele Konsumenten.

## Timing

- Erscheint **sofort** beim Rendern (0ms Delay, §14).
- **Minimum 300ms sichtbar** — auch wenn Daten sofort kommen (kein Blitz). Implementierung: `showSkeleton = loading || Date.now() - mountTime < 300`.
- Überblendung zu echtem Inhalt: `opacity 0→1` des Inhalts, 150ms springOut. Skeleton faded gleichzeitig aus.

## Zielstruktur-Spiegelung

Skeletons müssen die exakte DOM/View-Struktur des Ziel-Inhalts spiegeln:

| Komponente | Skeleton-Höhe | Struktur |
|---|---|---|
| TaskRow | 64px | Avatar 32 + Stack [Text 100%, Text 45%] + Badge-Chip |
| HabitCard | 96px | Icon 38 + Stack [Text 60%, Text 40%] + WeekDots-Row |
| MomentumOrb | 118px Kreis + 64px Level-Zeile | Ring-Placeholder + 2× Text-Stack |
| VisionCard | 16:9 Rechteck + 5px Conviction-Bar | Bild-Placeholder + Bar |

Explizit benannte Exporte: `TaskRowSkeleton`, `HabitCardSkeleton`, `VisionCardSkeleton` als vorkomponierte Kombinationen.

## Reduced Motion

```css
@media (prefers-reduced-motion: reduce) {
  .skeleton-base::after { animation: none; }
}
```

Nativ: `AccessibilityInfo.isReduceMotionEnabled()` → kein `withRepeat`, Shimmer-Layer ausgeblendet. Skeleton bleibt sichtbar als statische bg-subtle-Fläche — keine Bewegung.

## Verhalten & Edge Cases

- Skeleton darf nie angezeigt werden wenn Daten schon da sind (kein Flicker nach Hydration).
- Fehler-State nach Lade-Timeout: Skeleton → Error-Empty-State (§13), nie dauerhaftes Skeleton.
- Skeleton in Modal: nutzt dieselbe Shimmer-Instanz der Seite (Provider-Kontext propagiert durch Portals auf Web).
- Skeleton-Nesting verboten: keine Skeleton.Card innerhalb einer Skeleton.Card.

## Accessibility

- `aria-busy="true"` auf dem Skeleton-Container.
- `aria-label="Wird geladen"` auf Skeleton-Container.
- Screenreader: Skeleton-Elemente selbst haben `aria-hidden="true"` — der Container kündigt den Zustand an.
- Beim Übergang zu echtem Inhalt: `aria-busy` entfernen, Inhalt liest sich natürlich.

## Plattform

- **Web:** CSS `::after` Pseudo-Element, eine @keyframes global in App-CSS.
- **Native:** Reanimated SharedValue via ShimmerProvider-Kontext.
- Gemeinsame API: Props sind identisch, Renderer unterschiedlich.

## Props (Vertrag)

```ts
// Basis-Baustein (intern genutzt)
type SkeletonBaseProps = {
  width?: number | string;     // default '100%'
  height?: number;             // default aus Kontext
  radius?: number;             // default passend zu Ziel
};

// Öffentliche Sub-Komponenten
Skeleton.Container: { gap?: number; direction?: 'row'|'column'; children: ReactNode }
Skeleton.Avatar:    { size?: 'xs'|'sm'|'md'|'lg'|'xl' }   // default 'md'
Skeleton.Text:      { lines?: 1|2|3; width?: string }       // default lines=1, width='60%'
Skeleton.Card:      { height?: number; aspectRatio?: number }
Skeleton.Stack:     { gap?: number; children: ReactNode }   // default gap=8
```

## Abnahme-Checkliste

- [ ] EINE CSS-Animation / EINE Reanimated-SharedValue pro Seite — kein Animations-Spam
- [ ] Erscheint sofort (0ms); bleibt min. 300ms sichtbar
- [ ] Überblendung zu Inhalt: opacity 150ms springOut
- [ ] TaskRowSkeleton spiegelt exakt 64px TaskRow-Struktur
- [ ] Reduced-motion: statische bg-subtle-Fläche, kein Sweep
- [ ] aria-busy=true + aria-label=„Wird geladen" auf Container
- [ ] Shimmer-Highlight korrekt: Light (#FFF 70%) vs Dark (#FFF 6%)
- [ ] Kein Skeleton wenn Daten bereits vorhanden (kein Hydration-Flicker)
- [ ] Fehler-Timeout: Skeleton → Empty State, kein dauerhaftes Skeleton
- [ ] ShimmerProvider-Kontext propagiert korrekt durch React Portals (Web)
