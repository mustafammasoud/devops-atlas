// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import tailwindcss from '@tailwindcss/vite';

// Ops Handbook is a fully static site so it can be deployed to Cloudflare Pages
// (and any other static host) without an adapter.
export default defineConfig({
  site: 'https://ops-handbook.pages.dev',
  output: 'static',
  trailingSlash: 'ignore',
  integrations: [mdx()],
  vite: {
    plugins: [tailwindcss()],
  },
  markdown: {
    shikiConfig: {
      // Dual themes so the same markup works in light and dark mode.
      // Gruvbox's earth-tone palette matches the warm paper / dark coffee UI.
      themes: {
        light: 'gruvbox-light-medium',
        dark: 'gruvbox-dark-medium',
      },
      defaultColor: false,
      wrap: true,
    },
  },
});
