import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { docPath, sortedDocs } from '../utils/docs';

/**
 * Static RSS 2.0 feed for published (non-draft) articles.
 *
 * Includes title, description, canonical URL, and pubDate only when real
 * metadata exists — nothing is invented. Drafts and redirect stubs are
 * excluded by construction (drafts are filtered out; redirects live in
 * `public/_redirects`, not in the content collection).
 *
 * No external dependencies are required — the XML is assembled by hand.
 */
export const GET: APIRoute = async ({ site }) => {
  if (!site) {
    throw new Error('[rss] astro.config.mjs must set `site` for absolute URLs.');
  }

  const docs = sortedDocs(await getCollection('docs', ({ data }) => !data.draft));

  const escape = (value: string): string =>
    value
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&apos;');

  const items = docs
    .map((entry) => {
      const url = new URL(docPath(entry.id), site).href;
      const lines = [
        '    <item>',
        `      <title>${escape(entry.data.title)}</title>`,
        `      <link>${escape(url)}</link>`,
        `      <guid isPermaLink="true">${escape(url)}</guid>`,
      ];
      if (entry.data.description) {
        lines.push(`      <description>${escape(entry.data.description)}</description>`);
      }
      if (entry.data.date) {
        lines.push(`      <pubDate>${new Date(entry.data.date).toUTCString()}</pubDate>`);
      }
      lines.push('    </item>');
      return lines.join('\n');
    })
    .join('\n');

  const feedUrl = new URL('/rss.xml', site).href;

  const xml =
    '<?xml version="1.0" encoding="UTF-8"?>\n' +
    '<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">\n' +
    '  <channel>\n' +
    '    <title>Ops Handbook</title>\n' +
    '    <description>Structured DevOps knowledge base: documentation, labs, diagrams, and command references.</description>\n' +
    `    <link>${escape(site.href)}</link>\n` +
    `    <atom:link href="${escape(feedUrl)}" rel="self" type="application/rss+xml" />\n` +
    '    <language>en</language>\n' +
    `${items}\n` +
    '  </channel>\n' +
    '</rss>\n';

  return new Response(xml, {
    headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' },
  });
};
