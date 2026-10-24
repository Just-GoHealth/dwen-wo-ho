import { afterEach, beforeEach, vi } from "vitest";

type FetchInit = RequestInit & { headers: Record<string, string> };

export type FetchMock = ReturnType<
  typeof vi.fn<(url: string, init: FetchInit) => Promise<Response>>
>;

export function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json" },
  });
}

/**
 * Stubs a browser-like global scope (same-origin, XSRF cookie set) and a mocked `fetch`
 * answering `{}` by default. Returns the mock; inspect it with `call(n)`.
 */
export function useFetchMock(): FetchMock {
  const fetchMock =
    vi.fn<(url: string, init: FetchInit) => Promise<Response>>();

  beforeEach(() => {
    fetchMock.mockReset();
    fetchMock.mockImplementation(async () => json({}));
    vi.stubGlobal("fetch", fetchMock);
    vi.stubGlobal("window", {});
    vi.stubGlobal("document", { cookie: "XSRF-TOKEN=tok" });
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  return fetchMock;
}

/** The nth request: url, method and parsed JSON body (undefined when there is none). */
export function call(fetchMock: FetchMock, n = 0) {
  const [url, init] = fetchMock.mock.calls[n]!;
  const body =
    typeof init.body === "string"
      ? (JSON.parse(init.body) as unknown)
      : init.body;
  return { url, method: init.method, body, headers: init.headers };
}
