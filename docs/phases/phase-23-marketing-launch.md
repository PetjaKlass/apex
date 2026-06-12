# Phase 23 — Marketing Site Polish + Public Beta Launch

> **Stage:** Beta (final phase of Stage 2)
> **Size:** L (3-5 days, ~24-32 hours)
> **Status:** Ready to execute
> **Dependencies:** Phase 22 complete

## Goal

Polish the Marketing Site to public-ready quality. Real screenshots, branded copy, blog setup, newsletter, SEO, and execute Public Beta launch (HackerNews, ProductHunt, X). Target: 100 paying users.

## Why Now

End of Stage 2. Apex is feature-complete (Tasks, Habits, Focus, Vision, Goals, Rituals, Journal, Knowledge, gamification, mobile apps, Stripe live). Time to tell the world.

## Prerequisites

- Phases 14-22 complete
- All features dogfooded by Petja for 60+ days
- Mobile apps live in stores
- Stripe live with test transactions verified
- Final brand name decided (or use "Apex" + clear)
- Domain registered
- Zero P0/P1 bugs open

## Scope

1. Marketing site full polish (animations, content, screenshots)
2. Real product screenshots (5-7 hero shots)
3. Pricing page final form (tier comparison)
4. About page / Manifesto page
5. Blog launched (MDX-powered)
6. 3-5 quality blog posts at launch
7. Email capture (Resend Audiences)
8. Newsletter setup (welcome series)
9. SEO: meta tags, Open Graph, sitemap, structured data
10. Analytics events (signups, conversion funnel)
11. ProductHunt launch preparation (assets, copy)
12. HackerNews "Show HN" preparation
13. X (Twitter) launch thread (8-12 tweets)
14. Discord/Slack community for early customers
15. Public Beta announcement

## Out of Scope

- AI Coach (Phase 24)
- Score Card (Phase 25)
- The Letter (Phase 26)
- Affiliate program (Phase 31)
- Public launch event (Phase 32)

## Acceptance Criteria

### Marketing site polish

- [ ] Landing page final design with branded copy
- [ ] 5-7 hero screenshots from real product
- [ ] Pricing page with tier comparison
- [ ] About / Manifesto page
- [ ] Blog index + 3-5 launch posts
- [ ] Newsletter signup with welcome email series (Resend)
- [ ] All copy in EN + DE, native-quality
- [ ] Lighthouse: Perf ≥ 95, SEO ≥ 95, A11y ≥ 95

### SEO

- [ ] Meta tags per page
- [ ] Open Graph images (1200×630) for each shareable page
- [ ] Sitemap.xml + robots.txt
- [ ] Structured data (Organization, Product, FAQ)
- [ ] hreflang for DE/EN
- [ ] Canonical URLs

### Analytics

- [ ] Plausible: track all marketing pages
- [ ] PostHog: track signup funnel (visit → signup → onboard → first action → subscribe)
- [ ] Conversion goals defined

### Launch assets

- [ ] ProductHunt: tagline, description, gallery (5+ images), maker comment
- [ ] HackerNews "Show HN" post drafted (200 words)
- [ ] X launch thread: 8-12 tweets with images/videos
- [ ] Demo video (60-90 seconds)
- [ ] Press kit page (logos, screenshots, founder bio)

### Launch execution

- [ ] Discord/Slack community created
- [ ] First 20 users invited (alpha testers, friends)
- [ ] ProductHunt launch (Tuesday for best traction)
- [ ] HackerNews submission (morning EST)
- [ ] X thread published
- [ ] Email blast to waitlist (if any)
- [ ] First 24 hours: Petja monitors, responds to comments

### Post-launch (1 week)

- [ ] Analytics review
- [ ] First customer testimonial collected
- [ ] All P0/P1 bugs from new users fixed
- [ ] At least 50 paying customers

## Implementation Plan

1. **Marketing copy polish** (~6 hours) — Petja writes final copy, German + English native quality
2. **Real screenshots** (~3 hours) — capture from real product, edit/annotate
3. **About / Manifesto page** (~3 hours) — Petja's story + Apex philosophy
4. **Blog setup** (~3 hours) — MDX, syntax highlighting, RSS feed
5. **3-5 blog posts** (~8 hours) — written by Petja, topics: solo founder productivity, identity-based habits, etc.
6. **Newsletter + Resend Audiences** (~3 hours) — signup form, welcome series (3 emails)
7. **SEO comprehensive** (~3 hours) — all meta, structured data, sitemap
8. **Analytics events** (~2 hours) — PostHog instrumentation
9. **ProductHunt assets** (~4 hours) — copy, images, gallery
10. **Demo video** (~6 hours) — record, edit, upload (Petja's existing DaVinci Resolve setup)
11. **HackerNews + X drafts** (~3 hours)
12. **Discord/Slack setup** (~1 hour)
13. **Launch day execution** (~8 hours active monitoring)
14. **First-week iteration** (~variable)

## Files Created/Modified

**Created:**

- `apps/marketing/app/[locale]/(marketing)/about/page.tsx`
- `apps/marketing/app/[locale]/(marketing)/manifesto/page.tsx`
- `apps/marketing/app/[locale]/(marketing)/blog/page.tsx`
- `apps/marketing/app/[locale]/(marketing)/blog/[slug]/page.tsx`
- `apps/marketing/content/posts/*.mdx` (3-5 posts)
- `apps/marketing/components/marketing/Newsletter.tsx`
- `apps/marketing/components/marketing/Manifesto.tsx`
- `apps/marketing/public/screenshots/` (real product)
- `apps/marketing/public/og-*.png` (per-page OG images)
- `docs/launch/producthunt-copy.md`
- `docs/launch/hn-post.md`
- `docs/launch/x-thread.md`
- `docs/launch/press-kit.md`

## Common Pitfalls

**1. Premature launch** — if any P1 bug exists, postpone. First impressions are unrepairable.

**2. ProductHunt timing** — Tuesday-Thursday best. Avoid Mondays (lower traffic), Fridays (weekend dropoff).

**3. HackerNews tone** — must be authentic, no marketing speak. "Show HN: [Product] — [one-line]" format.

**4. Demo video length** — 60-90 seconds optimal. Longer = drop-off.

**5. Newsletter welcome series** — 3 emails over 5 days: welcome + first value, philosophy, customer story.

**6. Twitter thread structure** — Hook → Problem → Solution → Demo → Why now → Pricing → CTA → Thanks.

**7. Discord vs Slack** — Discord for community feel (newer, more casual). Slack for B2B (older, professional). Apex audience: probably Discord.

**8. Launch day support** — Petja must be ON. Respond to every comment within 30 min.

**9. Imposter syndrome** — at the moment of launch, every founder doubts. Push through.

## Done When (End of Stage 2!)

- Marketing site is public-launch-ready
- ProductHunt + HackerNews + X all executed
- 50+ paying customers in first week
- NPS measured, > 40
- Stage 2 retrospective written
- Petja gets first customer testimonial
- Commit + tag: `git tag v0.3.0-public-beta && git push --tags`

🎉 **End of Stage 2. Apex is publicly launched.**

Take a 1-week break before Stage 3. You earned it.

---

**Next:** `phase-24-ai-coach.md` (Stage 3 begins!)
