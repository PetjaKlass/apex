# Phase 03 — Internationalization (i18n)

> **Stage:** Alpha
> **Size:** S (1 day, ~6-8 hours)
> **Status:** Ready to execute
> **Dependencies:** Phase 02 complete

## Goal

Set up `next-intl` (Marketing) and a simple i18n hook (Product App) with EN + DE message bundles. Locale detection, persistence, and Intl API integration for dates/numbers/currency.

## Why Now

Same logic as design tokens: text infrastructure must exist before components consume strings. Otherwise every component gets retrofitted later.

## Prerequisites

- Phase 02 complete (theme system working)
- Both apps render with theme toggle

## Scope

1. `packages/i18n` shared package with EN + DE message JSONs
2. Marketing Site: `next-intl` integration, locale routing (`/de/*`, `/en/*`)
3. Product App: lightweight i18n hook (no full library — overkill)
4. Locale persistence per user (mmkv on Product, cookie on Marketing)
5. Intl API helpers (date, number, currency formatters)
6. Test page showing translated strings + formatted dates/numbers

## Out of Scope

- Translation UI for users to switch language (Phase 11 settings)
- Auto-detect language from IP (no — respect Accept-Language header instead)
- More than 2 languages (later)
- ICU plural rules complex (basic plural support only for now)

## Acceptance Criteria

- [ ] `packages/i18n/messages/en.json` exists with sample strings
- [ ] `packages/i18n/messages/de.json` exists, parallel structure
- [ ] Marketing Site: routes `/de` and `/en` work (default `/` → detect from header)
- [ ] Marketing Site: `useTranslations()` hook returns correct strings
- [ ] Marketing Site: hreflang tags in HTML head for SEO
- [ ] Product App: `useT()` hook works in any component
- [ ] Product App: locale switches via ThemeProvider sibling (LocaleProvider)
- [ ] Date formatting: "Mar 15" (EN) / "15. März" (DE) via Intl
- [ ] Number formatting: "1,234.56" (EN) / "1.234,56" (DE)
- [ ] Currency: "$12.00" (EN) / "12,00 €" (DE)
- [ ] Plurals work: 0/1/many tasks
- [ ] Special characters: ä ö ü ß work in both apps
- [ ] `pnpm typecheck` passes
- [ ] `pnpm lint` passes

## Implementation Plan

1. **packages/i18n setup** (~30 min) — create package, message JSON structure
2. **Sample messages** (~30 min) — en.json + de.json with ~20 sample keys (greetings, errors, common)
3. **Marketing next-intl** (~2 hours) — install, configure middleware, routing, `useTranslations`
4. **Product i18n hook** (~1 hour) — minimal `useT` reading from imported JSON, switching via context
5. **Intl helpers** (~1 hour) — `formatDate`, `formatNumber`, `formatCurrency` in `packages/i18n/format.ts`
6. **Locale persistence** (~30 min) — mmkv on product, next-intl handles marketing automatically
7. **Test page** (~1 hour) — show all translated strings + formatted values
8. **Hreflang + SEO** (~30 min) — Marketing layout adds `<link rel="alternate" hreflang>`
9. **Typecheck, lint, commit** (~30 min)

## Files Created/Modified

**Created:**

- `packages/i18n/package.json`
- `packages/i18n/src/index.ts`
- `packages/i18n/src/format.ts`
- `packages/i18n/messages/en.json`
- `packages/i18n/messages/de.json`
- `packages/i18n/tsconfig.json`
- `apps/marketing/i18n.ts` (next-intl config)
- `apps/marketing/middleware.ts` (locale routing)
- `apps/marketing/app/[locale]/layout.tsx` (locale-aware layout)
- `apps/marketing/app/_test/i18n/page.tsx`
- `apps/product/lib/i18n/LocaleProvider.tsx`
- `apps/product/lib/i18n/useT.ts`
- `apps/product/app/_test/i18n.tsx`

**Modified:**

- `apps/marketing/app/layout.tsx` (handoff to locale layout)
- `apps/product/app/_layout.tsx` (wrap in LocaleProvider)

## Common Pitfalls

**1. next-intl App Router setup confusion** — read https://next-intl-docs.vercel.app/docs/getting-started/app-router carefully. Multiple config files needed.

**2. Middleware locale detection** — default to user's `Accept-Language`, fall back to `en`. Never force a locale.

**3. Server vs client components** — `useTranslations` works in both. For server, use `getTranslations()` instead.

**4. Missing translations** — TypeScript should error if a key exists in EN but not DE. Configure `next-intl` for type-safe messages.

**5. Date formatting timezone** — `formatDate()` should respect user timezone. Default to system, allow override later (Phase 09 has user_settings).

**6. JSON imports in Expo** — verify metro config allows JSON imports (default does).

## Done When

- Test pages show translated content correctly in both languages
- Locale switching works without reload (Product App)
- URL-based locale switching works (Marketing Site)
- All Acceptance Criteria checked
- Commit: `feat(i18n): add EN + DE message bundles and locale routing`
- Petja verifies German strings read naturally (he's native speaker)

---

**Next:** `phase-04-foundation-components-1.md`
