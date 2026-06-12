# CLAUDE.md — Persistenter Kontext für AI-Coding-Sessions

> Vor JEDER Arbeit lesen. Bei Phasen-Arbeit zusätzlich: `docs/phases/phase-XX-*.md` (vollständig)
> und `docs/phases/log.md` (Learnings). Bei UI-Arbeit: `docs/design-system.md` + zugehörige
> Spec in `docs/design-system/components/`.

## Projekt

Apex — Life Operating System für Solo-Founder & Duos. Zwei Apps, ein Backend, eine Codebasis:
`apps/marketing` (Next.js, SEO/Conversion) + `apps/product` (Expo universal: Web/iOS/Android).
Backend: Supabase (Frankfurt, eu-central-1) + PowerSync (offline-first). Sprache im Produkt: DE+EN.

## Stack-Wahrheit (Stand 2026-06; bei Major-Updates prüfen & hier aktualisieren)

- Expo SDK 56 / React Native 0.85 / React 19.2 / Expo Router (file-based)
- Next.js (App Router) für Marketing
- TypeScript strict überall, kein `any`
- Tailwind **v3.4** + (ab Phase 02) NativeWind **v4.x stable** — NICHT v4/v5-Kombo (ADR 0012)
- pnpm + Turborepo Monorepo · Lefthook hooks
- Supabase: Projekt-Ref `uzbzrcwexifduawmzrfn` (Frankfurt) — Migrationen via Supabase-MCP/CLI
- Stripe (Phase 22) · Anthropic API (Phase 24, DSGVO: SCC+DPIA nötig, keine EU-Region für Direct API)

## Verbotene Entscheidungen (Auszug, vollständig: docs/architecture.md §Forbidden)

Kein expo-av (→ expo-audio/expo-video) · kein FlatList ≥50 Items (→ FlashList) · kein RN-<Image>
(→ expo-image) · kein AsyncStorage für Hot-Path (→ MMKV) · kein Redux/MobX/Jotai (→ Zustand +
PowerSync-Hooks) · kein GraphQL/tRPC · kein Supabase Realtime im Product (→ PowerSync) ·
kein hand-rolled Auth · keine Modal-Stacks · keine Emojis im UI-Chrome.

## Design (v4.1 „Floating Glass") — Kurzform

Tokens NUR aus `packages/design-tokens` (ab Phase 02). Signaturen: S1 Goldener Faden (nur OBT),
S2 ein Goldpunkt pro Karte (Historie monochrom), S3 Live-Zahlen immer mono+tnum. Karten opak;
Blur nur Panel-Ebene (max. 3); Borders nur Dark; Buttons sind Pills; Motion nur transform/opacity;
prefers-reduced-motion respektieren. Referenz-Prototyp: `docs/design/design-preview-v2.html`.

## Arbeitsweise

1. Phase-Datei lesen → Scope strikt einhalten (Out-of-Scope = nicht anfassen, erst fragen).
2. Kleine Commits, Conventional Commits (`feat:`, `fix:`, `docs:`, `chore:` …), nie `--no-verify`.
3. Nach jeder Phase: `docs/phases/log.md` mit echtem Datum + Learnings ergänzen.
4. Secrets: niemals in Code/Chat/Commits. `.env.local` (gitignored). Service-Role nur serverseitig.
5. Qualitätsgates vor Commit: `pnpm typecheck && pnpm lint && pnpm format:check`.
6. Bei Abweichung von einer Spec: Abweichung im Log dokumentieren (was + warum).

## Befehle

`pnpm dev` (beide Apps) · `pnpm -F @apex/marketing dev` · `pnpm -F @apex/product dev`
`pnpm typecheck` · `pnpm lint` · `pnpm build` · Product-Web-Export: `pnpm -F @apex/product build:web`

## Wichtige Dokumente

product-vision (Positionierung, kanonische Preise €12/€99 · €29/€249) · architecture (Stack,
Kosten, DSGVO-Tabelle) · data-model (Schema + RLS in Schema `app`, PowerSync-Sync-Rules OHNE
Subqueries/JOINs bzw. Sync Streams) · phases/README (Stages & Gates — Dogfooding-Gate nach
Phase 19, vor Payments) · AUDIT-REPORT (bekannte Korrekturen 2026-06-10).

## Lokale Arbeitskopie (seit Phase 02)

`X:\Claude\apex` ist Petjas LOKALER GIT-CLONE. NIEMALS per rsync/Spiegel überschreiben —
Austausch läuft ausschließlich über GitHub (Claude pusht, Petja pullt). Claudes Arbeitskopie
lebt in der Session-Sandbox und wird je Session frisch von origin geclont.
