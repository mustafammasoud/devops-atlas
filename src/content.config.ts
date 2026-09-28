import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

/**
 * All educational content lives in the repository-level `content/` folder so
 * that Markdown/MDX sources stay clearly separated from application code.
 *
 * Adding a new frontmatter field only requires extending the schema below —
 * no routing or layout restructuring.
 */
const docs = defineCollection({
  // `content/README.md` is the authoring guide, `content/_template/` holds the
  // copy-me article template — neither is documentation content.
  loader: glob({
    pattern: [
      '**/*.md',
      '**/*.mdx',
      '!README.md',
      '!**/README.md',
      '!_template/**',
    ],
    base: './content',
  }),
  schema: z.object({
    title: z.string(),
    description: z.string().default(''),
    /**
     * Documentation area — normally OMITTED: derived from the first folder
     * segment (`content/<area>/...`). Explicit only to override/alias.
     */
    category: z.string().optional(),
    /** Tool — normally OMITTED: derived from the second folder segment. */
    tool: z.string().optional(),
    order: z.number().default(0),
    level: z.enum(['beginner', 'intermediate', 'advanced']).default('beginner'),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
    /** Optional publication / update date for articles. */
    date: z.coerce.date().optional(),
    /**
     * Content language for the article region. English (LTR) is the default;
     * set `language: ar` to render that article's content region as RTL.
     */
    language: z.enum(['en', 'ar']).default('en'),
  }),
});

export const collections = { docs };
