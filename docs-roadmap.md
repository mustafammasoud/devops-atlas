# DevOps Atlas — Content Roadmap

> A **human-readable content blueprint**, not an application configuration and
> not a fixed roadmap. The folder structure in `content/` and the presentation
> registry in `src/data/categories.ts` may grow, merge, split or disappear at
> any time — this document only sketches the current intent and is updated
> whenever that intent changes.

## Documentation architecture

```text
Documentation Area → Technology / Tool → Articles

content/<area>/<tool>/<article>.md        →  /docs/<area>/<tool>/<article>
content/<area>/<tool>/<article>/index.mdx →  /docs/<area>/<tool>/<article>
content/<area>/<concept>.md               →  /docs/<area>/<concept>
```

- **Area** — one of the 14 registered documentation areas below. Its id is the
  frontmatter `category:` and the first folder level.
- **Tool / technology** — the second folder level (`docker`, `kubernetes`,
  `linux` …). Each tool with at least one article automatically gets a tool
  landing page at `/docs/<area>/<tool>`. Tool names stay English in every
  locale.
- **Article** — the actual page. Articles written directly under an area (no
  tool level) are still supported and appear ungrouped on the area page.

## Main documentation areas

| Area (category id) | Purpose | Example tools (indicative) | Example topics |
| --- | --- | --- | --- |
| `devops-fundamentals` | Shared fundamentals that everything else assumes | — | delivery lifecycle, terminology, how the pieces fit |
| `operating-systems` | The operating system most DevOps work happens on | Linux | permissions, services, package management, shell scripting |
| `networking` | How systems talk to each other | — | DNS, HTTP/TLS, load balancing, firewalls |
| `version-control` | Source control workflow | Git, GitHub, GitLab | branching, rebasing, hooks, monorepo tips |
| `programming-scripting` | Scripting and core programming concepts | Bash, Python, Go | APIs, JSON, YAML, regex |
| `containers` | Container images and runtimes | Docker, Podman, containerd | images, volumes, networking, multi-stage builds |
| `ci-cd-automation` | Automated delivery | GitHub Actions, GitLab CI, Jenkins | pipelines, testing stages, artifacts, releases |
| `container-orchestration` | Container orchestration | Kubernetes, Helm | pods, deployments, services, ingress |
| `cloud-platforms` | Cloud platforms and services | AWS, Azure, Google Cloud | compute, storage, IAM, managed services |
| `infrastructure-as-code` | Infrastructure as code | Terraform, OpenTofu | providers, state, modules, drift |
| `configuration-management` | Configuration automation | Ansible, Puppet, Chef | playbooks, inventories, idempotency |
| `observability` | Knowing what production is doing | Prometheus, Grafana, Loki | metrics, logs, traces, alerting |
| `security-devsecops` | Keeping systems safe | Vault, Trivy, Snyk | secrets, least privilege, scanning, hardening |
| `troubleshooting-production` | Diagnosing and fixing real incidents | — | common failures, debugging playbooks, postmortems |

Every row is **indicative, not binding**: an area might stay empty for a long
time, a tool might never appear, or a row might be split into two. Folders
exist only as places to put files — nothing in the platform depends on a
folder existing.

## How the structure evolves

- **Add an article**: copy `content/_template/article.mdx` to
  `content/<area>/<tool>/` (or drop a plain `topic.md` under `content/<area>/`).
  It appears in navigation, search, the area page and the tool landing page
  after the next build — no code changes. `category`/`tool` are derived from
  the folders, so frontmatter stays minimal.
- **Add a tool**: create `content/<area>/<newtool>/`. The tool landing page
  `/docs/<area>/<newtool>` is generated automatically from the collection the
  moment its first article exists. No registry, no route file, no config.
- **Add an area**: create `content/<area>/` and register it in
  `src/data/categories.ts` *to* give it a display name (English/technical),
  bilingual descriptions, an icon, and a visual position among the known
  areas.
- **Reorder learning material**: change frontmatter `order:` — never rename
  folders with numeric prefixes (`01-linux`). Folder names stay stable;
  ordering lives in metadata.
- **Split or merge areas**: move files, update their `category:` field if the
  area id itself changes, done. URLs change (old ones keep working via the
  redirects in `astro.config.mjs`).
- **Retire an area**: delete the folder (or set its pages `draft: true`).

## Learning paths are not folders

The same article can serve several audiences (e.g. a networking article useful
to both `container-orchestration` and `cloud-platforms` readers). Each page has
exactly **one** sidebar home (its area folder) but any number of **tags**.
Future curated learning paths (beginner track, exam prep, …) should be
assembled from tags and metadata — never by duplicating or relocating content.

```yaml
---
tags:
  - containers
  - kubernetes
  - networking
---
```

If explicit learning phases (beginner track, ordered module, exam prep) are
needed later, they should be **views over this metadata** — tag-curated lists
or an `order`+`level` grouping in presentation code — not a new content
schema, a course engine, or progress tracking. The reference-first architecture
stays as-is.

## Current limitations

- **Unregistered areas are second-class in presentation only**: they work
  fully (routing, sidebar, search) but display their raw English id as the
  label, sort after all registered areas, and are omitted from the
  `/docs` area index — until added to `src/data/categories.ts` (one entry).
- **Tool landing pages exist only where articles exist**: an area page lists
  exactly the tools that have at least one article. Tools reserved in the
  roadmap but without content are not shown — there is intentionally no
  separate tool registry to maintain.
- **Article paths are one level deeper than tool pages**: `/docs/<area>/<tool>`
  is the tool landing page, so an article sits at
  `/docs/<area>/<tool>/<article>`. A flat file `content/<area>/<tool>.md`
  would collide with the tool landing page and should not be used.
- **Category presentation lives in one file**: Arabic descriptions, icons and
  tool display names are defined in `src/data/categories.ts` alongside labels
  and order — adding or changing them never requires touching content.
- **Learning paths are implicit**: tags carry cross-cutting membership today;
  a first-class path view does not exist yet and should be built from tags
  when needed.

## Related documents

- [`content/README.md`](content/README.md) — authoring guide (day-to-day)
- [`README.md`](README.md) — platform overview and architecture decisions
