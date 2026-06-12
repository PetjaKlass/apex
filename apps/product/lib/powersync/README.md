# PowerSync Teil B — Aktivierungs-Checkliste (wartet auf NEEDS B1–B3)

1. Petja: Supabase SQL-Editor →
   `alter role powersync_role login password '<DEIN-LANGES-PASSWORT>';`
2. PowerSync Dashboard: Instanz (EU) → Connection: Supabase, User `powersync_role`,
   Publication `powersync` (existiert) → Client Auth: Supabase JWKS
   `https://uzbzrcwexifduawmzrfn.supabase.co/auth/v1/.well-known/jwks.json`
3. `powersync/sync-rules.yaml` deployen (bzw. als Sync-Streams übernehmen)
4. `EXPO_PUBLIC_POWERSYNC_URL=<instance-url>` in `apps/product/.env`
5. Claude („Phase 09b"): SDK-Pakete installieren (@powersync/react-native + op-sqlite,
   Web: @powersync/web), schema.map.ts → AppSchema, Connector aktivieren, E2E-Sync-Tests
