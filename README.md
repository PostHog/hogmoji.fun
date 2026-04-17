# hogmoji.fun

A tiny web app for building custom PostHog hedgehog emoji — pick a template, drop in your art, export a PNG.

Hosted at **https://hogmoji.fun**, deployed to Vercel from this repo.

## What it does

The site is builder-only: the root route (`/`) shows a list of templates, and `/<template-id>` opens the editor with a resizable, drag-and-drop layer canvas. Bring-your-own image (paste or upload), tweak, download.

## Stack

- Create React App + TypeScript + React Router
- Tailwind CSS
- No backend, no data fetch — everything is static in `site/public/` + hardcoded template definitions in `site/src/builderTemplates.ts`
- Deployed to Vercel; SPA rewrites + cache headers in `site/vercel.json`

## Local development

```bash
cd site
npm install
npm start      # http://localhost:3000
npm run build  # production build into site/build
```

## Attribution

This project is a fork/rebrand of **[bufo.fun](https://bufo.fun)** by [@tfritzy](https://github.com/tfritzy) — see the upstream repo at **https://github.com/tfritzy/bufo.fun**. Most of the builder code, layout, and UX patterns here originated there. Huge thanks.

The original bufo emoji art comes from **[knobiknows/all-the-bufo](https://github.com/knobiknows/all-the-bufo)** — a community-maintained collection of bufo (frog) emoji. hogmoji.fun started from that art and is transitioning its default mascot to PostHog's hedgehog.

## License

Inherits the license of the upstream `tfritzy/bufo.fun` repo.
