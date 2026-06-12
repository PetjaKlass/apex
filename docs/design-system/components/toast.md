# Toast — 5 Typen inkl. XP

> `packages/ui/components/Toast.tsx` · Phase 06 · Konventionen: siehe `README.md`

## Zweck

Kurzzeitige, nicht-blockierende Rückmeldung nach Nutzeraktionen oder System-Ereignissen. Interruption mit Disziplin: sparsam einsetzen, immer mit Auto-Dismiss, nie für Fehler die den Nutzer zum Handeln zwingen (dafür: Modal).

## Anatomie

```
╭──────────────────────────────────────────╮  min-width 250px · radius 20 · z-toast 500
│ [Icon 18]  Nachricht          [✕ 28×28] │  panelStrong + blur 24 + saturate 1.4
│            [Subline 11px text-3]         │  border: 1px panel-border · shadow-pop + edge
╰──────────────────────────────────────────╯  padding: 12px 16px · gap 12px

XP-Variante:
╭──────────────────────────────────────────╮  accent-border statt panel-border
│ [Zap 18 accent]  +25 XP    mono/600     │  Zahl: font-mono/600/tnum, zählt 0→25 in 500ms
│                  Aufgabe abgeschlossen   │  Subline: 11px/text-3
╰──────────────────────────────────────────╯
```

## Typen

| Typ | Icon (Lucide) | Icon-Farbe | Border-Akzent | Auto-Dismiss |
|---|---|---|---|---|
| `success` | `CheckCircle2` | success | success-dim fill + success border | 3s |
| `error` | `AlertCircle` | danger | danger-dim fill + danger border | 5s |
| `warning` | `AlertTriangle` | warning | warning-dim fill + warning border | 4s |
| `info` | `Info` | info | info-dim fill + info border | 3s |
| `xp` | `Zap` | accent | accent-dim fill + accent-border | 3s |

Hintergrund aller Typen: `var(--panel-strong)` (panelStrong). Die farbige Information liegt im Icon + Border, nicht in der Gesamtfläche. Ausnahme XP: zusätzlich `background: color-mix(in srgb, var(--accent) 8%, var(--panel-strong))`.

## Position & Stack

- **Web:** `position: fixed; top: calc(20px + env(safe-area-inset-top, 0px)); right: 20px;`
- **Mobil (nativ):** top-center + safe-area-top. `left: 16px; right: 16px; align-items: stretch;`
- Stack: max. 5 Toasts gleichzeitig sichtbar. Neueste erscheint oben, Ältere rutschen 8px nach unten (translateY, 150ms springOut). Beim Einrücken ersetzt der älteste Toast seinen Platz.
- X-Button (28×28, hitSlop 44) schließt manuell. `aria-label="Toast schließen"`.

## Choreografie (§15)

Prioritätsreihenfolge bei gleichzeitiger Warteschlange:

1. `error` — erscheint sofort (assertive)
2. `warning` — erscheint sofort
3. `xp` — 200ms Stagger wenn mehrere XP-Toasts gleichzeitig (nie gleichzeitig)
4. `info` / `success` — FIFO

Eintritt: `translateY(-8px) + opacity 0 → translate(0) + opacity 1`, 300ms spring.
Austritt: `opacity 1 → 0`, 300ms easeIn (bei Auto-Dismiss oder manuellem Close).

### XP-Toast-Sequenz (§15 Detail)

1. Slide-in 300ms spring
2. Zahl zählt 0 → Wert in 500ms (rAF, ease-out-quad; `font-feature-settings: "tnum"`)
3. Subtiler accent-glow pulse während Count-up (opacity .4 → .7 → .4, 500ms)
4. Hält 2s nach Abschluss des Count-ups
5. Slide-out 300ms easeIn

## Hover-Pause (Web)

Bei Hover über einem Toast stoppt der Auto-Dismiss-Timer. Verbleibende Zeit wird bei Mouse-Leave fortgesetzt (kein Reset). Implementierung: `clearTimeout` bei `mouseenter`, neuer `setTimeout(remaining)` bei `mouseleave`.

## States

`entering · visible · hover-paused · leaving · dismissed`

## Verhalten & Edge Cases

- Wenn > 5 Toasts in Queue: ältester verschwindet sofort (opacity 0, 100ms) bevor neuer erscheint.
- Error-Toasts: Default Auto-Dismiss 5s (Tabelle, = §15). Für Fehler, die eine Nutzeraktion ERFORDERN (z.B. „Zahlung fehlgeschlagen"), setzt der Aufrufer `persistent: true` → kein Auto-Dismiss, nur manuelles Schließen. Faustregel: Ist nach dem Verschwinden etwas kaputt? Dann persistent — oder gleich Modal statt Toast.
- Kein Toast während Focus-Mode (§16): Toast-Queue wird gepuffert, erscheint nach Session-Ende.
- Toast-Provider: globaler Singleton via Context. Aufruf: `useToast().show({ type, message, sub })`.

## Accessibility

- `role="status"` + `aria-live="polite"` für success/warning/info/xp.
- `role="alert"` + `aria-live="assertive"` für error.
- Toast-Container via `aria-atomic="true"` — Screenreader liest kompletten Toast.
- X-Button: `aria-label="Benachrichtigung schließen"`, fokussierbar, Enter/Space schließt.
- Kein Toast kürzer als 3s (WCAG 2.2 Timing Adjustable — Nutzer muss Text lesen können).

## Plattform

- **Web:** CSS-Transition, rAF für XP-Count-up.
- **Native:** Reanimated für Slide-Animationen. XP-Count-up: Reanimated `withTiming` + `useAnimatedProps` auf einer AnimatedText-Komponente (UI-Thread, kein rAF).
- Haptik bei Eintritt: success/xp → `notificationAsync(Success)`, error → `notificationAsync(Error)`, warning/info → keine.

## Props (Vertrag)

```ts
export type ToastOptions = {
  type: 'success' | 'error' | 'warning' | 'info' | 'xp';
  message: string;
  sub?: string;         // Subline (XP: Aufgabentitel)
  xpValue?: number;     // nur bei type='xp', löst Count-up aus
  persistent?: boolean; // error bleibt nach 5s bestehen
  id?: string;          // für programmatisches Dismiss
};

// Aufruf via Hook
const { show, dismiss } = useToast();
show(options: ToastOptions): string  // gibt id zurück
dismiss(id: string): void
```

## Abnahme-Checkliste

- [ ] 5 Typen × beide Themes × 5 Akzente im Demo-Screen
- [ ] XP: Count-up 500ms, tnum, kein Breiten-Sprung; glow pulse während Count-up
- [ ] Stack: max 5, neue oben, Ältere rutschen 8px, Overflow entfernt ältesten
- [ ] Hover-Pause korrekt: Timer-Rest wird fortgesetzt, kein Reset
- [ ] Priorität: error/warning sofort, XP 200ms Stagger, info/success FIFO
- [ ] aria-live polite (alle außer error) / assertive (error)
- [ ] Kein Toast in Focus-Mode; Queue gepuffert
- [ ] Haptik korrekt pro Typ (nativ)
- [ ] Reduced-motion: opacity-only, kein Slide; Count-up springt sofort auf Endwert
