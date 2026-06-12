# Apex — Design System

> **Version:** v4 — „Floating Glass" (Apple-like Refinement, von Petja freigegeben)
> **Last reviewed:** 2026-06-11
> Authoritative reference for every visual and interaction decision in Apex.
> **Lebende Referenz:** `design/design-preview-v2.html` (interaktiver Prototyp — bei Widerspruch gilt dieses Dokument, der Prototyp wird nachgezogen).
> Component specifications live in `docs/design-system/components/*.md` (read those before implementing UI).
>
> **Was sich in v4 geändert hat (gegenüber v3):**
> 1. **Shell:** Sidebar + Content sind schwebende Frosted-Glass-Panels auf einem Canvas (statt flächigem App-Layout). Mobile: schwebendes Dock statt angedockter Tab-Bar.
> 2. **Farbwelt:** Dark = tiefes Graphit (neutral, statt warmem Braun-Schwarz); Light = Greige-Canvas + weiße Panels. **Light ist Default.** Gold bleibt der einzige Farbimpuls.
> 3. **Radien:** eine Stufe größer (Karten 20px, Panels 26px, Buttons als Pills).
> 4. **Tiefe:** weiche Mehrschicht-Schatten + 1px-Lichtkante (inset highlight) auf Glasflächen.
> 5. **Farbdisziplin verschärft:** Historie/Verlaufsdaten monochrom; Akzent markiert nur „heute/aktiv"; Statusfarben nur als Information (z.B. Streak-Risiko), nie als Dekoration.
> 6. Neue Komponenten: Stat-Card mit Delta-Chip, Segmented Control, Sync-Status-Chip.
> 7. **v4.1 (150%-Pass):** Drei Apex-Signaturen definiert (→ Abschnitt 3b: Goldener Faden, Ein Goldpunkt pro Karte, Zahlen als Schmuck) + Craft-Korrekturen: Kontrast AA-fest, Live-Ziffern immer tabellarisch (mono), Karten opak in beiden Themes, Borders nur im Dark, konzentrische Radien.

---

## Table of Contents

1. [Philosophy](#1-philosophy)
2. [Design Tokens](#2-design-tokens)
3. [Color System](#3-color-system)
4. [Typography](#4-typography)
5. [Iconography](#5-iconography)
6. [Spacing & Layout](#6-spacing--layout)
7. [Component Architecture](#7-component-architecture)
8. [Motion Design](#8-motion-design)
9. [Haptic Design](#9-haptic-design)
10. [Sound Design](#10-sound-design)
11. [Cursor & Pointer](#11-cursor--pointer)
12. [Page Transitions](#12-page-transitions)
13. [Empty States](#13-empty-states)
14. [Loading & Skeleton Patterns](#14-loading--skeleton-patterns)
15. [Toast & Notification Choreography](#15-toast--notification-choreography)
16. [Focus Modes](#16-focus-modes)
17. [Imagery & Photography](#17-imagery--photography)
18. [Accessibility Beyond Compliance](#18-accessibility-beyond-compliance)
19. [Voice & Tone](#19-voice--tone)
20. [Anti-Patterns](#20-anti-patterns)

---

## 1. Philosophy

### What Apex Looks Like

Apex looks like a tool that respects the user's time, intelligence, and ambition. It is the visual equivalent of a leather notebook on a clean desk under good lighting. Premium without being ostentatious. Calm without being boring. Confident without being aggressive.

The aesthetic is what you'd get if **Things 3, Linear, and Arc Browser had a child raised by a Swiss editorial designer**: editorial typography, generous whitespace, restrained color palette, subtle materials and depth, motion that feels like the app is thinking with you rather than performing for you.

The user opens Apex and feels: _this is serious, but it cares about me._

### What Apex Does NOT Look Like

- Not Notion (too white, too sterile, too generic)
- Not Habitica (too gamified, cartoonish, juvenile)
- Not Todoist (too utilitarian, no soul)
- Not Monday (too corporate, too colorful)
- Not iOS default apps (too system-grey, no personality)
- Not Bear or Ulysses (we're not a notes app)

Apex sits in its own visual lane. When users see a screenshot, they should know it's Apex within three seconds.

### Three Hard Rules

**1. Performance is part of design.**
A laggy interaction is an ugly interaction. 60fps or it ships broken. Skipped frames during animations cause unconscious distrust of the product. Every motion respected the budget.

**2. Identity over instruction.**
Copy speaks to who the user is becoming, not to "what to do." We say _"You are someone who completes their morning ritual"_ not _"Don't forget your morning ritual."_ This shapes the entire app's personality — supportive, not nagging.

**3. Restraint over richness.**
When in doubt, remove. Default to fewer borders, fewer shadows, fewer colors, fewer animations. Premium is what you don't put on the page. The discipline of subtraction is what separates Apex from "feature-bloat productivity software."

### What Premium Means in Practice

Premium is not gold accents and serif fonts. Premium is:

- **Touch a button on iPhone, feel a haptic tick** — barely perceptible but present
- **Hover a card on web, watch the cursor become contextual** — the app responds to you
- **Open a modal, see depth communicated through layers** — not just a card with a shadow
- **Type into an input field, experience zero lag** — characters appear before you finish pressing
- **Complete a task, see a 600ms scale-and-fade** — celebration without theatrics
- **Switch to dark mode, watch transitions stagger** — not a hard cut
- **Lose connection, see the app keep working** — offline-first as design, not afterthought
- **Read the empty state, smile** — copy that respects the moment

These are details. They compound. They are the entire point.

### The Tension We Embrace

Apex is **calm but ambitious**. The app should feel like a meditation room with a whiteboard for your future. The user comes to it to think clearly about their life. The visuals support that mood: spacious, ordered, warm-toned, with moments of focused intensity (the Hero card, the Momentum Score, the level-up animation) that punctuate the calm.

We do not chase trends. We do not add features just because competitors have them. We do not shy from white space. We do not apologize for being opinionated.

---

## 2. Design Tokens

All tokens live in `packages/design-tokens/tokens.ts` as a typed TypeScript object. From this single source we generate:

1. **Tailwind preset** for Marketing Site (Tailwind v3.4)
2. **NativeWind preset** for Product App (NativeWind v4.1)
3. **Theme provider** for runtime theme switching
4. **CSS Custom Properties** for runtime variable access

This ensures byte-identical visual output across both apps and across all five distributions of the Product App.

### File Structure

```typescript
// packages/design-tokens/tokens.ts

export const tokens = {
  spacing: {
    /* ... */
  },
  radius: {
    /* ... */
  },
  fontSize: {
    /* ... */
  },
  fontFamily: {
    /* ... */
  },
  fontWeight: {
    /* ... */
  },
  letterSpacing: {
    /* ... */
  },
  lineHeight: {
    /* ... */
  },
  zIndex: {
    /* ... */
  },
  shadow: {
    /* ... */
  },
  duration: {
    /* ... */
  },
  easing: {
    /* ... */
  },
  layoutLayers: {
    /* ... */
  },
} as const;

export const themes = {
  dark: {
    /* color values */
  },
  light: {
    /* color values */
  },
} as const;

export const accents = {
  gold: {
    /* color values */
  },
  silver: {
    /* color values */
  },
  rose: {
    /* color values */
  },
  sapphire: {
    /* color values */
  },
  emerald: {
    /* color values */
  },
  // 'custom' is set at runtime via user input
} as const;

export type Theme = keyof typeof themes;
export type Accent = keyof typeof accents;
```

### Spacing (8px Baseline Grid)

```
--space-0:  0
--space-px: 1px
--space-0.5: 2px
--space-1:  4px
--space-2:  8px
--space-3:  12px
--space-4:  16px
--space-5:  20px
--space-6:  24px
--space-8:  32px
--space-10: 40px
--space-12: 48px
--space-16: 64px
--space-20: 80px
--space-24: 96px
--space-32: 128px
```

**Hard rule:** Never use values outside this scale. If you need 18px, you're solving the wrong problem.

### Border Radius (v4: eine Stufe größer — Apple-like)

```
--radius-none: 0
--radius-xs:   6px    /* small chips, badges */
--radius-sm:   10px   /* nav items, small buttons */
--radius:      14px   /* inputs, list items, inner blocks */
--radius-lg:   20px   /* default cards */
--radius-xl:   26px   /* floating panels (sidebar, content, dock) */
--radius-2xl:  32px   /* modals/sheets, hero cards */
--radius-full: 9999px /* buttons (pill!), avatars, chips, segmented */
```

**v4-Regel:** Buttons sind Pills (`radius-full`). Eckige Buttons gibt es nicht mehr.

### Layout

```
--sidebar-width:        clamp(220px, 17vw, 260px)  /* desktop sidebar */
--sidebar-collapsed:    64px                        /* icon-only mode */
--topbar-height:        56px                        /* desktop top bar */
--card-padding:         clamp(16px, 1.4vw, 24px)
--content-max-width:    1600px                      /* desktop content */
--content-narrow:       760px                       /* journal, knowledge, reading */
--mobile-tabbar-height: 64px                        /* iOS/Android bottom tabs */
--safe-area-top:        env(safe-area-inset-top, 0)
--safe-area-bottom:     env(safe-area-inset-bottom, 0)
```

### Z-Index Layers

Strict ordering. No magic numbers in code.

```
--z-base:      0
--z-content:   1
--z-sticky:    100   /* sticky headers, sticky footers */
--z-dropdown:  200   /* select dropdowns, popover menus */
--z-overlay:   300   /* sidebar backdrop on mobile */
--z-modal:     400   /* dialogs, sheets */
--z-toast:     500   /* notifications */
--z-tooltip:   600   /* tooltips */
--z-debug:     999   /* development overlays only */
```

---

## 3. Color System

### Theme-Aware Architecture

Colors are dynamic via `[data-theme]` and `[data-accent]` attributes on the root element. Components reference semantic tokens, never raw colors.

```html
<!-- Web (Marketing) -->
<html data-theme="dark" data-accent="gold">
  <!-- Product App: theme provider context, same semantic effect -->
  <ThemeProvider theme="dark" accent="gold"></ThemeProvider>
</html>
```

**Three layers of color tokens:**

1. **Semantic** — `bg-base`, `text-primary`, `border` (never use raw hex)
2. **Accent** — `accent`, `accent-bright`, `accent-dim` (theme-aware)
3. **Status** — `success`, `warning`, `danger`, `info`, `onhold` (universal)

### Light Theme (v4: DEFAULT)

```typescript
light: {
  canvas:  '#ECEAE6',                    // Greige-Bühne hinter den Panels (+ 2 weiche Ambient-Radialflächen: Akzent 10%, Blaugrau 10%)
  panel:   'rgba(255,255,255,0.62)',     // schwebende Panels (Sidebar, Content, Dock) — backdrop-blur 28px, saturate 1.5
  panelStrong: 'rgba(255,255,255,0.78)', // Modals/Sheets/Toasts — blur 40px
  bg: {
    card:    '#FFFFFF',                  // Standard-Karten: OPAK (Blur-Budget! Blur nur auf Panel-Ebene)
    cardGlass:'rgba(255,255,255,0.55)',  // sekundäre Glas-Chips/Buttons
    subtle:  '#F2F0EB',                  // Inputs, Wochen-Dots, eingelassene Flächen
    hover:   'rgba(20,18,12,0.045)',
    pressed: 'rgba(20,18,12,0.08)',
  },
  border:  { DEFAULT:'rgba(20,18,12,0.07)', strong:'rgba(20,18,12,0.13)', panel:'rgba(255,255,255,0.65)' },
  text:    { primary:'#1B1A17', secondary:'rgba(27,26,23,0.64)', tertiary:'rgba(27,26,23,0.44)',
             disabled:'rgba(27,26,23,0.22)', inverse:'rgba(255,252,245,0.95)' },  // secondary AA-fest
  edge:    'inset 0 1px 0 rgba(255,255,255,0.85)',  // die Apple-Lichtkante — auf jeder Glas-/Kartenfläche
  hero:    { bg:'#16150F', text:'rgba(255,250,238,0.95)' }, // Kontrast-Karte (OBT): dunkle Karte auf hellem Canvas
}
```

**Warum Greige-Canvas + weiße Panels?** Die schwebenden Flächen erzeugen Tiefe ohne harte Schattenkanten — die „aufgeräumte Schreibtisch"-Anmutung der macOS-Referenz. Karten bleiben opak weiß: Lesbarkeit schlägt Effekt.

### Dark Theme (v4: Graphit statt warmem Braun)

```typescript
dark: {
  canvas:  '#08080A',                    // tiefes neutrales Graphit (+ Ambient: Akzent 14%, Blaugrau 12%)
  panel:   'rgba(255,255,255,0.045)',    // Glas-Panels, blur 28px
  panelStrong: 'rgba(24,24,28,0.72)',    // Modals/Toasts
  bg: {
    card:    '#141417',                 // OPAK (S-Regel: Karten nie transparent; v4.1-Korrektur)
    subtle:  'rgba(255,255,255,0.055)',
    hover:   'rgba(255,255,255,0.07)',
    pressed: 'rgba(255,255,255,0.11)',
  },
  border:  { DEFAULT:'rgba(255,255,255,0.075)', strong:'rgba(255,255,255,0.14)', panel:'rgba(255,255,255,0.09)' },
  text:    { primary:'rgba(248,247,244,0.93)', secondary:'rgba(248,247,244,0.62)', tertiary:'rgba(248,247,244,0.38)',
             disabled:'rgba(248,247,244,0.16)', inverse:'rgba(14,13,10,0.94)' },  // secondary AA-fest
  edge:    'inset 0 1px 0 rgba(255,255,255,0.07)',
  hero:    { bg:'linear-gradient(135deg, accent 16% über #121214, #101013)', border:'accent 30%' }, // OBT: Gold-Glas
}
```

**Warum Graphit statt `#080706`-Braun (v3)?** Die warme Tönung kollidierte mit der Frosted-Glass-Optik (Blur über warmem Grund kippt ins Schmutzige). Neutrales Graphit lässt Gold-Akzent und Glow sauber leuchten. Die Wärme lebt jetzt im Akzent, nicht im Hintergrund. Pure `#000` bleibt tabu (OLED-Vibration).

**v4-Farbdisziplin (neu, wichtig):**

- **Historie ist monochrom.** Verlaufsdaten (Wochen-Dots, Heatmap-Grundstufen, erledigte Items) nutzen Neutraltöne. Der Akzent markiert ausschließlich **heute / aktiv / nächster Schritt** — maximal ein Akzentpunkt pro Karte.
- **Statusfarben sind Information, nie Dekoration.** Beispiel Streak-Badge: neutral per Default; Orange NUR wenn der Streak heute in Gefahr ist. Eine Farbfläche ohne Bedeutungsunterschied ist ein Bug.
- **Akzent-Fills als Verlauf:** `linear-gradient(145deg, accent-bright, accent)` für Primär-Buttons, Brand-Mark, Avatar — flache Accent-Fills wirken im Glas-Kontext tot.
- **Borders sind ein Dark-Mode-Werkzeug.** Im Light trägt der Schatten die Kante (Karten borderless); im Dark, wo Schatten kaum lesbar sind, übernimmt die Hairline. Niemals beides gleich stark.
- **Kontrast-Korrektur:** `text.secondary` auf .64 (light) / .62 (dark) angehoben — die v3-Werte (.52/.55) fielen bei 12–13px unter WCAG AA 4.5:1. Eigene Regel, eigener Verstoß, behoben.

---

## 3b. Apex-Signaturen — was NUR Apex so macht

> Frosted Glass, Pills und Delta-Chips sind die Bühne — die teilt sich Apex mit dem Zeitgeist,
> und sie darf altern. Die Identität liegt in drei Signaturen, die direkt aus der Produktseele
> kommen (Vision → Conviction → One Big Thing → Momentum). Wenn der Glas-Trend stirbt, werden
> die Panels opak — und Apex bleibt zu 100 % erkennbar. Das ist die Definition von zeitlos.

### S1 — Der Goldene Faden

Eine 2px-Gradient-Naht (`accent-bright → accent → transparent`), die das **Zentrum des Tages**
markiert. Sie erscheint ausschließlich an: der OBT-Karte (linke Innenkante), dem heutigen
Wochen-Dot (gefüllt), dem Fokus-Ring und dem Level-Fortschritt. **Nirgendwo sonst — Knappheit
ist ihre Bedeutung.** Der Faden ist die visuelle Übersetzung von Hills „definite chief aim":
ein durchgehender Faden vom Jahresziel bis in die heutige Stunde.
Verbot: Der Faden niemals auf Listen, Headers, Marketing-Deko. Ein Faden pro Screen.

### S2 — Ein Goldpunkt pro Karte

Jede Karte hat **höchstens einen** Akzentpunkt, und er zeigt immer auf JETZT (heutiger Dot,
aktiver Zustand, nächster Schritt). Alles Vergangene ist monochrom. Dadurch liest jeder Screen
sich als Antwort auf eine einzige Frage: „Was ist jetzt dran?" — das ist die Produktthese als
Farbregel.

### S3 — Zahlen als Schmuck

Apex' „Edelstein" sind seine Ziffern: Momentum, Streaks, Timer, XP. Regeln:

- **Jede Zahl, die sich ändern kann, ist tabellarisch** (JetBrains Mono, `tnum`) — Ziffern
  springen NIE beim Zählen. (Cabinet Grotesk garantiert kein `tnum` → für Live-Werte verboten.)
- **Einheiten sind leise:** Wert groß in Mono, Einheit klein in Inter `text-secondary`
  (`11,5 h` → „11,5" 32px mono + „h" 15px ui). Deutsche Formate: Komma, schmales Leerzeichen,
  Tausenderpunkt (2.840).
- Großziffern sind der einzige erlaubte „Display-Moment" in Karten — sie ersetzen Illustrationen.

### Craft-Regeln (Detailpflicht)

- **Konzentrische Radien:** Innenradius = Außenradius − Abstand (Panel 26 − Padding 12 → Nav-Item ≈ 13-14). Gefühlt „satt" statt „fast richtig".
- **Karten sind opak** — beide Themes (dark: `#141417`). Transparenz ist der Panel-Ebene vorbehalten; dreifach gestapeltes Glas macht Hierarchie matschig.
- **Atmen statt blinken:** Lebendigkeit über sehr langsame Opazitäts-Zyklen (Fokus-Glow: 7s, ±30 % Opazität). Niemals Puls-Loops unter 4s außerhalb des Sync-Dots.

### Accent System

Five preset accents plus a custom option. User-selectable in Settings, persisted per-user, applied via `data-accent` attribute.

Each accent provides seven coordinated values:

```typescript
type AccentValues = {
  base: string; // primary brand color
  bright: string; // hover, active states (10% lighter)
  dim: string; // fills, badges (14% alpha)
  glow: string; // subtle aura (7% alpha)
  border: string; // outlined elements (25% alpha)
  text: string; // text on dim background
  shadowAccent: string; // glow shadow for hero elements
};
```

**The five presets:**

| Accent             | Base      | Bright    | Mood                | Use Case                      |
| ------------------ | --------- | --------- | ------------------- | ----------------------------- |
| **Gold** (default) | `#C9993A` | `#E8B84B` | Premium, ambition   | Default for solo founders     |
| **Silver**         | `#8B9AAB` | `#A8B8C8` | Calm, professional  | Operators who want neutrality |
| **Rose**           | `#C4707A` | `#E08890` | Warmth, partnership | Default for Duo workspaces    |
| **Sapphire**       | `#4A7FA5` | `#6099C0` | Focus, depth        | Deep work focused users       |
| **Emerald**        | `#3A7D58` | `#50A070` | Growth, vitality    | Health/habit focused users    |

**Custom accent:** User can pick any hex color. We auto-derive `bright`, `dim`, `glow`, `border`, `text` via HSL transformations. Validation prevents low-contrast picks.

### Status Colors (Universal)

These do NOT change with accent. They have universal meaning.

```typescript
status: {
  success:    '#3A7D58',  // habit completed, goal achieved
  warning:    '#B87A22',  // deadline approaching
  danger:     '#A84444',  // overdue, errors
  info:       '#4A7FA5',  // informational
  onhold:     '#6B6B7B',  // paused, waiting
}
```

Each has a `-dim` variant at 12% alpha for soft fills.

**Why these specific shades?** Each is shifted slightly warm to harmonize with the warm-black/warm-white theme. Pure red (`#FF0000`) clashes; our `#A84444` reads as "important but composed."

### Conviction Gradient

Special case: the Conviction Score (0-100) is a unique element that uses a gradient.

```typescript
const convictionGradient = (score: number) => {
  if (score < 30) return 'linear-gradient(90deg, #A84444, #B87A22)'; // weak
  if (score < 60) return 'linear-gradient(90deg, #B87A22, #C9993A)'; // forming
  if (score < 85) return 'linear-gradient(90deg, #C9993A, #E8B84B)'; // strong
  return 'linear-gradient(90deg, #E8B84B, var(--accent-bright))'; // unshakeable
};
```

This gradient appears on Conviction Score meters, Vision cards. Subtle visual reinforcement of the "weak → strong" psychological progression.

### Layered Depth System (v4)

Apex uses a four-layer depth system. Each layer is one step "above" the previous.

```
Layer 0: canvas        — Greige/Graphit-Bühne + Ambient (nichts liegt direkt darauf außer Panels)
Layer 1: panel (Glas)  — Sidebar, Content-Hülle, Dock (blur, edge, shadow-panel)
Layer 2: card (opak)   — Karten, Listen-Container (edge, shadow-card)
Layer 3: subtle        — Inputs, Dots, eingelassene Blöcke (sitzen „in" ihrer Karte)
Pop:     panelStrong   — Modals/Sheets/Toasts (über allem, blur + shadow-pop)
```

**Hard rule:** Never put a Layer-1 surface inside a Layer-1 surface. Always step up (Layer 1 → Layer 2 if nested) or step in (Layer 1 → Layer 3 for inputs).

This prevents the "card inside a card inside a card" visual chaos that plagues Notion and similar apps.

### Color Contrast Requirements

| Use Case                   | Minimum Ratio   |
| -------------------------- | --------------- |
| Body text on background    | 4.5:1 (WCAG AA) |
| Headings (24px+)           | 3:1             |
| UI components, focus rings | 3:1             |
| Decorative elements        | No requirement  |

All token combinations are pre-tested. Combinations failing AA are not in the design system.

---

## 4. Typography

### Type Stack

```typescript
fontFamily: {
  display: ['Cabinet Grotesk', 'system-ui', 'sans-serif'],
  ui:      ['Inter', 'system-ui', 'sans-serif'],
  mono:    ['JetBrains Mono', 'ui-monospace', 'monospace'],
}
```

**Cabinet Grotesk** for display headers, hero numbers (Momentum, Level), card titles ≥ 24px. Distinctive geometric sans, premium-feeling, available via Fontshare.

**Inter** for everything else. Industry-standard UI font, extensive multilingual support, perfect at small sizes.

**JetBrains Mono** for numbers in dashboards (XP totals, streaks, MRR), data tables, code, and timestamps. Tabular figures by default.

All three fonts are self-hosted in `apps/product/assets/fonts/` for offline support and consistency. Marketing Site loads via `next/font` with display=swap.

### Type Scale

```
--text-2xs:  10px  / 1.4   (labels, microcopy)
--text-xs:   11px  / 1.4
--text-sm:   13px  / 1.5   (small UI, captions)
--text-base: 15px  / 1.5   (body — Apex default)
--text-lg:   18px  / 1.4   (large body, sub-headings)
--text-xl:   24px  / 1.3   (card titles, section headings)
--text-2xl:  32px  / 1.2   (page headings)
--text-3xl:  48px  / 1.15  (hero text)
--text-4xl:  64px  / 1.1   (Momentum score, level numbers)
--text-5xl:  88px  / 1.05  (marketing hero only)
```

**Body font size is 15px, not 14 or 16.** This is deliberate. 14px is too small for extended use; 16px feels juvenile and "browser-default." 15px hits the sweet spot for premium feel.

### Letter Spacing

```
--tracking-tightest: -0.04em  (display, hero numbers only)
--tracking-tight:    -0.02em  (large headings)
--tracking-snug:     -0.01em  (medium headings, button labels)
--tracking-normal:    0em      (body text)
--tracking-wide:      0.05em   (uppercase eyebrows, all-caps)
--tracking-widest:    0.10em   (rare, decorative)
```

**Rule:** Never positive tracking on body text. Body is `tracking-normal` always. Headings get progressively tighter as they grow (better optical balance).

### Font Weights

```
--weight-normal:    400
--weight-medium:    500   /* default for buttons, labels */
--weight-semibold:  600   /* card titles, emphasis */
--weight-bold:      700   /* page headings */
--weight-extrabold: 800   /* hero numbers only */
```

**Cabinet Grotesk**: 400, 500, 700, 800 weights loaded.
**Inter**: 400, 500, 600, 700 weights loaded.
**JetBrains Mono**: 400, 500, 600 weights loaded.

### Use-Case Specifications

These are the canonical typography combinations. Use them as recipes.

**Page Heading (Page Title)**

```
font-display, text-2xl (32px), weight-bold, tracking-tight
color: text-primary
margin-bottom: space-2 (8px)
```

**Section Heading**

```
font-display, text-xl (24px), weight-semibold, tracking-snug
color: text-primary
```

**Card Title**

```
font-ui, text-lg (18px), weight-semibold, tracking-snug
color: text-primary
```

**Body Text**

```
font-ui, text-base (15px), weight-normal, leading-1.5
color: text-primary (or text-secondary for de-emphasis)
```

**UI Label / Button Text**

```
font-ui, text-sm (13px), weight-medium, tracking-snug
color: text-primary (or text-inverse on filled buttons)
```

**Eyebrow / Section Marker**

```
font-ui, text-2xs (10px), weight-semibold, tracking-widest, uppercase
color: text-tertiary
```

**Hero Number (Momentum Score, Level, Timer) — v4.1: MONO, nicht Display**

```
font-mono, 27-54px je Kontext, weight-600, tracking -0.02 bis -0.03em
color: text-primary (Akzent nur wenn der Wert selbst „heute/aktiv" bedeutet)
font-feature-settings: "tnum" — Pflicht: Live-Ziffern springen nie
Einheit: font-ui, ~45% der Wertgröße, text-secondary (siehe Signatur S3)
```

_(v3 sah hier Cabinet Grotesk vor — gestrichen: kein garantiertes `tnum`, Zähl-Animationen ruckeln im Layout. Display-Font bleibt für Titel.)_

**Tabular Number (XP, Streak)**

```
font-mono, text-base (15px), weight-medium, tracking-normal
color: text-primary
font-feature-settings: "tnum"
```

**Caption / Metadata**

```
font-ui, text-xs (11px), weight-normal, tracking-normal
color: text-tertiary
```

### Optical Adjustments

- **Buttons**: text shifted up 1px optically because letterforms sit lower in their box than they appear
- **Numbers in pills/badges**: use `tnum` (tabular numbers) so digits don't jump width as they update
- **Long-form content (Journal, Knowledge)**: max line-length 65 characters for readability
- **All-caps text**: always `tracking-wide` minimum, never lowercase letterspacing applied to uppercase

### What We Don't Do With Type

- ❌ No serif fonts (Apex is modernist, not editorial)
- ❌ No italic for emphasis (use weight or color instead)
- ❌ No underlines except for inline links
- ❌ No drop shadows on text (cheap-feeling)
- ❌ No gradient text except hero numbers (Momentum, Level)
- ❌ No animating font weight (creates layout shift)
- ❌ No more than 3 font sizes on a single screen (typography hierarchy discipline)

---

## 5. Iconography

### Library: Lucide

Apex uses **Lucide React** (web) and **Lucide React Native** (app) for 99% of icons. Same icon set, consistent visual language, ~1500+ icons available.

**Why Lucide over Phosphor / Feather / Heroicons?**

- More icons (1500+ vs 800ish)
- Cleaner outlines (1.5 stroke is the visual sweet spot)
- Tree-shakeable (only imported icons ship)
- Maintained actively
- Renders identically web + native via separate packages with shared design

### Icon Sizing

```
--icon-xs:  14px   /* dense data tables, chips */
--icon-sm:  16px   /* secondary buttons, list rows */
--icon-md:  18px   /* default for buttons, nav items */
--icon-lg:  20px   /* primary buttons, large CTAs */
--icon-xl:  24px   /* feature illustrations, larger UIs */
--icon-2xl: 32px   /* hero icons, empty state illustrations */
```

**Pairing rule:** icon size = label text size + 3px (visual balance).

### Stroke Width

```
Default stroke: 1.5
Heavier (when needed): 2.0  (e.g., navigation active states)
Lighter (when needed): 1.25 (e.g., decorative inline)
```

Never mix stroke widths in the same context. A row of icons must all be the same stroke.

### Color

Icons inherit color from text via `currentColor`. Never hardcode icon colors.

```tsx
<Button variant="primary">
  <Plus size={18} /> {/* automatically white from button text-inverse */}
  Neue Task
</Button>
```

For status icons (success, warning, danger), use the status color tokens directly.

### Custom Apex Marks

Some Apex concepts deserve custom iconography because they're brand-specific:

| Concept             | Icon Strategy                                        |
| ------------------- | ---------------------------------------------------- |
| Momentum            | Custom SVG: stylized particle trail, like a comet    |
| One Big Thing (OBT) | Custom SVG: single bold dot with subtle radial pulse |
| Vision              | Lucide `Telescope` + custom rendering treatment      |
| Conviction          | Custom SVG: layered chevrons, growing toward right   |
| Apex Rank           | Custom SVG: minimal mountain peak                    |
| Streak              | Lucide `Flame` (already great)                       |
| Identity            | Lucide `Fingerprint`                                 |

**Custom marks live in `packages/ui/icons/` as React components.** They render at any size, follow stroke conventions, accept `color` prop.

### Icon Usage Guidelines

**Always:**

- ✅ Match icon size to text size (icon = text + 3px)
- ✅ Use `currentColor` for color inheritance
- ✅ Pair icons with labels in primary actions (accessibility)
- ✅ Provide `aria-label` for icon-only buttons
- ✅ Maintain consistent stroke width within a context

**Never:**

- ❌ Use Lucide for things that need brand identity (use custom marks)
- ❌ Mix Lucide + Phosphor + emoji (pick one system)
- ❌ Decorate icons with shadows or gradients
- ❌ Animate icons by default (special effects only — completion checkmark, loading spinner, sync pulse)
- ❌ Resize icons inline with `transform: scale()` (use the prop)

### Emoji Strategy

Emoji are first-class in Apex for **user-generated content only** (Habits, Areas, Mood, Journal). Never in UI chrome.

**Why?** Habits like "🏃 Running" or "📚 Reading" feel personal. Buttons like "📥 Inbox" feel cheap.

We use a curated emoji picker (~1500 emojis via `emoji-mart`) for habit/area/mood selection. UI chrome stays Lucide-only.

---

## 6. Spacing & Layout

### The 8px Baseline Grid

All layouts snap to multiples of 8px. Half-units (4px) allowed sparingly for typography fine-tuning.

```
4 → typography fine-tuning only
8 → smallest gap (icon-to-text in tight UI)
12 → tight grouping (button to button in cluster)
16 → standard gap (default for most layouts)
24 → comfortable gap (cards in a list)
32 → section gap (related groups within a page)
48 → major section gap (between page regions)
64+ → reserved for marketing or hero content
```

### App Shell Layout (v4: Floating Shell)

```
┌───────────────────────────────────────────────────────────┐
│ Canvas: 100dvh, Greige/Graphit + 2 Ambient-Radialflächen  │
│  padding: 16px · gap: 16px                                │
│  ╭─────────────╮  ╭─────────────────────────────────────╮ │
│  │  Sidebar    │  │ Topbar (60px, transparent)          │ │
│  │  PANEL      │  ├─────────────────────────────────────┤ │
│  │  r=26, Glas │  │ Page  .page { overflow-y: auto }    │ │
│  │  blur 28px  │  │       CONTENT-PANEL r=26, Glas      │ │
│  │  ● ● ●      │  │                                     │ │
│  ╰─────────────╯  ╰─────────────────────────────────────╯ │
│        Mobile: Sidebar weg → schwebendes Dock (unten,     │
│        r=26, blur, width ≤ 440px, 12px über Safe-Area)    │
└───────────────────────────────────────────────────────────┘
```

**Traffic Lights** (macOS-Punkte) erscheinen oben in der Sidebar — nur Desktop-App (Tauri) echt, im Web dekorativ ausblendbar.

**Blur-Budget (Performance ist Teil des Designs):** `backdrop-filter` ist GPU-teuer. Erlaubt auf: Sidebar-Panel, Modals/Sheets, Toasts, Dock, Command Palette. Das Content-Panel rendert auf schwachen Geräten opak (`panelStrong` als Fallback); Karten sind IMMER opak. Mehr als 3 gleichzeitig geblurte Flächen = Review-Fail.

**Breakpoints der Shell:** ≥1024 volle Sidebar (230–264px) · 768–1023 Icon-Rail (72px) · <768 Dock.

**Forbidden:**

- `min-height: 100vh` inside the app (use `100dvh` only on shell)
- `overflow: visible` on layout containers
- Hardcoded pixels outside design tokens
- Empty space at the bottom of pages (every page must fill viewport meaningfully)

### Mobile Layout (Native)

```
┌──────────────────────────┐
│ Status Bar (system)      │
├──────────────────────────┤
│ Safe Area Top (notch)    │
├──────────────────────────┤
│ Header (44-56px)         │
├──────────────────────────┤
│                          │
│ ScrollView Content       │
│ padding-h: 16px          │
│                          │
│                          │
├──────────────────────────┤
│ Bottom Tabs (64px)       │
├──────────────────────────┤
│ Safe Area Bottom         │
└──────────────────────────┘
```

`useSafeAreaInsets()` is mandatory on every screen. Never assume edge-to-edge.

### Layer Depth Rules

Recap from Section 3, restated as layout rules:

- **Layer 0 (`bg-base`)**: app shell background, page background
- **Layer 1 (`bg-raised`)**: primary cards, list items, dialogs
- **Layer 2 (`bg-overlay`)**: dropdowns, popovers, secondary cards on cards
- **Layer 3 (`bg-subtle`)**: inputs, code blocks, "inset" elements

**Never nest:** card-on-card-on-card. If Layer 1 contains another card, it's Layer 2. If Layer 2 contains another card, you have a layout problem.

### Border Strategy

Borders are **subtle, low-contrast**. The default border is `rgba(255, 251, 240, 0.07)` (dark theme) — barely perceptible but defines edges.

**When to use borders:**

- ✅ Cards (subtle definition without weight)
- ✅ Inputs (focus state)
- ✅ Dividers between list items
- ✅ Accent buttons (when filled would be too heavy)

**When NOT to use borders:**

- ❌ Modals (use shadow + Layer 2 background instead)
- ❌ Dropdowns (use shadow only)
- ❌ Hover states on already-bordered elements (border color shift instead)

### Shadow Strategy (v4: weiche Tiefe + Lichtkante)

Shadows communicate elevation, never decoration. v4 arbeitet mit **zwei Schichten + Edge**: ein enger Kontaktschatten, ein weiter weicher Schatten, plus die 1px-Lichtkante oben (`--edge`).

```
/* Light */
--shadow-card:  0 2px 10px rgba(25,22,15,.05), 0 10px 30px rgba(25,22,15,.06)
--shadow-panel: 0 18px 50px rgba(25,22,15,.10), 0 2px 10px rgba(25,22,15,.05)
--shadow-pop:   0 28px 80px rgba(25,22,15,.20), 0 6px 20px rgba(25,22,15,.10)
/* Dark */
--shadow-card:  0 1px 2px rgba(0,0,0,.35), 0 12px 32px rgba(0,0,0,.30)
--shadow-panel: 0 24px 70px rgba(0,0,0,.55), 0 2px 10px rgba(0,0,0,.4)
--shadow-pop:   0 36px 100px rgba(0,0,0,.7), 0 8px 24px rgba(0,0,0,.5)
--edge:         inset 0 1px 0 rgba(255,255,255,.85 light / .07 dark)
```

**Shadow assignment by element:**

- Primär-Buttons: weicher Akzent-Glow (`0 6px 18px accent-glow`) + edge — der einzige „leuchtende" Button
- Sekundär-Buttons & Cards: `shadow-card` + edge
- Cards (hovered): translateY(-2px) + `shadow-panel` (Lift)
- Floating Panels (Sidebar/Content/Dock): `shadow-panel` + edge
- Modals/Sheets/Toasts: `shadow-pop` + edge
- Tooltips: `shadow-card`

**Forbidden:** Animating shadows. They are not GPU-friendly. Use `transform: translateY` for "lift on hover" effects instead.

### Responsive Breakpoints

```
--breakpoint-sm:  640px   /* phones in landscape */
--breakpoint-md:  768px   /* tablets portrait */
--breakpoint-lg:  1024px  /* tablets landscape, small laptops */
--breakpoint-xl:  1280px  /* standard laptops */
--breakpoint-2xl: 1536px  /* large displays */
```

**Mobile-first:** All styles assume mobile. Desktop styles added via `lg:` and `xl:` breakpoints in NativeWind/Tailwind classes.

**Sidebar collapse breakpoint:** 1024px (below this, sidebar becomes drawer/sheet on mobile).

### Container Widths

```
--container-narrow: 760px   /* journal, knowledge entries, reading content */
--container-default: 1280px /* most app content */
--container-wide:    1600px /* dashboard, calendar, kanban */
--container-full:    100%   /* edge-to-edge tools */
```

Center horizontally with `mx-auto` always; never `position: absolute` for layout.

---

## 7. Component Architecture

This section is the index of all component specifications. Detailed specs live in `docs/design-system/components/*.md`.

### Component Spec Files

Each component has its own detailed spec file. Read the relevant file before implementing or modifying any component. Format includes: anatomy, variants, sizes, all states, micro-interactions, edge cases, accessibility, implementation notes.

**Foundation Components (15):**

1. `button.md` — All button variants, sizes, states, micro-interactions
2. `input.md` — Text input, number input, search variants
3. `textarea.md` — Multi-line input, auto-resize
4. `select.md` — Custom dropdown (no native `<select>`)
5. `checkbox.md` — Including indeterminate state
6. `toggle.md` — On/off switch
7. `radio.md` — Radio groups
8. `card.md` — All card variants and interactions
9. `modal.md` — Dialogs, sheets, drawers
10. `toast.md` — Notification toasts (5 types including XP)
11. `tooltip.md` — Hover/focus tooltips
12. `avatar.md` — Initials fallback, status dot
13. `badge.md` — Pills, status indicators, counters
14. `progress.md` — Linear and circular progress
15. `skeleton.md` — Loading state shimmer

**Apex-Specific Components (6):** 16. `task-row.md` — The most-used component in Apex 17. `habit-card.md` — Streak flame, completion animation 18. `momentum-orb.md` — Hero element on dashboard 19. `obt-hero.md` — One Big Thing as hero card 20. `focus-timer.md` — Pomodoro circular timer 21. `vision-card.md` — Image + Conviction Meter

### Component Implementation Standards

These apply to every component:

**File location:**

- Foundation components: `packages/ui/components/<Name>.tsx`
- Apex-specific: `apps/product/components/<feature>/<Name>.tsx`

**Required exports:**

```typescript
export type ButtonProps = {
  /* ... */
};
export function Button(props: ButtonProps): React.ReactElement {
  /* ... */
}
```

**Required testing:**

- Storybook stories covering all variants × states × themes × accents
- Unit tests for behavior (Vitest)
- Visual regression tests (Phase 24+)

**Required documentation:**

- JSDoc comment on the component explaining purpose
- Inline comments only for non-obvious logic
- Props interface with descriptions

### Component Composition Rules

**Atomic Design loosely applied:**

```
Atoms       → packages/ui/atoms/*       (Button, Input, Avatar, ...)
Molecules   → packages/ui/molecules/*   (FormField, MenuItem, ...)
Organisms   → apps/product/components/*  (TaskRow, HabitCard, ...)
Templates   → apps/product/app/*/_layout.tsx
Pages       → apps/product/app/*.tsx
```

**Hard rules:**

- Atoms never import other atoms (they're truly atomic)
- Molecules can import atoms only
- Organisms can import atoms + molecules
- Pages can import everything

This keeps the dependency graph clean and prevents circular imports.

---

## 8. Motion Design

Motion is what separates Apex from generic apps. It's also where most apps fail. We follow Disney's 12 principles of animation, applied to UI.

### Philosophy

**Motion serves three purposes:**

1. **Feedback** — confirming the user's action ("yes, I heard you")
2. **Continuity** — explaining where things came from / went ("this card became that screen")
3. **Personality** — adding subtle warmth ("this app has a soul")

Motion that doesn't serve one of these is removed.

### Easing Curves

```typescript
duration: {
  instant: 100,   // immediate feedback
  fast:    150,   // hover, color shifts
  base:    250,   // standard transitions
  slow:    400,   // page transitions, sheet openings
  slower:  600,   // celebratory moments
  long:    1500,  // confetti, level-up sequences (max)
}

easing: {
  // Spring-like, with subtle overshoot — for entrances
  spring:    'cubic-bezier(0.16, 1, 0.3, 1)',

  // Aggressive overshoot for personality — chevron slides, button presses
  springy:   'cubic-bezier(0.34, 1.56, 0.64, 1)',

  // Smooth deceleration — for exits
  springOut: 'cubic-bezier(0.4, 0, 0.2, 1)',

  // Linear acceleration — for ongoing motion (rotations)
  linear:    'linear',

  // Standard easing in/out
  easeIn:    'cubic-bezier(0.4, 0, 1, 1)',
  easeOut:   'cubic-bezier(0, 0, 0.2, 1)',
}
```

**Spring is the default.** It's what Apple uses. It feels "physical" without being cartoonish.

**Springy is special-purpose.** Use for moments where personality is welcome (chevron slide, success checkmark). Never for continuous use (would feel chaotic).

### What's Allowed to Animate

GPU-accelerated properties only. **No exceptions.**

✅ **Allowed:**

- `transform: translateX/Y/Z, scale, rotate`
- `opacity`
- `background-color` (only on hover, never on click)
- `border-color` (only on hover/focus, instant on focus)
- `color` (only on hover)

❌ **Forbidden:**

- `width`, `height`, `top`, `left`, `right`, `bottom`
- `padding`, `margin`
- `box-shadow` (animate via opacity-on-pseudo trick if needed)
- `filter` (extremely expensive)
- `border-width` (causes layout shift)

### Standard Durations by Interaction Type

| Interaction                  | Duration                     | Easing        |
| ---------------------------- | ---------------------------- | ------------- |
| Hover state change           | 150ms                        | springOut     |
| Focus ring appearance        | instant (0ms)                | —             |
| Button press scale           | 100ms                        | linear        |
| Button release               | 150ms                        | spring        |
| Modal open                   | 250ms                        | spring        |
| Modal close                  | 200ms                        | springOut     |
| Page transition              | 300ms                        | spring        |
| Sheet/drawer slide           | 350ms                        | spring        |
| Toast slide-in               | 300ms                        | spring        |
| Toast auto-dismiss           | 300ms fade-out               | easeIn        |
| List item add                | 250ms                        | spring        |
| List item remove             | 200ms                        | springOut     |
| Checkbox check               | 200ms                        | springy       |
| Habit completion celebration | 600ms                        | spring        |
| XP toast                     | 300ms slide + 500ms count-up | spring        |
| Level-up overlay             | 1500ms total sequence        | spring        |
| Confetti                     | 1500ms max                   | gravity-based |

### Choreography

When multiple elements animate together, they must be choreographed — not all happen at once.

**Stagger pattern:**

```
First element animates (0ms delay)
Second element (40ms delay)
Third element (80ms delay)
Subsequent elements (50ms each)
```

**Use cases:**

- List of cards entering the viewport
- Form fields appearing in onboarding
- Dashboard widgets loading

**The 40ms initial offset matters.** Too short and it looks simultaneous. Too long and it feels slow. 40ms is the perceptual sweet spot.

### Motion Principles Applied

**1. Anticipation** — before motion happens, prepare the user.

- Example: hover a button, see it "wake up" via subtle bg shift, before clicking it animates further.

**2. Follow-through** — motion doesn't stop instantly, it decelerates.

- Example: drawer doesn't snap to position, it eases in over 350ms.

**3. Squash and stretch** — applied subtly to scale.

- Example: button press squashes to 0.97, not 0.95 (too cartoonish) or 0.99 (imperceptible).

**4. Slow in, slow out** — never linear motion for UI (only for indicators like spinners).

- Example: every motion uses easing curves, not `transition-timing-function: linear`.

**5. Arcs** — natural motion follows curves, not straight lines.

- Example: when a card moves from one position to another, it can ease via Bezier curve through space.

### Reduced Motion

`prefers-reduced-motion: reduce` is respected globally. When set:

- All durations become `1ms` (effectively instant)
- Animations become opacity-only (no transforms)
- Confetti, level-up sequences are skipped
- Stagger becomes simultaneous

**Never disable reduced-motion.** It's an accessibility right.

### Performance Targets

Every animation must hit 60fps on:

- iPhone 12 (mid-range mobile)
- Pixel 6 (mid-range Android)
- 5-year-old MacBook Air (low-end web)

Test with Chrome DevTools Performance tab. If frame rate dips below 58fps, the animation is broken.

---

## 9. Haptic Design

Haptic feedback is a **massive premium differentiator** on mobile that costs almost nothing to implement. Apex uses haptics deliberately, never gratuitously.

### Library

`expo-haptics` for both iOS and Android. Same API.

```typescript
import * as Haptics from 'expo-haptics';

// Three impact strengths
Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); // taps, hovers
Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium); // selections
Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy); // confirmations

// Notification haptics
Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);

// Selection (subtle, for sliders, scrubs)
Haptics.selectionAsync();
```

### When to Trigger Haptics

| Interaction                     | Haptic               | Reason                          |
| ------------------------------- | -------------------- | ------------------------------- |
| Button press (primary)          | Light                | Acknowledge the press           |
| Button press (secondary, ghost) | None                 | Avoid haptic fatigue            |
| Toggle switch                   | Medium               | "Click" feeling                 |
| Checkbox check                  | Light                | Subtle confirmation             |
| Tab switch                      | Light                | Spatial anchor                  |
| Pull-to-refresh trigger         | Medium               | "Released" feeling              |
| Long-press detected             | Medium               | Contextual menu about to appear |
| Habit completed                 | Success notification | Celebration                     |
| Task completed                  | Light                | Quick acknowledgment            |
| Daily Focus complete            | Success notification | Major moment                    |
| Level up                        | Success notification | Major celebration               |
| Slider scrubs (Energy slider)   | Selection (per tick) | Tactile feedback                |
| Error / form rejection          | Error notification   | "Stop, that's wrong"            |
| Swipe-to-delete confirms        | Heavy                | "This is destructive"           |

**Total haptics per minute should rarely exceed 5-6.** Otherwise it becomes haptic fatigue and feels cheap.

### When NOT to Trigger Haptics

- ❌ Hovering (no haptics on web, hover doesn't exist on touch)
- ❌ Scrolling
- ❌ Typing (haptics on every keystroke = nightmare)
- ❌ Loading states (no need)
- ❌ Background events the user didn't initiate
- ❌ When user is in Focus Mode / Cinema Mode (silent unless explicit interaction)

### User Setting

Settings → Preferences → Haptic Feedback (toggle, on by default)

When off: no haptics fire anywhere. App still works fully. Some users (sensitive to vibration) prefer off.

### Web Behavior

Haptics don't exist on web. Code path:

```typescript
// utils/haptics.ts
export const tapLight =
  Platform.OS === 'web' ? () => {} : () => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
```

Components call `tapLight()` indiscriminately; native triggers haptics, web is no-op.

---

## 10. Sound Design

Sound is **opt-in, off by default.** Most users hate app sounds. The few who love them really love them.

### Philosophy

Apex sounds, when on, are:

- **Subtle** — never alarming or attention-grabbing
- **Earthy** — wood, paper, soft impacts (not digital beeps)
- **Sparse** — major moments only

The vibe is "leather notebook" not "video game."

### Sound Catalog

Stored in `apps/product/assets/audio/ui/`. All as MP3 (smallest universal format).

| Sound                  | Duration | Trigger                 | Description              |
| ---------------------- | -------- | ----------------------- | ------------------------ |
| `task-complete.mp3`    | 0.4s     | Task marked done        | Soft paper-flip          |
| `habit-complete.mp3`   | 0.5s     | Habit logged            | Wooden tap with reverb   |
| `level-up.mp3`         | 1.2s     | Level up                | Soft bell, single tone   |
| `streak-milestone.mp3` | 1.0s     | 7d/30d/90d/365d streak  | Layered chime            |
| `focus-start.mp3`      | 0.3s     | Focus session begins    | Tibetan bowl, very quiet |
| `focus-end.mp3`        | 0.6s     | Focus session ends      | Same bowl, longer ring   |
| `notification.mp3`     | 0.3s     | In-app notification     | Soft tap                 |
| `error.mp3`            | 0.2s     | Form error or rejection | Subtle "tsk"             |

**File size budget:** all UI sounds combined < 500KB.

### Ambient Focus Sounds (Different from UI Sounds)

For Focus Mode, we provide ambient backgrounds. These are real field recordings, licensed.

Stored in `apps/product/assets/audio/ambient/`. As OGG (smaller for long files) with MP3 fallback.

| Sound            | Duration            | Use                          |
| ---------------- | ------------------- | ---------------------------- |
| `rain.ogg`       | 5min loop, seamless | Light rain on window         |
| `forest.ogg`     | 5min loop           | Forest birds, leaves         |
| `cafe.ogg`       | 5min loop           | Café murmur, distant chatter |
| `ocean.ogg`      | 5min loop           | Wave on sand, no seagulls    |
| `whitenoise.ogg` | 30s loop            | Pure white noise             |
| `fire.ogg`       | 5min loop           | Crackling fire               |
| `night.ogg`      | 5min loop           | Crickets, distant owl        |

**File size budget:** all ambient sounds combined < 12MB. Bundled with app (offline-first).

**Source:** Freesound.org with CC0 / commercial-permissive licenses, or paid library (Splice).

### Sound Settings

Settings → Preferences → Sound:

```
[ ] Enable UI sounds (default: off)
[ ] Enable focus mode ambient sounds (default: on)

Master volume: [slider 0-100%]
```

Two separate toggles because users might want ambient (yes, it's relaxing) but not UI sounds (no, they're annoying).

### Implementation

```typescript
// utils/sound.ts
// KORRIGIERT: `Audio.Sound.createAsync` war die ALTE expo-av-API (in SDK 55+ entfernt).
// expo-audio nutzt createAudioPlayer / useAudioPlayer.
import { createAudioPlayer, type AudioPlayer } from 'expo-audio';

const playerCache = new Map<string, AudioPlayer>();

function getPlayer(name: UISound): AudioPlayer {
  let player = playerCache.get(name);
  if (!player) {
    player = createAudioPlayer(SOUND_SOURCES[name]); // require('.../task-complete.mp3')
    playerCache.set(name, player);
  }
  return player;
}

export type UISound = 'task-complete' | 'habit-complete' | 'level-up' /* ... */;

export function playUISound(name: UISound) {
  const settings = useSettingsStore.getState();
  if (!settings.uiSoundsEnabled) return;

  const player = getPlayer(name);
  player.seekTo(0);
  player.play();
}

// Beim App-Teardown: playerCache.forEach(p => p.release())
```

### Web Behavior

Web supports HTML5 `<audio>` elements for the same playback. UI sounds work identically on web.

Ambient sounds use Web Audio API on web for crossfade between tracks.

---

## 11. Cursor & Pointer

This section is **web-only** (cursors don't exist on touch devices). It's a small detail with disproportionate impact on perceived premium-ness.

### Default Cursor Strategy

Apex follows a strict cursor hierarchy. Each interactive element has a meaningful cursor.

```css
/* Defaults */
html,
body {
  cursor: default;
}

/* Interactive elements */
button:not(:disabled),
[role='button']:not(:disabled),
a:not(:disabled),
[role='link']:not(:disabled) {
  cursor: pointer;
}

/* Disabled */
button:disabled,
[aria-disabled='true'] {
  cursor: not-allowed;
}

/* Loading */
[aria-busy='true'] {
  cursor: wait;
}

/* Text input */
input[type='text'],
input[type='email'],
textarea {
  cursor: text;
}

/* Drag handles */
[data-draggable='true'] {
  cursor: grab;
}
[data-dragging='true'] {
  cursor: grabbing;
}

/* Resizable elements */
[data-resizable='horizontal'] {
  cursor: col-resize;
}
[data-resizable='vertical'] {
  cursor: row-resize;
}

/* Help / contextual info */
[role='tooltip-trigger'] {
  cursor: help;
}
```

### Custom Cursor (Stage 3 Premium Touch)

Stage 3 adds an optional custom cursor that subtly responds to interactive elements. Off by default; toggle in Settings.

**Behavior when on:**

- Default state: small dot (4px) following pointer with 60ms easing lag
- Hover interactive: dot expands to 24px circle with subtle blur
- Hover button: dot fills to button color, subtle "magnetic snap" toward center
- Click anywhere: brief radial pulse from click point

This is what Linear, Arc Browser, and luxury sites do. It's the kind of detail people screenshot.

**Implementation:** CSS-only via `mix-blend-mode: difference` on a fixed-position element. Performance budget: must be 60fps via `transform` only.

**Decision deferred to Stage 3** because it requires careful tuning. Stage 1-2 use default browser cursors (still well-styled per above).

---

## 12. Page Transitions

Page transitions communicate the relationship between screens. Done well, they teach users the app's information architecture without explanations. Done poorly, they cause motion sickness.

### Hierarchy of Transition Types

**1. Lateral (sibling) — slide from right**

- Used when: navigating between same-level pages (Tasks → Habits → Goals)
- Duration: 300ms
- Easing: `spring`
- Reverses on back navigation (slide from left)

**2. Modal (overlay) — fade + scale**

- Used when: opening dialogs, side panels, settings
- Duration: 250ms
- Scale: 0.96 → 1.0
- Opacity: 0 → 1
- Backdrop blur: 0 → 8px
- Easing: `spring`

**3. Drill (deeper) — slide from right + parallax**

- Used when: tapping into detail view (Task → Task Detail)
- Duration: 350ms
- Detail screen slides in from right
- Parent screen slightly translates left (-15% of width) and dims (opacity 0.7)
- Creates depth illusion
- Easing: `spring`

**4. Sheet (mobile bottom drawer) — slide from bottom**

- Used when: contextual quick actions, share sheets
- Duration: 350ms
- Easing: `spring`
- Closes via downward swipe (gesture)
- Backdrop fades 0 → 0.5 opacity

**5. Onboarding (first-time) — full screen fade**

- Used when: switching between onboarding steps
- Duration: 400ms (slightly slower for "moment")
- Easing: `spring`
- Old content fades out, new content fades in (crossfade with 100ms overlap)

**6. Focus Mode (cinema) — full screen reveal**

- Used when: entering Daily Focus, Morning Ritual, Evening Ritual
- Duration: 400ms
- Sidebar + Topbar fade out (200ms)
- Page background expands to fill (200ms delay, 200ms duration)
- Easing: `springOut`

### Choreography Rules

- **No two pages animate simultaneously** unless they're crossfading (onboarding only)
- **Scroll position resets** to top on lateral transitions (not on drill, where back-nav restores position)
- **Active element stays focused** through transition (focus follows the user)
- **Loading states show skeleton** during transition if data isn't ready (no flash of empty)

### Implementation

**Web (Marketing + Product Web):**

- View Transitions API (now widely supported in 2026)
- Falls back to manual CSS animations on older browsers

**Mobile (Native):**

- React Navigation v7 stack animations (built into Expo Router 5)
- Custom animations for special transitions (Focus Mode reveal)

**Reduced motion:**

- All page transitions become instant (1ms duration)
- Cross-fade preserved (just much faster)
- This is non-negotiable for accessibility

---

## 13. Empty States

Empty states are unmissable opportunities. Most apps treat them as failures ("Nothing here yet 😔"). Apex treats them as **invitations**.

### Anatomy of an Apex Empty State

```
┌─────────────────────────────────────────┐
│                                         │
│         [SVG illustration]              │  ← line-art, single color, ~120px
│                                         │
│         Title here                      │  ← font-display, text-xl
│         Short description.              │  ← font-ui, text-base, text-secondary
│                                         │
│         [Primary CTA Button]            │  ← clear next action
│                                         │
└─────────────────────────────────────────┘
```

### Illustration Style

- **Line-art SVG**, single color via `currentColor`
- **Stroke width 1.5** matching Lucide
- **Geometric, restrained** — no cute mascots, no abstract blobs
- **Theme-aware** — same SVG renders in dark/light via inheritance

Illustrations live in `packages/ui/illustrations/*.tsx` as React components.

### Catalog of Empty States

**Pre-built for these scenarios** (implement in Phase 7):

| Page              | Title (EN)                          | Title (DE)                                   | Illustration           |
| ----------------- | ----------------------------------- | -------------------------------------------- | ---------------------- |
| No Tasks          | "Inbox zero. Now what?"             | "Posteingang leer. Und jetzt?"               | Empty stack of papers  |
| No Habits         | "Build the first ritual."           | "Bau das erste Ritual."                      | Single seedling        |
| No Goals          | "What will you bring into being?"   | "Was wirst du erschaffen?"                   | Distant mountain       |
| No Projects       | "Where will you start?"             | "Wo fängst du an?"                           | Open compass           |
| Empty Inbox       | "Mind is clear."                    | "Der Kopf ist frei."                         | Calm horizon line      |
| No Search Results | "Nothing matches."                  | "Nichts gefunden."                           | Magnifying glass       |
| No Journal        | "The page is open."                 | "Die Seite wartet."                          | Single line on page    |
| No Knowledge      | "Start collecting wisdom."          | "Beginne zu sammeln."                        | Stack of folded paper  |
| Pre-Onboarding    | "Welcome."                          | "Willkommen."                                | Sunrise minimal        |
| Offline           | "You're offline. Apex still works." | "Du bist offline. Apex funktioniert weiter." | Disconnected dot       |
| Error             | "Something interrupted us."         | "Etwas hat uns unterbrochen."                | Single thread breaking |

### Copy Principles

**Direct:** No "Oops!" or "Looks like..."
**Identity-affirming:** Speaks to who the user is becoming
**Inviting:** Always followed by a clear action
**Brief:** Title ≤ 6 words. Description ≤ 12 words.

**Bad examples (do NOT do these):**

- ❌ "No items yet 😔" (apologetic, emoji feels childish)
- ❌ "It looks like you haven't created any tasks yet!" (verbose, defensive)
- ❌ "Click the button below to add your first item" (instructional, condescending)

**Good examples:**

- ✅ "Inbox zero. Now what?" (Direct, slightly playful, action-prompting)
- ✅ "Build the first ritual." (Imperative, identity-aligned)

### When NOT to Show an Empty State

- During loading (show skeleton)
- During filter results that exclude items (show "No tasks match these filters")
- During search (show "Nothing matches")

Each of these is a different state with different copy. Don't reuse the empty state.

---

## 14. Loading & Skeleton Patterns

Loading states are the second most-overlooked UX detail (after empty states). Apex treats them carefully.

### Three Loading Strategies

**1. Skeleton (preferred)** — show structural placeholder of incoming content

- Used when: initial page load, navigating to a known data shape
- Duration: until data resolves
- Shimmer animation: subtle horizontal sweep, 1.5s loop, opacity 0.5 → 0.7

**2. Spinner (fallback)** — circular indicator

- Used when: action result without known shape (button submitting)
- Duration: until action resolves
- Visual: Lucide `Loader2` icon, rotating, 720ms per cycle

**3. Progress (when measurable)** — actual progress bar

- Used when: file upload, multi-step process with known steps
- Visual: linear bar with `accent` fill, percentage label

### Skeleton Component Structure

```tsx
<Skeleton.Container>
  <Skeleton.Avatar size="md" />
  <Skeleton.Stack>
    <Skeleton.Text lines={1} width="60%" />
    <Skeleton.Text lines={1} width="40%" />
  </Skeleton.Stack>
</Skeleton.Container>
```

Skeletons mirror the structure of the eventual content. A task row skeleton looks like a task row, just blank.

### Shimmer Animation

```css
@keyframes shimmer {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(100%);
  }
}

.skeleton-shimmer {
  position: relative;
  overflow: hidden;
}
.skeleton-shimmer::after {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(
    90deg,
    transparent 0%,
    rgba(255, 255, 255, 0.05) 50%,
    transparent 100%
  );
  animation: shimmer 1.5s infinite;
}
```

**Performance:** GPU-accelerated via `transform`. Single animation per page (don't multiply animations on every skeleton element).

### Loading State Hold Times

- **Spinner appears after 200ms** of waiting (don't flash for fast operations)
- **Spinner stays visible at minimum 300ms** once shown (prevents flicker if action resolves immediately after)
- **Skeleton appears immediately** (no delay)
- **Progress bar shows immediately** (user wants to see progress start)

### Loading States by Component

| Component                             | Loading Strategy                                        |
| ------------------------------------- | ------------------------------------------------------- |
| Page navigation                       | Skeleton matching page structure                        |
| Form submission                       | Spinner inside button + button disabled                 |
| List filtering/sorting                | List dims to 50% opacity, no spinner                    |
| Image                                 | Blur hash placeholder → fade in actual image            |
| Toast send                            | Toast appears with spinner, replaces with success/error |
| Sync (background)                     | Subtle indicator in topbar, not blocking UI             |
| First-time data hydration (PowerSync) | Full-screen progressive load with progress count        |

### Empty + Loading States

A list page goes through three states:

```
1. Initial: skeleton
2. Loaded with data: actual content
3. Loaded empty: empty state with illustration + CTA
```

Never show empty state during loading. That confuses the user.

---

## 15. Toast & Notification Choreography

Toasts are interruptions. Apex uses them sparingly, choreographs them carefully.

### Toast Types

| Type      | Color                              | Use                                        | Auto-dismiss |
| --------- | ---------------------------------- | ------------------------------------------ | ------------ |
| `success` | success-dim bg, success border     | Confirming action ("Task saved")           | 3s           |
| `error`   | danger-dim bg, danger border       | Action failed ("Couldn't save, try again") | 5s — bzw. `persistent` (kein Auto-Dismiss), wenn der Fehler eine Nutzeraktion erfordert (siehe components/toast.md) |
| `warning` | warning-dim bg, warning border     | Caution ("You're offline. Saved locally.") | 4s           |
| `info`    | info-dim bg, info border           | Informational ("Sync complete")            | 3s           |
| `xp`      | accent-dim bg with accent gradient | XP rewards (special celebratory style)     | 3s           |

### XP Toast (Special)

The XP toast is unique. It's the visual reward for completing things. We over-design this one because it's the moment of celebration.

```
┌──────────────────────────────────────┐
│  ⚡ +25 XP                          │
│  Completed "Write Phase 1 docs"      │
└──────────────────────────────────────┘
   ↑ accent gradient bg, accent-bright text, slight glow shadow
```

**Animation choreography:**

1. Toast slides in from right (300ms, spring)
2. XP number counts from 0 to value over 500ms (with `requestAnimationFrame`)
3. Subtle accent-glow pulse during count-up
4. Holds for 2 seconds
5. Slides out 300ms (springOut)

### Stack Behavior

- **Position:** top-right (web), top-center (mobile), with safe-area-top padding
- **Maximum visible:** 5 toasts stacked
- **New toast pushes others down:** old toasts shift down 8px to make room
- **Click to dismiss:** any toast can be dismissed manually (X icon top-right)
- **Hover pauses auto-dismiss** (web only)

### Priority Rules

When multiple toasts queue simultaneously (rare but possible):

1. Errors show first (most important)
2. Warnings next
3. XP toasts queue with 200ms delay between each (so they feel sequential, not overwhelming)
4. Info toasts last

### Notification Center (Stage 2)

A notification center (bell icon in topbar) collects:

- Past XP earnings (today's history)
- Streak warnings (about to lose streak)
- Habit reminders (scheduled)
- Duo activity (partner completed something)
- System notifications (maintenance, etc.)

Different from toasts (which are momentary). Notifications persist until dismissed.

---

## 16. Focus Modes

Apex has special "Focus Modes" — UI states that minimize distractions and signal "now we're doing serious work." This is a major differentiator.

### Daily Focus Mode (Pomodoro / Deep Work)

**Trigger:** User starts a Daily Focus session (Phase 16).

**Visual changes:**

- Sidebar fades out (200ms, opacity to 0)
- Topbar fades out (200ms)
- Page background extends to fill viewport
- Centered: large Pomodoro timer (FocusTimer component, see spec)
- Optional: ambient sound playing
- Subtle background gradient appears (very dark accent at edges)
- Cursor: hidden after 3s of inactivity (web)

**Exit:** Tap "End Session" button, or ESC key, or session timer completes.

**Why?** Eliminates everything except the work. Phone in another room, app in cinema mode = optimal deep work conditions.

### Morning Ritual Mode

**Trigger:** User opens Morning Ritual (Phase 18).

**Visual changes:**

- Full-screen takeover (sidebar + topbar gone)
- Single question per screen
- Generous whitespace, large type
- Soft sunrise gradient in background (subtle, theme-aware)
- One action per screen ("Continue", or auto-progress on slider release)
- No timer, no rush

**Exit:** Complete all steps, or "Schließen" (close) button → confirmation modal.

### Evening Ritual Mode

Same structure as Morning. Different gradient (twilight tones).

### CEO Review Mode

**Trigger:** Sunday morning (or user-configured day) opens Weekly Review.

**Visual changes:**

- Full-screen
- Single question per screen
- Progress bar at top (X/7 steps)
- "← Back" always available except step 1
- "Schließen" with confirmation if not saved

### Common Focus Mode Rules

- **No notifications** during Focus Mode (toasts suppressed, badge counts hidden)
- **No haptics** except for direct user input
- **No sounds** except UI sound for milestones (if user has it enabled) and ambient
- **No keyboard shortcuts** except ESC and explicit interactions
- **System back button** (Android) prompts confirmation before exiting

### Implementation

```tsx
// Apply via context provider
<FocusModeProvider mode="daily-focus">
  <FocusTimer ... />
</FocusModeProvider>
```

Components inside check `useFocusMode()` and adjust behavior accordingly.

---

## 17. Imagery & Photography

Apex uses imagery sparingly but carefully. When images appear, they're meaningful.

### Where Images Appear

1. **Vision Cards** — user-uploaded image representing their vision
2. **Avatar / Profile** — user's photo or initials fallback
3. **Onboarding** — small illustrative images (not photos)
4. **Empty States** — line-art SVGs (see Section 13)
5. **Marketing Site** — hero imagery, screenshots, social proof
6. **Knowledge entries** — user-attached images (book covers, screenshots, etc.)
7. **Journal entries** — user-attached photos

### Image Style for Apex Marketing

**Photography style:**

- Warm, natural lighting (golden hour preferred)
- Real workspaces, not stock photos
- Premium materials (leather, wood, paper) over plastic/digital
- Subjects: people in deep focus, journals, simple desks, mountain vistas
- Color grade: slightly warm, slightly desaturated, never over-saturated

**Avoid:**

- ❌ Stock photos of "happy office workers"
- ❌ Heavy filters or Instagram-style edits
- ❌ Cluttered scenes
- ❌ Bright cool tones (clinical feeling)
- ❌ Tech imagery (laptops, phones, screens — Apex is about life, not tech)

**Sources for licensable imagery:**

- Unsplash+ (paid plan for commercial license clarity)
- Stocksy (curated, premium)
- Custom photography (best, but expensive)

### Vision Card Images (User-Uploaded)

When users upload images for their visions:

- **Aspect ratio:** 16:9 enforced via crop tool
- **Max upload:** 10MB
- **Auto-optimize:** convert to WebP, generate blur hash, multiple resolutions
- **Display:** with subtle dark gradient overlay so text remains readable
- **Storage:** Supabase Storage with EU bucket, signed URLs for access

### Avatar Strategy

**Fallback to initials when no photo uploaded.** Never use a generic "person" icon — looks like a missing image bug.

```tsx
<Avatar fallback="PK" /> // shows "PK" with deterministic background color
```

**Background color algorithm:**

- Hash the user's name → index into 8 preset colors
- Each preset color is theme-aware and accent-harmonious
- Same name always gets same color (predictable)
- Colors: subtle pastels, never neon

### Image Loading Strategy (Product App)

**Always use `expo-image`, never `<Image>` from react-native.**

```tsx
<Image
  source={{ uri: avatar.url }}
  placeholder={{ blurhash: avatar.blurHash }}
  contentFit="cover"
  transition={200}
  style={{ width: 40, height: 40 }}
/>
```

Benefits:

- AVIF/WebP support (smaller files)
- Blur hash placeholders (no flash of empty)
- Built-in caching with size-aware policies
- 200ms fade-in transition
- Memory-efficient

---

## 18. Accessibility Beyond Compliance

WCAG AA compliance is the floor, not the ceiling. Apex aims for AAA where it doesn't sacrifice usability, and goes beyond compliance for premium feel.

### Compliance Baseline (Hard Requirements)

| Requirement                       | Standard                                       | How                                  |
| --------------------------------- | ---------------------------------------------- | ------------------------------------ |
| Color contrast (body)             | ≥ 4.5:1                                        | Token combinations pre-tested        |
| Color contrast (large text 24px+) | ≥ 3:1                                          | Token combinations pre-tested        |
| Color contrast (UI components)    | ≥ 3:1                                          | Token combinations pre-tested        |
| Touch target size                 | ≥ 44×44px                                      | hitSlop on mobile, min-height on web |
| Keyboard navigation               | All interactive elements reachable             | Tab order, focus management          |
| Focus rings                       | Visible, 2px outline accent-bright, 2px offset | CSS focus-visible                    |
| Screen reader labels              | Every interactive element labeled              | aria-label, semantic HTML            |
| Form errors                       | Announced to screen readers                    | aria-live, role="alert"              |
| Reduced motion                    | Respected globally                             | prefers-reduced-motion media query   |
| Reduced transparency              | Respected on iOS                               | UIAccessibility API                  |
| Color blindness                   | UI never relies on color alone                 | Status icons + text labels           |
| Language attribute                | Set per user locale                            | `<html lang>` updates with i18n      |

### Beyond Compliance

Apex goes further:

**1. Keyboard shortcuts visible and discoverable**
Settings → "Keyboard Shortcuts" page lists all shortcuts. Cmd+K command palette shows shortcuts inline next to each command.

**2. Voice-over friendly content order**
Pages structured so screen readers traverse content in logical order, not visual order. Sidebar nav read first only when relevant.

**3. Generous touch targets even on dense UIs**
Even when visual button is 28px, hitSlop ensures 44×44 actual touch area.

**4. Custom focus order for complex layouts**
Dashboard widgets have explicit `tabindex` so keyboard users navigate logically (top-left → top-right → middle column, etc.) rather than DOM order.

**5. Skip links on web**
"Skip to main content" link appears on Tab from page top. Standard pattern but often missed.

**6. Semantic landmarks**
`<nav>`, `<main>`, `<aside>`, `<footer>` used correctly. Screen readers can navigate by landmark.

**7. Live regions for dynamic content**
XP toast, sync status, error messages use `aria-live="polite"` so screen reader users hear updates without losing focus.

**8. Heading hierarchy enforced**
Pages have one `<h1>`. Heading levels never skip (no `<h3>` after `<h1>` without `<h2>`).

**9. Forms with proper structure**

- `<label>` always paired with `<input>` (not placeholder-only)
- Required fields have `aria-required` AND `*` visual indicator
- Errors paired with input via `aria-describedby`
- Field hints announced before errors

**10. High-contrast mode support**
Users on Windows High Contrast or macOS Increase Contrast see Apex with stronger borders and zero subtle decorations. Tokens have a "high-contrast" variant.

### What We Test

- **Tab traversal:** every page can be fully navigated with keyboard alone
- **Screen reader:** VoiceOver (iOS, macOS) and TalkBack (Android), NVDA (Windows) at minimum
- **Reduced motion:** all flows usable with motion off
- **Color blind simulation:** Stark plugin or browser dev tools
- **Zoom 200%:** all UIs remain functional and don't horizontally scroll
- **Voice control:** "Click X button" works (proper button labels)

### What We Don't Compromise

We never trade accessibility for aesthetics. If a focus ring "looks ugly," the focus ring stays — we improve the overall design instead. If a contrast ratio fails, we adjust the token, not the rule.

---

## 19. Voice & Tone

The words in the app shape its personality more than the visuals. Apex's voice is **direct, identity-affirming, confident, warm, German-precise.**

### Voice Pillars

**1. Direct**

- Apex tells you what's true, not what's nice.
- "You completed 3 of 5 habits today." Not "Way to go champ! 🎉"
- "Your streak ended. Start a new one tomorrow." Not "Don't worry, streaks happen!"

**2. Identity-affirming**

- Apex addresses who the user is becoming, not their current state.
- "You are someone who finishes what they start." Not "Great job!"
- "Today you protect your morning." Not "Don't skip morning ritual."

**3. Confident**

- Apex has opinions and shares them.
- "This goal lacks conviction. Rewrite it." Not "Maybe consider revising your goal?"
- "Three intentions, no more." Not "You can add up to 3 intentions if you want."

**4. Warm**

- Apex cares about the user without being sycophantic.
- "Long week. The journal is here." Not "We hope you're doing well!"
- "Welcome back." Not "Welcome back, valued user! 😊"

**5. German-precise**

- German copy is slightly more concise than English (German says more in fewer words when done well)
- Du-Form throughout (never Sie)
- No anglicisms when German has the word

### Tone by Context

| Context           | Tone                     | Example (EN)                                          | Example (DE)                                            |
| ----------------- | ------------------------ | ----------------------------------------------------- | ------------------------------------------------------- |
| Onboarding        | Inviting, slow           | "Welcome. Let's start with what matters."             | "Willkommen. Beginnen wir mit dem Wesentlichen."        |
| Daily greeting    | Warm, contextual         | "Good morning, Petja. Quiet day ahead?"               | "Guten Morgen, Petja. Stiller Tag?"                     |
| Task completion   | Brief, satisfying        | "Done."                                               | "Erledigt."                                             |
| Habit completion  | Identity-reinforcing     | "You're someone who runs daily."                      | "Du bist jemand, der täglich läuft."                    |
| Streak warning    | Direct, not panicked     | "Your streak ends tonight unless you log it."         | "Dein Streak endet