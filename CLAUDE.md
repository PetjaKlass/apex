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

## NativeWind-Fallen & UI-Verifikation (Lektion 2026-06-29)

NativeWind v4 stylt zur **Laufzeit per JS**, nicht über Klassen-CSS, und verschluckt mehrere Muster STILL:
`bg-gradient-*` (CSS-Verläufe), `dark:` (folgt System, nicht In-App-Theme), `first:`/`last:`/`divide-`,
radiale Hintergründe. ⇒ Goldener Faden NIE mit `bg-gradient` bauen, sondern mit **`<GoldThread>`**
(expo-linear-gradient). Theme-abhängige Borders über das Token **`cardBorder` / Klasse `border-hairline`**,
nie über `dark:`. Reihen-Trenner über explizite Props (`first`), nie `first:`.
**Schriften** müssen aktiv geladen werden (Web/PWA via `app/+html.tsx`: Fontshare Cabinet Grotesk +
Google Inter/JetBrains Mono); sonst System-Fallback und alles wirkt generisch. Native-Bundling (expo-font) erst Stage 2.
**Verifikations-Regel:** „Build grün + Text-im-HTML" beweist NICHT das visuelle Rendering. Für UI-Treue:
gegen die NativeWind-Capability-Liste prüfen, Schrift-Ladung bestätigen, Tokens gegen den Prototyp diffen. Token-Vars IMMER end-to-end prüfen: ein `var(--x)` im Preset, das kein Generator (css-variables.ts/web + native-vars.ts) emittiert, fällt still auf `currentColor` zurück (schwarzer Rand!). `preset-vars.test.ts` bewacht das.

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

## Patch-Regel (Lektion aus Phase 03+05)

Prettier (inkl. Tailwind-Klassen-Sortierung) formatiert Dateien um. Deshalb: NIEMALS gegen
erinnerte/auswendige Strings patchen. Vor jedem Patch die Datei LESEN; Marker per assert prüfen
(Python `assert marker in s`), sonst schlägt der Patch still fehl. Nach `pnpm format` gilt
jeder gemerkte Dateiinhalt als ungültig.

## Supabase Free-Tier (Lektion 2026-06-12)

Das Dev-Projekt pausiert nach ~1 Woche Inaktivität (Status INACTIVE). Reaktivierung:

- **NICHT** `restore_project` aus Reflex aufrufen — direkt eine SQL-Query absetzen weckt es;
  während des Aufwach-Fensters (~1–2 min) liefern Queries kurzzeitig „leeres Schema" /
  Connection-Timeout. Das ist KEIN Datenverlust — abwarten bis get_project = ACTIVE_HEALTHY,
  dann erneut. Migrationen/Daten bleiben erhalten.
- Vor Phase 13: Pro-Plan beseitigt das Pausieren (und ermöglicht PowerSync-IPv4).
