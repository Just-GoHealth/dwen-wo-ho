import { describe, expect, it } from "vitest";
import { campusesCurator } from "./campuses";
import { catalogueCurator } from "./catalogue";
import { pagesCurator } from "./pages";
import { call, useFetchMock } from "./fetch.test-helper";

describe("campusesCurator", () => {
  const fetchMock = useFetchMock();

  it("lists campuses with filters and paging", async () => {
    await campusesCurator.list({
      q: "achi",
      archived: true,
      page: 1,
      size: 50,
    });
    await campusesCurator.list();

    expect(call(fetchMock, 0).url).toBe(
      "/campuses?q=achi&archived=true&page=1&size=50",
    );
    expect(call(fetchMock, 1).url).toBe("/campuses");
  });

  it("creates, edits, archives and restores a campus", async () => {
    await campusesCurator.create({
      fullName: "Achimota School",
      nicknames: ["Motown"],
      type: "SHS",
      locationId: "loc1",
    });
    await campusesCurator.update("c1", { version: 2, motto: "" });
    await campusesCurator.archive("c1");
    await campusesCurator.restore("c1");
    await campusesCurator.setSites("c1", ["North", "South"]);

    expect(call(fetchMock, 0)).toMatchObject({
      url: "/campuses",
      method: "POST",
      body: {
        fullName: "Achimota School",
        nicknames: ["Motown"],
        type: "SHS",
        locationId: "loc1",
      },
    });
    expect(call(fetchMock, 1)).toMatchObject({
      url: "/campuses/c1",
      method: "PATCH",
      body: { version: 2, motto: "" },
    });
    expect(call(fetchMock, 2)).toMatchObject({
      url: "/campuses/c1/archive",
      method: "POST",
    });
    expect(call(fetchMock, 3)).toMatchObject({
      url: "/campuses/c1/restore",
      method: "POST",
    });
    expect(call(fetchMock, 4)).toMatchObject({
      url: "/campuses/c1/sites",
      method: "PUT",
      body: { sites: ["North", "South"] },
    });
  });

  it("uploads the logo and banner as multipart `file`", async () => {
    const file = new Blob(["x"], { type: "image/png" });

    await campusesCurator.uploadLogo("c1", file);
    await campusesCurator.uploadBanner("c1", file);

    const logo = call(fetchMock, 0);
    expect(logo).toMatchObject({ url: "/campuses/c1/logo", method: "PUT" });
    expect(logo.body).toBeInstanceOf(FormData);
    expect((logo.body as FormData).get("file")).toBeInstanceOf(Blob);
    expect(logo.headers["Content-Type"]).toBeUndefined();
    expect(call(fetchMock, 1).url).toBe("/campuses/c1/banner");
  });

  it("reads the hub, programmes, providers and patients", async () => {
    await campusesCurator.hub("c1");
    await campusesCurator.programmes("c1", "sci");
    await campusesCurator.programmeCatalogue("c1", { q: "art", size: 10 });
    await campusesCurator.providers("c1");
    await campusesCurator.patients("c1", { page: 2 });

    expect(fetchMock.mock.calls.map(([url]) => url)).toEqual([
      "/campuses/c1/hub",
      "/campuses/c1/programmes?q=sci",
      "/campuses/c1/programmes/catalogue?q=art&size=10",
      "/campuses/c1/providers",
      "/campuses/c1/patients?page=2",
    ]);
  });

  it("offers, edits and removes a programme", async () => {
    await campusesCurator.addProgramme("c1", "p1", {
      yearsFrom: 1,
      yearsTo: 3,
    });
    await campusesCurator.updateProgramme("c1", "p1", { graduationMonth: 6 });
    await campusesCurator.removeProgramme("c1", "p1");

    expect(call(fetchMock, 0)).toMatchObject({
      url: "/campuses/c1/programmes/p1",
      method: "POST",
      body: { yearsFrom: 1, yearsTo: 3 },
    });
    expect(call(fetchMock, 1)).toMatchObject({
      method: "PATCH",
      body: { graduationMonth: 6 },
    });
    expect(call(fetchMock, 2)).toMatchObject({
      url: "/campuses/c1/programmes/p1",
      method: "DELETE",
    });
  });

  it("updates and removes a campus provider, and moves a patient", async () => {
    await campusesCurator.updateProvider("c1", "pr1", { nsmqCounsellor: true });
    await campusesCurator.removeProvider("c1", "pr1");
    await campusesCurator.movePatient("a1", "c2");

    expect(call(fetchMock, 0)).toMatchObject({
      url: "/campuses/c1/providers/pr1",
      method: "PATCH",
      body: { nsmqCounsellor: true },
    });
    expect(call(fetchMock, 1)).toMatchObject({
      url: "/campuses/c1/providers/pr1",
      method: "DELETE",
    });
    expect(call(fetchMock, 2)).toMatchObject({
      url: "/patients/a1/campus",
      method: "PUT",
      body: { campusId: "c2" },
    });
  });
});

describe("catalogueCurator", () => {
  const fetchMock = useFetchMock();

  it("reads the Studios counts, campus types and locations", async () => {
    await catalogueCurator.studioCounts();
    await catalogueCurator.campusTypes();
    await catalogueCurator.locations();
    await catalogueCurator.createLocation("Accra");
    await catalogueCurator.renameLocation("l1", "Kumasi");

    expect(call(fetchMock, 0).url).toBe("/studio/counts");
    expect(call(fetchMock, 1).url).toBe("/campus-types");
    expect(call(fetchMock, 2).url).toBe("/locations");
    expect(call(fetchMock, 3)).toMatchObject({
      url: "/locations",
      method: "POST",
      body: { name: "Accra" },
    });
    expect(call(fetchMock, 4)).toMatchObject({
      url: "/locations/l1",
      method: "PATCH",
      body: { name: "Kumasi" },
    });
  });

  it("manages programmes", async () => {
    await catalogueCurator.programmes({ q: "sci", page: 0 });
    await catalogueCurator.programme("p1");
    await catalogueCurator.createProgramme({
      fullName: "General Science",
      defaultYears: 3,
    });
    await catalogueCurator.updateProgramme("p1", { version: 1, bio: "" });
    await catalogueCurator.uploadProgrammeCover("p1", new Blob(["x"]));

    expect(call(fetchMock, 0).url).toBe("/programmes?q=sci&page=0");
    expect(call(fetchMock, 1).url).toBe("/programmes/p1");
    expect(call(fetchMock, 2)).toMatchObject({
      url: "/programmes",
      method: "POST",
      body: { fullName: "General Science", defaultYears: 3 },
    });
    expect(call(fetchMock, 3)).toMatchObject({
      url: "/programmes/p1",
      method: "PATCH",
      body: { version: 1, bio: "" },
    });
    expect(call(fetchMock, 4)).toMatchObject({
      url: "/programmes/p1/cover",
      method: "PUT",
    });
  });

  it("manages tags", async () => {
    await catalogueCurator.tags();
    await catalogueCurator.tag("t1");
    await catalogueCurator.createTag("Clubs", ["Debate", "Chess"]);
    await catalogueCurator.updateTag("t1", {
      version: 2,
      options: [{ id: "o1", label: "Debate" }, { label: "Drama" }],
    });

    expect(call(fetchMock, 0).url).toBe("/tags");
    expect(call(fetchMock, 1).url).toBe("/tags/t1");
    expect(call(fetchMock, 2)).toMatchObject({
      url: "/tags",
      method: "POST",
      body: { title: "Clubs", options: ["Debate", "Chess"] },
    });
    expect(call(fetchMock, 3)).toMatchObject({
      url: "/tags/t1",
      method: "PATCH",
      body: {
        version: 2,
        options: [{ id: "o1", label: "Debate" }, { label: "Drama" }],
      },
    });
  });
});

describe("pagesCurator", () => {
  const fetchMock = useFetchMock();

  it("scopes cover pages and team entries by campus or global", async () => {
    await pagesCurator.covers({ campusId: "c1" });
    await pagesCurator.covers({ global: true });
    await pagesCurator.covers();
    await pagesCurator.teamEntries({ global: true });

    expect(fetchMock.mock.calls.map(([url]) => url)).toEqual([
      "/cover-pages?campusId=c1",
      "/cover-pages?global=true",
      "/cover-pages",
      "/team-entries?global=true",
    ]);
  });

  it("creates, edits, photographs and deletes a cover page", async () => {
    await pagesCurator.createCover({
      campusId: null,
      slogan: "Hi",
      colour: "#112233",
    });
    await pagesCurator.updateCover("cp1", { version: 1, position: 2 });
    await pagesCurator.uploadCoverPhoto("cp1", new Blob(["x"]));
    await pagesCurator.deleteCover("cp1");

    expect(call(fetchMock, 0)).toMatchObject({
      url: "/cover-pages",
      method: "POST",
      body: { campusId: null, slogan: "Hi", colour: "#112233" },
    });
    expect(call(fetchMock, 1)).toMatchObject({
      url: "/cover-pages/cp1",
      method: "PATCH",
      body: { version: 1, position: 2 },
    });
    expect(call(fetchMock, 2)).toMatchObject({
      url: "/cover-pages/cp1/photo",
      method: "PUT",
    });
    expect(call(fetchMock, 3)).toMatchObject({
      url: "/cover-pages/cp1",
      method: "DELETE",
    });
  });

  it("manages icons", async () => {
    await pagesCurator.icons();
    await pagesCurator.createIcon({ name: "Ama", rank: 1, lockIns: ["GMH"] });
    await pagesCurator.updateIcon("i1", {
      version: 4,
      achievements: ["Champion"],
    });
    await pagesCurator.uploadIconPhoto("i1", new Blob(["x"]));
    await pagesCurator.deleteIcon("i1");

    expect(call(fetchMock, 0).url).toBe("/icons");
    expect(call(fetchMock, 1)).toMatchObject({
      url: "/icons",
      method: "POST",
      body: { name: "Ama", rank: 1, lockIns: ["GMH"] },
    });
    expect(call(fetchMock, 2)).toMatchObject({
      url: "/icons/i1",
      method: "PATCH",
      body: { version: 4, achievements: ["Champion"] },
    });
    expect(call(fetchMock, 3)).toMatchObject({
      url: "/icons/i1/photo",
      method: "PUT",
    });
    expect(call(fetchMock, 4)).toMatchObject({
      url: "/icons/i1",
      method: "DELETE",
    });
  });

  it("manages team entries", async () => {
    await pagesCurator.addTeamEntry({
      type: "COACH",
      fullName: "Kofi",
      rank: 1,
    });
    await pagesCurator.updateTeamEntry("te1", { version: 1, type: "ADVISOR" });
    await pagesCurator.deleteTeamEntry("te1");

    expect(call(fetchMock, 0)).toMatchObject({
      url: "/team-entries",
      method: "POST",
      body: { type: "COACH", fullName: "Kofi", rank: 1 },
    });
    expect(call(fetchMock, 1)).toMatchObject({
      url: "/team-entries/te1",
      method: "PATCH",
      body: { version: 1, type: "ADVISOR" },
    });
    expect(call(fetchMock, 2)).toMatchObject({
      url: "/team-entries/te1",
      method: "DELETE",
    });
  });
});
