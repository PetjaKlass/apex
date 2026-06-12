# HabitCard — Identität, Streak, Risiko

> `apps/product/components/habits/HabitCard.tsx` · Phase 12 (kompakt) / 15 (voll) · Konventionen: `README.md`

## Zweck
Eine Gewohnheit als Identitätsbeweis. Die Karte lebt von **Ruhe**: Historie monochrom, genau ein Goldpunkt (heute), Farbe nur als Information (Risiko). Diese Regeln entstanden aus Petjas Review — sie sind nicht verhandelbar (S2).

## Anatomie
```
[Icon 38px]  Name 14px/600                     [🔥 34  Streak-Badge]
             Identitätssatz 12px text-3 („Ich bin jemand, der …")
[M][D][M][D][F][S][S]   Wochen-Dots (7, radius 9, max 30px)
[Abschließen (secondary sm)]
```
- Icon: 38px-Container `bg-subtle` + edge, Lucide-Icon 17px `text-2`. (Emoji nur, wenn Nutzer eines gewählt hat — Settings-Opt-in, Default sind Icons.)
- Identitätssatz ist Pflichtfeld der Gewohnheit und wird IMMER angezeigt — er ist der Punkt des Produkts.

## Farb-Logik (das Herzstück)
| Element | Regel |
|---|---|
| Dots vergangener Tage | erledigt `text-disabled` (neutral gefüllt), verpasst `bg-subtle` + Border (leer). **Nie rot** — Vergangenheit wird nicht bestraft. |
| Heutiger Dot | offen: transparent + 1px **gestrichelt** `accent` · erledigt: Fill `accent` + Glow `0 2px 8px accent-glow` — der einzige Goldpunkt |
| Streak-Badge | Default: neutral (`bg-subtle`, `text-2`, mono). **`risk`** (heute fällig & offen): `warning`-Text auf `warning` 11% — Farbe = Handlungsaufforderung |
| Geplante Nicht-Tage (frequency) | Dot `bg-subtle` 40% Opazität, kein Border — „heute zählt nicht" |

Streak-Shield (1/Monat, Phase 15): verbrauchter Shield-Tag = neutraler Dot mit kleinem Schild-Icon 8px `text-3` — Geschichte bleibt ehrlich lesbar.

## Frequenz-Typen (Anzeige)
`daily` alle 7 aktiv · `specific_days` Nicht-Tage gedimmt · `x_per_week` Dots + Fortschrittstext „3 / 4 diese Woche" (mono, ersetzt Tagesbuchstaben) · `weekly` ein breiter Dot (Woche).

## Abschluss-Choreo
Tap „Abschließen" (oder Dot-Tap heute): Dot füllt 200ms springy → Icon-Puls 600ms → Streak-Zahl +1 (Count, tnum) → Badge verliert `risk` → Button wird ghost „Heute erledigt" → XP-Toast (+15, Subline = Identitätssatz-Variante „Du bist jemand, der dranbleibt."). Haptik: Success. Sound `habit-complete` falls an.
**Un-Complete** (Tap auf „Heute erledigt"): erlaubt bis Mitternacht, kehrt alles um, XP-Korrektur, kein Confirm.

## Meilensteine
7/30/90/365: einmaliger Badge-Moment — Streak-Badge pulst 1×, Toast „30 Tage. Du warst da." KEIN Konfetti auf der Karte (Level-Up-Overlay ist dafür da, Phase 17).

## States
default · risk · done-today · paused (Karte 60% Opazität, Badge „Pausiert" `onhold`, Dots eingefroren) · archived (nur in Archiv-Liste, ghost) · loading (Skeleton).

## Varianten
- `full` (Habits-Seite): wie oben.
- `compact` (Dashboard): ohne Tagesbuchstaben + ohne Identitätssatz? **Nein** — Satz bleibt (Identität ist der Sinn), nur Buchstaben entfallen. Max. 2 Karten im Dashboard-Grid.

## Duo (Phase 15+)
Gemeinsame Gewohnheit: zweite Dot-Reihe (Partner) in 60% Größe darunter, Partner-Avatar 16px davor. Partner-Dots IMMER neutral (auch heute) — der Goldpunkt gehört dem eigenen Heute. `habit_logs` sind workspace-synced (data-model.md).

## Plattform
- Dots: einfache Views, keine SVG nötig; Puls via Reanimated.
- Heatmap (90 Tage) ist EIGENE Komponente auf der Habits-Seite, nicht Teil der Karte.
- A11y: Karte als Gruppe „Lesen, 20 Seiten. Streak 34 Tage. Heute offen."; Abschließen-Button einzeln fokussierbar; `risk` wird als „Streak in Gefahr" angesagt, nicht nur als Farbe (Farbblindheit!).

## Props (Vertrag)
```ts
export type HabitCardProps = {
  habit: Habit;                       // inkl. frequency_config, identity_statement
  week: DayState[7];                  // 'done'|'missed'|'off'|'today'|'today-done'|'shield'
  streak: number; risk: boolean;
  variant?: 'full'|'compact';
  partnerWeek?: DayState[7];          // Duo
  onComplete(id: string): void; onUncomplete(id: string): void; onOpen(id: string): void;
};
```

## Abnahme-Checkliste
- [ ] Farb-Logik exakt: nie zwei Goldpunkte, nie rote Vergangenheit, risk nur wenn heute fällig & offen
- [ ] 4 Frequenz-Typen korrekt gerendert (inkl. x_per_week-Fortschritt)
- [ ] Complete/Uncomplete-Choreo + XP-Korrektur; Mitternachts-Grenze (User-Timezone!)
- [ ] Shield-Tag, paused, archived, Duo-Reihe im Demo-Screen
- [ ] Screenreader: Risiko & Zustand textlich, nicht nur farblich
