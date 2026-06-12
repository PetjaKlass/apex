# Radio — RadioGroup, Einzelauswahl

> `packages/ui/components/Radio.tsx` · Phase 05 · Konventionen: siehe `README.md`

## Zweck
Einzelauswahl aus einer Menge gegenseitig ausschliessender Optionen. Immer als `RadioGroup` verwendet —
ein einzelner Radio-Button ohne Gruppe hat keine semantische Bedeutung. Der Kreis unterscheidet Radio
bewusst vom Quadrat der Checkbox und vom Track des Toggles; diese drei Formen sind die einzigen
Auswahlformen in Apex (kein Vermischen).

## Anatomie
```
[Gruppe-Label / legend  11px/600 text-2  sr-only wenn visueller Kontext klar]

○  Label 13px/500 text-1          ← gap 12 zwischen Optionen (vertikal)
   Sublabel 11px text-3 (opt.)

◉  Aktive Option (accent)
   Sublabel

○  Dritte Option
```
- Kreis (outer): 20×20px, `border-radius: full`, `border: 1.5px solid border-strong`.
- Punkt (inner): 8×8px, `border-radius: full`, `background: accent`; erscheint nur im Selected-State.
- Punkt ist zentriert im Kreis; keine Fill des Kreises selbst (nur Punkt sichtbar).
- Label + Sublabel bilden zusammen mit Kreis einen klickbaren Tap-Target (gesamte Zeile).
- Gruppe: `flexDirection: column`, `gap: 12px`.

## States
| State | Kreis | Punkt |
|---|---|---|
| `unselected` | `bg-subtle`, `border: 1.5px border-strong` | unsichtbar |
| `hover` (Web) | `border-color: accent` 150ms springOut | unsichtbar |
| `selected` | `border: 1.5px accent`, `bg-subtle` | `background: accent` 8×8 sichtbar |
| `focus-visible` | `outline: 2px solid accent-bright, offset 2px` (instant) | — |
| `pressed` | `scale(.92)` 100ms linear → 150ms spring | mitgeführt |
| `disabled unselected` | `opacity .4`, `cursor: not-allowed` | — |
| `disabled selected` | `opacity .4`, Punkt erkennbar aber gedimmt | gedimmt |
| `error` | `border-color: danger`; Fehlermeldung 11px `danger` unter Gruppe | — |

## Mikro-Interaktion
- Punkt-Erscheinen: 200ms springy — Punkt skaliert von `scale(0) → scale(1.15) → scale(1)` mit
  `opacity 0 → 1`. Punkt-Verschwinden (Deselect durch andere Option): 150ms springOut.
- Kreis-Border: Farbwechsel 150ms springOut auf hover, instant beim Select.
- Haptik (native): `tapLight` bei Auswahl (§9: Checkbox check → Light; Radio folgt gleichem Mapping).
- Pressed: `scale(.92)` auf den Kreis; Label shiftet nicht.

## Verhalten & Edge Cases
- Nur eine Option kann gleichzeitig selected sein. Wahl einer neuen Option deselektiert die vorherige.
- Deselect durch Tap auf die aktive Option: standardmässig nicht erlaubt (Radio = Zwang zur Wahl);
  Prop `allowDeselect?: boolean` für Ausnahmen (z. B. optionale Filter).
- Tastaturnavigation (Web): `Tab` fokussiert die Gruppe (erste/aktive Option); `↑`/`↓` oder `←`/`→`
  wechseln zwischen Optionen und selektieren sofort (ARIA Radio Group Pattern); `Tab` verlässt Gruppe.
  Keine Pfeiltasten-Navigation ausserhalb der Gruppe.
- Disabled einzelne Option: bleibt im DOM, `aria-disabled="true"`, wird bei Pfeiltasten übersprungen.
- Alle Optionen disabled: `radiogroup` bekommt `aria-disabled`; kein Fokus.
- Label-Umbruch: mehrzeiliges Label wächst; Kreis bleibt vertikal oben ausgerichtet
  (`align-items: flex-start` auf der Zeile).
- Mehr als 7 Optionen in einer Gruppe: UX-Review erforderlich — wahrscheinlich besser als Select.

## Plattform
- **Web:** `<fieldset>` + `<legend>` (visuell oder sr-only); `<input type="radio">` sr-only;
  eigene `<div>`-Box via CSS. Native-like Focus-Management: Tab betritt Gruppe, Pfeiltasten navigieren.
  Aktive Option hat `tabindex="0"`, alle anderen `tabindex="-1"`.
- **Native:** `View role="radiogroup"` + `accessibilityLabel` (legend); einzelne Optionen als
  `Pressable accessibilityRole="radio"`, `accessibilityState={{ checked: selected }}`.
  Pfeiltasten-Navigation entfällt (touch-only); Optionen sind direkt tippbar.

## Props (Vertrag)
```ts
export type RadioOption = {
  value: string;
  label: string;
  sublabel?: string;
  disabled?: boolean;
};

export type RadioGroupProps = {
  legend: string;                    // immer im DOM; legendHidden für sr-only
  legendHidden?: boolean;
  options: RadioOption[];
  value: string | null;
  onChange: (value: string) => void;
  allowDeselect?: boolean;           // default false
  error?: string;
  disabled?: boolean;               // deaktiviert gesamte Gruppe
  'aria-describedby'?: string;
};
```

## Abnahme-Checkliste
- [ ] Kreis 20px, Punkt 8px `accent`; kein Fill des Kreises selbst
- [ ] Punkt-Animation 200ms springy (Overshoot), Deselect 150ms springOut
- [ ] Haptik Light native bei Auswahl
- [ ] Web-Tastatur: Tab betritt Gruppe, ↑↓ navigieren + selektieren, Tab verlässt
- [ ] Disabled einzelne Option: übersprungen bei Pfeil-Navigation
- [ ] `allowDeselect` deselektiert aktive Option beim zweiten Tap
- [ ] VoiceOver/TalkBack: `role="radio"`, `checked`, Gruppe-Label, Fehler korrekt angesagt
