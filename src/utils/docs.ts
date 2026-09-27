import type { CollectionEntry } from 'astro:content';
import { categoryOrder, canonicalCategoryId } from '../data/categories';

type Doc = CollectionEntry<'docs'>;

/**
 * Documentation area for a doc entry.
 * Priority:
 * 1. Explicit `category` in frontmatter (legacy aliases resolved).
 * 2. First segment of the path: `content/<area>/...`
 *
 * Authors normally never need `category:` — it is derived from the folder.
 */
export function docCategory(doc: Doc): string {
  return canonicalCategoryId(doc.data.category ?? doc.id.split('/')[0]);
}

/**
 * Extracts the technology / tool from a doc entry.
 * Priority:
 * 1. Explicit `tool` in frontmatter.
 * 2. Second segment in nested path: `content/<category>/<tool>/...`
 */
export function docTool(entry: Doc): string | undefined {
  if (entry.data.tool) return entry.data.tool;
  const parts = entry.id.split('/');
  if (parts.length >= 3) {
    return parts[1];
  }
  return undefined;
}

/**
 * Canonical documentation order:
 * 1. Category (documentation area) canonical order
 * 2. Technology / tool
 * 3. Frontmatter `order`
 * 4. Title
 *
 * Used by the sidebar, prev/next navigation, and search index.
 */
export function compareDocs(a: Doc, b: Doc): number {
  const catA = docCategory(a);
  const catB = docCategory(b);
  const toolA = docTool(a) ?? '';
  const toolB = docTool(b) ?? '';

  return (
    categoryOrder(catA) - categoryOrder(catB) ||
    catA.localeCompare(catB) ||
    toolA.localeCompare(toolB) ||
    a.data.order - b.data.order ||
    a.data.title.localeCompare(b.data.title, 'ar')
  );
}

/** All non-draft docs in canonical order. */
export function sortedDocs(docs: Doc[]): Doc[] {
  return [...docs].sort(compareDocs);
}

/**
 * URL path for a docs collection entry.
 *
 * An entry stored at `content/<category>/<topic>/index.md` has the id
 * `<category>/<topic>/index` and is served from `/docs/<category>/<topic>/`.
 */
export function docPath(id: string): string {
  return `/docs/${docSlug(id)}`;
}

/** Collection entry id -> URL slug (drops the trailing `index`). */
export function docSlug(id: string): string {
  return id.replace(/\/index$/, '');
}

/**
 * Topic-count copy for a number of documents.
 * English default (site locale) + Arabic variant for the locale swap.
 */
export function topicCount(count: number): { en: string; ar: string } {
  const en = count === 1 ? '1 topic' : `${count} topics`;
  const ar =
    count === 0
      ? 'لا مواضيع بعد'
      : count === 1
        ? 'موضوع واحد'
        : count === 2
          ? 'موضوعان'
          : count <= 10
            ? `${count} مواضيع`
            : `${count} موضوعاً`;
  return { en, ar };
}
