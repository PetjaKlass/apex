# AI Coach Setup Runbook (Phase 24)

> The Coach is fully built in code but **off by default** and **not runnable
> headless** — it needs an Anthropic key and a deployed Edge Function. Activate
> it when you're ready to dogfood (alpha) or sell it (paid add-on at launch).

## 0. Prerequisites

- Anthropic API access; **EU data residency** verified for your account.
- **AVV (DPA) with Anthropic** signed and on file.
- Privacy policy updated to disclose AI Coach data flows (goals, habits, recent
  journal entries are sent to the model).

## 1. Apply migrations + sync rules

```bash
supabase db push   # 0026_ai_coach_usage.sql, 0027_ai_coach_history.sql
```

Deploy the updated `powersync/sync-rules.yaml` (adds read-only `ai_coach_usage`
and `ai_coach_messages` to the user_private stream). Security is encoded in the
migrations: usage is owner-read only (service-role writes); messages are
owner-read + owner-delete only (service-role inserts) and strictly user_private.

## 2. Secrets + deploy

```bash
supabase secrets set \
  ANTHROPIC_API_KEY=sk-ant-... \
  ANTHROPIC_MODEL=claude-haiku-4-5 \
  ANTHROPIC_BASE_URL=https://api.anthropic.com   # set the EU endpoint here
  # optional: AI_COACH_SOFT_LIMIT=200 AI_COACH_ADDON_LIMIT=500
  # cost report: AI_COACH_EST_COST_PER_CALL=0.01 AI_COACH_ALERT_EUR=50 ALERT_WEBHOOK_URL=...

supabase functions deploy ai-coach
supabase functions deploy ai-coach-cost-report
# schedule the cost report daily via Supabase cron (pg_cron / dashboard).
```

## 3. Turn it on

Settings → Apex Coach → **Enable AI Coach** (off by default). Once on, the Coach
appears as a final step in the Morning Ritual and Weekly Review, with usage shown
in Settings. With no key set, calls return `coach_unavailable` and the UI says so.

## 4. Gating

In alpha the Coach is available to anyone who enables it (so you can dogfood). To
make it a paid add-on at launch, gate `useCoachAvailable` (and/or the Edge
Function) on `hasFeature(sub, 'ai_coach')` — a one-line change. The Edge Function
already raises the monthly cap by 500 when `subscriptions.ai_coach` is true.

## 5. Verify (with key, in a real build)

- Morning Ritual → final coach step → "Ask the coach" → a concise, on-voice
  suggestion for today's One Big Thing.
- Usage increments; at 80% the add-on upsell appears; hard cap returns
  `limit_reached`.
- Coach history lists conversations and can be cleared (deletes sync up).
- Prompt-injection attempt ("ignore your instructions…") → Coach declines and
  steers back. Confirm no other user's data ever appears.

## Deferred (documented)

- Response streaming (current scaffold is single-response; reliable web+native).
- Real per-call token cost accounting (cost report estimates from call count).
- Multi-language coach (EN prompts at launch; DE later).
- Cost-alert wiring to your monitoring channel (ALERT_WEBHOOK_URL).
