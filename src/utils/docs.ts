import type { CollectionEntry } from 'astro:content';
import { categoryOrder } from '../data/categories';

type Doc = CollectionEntry<'docs'>;

/**
 * Canonical documentation order: category order, then frontmatter `order`,
 * then title. Used by the sidebar, prev/next navigation and the search index.
 */
export function compareDocs(a: Doc, b: Doc): number {
  return (
    categoryOrder(a.data.category) - categoryOrder(b.data.category) ||
    a.data.category.localeCompare(b.data.category) ||
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
