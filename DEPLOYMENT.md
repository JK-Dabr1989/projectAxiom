# Axiom Web Deployment

## Deployment Rule

Axiom Web source stays private.

Deploy only the production build output from `dist/`.

Do not deploy:

- TypeScript/React source files
- tests
- Markdown project guidance
- source maps
- local environment files
- git metadata
- repository history

## Production Build

```sh
pnpm install
pnpm test
pnpm lint
pnpm build
```

The build disables source maps, uses Vite production minification, writes hashed JS/CSS asset names, and copies `index.html` to `404.html` for static hosting fallback.

## Hosting

The selected deployment target is the existing Project Axiom GitHub Pages site and custom domain.

Current production URL:

```text
https://projectaxiom.info/app/
```

Deployment model:

```text
private Axiom Web source
-> GitHub Actions validation
-> Vite production build
-> artifact leak check
-> public projectAxiom gh-pages:/app/ runtime files
-> GitHub Pages at projectaxiom.info/app/
```

The hosted artifact contains only runtime files from `dist/`. The readable Web App source remains private and is not copied into the public website repository.

## PWA Notes

The manifest and service worker assume `/app/` hosting:

- `start_url: /app/`
- `scope: /app/`
- icons under `/app/icons/`
- service worker at `/app/sw.js`

If Axiom Web is later hosted at another path, update Vite base paths, manifest paths, and service-worker cache URLs before deployment.

## Update Behaviour

The service worker caches the application shell and bundled food/search data. A newer service worker triggers a small update notice in the app so testers can reload when ready.

Service-worker cache cleanup does not touch IndexedDB. Tester data remains local across deployments unless a deliberate database migration changes it.

## Rollback

Revert or replace the `app/` artifact commit on `JK-Dabr1989/projectAxiom` `gh-pages` if a release must be rolled back.

Tester IndexedDB data is not cleared by rollback.
