# Apex Komponenten-Spezifikationen

> **Basis:** `design-system.md` v4.1 („Floating Glass" + Signaturen). Lebende Referenz: `design/design-preview-v2.html`.
> Diese Specs sind die Bauanleitung für Phasen 04–06 und alle Feature-Phasen. Claude Code liest vor jeder
> Komponenten-Implementierung die zugehörige Spec VOLLSTÄNDIG.

## Index

**Foundation (15)** — `packages/ui/`

| Spec | Komponente | Phase |
|------|-----------|-------|
| `button.md` | Button (5 Varianten, Pill) — **Muster-Spec, zuerst lesen** | 04 |
| `input.md` | Text/E-Mail/Passwort/Zahl/Such-Input | 04 |
| `card.md` | Card (Layer-2-Fläche, opak) | 04 |
| `textarea.md` | Mehrzeilig, Auto-Resize | 05 |
| `select.md` | Custom Dropdown (kein natives `<select>`) | 05 |
| `checkbox.md` | Inkl. Indeterminate | 05 |
| `toggle.md` | Switch | 05 |
| `radio.md` | RadioGroup | 05 |
| `avatar.md` | Initialen-Fallback, Status-Punkt | 05 |
| `badge.md` | Chips, Status, Counter, Delta | 05 |
| `modal.md` | Dialog / Sheet / Drawer (Glass-Pop-Ebene) | 06 |
| `toast.md` | 5 Typen inkl. XP | 06 |
| `tooltip.md` | Hover/Focus, nie Touch | 06 |
| `progress.md` | Linear + Ring | 06 |
| `skeleton.md` | Shimmer-Lade-Skelette | 06 |

**Apex-spezifisch (6)** — `apps/product/components/`

| Spec | Komponente | Phase |
|------|-----------|-------|
| `task-row.md` | Die meistgenutzte Komponente | 12/14 |
| `habit-card.md` | Streak, Wochen-Dots, Risiko-Logik | 12/15 |
| `obt-hero.md` | One Big Thing — trägt den Goldenen Faden (S1) | 12 |
| `momentum-orb.md` | Ring + Live-Zahl | 12/17 |
| `focus-timer.md` | Cinema-Pomodoro | 16 |
| `vision-card.md` | Bild + Conviction | 18 |

## Gemeinsame Konventionen (gelten für JEDE Spec, werden dort nicht wiederholt)

### Tokens & Themes
- Farben/Radien/Schatten NUR über Tokens aus `packages/design-tokens` (Namen wie in `design-system.md` §2–3). Kein Hex im Komponenten-Code.
- Jede Komponente wird in **2 Themes × 5 Akzenten** getestet (Storybook-Ersatz: Demo-Screen `/dev/components` im Dev-Build, da Storybook gestrichen — siehe phases/log.md Phase 04).
- Karten/Container: **opak**. Glas (`panel`/`panelStrong` + blur) ist exklusiv für: Sidebar, Content-Hülle, Dock, Modal/Sheet, Toast, Command Palette. Blur-Budget: max. 3 gleichzeitig.
- Borders: Dark-Mode-Werkzeug. Light = borderless + Schatten (`--shadow-card`) + Lichtkante (`--edge`).

### Signaturen (Verstöße = Review-Fail)
- **S1 Goldener Faden:** 2px-Naht `linear-gradient(180deg, accent-bright, accent 45%, transparent 92%)` — NUR OBTHero (+ FocusTimer-Ring + heutiger Dot + Level-Progress als Faden-Familie). Niemals woanders.
- **S2 Ein Goldpunkt pro Karte:** Akzent markiert ausschließlich heute/aktiv/nächster Schritt. Historie monochrom.
- **S3 Zahlen als Schmuck:** Live-Werte immer `font-mono` + `tnum`; Einheit klein in `font-ui`/`text-secondary` (~45 % der Wertgröße). Deutsche Formate (Komma, Tausenderpunkt).

### States (Pflicht-Matrix für jede interaktive Komponente)
`default · hover (nur Web) · focus-visible · active/pressed · disabled · loading` — plus komponentenspezifische.
- Focus-Ring: `outline: 2px solid accent-bright; outline-offset: 2px` — **instant**, nie animiert.
- Hover darf NIE Layout shiften. Pressed = `scale(.97)` bei Buttons, `bg-pressed` bei Flächen.
- Disabled: `opacity .4` + `cursor: not-allowed` (Web), kein Hover/Press.

### Motion
Nur `transform` + `opacity` (+ Farben auf Hover). Dauern/Easings aus §8: hover 150ms springOut, press 100ms linear, Eintritt 250ms spring. `prefers-reduced-motion` → 1ms global.

### Plattform-Split
- Ein API, zwei Renderer: Web (React Native Web) + Native. Unterschiede stehen pro Spec unter „Plattform".
- Haptik (`expo-haptics`) nur native, per zentralem `utils/haptics.ts` (No-Op auf Web). Mapping aus §9.
- Touch-Ziele ≥ 44×44 (hitSlop wenn visuell kleiner).

### Accessibility-Baseline (zusätzlich zu §18)
- Jede Komponente: korrekte Rolle (`accessibilityRole`/ARIA), Label, States (`aria-checked`, `aria-expanded` …).
- Text-Kontraste: primär ≥ 4.5:1, sekundär ≥ 4.5:1 (AA-feste Tokens v4.1), dekoratives ausgenommen.
- Screenreader-Test: VoiceOver + TalkBack Pflicht vor Phase-Abschluss.

### Datei-/Code-Standard
```
packages/ui/components/<Name>.tsx     // Foundation
apps/product/components/<feature>/<Name>.tsx  // Apex-spezifisch
export type <Name>Props = { … }       // dokumentierte Props, keine any
```
Tests: Verhalten (Vitest) + Demo-Screen-Eintrag. Jede Spec endet mit „Abnahme-Checkliste".
