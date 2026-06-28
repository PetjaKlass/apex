# Apex — Deployment-Runbook (Phase 13)

> Stand: 2026-06 · Stage-1-Alpha-Deployment auf Vercel. Sync bleibt deferred (Supabase Free,
> kein IPv4) — die App läuft online voll lokal-first; PowerSync wird vor dem Public-Launch aktiviert.

## Architektur (Erinnerung)
Zwei Vercel-Projekte aus EINEM Monorepo:
1. **Marketing** (Next.js) → `apex.<domain>` bzw. `apex-…vercel.app`
2. **Product Web** (Expo static export) → `app.apex.<domain>` bzw. eigenes vercel.app

## Warum der bestehende `apex`-Deploy auf ERROR steht
Das git-verbundene Vercel-Projekt `apex` zeigt aufs Repo-Root und weiß nicht, welche App es
bauen soll (pnpm-Workspace). Lösung: **Root Directory pro Projekt setzen** (Dashboard, kein Code).

## Schritt 1 — Marketing-Projekt (bestehendes `apex` umkonfigurieren)
Vercel → Project `apex` → Settings → General:
- **Root Directory:** `apps/marketing`  ✅ (+ „Include files outside root directory" AN — wegen Workspace)
- **Framework Preset:** Next.js (auto)
- **Install Command:** `pnpm install` · **Build:** `pnpm build` (Default)
- Settings → Functions/Regions: **fra1** (steht in apps/marketing/vercel.json)
- Settings → Environment Variables (Production):
  - `NEXT_PUBLIC_SUPABASE_URL=https://uzbzrcwexifduawmzrfn.supabase.co`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_fisJhYHdd2r_qQjfyyWhYA_zYJEISc6`
  - (optional) `NEXT_PUBLIC_PLAUSIBLE_DOMAIN=<deine-domain>`  (sonst Analytics aus)
- Redeploy → sollte grün werden.

## Schritt 2 — Product-Web-Projekt (NEU anlegen)
Vercel → Add New Project → gleiches Repo `PetjaKlass/apex` → Import:
- **Root Directory:** `apps/product`  (+ „Include files outside root directory" AN)
- **Framework Preset:** Other
- **Build Command:** `pnpm run build:web`  · **Output:** `dist`  (steht in apps/product/vercel.json)
- Environment Variables (Production):
  - `EXPO_PUBLIC_SUPABASE_URL=https://uzbzrcwexifduawmzrfn.supabase.co`
  - `EXPO_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_fisJhYHdd2r_qQjfyyWhYA_zYJEISc6`
  - (Sync später) `EXPO_PUBLIC_POWERSYNC_URL=…`
  - (Telemetrie später) `EXPO_PUBLIC_POSTHOG_KEY=…`, `EXPO_PUBLIC_SENTRY_DSN=…`
- Deploy → liefert eine `…vercel.app`-URL für die App.

## Schritt 3 — Supabase auf die Live-URLs zeigen (Dashboard)
Authentication → URL Configuration:
- **Site URL:** die Product-Web-URL aus Schritt 2
- **Redirect Allowlist:** beide vercel.app-URLs + (sobald Domain) `https://app.<domain>/**`, `https://apex.<domain>/**`
- Plus die offenen CA-Punkte (NEEDS C-Auth): Leaked-PW-Schutz, E-Mail-Templates.

## Schritt 4 — Smoke-Test (auf der Live-URL)
- [ ] Sign-up mit echter E-Mail → (falls Confirmation AN) Mail kommt → bestätigen → App lädt
- [ ] Onboarding durchlaufen → Dashboard zeigt eigene Daten
- [ ] OBT/Task abhaken, Gewohnheit loggen, Quick-Add (⌘K) → bleibt nach Reload
- [ ] PWA installieren: iPhone Safari „Zum Home-Bildschirm", Android/Desktop „Installieren"
- [ ] Lighthouse (Chrome DevTools) ≥ 90 auf Marketing-Landing

## Domain (wenn entschieden, NEEDS C1)
Vercel → Project → Domains: `apex.<domain>` (Marketing), `app.apex.<domain>` (Product).
Cookie-Sharing für den Marketing→App-Handoff funktioniert dann über `.<domain>` (ADR 0009/0013).
Bis dahin: in der App über die eigene Sign-in-Seite anmelden (ADR 0013, lokaler/Standalone-Login).

## Free-Tier-Hinweis
Supabase Free pausiert nach ~1 Woche Inaktivität. Tägliche Nutzung verhindert das. Vor Public-Launch:
Pro ($25) + IPv4 ($4) → entsperrt PowerSync-Sync UND verhindert Pausieren.
