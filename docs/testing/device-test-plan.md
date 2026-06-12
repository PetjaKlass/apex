# Apex — Device Test Plan

> Manual cross-device QA before launch. Work top to bottom: prerequisites →
> smoke test on every device → functional areas → cross-cutting → platform
> specifics. Log every issue in the table at the end with device + severity.

## 0. Backend readiness (do this first)

Many features added after Phase 22 have **migrations + sync rules that must be
deployed** or they'll be empty / won't sync across devices (the app won't crash —
local SQLite tables exist from the client schema, but server sync needs this):

- [ ] `supabase db push` applied (through `0030_affiliate_system.sql`)
- [ ] Updated `powersync/sync-rules.yaml` deployed in the PowerSync dashboard
- [ ] `supabase db advisors` clean (RLS on all new tables)
- [ ] Confirm a second test account exists for **Duo / privacy** checks

Without this, treat post-Phase-21 features as **single-device/local-only**.

## 1. What is testable now vs. after activation

**Testable now (web/PWA, no external accounts):** auth, onboarding, dashboard,
tasks, habits, focus, vision, goals, projects, areas, knowledge (+ tags), rituals,
journal, XP/levels/badges/mythic, score card, the letter, wisdom library, custom
cursor, accent picker, settings, cross-entity search, offline/sync, theme,
i18n, reduced-motion.

**Needs activation first (see the matching `docs/*-setup.md`):**

- Billing / Stripe checkout + portal → `billing-setup.md`
- AI Coach (Anthropic key + functions) → `ai-coach-setup.md`
- Calendar OAuth (Google/MS/Apple) → `calendar-setup.md`
- Push notifications (native build + APNs) → `mobile-release.md`
- Affiliate payouts (Stripe Connect) → `affiliate-setup.md`
- Native iOS/Android builds → `mobile-release.md`
- Desktop app → `desktop-setup.md`

Mark these **N/A (not activated)** in the log rather than "fail".

## 2. Device & browser matrix

Priority tiers — cover P0 fully, P1 if time, P2 opportunistic.

| Tier | Target                                               | Why                   |
| ---- | ---------------------------------------------------- | --------------------- |
| P0   | Desktop Chrome (latest), 1440px                      | primary web           |
| P0   | iPhone (Safari) — iPhone 12-class                    | perf budget reference |
| P0   | Android (Chrome) — Pixel 6-class                     | perf budget reference |
| P1   | macOS Safari + Firefox                               | engine differences    |
| P1   | iPad / tablet (landscape + portrait)                 | two-column layouts    |
| P1   | PWA installed (iOS + Android)                        | standalone display    |
| P2   | Edge (Windows), small laptop ~1280px                 | coverage              |
| P2   | Tauri desktop (mac/win/linux)                        | after desktop build   |
| P0   | Responsive sweep: 320 / 390 / 768 / 1024 / 1440 / 4K | layout integrity      |

## 3. Pre-test setup

- [ ] Two accounts (A + B) for Duo workspace + privacy isolation
- [ ] Seed sample data via the app (a few tasks/habits/goals/journal/letter)
- [ ] Know how to toggle OS **reduced motion** + **dark/light** per device
- [ ] DE and EN both checked (device language or in-app locale)
- [ ] Network throttling tool ready (DevTools) for offline tests

## 4. Smoke test (run on EVERY device first)

- [ ] App loads past the spinner after login (no "worker script" error)
- [ ] Dashboard renders (Momentum orb, OBT, widgets)
- [ ] Create a task → it appears; complete it → XP toast + momentum updates
- [ ] Navigate every primary nav item without a crash/blank screen
- [ ] No console errors (web) / no redbox (native)

## 5. Functional areas (checklist per feature)

**Auth & onboarding**

- [ ] Sign up, sign in, sign out; logout wipes local data
- [ ] Onboarding flow completes; resume mid-flow works; gates to dashboard

**Tasks**

- [ ] Quick-add; views (Today/Week/All/Inbox); search; edit; complete; undo-toast
- [ ] Set/recognize OBT; overdue styling

**Habits**

- [ ] Create (all 4 frequencies); check-in today + undo; streak flame; week grid
- [ ] Detail: heatmap, edit, archive, **delete → confirm dialog**

**Focus**

- [ ] Start from OBT; presets 25/5·50/10·90/20; pause/resume exact; ring smooth (≥58fps)
- [ ] Last-10s flash + (native) haptic; completion; cursor auto-hide (web)

**Vision / Goals / Projects / Areas / Knowledge**

- [ ] Vision create + conviction meter (red→gold); pause/resume/achieve
- [ ] Goal create (vision link, quarter, KRs); KR toggle → progress
- [ ] Project kanban; detail tabs (Tasks/Goals/Knowledge); add task in project
- [ ] Area create (color palette); Knowledge create + markdown + **tags**
- [ ] Cmd/Ctrl+K cross-search jumps to entities

**Rituals / Journal**

- [ ] Morning/Evening/Weekly flows; XP on completion; skip-confirm
- [ ] Journal autosave ("Saved"); markdown preview; search; daily prompt rotates

**Gamification**

- [ ] XP toast on task/habit/focus/ritual; level-up overlay; badge unlock ceremony
- [ ] Mythic gold orb + sparkles at high momentum (needs test data)

**Score Card / Letter / Library**

- [ ] Score Card year/quarter; charts + heatmap; empty year is gentle
- [ ] Letter: write → seal (confirm) → read-only; compare view (prior year)
- [ ] Library: daily quote; search/filter; favorite (heart) persists; reading list

**Settings**

- [ ] Accent picker live-applies; custom-cursor toggle (web); XP-visibility hides orb
- [ ] Every delete asks for confirmation (vision/journal/knowledge/habit/area/goal)

## 6. Cross-cutting

**Offline-first / sync** (needs §0 deployed)

- [ ] Go offline → create/edit tasks/habits/journal → still works
- [ ] Back online → changes sync; open account A's data on a 2nd device → matches
- [ ] **Privacy:** B never sees A's journal / letters / coach / calendar / score data

**Responsive** — at 320 / 390 / 768 / 1024 / 1440 / 4K:

- [ ] No horizontal scroll, no clipped text, no overlap
- [ ] Sidebar (≥1024) ↔ mobile drawer (<1024) switch; headers + grids reflow
- [ ] Modals fit small screens; bottom of pages fills viewport

**Theme & accent**

- [ ] Dark + light both correct; all 5 accents apply app-wide instantly; no color flash

**i18n**

- [ ] DE and EN: no raw keys, no overflow/truncation; dates/numbers localize
- [ ] Special chars render (ä ö ü ß é à ñ €)

**Accessibility**

- [ ] Keyboard: tab order, focus rings, Cmd/Ctrl+K, Esc closes modals
- [ ] Screen reader reads headings/buttons/labels; icon-only buttons have labels
- [ ] Reduced motion: animations simplified, no decoration, app still functional
- [ ] Safe-area insets correct (notch / home indicator) on every screen

**Performance (per CLAUDE.md budget)**

- [ ] Product Web LCP < 2.0s; INP < 100ms (Lighthouse / Web Vitals)
- [ ] Mobile cold start < 1.5s; list scroll ≥ 58fps (iPhone 12 / Pixel 6)
- [ ] No typing lag in inputs; animations hold 60fps (DevTools Performance)

## 7. Platform specifics

**iOS Safari + PWA**

- [ ] PWA installs; standalone (no browser chrome); icon + splash correct
- [ ] Safe areas; keyboard doesn't cover inputs; no rubber-band breakage

**Android Chrome + PWA**

- [ ] Edge-to-edge; status bar; back button behaves; install banner

**Tauri desktop** (after `desktop-setup.md` build)

- [ ] Installs (mac/win/linux); window state persists; offline works
- [ ] Native notifications; menus; ~10MB size; no console errors

## 8. Bug log

Severity: **P0** crash/data-loss/blocker · **P1** broken feature · **P2** polish.

| #   | Device / OS / browser | Area | Steps | Expected | Actual | Severity | Status |
| --- | --------------------- | ---- | ----- | -------- | ------ | -------- | ------ |
| 1   |                       |      |       |          |        |          | open   |

## 9. Sign-off

| Platform          | Tester | Date | P0  | P1  | Result            |
| ----------------- | ------ | ---- | --- | --- | ----------------- |
| Desktop Chrome    |        |      |     |     | ☐ pass            |
| iPhone Safari     |        |      |     |     | ☐ pass            |
| Android Chrome    |        |      |     |     | ☐ pass            |
| PWA (iOS/Android) |        |      |     |     | ☐ pass            |
| Tablet            |        |      |     |     | ☐ pass            |
| Desktop (Tauri)   |        |      |     |     | ☐ N/A until built |

**Launch gate:** zero open P0, < 5 P1 (per Phase 32 go/no-go).
