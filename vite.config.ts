// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - tanstackStart, viteReact, tailwindcss, tsConfigPaths, nitro (build-only using cloudflare as a default target),
//     componentTagger (dev-only), VITE_* env injection, @ path alias, React/TanStack dedupe,
//     error logger plugins, and sandbox detection (port/host/strictPort).
// You can pass additional config via defineConfig({ vite: { ... }, etc... }) if needed.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";

// When building for GitHub Pages we emit a static SPA under the repo subpath
// (https://<user>.github.io/new/). This only applies when GITHUB_PAGES=true so
// the default Lovable/Cloudflare build is left untouched.
const isPages = process.env.GITHUB_PAGES === "true";

export default defineConfig({
  ...(isPages ? { vite: { base: "/new/" } } : {}),
  tanstackStart: {
    // Redirect TanStack Start's bundled server entry to src/server.ts (our SSR error wrapper).
    // nitro/vite builds from this
    server: { entry: "server" },
    // Static client-only output for GitHub Pages (all data is fetched client-side).
    ...(isPages ? { spa: { enabled: true }, prerender: { enabled: false } } : {}),
  },
});
