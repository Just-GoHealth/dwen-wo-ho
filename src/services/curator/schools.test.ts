import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import type { CampusDetail, CampusProvider } from "@/lib/v2/curator/campuses";
import type { CampusCardItem, ResultItem } from "@/lib/v2/curator/types";

type FetchInit = RequestInit & { headers: Record<string, string> };

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json" },
  });
}

const CAMPUS_ID = "c1a2b3c4-0000-4000-8000-000000000001";

const card: CampusCardItem = {
  id: CAMPUS_ID,
  fullName: "Achimota School",
  nicknames: ["Motown"],
  motto: "Ut Omnes Unum Sint",
  type: "SHS",
  card: "HIGH_SCHOOL",
  logo: { url: "https://img/logo.png", thumbnailUrl: "https://img/logo-t.png" },
  lockedIn: 42,
};

const detail: CampusDetail = {
  id: CAMPUS_ID,
  fullName: "Achimota School",
  nicknames: ["Motown", "Achimota"],
  motto: null,
  type: "SHS",
  typeLabel: "Senior High School",
  card: "HIGH_SCHOOL",
  location: { id: "loc-1", name: "Accra" },
  logo: null,
  banner: null,
  defaultGraduationMonth: 6,
  sites: [{ id: "s1", name: "Main" }],
  archived: false,
  version: 3,
};

const result: ResultItem = {
  id: "r1",
  displayName: "Ama K.",
  initials: "AK",
  age: 16,
  gender: "FEMALE",
  yearLabel: "SHS 2",
  variant: "EXAM",
  createdAt: "2026-10-01T10:00:00Z",
  urgent: true,
  urgentReason: "Suicidality",
  attention: false,
  awaitingAcceptance: true,
  active: true,
  lockedIn: { score: 3, colour: "RED" },
  suicidality: "High",
  lastProviderView: null,
  seen: false,
  treatingStartedAt: null,
  respondBy: null,
  overdue: false,
};

describe("schoolsService (v2)", () => {
  const fetchMock =
    vi.fn<(url: string, init: FetchInit) => Promise<Response>>();

  beforeEach(() => {
    vi.resetModules();
    fetchMock.mockReset();
    vi.stubGlobal("fetch", fetchMock);
    vi.stubGlobal("window", {});
    vi.stubGlobal("document", { cookie: "XSRF-TOKEN=tok" });
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("getSchools pages through GET /campuses and maps the cards", async () => {
    fetchMock.mockResolvedValueOnce(
      json({ items: [card], page: 0, size: 100, total: 1 }),
    );

    const { schoolsService } = await import("./schools");
    const schools = await schoolsService.getSchools();

    expect(fetchMock.mock.calls[0]![0]).toBe(
      "/campuses?archived=false&page=0&size=100",
    );
    expect(schools).toEqual([
      expect.objectContaining({
        id: CAMPUS_ID,
        name: "Achimota School",
        nickname: "Motown",
        type: "SHS",
        logo: "https://img/logo.png",
        totalPatients: 42,
      }),
    ]);
  });

  it("getSchools keeps fetching while pages are full", async () => {
    const full = Array.from({ length: 100 }, (_, i) => ({
      ...card,
      id: `c${i}`,
    }));
    fetchMock
      .mockResolvedValueOnce(
        json({ items: full, page: 0, size: 100, total: 101 }),
      )
      .mockResolvedValueOnce(
        json({ items: [card], page: 1, size: 100, total: 101 }),
      );

    const { schoolsService } = await import("./schools");
    const schools = await schoolsService.getSchools({ archived: true });

    expect(schools).toHaveLength(101);
    expect(fetchMock.mock.calls[1]![0]).toBe(
      "/campuses?archived=true&page=1&size=100",
    );
  });

  it("getSchool maps the detail, with sites as the campuses list", async () => {
    fetchMock.mockResolvedValueOnce(json(detail));

    const { schoolsService } = await import("./schools");
    const school = await schoolsService.getSchool(CAMPUS_ID);

    expect(fetchMock.mock.calls[0]![0]).toBe(`/campuses/${CAMPUS_ID}`);
    expect(school).toMatchObject({
      id: CAMPUS_ID,
      version: 3,
      campuses: ["Main"],
      locationName: "Accra",
      typeLabel: "Senior High School",
    });
  });

  it("updateSchool PATCHes with the version, then PUTs the sites", async () => {
    fetchMock
      .mockResolvedValueOnce(json({ ...detail, version: 4 }))
      .mockResolvedValueOnce(json({ ...detail, version: 5 }));

    const { schoolsService } = await import("./schools");
    const school = await schoolsService.updateSchool({
      id: CAMPUS_ID,
      version: 3,
      fullName: "Achimota",
      sites: ["Main", "Annex"],
    });

    const [patchUrl, patch] = fetchMock.mock.calls[0]!;
    expect(patchUrl).toBe(`/campuses/${CAMPUS_ID}`);
    expect(patch.method).toBe("PATCH");
    expect(JSON.parse(String(patch.body))).toEqual({
      version: 3,
      fullName: "Achimota",
    });
    const [sitesUrl, sites] = fetchMock.mock.calls[1]!;
    expect(sitesUrl).toBe(`/campuses/${CAMPUS_ID}/sites`);
    expect(sites.method).toBe("PUT");
    expect(JSON.parse(String(sites.body))).toEqual({
      sites: ["Main", "Annex"],
    });
    expect(school.version).toBe(5);
  });

  it("updateSchool surfaces 409 STALE as an ApiError", async () => {
    fetchMock.mockResolvedValueOnce(
      json({ status: 409, code: "STALE", detail: "Changed" }, 409),
    );

    const { schoolsService } = await import("./schools");
    await expect(
      schoolsService.updateSchool({ id: CAMPUS_ID, version: 1 }),
    ).rejects.toMatchObject({ code: "STALE", status: 409 });
  });

  it("archiveSchool POSTs /campuses/{id}/archive", async () => {
    fetchMock.mockResolvedValueOnce(json({ ...detail, archived: true }));

    const { schoolsService } = await import("./schools");
    const school = await schoolsService.archiveSchool(CAMPUS_ID);

    expect(fetchMock.mock.calls[0]![0]).toBe(`/campuses/${CAMPUS_ID}/archive`);
    expect(fetchMock.mock.calls[0]![1].method).toBe("POST");
    expect(school.archived).toBe(true);
  });

  it("createSchool creates, then uploads the logo as multipart `file`", async () => {
    fetchMock
      .mockResolvedValueOnce(json(detail, 201))
      .mockResolvedValueOnce(json(detail));

    const { schoolsService } = await import("./schools");
    const logo = new File(["x"], "logo.png", { type: "image/png" });
    await schoolsService.createSchool({
      fullName: "Achimota School",
      type: "SHS",
      locationId: "loc-1",
      logo,
    });

    const [createUrl, create] = fetchMock.mock.calls[0]!;
    expect(createUrl).toBe("/campuses");
    expect(JSON.parse(String(create.body))).toEqual({
      fullName: "Achimota School",
      type: "SHS",
      locationId: "loc-1",
    });
    const [logoUrl, upload] = fetchMock.mock.calls[1]!;
    expect(logoUrl).toBe(`/campuses/${CAMPUS_ID}/logo`);
    expect(upload.method).toBe("PUT");
    expect((upload.body as FormData).get("file")).toBeInstanceOf(File);
  });

  it("getSchoolProviders maps campus providers, keyed by provider id", async () => {
    const provider: CampusProvider = {
      providerId: "p1",
      title: "Dr",
      fullName: "Kofi Mensah",
      initials: "KM",
      photo: null,
      roleCategoryId: "rc1",
      roleCategory: "Psychologist",
      nsmqCounsellor: false,
      mainHost: true,
      broughtByCampusHostId: null,
      attachedAt: "2026-10-01T10:00:00Z",
    };
    fetchMock.mockResolvedValueOnce(json([provider]));

    const { schoolsService } = await import("./schools");
    const providers = await schoolsService.getSchoolProviders(CAMPUS_ID);

    expect(fetchMock.mock.calls[0]![0]).toBe(
      `/campuses/${CAMPUS_ID}/providers`,
    );
    expect(providers[0]).toMatchObject({
      id: "p1",
      email: "p1",
      providerName: "Kofi Mensah",
      providerTitle: "Dr",
      specialty: "Psychologist",
    });
  });

  it("addProvidersToSchool POSTs {providers:[{providerId}]}", async () => {
    fetchMock.mockResolvedValueOnce(json([], 201));

    const { schoolsService } = await import("./schools");
    await schoolsService.addProvidersToSchool(CAMPUS_ID, ["p1", "p2"]);

    const [url, init] = fetchMock.mock.calls[0]!;
    expect(url).toBe(`/campuses/${CAMPUS_ID}/providers`);
    expect(JSON.parse(String(init.body))).toEqual({
      providers: [{ providerId: "p1" }, { providerId: "p2" }],
    });
  });

  it("getPatientsOverview builds the roll and the urgent list", async () => {
    fetchMock.mockImplementation(async (url: string) =>
      url.startsWith("/results/urgent")
        ? json([result])
        : json({ items: [result], page: 0, size: 100, total: 1 }),
    );

    const { schoolsService } = await import("./schools");
    const overview = await schoolsService.getPatientsOverview(CAMPUS_ID, {
      name: "Achimota School",
    });

    const urls = fetchMock.mock.calls.map(([u]) => u);
    expect(urls).toContain(`/campuses/${CAMPUS_ID}/results?page=0&size=100`);
    expect(urls).toContain(`/results/urgent?campusId=${CAMPUS_ID}`);
    expect(overview.awaitingCount).toBe(1);
    expect(overview.patients[0]).toMatchObject({
      id: "r1",
      patientName: "Ama K.",
      schoolName: "Achimota School",
      nsmqTag: "911",
      visibilityStatus: "urgent",
      lockinScore: 3,
    });
    expect(overview.urgentCare.totalUrgentCarePatients).toBe(1);
    expect(overview.urgentCare.patients[0]?.patientResultId).toBe("r1");
  });

  it("getSchoolReach reads GET /reach?campusId=", async () => {
    fetchMock.mockResolvedValueOnce(
      json({
        reach: 10,
        baseline: 2,
        visits: 3,
        screens: 4,
        carriedVisits: 0,
        carriedScreens: 0,
        results: 4,
        activeResults: 4,
      }),
    );

    const { schoolsService } = await import("./schools");
    const reach = await schoolsService.getSchoolReach(CAMPUS_ID);

    expect(fetchMock.mock.calls[0]![0]).toBe(`/reach?campusId=${CAMPUS_ID}`);
    expect(reach.reach).toBe(10);
  });

  // Provider-app only (v1); moves with the provider migration.
});
