# TaskRow — die meistgenutzte Komponente

> `apps/product/components/tasks/TaskRow.tsx` · Phase 12 (Platzhalter) / 14 (voll) · Konventionen: `README.md`

## Zweck
Eine Aufgabe in jeder Liste (Heute, Woche, Projekt, Inbox). Muss bei 50+ Instanzen in einer FlashList flüssig bleiben — **Performance ist Teil dieser Spec.**

## Anatomie
```
[Check ◯] Titel 14px/500
          Meta-Zeile 11px: (OBT-Flag) · Priorität · ●Bereich · tags · 📅Fällig · 90 min
```
- Container: Zeile IN einer Card (Layer 3-Verhalten): radius 14, padding 12, hover `bg-hover`; Trennung untereinander via 1px `border` (Hairline), erste Zeile ohne.
- **Checkbox: Kreis** 20px, 1.5px Border `border-strong`; hover: Border `accent` + scale 1.08. Erledigt: Fill `accent`, Häkchen `text-inverse` (11px, stroke 2.2).
- Titel: `text-1`; erledigt → `text-3` + Durchstrich (`text-disabled`-Linie).
- Meta-Chips in fester Reihenfolge: OBT-Flag → Priorität → Bereich → Tags → Fälligkeit → Schätzung. Getrennt durch `·` (`opacity .5`).

## Meta-Elemente (S2-Disziplin: maximal EIN Goldsignal pro Zeile)
| Element | Darstellung | Farbe |
|---|---|---|
| OBT-Flag | `◉ OBT` 10px uppercase 600 | `accent` — DAS Goldsignal der Zeile |
| Priorität | Flaggen-Icon 11 + Label | hoch `danger`, mittel `warning`, niedrig `text-3` — Information, nicht Schmuck |
| Bereich | 7px-Dot + Name | Bereichsfarbe (vom Nutzer je Area definiert) |
| Tags | `tag`-Pille (bg-subtle) | `text-2`, max. 2 sichtbar + „+n" |
| Fälligkeit | Kalender-Icon 11 + Text | überfällig `danger` 600; **heute `accent` 600 NUR wenn kein OBT-Flag** (sonst neutral — S2!); sonst `text-3` |
| Schätzung | `mono` 11px | `text-3` |

## States
- default / hover (`bg-hover`, 150ms) / focus-visible (Ring um ganze Zeile) / pressed (`bg-pressed`)
- **completing:** Check füllt sich (200ms springy) → Titel färbt + streicht durch (250ms) → Zeilen-Hintergrund pulst einmal `accent-dim` (600ms spring aus) → XP-Toast. Zeile bleibt bis Listen-Refresh an Ort (kein Layout-Sprung beim Abhaken).
- **syncing (offline erstellt):** kleiner Punkt `text-3` rechts, pulsierend 2.6s — verschwindet nach Sync-Ack.
- **overdue:** nur Fälligkeits-Chip rot — NIE die ganze Zeile einfärben.

## Interaktionen
| Geste | Aktion |
|---|---|
| Klick/Tap auf Check | complete/uncomplete (optimistisch, sofort) + Haptik Light |
| Klick/Tap auf Zeile | Task-Detail (Modal/Sheet) |
| Enter (fokussiert) | Detail öffnen · Space: toggle complete |
| Swipe → (mobil) | complete (Hintergrund `accent-dim`, Icon Check) |
| Swipe ← (mobil) | Aktionen: Planen / Löschen (Löschen = Heavy-Haptik + Confirm) |
| Long-Press (mobil) | Kontextmenü (Detail, Heute planen, OBT setzen, Löschen) |
| Drag-Handle (Web hover, links außen) | Reorder; `cursor:grab/grabbing` |

Uncomplete (Check auf erledigter Zeile): erlaubt, zieht XP wieder ab (gleiches Event-Log, negativer Betrag) — kein Confirm.

## Performance (hart)
- FlashList-Item: fixe geschätzte Höhe (64 einzeilig / 84 mit Meta-Umbruch); `React.memo` mit Task-Shallow-Compare.
- Kein Blur, keine Schatten pro Zeile; Animationen via Reanimated auf UI-Thread.
- Tap-to-Visual < 50ms (optimistisches Lokal-Update vor PowerSync-Write).

## Plattform
- Web: ganze Zeile `role="button"` + separates echtes `<button>` fürs Check (a11y-Name: „<Titel> abschließen").
- Native: `Pressable`-Zeile, Check `accessibilityRole="checkbox"` + `accessibilityState={{checked}}`; Swipe via `react-native-gesture-handler`.

## Props (Vertrag)
```ts
export type TaskRowProps = {
  task: Task;                       // aus PowerSync-Query, inkl. tags: string[]
  onToggle(id: string): void;       // optimistisch
  onOpen(id: string): void;
  onSwipeAction?(id: string, a: 'complete'|'schedule'|'delete'): void;
  density?: 'default'|'compact';    // compact: 1 Zeile, Meta inline gekürzt (Dashboard)
};
```

## Abnahme-Checkliste
- [ ] 60fps-Scroll mit 200 Zeilen (iPhone 12 / Pixel 6 / 5J-MacBook)
- [ ] Complete-Choreo exakt: 200/250/600ms, kein Layout-Shift
- [ ] S2 geprüft: nie zwei Goldsignale in einer Zeile
- [ ] Swipe + Long-Press + Tastatur vollständig; Screenreader liest Titel→Meta→Zustand
- [ ] Offline: Erstellen/Abhaken ohne Netz, Sync-Punkt verschwindet nach Reconnect
