# Affiliate Program Runbook (Phase 31)

> Tracking, commission ledger, dashboard and signup are in code. **Payouts need
> Stripe Connect (yours) and aren't testable headless.** Attribution: first-touch,
> 30% recurring for 12 months (per-invoice crediting is a refinement — see below).

> 🛑 **BLOCKER vor Affiliate-Onboarding:** Versprochen wird „30% recurring für 12 Monate",
> implementiert ist aktuell nur EINE Provision bei Subscription-Erstellung (siehe „Deferred").
> Das wäre Vertragsbruch gegenüber Affiliates. Per-Invoice-Crediting MUSS vor dem ersten
> Affiliate-Vertrag implementiert sein — oder das Versprechen ehrlich auf „30% der ersten
> Zahlung" ändern. Zusätzlich: Kalt-E-Mail-Outreach an Creator ist in DE wettbewerbsrechtlich
> riskant (§7 UWG, Einwilligungserfordernis) — Outreach über Plattform-DMs/Kontaktformulare
> oder bestehende Kontakte bevorzugen; Steuerfragen (Reverse-Charge, §19 UStG der Affiliates)
> mit Steuerberater klären.

## 1. Apply migration + sync rules

```bash
supabase db push   # 0030_affiliate_system.sql
```

Deploy the updated `powersync/sync-rules.yaml` (adds owner-only `affiliates` +
`affiliate_commissions` streams; `affiliate_clicks` is server-only). Security is
encoded: applicants can only insert a `pending` row with zeroed counters — no
self-approve, no earnings inflation. Approval + counters are service-role only.

## 2. Approve affiliates

People apply in-app (Settings → Affiliate → Apply). Review and approve:

```sql
update affiliates set status = 'approved' where code = '<code>';
```

## 3. Deploy functions

```bash
supabase functions deploy affiliate-track --no-verify-jwt   # public click tracking
supabase functions deploy affiliate-payout-monthly          # cron (gated on Connect)
# stripe-webhook already credits commissions on referred subscription.created.
```

## 4. Wire click tracking on the marketing site

When a visitor lands with `?ref=<code>`, POST `{ code }` to `affiliate-track` and
store the code (cookie/localStorage, 30 days). Carry it into sign-up → checkout so
it lands in the Stripe Checkout `subscription_data.metadata.referral`
(already read by `stripe-create-checkout`).

## 5. Stripe Connect payouts (your ops)

- Enable **Connect** on your Stripe account; onboard affiliates via Connect
  Express (collect `stripe_account_id` in