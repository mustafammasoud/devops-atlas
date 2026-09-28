import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { categories } from '../data/categories';
import { docCategory, docPath, docTool, sortedDocs } from '../utils/docs';

/**
 * Canonical public sitemap (`/sitemap.xml`).
 *
 * Enumerates only indexable routes — homepage, docs index, every area page,
 * tool pages, and published articles. Draft articles, legacy redirect stubs,
 * the 404 page, and internal demo pages are excluded by construction.
 *
 * The official `@astrojs/sitemap` integration is intentionally not used: it
 * always emits `sitemap-index.xml` + `sitemap-0.xml`, while robots.txt and
 * the deployment expect a single `/sitemap.xml`.
 */
export const GET: APIRoute = async ({ site }) => {
  if (!site) {
    throw new Error('[sitemap] astro.config.mjs must set `site` for absolute URLs.');
  }

  const docs = sortedDocs(await getCollection('docs', ({ data }) => !data.draft));

  const paths = new Set<string>(['/', '/docs']);

  // Area pages: every registered category plus any id that only exists in
  // content frontmatter (mirrors src/pages/docs/[category].astro).
  for (const { id } of categories) paths.add(`/docs/${id}`);
  for (const doc of docs) paths.add(`/docs/${docCategory(doc)}`);

  // Tool pages: one per (area, tool) group with at least one published
  // article (mirrors src/pages/docs/[area]/[tool].astro).
  for (const doc of docs) {
    const tool = docTool(doc);
    if (tool) paths.add(`/docs/${docCategory(doc)}/${tool}`);
  }

  // Published articles.
  for (const doc of docs) paths.add(docPath(doc.id));

  const escape = (value: string): string =>
    value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

  const entries = [...paths]
    .map((path) => `  <url><loc>${escape(new URL(path, site).href)}</loc></url>`)
    .join('\n');

  const xml =
    '<?xml version="1.0" encoding="UTF-8"?>\n' +
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
    `${entries}\n` +
    '</urlset>\n';

  return new Response(xml, {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  });
};
