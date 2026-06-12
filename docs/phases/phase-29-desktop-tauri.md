# Phase 29 — Desktop App (Tauri)

> **Stage:** Launch+
> **Size:** M (2-3 days, ~16-20 hours)
> **Status:** Ready to execute
> **Dependencies:** Phase 28 complete

## Goal

Wrap the Expo Web build in Tauri 2.x for desktop installation. Native menus, notifications, auto-update. Distribute via download from marketing site for macOS, Windows, Linux.

## Why Now

By Stage 3, users want a "real app" feeling. PWA install works but lacks native polish. Tauri provides 90% of native feel for 10% of the engineering effort.

## Prerequisites

- Phase 28 complete
- Apple Developer account (for macOS code signing)
- EV code signing certificate (for Windows, ~$300/year)
- Linux: no signing needed

## Scope

1. Tauri 2.x project setup (`apps/desktop`)
2. Wraps `app.apex.[domain]` web build (Expo Web)
3. Native menus (File, Edit, View, etc.)
4. Native notifications (replace browser notifications)
5. Auto-update mechanism (Tauri's built-in)
6. macOS, Windows, Linux builds
7. Code signing
8. Distribution via download from marketing site
9. Auto-launch on login (optional, off by default)

## Out of Scope

- Custom desktop-only features (parity with web)
- macOS menu bar app (not needed)
- Windows tray icon (not needed)

## Acceptance Criteria

- [ ] Tauri project at `apps/desktop`
- [ ] Builds for macOS (universal: x86 + Apple Silicon)
- [ ] Builds for Windows (x64)
- [ ] Builds for Linux (deb + AppImage)
- [ ] Code signing: macOS (Apple Developer), Windows (EV cert), Linux (none)
- [ ] Auto-update: checks every 6h, prompts user
- [ ] Native menus on macOS (Apple HIG)
- [ ] Native notifications work cross-platform
- [ ] App opens to login if not authenticated
- [ ] Session shared with browser (cookies + Supabase)
- [ ] Auto-launch toggle in Settings (default off)
- [ ] Marketing site has Downloads page with platform detection
- [ ] All 3 platforms tested by Petja personally

## Implementation Plan

1. **Tauri 2.x setup** (~3 hours) — `apps/desktop`, Rust project, basic config
2. **Wraps Expo Web build** (~2 hours) — points Tauri at deployed Expo Web URL OR bundles locally
3. **Native menus** (~2 hours) — File menu, Edit menu, etc.
4. **Native notifications** (~2 hours) — Tauri notification API, replaces browser
5. **Auto-update setup** (~3 hours) — update server (GitHub Releases), version manifest
6. **macOS code signing** (~2 hours) — entitlements, notarization
7. **Windows EV signing** (~2 hours) — once cert acquired
8. **Linux builds** (~1 hour) — deb + AppImage
9. **CI/CD for releases** (~3 hours) — GitHub Actions, builds all 3 platforms on tag
10. **Marketing Downloads page** (~2 hours) — platform detection + download links
11. **Tests + commit** (~2 hours)

## Files Created/Modified

**Created:**

- `apps/desktop/Cargo.toml`
- `apps/desktop/src-tauri/tauri.conf.json`
- `apps/desktop/src-tauri/src/main.rs`
- `apps/desktop/icons/`
- `.github/workflows/desktop-release.yml`
- `apps/marketing/app/[locale]/(marketing)/download/page.tsx`

## Common Pitfalls

**1. Tauri 2.x is newer** — tutorials online may be Tauri 1.x. Use official 2.x docs.

**2. Code signing is annoying** — macOS notarization can take 15-60 min, Windows EV cert is expensive ($300/year minimum).

**3. Auto-update server** — use Tauri's GitHub Releases support to avoid running own server.

**4. Window state persistence** — save window size/position so app reopens where user left it.

**5. Session sharing** — Tauri doesn't share cookies with browser by default. Either bundle login or accept that Tauri has separate session.

**6. Linux distros** — deb (Debian/Ubuntu), AppImage (universal). Not RPM unless demanded.

**7. Universal macOS binary** — must build for both x86_64 and aarch64, then `lipo` together.

**8. App size** — Tauri ~10MB, much better than Electron's 100MB+. Highlight this.

## Done When

- All 3 platforms have signed installable builds
- Auto-update tested (release v1, install v1, release v2, verify update prompt)
- Marketing Downloads page works with platform detection
- Petja installs on his macOS + Windows machines
- Commit + tag: `feat(desktop): tauri app for macOS/Windows/Linux` + `git tag v0.4.0-desktop`

---

**Next:** `phase-30-premium-polish.md`
