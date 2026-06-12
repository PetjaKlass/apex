# Calendar Integration Runbook (Phase 28 — read-only)

> The pure logic, sync Edge Function, cache, dashboard widget and settings UI are
> in the repo. **Activation needs OAuth provider setup (yours) + the connect flow
> (deferred), and isn't testable headless.** Read-only by design — Apex never
> writes to a calendar.

## Security model (already enforced)

- `calendar_events` sync is **owner-only** (`user_id = auth.user_id()`) — never
  shared with a Duo partner.
- `calendar_integrations` syncs **only non-secret columns**. `access_token` /
  `refresh_token` stay server-side; only the `calendar-sync` Edge Function reads
  them (service role). They are not in the client schema.

## 0. Provider setup (yours)

- **Google**: Google Cloud project → OAuth consent + credentials; scope
  `https://www.googleapis.com/auth/calendar.readonly`. Set redirect URLs per env.
- **Microsoft**: Azure AD app registration; delegated scope `Calendars.Read`.
- **Apple**: CalDAV with an **app-specific password** (not the Apple ID password).

## 1. Secrets + deploy the sync function

```bash
supabase secrets set \
  GOOGLE_CLIENT_ID=... GOOGLE_CLIENT_SECRET=... \
  MS_CLIENT_ID=... MS_CLIENT_SECRET=...
supabase functions deploy calendar-sync
```

The function refreshes Google/Microsoft tokens, fetches a ±30-day window,
normalizes, and replaces the user's cached `calendar_events`. **Apple/CalDAV is a
documented stub** — wire it with a CalDAV client (e.g. `tsdav`) + an ICS parser.

## 2. The connect flow (deferred)

Build the OAuth connect with `expo-auth-session` (web + native differ):
store the resulting `access_token` / `refresh_token` / `expires_at` into
`calendar_integrations` (provider, `sync_direction = 'read_only'`) via a
server-side callback (so secrets are written by the service role, not the client).
The Settings → Calendars screen already shows connected status + disconnect; the
"Connect" button currently shows a "coming soon" toast until this is wired.

## 3. Polling

Trigger `calendar-sync` from the app every ~15 min while foregrounded (and on
open). Don't poll in the background. The Settings "Sync now" button calls it.

## Deferred (documented)

- OAuth connect flow + `expo-auth-session` dependency.
- Apple CalDAV fetch (client lib + ICS/RRULE expansion).
- Recurrence (RRULE) expansion; precise per-event timezone handling.
- Real-account testing for all three providers + token-refresh edge cases.
