import { describe, expect, it, beforeEach, afterEach, vi } from "vitest";

type FetchInit = RequestInit & { headers: Record<string, string> };

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json" },
  });
}

/**
 * Paths, methods, bodies and query strings of the provider-surface modules,
 * against a mocked same-origin fetch (contract sections 2 and 4).
 */
describe("v2 provider endpoint modules", () => {
  const fetchMock =
    vi.fn<(url: string, init: FetchInit) => Promise<Response>>();
  let mods: {
    authApi: typeof import("./auth").authApi;
    providerApi: typeof import("./provider").providerApi;
    resultsApi: typeof import("./results").resultsApi;
    nsmqApi: typeof import("./nsmq").nsmqApi;
    notificationsApi: typeof import("./notifications").notificationsApi;
  };

  const lastCall = () => {
    const [url, init] = fetchMock.mock.calls.at(-1)!;
    return {
      url,
      method: init.method,
      body: typeof init.body === "string" ? JSON.parse(init.body) : init.body,
      headers: init.headers,
    };
  };

  beforeEach(async () => {
    vi.resetModules();
    fetchMock.mockReset();
    fetchMock.mockImplementation(async () => json({}));
    vi.stubGlobal("fetch", fetchMock);
    vi.stubGlobal("window", {});
    vi.stubGlobal("document", { cookie: "XSRF-TOKEN=tok-1" });
    mods = {
      authApi: (await import("./auth")).authApi,
      providerApi: (await import("./provider")).providerApi,
      resultsApi: (await import("./results")).resultsApi,
      nsmqApi: (await import("./nsmq")).nsmqApi,
      notificationsApi: (await import("./notifications")).notificationsApi,
    };
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  describe("auth", () => {
    it.each([
      [
        "lookup",
        () =>
          mods.authApi.lookup({ contact: "ama@example.com", role: "PROVIDER" }),
        "/auth/lookup",
        { contact: "ama@example.com", role: "PROVIDER" },
      ],
      [
        "sign-in",
        () =>
          mods.authApi.signIn({
            contact: "ama@example.com",
            role: "PROVIDER",
            password: "abc123",
          }),
        "/auth/sign-in",
        { contact: "ama@example.com", role: "PROVIDER", password: "abc123" },
      ],
      [
        "provider sign-up",
        () =>
          mods.authApi.providerSignUp({
            email: "ama@example.com",
            password: "abc123",
            title: "Dr",
            fullName: "Ama Mensah",
          }),
        "/auth/provider/sign-up",
        {
          email: "ama@example.com",
          password: "abc123",
          title: "Dr",
          fullName: "Ama Mensah",
        },
      ],
      [
        "verify",
        () =>
          mods.authApi.verify({
            contact: "ama@example.com",
            role: "PROVIDER",
            purpose: "CLAIM",
            code: "123456",
          }),
        "/auth/verify",
        {
          contact: "ama@example.com",
          role: "PROVIDER",
          purpose: "CLAIM",
          code: "123456",
        },
      ],
      [
        "resend code",
        () =>
          mods.authApi.sendCode({
            contact: "ama@example.com",
            role: "PROVIDER",
            purpose: "SIGN_UP",
          }),
        "/auth/codes",
        { contact: "ama@example.com", role: "PROVIDER", purpose: "SIGN_UP" },
      ],
      [
        "recovery",
        () =>
          mods.authApi.recovery({
            contact: "ama@example.com",
            role: "PROVIDER",
          }),
        "/auth/recovery",
        { contact: "ama@example.com", role: "PROVIDER" },
      ],
      [
        "claim (field is email)",
        () => mods.authApi.claim({ email: "c@example.com", role: "CURATOR" }),
        "/auth/claim",
        { email: "c@example.com", role: "CURATOR" },
      ],
      [
        "set password",
        () => mods.authApi.setPassword({ grant: "g-1", password: "abc123" }),
        "/auth/password",
        { grant: "g-1", password: "abc123" },
      ],
    ])("%s → POST with CSRF", async (_, call, path, body) => {
      await call();
      const c = lastCall();
      expect(c.url).toBe(path);
      expect(c.method).toBe("POST");
      expect(c.body).toEqual(body);
      expect(c.headers["X-XSRF-TOKEN"]).toBe("tok-1");
    });

    it("reads me and role categories with GET", async () => {
      await mods.authApi.me();
      expect(lastCall()).toMatchObject({ url: "/auth/me", method: "GET" });
      await mods.authApi.roleCategories();
      expect(lastCall()).toMatchObject({
        url: "/role-categories",
        method: "GET",
      });
    });
  });

  describe("provider", () => {
    it("PATCHes /providers/me with the version", async () => {
      await mods.providerApi.patchMe({ version: 3, phone: "+233241234567" });
      expect(lastCall()).toMatchObject({
        url: "/providers/me",
        method: "PATCH",
        body: { version: 3, phone: "+233241234567" },
      });
    });

    it("uploads the photo as multipart field `file` with PUT", async () => {
      await mods.providerApi.uploadPhoto(
        new Blob(["x"], { type: "image/jpeg" }),
      );
      const c = lastCall();
      expect(c.url).toBe("/providers/me/photo");
      expect(c.method).toBe("PUT");
      expect(c.body).toBeInstanceOf(FormData);
      expect((c.body as FormData).get("file")).toBeInstanceOf(Blob);
      expect(c.headers["Content-Type"]).toBeUndefined();
    });

    it("resubmits, requests to join and lists requests", async () => {
      await mods.providerApi.resubmit();
      expect(lastCall()).toMatchObject({
        url: "/providers/me/resubmit",
        method: "POST",
      });

      await mods.providerApi.requestJoin({
        targetType: "CAMPUS",
        targetId: "c1",
      });
      expect(lastCall()).toMatchObject({
        url: "/providers/me/join-requests",
        method: "POST",
        body: { targetType: "CAMPUS", targetId: "c1" },
      });

      await mods.providerApi.joinRequests({ page: 1, size: 50 });
      expect(lastCall().url).toBe("/providers/me/join-requests?page=1&size=50");

      await mods.providerApi.campuses({ q: "achi" });
      expect(lastCall().url).toBe("/campuses?q=achi");
    });
  });

  describe("results", () => {
    it("lists campus results with filters, repeating `outcome`", async () => {
      await mods.resultsApi.list("c1", {
        active: true,
        period: "WEEK",
        outcome: ["GMH:Poor", "DEPRESSION:Moderate"],
        page: 0,
        size: 20,
      });
      expect(lastCall().url).toBe(
        "/campuses/c1/results?active=true&period=WEEK&outcome=GMH%3APoor&outcome=DEPRESSION%3AModerate&page=0&size=20",
      );
    });

    it("reads summary, urgent and benchmarks", async () => {
      await mods.resultsApi.summary("c1", { gender: "FEMALE" });
      expect(lastCall().url).toBe("/campuses/c1/results/summary?gender=FEMALE");
      await mods.resultsApi.urgent();
      expect(lastCall().url).toBe("/results/urgent");
      await mods.resultsApi.urgent("c1");
      expect(lastCall().url).toBe("/results/urgent?campusId=c1");
      await mods.resultsApi.benchmarks({ campusId: "c1" });
      expect(lastCall().url).toBe("/benchmarks?campusId=c1");
    });

    it("updates active, care and comments", async () => {
      await mods.resultsApi.setActive("r1", false);
      expect(lastCall()).toMatchObject({
        url: "/results/r1",
        method: "PATCH",
        body: { active: false },
      });
      await mods.resultsApi.setCare("r1", { status: "TREATING" });
      expect(lastCall()).toMatchObject({
        url: "/results/r1/care",
        method: "PUT",
        body: { status: "TREATING" },
      });
      await mods.resultsApi.addComment("r1", "Seen in clinic");
      expect(lastCall()).toMatchObject({
        url: "/results/r1/comments",
        method: "POST",
        body: { body: "Seen in clinic" },
      });
    });

    it("surfaces 404 as NOT_FOUND (not available to you)", async () => {
      fetchMock.mockResolvedValueOnce(
        json({ status: 404, code: "NOT_FOUND", detail: "Not found" }, 404),
      );
      await expect(mods.resultsApi.get("r9")).rejects.toMatchObject({
        code: "NOT_FOUND",
      });
    });
  });

  describe("nsmq", () => {
    it("reads runs, care cases and clearances, and clears with a note", async () => {
      await mods.nsmqApi.run("run1");
      expect(lastCall().url).toBe("/runs/run1");
      await mods.nsmqApi.careCases("c1");
      expect(lastCall().url).toBe("/care-cases?campusId=c1");
      await mods.nsmqApi.clearances("k1");
      expect(lastCall().url).toBe("/care-cases/k1/clearances");
      await mods.nsmqApi.clear("k1", "Seen by counsellor");
      expect(lastCall()).toMatchObject({
        url: "/care-cases/k1/clear",
        method: "POST",
        body: { note: "Seen by counsellor" },
      });
    });
  });

  describe("notifications", () => {
    it("lists, counts and marks read", async () => {
      await mods.notificationsApi.list({ unread: true, size: 50 });
      expect(lastCall().url).toBe("/me/notifications?unread=true&size=50");
      await mods.notificationsApi.counts();
      expect(lastCall().url).toBe("/me/notifications/counts");

      fetchMock.mockResolvedValueOnce(new Response(null, { status: 204 }));
      await mods.notificationsApi.markRead("n1");
      expect(lastCall()).toMatchObject({
        url: "/me/notifications/n1/read",
        method: "POST",
      });

      fetchMock.mockResolvedValueOnce(new Response(null, { status: 204 }));
      await mods.notificationsApi.markAllRead();
      expect(lastCall().url).toBe("/me/notifications/read-all");
    });
  });
});
