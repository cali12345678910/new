import { QueryClient } from "@tanstack/react-query";
import { createRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";

export const getRouter = () => {
  const queryClient = new QueryClient();

  // When deployed under a subpath (e.g. GitHub Pages /new/), Vite sets BASE_URL
  // so client-side routing resolves correctly; defaults to "/" otherwise.
  const base = import.meta.env.BASE_URL.replace(/\/$/, "");

  const router = createRouter({
    routeTree,
    context: { queryClient },
    ...(base ? { basepath: base } : {}),
    scrollRestoration: true,
    defaultPreload: "intent",
    // Let React Query own data freshness so intent-preloaded routes don't
    // immediately refetch on navigation.
    defaultPreloadStaleTime: 0,
  });

  return router;
};
