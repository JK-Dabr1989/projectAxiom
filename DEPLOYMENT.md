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

The build disables source maps, uses Vite production minification, writes hashed JS/CSS asset names, and creates a small Sites-compatible static Worker entrypoint at `dist/server/index.js`.

## Hosting

The selected deployment target is Sites because it can host the compiled static/PWA artifact over HTTPS without making this source repository public.

Current production URL:

```text
https://axiom-web.curiosityengine.chatgpt.site/
```

The hosted artifact contains only runtime files from `dist/`, plus Sites hosting metadata injected during packaging.

The Sites Worker generated during `pnpm build` embeds the production runtime files so the deployment serves the app shell, manifest, service worker, hashed assets, and bundled catalog data without exposing the source tree.

## PWA Notes

The manifest and service worker assume root hosting:

- `start_url: /`
- `scope: /`
- icons under `/icons/`
- service worker at `/sw.js`

If Axiom Web is later hosted under a sub-path, update Vite base paths, manifest paths, and service-worker cache URLs before deployment.

## Update Behaviour

The service worker caches the application shell and bundled food/search data. A newer service worker triggers a small update notice in the app so testers can reload when ready.

Service-worker cache cleanup does not touch IndexedDB. Tester data remains local across deployments unless a deliberate database migration changes it.

## Rollback

Redeploy a previous saved hosting version if a release must be rolled back.

Tester IndexedDB data is not cleared by rollback.
