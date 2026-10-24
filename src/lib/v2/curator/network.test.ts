import { describe, expect, it } from "vitest";
import { networkCurator } from "./network";
import { call, useFetchMock } from "./fetch.test-helper";

describe("networkCurator", () => {
  const fetchMock = useFetchMock();

  it("manages venues and circles", async () => {
    await networkCurator.venues("clinic");
    await networkCurator.createVenue({
      title: "Main",
      serviceTypes: ["Counselling"],
    });
    await networkCurator.updateVenue("v1", { version: 1, bio: "" });
    await networkCurator.venueHub("v1");
    await networkCurator.addCircles("v1", [
      { venueId: "v2", serviceTypes: ["Labs"] },
    ]);
    await networkCurator.removeCircle("v1", "v2");

    expect(call(fetchMock, 0).url).toBe("/venues?q=clinic");
    expect(call(fetchMock, 1)).toMatchObject({
      url: "/venues",
      method: "POST",
      body: { title: "Main", serviceTypes: ["Counselling"] },
    });
    expect(call(fetchMock, 2)).toMatchObject({
      url: "/venues/v1",
      method: "PATCH",
      body: { version: 1, bio: "" },
    });
    expect(call(fetchMock, 3).url).toBe("/venues/v1/hub");
    expect(call(fetchMock, 4)).toMatchObject({
      url: "/venues/v1/circles",
      method: "POST",
      body: [{ venueId: "v2", serviceTypes: ["Labs"] }],
    });
    expect(call(fetchMock, 5)).toMatchObject({
      url: "/venues/v1/circles/v2",
      method: "DELETE",
    });
  });

  it("lists, creates and edits hosts", async () => {
    await networkCurator.hosts({
      q: "korle",
      type: "CLINICAL",
      notAtCampus: "c1",
      page: 0,
      size: 20,
    });
    await networkCurator.host("h1");
    await networkCurator.createHost({
      fullName: "Korle Bu",
      nicknames: ["KBTH"],
      type: "CLINICAL",
      bio: "Teaching hospital",
      locationId: "l1",
    });
    await networkCurator.updateHost("h1", { version: 2, nicknames: ["KB"] });
    await networkCurator.uploadHostPhoto("h1", new Blob(["x"]));
    await networkCurator.hostHub("h1");

    expect(call(fetchMock, 0).url).toBe(
      "/hosts?q=korle&type=CLINICAL&notAtCampus=c1&page=0&size=20",
    );
    expect(call(fetchMock, 1).url).toBe("/hosts/h1");
    expect(call(fetchMock, 2)).toMatchObject({
      url: "/hosts",
      method: "POST",
      body: {
        fullName: "Korle Bu",
        nicknames: ["KBTH"],
        type: "CLINICAL",
        bio: "Teaching hospital",
        locationId: "l1",
      },
    });
    expect(call(fetchMock, 3)).toMatchObject({
      url: "/hosts/h1",
      method: "PATCH",
      body: { version: 2, nicknames: ["KB"] },
    });
    expect(call(fetchMock, 4)).toMatchObject({
      url: "/hosts/h1/photo",
      method: "PUT",
    });
    expect(call(fetchMock, 5).url).toBe("/hosts/h1/hub");
  });

  it("links a host's venues, network, partners and providers", async () => {
    await networkCurator.addHostVenue("h1", "v1");
    await networkCurator.removeHostVenue("h1", "v1");
    await networkCurator.setNetwork("h1", ["h2"]);
    await networkCurator.network("h1");
    await networkCurator.addPartners("h1", [
      { partnerHostId: "h2", joinType: "BRAND" },
    ]);
    await networkCurator.partners("h1");
    await networkCurator.removePartner("h1", "h2");
    await networkCurator.addHostProviders("h1", [
      { providerId: "p1", mainHost: true },
    ]);
    await networkCurator.hostProviders("h1");
    await networkCurator.removeHostProvider("h1", "p1");
    await networkCurator.hostCampuses("h1");

    const calls = fetchMock.mock.calls.map((_, n) => {
      const { url, method } = call(fetchMock, n);
      return `${method} ${url}`;
    });
    expect(calls).toEqual([
      "PUT /hosts/h1/venues/v1",
      "DELETE /hosts/h1/venues/v1",
      "PUT /hosts/h1/network",
      "GET /hosts/h1/network",
      "POST /hosts/h1/partners",
      "GET /hosts/h1/partners",
      "DELETE /hosts/h1/partners/h2",
      "POST /hosts/h1/providers",
      "GET /hosts/h1/providers",
      "DELETE /hosts/h1/providers/p1",
      "GET /hosts/h1/campuses",
    ]);
    expect(call(fetchMock, 2).body).toEqual({ memberHostIds: ["h2"] });
    expect(call(fetchMock, 4).body).toEqual([
      { partnerHostId: "h2", joinType: "BRAND" },
    ]);
    expect(call(fetchMock, 7).body).toEqual({
      providers: [{ providerId: "p1", mainHost: true }],
    });
  });

  it("routes hosts and providers to a campus", async () => {
    await networkCurator.addCampusHosts("c1", [
      { hostId: "h1", mainVenueId: "v1" },
    ]);
    await networkCurator.campusHosts("c1");
    await networkCurator.removeCampusHost("c1", "h1");
    await networkCurator.addCampusProviders("c1", [
      { providerId: "p1", viaHostIds: ["h1"] },
    ]);
    await networkCurator.providerRoutes("c1");

    expect(call(fetchMock, 0)).toMatchObject({
      url: "/campuses/c1/hosts",
      method: "POST",
      body: { hosts: [{ hostId: "h1", mainVenueId: "v1" }] },
    });
    expect(call(fetchMock, 1)).toMatchObject({
      url: "/campuses/c1/hosts",
      method: "GET",
    });
    expect(call(fetchMock, 2)).toMatchObject({
      url: "/campuses/c1/hosts/h1",
      method: "DELETE",
    });
    expect(call(fetchMock, 3)).toMatchObject({
      url: "/campuses/c1/providers",
      method: "POST",
      body: { providers: [{ providerId: "p1", viaHostIds: ["h1"] }] },
    });
    expect(call(fetchMock, 4).url).toBe("/campuses/c1/providers/routes");
  });

  it("reads Reach and sets the baseline", async () => {
    await networkCurator.reach({
      campusId: "c1",
      from: "2026-01-01T00:00:00Z",
    });
    await networkCurator.reach();
    await networkCurator.setReachBaseline(120, "c1");
    await networkCurator.setReachBaseline(5000);

    expect(call(fetchMock, 0).url).toBe(
      "/reach?campusId=c1&from=2026-01-01T00%3A00%3A00Z",
    );
    expect(call(fetchMock, 1).url).toBe("/reach");
    expect(call(fetchMock, 2)).toMatchObject({
      url: "/reach/baseline",
      method: "PUT",
      body: { campusId: "c1", value: 120 },
    });
    expect(call(fetchMock, 3).body).toEqual({ campusId: null, value: 5000 });
  });
});
