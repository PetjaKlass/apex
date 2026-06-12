# Phase 07 — Marketing Site Foundation

> **Stage:** Alpha
> **Size:** M (2-3 days, ~16-20 hours)
> **Status:** Ready to execute
> **Dependencies:** Phase 06 complete

## Goal

Build the basic Marketing Site structure — landing, pricing, auth pages, legal compliance pages. Visual styling stays minimal (we'll polish in Phase 23 before public launch).

## Why Now

Auth pages (Phase 08) need to live somewhere — Marketing Site. Legal pages (Imprint, Privacy) are required for any public site under German law. Build the shell now, polish later.

## Prerequisites

- Phases 01-06 complete
- All 15 foundation components available

## Scope

Pages:

1. `/` — Landing page (minimalist, hero + features + CTA)
2. `/pricing` — Tier comparison (Free / Solo Pro €12 / Duo Pro €29)
3. `/sign-in` — Auth page (functional in Phase 08)
4. `/sign-up` — Auth page (functional in Phase 08)
5. `/reset-password` — Auth page (functional in Phase 08)
6. `/imprint` — TMG-compliant Impressum (Petja's data)
7. `/privacy` — Datenschutzerklärung (DE) + Privacy Policy (EN)
8. `/terms` — AGB (DE) + Terms of Service (EN)
9. `/404` — not found page
10. Plausible Analytics integration
11. Lighthouse Performance ≥ 95 on landing
12. SEO basics: meta tags, OpenGraph, sitemap

## Out of Scope

- Real auth logic (Phase 08)
- Marketing copy polished (Phase 23)
- Real screenshots / visuals (Phase 23)
- Blog (Phase 23)
- Newsletter integration with Resend (Phase 23)
- Stripe Checkout (Phase 22)

## Acceptance Criteria

- [ ] All 9 pages render correctly in EN + DE
- [ ] Landing page: hero, 3-4 feature blocks, CTA — uses foundation components
- [ ] Pricing page: 3 tier cards side-by-side (responsive: stacks on mobile)
- [ ] Auth pages: form layouts ready (button to submit, no real submit yet)
- [ ] Imprint: TMG-compliant per German law (Petja's name, address, etc.)
- [ ] Privacy: DSGVO-compliant draft (use e-recht24 generator OR paste existing)
- [ ] Terms: minimum viable AGB
- [ ] 404 page friendly + on-brand
- [ ] Plausible script loaded (verify in Network tab)
- [ ] Lighthouse Performance ≥ 95 (mobile)
- [ ] Lighthouse SEO ≥ 95
- [ ] Lighthouse Accessibility ≥ 95
- [ ] All meta tags present (title, description, og:image)
- [ ] Sitemap.xml generated
- [ ] hreflang tags correct
- [ ] No layout shifts (CLS < 0.05)
- [ ] All visible strings via next-intl (no hardcoded text)
- [ ] `pnpm typecheck` + `pnpm lint` pass
- [ ] `pnpm build` succeeds

## Implementation Plan

1. **Landing page** (~3 hours) — minimal but on-brand. Hero + 3 features + CTA. Use Card components.
2. **Pricing page** (~2 hours) — 3 Cards side-by-side, comparison table below
3. **Auth pages** (~2 hours) — sign-in, sign-up, reset-password layouts (form skeletons, no logic)
4. **Imprint page** (~1 hour) — fill in Petja's info per TMG requirements
5. **Privacy + Terms** (~3 hours) — paste from e-recht24 generator OR write draft, customize
6. **404 page** (~30 min)
7. **Plausible integration** (~30 min) — script tag in layout, env var for domain
8. **SEO meta** (~2 hours) — per-page metadata, OG image, sitemap, robots.txt
9. **Lighthouse optimization** (~1 hour) — image optimization, font preload, defer non-critical JS
10. **Polish + commit** (~1 hour)

## Files Created/Modified

**Created (apps/marketing/app/[locale]/):**

- `(marketing)/page.tsx` — landing
- `(marketing)/pricing/page.tsx`
- `(auth)/sign-in/page.tsx`
- `(auth)/sign-up/page.tsx`
- `(auth)/reset-password/page.tsx`
- `(legal)/imprint/page.tsx`
- `(legal)/privacy/page.tsx`
- `(legal)/terms/page.tsx`
- `not-found.tsx`

**Created elsewhere:**

- `apps/marketing/components/marketing/Hero.tsx`
- `apps/marketing/components/marketing/FeatureBlock.tsx`
- `apps/marketing/components/marketing/PricingCard.tsx`
- `apps/marketing/lib/seo.ts` (meta helpers)
- `apps/marketing/app/sitemap.ts`
- `apps/marketing/app/robots.ts`
- `apps/marketing/public/og-image.png` (1200×630, branded)
- `packages/i18n/messages/en.json` (extended)
- `packages/i18n/messages/de.json` (extended)

## Common Pitfalls

**1. TMG Imprint requirements** — must include legal name, address, contact email. NOT just business email. Solo Einzelunternehmer needs full personal info.

**2. DSGVO Privacy template** — generic templates can be wrong. Use e-recht24 (DE-aware) or have lawyer review before public launch (Phase 23).

**3. Plausible domain mismatch** — script `data-domain` must match deployed domain. Use env var.

**4. OG image dimensions** — 1200×630 is the standard. Lighthouse may complain about other ratios.

**5. Lighthouse Performance < 95** — usually due to render-blocking JS. Minimize. Use `next/font` for fonts (auto-optimized).

**6. Auth pages without backend** — show form, on submit show "coming soon" toast. Don't fake a flow.

## Done When

- All pages render on http://localhost:3000
- Lighthouse scores all ≥ 95
- Petja reviews legal pages personally (these are real legal documents under his name)
- Commit: `feat(marketing): foundation pages — landing, pricing, auth, legal`

---

**Next:** `phase-08-supabase-auth.md`
