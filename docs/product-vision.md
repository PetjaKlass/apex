# Apex — Product Vision & Positioning

> Internal codename: **Apex**. Final brand name to be decided at end of Stage 1.
> All references to "Apex" are temporary; product is rename-safe.

---

## What Apex Is

**Apex is the Life Operating System for Solo Founders and Duos who turn vision into reality.**

It is one app that holds the four things that matter to a person building a meaningful life:

1. **Vision** — the future self you are becoming, written down, revisited, evolved
2. **Goals** — the OKRs that translate vision into 90-day commitments
3. **Execution** — the daily tasks, habits, focus sessions that actually move the needle
4. **Reflection** — the weekly review and identity tracking that compounds learning

Apex is opinionated. It does not let users build their own system from scratch. It enforces a proven flow: Vision → Conviction → Goals → Projects → Tasks → Habits → Focus → Daily Ritual → Weekly Review → Score Card.

The user does not configure Apex. Apex configures the user.

## What Apex Is NOT

This list is as important as the one above. Every "no" protects the focus.

- **Not a Notion replacement.** No databases, no infinite blocks, no wiki. If the user wants free-form, they use Notion alongside.
- **Not a team project management tool.** No 5-person workspaces, no Gantt charts, no resource management. Apex is for 1 or 2 people. Above that, use Linear.
- **Not a family organizer.** No grocery lists, no chores for kids, no school schedules. Apex is for adults building their best life.
- **Not a student app.** No class schedules, no exam trackers, no study groups. Apex is for working professionals and founders.
- **Not a generic to-do list.** Apex requires identity, vision, and conviction. If the user just wants to remember groceries, Apple Reminders is faster.
- **Not a habit tracker like Habitica or Streaks.** Apex includes habits but treats them as identity expressions, not gamified tasks.
- **Not a journaling app like Day One.** Apex includes journaling but it is one tool inside a larger system.
- **Not a meditation app.** No guided meditations. Calm and Headspace exist.
- **Not free forever.** Apex is premium. Free tier is a trial, not a permanent home.

When users ask "Can Apex do X?" and X is not in the four pillars above, the answer is **No, and that is the point.**

## Personas — Two, Not Four

### Primary: Solo Operator

**Who:** Founder, freelancer, indie creator, professional with output-driven role.
**Age:** 26–45.
**Pain:** Has too many tools, none of them connect Vision to Daily Action. Drowns in tasks without compounding identity.
**Trigger to buy:** Read Atomic Habits, Deep Work, or 4-Hour Workweek. Watched a Tim Ferriss / Ali Abdaal / Andrew Huberman video. Just had a bad quarter and wants to "get serious."
**Lifetime Value:** €12/mo × 18 months = €216. With 30% upgrade to annual (€99/yr): ~€250.
**Acquisition channel:** X / Twitter, ProductHunt, Reddit r/productivity, founder Discords, YouTube reviewers.

### Secondary: Duo

**Who:** Co-founder pair, romantic partners with shared life vision, accountability partners.
**Age:** 24–40.
**Pain:** Cannot align on goals as a pair. Notion is too flexible (devolves to chaos), Todoist is too transactional (no shared vision layer).
**Trigger to buy:** Started a company together; got engaged; read 12 Week Year together; doing a 75 Hard challenge together.
**Lifetime Value:** €29/mo × 24 months = €696. Higher retention because mutual accountability prevents churn.
**Acquisition channel:** Solo users invite their partner. Indie Hacker / Co-founder communities. "Couples build wealth together" finance content.

### Explicitly Excluded Personas

- **Families with kids** → built differently (Cozi, OurHome). Different jobs-to-be-done.
- **Students** → built differently (Notion, MyStudyLife). Lower willingness-to-pay.
- **Teams 3+** → built differently (Linear, Asana, Monday). Different org/permission model.
- **Enterprise** → built differently (Atlassian, ClickUp). Different security/compliance model.

## Competitive Positioning

**Where Apex sits in the market:**

| Tool     | What it does well      | Why it fails our persona                           |
| -------- | ---------------------- | -------------------------------------------------- |
| Notion   | Flexibility, templates | No opinion. User builds the system. 80% give up.   |
| Todoist  | Fast task capture      | Tasks have no parent. No vision layer.             |
| Sunsama  | Daily planning         | Calendar-first. No identity, no goals, no quarter. |
| Things 3 | Beautiful UX           | Tasks only. No habits, no journal, no review.      |
| Habitica | Gamified habits        | Childish aesthetic. No goals, no tasks.            |
| Linear   | Team velocity          | For 5+ teams. Solo-hostile.                        |
| Reflect  | Notes + AI             | Notes-first, not action-first.                     |
| Day One  | Journaling             | Reflection only. No execution layer.               |

**Apex's position:** _"For Solo Operators and Duos who refuse to assemble their own system from 8 apps."_

The competition Apex must beat is not Notion. It is **the user's belief that they need 8 apps.** The pitch: _one premium app, opinionated end-to-end, replaces Notion + Todoist + Habitica + Day One + Sunsama._

## The Emotional Core (Why People Pay)

People do not pay for features. They pay for **identity transformation**.

Apex sells:

1. **The feeling of being someone who has it together.** Premium aesthetic, calm interface, ritual-based daily flow.
2. **The compound trajectory.** Score Card showing 30/90/365 day progress. Visual proof that life is bending in the right direction.
3. **The conviction.** Not "you completed 47 tasks" but "you are 38 days closer to becoming the founder you said you would become."
4. **Deep Work as a state.** Not a Pomodoro timer. A ritual that signals "now I am operating at the top of my capacity."

The marketing copy never says "productivity." It says **"build the life you said you would."**

## Pricing Strategy (Working Hypothesis)

| Tier     | Price             | Workspaces         | Limits                                                         | Target                |
| -------- | ----------------- | ------------------ | -------------------------------------------------------------- | --------------------- |
| Free     | €0                | 1 personal         | 3 goals, 5 habits, 1 vision, no AI Coach, no Score Card export | Trial / curious users |
| Solo Pro | €12/mo or €99/yr  | 1 personal         | Unlimited, AI Coach included, all exports                      | Primary persona       |
| Duo Pro  | €29/mo or €249/yr | 1 personal + 1 duo | 2 user seats in duo workspace, shared vision/goals/tasks       | Secondary persona     |

**Annual ≈ 30% off** (Solo: €99 vs. €144 = 31% / Duo: €249 vs. €348 = 28%).
**These prices are canonical.** `billing-setup.md` and `phase-22` must match this table — any change here requires updating both.
**Lifetime Deal at Beta launch:** €199 one-time for Solo Pro. Capped at first 100 users. Generates upfront cash and creates evangelists.

**No team/enterprise tier in Stage 1 or Stage 2.** That is a Stage 3 question with very different mechanics.

## Distribution Strategy

| Channel                       | Stage   | Priority                           |
| ----------------------------- | ------- | ---------------------------------- |
| Web app at apex-domain        | Stage 1 | Primary — lowest friction signup   |
| PWA (installable from web)    | Stage 1 | Free, auto-included with web       |
| iOS App Store (Expo / EAS)    | Stage 2 | Discovery, mobile users            |
| Android Play Store (Expo/EAS) | Stage 2 | Discovery, Android users           |
| Tauri Desktop (Win/Mac/Linux) | Stage 3 | Pro-tier perk, "native experience" (Phase 29) |

**Single codebase across all five distributions.** Expo (React Native) universal app — Web, iOS, Android from one codebase, plus a Tauri wrapper for desktop. See ADR 0001 (Capacitor was evaluated and rejected; this section previously contained the outdated Capacitor plan).

## Languages

**Bilingual from launch: English + German.**

- English is the primary marketing and acquisition language (90% of TAM).
- German is the founder's native language and a strong secondary market for premium tools.
- All UI copy, marketing, legal, emails: both languages.
- AI Coach prompts and outputs: respect user's chosen language.

## North Star Metric

**Active Daily Reflectors (ADR):** Users who completed Morning OR Evening Ritual on a given day.

Why not DAU? Because just opening the app doesn't mean Apex worked. A reflection completed = the user actually engaged with their life that day. This is the metric that correlates with retention.

**Stage 1 Success Threshold:** Founder uses Apex 30 consecutive days, completing morning ritual ≥80% of days.
**Stage 2 Success Threshold:** 100 paid users with 30-day ADR ≥40%.
**Stage 3 Success Threshold:** 1,000 paid users, monthly churn <5%.

## Anti-Patterns (Do NOT Build These)

These are common Productivity-app features that would dilute Apex. Reject them in design reviews:

- **Templates marketplace.** Users browsing templates means they don't trust the system. Apex has 1 system, not 100.
- **Customizable views, custom fields.** Notion's path to bloat. Apex has fixed schemas.
- **Embedded chat / messaging.** Slack exists.
- **File storage / wiki.** Notion exists.
- **Calendar provider replacement.** Sync to Google/Apple/Outlook, do not replace them.
- **Time tracking for billing.** Toggl exists. Focus tracking ≠ billable hours.
- **Public profiles, social feed, leaderboards across users.** Apex is intimate. Score Cards are shared 1-on-1, not public.
- **Free-form note-taking.** Journal is structured. Knowledge is structured. No empty canvas.

## Versioning 