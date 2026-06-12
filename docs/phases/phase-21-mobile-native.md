# Phase 21 — Mobile Native Apps (iOS + Android)

> **Stage:** Beta
> **Size:** L (3-5 days plus 1-2 weeks App Store review)
> **Status:** Ready to execute (EXPAND BEFORE STARTING)
> **Dependencies:** Phase 20 complete

⚠️ **EXPAND BEFORE STARTING:** Mobile submission process changes frequently. Review latest Apple App Store + Google Play guidelines before proceeding.

## Goal

Build, test, and submit iOS + Android apps to App Store and Play Store. Achieve approved listings. First production builds available for download.

## Why Now

Stage 1 was Web/PWA only. Stage 2 ships native. Mobile is where 60%+ of users will live. App Store presence = legitimacy + discoverability.

## Prerequisites

- Phase 20 complete
- Apple Developer account ($99/year, paid)
- Google Play Developer account ($25 one-time, paid)
- EAS Build account (free, $19/mo for production builds eventually)
- Privacy Policy URL public (Phase 07 should have it)
- Terms URL public

## Scope

1. EAS Build configuration (development, preview, production profiles)
2. App icons (multiple sizes, including iOS adaptive)
3. Splash screens (iOS + Android)
4. Store listings (DE + EN): description, screenshots, keywords
5. Internal testing builds via EAS Submit
6. TestFlight (iOS) configuration
7. Google Play Internal Testing
8. App Store Review submission
9. Push notifications via expo-notifications
10. Edge-to-edge layout (Android)
11. Liquid Glass treatment (iOS 26+)
12. Production builds approved and live

## Out of Scope

- Marketing site mobile downloads page (Phase 23)
- Stripe in-app purchases (use external payments per Apple/Google policy for SaaS subscriptions)
- Real-world full-store launch (Phase 23 launch event)

## Acceptance Criteria

### Build configuration

- [ ] `eas.json` configured for development/preview/production
- [ ] iOS bundle identifier: `dev.petjaklass.apex`
- [ ] Android package: `dev.petjaklass.apex`
- [ ] App version + build number incrementing properly

### Visual assets

- [ ] App icons all sizes (iOS: 1024×1024, Android: adaptive)
- [ ] Splash screens (iOS multiple sizes, Android with edge-to-edge)
- [ ] Store screenshots: 5-7 per platform, branded, in EN + DE

### Store listings

- [ ] App name: "Apex" (or final brand)
- [ ] Subtitle / Short description
- [ ] Full description in EN + DE
- [ ] Keywords (iOS) / Tags (Android)
- [ ] Privacy Policy URL set
- [ ] Support URL set
- [ ] Age rating: 4+ (iOS) / Everyone (Android)

### Testing

- [ ] Internal build via EAS works on physical iPhone
- [ ] Internal build via EAS works on physical Android
- [ ] TestFlight invite sent to Petja's Apple ID
- [ ] Google Play Internal Testing track works
- [ ] No crashes in 24h test usage

### Native features

- [ ] Push notifications configured (request permission, register token)
- [ ] Edge-to-edge on Android (statusbar transparent, content extends)
- [ ] iOS 26 Liquid Glass: tested on iOS 26 device or simulator
- [ ] Haptics work correctly
- [ ] Safe area insets correct on all device shapes

### Submission

- [ ] iOS submission to App Review
- [ ] Android submission to Play Review
- [ ] Both apps approved (may take 1-7 days each)
- [ ] Production builds live in stores

## Implementation Plan

1. **EAS configuration** (~2 hours) — eas.json, build profiles
2. **App icons** (~2 hours) — design or hire designer for proper icons (or use Petja's brand)
3. **Splash screens** (~1 hour) — branded, theme-aware
4. **Store screenshots** (~3 hours) — capture from real device + add captions
5. **Store metadata** (~2 hours) — descriptions, keywords, all in EN + DE
6. **Internal build iOS** (~3 hours) — eas build, troubleshoot any issues
7. **Internal build Android** (~3 hours)
8. **Push notifications** (~3 hours) — expo-notifications, permission flow, token storage
9. **Edge-to-edge Android** (~1 hour) — already enabled in app.json, verify
10. **Liquid Glass iOS 26** (~2 hours) — test on simulator
11. **TestFlight setup** (~2 hours)
12. **Play Console setup** (~2 hours)
13. **Submit + iterate on rejections** (~variable, 1-7 days each)
14. **Tests + commit** (~2 hours)

## Files Created/Modified

**Created:**

- `apps/product/eas.json`
- `apps/product/assets/icons/` (multiple sizes)
- `apps/product/assets/splash/`
- `apps/product/lib/notifications/setup.ts`
- `apps/product/lib/notifications/register.ts`

**Modified:**

- `apps/product/app.json` (full native config)
- `apps/product/app/_layout.tsx` (notifications setup)

## Common Pitfalls

**1. App Store rejection reasons** — pricing transparency, privacy disclosure, missing demo account. Document everything.

**2. Apple's IAP rule** — for digital subscriptions, Apple wants their 15-30% cut. Apex sells SaaS subscriptions, this is a gray area. Strategy: use external Stripe payments (web), don't offer in-app purchase. Apple may still push back.

**3. Google Play similar issue** — Google Play Billing required for digital goods. Same workaround.

**4. Push notifications consent** — request at the right moment (not on first launch). After user creates first habit reminder, e.g.

**5. Edge-to-edge Android** — content under transparent status bar can be misread. Use SafeAreaView properly.

**6. iOS 26 testing** — needs actual iOS 26 device or Xcode 16+ simulator. Defer Liquid Glass if not available.

**7. EAS Build queue** — free tier has wait times. Production builds may queue 30-60 min.

**8. Store reviewer accounts** — Apple needs demo credentials. Create dedicated test account.

**9. Localization compliance** — German content for German store listings. Apple checks.

**10. Privacy Nutrition Labels (iOS)** — declare ALL data collected. Be precise.

## Done When

- Both apps approved and live in respective stores
- TestFlight + Play Internal Testing functional for ongoing iteration
- Push notifications work end-to-end
- Petja can install apps on his physical devices via stores
- Commit + tag: `feat(mobile): iOS + Android native apps live` + `git tag v0.2.0-beta-mobile`

---

**Next:** `phase-22-stripe-payments.md` (the most complex Stage 2 phase)
