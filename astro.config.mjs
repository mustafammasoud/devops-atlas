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
  redirects: {
    // Legacy top-level category routes redirected to documentation areas
    '/docs/foundations': '/docs/devops-fundamentals',
    '/docs/linux': '/docs/operating-systems',
    '/docs/git': '/docs/version-control',
    '/docs/docker': '/docs/containers',
    '/docs/ci-cd': '/docs/ci-cd-automation',
    '/docs/kubernetes': '/docs/container-orchestration',
    '/docs/cloud': '/docs/cloud-platforms',
    '/docs/terraform': '/docs/infrastructure-as-code',
    '/docs/security': '/docs/security-devsecops',
    '/docs/troubleshooting': '/docs/troubleshooting-production',

    // Legacy article routes redirected to nested technology paths
    '/docs/docker/introduction': '/docs/containers/docker/introduction',
    '/docs/kubernetes/overview': '/docs/container-orchestration/kubernetes/overview',
    '/docs/kubernetes/pods': '/docs/container-orchestration/kubernetes/pods',
    '/docs/linux/introduction': '/docs/operating-systems/linux/introduction',
  },
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
