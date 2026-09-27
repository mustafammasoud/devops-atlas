# DevOps Atlas

**DevOps Atlas** is an open-source DevOps knowledge base and learning platform.
It is not a blog: it is structured documentation, practical labs, diagrams, screenshots,
code examples, troubleshooting notes and cheatsheets. The UI defaults to English with a
working Arabic switch (persisted per browser); educational content is authored
per-document in Arabic or English.

All educational content lives as **Markdown/MDX files in this repository** (source of truth).
The site is fully static and ready for Cloudflare Pages.

## Stack

| Layer      | Choice                                             |
| ---------- | -------------------------------------------------- |
| Framework  | [Astro](https://astro.build) 7 (static output)     |
| Language   | TypeScript (strict)                                |
| Styling    | Tailwind CSS 4 (Vite plugin)                       |
| Content    | Astro Content Collections (`glob` loader) + MDX     |
| Diagrams   | Mermaid (lazy-loaded, client-side)                 |
| Highlight  | Shiki (dual light/dark themes)                     |
| Hosting    | Static build → Cloudflare Pages (later milestone)  |

No backend, database, auth, CMS or React. Nothing that is not needed yet.

## Platform features

- **Content rendering** — Markdown/MDX with Shiki highlighting (light/dark dual
  themes), tables, blockquotes, `<details>`, callouts, steps and figures.
- **Search** — build-time JSON index + client-side dialog (Ctrl/⌘K or `/`),
  with Arabic-aware normalization (diacritics, alef/hamza, ta-marbuta). Zero
  search dependencies; the index is fetched lazily on first open.
- **Navigation** — sidebar grouped by documentation area and nested by tool
  (Area → Tool → Articles), breadcrumbs (Home / Docs / Area / Tool / Article),
  area pages, tool landing pages, prev/next links, scroll-spy table of
  contents, mobile disclosure menu, header nav.
- **Reading UX** — heading anchor links, copy buttons on code blocks, image
  lightbox, dark/light theme with persistence, skip link, reduced-motion support.
- **Images** — colocated images are optimized automatically by Astro; `Figure`
  component for captions.
- **PDF** — `PdfCard` (open in new tab / download) and `PdfEmbed` (native
  browser preview, no heavy viewer dependency). Files live in `public/pdf/`.
- **Mermaid** — diagrams render client-side; the library is lazy-loaded only on
  pages that contain one.

All authoring documentation (frontmatter, components, images, PDFs, direction
rules) lives in [`content/README.md`](content/README.md). A visual QA page for
every component is available at `/components-preview` (not linked in navigation).

## Commands

```bash
npm install       # install dependencies
npm run dev       # local dev server (http://localhost:4321)
npm run build     # production build → dist/
npm run preview   # serve the production build locally
npm run check     # TypeScript / Astro diagnostics
```

## Project structure

```text
├── content/                  # educational content (Markdown/MDX) — the source of truth
│   ├── README.md             # authoring guide (excluded from the build)
│   ├── devops-fundamentals/  # Documentation Areas (empty folders = placeholders,
│   ├── operating-systems/    #   see docs-roadmap.md)
│   │   └── linux/            # second level = Technology / Tool
│   │       └── introduction.md
│   ├── networking/
│   ├── version-control/
│   │   └── git/
│   ├── programming-scripting/
│   ├── containers/
│   │   └── docker/
│   │       ├── introduction.md
│   │       └── images/       # topic folder with colocated assets
│   │           ├── index.mdx
│   │           ├── images/   # images colocated with their document
│   │           └── resources/
│   ├── ci-cd-automation/
│   ├── container-orchestration/
│   │   └── kubernetes/
│   │       ├── overview.md
│   │       └── pods/
│   ├── cloud-platforms/
│   ├── infrastructure-as-code/
│   ├── configuration-management/
│   ├── observability/
│   ├── security-devsecops/
│   └── troubleshooting-production/
├── public/
│   ├── images/               # shared static images
│   ├── logo/                 # brand marks (mark + wordmark, light/dark SVG)
│   ├── pdf/                  # static PDF resources (served as-is)
│   └── favicon.svg            # compact theme-aware mark
├── src/
│   ├── components/           # Header, Search, Sidebar, TableOfContents, ThemeToggle,
│   │                         # LocaleToggle, Callout, Steps, Figure, PdfCard, PdfEmbed,
│   │                         # CategoryCard, CategoryIcon, ReadingProgress,
│   │                         # RelatedTopics, DocEnhancements, MermaidRuntime
│   ├── layouts/              # BaseLayout, DocLayout (docs shell)
│   ├── pages/                # routes: /, /docs, /docs/[category],
│   │                         # /docs/[area]/[tool], /docs/[...slug],
│   │                         # /search-index.json, /components-preview, 404
│   ├── data/                 # category metadata
│   ├── utils/                # shared helpers (doc URL mapping, canonical order)
│   ├── styles/global.css     # design tokens, prose, RTL/LTR, themes, search dialog
│   └── content.config.ts     # content collection schema
├── astro.config.mjs
├── package.json
├── tsconfig.json
├── docs-roadmap.md           # content blueprint (living document)
└── README.md
```

## Writing content

Create a file under `content/<area>/<tool>/<topic>.md` (or `.mdx`) and fill in the frontmatter:

```yaml
---
title: البودات (Pods)
description: الوحدة الأساسية في كوبرنيتيس.
category: container-orchestration   # documentation area id (register it in src/data/categories.ts for a display label)
order: 2                            # sort order inside the sidebar group
level: beginner                     # beginner | intermediate | advanced
tags: [kubernetes, pods]
draft: false                        # drafts are excluded from the build
language: ar                        # content language: ar (RTL article region) | en (LTR)
---
```

The folder path sets the URL: `content/container-orchestration/kubernetes/pods/index.mdx`
serves `/docs/container-orchestration/kubernetes/pods`, and every tool with at
least one article gets a landing page at `/docs/<area>/<tool>` automatically.

Content conventions:

- **Images**: colocate them next to the document
  (`content/container-orchestration/kubernetes/pods/images/pod-lifecycle.svg`) and
  reference them with a relative path (`![alt](./images/pod-lifecycle.svg)`). Astro
  optimizes SVG/PNG/WebP automatically.
- **PDFs**: either colocated with the document (`content/<area>/<tool>/<topic>/resources/x.pdf`,
  imported in MDX) or site-wide in `public/pdf/` linked with `/pdf/<file>.pdf`.
- **Diagrams**: use a ` ```mermaid ` fenced block — it renders as a diagram client-side
  (Mermaid is only downloaded on pages that contain one).
- **Callouts / steps / figures / PDF embeds**: MDX components available **without any
  import** — see [`content/README.md`](content/README.md) for the full authoring guide
  with snippets.
- **Direction**: the document `language` sets `lang`/`dir` on the **article region** only;
  page chrome follows the reader's UI locale (English default, Arabic via the header
  switch). Code blocks, terminals, YAML/JSON and inline code are always forced LTR.

## Content architecture principles

Content structure must remain flexible.

Adding, removing, or reorganizing topics should not require major code changes.

The platform should adapt to content, not force content into a rigid structure.

The living content blueprint (areas, example topics, evolution rules, current
limitations) lives in [`docs-roadmap.md`](docs-roadmap.md).

## Architecture decisions

1. **Content outside `src/`** — educational content lives in a repository-level `content/`
   folder, loaded by the `glob` loader in `src/content.config.ts`. Content stays clearly
   separated from application code; images colocated with documents are still optimized by
   Astro (verified in the production build).
2. **Locale-driven UI, content-driven direction** — static HTML ships in English
   (site default); a head script re-applies the stored `atlas-locale` before first paint
   and swaps `[data-ar*]` nodes client-side, so the header switch works without a rebuild.
   The prose region keeps its own `dir`/`lang` from content frontmatter, everything
   technical (code blocks, inline code, tags, URLs, tool names) is isolated LTR via CSS,
   and layout uses CSS logical properties (`ms-*`, `ps-*`, `border-inline-start`) so the
   same markup works in both directions.
3. **Static output, no adapter** — `output: 'static'` so the `dist/` folder can be pushed
   straight to Cloudflare Pages later (`git → GitHub → Cloudflare Pages`).
4. **Shiki dual themes** — `gruvbox-light-medium` / `gruvbox-dark-medium` (warm
   earth tones that match the paper/dark-coffee UI) with `defaultColor: false`,
   so dark mode is a CSS-only switch with no re-highlighting.
5. **Mermaid is lazy** — loaded via dynamic `import('mermaid')` only when a page actually
   contains a diagram; it never blocks pages without diagrams.
6. **Schema is single-sourced** — all frontmatter fields are declared once in
   `src/content.config.ts`; adding future fields (reading time, prerequisites,
   labs…) does not require restructuring.
7. **UI language ≠ content language** — the language switch toggles the chrome
   (nav, labels, metadata, descriptions) between English and Arabic and persists the
   choice in `localStorage`; technical names (Linux, Docker, Kubernetes, CI/CD …) and
   authored content never change with it.
8. **Search is a static index, not a service** — `/search-index.json` is
   generated at build time from the collection and fetched lazily by the search
   dialog. Matching runs in the browser with Arabic normalization (diacritics
   stripped, alef/hamza/ya/ta-marbuta unified) so Arabic queries work without a
   backend. The whole index is one small JSON file today (≈5 kB for the sample
   content); if the corpus grows to thousands of pages, the index generator can
   be swapped for Pagefind without touching the UI contract.
9. **Components over syntax** — MDX callouts/steps/PDF/image helpers are Astro
   components used with JSX syntax, so they stay typed and styled consistently;
   plain Markdown keeps working for everything else. The set is intentionally
   small (Callout, Steps, Figure, PdfCard, PdfEmbed) — more components are added
   only when content actually needs them. They are injected into every rendered
   MDX page via the `components` prop on `<Content />`, so authors use
   `<Callout>` with **no import line**; only asset values (image/PDF imports)
   remain explicit.

## Logo & brand

**Concept — “Atlas Plate”.** The mark is a rounded map plate (the atlas page /
manual) carrying a single plotted route: an orthogonal elbow like a transit map
or engineering diagram, ending in a terminus node. It reads as navigation,
infrastructure layers, and a structured knowledge journey in one geometric
form — no robots, clouds, whales, or gradients. The frame and route are
monochrome; exactly one element (the terminus node) carries the accent color.

Assets (SVG):

| File                                       | Use                                       |
| ------------------------------------------ | ----------------------------------------- |
| `public/logo/mark-light.svg` / `mark-dark.svg` | mark only (light / dark)              |
| `public/logo/logo-light.svg` / `logo-dark.svg` | mark + “DevOps Atlas” wordmark (light / dark) |
| `public/favicon.svg`                        | compact filled mark; switches with `prefers-color-scheme` |

The wordmark uses the site’s system sans stack — “DevOps” at medium weight,
“Atlas” at bold with slightly tightened tracking — so it always matches the
interface without shipping a font file. The header renders the mark inline
(`currentColor` frame/route + `fill-accent` node) so both themes follow the
color tokens automatically.

Usage rules:

- **Monochrome-first** — one mark, one accent node; never add gradients,
  shadows, or extra colors.
- Use light assets on light backgrounds and dark assets on dark backgrounds.
- Keep clear space around the mark of at least ¼ of its height.
- Minimum size: 24 px for the mark; the favicon stays legible at 16 px.
- Don’t stretch, rotate, recolor outside the palette (coffee `#8a5a24` /
  gold `#d0a45c`), or swap the route for other symbols.

## Deployment (later)

```text
Local development → Git → GitHub → Cloudflare Pages → devops-atlas.pages.dev
```

Deployment is intentionally **not** configured in this milestone. The build is a plain
static site, so no adapter or server runtime is required.

## Repository

Public repository: [`mustafammasoud/devops-atlas`](https://github.com/mustafammasoud/devops-atlas).
No secrets or environment credentials are used or committed.
