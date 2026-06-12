# Phase 01 — Foundation

> **Stage:** Alpha
> **Size:** L (5-7 days)
> **Estimated effort:** ~30-40 hours of focused work
> **Status:** Ready to execute

---

## Goal

Initialize the Apex monorepo with both apps (Marketing + Product), set up tooling, configure TypeScript strict mode, and have hello-world rendering for both apps locally.

By the end of this phase, you'll have a clean, properly-configured project foundation that all subsequent phases build on.

---

## Why Now

This is Phase 01 because **everything else depends on it**. Component implementations, design tokens, auth, database — all of it sits on top of the foundation we build here. Cutting corners here means rebuilding later. Done well, this phase saves weeks of pain in subsequent phases.

This phase establishes:

- The two-apps architecture (Marketing + Product) per ADR 0009
- TypeScript strict, ESLint, Prettier, Lefthook standards per CLAUDE.md
- The folder structure per architecture.md
- The build pipeline (pnpm + Turborepo)

---

## Prerequisites

Before starting this phase, verify these are complete:

### System tools (per SETUP.md)

- [ ] Node.js 20+ installed (`node -v`)
- [ ] pnpm 9+ installed (`pnpm -v`)
- [ ] Watchman installed (`watchman --version`)
- [ ] Git configured (user.name, user.email)
- [ ] Build essentials installed (`gcc --version`)
- [ ] WSL2 Ubuntu environment ready

### GitHub

- [ ] Empty `apex` repository created on GitHub (no README, no .gitignore, no license)
- [ ] SSH access to GitHub working (`ssh -T git@github.com`)

### Knowledge prep

- [ ] Completed Expo SDK 55 tutorial
- [ ] Read Expo Router docs (introduction, file-based routing, layouts)
- [ ] Read NativeWind v4 setup guide
- [ ] Optional: built throwaway hello-world Expo app

### Strategy documents in place

- [ ] All foundation docs from `apex-final/` copied into your local repo
- [ ] CLAUDE.md present at repo root
- [ ] SETUP.md present at repo root
- [ ] All `docs/*` content present

If any of the above is incomplete, **stop and complete them first**. Phase 01 will fail otherwise.

---

## Scope

This phase delivers:

1. Monorepo workspace setup (pnpm + Turborepo)
2. Marketing Site app (Next.js 15) with hello-world page
3. Product App (Expo SDK 55) with hello-world screen
4. TypeScript strict configuration
5. ESLint + Prettier configuration
6. Lefthook pre-commit hooks
7. Shared `tsconfig` configurations
8. Folder structure per architecture.md
9. README.md at repo root
10. .gitignore properly configured
11. Initial commit on `main` branch
12. Both apps run locally (`pnpm dev`)

---

## Out of Scope

These are explicitly NOT in Phase 01:

- ❌ Design tokens implementation (Phase 02)
- ❌ i18n setup (Phase 03)
- ❌ Component implementations (Phases 4-6)
- ❌ Real pages (just hello world, no actual content)
- ❌ Vercel deployment (Phase 13)
- ❌ Supabase setup (Phase 08)
- ❌ Database (Phase 09)
- ❌ Auth (Phase 08)
- ❌ NativeWind/Tailwind classes beyond the bare minimum (Phase 02)
- ❌ Branding, logos, fonts (later)
- ❌ Service worker / PWA manifest (Phase 13)
- ❌ Tests (testing infrastructure comes later)

**If something feels like it belongs here but isn't listed, STOP and ask. Don't expand scope.**

---

## Acceptance Criteria

Phase 01 is **done** when all of these are true:

### Repository state

- [ ] `pnpm-workspace.yaml` exists at repo root
- [ ] `turbo.json` exists at repo root
- [ ] `package.json` at root has correct scripts (dev, build, lint, typecheck)
- [ ] `apps/marketing/` contains a working Next.js 15 app
- [ ] `apps/product/` contains a working Expo SDK 55 app
- [ ] `packages/` directory exists (empty for now, ready for Phase 02)
- [ ] `tsconfig.base.json` at root with strict settings
- [ ] `.eslintrc.json` and `.prettierrc` configured
- [ ] `lefthook.yml` configured with pre-commit hooks
- [ ] `.gitignore` properly excludes `node_modules`, `.next`, `.expo`, etc.
- [ ] `README.md` at root with setup instructions

### Marketing Site (`apps/marketing`)

- [ ] Runs locally: `cd apps/marketing && pnpm dev` opens at http://localhost:3000
- [ ] Shows a hello-world page with "Apex" title
- [ ] No TypeScript errors (`pnpm typecheck`)
- [ ] No ESLint errors (`pnpm lint`)
- [ ] Can build: `pnpm build` succeeds without errors
- [ ] Lighthouse Performance ≥ 95 on localhost (default Next.js setup achieves this)

### Product App (`apps/product`)

- [ ] Runs locally: `cd apps/product && pnpm dev` opens Expo dev tools
- [ ] Shows a hello-world screen with "Apex" title (web view)
- [ ] No TypeScript errors
- [ ] No ESLint errors
- [ ] Expo Router file-based routing works
- [ ] Can build for web: `pnpm build:web` succeeds

### Tooling

- [ ] `pnpm dev` at root runs both apps simultaneously (via Turborepo)
- [ ] `pnpm typecheck` at root checks both apps
- [ ] `pnpm lint` at root lints both apps
- [ ] Pre-commit hook runs typecheck + lint before allowing commit
- [ ] Pre-commit hook fails if there are TypeScript or lint errors

### Git hygiene

- [ ] Initial commit pushed to `main` branch
- [ ] Commit message follows Conventional Commits format
- [ ] No `.env` files committed (use `.env.example` only)
- [ ] No `node_modules` committed

---

## Implementation Plan

This is the step-by-step path. Claude Code: execute these in order, ask before deviating.

### Step 1: Repository initialization (~30 min)

```bash
# Navigate to projects directory
cd ~/projects/personal

# Clone empty repo
git clone git@github.com:PetjaKlass/apex.git
cd apex

# Verify we're in the right directory
pwd  # should show /home/ratchet/projects/personal/apex

# Verify the strategy docs are present
ls -la
ls docs/
```

If `CLAUDE.md`, `SETUP.md`, and `docs/` aren't present, **stop and ask Petja to copy them in first**.

### Step 2: Root package.json + workspace config (~30 min)

Create `package.json` at root:

```json
{
  "name": "apex",
  "version": "0.0.1",
  "private": true,
  "description": "Apex — Life Operating System for Solo Founders and Duos",
  "engines": {
    "node": ">=20.0.0",
    "pnpm": ">=9.0.0"
  },
  "scripts": {
    "dev": "turbo run dev",
    "build": "turbo run build",
    "lint": "turbo run lint",
    "typecheck": "turbo run typecheck",
    "format": "prettier --write \"**/*.{ts,tsx,js,jsx,json,md}\"",
    "format:check": "prettier --check \"**/*.{ts,tsx,js,jsx,json,md}\"",
    "prepare": "lefthook install"
  },
  "devDependencies": {
    "turbo": "^2.5.0",
    "typescript": "^5.7.0",
    "prettier": "^3.4.0",
    "prettier-plugin-tailwindcss": "^0.6.11",
    "lefthook": "^1.10.0",
    "@types/node": "^22.0.0"
  },
  "packageManager": "pnpm@9.15.0"
}
```

Create `pnpm-workspace.yaml`:

```yaml
packages:
  - 'apps/*'
  - 'packages/*'
```

Create `turbo.json`:

```json
{
  "$schema": "https://turbo.build/schema.json",
  "ui": "tui",
  "tasks": {
    "dev": {
      "cache": false,
      "persistent": true
    },
    "build": {
      "dependsOn": ["^build"],
      "outputs": [".next/**", "!.next/cache/**", "dist/**"]
    },
    "lint": {
      "dependsOn": ["^lint"]
    },
    "typecheck": {
      "dependsOn": ["^typecheck"]
    }
  }
}
```

Run:

```bash
pnpm install
```

Verify pnpm and turbo are available.

### Step 3: TypeScript base configuration (~15 min)

Create `tsconfig.base.json` at root:

```json
{
  "$schema": "https://json.schemastore.org/tsconfig",
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["ES2023", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "noEmit": true,
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "noFallthroughCasesInSwitch": true,
    "noUncheckedIndexedAccess": true,
    "forceConsistentCasingInFileNames": true,
    "esModuleInterop": true,
    "isolatedModules": true,
    "resolveJsonModule": true,
    "skipLibCheck": true,
    "jsx": "preserve",
    "incremental": true
  },
  "exclude": ["node_modules", ".next", ".expo", "dist", "build"]
}
```

Note: each app extends this with their specific overrides.

### Step 4: ESLint + Prettier (~30 min)

Create `.prettierrc`:

```json
{
  "semi": true,
  "singleQuote": true,
  "trailingComma": "es5",
  "printWidth": 100,
  "tabWidth": 2,
  "useTabs": false,
  "arrowParens": "always",
  "endOfLine": "lf",
  "plugins": ["prettier-plugin-tailwindcss"]
}
```

Create `.prettierignore`:

```
node_modules
.next
.expo
.turbo
dist
build
ios
android
*.lock
*.log
```

ESLint config will live per-app (Marketing uses Next.js's `eslint-config-next`, Product uses `eslint-config-expo`). Skip root-level ESLint config.

### Step 5: Lefthook pre-commit hooks (~20 min)

Create `lefthook.yml`:

```yaml
pre-commit:
  parallel: true
  commands:
    typecheck:
      run: pnpm turbo run typecheck
    lint:
      run: pnpm turbo run lint
    format-check:
      run: pnpm format:check

pre-push:
  parallel: true
  commands:
    typecheck:
      run: pnpm turbo run typecheck
    lint:
      run: pnpm turbo run lint
```

Run:

```bash
pnpm prepare  # installs lefthook hooks
```

Verify by attempting a commit later (in Step 11).

### Step 6: .gitignore (~10 min)

Create `.gitignore` at root:

```
# Dependencies
node_modules/
.pnpm-store/

# Build outputs
.next/
.expo/
.turbo/
dist/
build/
out/

# Environment
.env
.env.local
.env*.local

# IDE
.vscode/
.idea/

# OS
.DS_Store
Thumbs.db

# Logs
*.log
npm-debug.log*
pnpm-debug.log*
yarn-debug.log*
yarn-error.log*

# Native
ios/
android/
*.keystore

# TypeScript build info
*.tsbuildinfo

# Misc
.cache/
*.pem

# EAS / Expo
.expo-shared/
expo-env.d.ts
```

### Step 7: Marketing Site initialization (~1 hour)

```bash
cd apps
pnpm create next-app@latest marketing --typescript --tailwind --app --eslint --src-dir=false --import-alias="@/*" --use-pnpm --no-turbopack
cd marketing
```

When prompted:

- TypeScript: Yes
- ESLint: Yes
- Tailwind CSS: Yes
- `src/` directory: No
- App Router: Yes
- Import alias: `@/*`
- Turbopack: No (we want stable dev server for now)

After creation, modify `apps/marketing/package.json`:

```json
{
  "name": "@apex/marketing",
  "version": "0.0.1",
  "private": true,
  "scripts": {
    "dev": "next dev --port 3000",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "typecheck": "tsc --noEmit"
  },
  "dependencies": {
    "next": "^15.1.0",
    "react": "^19.0.0",
    "react-dom": "^19.0.0"
  },
  "devDependencies": {
    "@types/node": "^22.0.0",
    "@types/react": "^19.0.0",
    "@types/react-dom": "^19.0.0",
    "eslint": "^9.0.0",
    "eslint-config-next": "^15.1.0",
    "typescript": "^5.7.0",
    "tailwindcss": "^3.4.17",
    "postcss": "^8.4.0",
    "autoprefixer": "^10.4.0"
  }
}
```

Modify `apps/marketing/tsconfig.json`:

```json
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    "plugins": [{ "name": "next" }],
    "paths": {
      "@/*": ["./*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

Modify `apps/marketing/app/page.tsx` to be the Apex hello world:

```tsx
export default function HomePage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-neutral-950 text-white">
      <div className="text-center">
        <h1 className="text-6xl font-bold tracking-tight">Apex</h1>
        <p className="mt-4 text-lg text-neutral-400">Marketing site — coming soon</p>
      </div>
    </main>
  );
}
```

Modify `apps/marketing/app/layout.tsx`:

```tsx
import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Apex',
  description: 'Life Operating System for Solo Founders and Duos',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
```

Test:

```bash
cd apps/marketing
pnpm dev
# Visit http://localhost:3000 → should see "Apex" page
```

Stop the server (Ctrl+C) when verified.

### Step 8: Product App initialization (~1.5 hours)

```bash
cd ../  # back to apps/
npx create-expo-app@latest product --template default
cd product
```

When prompted, accept defaults.

Important: Expo's create-expo-app may install older versions. After creation, **upgrade to SDK 55**:

```bash
# In apps/product
npx expo install expo@latest
npx expo install --fix
```

Verify in `apps/product/package.json`:

- `expo` should be version `~55.x.x`
- `react-native` should be `0.83.x`
- `react` should be `19.2.x` or compatible

Modify `apps/product/package.json`:

```json
{
  "name": "@apex/product",
  "version": "0.0.1",
  "main": "expo-router/entry",
  "scripts": {
    "dev": "expo start",
    "build:web": "expo export --platform web",
    "lint": "expo lint",
    "typecheck": "tsc --noEmit"
  }
}
```

Modify `apps/product/tsconfig.json` to extend base:

```json
{
  "extends": ["../../tsconfig.base.json", "expo/tsconfig.base"],
  "compilerOptions": {
    "strict": true,
    "paths": {
      "@/*": ["./*"]
    }
  },
  "include": ["**/*.ts", "**/*.tsx", ".expo/types/**/*.ts", "expo-env.d.ts"]
}
```

Set up Expo Router:

```bash
npx expo install expo-router react-native-safe-area-context react-native-screens expo-linking expo-constants expo-status-bar
```

Replace `apps/product/app.json` with this minimal config:

```json
{
  "expo": {
    "name": "Apex",
    "slug": "apex",
    "version": "0.0.1",
    "orientation": "portrait",
    "scheme": "apex",
    "userInterfaceStyle": "automatic",
    "newArchEnabled": true,
    "ios": {
      "supportsTablet": true,
      "bundleIdentifier": "dev.petjaklass.apex"
    },
    "android": {
      "package": "dev.petjaklass.apex",
      "edgeToEdgeEnabled": true
    },
    "web": {
      "bundler": "metro",
      "output": "static"
    },
    "plugins": ["expo-router"],
    "experiments": {
      "typedRoutes": true
    }
  }
}
```

Replace existing `apps/product/App.tsx` (or `index.ts`) — we use Expo Router's file-based routing. Delete old root files and create the routing structure:

```bash
# In apps/product
rm -f App.tsx App.js index.ts index.js  # remove default if present
mkdir -p app
```

Create `apps/product/app/_layout.tsx`:

```tsx
import { Stack } from 'expo-router';

export default function RootLayout() {
  return <Stack screenOptions={{ headerShown: false }} />;
}
```

Create `apps/product/app/index.tsx`:

```tsx
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HomeScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.inner}>
        <Text style={styles.title}>Apex</Text>
        <Text style={styles.subtitle}>Product app — coming soon</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0A0806' },
  inner: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: 56, fontWeight: '700', color: '#F5F3EE', letterSpacing: -1 },
  subtitle: { marginTop: 16, fontSize: 16, color: '#888' },
});
```

Test:

```bash
pnpm dev
# Press 'w' to open in web browser
# Should see "Apex" title centered on dark background
```

Stop the server when verified.

### Step 9: Empty packages directory (~5 min)

```bash
cd ../../  # back to repo root
mkdir -p packages
touch packages/.gitkeep
```

This is intentional — we'll fill `packages/` in Phase 02 onward (`design-tokens`, `ui`, `i18n`, `lib`, `types`).

### Step 10: Root README.md (~30 min)

Create `README.md` at repo root:

```markdown
# Apex

Life Operating System for Solo Founders and Duos.

> **Status:** Stage 1 (Alpha) — under active development.

## Quick Start

Prerequisites:

- Node.js 20+
- pnpm 9+
- Watchman

\`\`\`bash

# Clone the repo

git clone git@github.com:PetjaKlass/apex.git
cd apex

# Install dependencies

pnpm install

# Start both apps in development

pnpm dev
\`\`\`

This starts:

- Marketing Site at http://localhost:3000
- Product App via Expo (press `w` for web, scan QR for mobile)

## Project Structure

\`\`\`
apex/
├── apps/
│ ├── marketing/ # Next.js 15 — marketing site
│ └── product/ # Expo SDK 55 — product app
├── packages/ # shared code (design tokens, UI, i18n, etc.)
├── docs/ # strategy + architecture documentation
├── CLAUDE.md # Claude Code persistent context
└── SETUP.md # one-time setup instructions
\`\`\`

## Documentation

Read the strategy and architecture docs in `docs/`:

- `docs/product-vision.md` — what Apex is, who it's for
- `docs/architecture.md` — tech stack, performance budget
- `docs/data-model.md` — database schema, sync rules
- `docs/design-system.md` — design principles + tokens
- `docs/decisions/` — Architecture Decision Records (ADRs)
- `docs/phases/` — implementation roadmap

## Development

\`\`\`bash
pnpm dev # start both apps
pnpm typecheck # type check both apps
pnpm lint # lint both apps
pnpm build # build both apps
pnpm format # format with Prettier
\`\`\`

## License

Proprietary. All rights reserved.
\`\`\`
```

### Step 11: First commit (~15 min)

Verify everything works:

```bash
# From repo root
pnpm typecheck   # should succeed
pnpm lint        # should succeed (with 0 errors)
pnpm format:check  # should succeed
```

If anything fails, fix before committing. Don't `--no-verify` to skip hooks.

Stage and commit:

```bash
git add .
git status  # review what's being committed

# Make sure these are NOT in the list:
# - node_modules/
# - .next/
# - .expo/
# - any .env files

git commit -m "feat: initial monorepo with marketing + product apps

- Set up pnpm workspace with Turborepo
- Initialize Next.js 15 marketing site (apps/marketing)
- Initialize Expo SDK 55 product app (apps/product)
- Configure TypeScript strict mode
- Add Lefthook pre-commit hooks (typecheck + lint + format)
- Add .gitignore, .prettierrc, base tsconfig
- Add README with quick-start instructions

Closes Phase 01."

git push origin main
```

### Step 12: Verification + Documentation (~30 min)

Final verification:

```bash
# Stop any running dev servers, then:

# Test full clean install
rm -rf node_modules apps/marketing/node_modules apps/product/node_modules
pnpm install
pnpm typecheck   # should pass
pnpm lint        # should pass

# Test marketing
cd apps/marketing && pnpm dev
# Verify localhost:3000 shows "Apex"
# Stop with Ctrl+C

# Test product
cd ../product && pnpm dev
# Press 'w' to open web
# Verify "Apex" page renders
# Stop with Ctrl+C
```

If everything passes, Phase 01 is **DONE**.

Update Phase 01 status by appending to a new file `docs/phases/log.md`:

```markdown
# Phase Execution Log

## Phase 01 — Foundation

- **Started:** YYYY-MM-DD
- **Completed:** YYYY-MM-DD
- **Issues encountered:** [brief notes]
- **Time spent:** X hours
- **Notes:** Anything noteworthy for future phases
```

Commit this log:

```bash
git add docs/phases/log.md
git commit -m "docs(phases): log Phase 01 completion"
git push
```

---

## Files Created/Modified

After Phase 01, your repo should contain:

```
apex/
├── .gitignore
├── .prettierrc
├── .prettierignore
├── CLAUDE.md                                    (already present)
├── lefthook.yml                                 (NEW)
├── package.json                                 (NEW)
├── pnpm-lock.yaml                               (NEW)
├── pnpm-workspace.yaml                          (NEW)
├── README.md                                    (NEW)
├── SETUP.md                                     (already present)
├── tsconfig.base.json                           (NEW)
├── turbo.json                                   (NEW)
├── apps/
│   ├── marketing/                               (NEW directory)
│   │   ├── app/
│   │   │   ├── page.tsx                         (modified)
│   │   │   ├── layout.tsx                       (modified)
│   │   │   └── globals.css                      (default Next.js)
│   │   ├── public/
│   │   ├── next.config.ts
│   │   ├── package.json
│   │   ├── postcss.config.mjs
│   │   ├── tailwind.config.ts
│   │   └── tsconfig.json
│   └── product/                                 (NEW directory)
│       ├── app/
│       │   ├── _layout.tsx                      (NEW)
│       │   └── index.tsx                        (NEW)
│       ├── assets/                              (default Expo assets)
│       ├── app.json
│       ├── package.json
│       └── tsconfig.json
├── packages/                                    (empty, with .gitkeep)
└── docs/                                        (already present from setup)
    ├── architecture.md
    ├── data-model.md
    ├── design-system.md
    ├── product-vision.md
    ├── decisions/
    ├── design-system/
    └── phases/
        ├── README.md
        ├── phase-01-foundation.md               (this file)
        └── log.md                               (NEW, after completion)
```

---

## Testing

### Manual tests

1. **Cold install test:** delete all node_modules, run `pnpm install`, then `pnpm dev` — both apps should start
2. **TypeScript test:** intentionally introduce a type error in either app's hello-world page, run `pnpm typecheck` → should fail
3. **Lint test:** intentionally use `console.log` in production code, run `pnpm lint` → should fail (or warn)
4. **Lefthook test:** make a commit with intentional type error → pre-commit hook should reject

### What's NOT tested in Phase 01

- Production builds (we'll test those in Phase 13)
- Cross-platform mobile builds (Phase 21)
- Real Vercel deployment (Phase 13)
- Authentication flows (don't exist yet, Phase 08)

---

## Common Pitfalls

### Pitfall 1: Wrong Node version

**Symptom:** `pnpm install` fails with cryptic errors.
**Cause:** Node 18 instead of Node 20+.
**Fix:** `nvm install 20 && nvm use 20 && nvm alias default 20`

### Pitfall 2: Expo SDK version mismatch

**Symptom:** Newly created Expo app has SDK 52 or earlier.
**Cause:** `create-expo-app` doesn't always pick latest.
**Fix:** Run `npx expo install expo@latest` after creation, then `npx expo install --fix`. Verify `package.json` shows `expo@~55.x.x`.

### Pitfall 3: NativeWind/Tailwind Tailwind classes don't work in Product app

**Symptom:** Tailwind classes have no effect on Expo screens.
**Cause:** **NativeWind is NOT set up in Phase 01.** This is intentional. NativeWind comes in Phase 02 (Design Tokens & Theme System).
**Fix:** Don't use Tailwind classes in `apps/product` yet. Use plain `StyleSheet.create()` for hello world.

### Pitfall 4: Pre-commit hook is slow

**Symptom:** Commits take 30+ seconds.
**Cause:** `pnpm turbo run typecheck` checks all packages.
**Fix:** Acceptable for now. In Phase 13 we'll add caching to speed up.

### Pitfall 5: Conflicting React versions

**Symptom:** TypeScript errors about React types.
**Cause:** Marketing has React 19, Product might have different version after Expo install.
**Fix:** After Step 8, verify both apps have React 19 in their `package.json`. If product has older, run `pnpm install react@19.2.0 react-dom@19.2.0` in `apps/product`.

### Pitfall 6: WSL2 file watching issues

**Symptom:** Code changes don't trigger auto-reload.
**Cause:** WSL2 file system events don't propagate well with Windows-mounted drives.
**Fix:** Make sure you're working in `~/projects/...` (Linux home), NOT `/mnt/c/...`. We're already correctly placed at `/home/ratchet/projects/personal/apex`.

### Pitfall 7: Husky vs Lefthook confusion

**Symptom:** Tutorials online suggest Husky.
**Cause:** Husky is the older standard; we use Lefthook (faster, no Node dependency at runtime).
**Fix:** Stick with Lefthook per CLAUDE.md.

### Pitfall 8: Expo Router needs minimum config

**Symptom:** `Cannot find module 'expo-router/entry'` at app start.
**Cause:** `package.json` `main` field must be set to `"expo-router/entry"` and Expo Router must be installed.
**Fix:** Verify both:

- `apps/product/package.json` has `"main": "expo-router/entry"`
- `expo-router` is in dependencies

### Pitfall 9: Turborepo cache issues

**Symptom:** `pnpm dev` sometimes fails with stale errors.
**Cause:** Turborepo caches aggressively.
**Fix:** Clear cache with `pnpm turbo run dev --force` if you suspect cache issues.

---

## Done When

Phase 01 is **complete** when:

1. ✅ All Acceptance Criteria checked off
2. ✅ All Common Pitfalls verified as not occurring
3. ✅ Initial commit pushed to `main`
4. ✅ Both apps run with `pnpm dev` from repo root
5. ✅ `pnpm typecheck` passes with zero errors
6. ✅ `pnpm lint` passes with zero errors
7. ✅ Lefthook pre-commit hook works (verified by attempting bad commit)
8. ✅ `docs/phases/log.md` updated with Phase 01 completion
9. ✅ Petja confirms readiness for Phase 02

---

## Communication with Petja

**Claude Code: how to communicate during this phase.**

### Stop and ask before:

- Adding any dependency not listed in this phase
- Modifying any file outside the scope listed in "Files Created/Modified"
- Choosing between alternative approaches when not specified
- Encountering errors that aren't in "Common Pitfalls"
- Skipping any acceptance criterion (don't skip, ask first)

### Continue without asking when:

- Fixing typos in your own generated code
- Reformatting code per Prettier
- Resolving lint warnings (not errors)
- Following the explicit step-by-step plan above

### Report format

When this phase is done, report to Petja:

```
✅ Phase 01 — Foundation complete.

What was built:
- Monorepo with pnpm + Turborepo
- Marketing Site (Next.js 15) at apps/marketing
- Product App (Expo SDK 55) at apps/product
- TypeScript strict, ESLint, Prettier, Lefthook configured
- Both apps render hello world

What works:
- pnpm dev starts both apps
- pnpm typecheck passes
- pnpm lint passes
- Pre-commit hook blocks bad commits

What's deferred:
- Vercel deployment (Phase 13)
- NativeWind setup (Phase 02)
- Real branding (later)

Issues encountered: [list any]
Time spent: X hours

Ready for Phase 02 when you are.
```

---

## Phase 01 Reflection (after completion)

After completing Phase 01, take 15 minutes to reflect and update `docs/phases/log.md`:

- What went smoother than expected?
- What took longer than expected?
- What bugs/issues did you encounter?
- What would you do differently?
- Are any of the upcoming phase estimates now suspect?

This reflection compounds. By Phase 10, you'll have great instinct for sizing your own work.

---

## End of Phase 01 Spec

**Next phase:** `docs/phases/phase-02-design-tokens.md`

That phase implements the design tokens, theme provider, and accent system. Don't start it until Phase 01 is fully done.

Good luck. Take it slow. The foundation is what everything sits on.
