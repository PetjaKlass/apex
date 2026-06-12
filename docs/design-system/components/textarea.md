# Textarea — Mehrzeiliges Texteingabefeld, Auto-Resize

> `packages/ui/components/Textarea.tsx` · Phase 05 · Konventionen: siehe `README.md`

## Zweck
Mehrzeiliges Eingabefeld für Journal-Einträge, Beschreibungen, Reflexionen und Freitexte. Wächst
automatisch mit dem Inhalt (kein sichtbarer Scrollbalken im Feld), bleibt dabei innerhalb einer
konfigurierbaren Maximalhöhe. Teilt das visuelle System mit `Input.tsx` (gleiche Tokens, gleiche
Label-Konvention, gleiche Fehlerdarstellung).

## Anatomie
```
Label 11px/600 text-2
┌────────────────────────────────────────────────────┐  r 14  bg-subtle
│  Wert 13px text-1, lineHeight 1.6                  │  pad 10×16
│  (wächst mit Inhalt, min 3 Zeilen)                 │
│                                                    │
│                               Zeichen: 240 / 500   │  ← optional, 11px text-3 innen unten rechts
└────────────────────────────────────────────────────┘
  Hinweis oder Fehlermeldung 11px
```
- Resize-Handle (Web): `resize: none` — der User zieht nicht, die Komponente wächst.
- Zeichenzähler: nur wenn `maxLength` gesetzt; Farbe wechselt zu `danger` ab 90 % ausgeschöpft.
- Kein festes Handle-Icon nötig; Wachsen signalisiert genug.

## Varianten & Größen
| Größe | min-Höhe | min-Zeilen | Schrift | Einsatz |
|---|---|---|---|---|
| `sm` | 72px | 3 | 12px | Kurz-Notiz, Subtitle-Feld |
| `md` (Default) | 100px | 4 | 13px | Beschreibungen, Reflexion |
| `lg` | 140px | 5 | 14px | Journal, Vision-Statement |

`maxHeight` Default 320px — darüber scrollt das Feld intern (`overflow-y: auto`, Scrollbar `scrollbar-width: thin`).

## States
| State | Darstellung |
|---|---|
| `default` | `bg-subtle`, Border `border` (beide Themes), `edge` |
| `hover` (Web) | `border-color: border-strong` 150ms springOut |
| `focus-visible` | `border-color: accent` + `box-shadow: 0 0 0 4px accent-glow, edge` (instant) |
| `error` | `border-color: danger`; Fehlermeldung darunter; Glow als `danger` 6% alpha |
| `disabled` | `opacity .4`, `cursor: not-allowed`, kein Hover/Focus |
| `readonly` | Wie `default`, kein Focus-Ring, `cursor: default` |

## Mikro-Interaktion
- Auto-Resize Web: per `scrollHeight`-Messung nach jedem Input-Event; Höhenänderung ohne Transition
  (Layout-Shift-Verbot aus §8 — Höhe darf nicht animiert werden). Die Karte drumherum reflows still.
- Auto-Resize Native: `onContentSizeChange` setzt `height` im State; gleiche Logik.
- Zeichenzähler: Farbe 150ms springOut auf `danger`, wenn ≥ 90 % erreicht.
- Fehler-Einblendung: 150ms spring, identisch zu `Input.tsx`.

## Verhalten & Edge Cases
- `minHeight` ist immer sichtbar, auch leer — verhindert das „Kollaps auf 0"-Flackern beim Mount.
- `maxLength` per `maxLength`-Attribut erzwingen; UI-Zähler ist visuelles Feedback, keine Duplik-Validierung.
- Tab im Feld: auf Web fügt Tabulator-Zeichen ein (Autor-Intent bei Freitext); in Formularkontexten
  `tabBehavior="focus-next"` setzen, damit Tab zum nächsten Feld springt.
- Paste: immer erlaubt; bei `maxLength`-Überschreitung wird Text am Limit abgeschnitten und Zähler rot.
- Newlines: `\n` ist valide; Komponente rendert sie als echte Zeilenumbrüche (kein Strip).
- Leerer Submit: Validation liegt beim Elternformular; Textarea selbst kennzeichnet nur `aria-required`.

## Plattform
- **Web:** `<textarea>`; `resize: none`; `overflow: hidden` bis `maxHeight`, dann `overflow-y: auto`;
  `field-sizing: content` als progressives Enhancement (Safari/Chrome 2024+), Fallback via JS.
- **Native:** `TextInput multiline`; `scrollEnabled={false}` bis `maxHeight` erreicht, dann `true`;
  `textAlignVertical="top"` (Android); `onContentSizeChange` für Auto-Resize.
- Border in beiden Themes wie `Input` (strukturelle Ausnahme von borders-dark-only).

## Props (Vertrag)
```ts
export type TextareaProps = {
  size?: 'sm'|'md'|'lg';            // default 'md'
  label: string;
  placeholder?: string;
  value: string;
  onChangeText: (v: string) => void;
  maxLength?: number;                // aktiviert Zeichenzähler
  maxHeight?: number;                // default 320 (px)
  hint?: string;
  error?: string;
  required?: boolean;
  disabled?: boolean;
  readonly?: boolean;
  tabBehavior?: 'insert-tab'|'focus-next'; // default 'insert-tab'
  'aria-describedby'?: string;
};
```

## Abnahme-Checkliste
- [ ] Auto-Resize ohne Animations-Transition; keine Layout-Sprünge in Eltern-Karte
- [ ] `maxHeight` löst internen Scroll aus; Scrollbar `scrollbar-width: thin`
- [ ] Zeichenzähler rot ab 90 %, korrekte Beschneidung bei Paste
- [ ] Focus-Glow instant, Error-Darstellung identisch zu `Input.tsx`
- [ ] Tab-Verhalten je nach `tabBehavior`-Prop korrekt
- [ ] 3 Größen × 2 Themes × 5 Akzente im Demo-Screen
- [ ] VoiceOver/TalkBack: Label, Pflichtfeld, Fehler korrekt angesagt
