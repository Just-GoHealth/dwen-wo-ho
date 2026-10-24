/**
 * Backend v2 path prefixes this app proxies at the ROOT of its own origin, unchanged.
 * Root, not `/api/...`: the refresh cookie is `Path=/auth`, so `/auth/*` must be
 * same-origin at that exact path, and SameSite=Lax cookies only flow same-site.
 * Each entry becomes a `{source: "/<prefix>/:path*"}` rewrite in next.config.ts.
 * Keep this list free of the app's own page routes.
 */
export const API_PROXY_PREFIXES = [
  "auth",
  "me",
  "providers",
  "role-categories",
  "campuses",
  "campus-types",
  "results",
  "benchmarks",
  "runs",
  "care-cases",
  "care",
  "treatments",
  "versions",
  "teams",
  "codes",
  "fixtures",
  "programmes",
  "tags",
  "locations",
  "studio",
  "join-requests",
  "roles",
  "patients",
  "cover-pages",
  "icons",
  "team-entries",
  "reach",
  "venues",
  "hosts",
  "audit",
] as const;

export function apiRewrites(apiBaseUrl: string) {
  const base = apiBaseUrl.replace(/\/+$/, "");
  return API_PROXY_PREFIXES.flatMap((prefix) => [
    { source: `/${prefix}`, destination: `${base}/${prefix}` },
    { source: `/${prefix}/:path*`, destination: `${base}/${prefix}/:path*` },
  ]);
}
