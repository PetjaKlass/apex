# Branded Auth-E-Mail-Templates (Phase 08)

Supabase bietet keine Template-API → einmalig im **Dashboard einfügen**:
Dashboard → Authentication → Emails → jeweiliges Template → HTML ersetzen.

| Template | Datei | Variablen |
|---|---|---|
| Confirm signup | confirm.html | `{{ .ConfirmationURL }}` |
| Reset password | reset.html | `{{ .ConfirmationURL }}` |
| Magic Link | magic-link.html | `{{ .ConfirmationURL }}` |

Außerdem im Dashboard (NEEDS-FROM-YOU D-Auth):
1. Authentication → Sign In / Up → **Leaked password protection: ON** (Advisor-Hinweis)
2. Authentication → URL Configuration → Site URL: `http://localhost:8081` (Dev) — ab Phase 13: `https://app.<domain>`; Redirect-Allowlist: `http://localhost:3000/**`, `http://localhost:8081/**`
3. Entscheidung E-Mail-Bestätigung: Standard AN (production-korrekt). Fürs schnelle lokale Testen optional AUS — dann VOR Phase 13 wieder AN (ADR 0013 Outstanding Task!).
