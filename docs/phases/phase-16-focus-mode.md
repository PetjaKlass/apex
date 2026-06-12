# Phase 16 — Focus Mode (Pomodoro)

> **Stage:** Beta
> **Size:** L (3-5 days, ~24-32 hours)
> **Status:** Ready to execute
> **Dependencies:** Phase 15 complete

## Goal

Build the cinema-mode Focus Session experience per `focus-timer.md` spec. Pomodoro logic, ambient sound integration, full-screen cinema entrance, completion ceremony. This is one of Apex's signature features.

## Why Now

Tasks (Phase 14) and Habits (Phase 15) handle daily flow. Focus Mode handles deep work. Together: complete daily workflow loop.

## Prerequisites

- Phase 15 complete
- focus_sessions table exists (Phase 09)
- expo-audio installed

## Scope

1. `<FocusTimer>` per `focus-timer.md` spec
2. Focus Mode page (full-screen cinema takeover)
3. Pomodoro logic: 25/5, 50/10, 90/20, custom
4. Cinema mode entrance animation (sidebar + topbar fade out)
5. Ambient sound integration (7 sounds: rain, forest, cafe, ocean, whitenoise, fire, night)
6. Pause / Resume preserving exact time
7. End Session confirmation modal
8. Session history tracking
9. XP rewards (placeholder)
10. Focus → OBT linking (start session from OBTHero)
11. Last-10-seconds visual countdown + haptic
12. Tibetan bowl completion sound
13. Cursor auto-hide on web (3s inactivity)
14. Background app handling (iOS/Android suspension)

## Out of Scope

- Real XP engine (Phase 17)
- Focus session statistics page (Phase 25)
- AI Coach integration with Focus (Phase 24)

## Acceptance Criteria

- [ ] FocusTimer renders correctly per spec
- [ ] Cinema entrance animation: 400ms total, sidebar/topbar fade, page expands
- [ ] Ring animation smooth at 60fps for 50min duration (test on low-end Android)
- [ ] Time display: MM:SS, mono font, tabular numbers
- [ ] Pause/Resume preserves exact second (no cheat advance)
- [ ] End Session shows confirmation modal
- [ ] Last 60s: glow intensifies subtly
- [ ] Last 10s: number flashes each second + light haptic
- [ ] Completion: ring fills, "00:00" briefly, Tibetan bowl sound (if enabled), Success haptic
- [ ] 1-second pause after completion (let moment land)
- [ ] Then transitions to break phase (or session-end)
- [ ] Break phase: success-color ring, "Take a break" message
- [ ] Session length options: 25/5, 50/10, 90/20, custom
- [ ] Ambient sound starts on session start, fades on end
- [ ] Sound volume slider works
- [ ] Cursor hides after 3s inactivity (web only)
- [ ] Mobile: tap-to-show controls (3s fade)
- [ ] Background handling: app suspended → foreground → correct time
- [ ] Reduced motion: ring still updates (functional), no decoration
- [ ] Periodic accessibility announcements (every 5min via aria-live)
- [ ] Multi-Pomodoro: after 4, long break (15-20 min)
- [ ] Focus → OBT: starting session from OBTHero passes title

## Implementation Plan

1. **Focus Mode route** (~1 hour) — `app/(app)/focus.tsx` full-screen takeover
2. **FocusTimer component** (~10 hours) — full spec, SVG ring, Reanimated worklet
3. **Cinema entrance** (~3 hours) — coordinated fade-out of shell, expand background
4. **Pomodoro state machine** (~3 hours) — idle/active/paused/break/long-break/complete
5. **Custom hook** (~2 hours) — `useFocusTimer({ duration, onComplete })` rAF-based
6. **Ambient sound system** (~3 hours) — expo-audio, 7 sounds, crossfade, volume
7. **Pause/Resume + End** (~2 hours) — confirmation modal, state preservation
8. **Last-10s countdown** (~2 hours) — number flash, haptic per second
9. **Completion ceremony** (~2 hours) — sound, haptic, transition timing
10. **Background handling** (~2 hours) — AppState listeners, time recalculation
11. **Cursor auto-hide** (~1 hour) — web only, mouse movement listeners
12. **OBT integration** (~1 hour) — pass session title from OBTHero
13. **Tests + commit** (~2 hours)

## Files Created/Modified

**Created:**

- `apps/product/app/(app)/focus.tsx`
- `apps/product/components/focus/FocusTimer.tsx`
- `apps/product/components/focus/FocusModeContext.tsx`
- `apps/product/components/focus/EndSessionModal.tsx`
- `apps/product/components/focus/AmbientSoundPicker.tsx`
- `apps/product/lib/focus/useFocusTimer.ts`
- `apps/product/lib/focus/useAmbientSound.ts`
- `apps/product/assets/audio/ui/focus-end.mp3` (Tibetan bowl)
- `apps/product/assets/audio/ambient/rain.ogg`
- `apps/product/assets/audio/ambient/forest.ogg`
- `apps/product/assets/audio/ambient/cafe.ogg`
- `apps/product/assets/audio/ambient/ocean.ogg`
- `apps/product/assets/audio/ambient/whitenoise.ogg`
- `apps/product/assets/audio/ambient/fire.ogg`
- `apps/product/assets/audio/ambient/night.ogg`

## Common Pitfalls

**1. SVG ring stroke-dashoffset on long sessions** — 50min × 60s × 60fps = 180k frames. Reanimated worklet on UI thread is mandatory.

**2. Background suspension** — iOS/Android may kill timer. On foreground, recompute elapsed from start time.

**3. Audio licensing** — ambient sounds must be licensed (CC0 or commercial). Document sources in `assets/audio/LICENSES.md`.

**4. expo-audio API** — different from expo-av (deprecated). Read latest docs.

**5. Volume control on iOS** — system volume vs in-app volume. Use independent in-app volume.

**6. Cursor hide flicker** — fade smoothly (500ms), reappear instantly on movement.

**7. Pomodoro long break math** — every 4 Pomodoros = long break. Track count in session state.

**8. OBT linking** — title passes through query param or context. Verify it works.

## Done When

- Focus Session feels premium (Petja test: do a real 50-min session)
- Cinema mode entrance smooth
- Sounds play correctly cross-platform
- Background handling correct
- Completion ceremony moves the user emotionally (it should)
- Commit: `feat(focus): cinema-mode pomodoro with ambient sounds`

---

**Next:** `phase-17-xp-momentum.md`
