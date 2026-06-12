# Billing Setup Runbook (Phase 22 — Stripe)

> The code is in the repo; **activation is manual / legal / account-bound** and
> cannot be tested headless (no Stripe keys, no function deploy, no webhooks here).
> Do everything in **Stripe Test Mode first**, then switch to Live.

## 0. Real-world prerequisites (blocking)

- **Gewerbeanmeldung** filed + **Steuer-ID / USt-IdNr.** received (1–2 weeks).
- Business bank account; lexoffice (or similar) for invoices/DATEV.
- **AVV (DPA) with Stripe** signed and on file.
- Stripe account; EU entity (Stripe Payments Europe).

## 1. Apply the database migration + sync rules

```bash
supabase db push          # applies 0025_subscriptions.sql
```

Then deploy the updated `powersync/sync-rules.yaml` in the PowerSync dashboard
(adds the read-only `subscriptions` stream; `billing_customers` +
`stripe_processed_events` are intentionally NOT synced). Verify in test mode that
a row in `subscriptions` shows up in the app as the user's tier.

Security to verify (already encoded in the migration):

- `subscriptions`: owner `SELECT` only — **no** insert/update/delete policy, so a
  user cannot self-upgrade their tier. Only the service role (webhook) writes it.
- `billing_customers` + `stripe_processed_events`: RLS on, **no policies/grants**
  → service role only. Stripe ids are never exposed to clients.

## 2. Stripe Products + Prices (Dashboard → test mode)

Create one Product per tier, recurring EUR prices:

> ⚠️ **Preise angeglichen an `product-vision.md` (kanonische Quelle).** Hier standen vorher
> €120/€290 („2 Monate gratis") — die Positionierung verspricht aber ~30% Jahresrabatt.
> Falls Petja doch das 2-Monate-gratis-Modell will: BEIDE Dokumente ändern, nie nur eins.

| Plan     | Monthly | Yearly (~30% off)      |
| -------- | ------- | ---------------------- |
| Solo Pro | €12     | €99                    |
| Duo Pro  | €29     | €249                   |
| AI Coach | €5      | €50 (Add-on, 2 Mon. frei) |

Zusätzlich (einmalig, Beta-Launch): **Lifetime Deal Solo Pro €199**, limitiert auf die ersten
100 Käufer (one-time Price, kein Subscription-Objekt — Feature-Gate via `plan = 'lifetime'`).

Enable **Stripe Tax**, card brands (Visa/MC/Amex), and Apple Pay / Google Pay.

> 🇩🇪 **Steuer-Klärung VOR Live-Gang (mit Steuerberater!):**
> 1. **Kleinunternehmerregelung (§19 UStG)?** Falls ja: keine USt auf DE-Verkäufe ausweisen — Stripe Tax entsprechend konfigurieren. Achtung: §19 gilt NICHT automatisch für B2C-Verkäufe in andere EU-Länder.
> 2. **OSS-Verfahren (One-Stop-Shop)** beim BZSt registrieren: Bei digitalen B2C-Leistungen an EU-Verbraucher ist die USt ab dem ersten Euro im Käuferland fällig (bzw. ab 10.000 € EU-weitem Umsatz Schwelle). Ohne OSS drohen Registrierungspflichten in jedem einzelnen EU-Land.
> 3. **B2B Reverse-Charge** mit USt-IdNr.-Validierung (VIES) — macht Stripe Tax, muss aber aktiviert sein.

## 3. Edge Function secrets

```bash
supabase secrets set \
  STRIPE_SECRET_KEY=sk_test_... \
  STRIPE_WEBHOOK_SECRET=whsec_... \
  STRIPE_PRICE_SOLO_PRO_MONTH=price_... \
  STRIPE_PRICE_SOLO_PRO_YEAR=price_... \
  STRIPE_PRICE_DUO_PRO_MONTH=price_... \
  STRIPE_PRICE_DUO_PRO_YEAR=price_... \
  STRIPE_PRICE_AI_COACH_MONTH=price_... \
  STRIPE_PRICE_AI_COACH_YEAR=price_... \
  CHECKOUT_SUCCESS_URL=https://<app>/billing/success \
  CHECKOUT_CANCEL_URL=https://<marketing>/pricing \
  PORTAL_RETURN_URL=https://<app>/settings
# SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY are injected automatically.
```

## 4. Deploy the functions

```bash
supabase functions deploy stripe-create-checkout
supabase functions deploy stripe-create-portal
supabase functions deploy stripe-webhook --no-verify-jwt
```

`--no-verify-jwt` on the webhook only: Stripe calls it unauthenticated and we
verify the **Stripe signature** instead. The other two require a logged-in JWT.

## 5. Register the webhook endpoint

Stripe Dashboard → Developers → Webhooks → add endpoint:
`https://<project-ref>.functions.supabase.co/stripe-webhook`

Subscribe to: `customer.subscription.created/updated/deleted/trial_will_end`,
`invoice.payment_succeeded`, `invoice.payment_failed`. Copy the signing secret
into `STRIPE_WEBHOOK_SECRET` (step 3).

## 6. Test (test mode)

- In the app: Settings → Plan → Upgrade → Stripe Checkout (test card `4242 …`).
- Confirm the webhook writes `subscriptions` within seconds → app shows Solo/Duo.
- Manage subscription → portal opens; change c