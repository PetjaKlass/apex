# Phase 31 — Affiliate Program + Content Marketing

> **Stage:** Launch+
> **Size:** L (3-5 days, ~24-32 hours)
> **Status:** Ready to execute
> **Dependencies:** Phase 30 complete

## Goal

Establish affiliate program for content creators (productivity YouTubers, indie hackers, Tim Ferriss orbit). 30% recurring commission. Stripe Connect for payouts. Founders' newsletter monthly. Blog launched with 3-5 quality posts.

## Why Now

Users are subscribing organically by Stage 3. Affiliate program scales beyond direct sales. Content marketing creates the long-tail SEO funnel.

## Prerequisites

- Phase 30 complete
- 100+ paying customers (gives credibility for affiliate pitches)
- Petja's network includes some content creators

## Scope

1. Affiliate dashboard (signup, links, tracking)
2. 30% recurring commission for first 12 months
3. Stripe Connect for payouts
4. Marketing site has "Become an affiliate" page
5. Outreach to 10-20 productivity content creators
6. Founders' newsletter (monthly, going public)
7. Blog launched on marketing site (MDX-powered)
8. 3-5 quality blog posts at launch

## Out of Scope

- Tier system for affiliates (gold/silver/bronze) — Phase 32+
- Affiliate-only events (later)
- Custom affiliate landing pages per creator (later)

## Acceptance Criteria

### Affiliate program

- [ ] Affiliate signup flow on marketing site
- [ ] Approval workflow (Petja reviews each)
- [ ] Affiliate dashboard: link, click count, conversions, earnings
- [ ] Unique referral codes per affiliate (e.g., ?ref=tim-ferriss)
- [ ] Tracking via cookie + server-side
- [ ] 30% commission on first 12 months of subscription
- [ ] Stripe Connect Express for payouts
- [ ] Monthly automated payout (after threshold met, e.g., €50)
- [ ] Affiliate Terms (legal page)
- [ ] DSGVO compliance for affiliate data

### Content marketing

- [ ] Blog with MDX, syntax highlighting, RSS
- [ ] 3-5 launch posts:
  - "How identity-based habits changed my year"
  - "Why I built Apex (founder story)"
  - "The Solo Founder's daily operating system"
  - "Conviction Score: a measure for your future self"
  - "Pomodoro for deep work, not just productivity"
- [ ] All posts in EN + DE
- [ ] Featured posts on marketing landing page
- [ ] Newsletter signup with auto-add to Resend Audiences
- [ ] Welcome email series (3 emails)
- [ ] Monthly newsletter template

### Outreach

- [ ] List of 20 target content creators
- [ ] Personalized outreach email template
- [ ] Track outreach in spreadsheet or Airtable
- [ ] Goal: 5+ affiliates signed up in 30 days

## Implementation Plan

1. **Affiliate signup + dashboard** (~6 hours)
2. **Tracking infrastructure** (~4 hours) — cookie, server-side conversion tracking
3. **Stripe Connect Express setup** (~6 hours) — onboarding flow, payouts
4. **Commission calculation** (~3 hours) — webhook hooks: subscription created → credit affiliate
5. **Affiliate Terms + DSGVO** (~2 hours)
6. **Blog setup** (~3 hours) — MDX, RSS, syntax highlight
7. **3-5 blog posts** (~10 hours) — Petja writes
8. **Newsletter setup** (~2 hours) — Resend Audiences integration
9. **Outreach campaign** (~variable) — Petja personally
10. **Tests + commit** (~3 hours)

## Files Created/Modified

**Created:**

- `apps/marketing/app/[locale]/(affiliate)/become-affiliate/page.tsx`
- `apps/marketing/app/[locale]/(affiliate)/affiliate-terms/page.tsx`
- `apps/product/app/(app)/affiliate/dashboard.tsx` (for approved affiliates)
- `supabase/functions/affiliate-track/index.ts`
- `supabase/functions/affiliate-payout-monthly/index.ts`
- `supabase/migrations/0070_affiliate_system.sql`
- `apps/marketing/content/posts/*.mdx` (3-5 posts)
- `apps/marketing/app/[locale]/(marketing)/blog/page.tsx`
- `apps/marketing/app/[locale]/(marketing)/blog/[slug]/page.tsx`
- `apps/marketing/components/marketing/Newsletter.tsx`
- `docs/marketing/outreach-list.md`
- `docs/marketing/outreach-template.md`

## Common Pitfalls

**1. Affiliate fraud** — self-referral, fake clicks. Manual approval + monitor patterns.

**2. Commission attribution** — first-touch vs last-touch. Document decision (first-touch is industry standard).

**3. Stripe Connect compliance** — Petja's Stripe account needs to enable Connect, KYC for affiliates.

**4. Tax for affiliates** — affiliates may need 1099 (US) or invoice (EU). Document for legal.

**5. Cookie attribution** — 30-day cookie is industry standard. Cross-device attribution is hard, accept the loss.

**6. Outreach cold-email rules** — comply with anti-spam (CAN-SPAM, DSGVO). Personalize, no mass blast.

**7. Blog post quality** — better 3 great posts than 10 mediocre. Petja personal voice critical.

**8. Newsletter cadence** — monthly initially. Don't promise weekly if you can't deliver.

## Done When

- Affiliate signup flow works end-to-end
- 5+ affiliates approved within 30 days
- 3+ blog posts live with traffic
- Newsletter has 100+ subscribers
- Commit: `feat(growth): affiliate program + content marketing`

---

**Next:** `phase-32-public-launch-event.md` (the big finale!)
