# OBTHero — One Big Thing

> `apps/product/components/dashboard/OBTHero.tsx` · Phase 12 · Konventionen: `README.md`

## Zweck
Das Zentrum des Dashboards und der Träger von **Signatur S1 (Goldener Faden)**. Wenn ein Nutzer einen Screenshot von Apex teilt, ist es diese Karte. Sie beantwortet: „Was ist heute das Eine?"

## Anatomie
```
║ EYEBROW „ONE BIG THING" (accent-bright)
║ Titel 25px display/700
║ [Projekt-Chip] [●Bereich] [⏱ 90 min]
║ [Fokus starten (primary)] [Erledigt (hero-secondary)]
```
- **Kontrast-Karte:** Light-Theme → `hero-bg #16150F` (dunkle Karte auf hellem Canvas); Dark-Theme → Gold-Glas-Gradient (`accent 16% über #121214 → #101013`) + Border `accent-border`. Radius `r-xl` 26, Padding 24.
- **Der Goldene Faden:** 2px, linke Innenkante, `linear-gradient(180deg, accent-bright, accent 45%, transparent 92%)`. Immer sichtbar, nie animiert im Ruhezustand.
- Layer-Glow: Radial `accent-glow` von oben rechts (88% / −20%), rein dekorativ, unter 8% Alpha.
- Chips auf der Karte: eigene Hero-Varianten (`rgba(255,255,255,.07)`, Border `…,.12`, Text `hero-text-2`).

## Zustände (Inhalt > UI-State)
| Zustand | Darstellung |
|---|---|
| **gesetzt** (Normalfall) | wie Anatomie; primärer Button „Fokus starten" |
| **erledigt** | Titel `hero-text-2` + Durchstrich; Buttons → „Abend-Reflexion öffnen" (secondary). Faden bleibt — der Tag hatte sein Zentrum. Einmalige Celebration beim Abschluss: Karte `scale 1.0→1.01→1.0` (600ms spring) + XP-Toast +50; KEIN Konfetti. |
| **leer** (kein OBT gesetzt) | Empty-Variante: gleiche Karte, Frage statt Titel — „Was ist heute das Eine?" + Button „OBT wählen" (öffnet Vorschlagsliste: heutige Tasks, sortiert nach Priorität/Deadline). Faden gedimmt (40% Opazität): noch kein Zentrum. |
| **morgen geplant** (Abend) | Eyebrow „MORGEN", Titel aus `tomorrow_obt` des Abendrituals, Buttons disabled bis 0 Uhr |

## Interaktionen
- „Fokus starten" → FocusTimer mit verknüpfter Task (Drill-Transition).
- „Erledigt" → wie TaskRow-Complete (gleiches Task-Objekt!), plus Hero-Zustandswechsel.
- Klick auf Titel → Task-Detail-Modal.
- Long-Press/Kebab (oben rechts, ghost, erscheint auf Hover) → „OBT ändern" (heute: max. 1 Wechsel ohne Reibung; danach Confirm „Das Zentrum wackelt — sicher?" — Apex ist opinioniert).

## Regeln
- Es gibt **genau eine** OBTHero-Instanz in der App (Dashboard). Keine Mini-Varianten anderswo — Knappheit des Fadens (S1).
- Titel max. 2 Zeilen, dann Ellipsis + voller Titel im Detail. Kein Auto-Shrink der Schrift.
- Karte enthält NIE mehr als die 4 Anatomie-Zeilen. Subtasks, Beschreibung etc. leben im Detail.

## Plattform
- Gradient + Faden: Web CSS-Background-Layers; native `expo-linear-gradient` (2 Layer: Faden als absolut positionierter 2px-View mit Gradient).
- Celebration-Scale via Reanimated; Haptik: Success-Notification beim Erledigen.
- Statisches Rendering sicher (kein Blur auf dieser Karte — sie ist opak/Gradient).

## Props (Vertrag)
```ts
export type OBTHeroProps = {
  task: Task | null;                 // null → Empty-Variante
  phase: 'today'|'done'|'tomorrow';
  onStartFocus(taskId: string): void;
  onComplete(taskId: string): void;
  onPick(): void;                    // OBT wählen/ändern
};
```

## Abnahme-Checkliste
- [ ] 4 Zustände × 2 Themes × 5 Akzente im Demo-Screen
- [ ] Faden: exakt 2px, korrekte Stops, in Empty 40% gedimmt
- [ ] Erledigt-Celebration einmalig (kein Re-Trigger bei Re-Render)
- [ ] Kontraste auf hero-bg: Eyebrow accent-bright ≥ 3:1, hero-text ≥ 4.5:1 — in allen 5 Akzenten (Silver kritisch prüfen!)
- [ ] Screenreader: „One Big Thing: <Titel>, Aufgabe, heute" als zusammenhängende Ansage
