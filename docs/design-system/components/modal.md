# Modal — Dialog / Sheet / Drawer

> `packages/ui/components/Modal.tsx` · Phase 06 · Konventionen: siehe `README.md`

## Zweck

Pop-Ebene für fokussierte Eingaben, Bestätigungen und Seiteneinstellungen. Liegt über allem anderen (z-modal 400). Erzeugt Tiefe durch panelStrong + blur + saturate — nicht durch Farbe.

## Anatomie

```
╔══════════════════════════════════════════╗  Backdrop: canvas 45% + blur 14px
║  Backdrop (blur 14, canvas 45%)          ║
║  ╭────────────────────────────────────╮  ║  Modal: radius 32 · max 640px · max 84dvh
║  │ [Icon 20]  Titel  display 24/700   │  ║  panelStrong + blur 40 + saturate 1.6
║  │                            [✕ 34] │  ║  shadow-pop + edge
║  │────────────────────────────────────│  ║  padding 32px
║  │ Inhalt-Slot                        │  ║
║  │ (overflow-y auto wenn > max-h)     │  ║
║  │────────────────────────────────────│  ║  Footer: 1px border-top
║  │ [Abbrechen]              [Primär]  │  ║  Buttons: gap 12, Primär rechts
║  ╰────────────────────────────────────╯  ║
╚══════════════════════════════════════════╝
```

Backdrop: `color-mix(in srgb, var(--canvas) 45%, transparent)` + `backdrop-filter: blur(14px) saturate(1.2)`.
Modal-Fläche: `var(--panel-strong)` + `backdrop-filter: blur(40px) saturate(1.6)` + `border: 1px solid var(--panel-border)` + `border-radius: var(--r-2xl)` (32px) + `box-shadow: var(--shadow-pop), var(--edge)`.

## Varianten

| Variante | Verhalten | Spezifika |
|---|---|---|
| `dialog` | Desktop zentriert, max-width 640px, max-height 84dvh | Standard für Bestätigungen, Formulare |
| `sheet` | Mobil: Bottom-Sheet, Desktop: wie dialog | radius 32 oben, 0 unten mobil; Grabber 36×4px, Swipe-down schließt |
| `drawer` | Rechts einschieben, max-width 400px, volle Höhe | Settings-Panel; kein Backdrop-Klick-Close wenn `blocking` |

Grabber (Sheet, mobil): 36×4px, `bg-subtle`, radius-full, zentriert oben, 12px Abstand zur Oberkante.

## Öffnen / Schließen

- **Öffnen:** 250ms spring, `scale(0.96) → scale(1)` + `opacity 0 → 1`. Backdrop fade 250ms springOut.
- **Schließen:** 200ms springOut, `scale(1) → scale(0.96)` + `opacity 1 → 0`.
- **Sheet (Mobil):** translateY(100%) → translateY(0), 350ms spring. Schließen translateY(100%), 200ms springOut.
- **Drawer:** translateX(100%) → translateX(0), 350ms spring.

## Fokus-Management

- Fokus-Trap: beim Öffnen springt Fokus auf erstes focusables Element (oder `autoFocus`-Element).
- Tab/Shift+Tab zirkulieren nur innerhalb des Modals.
- Schließen: Fokus kehrt zum auslösenden Element zurück (Ref merken vor Open).
- `aria-modal="true"` auf Modal-Wurzel. `role="dialog"` (Bestätigung) oder `role="alertdialog"` (destruktiv).
- ESC schließt (außer `blocking`). Backdrop-Klick schließt (außer `blocking`).

Anti-Pattern: KEINE Modal-Stacks (§20). Wenn tieferer Inhalt nötig ist, wechselt der Inhalt im selben Modal (State-Swap mit 150ms crossfade opacity).

## States

`closed · opening · open · closing · blocking`

`blocking`: kein ESC, kein Backdrop-Klick, kein X-Button — nur explizite Formular-Aktionen. Einsatz: destruktive Bestätigungen mit Texteingabe, erzwungene Onboarding-Schritte.

## Mikro-Interaktion

Inhaltswechsel innerhalb des Modals (kein Stack): alter Inhalt opacity → 0 (100ms), neuer Inhalt opacity → 1 (150ms, 50ms Überlappung). Kein Scale beim Inhaltswechsel — nur der initiale Open-Effekt hat Scale.

## Verhalten & Edge Cases

- Scrollbarer Inhalt: overflow-y auto auf Inhalt-Slot; Header + Footer bleiben sticky.
- Breite auf Mobilgeräten: `width: 100vw`, Sheet klebt an Unterkante, Grabber immer sichtbar.
- Geschachtelter Fokus: `inert`-Attribut auf alles außerhalb des Modals (Web). Native: AccessibilityViewIsModal.
- Reducer-Motion: Öffnen/Schließen opacity-only, 1ms Dauer.
- Drawer-Variante schließt auf Escape, aber nicht auf Backdrop-Klick (Settings-Kontext: beabsichtigte Persistenz).

## Plattform

- **Web:** portiert in `document.body` via React Portal. `<dialog>`-Element erwägen (native Accessibility-Vorteile).
- **Native:** `react-native-reanimated` BottomSheet für Sheet-Variante (Swipe-Gesture, Velocity-basiertes Dismiss). Dialog/Drawer via `Modal` (RN-Core) + Animated-Container.
- Haptik: kein Haptic beim Öffnen; beim Schließen via Swipe-Gesture: Medium bei Dismiss-Punkt.

## Props (Vertrag)

```ts
export type ModalProps = {
  variant?: 'dialog' | 'sheet' | 'drawer';  // default 'dialog'
  open: boolean;
  onClose: () => void;
  title: string;
  icon?: IconComponent;
  blocking?: boolean;
  footer?: React.ReactNode;
  'aria-describedby'?: string;
  children: React.ReactNode;
};
```

## Abnahme-Checkliste

- [ ] Öffnen 250ms spring (scale .96→1 + opacity); Schließen 200ms springOut
- [ ] Backdrop: canvas 45% + blur 14; Modal: panelStrong + blur 40 + saturate 1.6
- [ ] Fokus-Trap funktioniert; ESC schließt; Fokus-Restore auf auslösendes Element
- [ ] `blocking`: ESC, Backdrop, X alle deaktiviert — nur Formular-Aktion schließt
- [ ] Kein Modal-Stack: zweites Modal ersetzt Inhalt im selben Container
- [ ] Sheet-Swipe-down (nativ): Dismiss ab 40% Höhe oder hoher Velocity
- [ ] Grabber 36×4px zentriert oben im Sheet (mobil)
- [ ] Drawer: translateX, 350ms spring, kein Backdrop-Close
- [ ] aria-modal, role=dialog, inert auf Restseite (Web)
- [ ] Reduced-motion: opacity-only, 1ms
