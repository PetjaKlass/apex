# Mobile Release Runbook (Phase 21)

> Everything in this file is **manual / ops** — it needs paid accounts and
> interactive logins that can't run headless. The code + config side of Phase 21
> (eas.json, app.json, push scaffold, store listing) is already in the repo.
> Run these commands yourself from `apps/product/` (use `! <cmd>` in the session
> if you want the output captured here).

## 0. One-time accounts (paid)

- Apple Developer Program — $99/year → https://developer.apple.com
- Google Play Developer — $25 once → https://play.google.com/console
- Expo / EAS account (free; paid tier later for build concurrency)

## 1. Link the project to EAS

```bash
cd apps/product
eas login
eas init           # creates the real EAS projectId
```

Then replace the placeholder in `app.json` → `expo.extra.eas.projectId`
(`00000000-…`) with the real id `eas init` prints. The push token registration
(`lib/notifications/register.ts`) reads this id.

## 2. Real brand assets (replace the Expo defaults)

The config points at existing files; swap the art before store builds:

- `assets/icon.png` — 1024×1024, no transparency, no rounded corners
- `assets/android-icon-foreground.png` / `-background.png` / `-monochrome.png`
- `assets/splash-icon.png` — centered mark on `#080706`

## 3. Internal builds

```bash
eas build --profile development --platform ios      # dev client (simulator ok)
eas build --profile preview --platform android      # installable APK
eas build --profile preview --platform ios          # internal device build
```

Install on your physical iPhone + Pixel. Smoke-test 24h, no crashes.

## 4. Push notifications (needs a real build — no-op on web/simulator)

- Code is wired: handler in `lib/notifications/setup.ts` (called from
  `app/_layout.tsx`), permission + token in `lib/notifications/register.ts`,
  triggered by the **Push notifications** toggle in Settings (native only).
- iOS: enable the Push Notifications capability + APNs key (`.p8`) in EAS creds.
- Test with the Expo push tool: https://expo.dev/notifications
- **Deferred:** server-side token storage (no push-tokens table yet) — add a
  `profiles.push_token` column or `device_tokens` table when the backend should
  send pushes.

## 5. Store presence

- Listing copy + keywords + screenshots: see `store-listing.md`.
- Create a **demo reviewer account**, pre-seed sample data, add credentials to
  App Review notes (Apple rejects without it).
- iOS Privacy Nutrition Labels: email + product analytics (PostHog/EU) + error
  logs (Sentry/EU); no cross-app tracking, no ads.

## 6. Payments policy nuance (important)

Apex sells SaaS subscriptions billed on the **web** (Stripe, Phase 22). The app
ships **no in-app purchase**. This is the standard "reader/external" approach but
both stores may push back:

- Don't link directly to the web checkout from inside iOS purchase flows.
- Keep the app fully usable for free-tier / already-subscribed users.
- Be ready to cite the external-purchase entitlement if asked.

## 7. Submit

```bash
eas build --profile production --platform all
# fill eas.json → submit.production.ios (appleId / ascAppId / appleTeamId)
# place play-service-account.json in apps/product/ (gitignored)
eas submit --profile production --platform ios
eas submit --profile production --platform android
```

TestFlight (iOS) + Play Internal Testing first, then promote to review.
Review takes ~1–7 days each; iterate on rejections.

## 8. Done

- Both apps approved + live; installable from the stores on your devices.
- Tag the release: `git tag v0.2.0-beta-mobile`.
