# ADR 0012 — Tailwind v3.4, not v4 (with NativeWind v4.2.3)

**Status:** Accepted (Updated 2026-05-09)
**Date:** 2026-05-03
**Deciders:** Petja Klass (founder), Claude (advisor)

## Context

Tailwind CSS v4 was released in early 2025 with significant changes: CSS-first configuration, new plugin API, CSS variables for tokens, automatic content detection. NativeWind v5 is the corresponding version that supports Tailwind v4 in React Native.

Initial v2 of our architecture documents specified Tailwind v4. Tech audit revealed this is premature.

## Decision

**Apex uses Tailwind CSS v3.4 with NativeWind v4.2.3 in production.** Migration to Tailwind v4 + NativeWind v5 deferred until both reach production-stable status (estimated late Stage 2 or Stage 3).

## Reasoning

### NativeWind v5 is explicitly Pre-Release

NativeWind documentation as of February 2026 states v5 is **not recommended for production**. Specific issues:

- NativeWind v5 docs: "NativeWind v5 is built on top of Tailwind v4.1+. You must upgrade your Tailwind configuration and tooling, accordingly. NativeWind v5 uses internal features that depend on Reanimated v4+."
- Community feedback (GitHub Discussions) reports inconsistent class generation, hot-reload issues, Reanimated v4 incompatibilities, and missing edge cases when migrating from v4 to v5.
- Official position from NativeWind team: "v4 is used in production by many apps. v5 is explicitly a pre-release and not yet recommended for production."

For a SaaS product the founder is investing months in, picking pre-release styling infrastructure is reckless.

### Tailwind v4 Marketing Site Compatibility Concern

Even on the Marketing Site (which uses pure Tailwind, not NativeWind), v4 has caveats:

- Plugin ecosystem partially incompatible (`@tailwindcss/forms`, `@tailwindcss/typography` updates lag)
- CSS-first configuration is a different mental model — slower to onboard if Petja wants help from external developers
- `tailwind-merge` and `clsx` patterns we'll use may need adjustments

Tailwind v3.4 is the version 99% of production SaaS apps run today. Vercel, Linear, Cal.com all on v3.4. Battle-tested.

### Monorepo Token Sharing Constraint

We share design tokens across:

- Marketing Site (Tailwind)
- Product App (NativeWind → Tailwind)
- Both via `packages/design-tokens`

If Marketing is on v4 and Product is on v3.4, our shared `tailwind-preset.ts` would need two formats. Adding complexity for no current value. Both on v3.4 keeps the preset clean.

### Future-Proof, Not Future-Locked

This is a deferment, not a rejection. The migration path is clear:

1. Both projects stay on v3.4 until late Stage 2
2. Monitor NativeWind v5 stability releases
3. When NativeWind v5 reaches stable + production-confirmed (typically 2-3 minor releases after pre-release tag drops):
   - Migrate Marketing first (lower risk, fewer files)
   - Migrate Product after one production cycle
4. Tokens migrate to CSS variables format (Tailwind v4 native approach)

Total migration effort estimated: 2-4 days when initiated. Lower if we keep our token usage clean.

## What This Means in Code

### Marketing Site (`apps/marketing`)

```bash
# package.json
"tailwindcss": "^3.4.17",
"@tailwindcss/forms": "^0.5.10",
"@tailwindcss/typography": "^0.5.15",
"prettier-plugin-tailwindcss": "^0.6.11"
```

```typescript
// tailwind.config.ts
import type { Config } from 'tailwindcss';
import preset from '@apex/design-tokens/tailwind-preset';

export default {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  presets: [preset],
} satisfies Config;
```

### Product App (`apps/product`)

```bash
# package.json
"nativewind": "4.2.3",
"tailwindcss": "^3.4.17",
"react-native-reanimated": "^3.16.0",
"react-native-safe-area-context": "^5.0.0"
```

```typescript
// tailwind.config.ts
import type { Config } from 'tailwindcss';
import preset from '@apex/design-tokens/tailwind-preset';
import nativewind from 'nativewind/preset';

export default {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  presets: [preset, nativewind],
} satisfies Config;
```

```javascript
// babel.config.js
module.exports = function (api) {
  api.cache(true);
  return {
    presets: [['babel-preset-expo', { jsxImportSource: 'nativewind' }], 'nativewind/babel'],
  };
};
```

```javascript
// metro.config.js
const { getDefaultConfig } = require('expo/metro-config');
const { withNativeWind } = require('nativewind/metro');

const config = getDefaultConfig(__dirname);
module.exports = withNativeWind(config, { input: './global.css' });
```

### Shared Design Tokens Package

```typescript
// packages/design-tokens/tailwind-preset.ts
import type { Config } from 'tailwindcss';

const preset = {
  theme: {
    extend: {
      colors: {
        // ... mapped from tokens.ts
      },
      spacing: {
        // ... mapped from tokens.ts
      },
      // etc.
    },
  },
} satisfies Partial<Config>;

export default preset;
```

## Trade-Offs

### Positive

- **Production stability** — v3.4 + v4.2.3 is battle-tested, exact pin eliminates accidental upgrade
- **Avoid pre-release bug risk** — solo-founder time is more valuable than v4 features
- **Consistent across both apps** — shared preset works without friction
- **Proven plugin ecosystem** — `@tailwindcss/forms`, `tailwind-merge`, `clsx`, all stable
- **Petja's existing knowledge** — already comfortable with Tailwind v3 patterns from petjaklass.dev

### Negative

- **No CSS variables (Tailwind native)** — we work around with our token system anyway
- **No automatic content detection** — explicit content paths in config, mild inconvenience
- **No CSS-first configuration** — TypeScript config files, mild verbosity

### Neutral

- **No P3 wide-gamut colors yet** — 99% of users on sRGB displays, irrelevant for Stage 1-2
- **No container queries via Tailwind** — not needed in Apex's layout

## When to Revisit

Migrate to Tailwind v4 + NativeWind v5 when:

- NativeWind v5 docs explicitly say "production ready" (drops "pre-release" label)
- At least 2 minor releases after that label drops
- Major React Native libraries we depend on confirm v5 compatibility
- A specific Tailwind v4 feature becomes critical to Apex (currently none)

Do NOT migrate just because "v4 is newer" or "everyone's on v4 now."

## Version History

| Version | Date       | Note                                                                                                                                                                                                                         |
| ------- | ---------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| v4.1.23 | 2026-05-03 | Initial pin                                                                                                                                                                                                                  |
| v4.2.3  | 2026-05-09 | Pinned exact version after >12 months production stability. Known quirks: leere `index.d.ts` erfordert `require`-Workaround; `react-native-css-interop` als explizite Dependency notwendig. Dokumentiert in `apps/product/`. |

## What Triggers Earlier Revisit

- NativeWind v4.2.3 stops receiving security patches
- React Native 0.84+ requires Reanimated v4+ which requires NativeWind v5
- Critical bug in v4.1 with no patch available

## References

- [NativeWind docs (v4 / v5)](https://www.nativewind.dev/)
- [Tailwind CSS v4 announcement](https://tailwindcss.com/blog/tailwindcss-v4)
- [GitHub Discussion: NativeWind v5 migration issues](https://github.com/nativewind/nativewind/discussions/1617)
- [LogRocket: NativeWind v4 vs v5 (Dec 2025)](https://blog.logrocket.com/getting-started-nativewind-tailwind-react-native/)
