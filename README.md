# Axiom Web App

This folder contains the isolated browser/PWA project area for the Axiom Web App.

Axiom Web is the local-first Apple/iPhone validation client. It reproduces app-side Axiom workflows in the browser while native Android, native iOS, firmware, and the public Project Axiom website remain separate project boundaries.

The current validation build does not communicate with the physical scale and does not write NFC tags.

## Current Scope

- Installable PWA shell.
- Offline-capable app shell after a successful first load.
- Bundled food catalog/search data copied into this project.
- IndexedDB local persistence for user-owned app data.
- Food search, manual logging, timeline, meal grouping, recipes, custom ingredients, identities, reviews, quick-log configuration, backup/restore, and CSV export.
- `ScaleTransport` boundary with unavailable physical transport and development-only mock import.

## Local-First Behaviour

Core user data remains in the browser's IndexedDB storage:

- settings
- logs
- recipes
- custom ingredients
- identities
- passive quick-log items
- source mappings/review state

No login, cloud account, backend service, or remote database is required.

Open Food Facts barcode lookup is optional online enrichment. Manual app use remains available without it.

## Development

Use Node/pnpm, then run:

```sh
pnpm install
pnpm dev
```

The local app usually runs at:

```text
http://127.0.0.1:5173/
```

## Validation

```sh
pnpm test
pnpm lint
pnpm build
```

## Production Preview

After building:

```sh
pnpm preview
```

The production build includes the manifest and service worker needed for PWA installation and offline shell caching.

## Project Layout

```text
Axiom-Web-App/
├── AGENTS.md
├── CHANGELOG.md
├── PARITY.md
├── README.md
├── index.html
├── package.json
├── public/
├── src/
├── tests/
└── _workbench/
```
