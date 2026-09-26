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
  // `content/README.md` is the authoring guide, not a documentation page.
  loader: glob({
    pattern: ['**/*.md', '**/*.mdx', '!README.md', '!**/README.md'],
    base: './content',
  }),
  schema: z.object({
    title: z.string(),
    description: z.string().default(''),
    category: z.string(),
    /** Optional explicit tool or technology (e.g. docker, kubernetes, linux). */
    tool: z.string().optional(),
    order: z.number().default(0),
    level: z.enum(['beginner', 'intermediate', 'advanced']).default('beginner'),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
    /** Content language. Arabic (RTL) is the default; English (LTR) later. */
    language: z.enum(['ar', 'en']).default('ar'),
  }),
});

export const collections = { docs };
