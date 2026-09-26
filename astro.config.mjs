// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import tailwindcss from '@tailwindcss/vite';

// DevOps Atlas is a fully static site so it can be deployed to Cloudflare Pages
// (and any other static host) without an adapter.
export default defineConfig({
  site: 'https://devops-atlas.pages.dev',
  output: 'static',
  trailingSlash: 'ignore',
  integrations: [mdx()],
  vite: {
    plugins: [tailwindcss()],
  },
  markdown: {
    shikiConfig: {
      // Dual themes so the same markup works in light and dark mode.
      themes: {
        light: 'github-light-default',
        dark: 'github-dark-default',
      },
      defaultColor: false,
      wrap: true,
    },
  },
});
