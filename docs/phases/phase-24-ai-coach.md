# Phase 24 — AI Coach (The Major Differentiator)

> **Stage:** Launch+ (first phase of Stage 3)
> **Size:** XL (1-2 weeks, ~50-80 hours)
> **Status:** Ready to execute (EXPAND BEFORE STARTING)
> **Dependencies:** Phase 23 complete + 50+ paying customers + Anthropic API EU region verified

⚠️ **EXPAND BEFORE STARTING:** Anthropic API + AI capabilities evolve fast. Re-check current model + pricing + EU availability before executing.

## Goal

Ship the AI Coach as Apex's signature feature. Context-aware AI guidance for morning rituals, goal review, OBT selection, weekly review. Soft-limit enforcement, add-on monetization, EU privacy compliance.

## Why Now

End of Stage 2 proved the product. Stage 3 differentiates. AI Coach is what makes Apex "the Life OS that knows you" vs. "another productivity app." Ship it once you have customers to learn from.

## Prerequisites

- Phase 23 complete with paying customers
- Anthropic API access verified in EU region
- AVV with Anthropic signed
- Privacy policy updated to disclose AI Coach data flows

## Scope

1. AI Coach Edge Function (Supabase) calls Anthropic API
2. Context assembly: workspace data, goals, habits, recent journal entries
3. Coach interaction UI (chat-like but contextual, NOT free-form chatbot)
4. Coaching prompts: morning ritual coach, goal review, OBT selection, weekly review
5. Soft limit enforcement: 200 calls/month per ADR 0011
6. Add-on subscription: +€5/mo for 500 more calls
7. Coach personality matches Voice & Tone in design-system.md
8. Cost monitoring + alerts (Anthropic API budget)
9. EU region for Anthropic verified before deploy
10. Coach session history
11. Privacy: coach interactions in private bucket, never shared in Duo
12. AI Coach toggle in Settings (some users want it off)

## Out of Scope

- Free-form open chat with Coach (intentionally NOT a chatbot)
- Voice interaction (later)
- Coach for Free tier users (paid feature only)
- Multi-language coach (start with EN, DE comes later)

## Acceptance Criteria

### Backend

- [ ] Edge Function `ai-coach` deployed in EU region
- [ ] Calls Claude Haiku 4.5 via Anthropic API (cost-efficient model)
- [ ] EU API endpoint verified (no data leaves EU)
- [ ] Context assembly: max 4000 tokens of relevant user data
- [ ] System prompts per coaching context (morning, goal review, OBT, weekly)
- [ ] Response streaming for better UX
- [ ] Cost tracking per call (logged to ai_coach_usage table)
- [ ] Rate limiting: 200/month soft, hard at 700 (200 + 500 add-on)

### Coach contexts (4 initial)

- [ ] **Morning Coach**: opens during Morning Ritual, suggests OBT based on goals + energy
- [ ] **Goal Review Coach**: weekly, reviews progress on each goal, asks reflection questions
- [ ] **OBT Selector**: from a goal's tasks, suggests today's One Big Thing with reasoning
- [ ] **Weekly Review Coach**: in CEO Review, asks deeper questions based on the week's data

### Frontend

- [ ] Coach interaction UI: subtle, integrates with existing flows (not popup-y)
- [ ] Coach avatar (custom Apex mark, distinct from user avatars)
- [ ] Streaming response feels natural
- [ ] User can dismiss coach for current flow
- [ ] User can toggle coach off in Settings (no calls made)
- [ ] Usage indicator: "150 of 200 calls this month"
- [ ] Add-on upsell when approaching limit

### Privacy

- [ ] Coach interactions stored in `user_private` bucket only
- [ ] Never shared with Duo partner
- [ ] User can delete coach history
- [ ] Privacy policy updated with AI Coach disclosures
- [ ] AVV with Anthropic on file
- [ ] EU residency verified

### Cost monitoring

- [ ] Daily cost report (Edge Function logs to monitoring)
- [ ] Alert if monthly cost > €50 (early warning)
- [ ] Alert if user approaches soft limit
- [ ] Hard cap protection: cannot exceed 700/month

## Implementation Plan

1. **Anthropic API setup** (~3 hours) — EU endpoint verification, API key, AVV signed
2. **Edge Function ai-coach** (~8 hours) — handles all coach contexts, streams response
3. **Context assembly logic** (~6 hours) — query user's recent goals, habits, journal; trim to 4000 tokens
4. **System prompts** (~4 hours) — 4 coaching contexts, refined and tested
5. **Coach interaction UI** (~8 hours) — chat-like display, streaming, integrates with Morning Ritual + Goal Review + OBT + CEO Review
6. **Usage tracking** (~3 hours) — ai_coach_usage table, increment per call
7. **Soft limit enforcement** (~3 hours) — UI warnings, hard cap
8. **Add-on subscription** (~4 hours) — Stripe Price for €5 add-on, unlock additional 500 calls
9. **Settings toggle** (~2 hours) — enable/disable Coach
10. **History page** (~3 hours) — past coach interactions, deletable
11. **Privacy policy update** (~2 hours) — Petja drafts disclosures
12. **Cost monitoring** (~3 hours) — daily report Edge Function, alert thresholds
13. **Adversarial tests** (~4 hours) — prompt injection attempts, data leakage tests
14. **Tests + commit** (~3 hours)

## Files Created/Modified

**Created:**

- `supabase/functions/ai-coach/index.ts`
- `supabase/functions/ai-coach-cost-report/index.ts` (daily cron)
- `supabase/migrations/0030_ai_coach_usage.sql` (table)
- `supabase/migrations/0031_ai_coach_history.sql` (interaction history)
- `apps/product/components/coach/CoachAvatar.tsx`
- `apps/product/components/coach/CoachInteraction.tsx`
- `apps/product/components/coach/CoachUsageIndicator.tsx`
- `apps/product/lib/coach/contexts.ts` (4 system prompts)
- `apps/product/lib/coach/api.ts` (call Edge Function, stream response)
- `apps/product/app/(app)/settings/ai-coach.tsx`
- `apps/product/app/(app)/coach/history.tsx`

**Modified:**

- `apps/product/app/(app)/rituals/morning.tsx` (Coach integration)
- `apps/product/app/(app)/rituals/weekly-review.tsx`
- Marketing site Privacy Policy + Terms updated
- Pricing page (mention AI Coach included in Pro tiers)

## Common Pitfalls

**1. Prompt injection** — user tries to make Coach do unintended things. Use system prompts robustly. Never expose user data to other users via Coach.

**2. Token explosion** — long context = expensive. Strict 4000 token budget per call, smart truncation.

**3. Streaming on mobile** — server-sent events on native is tricky. Use polling or websockets if needed.

**4. Cost surprise** — without monitoring, one user could cost €100. Hard cap at 700/month enforced server-side.

**5. EU residency proof** — verify Anthropic API endpoint, document in compliance file.

**6. Coach as toy vs tool** — restrict scope. Coach is goal-aligned guidance, not therapy or general chat.

**7. Privacy expectations** — users need to TRUST Coach has their data. Be transparent in privacy policy.

**8. Coach personality drift** — system prompts must maintain Apex's voice. Test extensively.

**9. Anthropic rate limits** — Tier 1 has limits. Plan for upgrade as user base grows.

**10. AVV signing process** — Anthropic enterprise sales handles. Email contact, allow 1-2 weeks.

## Done When

- Petja completes a Morning Ritual with Coach guidance and feels it adds value
- 5+ early customers test Coach and provide feedback
- Cost stays under projected budget for first month
- Privacy disclosures clear and accurate
- Settings toggle works perfectly (no calls when off)
- Commit: `feat(coach): AI Coach with 4 contexts and EU compliance`

---

**Next:** `phase-25-score-card.md`
