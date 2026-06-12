# Apex — Phase Roadmap

> **The complete path from empty repo to public launch.**
> 32 phases across 3 stages. Each phase is one focused unit of work that Claude Code can execute end-to-end.

---

## Table of Contents

1. [Reading This Roadmap](#reading-this-roadmap)
2. [Phase Format](#phase-format)
3. [Stage Definitions & Goals](#stage-definitions--goals)
4. [Phase Sizing](#phase-sizing)
5. [Stage Gates](#stage-gates)
6. [Stage 1: Alpha (Phases 1-13)](#stage-1-alpha)
7. [Stage 2: Beta (Phases 14-23)](#stage-2-beta)
8. [Stage 3: Launch+ (Phases 24-32)](#stage-3-launch)
9. [Total Effort Estimate](#total-effort-estimate)
10. [Risk-Adjusted Milestones](#risk-adjusted-milestones)

---

## Reading This Roadmap

This document is **the master plan**. Read it once now, return to it before each new phase.

**It does NOT replace the per-phase prompts** — those live in `docs/phases/phase-XX-*.md`. This document is the overview; per-phase files are the implementation specs.

**Phases are sequential, not parallel.** Each phase builds on previous phases. Don't skip phases or reorder them without good reason — dependencies are real.

**Sizing is honest.** Phases marked "L" really are large. If you finish one in half the estimate, congratulations — but plan for the worst case.

---

## Phase Format

Every phase has its own file (`docs/phases/phase-XX-name.md`) with this structure:

```
# Phase XX — Name

Stage: Alpha / Beta / Launch+
Size: XS / S / M / L / XL
Estimated effort: 2-4 hours / 1-2 days / 3-5 days / 1-2 weeks

## Goal
What this phase accomplishes in one sentence.

## Why Now
Why this phase, in this order, before/after others.

## Prerequisites
What must be done before starting.

## Scope
Bullet list of what's in scope.

## Out of Scope
What is NOT this phase (deferred to later).

## Acceptance Criteria
Checklist of testable, verifiable outcomes.

## Implementation Plan
Step-by-step breakdown.

## Files Created/Modified
List of files this phase touches.

## Testing
What to test, how to verify.

## Common Pitfalls
Things that go wrong; how to avoid.

## Done When
Final criteria to mark phase complete.
```

When Petja says "Execute Phase XX," Claude Code reads `CLAUDE.md` + the phase file, then executes.

---

## Stage Definitions & Goals

### Stage 1: Alpha (Phases 1-13)

**Goal:** Apex Web + PWA running, Petja dogfoods for 30+ days.

**Defining characteristics:**

- Web only (no mobile native apps yet)
- No payments (free for alpha users)
- Marketing site: nur das technische Fundament (Phase 07 — Auth-Seiten, Legal, Shell). Voller Marketing-Polish kommt in Stage 2 (Phase 23). _(Korrigiert: hier stand früher „No marketing site", was Phase 07 direkt widersprach.)_
- Local development only initially, deployed to Vercel mid-stage
- Single user (Petja) primary, optional 2-3 alpha testers
- Goal: validate the technical foundation (Auth, Sync, Shell, Onboarding, Dashboard) before building the core loops on top

**Stage 1 success looks like:**

- Fundament steht: Auth, PowerSync-Sync, App-Shell, Onboarding, Dashboard laufen stabil in Production
- PowerSync syncs reliably between his laptop and desktop
- Alle Adversarial-Security-Tests bestanden (Phase 09)
- DSGVO infrastructure in place
- Petja beginnt tägliche Nutzung (Onboarding, OBT-Auswahl, Dashboard) — **das volle 30-Tage-Dogfooding-Gate liegt NICHT hier**, sondern nach Phase 19 (siehe Stage Gates unten), weil Tasks/Habits/Focus/Rituale erst in Phasen 14–19 gebaut werden. _(Korrigiert: die frühere Definition verlangte 30 Tage Dogfooding mit Features, die in Stage 1 noch gar nicht existieren.)_

**End-of-Stage-1 deliverable:** Ein technisch validiertes Fundament (Web + PWA, Sync, Auth, Shell), auf dem die Core-Features in Stage 2 schnell und sicher aufgebaut werden können.

---

### Stage 2: Beta (Phases 14-23)

**Goal:** Native iOS + Android in App Stores, Marketing Site live, Stripe payments active, public Beta launch with target of 100 paying users.

**Defining characteristics:**

- All distributions ship: Web, PWA, iOS, Android, Desktop
- Marketing Site at `apex.[domain]` live
- Stripe live (real payments)
- Email flows (verification, magic links, transactional)
- Public Beta launch (HackerNews, ProductHunt, X)
- Real customer support (basic ticketing, Sentry alerts)

**Stage 2 success looks like:**

- 100+ paying users (Solo Pro €12 or Duo Pro €29)
- Net Promoter Score (NPS) > 40
- Monthly churn < 8%
- Mobile crash-free rate > 99.5%
- Marketing organic traffic > 1k visitors/month

**End-of-Stage-2 deliverable:** A revenue-generating SaaS product with paying customers and a clear product-market fit signal.

---

### Stage 3: Launch+ (Phases 24-32)

**Goal:** Scale to 1,000 paying users, ship AI Coach, polish premium features, sustainable growth.

**Defining characteristics:**

- AI Coach feature live (the major differentiator)
- Score Card, The Letter (yearly), Wisdom Library
- Public launch event (ProductHunt #1 attempt, X campaign)
- Affiliate program for content creators
- Custom cursor on web (Stage 3 premium touch)
- Mythic mode for high-momentum users
- Quarterly product updates as marketing events

**Stage 3 success looks like:**

- 1,000+ paying users
- Monthly churn < 5%
- 30%+ users with active AI Coach usage
- €15,000+ MRR (Monthly Recurring Revenue)
- 4+ public press mentions / podcast appearances
- Apex established as "the premium productivity OS for solo founders"

**End-of-Stage-3 deliverable:** A sustainable indie SaaS business doing €180k+/year ARR, with a clear path to either staying solo or hiring first contractor.

---

## Phase Sizing

Sizes reflect real-world solo founder effort, not best-case scenarios:

| Size   | Hours                            | Description                                  |
| ------ | -------------------------------- | -------------------------------------------- |
| **XS** | 1-3 hours                        | Single small task, well-defined              |
| **S**  | 3-8 hours (half-day to full-day) | Single feature with edge cases               |
| **M**  | 1-3 days                         | Multiple connected features                  |
| **L**  | 3-7 days (full week)             | Major feature area                           |
| **XL** | 1-3 weeks                        | Cross-cutting concern (auth, sync, payments) |

**Buffer rule:** Always plan for 1.5× the estimate on first attempts. Solo founder learning curve, debugging, and "the unknown unknowns" eat time.

---

## Stage Gates

Before transitioning between stages, the following gates must be passed:

### Gate: Stage 1 → Stage 2

- [ ] Phase 1-13 complete with all acceptance criteria
- [ ] Petja nutzt das Fundament täglich (Onboarding abgeschlossen, Dashboard im Alltag geöffnet)
- [ ] Major bugs from real usage are fixed (not deferred)
- [ ] PowerSync conflict resolution tested in adversarial scenarios
- [ ] DSGVO checklist 100% complete
- [ ] Sentry/PostHog show < 0.5% error rate over 7 days
- [ ] Lighthouse Performance score ≥ 90 on Dashboard
- [ ] Decision made on final brand name and domain
- [ ] Anthropic DPA akzeptiert; SCC/DPIA-Strategie dokumentiert (EU-Region existiert Stand 06/2026 NICHT für die Direct API)
- [ ] Domain registered, DNS configured

### Gate: Mid-Stage-2 „Dogfooding-Gate" (nach Phase 19, vor Phase 21/22)

> **Neu (Audit 2026-06-10):** Das 30-Tage-Dogfooding-Gate lag fälschlich am Ende von Stage 1,
> wo Tasks/Habits/Focus/Rituale noch gar nicht existieren. Es gehört hierher: erst wenn die
> Core-Loops (Phasen 14–19) gebaut sind, kann echtes Dogfooding stattfinden — und erst NACH
> bestandenem Dogfooding wird Geld verlangt (Phase 22) und in App-Stores gelauncht (Phase 21).

- [ ] Petja has used Apex daily for 30+ consecutive days (Tasks, Habits, OBT, Focus, Rituals, Journal)
- [ ] Core loops feel right — Morning Ritual ≥80% der Tage abgeschlossen
- [ ] Bug-Log aus Dogfooding abgearbeitet (P0/P1 = 0)
- [ ] ~50% of Phase backlog refined based on real usage feedback

### Gate: Stage 2 → Stage 3

- [ ] Phase 14-23 complete
- [ ] iOS + Android apps live in App Stores
- [ ] Marketing Site live with legal compliance
- [ ] At least 50 paying customers
- [ ] Customer support flow established (basic ticketing)
- [ ] No P0/P1 bugs open for > 48 hours
- [ ] Mobile crash-free rate > 99%
- [ ] Stripe revenue reconciliation matches database state
- [ ] Backup + disaster recovery tested (restored from snapshot)
- [ ] First customer testimonial collected

---

## Stage 1: Alpha

**Total estimated effort:** 11-15 weeks of focused solo work

The Alpha is **the longest single stretch** of the project. Don't rush it — quality here determines the entire trajectory.

---

### Phase 01 — Foundation

- **Stage:** Alpha
- **Size:** L (5-7 days)
- **Goal:** Initialize the monorepo, create both apps (marketing + product), set up tooling, deploy hello world to Vercel.
- **Key outcomes:**
  - Monorepo with `apps/marketing` (Next.js 15) + `apps/product` (Expo SDK 55)
  - Turborepo + pnpm workspace
  - TypeScript strict, ESLint, Prettier, Lefthook configured
  - Vercel deployment working for both apps
  - Both apps render hello world locally + remotely
- **Dependencies:** SETUP.md complete (manual prep done)

---

### Phase 02 — Design Tokens & Theme System

- **Stage:** Alpha
- **Size:** M (2-3 days)
- **Goal:** Implement the design token system, theme provider, and accent system end-to-end.
- **Key outcomes:**
  - `packages/design-tokens` with full token export
  - Tailwind preset generated from tokens (used by both apps)
  - Theme provider for runtime switching (dark/light/system)
  - Accent picker setting persistence
  - All token tests passing (color contrast, etc.)
- **Dependencies:** Phase 01

---

### Phase 03 — Internationalization (i18n)

- **Stage:** Alpha
- **Size:** S (1 day)
- **Goal:** Set up next-intl (marketing) and i18n hook (product) with EN + DE message bundles.
- **Key outcomes:**
  - `packages/i18n` with EN + DE message JSONs
  - Marketing Site uses next-intl with locale routing
  - Product App uses i18n hook for translations
  - Locale persisted per user
  - Date/number/currency formatting via Intl API
- **Dependencies:** Phase 01

---

### Phase 04 — Foundation Components: Button, Input, Card

- **Stage:** Alpha
- **Size:** M (2-3 days)
- **Goal:** Implement the three most-used components per their specs.
- **Key outcomes:**
  - `<Button>` with all 7 variants per `button.md` spec
  - `<Input>` with all variants per `input.md` spec
  - `<Card>` with all variants per `card.md` spec
  - Storybook setup with stories for all variants × states
  - Components work on web + native (NativeWind v4.1)
- **Dependencies:** Phase 02

---

### Phase 05 — Foundation Components: Form Controls

- **Stage:** Alpha
- **Size:** M (2-3 days)
- **Goal:** Implement form-related components per their specs.
- **Key outcomes:**
  - `<Textarea>` per spec
  - `<Select>` per spec (custom dropdown, no native)
  - `<Checkbox>` per spec
  - `<Toggle>` per spec
  - `<Radio>` + `<RadioGroup>` per spec
  - `<Avatar>` per spec
  - `<Badge>` per spec
  - All Storybook stories
- **Dependencies:** Phase 04

---

### Phase 06 — Foundation Components: Feedback & Layout

- **Stage:** Alpha
- **Size:** M (2-3 days)
- **Goal:** Implement feedback and layout components per their specs.
- **Key outcomes:**
  - `<Modal>` / `<Sheet>` / `<Drawer>` per spec (cross-platform)
  - `<Toast>` + `<ToastProvider>` per spec (incl. XP variant)
  - `<Tooltip>` per spec
  - `<Progress>` (linear) + `<CircularProgress>` per spec
  - `<Skeleton>` + pre-built compositions per spec
  - All Storybook stories
- **Dependencies:** Phase 04

---

### Phase 07 — Marketing Site Foundation

- **Stage:** Alpha
- **Size:** M (2-3 days)
- **Goal:** Build the basic marketing site structure (we'll style it more in Stage 2).
- **Key outcomes:**
  - Landing page (`/`) with hero, features, CTA
  - Pricing page (`/pricing`)
  - Auth pages (`/sign-in`, `/sign-up`, `/reset-password`)
  - Imprint + Privacy Policy + Terms (German + English)
  - 404 page
  - Lighthouse Performance ≥ 95 on landing
  - Plausible Analytics integrated
- **Dependencies:** Phase 04, Phase 03

---

### Phase 08 — Supabase Setup + Auth

- **Stage:** Alpha
- **Size:** L (3-5 days)
- **Goal:** Set up Supabase project, auth flows, and JWT-based session management.
- **Key outcomes:**
  - Supabase Dev project (Frankfurt region)
  - Auth flow: sign up, sign in, reset password, magic link
  - Email templates customized (using Apex branding)
  - JWT session management with refresh
  - Auth pages in marketing site → product app handoff
  - Auth state in product app via Supabase client
  - RLS policies foundation (workspaces table, profiles table)
  - Edge Functions Hello World
- **Dependencies:** Phase 07

---

### Phase 09 — Database Schema + PowerSync Setup

- **Stage:** Alpha
- **Size:** XL (1-2 weeks)
- **Goal:** Complete the data model, set up PowerSync, sync between Postgres and SQLite.
- **Key outcomes:**
  - All tables from `data-model.md` created via migrations
  - All RLS policies defined and tested
  - PowerSync Service connected to Supabase
  - Sync rules YAML written + tested
  - Bucket isolation tested (User A cannot see Workspace B data)
  - PowerSync client SDK integrated in product app
  - Local SQLite DB created on app start
  - First sync cycle works (write on web, see on mobile)
  - Conflict resolution tested with offline scenarios
  - Database backups configured (daily, 7-day retention)
- **Dependencies:** Phase 08
- **Critical:** This phase has the highest risk. Plan extra buffer.

---

### Phase 10 — App Shell & Navigation (Product App)

- **Stage:** Alpha
- **Size:** M (2-3 days)
- **Goal:** Build the app shell — sidebar, topbar, page routing.
- **Key outcomes:**
  - Sidebar with navigation (Dashboard, Tasks, Habits, Goals, Vision, Journal, Knowledge, Settings)
  - Topbar with workspace switcher, notification bell, profile menu
  - Expo Router setup with proper layouts
  - Page transitions per `design-system.md` spec
  - Sidebar collapse on small screens
  - Empty page placeholders for each route
  - 404 catch-all
- **Dependencies:** Phase 09

---

### Phase 11 — Onboarding Flow

- **Stage:** Alpha
- **Size:** L (3-5 days)
- **Goal:** Identity-first onboarding flow.
- **Key outcomes:**
  - Welcome screen
  - Identity selection (who are you becoming? Solo Founder, Operator, etc.)
  - Workspace creation (Solo or Duo)
  - First Vision setup (with image upload optional, can skip)
  - First Goal (linked to Vision)
  - First Habit
  - First OBT (today's focus)
  - Onboarding-complete celebration
  - Skip options (return to onboarding later)
  - Onboarding state persisted (don't repeat for returning users)
- **Dependencies:** Phase 10

---

### Phase 12 — Dashboard

- **Stage:** Alpha
- **Size:** L (3-5 days)
- **Goal:** Build the dashboard — the home screen of the app.
- **Key outcomes:**
  - Dashboard layout: hero left (MomentumOrb + OBTHero), today's tasks, today's habits, journal prompt
  - `<MomentumOrb>` component implemented per spec
  - `<OBTHero>` component implemented per spec
  - Today's tasks widget (using TaskRow components — placeholder until Phase 14)
  - Today's habits widget (placeholder until Phase 15)
  - Greeting based on time of day (good morning, good afternoon, good evening)
  - Quick capture (Cmd+K opens command palette for fast task add)
  - Empty state for new users (post-onboarding)
- **Dependencies:** Phase 11

---

### Phase 13 — Stage 1 Polish + Deployment + Dogfooding

- **Stage:** Alpha
- **Size:** M (2-3 days)
- **Goal:** Deploy Apex Alpha, fix critical bugs, start dogfooding.
- **Key outcomes:**
  - Production Vercel deployment
  - Production Supabase project (separate from Dev)
  - Production PowerSync instance
  - Sentry production environment configured
  - Smoke test on production (auth, sync, basic flows)
  - Petja installs PWA on phone + laptop + desktop
  - Begin daily dogfooding (target: 30 consecutive days)
  - Bug log started (track issues encountered during use)
  - Decision: ready for Stage 2 or need more Stage 1 work
- **Dependencies:** Phase 12

**End of Stage 1.** Take a breath. Reflect. Update Roadmap based on real usage findings.

---

## Stage 2: Beta

**Total estimated effort:** 10-14 weeks

Stage 2 transforms Apex from "Petja's app" to "a real SaaS product." This is where the work intensifies — multiple distributions, real customers, real money.

---

### Phase 14 — Tasks (Full Implementation)

- **Stage:** Beta
- **Size:** L (3-5 days)
- **Goal:** Build complete task management with all the polish.
- **Key outcomes:**
  - `<TaskRow>` component implemented per spec (the most-clicked component)
  - Tasks page with all views (Today, This Week, All, Inbox, By Project)
  - Task creation, editing, deletion
  - Subtasks support
  - Recurring tasks
  - Task filtering and sorting
  - Drag-and-drop reordering
  - Swipe-to-action (mobile)
  - Long-press menu (mobile)
  - Optimistic UI everywhere
  - XP rewards on completion
- **Dependencies:** Phase 13 (Stage 2 transition)

---

### Phase 15 — Habits & Streaks

- **Stage:** Beta
- **Size:** L (3-5 days)
- **Goal:** Complete habit tracking with all 4 frequency types.
- **Key outcomes:**
  - `<HabitCard>` component implemented per spec
  - Habits page with all habits visible
  - Habit creation with 4 frequency types (daily, x_per_week, specific_days, weekly)
  - Identity statement editor
  - Streak calculation engine (pure function, fully tested)
  - Streak Shield mechanic (1 per month)
  - Heatmap component (90-day view)
  - Week grid component
  - Habit completion celebration
  - XP rewards
  - Pause / Archive flow
- **Dependencies:** Phase 14

---

### Phase 16 — Focus Mode (Pomodoro)

- **Stage:** Beta
- **Size:** L (3-5 days)
- **Goal:** Build the cinema-mode Focus Session experience.
- **Key outcomes:**
  - `<FocusTimer>` component implemented per spec
  - Focus Mode page (full-screen takeover)
  - Pomodoro logic (25/5, 50/10, 90/20, custom)
  - Ambient sound integration (using `expo-audio`)
  - Cinema mode entrance animation
  - Pause / Resume
  - End Session confirmation
  - Session history tracking
  - XP rewards
  - Focus → OBT linking (start session from OBT)
- **Dependencies:** Phase 15

---

### Phase 17 — XP / Levels / Momentum / Badges

- **Stage:** Beta
- **Size:** L (3-5 days)
- **Goal:** Complete the gamification system with proper engine.
- **Key outcomes:**
  - XP engine (pure functions, fully tested)
  - Momentum decay engine (drops over time without action)
  - Level calculation (XP thresholds per level)
  - Badge unlock conditions
  - 30+ predefined badges
  - Level-up overlay animation
  - Badge unlock animation
  - Streak Shield management UI
  - Settings: toggle XP visibility (show/hide gamification)
  - Achievement page (badges earned, in-progress)
- **Dependencies:** Phase 16

---

### Phase 18 — Vision & Goals

- **Stage:** Beta
- **Size:** L (3-5 days)
- **Goal:** Complete vision and goal management.
- **Key outcomes:**
  - `<VisionCard>` component implemented per spec
  - Vision page (1, 3, 5-year horizons + custom)
  - Vision creation with image upload
  - Conviction Score reassessment flow
  - Goals page
  - Goal creation linked to Vision
  - Key Results (OKR-style sub-goals)
  - Quarterly goal cycles
  - Vision → Goal → Project → Task hierarchy navigation
  - Vision achievement celebration
- **Dependencies:** Phase 17

---

### Phase 19 — Morning & Evening Rituals + Journal

- **Stage:** Beta
- **Size:** L (3-5 days)
- **Goal:** Build the daily ritual and reflection systems.
- **Key outcomes:**
  - Morning Ritual flow (full-screen, identity-first)
  - Evening Ritual flow
  - CEO Review (weekly, Sunday)
  - Journal page (long-form reflection)
  - Markdown support in journal
  - Auto-save with subtle "Saving…" indicator
  - Journal entry detail view
  - Search journal entries
  - Energy slider component (1-5 with haptic; data-model.md ist auf 1-5 angeglichen)
  - Mood logging
- **Dependencies:** Phase 18

---

### Phase 20 — Knowledge Library + Areas + Projects

- **Stage:** Beta
- **Size:** M (2-3 days)
- **Goal:** Implement supporting structures (Areas of Life, Projects, Knowledge entries).
- **Key outcomes:**
  - Areas page (life areas: Health, Family, Career, etc.)
  - Projects page with CRUD
  - Project detail view (linked tasks, goals, knowledge)
  - Knowledge Library (notes, references, attachments)
  - Tag system (custom colors per design system)
  - Search across all entities (tasks, habits, goals, knowledge)
- **Dependencies:** Phase 19

---

### Phase 21 — Mobile Native Apps (iOS + Android)

- **Stage:** Beta
- **Size:** L (3-5 days)
- **Goal:** Build, test, and submit iOS + Android apps to stores.
- **Key outcomes:**
  - EAS Build configuration (development, preview, production)
  - Apple Developer account setup ($99/year)
  - Google Play Developer account setup ($25 one-time)
  - App icons, splash screens, store listings (DE + EN)
  - Privacy Policy URL, Terms URL set in store metadata
  - Internal testing builds via EAS Submit
  - TestFlight (iOS) + Google Play Internal Testing
  - App Store Review submission
  - Push notifications via expo-notifications
  - Edge-to-edge layout (Android)
  - Liquid Glass treatment (iOS 26+)
  - First production builds approved
- **Dependencies:** Phase 20

---

### Phase 22 — Stripe Payments + Subscriptions

- **Stage:** Beta
- **Size:** XL (1-2 weeks)
- **Goal:** Live payments. The most complex phase — touch with care.
- **Key outcomes:**
  - Stripe live mode activated (with German tax ID)
  - Stripe Checkout integration
  - Stripe Customer Portal integration
  - Webhook handler (Edge Function) for subscription events
  - Subscription tiers (Free, Solo Pro €12, Duo Pro €29, AI Coach add-on €5)
  - Payment success → unlock features in product
  - Failed payment → grace period, then downgrade
  - Cancel flow with reason capture
  - Receipts & invoices via Stripe (German tax compliant)
  - Tax handling (USt for EU customers, reverse charge for B2B)
  - Subscription management UI in Settings
  - Webhook signature verification (security critical)
  - Idempotent payment processing
- **Dependencies:** Phase 21

---

### Phase 23 — Marketing Site Polish + Public Beta Launch

- **Stage:** Beta
- **Size:** L (3-5 days)
- **Goal:** Polish marketing site and launch publicly.
- **Key outcomes:**
  - Marketing site full polish (animations, content, screenshots)
  - Pricing page with tier comparison (Free / Solo Pro / Duo Pro)
  - Real product screenshots
  - About page / Manifesto page
  - Email capture (Resend Audiences)
  - Newsletter setup (welcome series)
  - SEO: meta tags, Open Graph, sitemap, structured data
  - Analytics events (signups, page views, conversion funnel)
  - ProductHunt launch preparation (assets, copy)
  - HackerNews "Show HN" preparation
  - X (Twitter) launch thread
  - Discord/Slack community for early customers
  - Public Beta announcement
- **Dependencies:** Phase 22

**End of Stage 2.** Apex is now a real product with paying customers.

---

## Stage 3: Launch+

**Total estimated effort:** 8-12 weeks

Stage 3 turns Beta into a sustainable business. AI Coach as the major differentiator, premium polish, public scaling.

---

### Phase 24 — AI Coach (The Major Differentiator)

- **Stage:** Launch+
- **Size:** XL (1-2 weeks)
- **Goal:** Ship the AI Coach as Apex's signature feature.
- **Key outcomes:**
  - AI Coach Edge Function (calls Anthropic API)
  - Context assembly (workspace data, goals, habits, recent journal)
  - Coach interaction UI (chat-like, but contextual)
  - Coaching prompts: morning ritual coach, goal review, OBT selection, weekly review
  - Soft limit enforcement (200 calls/month per ADR 0011)
  - Add-on subscription (+€5/mo for 500 more calls)
  - Coach personality (per Voice & Tone in design-system.md)
  - Cost monitoring + alerts (Anthropic API costs)
  - DSGVO-Drittlandtransfer für Anthropic geklärt: DPA + SCC + DPIA dokumentiert, Datenminimierung im Kontext-Assembly (EU-Region existiert für die Direct API nicht — Alternative: Bedrock/Vertex EU)
  - Coach session history
  - Privacy: coach interactions in private bucket, never shared in Duo
- **Dependencies:** Phase 23

---

### Phase 25 — Score Card (Yearly Reflection)

- **Stage:** Launch+
- **Size:** M (2-3 days)
- **Goal:** Annual / quarterly performance summary for users.
- **Key outcomes:**
  - Score Card page
  - Aggregated stats: tasks completed, habits maintained, focus hours, goals achieved
  - Visualizations (charts, heatmaps)
  - Year-end summary (Spotify Wrapped style for productivity)
  - Quarterly summaries
  - Shareable image (premium feature - generates PNG with stats)
  - Export to PDF
- **Dependencies:** Phase 24

---

### Phase 26 — The Letter (Yearly Time Capsule)

- **Stage:** Launch+
- **Size:** M (2-3 days)
- **Goal:** Annual letter to future self — a Tim Ferriss-inspired ritual.
- **Key outcomes:**
  - The Letter page
  - Annual prompt (around year-end or birthday)
  - Long-form letter writing experience
  - Past letters archive
  - Compare past letter to current state (one year later)
  - Email reminder for annual letter
  - Privacy: letters never shared in Duo, fully private
- **Dependencies:** Phase 25

---

### Phase 27 — Wisdom Library

- **Stage:** Launch+
- **Size:** S (1 day)
- **Goal:** Curated quotes, principles, books to inspire users.
- **Key outcomes:**
  - Wisdom Library section
  - Daily quote on Dashboard (rotates)
  - Curated by Petja (initial 100 quotes/principles)
  - User can save favorites
  - Source attribution (book, author)
  - Suggested reading list
- **Dependencies:** Phase 26

---

### Phase 28 — Calendar Integration (Read-Only)

- **Stage:** Launch+
- **Size:** L (3-5 days)
- **Goal:** Read calendar events to surface in dashboard (no write).
- **Key outcomes:**
  - Google Calendar OAuth integration (read-only)
  - Apple Calendar via CalDAV (read-only)
  - Microsoft Outlook (read-only)
  - Calendar events on Dashboard (today's events sidebar)
  - Calendar events linked to tasks (suggest: "your 2pm meeting — task ready?")
  - Privacy: Kalender-Events werden serverseitig in `calendar_events` gecacht und via PowerSync gesynct (siehe data-model.md) — Datenschutzerklärung muss das ausweisen (Art. 6 DSGVO Rechtsgrundlage, Löschkonzept, Google-AVV). _(Korrigiert: hier stand „device only, never sent to server" — das widersprach dem Datenmodell.)_
- **Dependencies:** Phase 27

---

### Phase 29 — Desktop App (Tauri)

- **Stage:** Launch+
- **Size:** L (5-10 days) _(korrigiert von M; macOS-Notarisierung, Windows-EV-Zertifikat-Beschaffung (5-10 Werktage Vorlauf!), Auto-Update-Signing und CI-Cross-Builds sind in 2-3 Tagen nicht machbar)_
- **Goal:** Wrap the Expo Web build in Tauri for desktop installation.
- **Key outcomes:**
  - Tauri 2.x project setup
  - Wraps `app.apex.[domain]` web build
  - Native menus (File, Edit, View, etc.)
  - Native notifications
  - Auto-update mechanism
  - macOS, Windows, Linux builds
  - Code signing (Apple Developer for macOS, EV cert for Windows)
  - Auto-launch on login (optional)
  - Distribution: download from marketing site
- **Dependencies:** Phase 28

---

### Phase 30 — Premium Polish: Custom Cursor + Mythic Mode

- **Stage:** Launch+
- **Size:** M (2-3 days)
- **Goal:** The premium touches that get screenshots and X mentions.
- **Key outcomes:**
  - Custom cursor on web (per design-system.md spec)
  - Toggle in Settings
  - Mythic mode for MomentumOrb (>2000 momentum)
  - Particle effects for high-momentum users
  - Achievement unlock animations (badges)
  - Theme picker enhancements (preview previews)
  - Final design polish pass on all pages
- **Dependencies:** Phase 29

---

### Phase 31 — Affiliate Program + Content Marketing

- **Stage:** Launch+
- **Size:** L (3-5 days)
- **Goal:** Establish affiliate program for content creators.
- **Key outcomes:**
  - Affiliate dashboard (signup, links, tracking)
  - 30% recurring commission for first 12 months
  - Stripe Connect for payouts
  - Marketing site has "Become an affiliate" page
  - Outreach to 10-20 productivity content creators (Tim Ferriss orbit, indie hackers, productivity YouTubers)
  - Founders' newsletter (monthly, going public)
  - Blog launched on marketing site (MDX-powered)
  - 3-5 quality blog posts at launch
- **Dependencies:** Phase 30

---

### Phase 32 — Public Launch Event

- **Stage:** Launch+
- **Size:** L (3-5 days, plus weeks of preparation)
- **Goal:** The big public moment — ProductHunt #1 attempt.
- **Key outcomes:**
  - ProductHunt launch (target: top 5 of the day, ideally #1)
  - HackerNews "Show HN: Apex — Life Operating System for Solo Founders"
  - X (Twitter) launch thread (Petja's account, 8-12 tweet thread)
  - Email blast to waitlist + customers
  - Indie Hackers post
  - Reddit (r/SaaS, r/getdisciplined)
  - Demo videos (3-5 short clips for X, TikTok)
  - Founder appearance on 1-2 podcasts (booking 4-6 weeks ahead)
  - Press kit (logos, screenshots, pitch)
  - Launch-day support readiness (extra Sentry monitoring, faster response)
  - Post-launch retrospective + iteration plan
- **Dependencies:** Phase 31

**End of Stage 3.** Apex is launched. The work continues — but now it's product growth, not product building.

---

## Total Effort Estimate

| Stage             | Phases        | Estimated Effort         | Calendar Time   |
| ----------------- | ------------- | ------------------------ | --------------- |
| Stage 1 (Alpha)   | 13 phases     | ~70 days of focused work | 11-15 weeks     |
| Stage 2 (Beta)    | 10 phases     | ~70 days                 | 10-14 weeks     |
| Stage 3 (Launch+) | 9 phases      | ~50 days                 | 8-12 weeks      |
| **Total**         | **32 phases** | **~190 days**            | **29-41 weeks** |

**Solo founder reality check:**

- Calendar time > effort time because: bugs, learning, life, illness, travel
- 30-41 weeks = 7-10 months from Phase 1 start to public launch
- Working 5 days/week, ~6 hours/day on Apex (with petjaklass.dev client work mixed in)
- This is a realistic, sustainable pace — not a hackathon sprint

**If you compress to ~6 hours/day, 7 days/week (not recommended): 5-6 months.**

**If life gets in the way (which it will): 10-14 months.**

---

## Risk-Adjusted Milestones

Working from realistic start date and adjusting for unknowns:

### Optimistic Path (ever