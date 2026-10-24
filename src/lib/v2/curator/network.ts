/**
 * Curator Management network (NetworkController, PagesController reach): venues, hosts,
 * host partners and providers, campus ⇄ host routing, campus providers and Reach.
 * All curator only. Edits carry `version` (409 STALE); names are unique (409 NAME_TAKEN).
 * Network codes: HOST_ALREADY_AT_CAMPUS, ALREADY_LINKED (409); VENUE_NOT_THE_HOSTS,
 * VIA_HOSTS_REQUIRED, PROVIDER_NOT_APPROVED (422).
 */
import { buildQuery, http } from "@/lib/v2/http";
import { fileForm, seg } from "./files";
import type { CampusProvider, Location } from "./campuses";
import type { Image, ISOInstant, Page, PageParams, UUID } from "./types";

export type HostType = "CLINICAL" | "CURATOR" | "BRAND";

/** NetworkService.VenueView */
export interface VenueView {
  id: UUID;
  title: string;
  bio: string | null;
  serviceTypes: string[];
  version: number;
}

export interface VenueRequest {
  title: string;
  bio?: string | null;
  /** At least one. */
  serviceTypes: string[];
}

export interface VenuePatch {
  version: number;
  title?: string;
  bio?: string;
  serviceTypes?: string[];
}

/** NetworkStore.Circle */
export interface Circle {
  venueId: UUID;
  title: string;
  serviceTypes: string[];
  addedAt: ISOInstant;
}

/** NetworkService.HostView */
export interface HostView {
  id: UUID;
  fullName: string;
  nicknames: string[];
  type: HostType;
  bio: string | null;
  location: Location | null;
  photo: Image | null;
  version: number;
}

export interface HostRequest {
  fullName: string;
  /** At least one, unique across hosts. */
  nicknames: string[];
  type: HostType;
  bio: string;
  locationId: UUID;
}

export interface HostPatch {
  version: number;
  fullName?: string;
  nicknames?: string[];
  type?: HostType;
  bio?: string;
  locationId?: UUID;
}

export interface HostListParams extends PageParams {
  q?: string;
  type?: HostType;
  /** The "Other hosts" catalogue for that campus. */
  notAtCampus?: UUID;
}

/** NetworkService.Hub. Host counts: venues, campuses, partners, providers, justIn. Venue: circles. */
export interface HostHub {
  identity: HostView;
  counts: Record<string, number>;
}

export interface VenueHub {
  identity: { venue: VenueView; circles: Circle[] };
  counts: Record<string, number>;
}

/** NetworkStore.Partner */
export interface HostPartner {
  hostId: UUID;
  joinType: HostType | null;
}

export interface PartnerRequest {
  partnerHostId: UUID;
  joinType?: HostType | null;
  venueIds?: UUID[] | null;
}

/** NetworkController.ProviderRequest */
export interface ProviderRouting {
  providerId: UUID;
  /** Their first role group when left out. */
  roleCategoryId?: UUID | null;
  mainHost?: boolean | null;
  /** Required unless mainHost (422 VIA_HOSTS_REQUIRED). */
  viaHostIds?: UUID[] | null;
}

/** NetworkService.HostProviderView */
export interface HostProviderView {
  providerId: UUID;
  title: string | null;
  fullName: string;
  initials: string;
  photo: Image | null;
  roleCategoryId: UUID | null;
  roleCategory: string | null;
  mainHost: boolean;
  viaHostIds: UUID[];
  attachedAt: ISOInstant;
}

/** NetworkService.CampusHostView */
export interface CampusHostView {
  hostId: UUID;
  fullName: string;
  type: HostType;
  joinType: HostType | null;
  mainVenueId: UUID | null;
  venueIds: UUID[];
  broughtByHostId: UUID | null;
  photo: Image | null;
  addedAt: ISOInstant;
}

/** NetworkController.CampusHostRequest. Brings all partners/providers when those lists are left out. */
export interface CampusHostRequest {
  hostId: UUID;
  joinType?: HostType | null;
  mainVenueId?: UUID | null;
  venueIds?: UUID[] | null;
  bringPartnerIds?: UUID[] | null;
  bringProviderIds?: UUID[] | null;
}

/** ReachService.ReachView */
export interface ReachView {
  reach: number;
  baseline: number;
  visits: number;
  screens: number;
  carriedVisits: number;
  carriedScreens: number;
  results: number;
  activeResults: number;
}

export const networkCurator = {
  // Venues
  venues: (q?: string) => http.get<VenueView[]>(`/venues${buildQuery({ q })}`),
  createVenue: (body: VenueRequest) => http.post<VenueView>("/venues", body),
  updateVenue: (id: UUID, body: VenuePatch) =>
    http.patch<VenueView>(`/venues/${seg(id)}`, body),
  venueHub: (id: UUID) => http.get<VenueHub>(`/venues/${seg(id)}/hub`),
  addCircles: (
    id: UUID,
    circles: { venueId: UUID; serviceTypes?: string[] | null }[],
  ) => http.post<Circle[]>(`/venues/${seg(id)}/circles`, circles),
  removeCircle: (id: UUID, connectedId: UUID) =>
    http.delete<void>(`/venues/${seg(id)}/circles/${seg(connectedId)}`),

  // Hosts
  hosts: (params: HostListParams = {}) =>
    http.get<Page<HostView>>(`/hosts${buildQuery({ ...params })}`),
  host: (id: UUID) => http.get<HostView>(`/hosts/${seg(id)}`),
  createHost: (body: HostRequest) => http.post<HostView>("/hosts", body),
  updateHost: (id: UUID, body: HostPatch) =>
    http.patch<HostView>(`/hosts/${seg(id)}`, body),
  uploadHostPhoto: (id: UUID, file: Blob) =>
    http.upload<HostView>(`/hosts/${seg(id)}/photo`, fileForm(file)),
  hostHub: (id: UUID) => http.get<HostHub>(`/hosts/${seg(id)}/hub`),
  /** Returns the host's venue ids. */
  addHostVenue: (id: UUID, venueId: UUID) =>
    http.put<UUID[]>(`/hosts/${seg(id)}/venues/${seg(venueId)}`),
  removeHostVenue: (id: UUID, venueId: UUID) =>
    http.delete<UUID[]>(`/hosts/${seg(id)}/venues/${seg(venueId)}`),
  network: (id: UUID) => http.get<HostView[]>(`/hosts/${seg(id)}/network`),
  setNetwork: (id: UUID, memberHostIds: UUID[]) =>
    http.put<HostView[]>(`/hosts/${seg(id)}/network`, { memberHostIds }),
  partners: (id: UUID) => http.get<HostPartner[]>(`/hosts/${seg(id)}/partners`),
  addPartners: (id: UUID, partners: PartnerRequest[]) =>
    http.post<HostPartner[]>(`/hosts/${seg(id)}/partners`, partners),
  removePartner: (id: UUID, partnerId: UUID) =>
    http.delete<void>(`/hosts/${seg(id)}/partners/${seg(partnerId)}`),
  hostProviders: (id: UUID) =>
    http.get<HostProviderView[]>(`/hosts/${seg(id)}/providers`),
  addHostProviders: (id: UUID, providers: ProviderRouting[]) =>
    http.post<HostProviderView[]>(`/hosts/${seg(id)}/providers`, { providers }),
  removeHostProvider: (id: UUID, providerId: UUID) =>
    http.delete<void>(`/hosts/${seg(id)}/providers/${seg(providerId)}`),
  hostCampuses: (id: UUID) =>
    http.get<CampusHostView[]>(`/hosts/${seg(id)}/campuses`),

  // Campus ⇄ hosts and providers
  campusHosts: (campusId: UUID) =>
    http.get<CampusHostView[]>(`/campuses/${seg(campusId)}/hosts`),
  addCampusHosts: (campusId: UUID, hosts: CampusHostRequest[]) =>
    http.post<CampusHostView[]>(`/campuses/${seg(campusId)}/hosts`, { hosts }),
  /** Providers the host brought stay until removed. */
  removeCampusHost: (campusId: UUID, hostId: UUID) =>
    http.delete<void>(`/campuses/${seg(campusId)}/hosts/${seg(hostId)}`),
  /** Each provider is emailed. 422 PROVIDER_NOT_APPROVED for a provider not approved. */
  addCampusProviders: (campusId: UUID, providers: ProviderRouting[]) =>
    http.post<CampusProvider[]>(`/campuses/${seg(campusId)}/providers`, {
      providers,
    }),
  /** providerId → the host ids they come through. */
  providerRoutes: (campusId: UUID) =>
    http.get<Record<UUID, UUID[]>>(
      `/campuses/${seg(campusId)}/providers/routes`,
    ),

  // Reach
  reach: (params: { campusId?: UUID; from?: string; to?: string } = {}) =>
    http.get<ReachView>(`/reach${buildQuery({ ...params })}`),
  /** A campus's baseline, or JustGo Health's own without campusId. */
  setReachBaseline: (value: number, campusId?: UUID | null) =>
    http.put<ReachView>("/reach/baseline", {
      campusId: campusId ?? null,
      value,
    }),
};
