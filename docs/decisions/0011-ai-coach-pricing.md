# ADR 0011 — AI Coach Pricing & Cost Control Strategy

**Status:** Accepted
**Date:** 2026-05-03
**Deciders:** Petja Klass (founder), Claude (advisor)

## Context

The AI Coach is a planned premium feature that uses Anthropic's Claude API to provide contextual, personalized guidance based on the user's goals, habits, journal entries, and patterns. It is one of the strongest differentiators vs. competitors (Notion, Todoist, Habitica do not have this).

**The risk:** Anthropic API calls cost real money per call. Without cost control, a small number of power users could turn AI Coach from feature into liability.

This ADR locks in pricing structure and cost-control strategy.

## Decision

**AI Coach is included in Solo Pro (€12/mo) and Duo Pro (€29/mo) with a soft monthly limit of 200 AI Coach interactions per user.**

When approaching the limit:

- 80% (160 calls): UI shows gentle counter "160 of 200 AI Coach interactions used this month"
- 100% (200 calls): AI Coach pauses for the calendar month with countdown to reset
- Add-on available: "+€5/mo for 500 additional calls" (Stripe upsell)

Free tier does NOT include AI Coach.

## Cost Math (Anchor Date: 2026-05)

**Note:** Anthropic API pricing may change. Verify at console.anthropic.com/pricing before **Phase 24** (when we build AI Coach). _(Korrigiert: hier stand „Phase 16" — das ist Focus Mode; AI Coach ist Phase 24.)_

Estimated cost per call (Claude Haiku 4.5, suitable for coaching responses):

- Input: ~2,000 tokens × ~$1/M tokens = ~$0.002
- Output: ~500 tokens × ~$5/M tokens = ~$0.0025
- **Cost per call: ~$0.0045**

Per Pro user with 200 calls/mo limit:

- Worst case cost: 200 × $0.0045 = **~$0.90/user/month**
- Realistic average usage (estimated): 100 calls/month = **~$0.45/user/month**

At 100 paying Pro users:

- Revenue: €1,200/mo (Solo Pro €12 × 100)
- Anthropic cost worst case: ~€87/mo (~7% of revenue)
- Anthropic cost realistic: ~€44/mo (~4% of revenue)
- **Margin protected**

At 1,000 paying Pro users:

- Revenue: €12,000/mo
- Anthropic cost worst case: ~€870/mo
- Anthropic cost realistic: ~€440/mo
- **Margin still healthy**

## Why This Works

### Solo founder cost-control philosophy

This pricing protects you from the three classic AI feature cost traps:

1. **Power-user blow-up:** Someone uses AI Coach 50 times a day → your cost balloons. **Solved by hard cap.**
2. **Free tier abuse:** Spam accounts use AI to test prompt engineering → cost without revenue. **Solved by Pro-tier-only.**
3. **Margin erosion at scale:** Small per-user cost × many users = significant cost. **Solved by predictable per-user cap.**

### Why include in Solo Pro instead of higher tier

- **Discoverability:** AI Coach is the strongest "wow factor" feature. Hiding it behind a higher tier means most users never experience it = weaker conversion + word-of-mouth.
- **Simplicity:** Two-tier pricing (Free, Pro) is easier to communicate than three-tier.
- **Market signal:** Competitors charge $20-30/mo for similar AI features. Including in €12 Pro makes Apex look generous.

### Why add-on instead of "upgrade to higher tier"

- **Self-selection:** Users who genuinely need >200 calls/month are willing to pay (they're getting real value).
- **Transparent:** No "you've hit your limit, upgrade to Premium for €30/mo" feels-like-extortion message.
- **Stripe-friendly:** Add-on is a separate subscription product, simple to manage.

## Implementation Plan

This is implemented in **Phase 24** (AI Coach) but designed in Phase 9 (Database Schema + PowerSync) so the schema is correct from start.

### Schema (added in Phase 9)

```sql
-- Tracks AI Coach usage per user per calendar month
ai_coach_usage (
  id              uuid PK,
  user_id         uuid NOT NULL references profiles(id) ON DELETE CASCADE,
  workspace_id    uuid NOT NULL references workspaces(id),
  month           date NOT NULL,                      -- first day of month
  calls_used      int NOT NULL DEFAULT 0,
  plan_limit      int NOT NULL DEFAULT 200,           -- can be increased by add-on
  addon_active    boolean DEFAULT false,
  addon_extra_calls int DEFAULT 0,                    -- e.g., 500 if add-on bought
  UNIQUE (user_id, month)
)

-- Logs every AI Coach interaction for analytics + debugging
ai_coach_interactions (
  id              uuid PK,
  user_id         uuid NOT NULL references profiles(id),
  workspace_id    uuid NOT NULL references workspaces(id),
  prompt_type     text NOT NULL,                      -- 'morning_ritual', 'goal_review', 'general'
  prompt_tokens   int,
  completion_tokens int,
  cost_usd        numeric(10, 6),                     -- store actual API cost
  occurred_at     timestamptz DEFAULT now()
)
```

`ai_coach_usage` is private to user (not shared in Duo workspace).
`ai_coach_interactions` is private to user (analytics only, never shown to partner).

### Edge Function (Phase 24)

```typescript
// supabase/functions/ai-coach/index.ts (pseudocode)
export async function aiCoach(prompt: string, userId: string) {
  // 1. Check current month usage
  const usage = await getOrCreateMonthlyUsage(userId);

  if (usage.calls_used >= usage.plan_limit + (usage.addon_extra_calls || 0)) {
    return { error: 'monthly_limit_reached', resets_in_days: daysUntilMonthEnd() };
  }

  // 2. Call Anthropic API
  const response = await anthropic.messages.create({
    model: 'claude-haiku-4-5-20251001', // verify current model name in Phase 24
    max_tokens: 800,
    messages: [{ role: 'user', content: prompt }],
  });

  // 3. Increment usage counter (atomic)
  await incrementUsage(userId);

  // 4. Log interaction
  await logInteraction(userId, prompt, response);

  return { content: response.content };
}
```

### UI States

- **0–80% used:** No indicator visible (clean UX)
- **80–95% used:** Settings → AI Coach shows "160 of 200 used this month"
- **95–100% used:** Same indicator + dismissible toast on Coach interaction
- **100% used:** Coach disabled with friendly message: "AI Coach pauses until [reset date]. Get more calls instantly: [Get +500 for €5]"
- **Add-on active:** Shows "200 + 500 add-on = 700 calls available"

### Free Tier Experience

Free users see AI Coach in the UI with a lock icon, can read "Upgrade to Pro to unlock AI Coach" message. This is honest upsell, not bait-and-switch.

## Trade-Offs

### Positive

- Predictable cost per Pro user (max €0.90/mo Anthropic spend)
- Clean two-tier pricing (Free, Pro €12)
- AI Coach as strong USP for Pro (95%+ users get to experience it)
- Add-on creates path for power users without forcing tier upgrade
- Schema designed in Phase 9 means no migration needed when AI Coach ships in Phase 24

### Negative

- Some users feel limit is "too low" (mitigation: monthly limit is generous, average user uses ~100 calls)
- Add-on adds Stripe complexity (two SKUs to manage)
- Cost spikes possible if Anthropic raises prices (mitigation: model can be downgraded; Claude Haiku 4.5 is already the cost-optimized tier)

### Risks

- **Anthropic outage:** AI Coach unavailable; user sees graceful error "AI Coach temporarily unavailable, please try again later." No usage counted.
- **Anthropic price increase:** Re-evaluate model choice (Haiku → smaller model) or limit (200 → 150 calls). Tiered pricing review in Stage 3.
- **Power user complaints:** Track add-on conversion rate; if many users hit limit and don't buy add-on, increase free monthly allowance.

## What Triggers Revisiting

- Anthropic API pricing changes by >50% in either direction
- Average user usage crosses 150 calls/month (limit may be too low)
- Average user usage stays below 50 calls/month for 3 months (limit is irrelevant; consider removing)
- Apex pricing strategy changes overall (e.g., Free becomes paid Trial)
- Add-on conversion rate is below 5% of users hitting limit (signals limit is too restrictive or add-on is too expensive)

## References

- [Anthropic API Pricing](https://www.anthropic.com/pricing#api)
- [Anthropic Models Comparison](https://docs.anthropic.com/en/docs/about-cla