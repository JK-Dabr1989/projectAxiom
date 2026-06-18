# Axiom / AxiomScale V1 Website

This is a simple static project hub for Axiom and AxiomScale. It is designed as a practical Version 1 site: easy to edit, lightweight, and deployable on static hosts such as Netlify, Vercel, GitHub Pages, or similar.

## Run Locally

Open `index.html` directly in a browser.

No build step, package install, backend, authentication, database, or payment handling is required.

## Main Files

- `index.html` contains the page structure and copy.
- `styles.css` contains the visual design and responsive layout.
- `script.js` handles the simple hash-based page navigation.

## Replace Assets

Current real or placeholder assets live in `assets/`.

Use these folders as the site grows:

- `assets/logo` for final logo files.
- `assets/prototype` for prototype scale photos.
- `assets/app` for app screenshots.
- `assets/saga` for saga images or post media.
- `assets/testimonials` for approved testimonial assets.

The existing homepage image and logo paths can be changed in `index.html`.

## Update Copy

Most text is in `index.html`. Search for section IDs such as `home`, `vision`, `status`, `saga`, `testing`, `evidence`, `partners`, `register`, and `contact`.

TODO comments mark places for:

- Real logo updates.
- Prototype photos.
- App screenshots.
- Saga posts.
- Editable progress numbers.
- Approved testimonials.
- Usage and feedback data.

## Wire Forms Later

The tester and register-interest forms are static placeholders. They do not submit anywhere yet.

Good future options include:

- Mailchimp
- Buttondown
- Formspree
- Supabase
- Netlify Forms
- A custom backend, only when the project actually needs one

When wiring forms, update the TODO comments in `index.html` and replace the placeholder buttons with real submit behaviour.
