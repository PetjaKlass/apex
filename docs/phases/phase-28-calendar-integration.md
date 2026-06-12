# Phase 28 — Calendar Integration (Read-Only)

> **Stage:** Launch+
> **Size:** L (3-5 days, ~24-32 hours)
> **Status:** Ready to execute
> **Dependencies:** Phase 27 complete

## Goal

Read calendar events from Google, Apple, and Microsoft calendars. Surface them on Dashboard. Link calendar events to tasks. Privacy-first: no write access, calendar data stays on user's device when possible.

## Why Now

User feedback consistently shows calendar integration as #1 requested feature. Phase 28 is when we have the user base to justify the engineering investment.

## Prerequisites

- Phase 27 complete
- Google Cloud project for OAuth
- Apple Developer access for CalDAV (already have for Phase 21)

## Scope

1. Google Calendar OAuth integration (read-only)
2. Apple Calendar via CalDAV (read-only)
3. Microsoft Outlook (read-only)
4. Calendar events on Dashboard (today's events sidebar)
5. Calendar events linked to tasks (suggest "your 2pm meeting — task ready?")
6. Privacy: calendar data primarily on device, server only stores events linked to tasks

## Out of Scope

- Write access to calendars (NO — keeps integration simple + reduces risk)
- Calendar event creation in Apex (NO — Apex tasks ≠ calendar events philosophically)
- Real-time push from calendars (poll every 15 min instead)

## Acceptance Criteria

- [ ] Google Calendar OAuth flow works
- [ ] Apple CalDAV connection works (with app-specific password)
- [ ] Microsoft OAuth works
- [ ] Connected calendars listed in Settings
- [ ] Today's events on Dashboard sidebar (chronological, max 10)
- [ ] Event detail: time, title, location, attendees
- [ ] Suggest task from event (e.g., "Prep for 2pm meeting")
- [ ] Disconnect calendar in Settings
- [ ] Privacy disclosure: what data is read, where stored
- [ ] Polling every 15 min when active, stops when app backgrounded
- [ ] Offline: cached events visible, sync when back
- [ ] Read-only enforced (no write API calls ever)
- [ ] All providers tested with real accounts

## Implementation Plan

1. **Google OAuth setup** (~3 hours) — Google Cloud project, OAuth credentials, redirect URLs
2. **Microsoft OAuth setup** (~2 hours) — Azure AD app registration
3. **Apple CalDAV** (~3 hours) — CalDAV client library, app-specific password flow
4. **Calendar sync Edge Function** (~5 hours) — fetches events per provider, normalizes
5. **calendar_events table** (~1 hour) — cache layer
6. **Settings: connect/disconnect calendars** (~3 hours)
7. **Dashboard sidebar widget** (~3 hours) — today's events
8. **Event → task suggestion** (~3 hours) — NLP-light heuristics
9. **Privacy disclosures** (~1 hour) — Settings + Privacy Policy
10. **Polling logic** (~2 hours) — every 15 min when active, foreground/background aware
11. **Tests with real accounts** (~3 hours)
12. **Commit** (~1 hour)

## Files Created/Modified

**Created:**

- `supabase/functions/calendar-sync/index.ts`
- `supabase/migrations/0060_calendar_integration.sql`
- `apps/product/app/(app)/settings/calendars.tsx`
- `apps/product/components/calendar/CalendarConnectButton.tsx`
- `apps/product/components/calendar/TodayEventsWidget.tsx`
- `apps/product/components/calendar/EventToTaskSuggestion.tsx`
- `apps/product/lib/calendar/google.ts`
- `apps/product/lib/calendar/microsoft.ts`
- `apps/product/lib/calendar/apple-caldav.ts`
- `apps/product/lib/calendar/normalizer.ts`

## Common Pitfalls

**1. OAuth redirect URLs** — must match exactly what's registered. Different per env (dev/prod).

**2. CalDAV is old protocol** — XML-heavy, finicky. Use library (e.g., `tsdav` for Node).

**3. Event recurrence rules** — RRULE format complex. Use library to expand.

**4. Time zones** — calendar events have explicit timezones. Don't assume user's.

**5. Privacy expectations** — be SUPER clear what data Apex sees. Privacy policy update mandatory.

**6. Token refresh** — OAuth tokens expire. Refresh handler needed.

**7. Mobile OAuth** — different flow than web. Use expo-auth-session.

**8. Calendar data volume** — busy users have hundreds of events. Limit to 30 days back/forward.

**9. Apple CalDAV authentication** — requires app-specific password (not Apple ID password). Document for users.

## Done When

- Petja connects all 3 calendar types
- Today's events show correctly on Dashboard
- Event-to-task suggestion works
- Privacy disclosures clear
- Commit: `feat(calendar): read-only google/apple/microsoft integration`

---

**Next:** `phase-29-desktop-tauri.md`
