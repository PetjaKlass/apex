# SETUP.md — Einmalige Maschinen-Einrichtung

## Windows (Petjas Rechner)

1. **Node.js 22 LTS**: https://nodejs.org → LTS installieren → `node -v`
2. **pnpm** via Corepack: `corepack enable` (Terminal als Admin) → `pnpm -v` (≥9)
3. **Git**: https://git-scm.com → `git config --global user.name "Petja Klass"`,
   `git config --global user.email "peter.klass1990@gmail.com"`
4. **Repo clonen** (NICHT in OneDrive!): z.B. `C:\Dev>` `git clone https://github.com/PetjaKlass/apex.git`
5. `cd apex && pnpm install && pnpm dev`
   - Marketing: http://localhost:3000 · Product: Expo-Devtools, `w` für Web

## Mobile (ab Phase 21)

- Android Studio (Emulator) bzw. physisches Gerät mit Expo Go (nur bis Dev-Builds nötig sind)
- EAS CLI: `pnpm dlx eas-cli login`

## Dienste (Stand 2026-06-12)

| Dienst                       | Status       | Zugang                                                        |
| ---------------------------- | ------------ | ------------------------------------------------------------- |
| GitHub `PetjaKlass/apex`     | ✅           | Fine-grained PAT (läuft 12.07.2026 ab!)                       |
| Supabase „Apex" Frankfurt    | ✅           | Dashboard + MCP; URL https://uzbzrcwexifduawmzrfn.supabase.co |
| Vercel Team                  | ✅ verbunden | Deploys ab Phase 13                                           |
| PowerSync                    | ⏳ Phase 09  | EU-Region wählen, Sync Streams evaluieren                     |
| Resend/Sentry/PostHog/Stripe | ⏳ Stage 2   | siehe docs/NEEDS-FROM-YOU.md                                  |

## Env-Dateien

`.env.local` pro App (gitignored). Vorlage: `docs/NEEDS-FROM-YOU.md` unten.
Publishable/anon Keys sind client-safe; Service-Role-Key NIEMALS clientseitig oder committen.
