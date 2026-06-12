# Was ich von dir brauche (damit ich ohne Unterbrechung bauen kann)

> **Stand:** 2026-06-10 · Sortiert nach Phase, in der es blockiert.
> Format: was du anlegst → was du mir gibst. API-Keys bitte nie in den Chat einfügen,
> sondern als `.env.local` in den Projektordner legen (Vorlage unten).

---

## A. Sofort (blockiert Phase 01–08)

| # | Was | Wo | Was ich brauche |
|---|-----|----|------------------|
| A1 | ✅ **GitHub-Repo** angelegt: `github.com/PetjaKlass/apex` (leer, erreichbar) | github.com | **NOCH OFFEN:** Fine-grained PAT nur für dieses Repo (Contents: Read/Write, Workflows: Read/Write, 90 Tage) → als Datei `github-token.txt` in den Dev-Ordner legen (A6), NICHT in den Chat |
| A2 | ✅ **Supabase „Apex"** — Region **eu-central-1 Frankfurt** bestätigt, Postgres 17, healthy. URL: `https://uzbzrcwexifduawmzrfn.supabase.co` · Publishable Key: `sb_publishable_fisJhYHdd2r_qQjfyyWhYA_zYJEISc6` (client-safe). Via Connector kann Claude Migrationen/SQL direkt anwenden (ab Phase 08) | supabase.com | nichts mehr — Service-Role wird nie benötigt im Chat |
| A3 | ✅ **Vercel** verbunden (Team „Peter Klass' projects"). Projekte legt Claude beim ersten Deploy an | vercel.com | nichts mehr |
| A4 | **Node-Toolchain lokal** (für `pnpm dev` + `git push` auf deinem Rechner) | — | Node 22 LTS, pnpm ≥9 (`corepack enable`). Claudes Sandbox hat Node 22 bereits |
| A5 | ✅ **Preismodell entschieden:** €99/€249 Jahr | — | — |
| A6 | ✅ **Dev-Ordner verbunden:** `X:\Claude` (inkl. Lösch-Freigabe). Hinweis: Der Cowork-Mount taugt nicht als Git-Arbeitsverzeichnis (Read-after-Write-Inkonsistenz) → **Git-Workflow:** Claude arbeitet im Sandbox-Workspace, **GitHub ist die Quelle der Wahrheit**, nach jedem Push spiegelt Claude den Quellcode (ohne .git/node_modules) nach `X:\Claude\apex` als lesbare Kopie. Lokal entwickeln: am besten selbst `git clone https://github.com/PetjaKlass/apex` | — | — |
| A7 | ✅ **GitHub-Token** liegt in `X:\Claude\github-token.txt` und ist verifiziert (Lesen ✓, Schreiben ✓ via push --dry-run, 2026-06-12). Läuft am **12.07.2026** ab — rechtzeitig erneuern! Hinweis: Ob „Workflows: Read/Write" gesetzt ist, zeigt sich erst beim ersten CI-Push (`.github/workflows/`) — falls der abgelehnt wird, Token-Permissions nachziehen | — | **Phase 01 ist entsperrt** |

## B. Phase 09 (Datenbank + Sync)

| # | Was | Wo | Was ich brauche |
|---|-----|----|------------------|
| B1 | **PowerSync-Account + Instanz** (Region: EU/Ireland) | powersync.com | Instance-URL + Dev-Token. Beim Anlegen fragen: **Sync Streams (neu) oder Sync Rules (klassisch)?** → Ich empfehle Sync Streams; sag mir, was du gewählt hast |
| B2 | **PowerSync DPA** akzeptieren | PowerSync Dashboard → Legal | kurze Bestätigung |
| B3 | **Supabase AVV/DPA** akzeptieren | Supabase Dashboard → Legal | kurze Bestätigung |

## C. Stage 1 Ende / Stage 2 (Phasen 13–23)

| # | Was | Wo | Was ich brauche |
|---|-----|----|------------------|
| C1 | **Finaler Produktname + Domain** (Entscheidung lt. Plan: Ende Stage 1) | z.B. Cloudflare Registrar | Domain + DNS-Zugang (oder du setzt die Records, die ich dir gebe) |
| C2 | **Supabase-Projekt „apex-prod"** (Frankfurt) + Pro-Upgrade ($25/Mon) | supabase.com | wie A2 |
| C3 | **Resend-Account** (EU-Sende-Region) + Domain-Verifizierung | resend.com | API-Key in `.env.local`; DNS-Records setze ich dir auf |
| C4 | **Sentry-Account** (EU-Region!) | sentry.io | DSN (darf in Code) |
| C5 | **PostHog-Account** (EU-Cloud: eu.posthog.com) | posthog.com | Project API Key |
| C6 | **Plausible** (optional — siehe Audit 4.3: evtl. erst später) | plausible.io | Site-ID |
| C7 | **Stripe-Account** (Live erst nach C8!) | stripe.com | Test-Mode: Publishable + Secret Key in `.env.local`; Webhook-Secret nach Setup |
| C8 | **🛑 Steuerberater-Termin (SaaS-erfahren)** vor Stripe-Live | — | Klärung: §19 UStG ja/nein, OSS-Registrierung (BZSt), Gewerbeanmeldung, USt-IdNr. |
| C9 | **Gewerbeanmeldung + USt-IdNr.** (1–2 Wochen Vorlauf) | Gewerbeamt/Finanzamt | für Impressum + Stripe-Verifizierung |
| C10 | **e-recht24-Zugang o.ä.** für Datenschutzerklärung/Impressum/AGB + Anwalts-Review-Budget (€500–1.500) | e-recht24.de | generierte Dokumente DE/EN |
| C11 | **Apple Developer Program** ($99/Jahr — Identitätsprüfung dauert Tage!) | developer.apple.com | Team-ID; App-Store-Connect-Zugang |
| C12 | **Google Play Console** ($25 einmalig — neue Konten brauchen 14-Tage-Testphase mit 12+ Testern! Früh anlegen!) | play.google.com/console | Developer-Account |
| C13 | **EAS (Expo)** Starter-Plan ($19/Mon ab Mobile-Builds) | expo.dev | Account-Verknüpfung |
| C14 | **Produktfotos/Assets**: dein Founder-Foto, ggf. Logo-Wünsche | → `launch/press-kit/` | Dateien in den Ordner legen |

## D. Stage 3 (Phasen 24–32)

| # | Was | Wo | Was ich brauche |
|---|-----|----|------------------|
| D1 | **Anthropic API-Account** + DPA akzeptieren (self-serve in Commercial Terms) | console.anthropic.com | API-Key in `.env.local`; Budget-Limit setzen (z.B. $50/Mon Alarm) |
| D2 | **DSGVO-Entscheidung AI Coach**: Direct API (US, mit SCC+DPIA) **oder** AWS Bedrock / Google Vertex EU-Region | — | deine Wahl (Audit 1.6); DPIA-Dokument erstelle ich dir zur Review |
| D3 | **Google Cloud Console OAuth** (Calendar read-only) + Verification | console.cloud.google.com | Client-ID/Secret; OAuth-Verification kann Wochen dauern — früh starten |
| D4 | **Windows EV-Code-Signing-Zertifikat** (~€350/Jahr, 5–10 Werktage Lieferzeit + Hardware-Token) | z.B. Sectigo/GlobalSign | für Tauri-Desktop; früh bestellen |
| D5 | **100 Zitate/Prinzipien** für Wisdom Library (deine Kuration, EN+DE) | → `content/wisdom/` | Markdown-Liste; ich strukturiere sie |
| D6 | **Stripe Connect** aktivieren (Affiliate-Payouts) | Stripe Dashboard | Bestätigung |

## E. Inhaltliche Entscheidungen (kein Account nötig — nur deine Antwort)

1. **Preismodell** (siehe A5).
2. **Think-and-Grow-Rich-Narrativ** im Marketing nutzen oder neutral bleiben? (Audit 4.2)
3. **„Expan