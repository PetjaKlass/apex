# Checkbox — Einzeln und Gruppe, inkl. Indeterminate

> `packages/ui/components/Checkbox.tsx` · Phase 05 · Konventionen: siehe `README.md`

## Zweck
Binäre Ja/Nein-Auswahl und Mehrfachauswahl in Listen. Die Checkbox ist ein **abgerundetes Quadrat**
(radius 6) — der Kreis ist für Task-Complete reserviert (siehe `task-row.md`) und darf hier nicht
verwendet werden. Indeterminate kennzeichnet teilweise ausgewählte Gruppen (z. B. „Alle auswählen"
mit gemischtem Zustand).

## Anatomie
```
[■ 20×20 r6]  Label 13px/500 text-1          ← klickbarer Bereich: gesamte Zeile
               Sublabel 11px text-3 (opt.)
```
- Box: 20×20px, `border-radius: 6px`, `border: 1.5px solid border-strong` im Ruhezustand.
- Check: weißes Häkchen (`text-inverse`) auf `accent`-Fill; SVG-Path, Stroke-Linecap round, 2px.
- Indeterminate: horizontaler 10px-Strich (`—`) in `text-inverse` auf `accent-dim`-Fill,
  Border `accent` — visuell zwischen unchecked und checked.
- Label und Sublabel klickbar (hitArea = gesamte Zeile).
- Touch-Ziel: hitSlop sodass ≥ 44×44 (native); min-height 44 als Zeile auf Web.

## Varianten
| Variante | Beschreibung |
|---|---|
| Einzeln | Standalone-Checkbox mit Label |
| `CheckboxGroup` | Vertikale Liste, `gap 10`, gemeinsames `fieldset`/`legend` (A11y) |
| Indeterminate | `checked` und `indeterminate` gleichzeitig — Strich statt Häkchen |

## States
| State | Box-Darstellung |
|---|---|
| `unchecked` | `bg-subtle`, `border: 1.5px border-strong`, leer |
| `hover` (Web) | `border-color: accent` 150ms springOut |
| `checked` | `bg: accent`-Fill (Verlauf `accent-bright → accent`), Häkchen weiß, Border transparent |
| `indeterminate` | `bg: accent-dim`, Strich weiß, `border: 1.5px accent` |
| `focus-visible` | Outline `2px accent-bright`, `outline-offset: 2px` (instant) |
| `pressed` | `scale(.92)` 100ms linear → zurück 150ms spring |
| `disabled unchecked` | `opacity .4`, `cursor: not-allowed` |
| `disabled checked` | `opacity .4`, Häkchen erkennbar aber gedimmt |
| `error` | `border-color: danger`; Fehlermeldung 11px `danger` unter Gruppe/Einzelfeld |

## Mikro-Interaktion
- Check-Animation: 200ms springy — Box füllt sich `scale 0.8 → 1.05 → 1` gleichzeitig mit
  `opacity 0 → 1` des Häkchens. Entschecken: gleiche Dauer, umgekehrt.
- Indeterminate → checked: Strich verwandelt sich in Häkchen (opacity cross-fade 150ms).
- Haptik (native): `tapLight` bei jedem Zustandswechsel (checked ↔ unchecked ↔ indeterminate).
- Pressed: Box-Scale `.92`, kein Label-Shift (nur Box betroffen).

## Verhalten & Edge Cases
- `CheckboxGroup` „Alle auswählen": checked wenn alle Kind-Items checked; indeterminate wenn einige;
  unchecked wenn keine. Wechsel auf checked selektiert alle; auf unchecked deselektiert alle.
- `disabled` einzelnes Item in Gruppe: Gruppen-Checkbox bleibt bedienbar, disabled Items werden beim
  „Alle"-Toggle übersprungen.
- Label klickbar: der gesamte Zeilenbereich (Label + Sublabel + Box) ist ein einziger Tap-Target.
  Kein separater `<label>`-Click-Handler nötig — HTML `<label>` wrapping reicht.
- Long Label: bricht um (kein Truncate); Box bleibt oben links ausgerichtet (`align-items: flex-start`).

## Plattform
- **Web:** `<input type="checkbox">` visuell versteckt (`sr-only`), darüber eigene `<div>`-Box via
  `::before`/CSS oder direkte SVG; `<label>` umschließt beides. `:focus-visible` auf dem Input.
- **Native:** `Pressable` mit `accessibilityRole="checkbox"`, `accessibilityState={{ checked }}`.
  Für indeterminate: `checked="mixed"` als `accessibilityState`-Wert (iOS VoiceOver kennt „partially checked").
- Kein `scale`-Transform auf Native ohne Reanimated (UI-Thread).

## Props (Vertrag)
```ts
export type CheckboxProps = {
  checked: boolean;
  indeterminate?: boolean;
  onToggle: (next: boolean) => void;
  label: string;
  sublabel?: string;
  disabled?: boolean;
  error?: string;
  'aria-describedby'?: string;
};

export type CheckboxGroupProps = {
  legend: string;             // visuell als Section-Label, immer im DOM
  legendHidden?: boolean;     // true: sr-only (wenn visueller Kontext ausreicht)
  error?: string;
  children: React.ReactNode;  // CheckboxProps[]
};
```

## Abnahme-Checkliste
- [ ] Form: abgerundetes Quadrat r6, kein Kreis
- [ ] Check-Animation 200ms springy, Haptik Light native
- [ ] Indeterminate: 10px-Strich auf `accent-dim`, korrekt von checked unterscheidbar
- [ ] Gesamte Zeile klickbar; hitSlop ≥ 44×44 native
- [ ] „Alle auswählen"-Logik: checked / indeterminate / unchecked korrekt
- [ ] disabled in Gruppe: übersprungen bei Massen-Toggle
- [ ] VoiceOver/TalkBack: Rolle „Checkbox", State „checked/unchecked/partially checked" korrekt
