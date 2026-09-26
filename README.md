# DevOps Atlas

**DevOps Atlas** is an open-source, Arabic-first DevOps knowledge base and learning platform.
It is not a blog: it is structured documentation, practical labs, diagrams, screenshots,
code examples, troubleshooting notes and cheatsheets — with bilingual Arabic/English
content planned for later.

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
- **Navigation** — sidebar grouped by category, breadcrumbs, prev/next links,
  scroll-spy table of contents, mobile disclosure menu, header nav.
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
│   ├── foundations/          # (empty folders are placeholders — see docs-roadmap.md)
│   ├── linux/
│   ├── networking/
│   ├── git/
│   ├── docker/
│   ├── ci-cd/
│   ├── kubernetes/
│   │   └── pods/
│   │       ├── index.mdx
│   │       └── images/       # images colocated with their document
│   ├── cloud/
│   ├── terraform/
│   ├── observability/
│   ├── security/
│   └── troubleshooting/
├── public/
│   ├── images/               # shared static images
│   └── pdf/                  # static PDF resources (served as-is)
├── src/
│   ├── components/           # Header, Search, Sidebar, TableOfContents, ThemeToggle,
│   │                         # Callout, Steps, Figure, PdfCard, PdfEmbed,
│   │                         # DocEnhancements, MermaidRuntime
│   ├── layouts/              # BaseLayout, DocLayout (docs shell)
│   ├── pages/                # routes: /, /docs, /docs/[...slug],
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

Create a file under `content/<category>/<topic>.md` (or `.mdx`) and fill in the frontmatter:

```yaml
---
title: البودات (Pods)
description: الوحدة الأساسية في كوبرنيتيس.
category: kubernetes        # any folder name; register it in src/data/categories.ts for a display label
order: 2                    # sort order inside the sidebar category
level: beginner             # beginner | intermediate | advanced
tags: [kubernetes, pods]
draft: false                # drafts are excluded from the build
language: ar                # ar (RTL) — en (LTR) later
---
```

Content conventions:

- **Images**: colocate them next to the document
  (`content/kubernetes/pods/images/pod-lifecycle.svg`) and reference them with a relative
  path (`![alt](./images/pod-lifecycle.svg)`). Astro optimizes SVG/PNG/WebP automatically.
- **PDFs**: either colocated with the document (`content/<topic>/resources/x.pdf`,
  imported in MDX) or site-wide in `public/pdf/` linked with `/pdf/<file>.pdf`.
- **Diagrams**: use a ` ```mermaid ` fenced block — it renders as a diagram client-side
  (Mermaid is only downloaded on pages that contain one).
- **Callouts / steps / figures / PDF embeds**: MDX components available **without any
  import** — see [`content/README.md`](content/README.md) for the full authoring guide
  with snippets.
- **Direction**: the document `language` sets `dir` on the page and on the article region.
  Code blocks, terminals, YAML/JSON and inline code are always forced LTR.

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
2. **RTL as a per-region property, not a global flip** — pages set `lang`/`dir` per document
   (`ar` → RTL, `en` → LTR), the prose region declares its own `dir`, and everything
   technical (code blocks, inline code, tags, URLs) is isolated LTR via CSS. Layout uses
   CSS logical properties (`ms-*`, `ps-*`, `border-inline-start`) so the same markup works
   in both directions. This keeps a future Arabic/English switch to a per-page property.
3. **Static output, no adapter** — `output: 'static'` so the `dist/` folder can be pushed
   straight to Cloudflare Pages later (`git → GitHub → Cloudflare Pages`).
4. **Shiki dual themes** — `github-light-default` / `github-dark-default` with
   `defaultColor: false`, so dark mode is a CSS-only switch with no re-highlighting.
5. **Mermaid is lazy** — loaded via dynamic `import('mermaid')` only when a page actually
   contains a diagram; it never blocks pages without diagrams.
6. **Schema is single-sourced** — all frontmatter fields are declared once in
   `src/content.config.ts`; adding future fields (reading time, prerequisites,
   labs…) does not require restructuring.
7. **Placeholders stay honest** — the language switch renders as a visibly
   disabled control until the real feature is built.
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

## Deployment (later)

```text
Local development → Git → GitHub → Cloudflare Pages → devops-atlas.pages.dev
```

Deployment is intentionally **not** configured in this milestone. The build is a plain
static site, so no adapter or server runtime is required.

## Repository

Public repository: [`mustafammasoud/devops-atlas`](https://github.com/mustafammasoud/devops-atlas).
No secrets or environment credentials are used or committed.
