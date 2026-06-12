# Tooltip — Hover/Fokus-Erläuterung

> `packages/ui/components/Tooltip.tsx` · Phase 06 · Konventionen: siehe `README.md`

## Zweck

Erläutert Icon-only-Aktionen und knappe Labels für Nutzer, die aktiv erkunden (Hover/Keyboard). Tooltips sind kein Ersatz für zugängliche Labels — das `aria-label` des Triggers ist immer primär, der Tooltip ist visuelles Supplement.

## Anatomie

```
              ╭──────────────────────╮  max-width 240px · radius 10
              │ Erläuterungstext     │  bg: overlay-Fläche opak (bg-card Dark, #FFF Light)
              ╰──────────────────────╯  font-ui 12px/text-1 · padding 7px 12px
                      ↑
              [ Trigger-Element ]      Pfeil optional (cleaner ohne Pfeil)
```

Fläche: `var(--card)` (opak, nicht `panel-strong`) — Tooltip liegt auf overlay-Ebene (z-tooltip 600), braucht keinen Blur (würde Budget sprengen). Shadow: `var(--shadow-card)`. Kein `edge` (zu subtil bei 12px-Text-Containern).

Pfeil: optional via `arrow` Prop. 6×4px dreieckig, fill `var(--card)`. Default: kein Pfeil (cleaner in dichten UIs).

## Platzierung

Automatische Positionierung via `@floating-ui/react` (Web) / `@floating-ui/react-native` (nativ). Präferenz-Reihenfolge: `top → bottom → right → left`. Flip wenn viewport-Rand zu nah. Shift wenn partiell außerhalb.

Offset vom Trigger: 8px.

## Timing

- **Erscheinen:** 600ms Hover-Delay, dann 150ms `opacity 0 → 1` (kein Scale, kein Slide).
- **Verschwinden:** 0ms Delay, 100ms `opacity 1 → 0`.
- **Fokus (Keyboard):** kein Delay — erscheint sofort (Tastaturnutzer warten nicht 600ms).
- Wenn Nutzer zwischen verwandten Trigger-Elementen wechselt (< 200ms zwischen Hover-Events): kein erneuter 600ms-Delay — Tooltip folgt sofort (Intent-Continuity).

## Anti-Pattern: NIE auf Touch (§20)

Tooltips existieren ausschließlich für Web-Hover und Keyboard-Fokus. Auf Touch-Geräten gilt:
- Kein Long-Press-Tooltip (erzeugt Verwirrung mit Context-Menus).
- Icon-only-Buttons auf Touch: `accessibilityLabel` trägt die Info, kein Tooltip sichtbar.
- Native-Implementierung: Komponente rendert `null` auf `Platform.OS !== 'web'`.

## States

`hidden · delay (600ms läuft) · visible · fading-out`

Kein disabled-State der Komponente selbst — wenn Trigger disabled ist, erscheint auch kein Tooltip (der Nutzer interagiert nicht mit dem Element).

## Icon-only-Button-Verknüpfung

Wenn ein Icon-only-Button ohne `children` existiert:
1. `aria-label` am Button = die sichtbare Tooltip-Info (immer Pflicht, unabhängig von Tooltip).
2. Tooltip `content` darf identisch mit `aria-label` sein (Screenreader liest es, sehende Nutzer sehen es im Tooltip).
3. Screenreader bekommt die Info via `aria-label`; kein separates `aria-describedby` nötig.

## Verhalten & Edge Cases

- `max-width: 240px` — Text bricht um. Min-Width 40px. Kein Truncate (ganzer Text muss lesbar sein).
- Tooltip für Elemente innerhalb von Modals: z-index > modal-z korrekt prüfen (z-tooltip: 600 > z-modal: 400 — passt).
- Tooltip für Elemente in ScrollViews: bei Scroll sofort schließen (kein „nachfliegender" Tooltip).
- Mehrere Trigger auf einer Seite: nur ein Tooltip gleichzeitig sichtbar. Floating-UI-Singleton-Pattern.
- Inhalt ist immer String (kein JSX) — Tooltips erklären, sie formatieren nicht.

## Accessibility

- `role="tooltip"` auf Tooltip-Fläche.
- `aria-describedby` am Trigger zeigt auf Tooltip-ID — Screenreader kündigt Tooltip-Inhalt nach Label an.
- Tooltip ist NICHT via Tab fokussierbar (passiver Informationsträger).
- `aria-hidden="true"` wenn Tooltip versteckt (verhindert Ghost-Reads).

## Plattform

- **Web:** React + Floating UI. Pointer-Events: none auf Tooltip (kein Einfluss auf Hover-State).
- **Native:** Komponente rendert nur den `children`-Trigger durch, kein Tooltip-Overlay. Docs-Kommentar erklärt warum.

## Props (Vertrag)

```ts
export type TooltipProps = {
  content: string;                                         // Pflicht, nur Text
  placement?: 'top'|'bottom'|'left'|'right'|'auto';       // default 'auto'
  arrow?: boolean;                                         // default false
  delay?: number;                                          // default 600ms
  disabled?: boolean;                                      // kein Tooltip gerendert
  children: React.ReactElement;                            // ein einzelnes Element (Trigger)
};
```

## Abnahme-Checkliste

- [ ] 600ms Delay bei Hover, 0ms Delay bei Keyboard-Fokus
- [ ] Intent-Continuity: schnelles Hover-Wechseln zwischen Triggern löst keinen 600ms-Reset aus
- [ ] Opacity-only Transition (150ms rein / 100ms raus), kein Scale/Slide
- [ ] max-width 240px, Umbruch korrekt, kein Truncate
- [ ] Pfeil optional, Default kein Pfeil
- [ ] aria-describedby korrekt verdrahtet; role=tooltip, aria-hidden wenn versteckt
- [ ] Native: rendert null (kein Overlay auf Touch)
- [ ] Scroll in ScrollView schließt Tooltip sofort
- [ ] Kein Tooltip wenn Trigger disabled
- [ ] z-index 600 — liegt über Modal (400) korrekt
