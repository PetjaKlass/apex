# Desktop App Runbook (Phase 29 — Tauri 2.x)

> The Tauri scaffold (`apps/desktop/src-tauri`), the release workflow, and the
> marketing Downloads page are in the repo. **Building, signing and testing need
> the Rust/Tauri toolchain + paid signing certs (yours)** and can't run headless.
> The desktop app bundles the Expo Web export (`apps/product/dist`) — offline-first.

## 0. Toolchain (local)

```bash
# Rust + Tauri CLI
curl https://sh.rustup.rs -sSf | sh
cargo install tauri-cli --version "^2"
# Linux also needs: libwebkit2gtk-4.1-dev libappindicator3-dev librsvg2-dev patchelf
```

## 1. Icons + updater keys

```bash
cd apps/desktop/src-tauri
cargo tauri icon ../../product/assets/icon.png      # generates icons/*
cargo tauri signer generate -w ~/.tauri/apex.key    # updater keypair
```

Put the **public** key into `tauri.conf.json → plugins.updater.pubkey`, and set
the private key + password as CI secrets `TAURI_SIGNING_PRIVATE_KEY` /
`TAURI_SIGNING_PRIVATE_KEY_PASSWORD`. Replace `REPLACE_OWNER/REPLACE_REPO` in the
updater endpoint with your GitHub repo.

## 2. Develop / build locally

```bash
cd apps/desktop/src-tauri
cargo tauri dev      # runs `pnpm --filter @apex/product build:web` then opens the app
cargo tauri build    # produces installers for the current OS
```

macOS universal: `cargo tauri build --target universal-apple-darwin`.

## 3. Code signing

- **macOS**: Apple Developer cert; set `APPLE_*` secrets — the workflow notarizes.
- **Windows**: EV code-signing cert (~$300/yr); set `WINDOWS_CERTIFICATE` +
  password secrets.
- **Linux**: no signing (deb + AppImage).

## 4. Release (CI)

```bash
git tag v0.4.0-desktop && git push --tags
```

`.github/workflows/desktop-release.yml` builds macOS (universal), Windows (x64),
and Linux (deb + AppImage), signs them, and publishes a **draft** GitHub Release
with the updater `latest.json`. Review + publish the draft.

## 5. Marketing Downloads page

Set `NEXT_PUBLIC_DESKTOP_RELEASES_URL` to your GitHub Releases "latest" URL so the
`/download` page links to the real installers. Platform is auto-detected client-side.

## Deferred (documented)

- Native menus beyond the OS default (File/Edit refinements).
- Auto-launch-on-login toggle (Tauri autostart plugin + a webview bridge; gate to
  the Tauri environment).
- Session sharing with the browser (Tauri keeps its own session — fine for an app).
- Per-platform direct download links on `/download` (currently link to the
  release page; wire direct asset URLs once the release naming is fixed).
