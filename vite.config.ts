import { defineConfig } from "@lovable.dev/vite-tanstack-config";

const isPages = process.env.GITHUB_PAGES === "true";

export default defineConfig({
  ...(isPages ? { vite: { base: "/new/" } } : {}),
  vite: {
    ...(isPages ? { base: "/new/" } : {}),
    build: {
      chunkSizeWarningLimit: 800,
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes("node_modules")) {
              if (id.includes("@radix-ui") || id.includes("lucide-react") || id.includes("vaul")) {
                return "ui-vendors";
              }
              if (id.includes("@tanstack")) {
                return "tanstack-vendors";
              }
              if (id.includes("recharts") || id.includes("embla-carousel")) {
                return "visual-vendors";
              }
            }
          },
        },
      },
    },
  },
  tanstackStart: {
    server: { entry: "server" },
    ...(isPages ? { spa: { enabled: true }, prerender: { enabled: false } } : {}),
  },
});
