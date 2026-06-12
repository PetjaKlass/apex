# Apex

Life Operating System for Solo Founders and Duos.

> **Status:** Stage 1 (Alpha) — under active development.

## Quick Start

Prerequisites: Node.js 20+ · pnpm 9+ (`corepack enable`)

```bash
git clone https://github.com/PetjaKlass/apex.git
cd apex
pnpm install
pnpm dev
```

This starts:

- Marketing Site at http://localhost:3000
- Product App via Expo (press `w` for web, scan QR for mobile)

## Project Structure

```
apex/
├── apps/
│   ├── marketing/   # Next.js — marketing site
│   └── product/     # Expo (SDK 56) — product app
├── packages/        # shared code (design tokens, UI, i18n — ab Phase 02)
├── docs/            # strategy + architecture documentation
├── CLAUDE.md        # persistent context for AI coding sessions
└── SETUP.md         # one-time machine setup
```

## Documentation

- `docs/product-vision.md` — what Apex is, who it's for
- `docs/architecture.md` — tech stack, performance budget
- `docs/data-model.md` — database schema, sync rules
- `docs/design-system.md` — design v4.1 „Floating Glass" + Signaturen
- `docs/design-system/components/` — 21 component specs
- `docs/decisions/` — ADRs · `docs/phases/` — roadmap + execution log

## Development

```bash
pnpm dev          # start both apps
pnpm typecheck    # type check all workspaces
pnpm lint         # lint all workspaces
pnpm build        # build all workspaces
pnpm format       # Prettier write
```

## License

Proprietary. All rights reserved.
