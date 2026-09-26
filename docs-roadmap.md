# DevOps Atlas — Content Roadmap

> A **human-readable content blueprint**, not an application configuration and
> not a fixed roadmap. The category folders in `content/` and the presentation
> registry in `src/data/categories.ts` may grow, merge, split or disappear at
> any time — this document only sketches the current intent and is updated
> whenever that intent changes.

## Main documentation areas

| Area (category id) | Purpose | Example topics |
| --- | --- | --- |
| `foundations` | Shared fundamentals that everything else assumes | command line basics, how the internet works, terminology |
| `linux` | The operating system most DevOps work happens on | permissions, services, package management, shell scripting |
| `networking` | How systems talk to each other | DNS, HTTP/TLS, load balancing, firewalls |
| `git` | Source control workflow | branching, rebasing, hooks, monorepo tips |
| `docker` | Container images and runtimes | images, volumes, networking, multi-stage builds |
| `ci-cd` | Automated delivery | pipelines, testing stages, artifacts, releases |
| `kubernetes` | Container orchestration | pods, deployments, services, ingress |
| `cloud` | Cloud platforms and services | AWS/GCP/Azure primitives, IAM, managed services |
| `terraform` | Infrastructure as code | providers, state, modules, drift |
| `observability` | Knowing what production is doing | metrics, logs, traces, alerting |
| `security` | Keeping systems safe | secrets, least privilege, scanning, hardening |
| `troubleshooting` | Diagnosing and fixing real incidents | common failures, debugging playbooks, postmortems |

Every row is **indicative, not binding**: an area might stay empty for a long
time, be renamed, or be replaced by two smaller ones. Folders exist only as
places to put files — nothing in the platform depends on a folder existing.

## How the structure evolves

- **Add a topic**: create a file (or folder) anywhere under `content/`. It
  appears in navigation and search after the next build — no code changes.
- **Add an area**: create `content/<area>/`. It works immediately; optionally
  register it in `src/data/categories.ts` *only* to give it an Arabic display
  name and a visual position among the known areas.
- **Reorder learning material**: change frontmatter `order:` — never rename
  folders with numeric prefixes (`01-linux`). Folder names stay stable;
  ordering lives in metadata.
- **Split or merge areas**: move files, update their `category:` field if the
  area id itself changes, done. URLs change, nothing else.
- **Retire an area**: delete the folder (or set its pages `draft: true`).

## Learning paths are not folders

The same article can serve several audiences (e.g. a networking article useful
to both `kubernetes` and `cloud` readers). Each page has exactly **one**
sidebar home (`category:`) but any number of **tags**. Future curated learning
paths (beginner track, exam prep, …) should be assembled from tags and
metadata — never by duplicating or relocating content.

```yaml
---
category: networking
tags:
  - containers
  - kubernetes
  - networking
---
```

## Current limitations

- **Unregistered categories are second-class in presentation only**: they work
  fully (routing, sidebar, search) but display their raw English id as the
  sidebar label, sort after all registered areas, and are omitted from the
  homepage category tiles — until added to `src/data/categories.ts` (one line).
- **One-level navigation**: the sidebar is a flat list of categories → pages.
  Deeper folder nesting affects URLs, not visual grouping. Sub-grouping inside
  a category is a future presentation concern.
- **No category descriptions or icons yet**: `src/data/categories.ts` is the
  single place to add them when the UI needs them; content will not need to
  change.
- **Learning paths are implicit**: tags carry cross-cutting membership today;
  a first-class path view does not exist yet and should be built from tags
  when needed.

## Related documents

- [`content/README.md`](content/README.md) — authoring guide (day-to-day)
- [`README.md`](README.md) — platform overview and architecture decisions
