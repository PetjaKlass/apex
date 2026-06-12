# Select — Custom Dropdown, kein natives select

> `packages/ui/components/Select.tsx` · Phase 05 · Konventionen: siehe `README.md`

## Zweck
Auswahlfeld für eine Option aus einer vordefinierten Liste. Kein natives `<select>` — der Trigger sieht
aus wie ein Input, das Dropdown ist ein `panelStrong`-Glas-Layer (blur 40, radius 20, shadow-pop, edge).
Auf Mobilgeräten öffnet sich stattdessen ein Bottom-Sheet (siehe `modal.md`). Vollständige
Tastaturnavigation und Screenreader-Unterstützung via ARIA Combobox Pattern.

## Anatomie
```
Label 11px/600 text-2
┌─────────────────────────────────────────────────┬──────┐  h 42  r 14  bg-subtle
│  Ausgewählter Wert 13px text-1                  │  ❯   │  Chevron 16px text-3
└─────────────────────────────────────────────────┴──────┘  pad 10×16
  Fehlermeldung 11px danger

  ╔═══════════════════════════════════════════╗    z-dropdown (200)
  ║  Dropdown — panelStrong-Glas              ║    r 20  blur 40  shadow-pop  edge
  ║  ┌─────────────────────────────────────┐  ║    max-h 320px  overflow-y auto
  ║  │  Option A                           │  ║    36px/Zeile  r 10  pad 0×12
  ║  │  Option B                    ✓ acc  │  ║    aktiv: Häkchen + accent-Text
  ║  │  Option C                           │  ║    hover: bg-hover
  ║  └─────────────────────────────────────┘  ║
  ╚═══════════════════════════════════════════╝
```
- Chevron: `ChevronDown` Lucide 16px, rotiert 180° wenn offen (200ms springy).
- Trennlinie zwischen Optionsgruppen: 1px `border` horizontal, Label in `text-3` 10px uppercase.
- Langer Optionstext: `text-overflow: ellipsis`, kein Wrap.

## Varianten & Größen
| Größe | Trigger-Höhe | Schrift | Zeilen-Höhe |
|---|---|---|---|
| `sm` | 34px | 12px | 32px |
| `md` (Default) | 42px | 13px | 36px |
| `lg` | 50px | 14px | 40px |

Variante `searchable`: Trigger wird zu echtem Textfeld; Optionsliste filtert beim Tippen (Substring,
case-insensitive); leere Suche zeigt alle Optionen; Lupe-Icon links.

## States
| State | Trigger | Dropdown |
|---|---|---|
| `default` | `bg-subtle`, Border `border`, `edge` | — |
| `hover` (Web) | `border-color: border-strong` 150ms | — |
| `open` | `border-color: accent`, `box-shadow: 0 0 0 4px accent-glow`, Chevron 180° | sichtbar, 200ms spring von `opacity 0, scale .97, translateY -6px` |
| `option hover` | — | `bg-hover` 150ms |
| `option aktiv` | Wert sichtbar im Trigger, Häkchen + `accent`-Text in Liste | |
| `error` | `border-color: danger`, Meldung darunter | — |
| `disabled` | `opacity .4`, `cursor: not-allowed` | — |

## Mikro-Interaktion
- Dropdown-Eintritt: 200ms spring, `opacity 0 → 1`, `scale .97 → 1`, `translateY -6px → 0`.
- Dropdown-Austritt: 150ms springOut, gleiche Properties in Gegenrichtung.
- Chevron-Rotation: 200ms springy.
- Optionswahl: Dropdown schließt 150ms nach Selection (kurze Pause lässt Häkchen sichtbar).
- Haptik (native): `tapLight` beim Öffnen des Triggers; `selectionAsync` bei Optionswahl.

## Verhalten & Edge Cases
- Tastaturnavigation (Web): `↑`/`↓` bewegen Fokus; `Enter`/`Space` wählen; `Esc` schließt ohne Auswahl;
  `Home`/`End` springen zu erster/letzter Option; Type-ahead: Buchstaben springen zur ersten
  passenden Option (500ms Debounce zum Reset).
- Dropdown positioniert sich nach verfügbarem Platz: öffnet bevorzugt nach unten (12px Abstand zum
  Trigger); wechselt nach oben wenn Viewport-Platz < Dropdown-Höhe.
- Max-Höhe 320px — darüber scrollt die Liste intern; Scrollbalken `scrollbar-width: thin`.
- Klick ausserhalb / Blur: schliesst Dropdown sofort (kein Delay).
- Langer Optionswert im Trigger: wird mit Ellipsis abgeschnitten; Chevron bleibt in Position.
- Wenn Dropdown die maximale Höhe überschreitet, bleibt Chevron fixiert (nicht mitgescrollt).
- **Mobil (native):** kein Floating-Dropdown — Trigger öffnet Bottom-Sheet via `modal.md`
  (Optionsliste als Sheet-Inhalt, volle Breite, Handle oben). Tastaturnavigation entfällt.
- ARIA: Trigger `role="combobox"`, `aria-expanded`, `aria-haspopup="listbox"`, `aria-controls`;
  Liste `role="listbox"`; Optionen `role="option"`, `aria-selected`.

## Plattform
- **Web:** Dropdown als absolut positioniertes `<div>` im Portal (Body-Ende, Z-Index 200).
  `useClickOutside`-Hook schließt bei Außenklick. Focus-Trap innerhalb des offenen Dropdowns.
- **Native:** Trigger ist `Pressable`; öffnet Bottom-Sheet-Modal (`modal.md`); keine Floating-Ebene.
  `accessibilityRole="combobox"`, `accessibilityState={{ expanded }}`.

## Props (Vertrag)
```ts
export type SelectOption = {
  value: string;
  label: string;
  disabled?: boolean;
};

export type SelectGroup = {
  label: string;
  options: SelectOption[];
};

export type SelectProps = {
  size?: 'sm'|'md'|'lg';            // default 'md'
  label: string;
  placeholder?: string;
  value: string | null;
  onChange: (value: string) => void;
  options: SelectOption[] | SelectGroup[];
  searchable?: boolean;
  error?: string;
  hint?: string;
  required?: boolean;
  disabled?: boolean;
  maxHeight?: number;               // default 320
  'aria-describedby'?: string;
};
```

## Abnahme-Checkliste
- [ ] Kein natives `<select>` im DOM; eigenes ARIA Combobox-Pattern vollständig
- [ ] Tastatur: ↑↓ Enter Esc Home/End Type-ahead funktionieren ohne Maus
- [ ] Dropdown als `panelStrong`-Glas (blur 40, r 20, shadow-pop, edge), max-h 320, scrollt
- [ ] Positions-Logik: öffnet unten, wechselt oben wenn kein Platz
- [ ] Mobil: Bottom-Sheet statt Floating-Dropdown
- [ ] Error, disabled, searchable Variante im Demo-Screen
- [ ] VoiceOver/TalkBack: Rolle, expanded-State, gewählte Option korrekt angesagt
