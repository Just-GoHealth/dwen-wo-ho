/**
 * Campuses, curator side (CampusController, PatientController): Studios create/edit,
 * archive, sites, images, the Campus hub, programmes offered, providers and patients.
 *
 * Edits carry `version`; a stale one answers 409 STALE. Names and nicknames are unique
 * across campuses, ignoring case (409 NAME_TAKEN with a `fields` entry).
 */
import { buildQuery, http } from "@/lib/v2/http";
import { fileForm, seg } from "./files";
import type {
  CampusCard,
  CampusCardItem,
  Image,
  ISOInstant,
  Page,
  PageParams,
  UUID,
} from "./types";

export interface Location {
  id: UUID;
  name: string;
}

export interface Site {
  id: UUID;
  name: string;
}

/** CampusService.Detail */
export interface CampusDetail {
  id: UUID;
  fullName: string;
  nicknames: string[];
  motto: string | null;
  type: string;
  typeLabel: string;
  card: CampusCard;
  location: Location | null;
  logo: Image | null;
  banner: Image | null;
  defaultGraduationMonth: number | null;
  sites: Site[];
  archived: boolean;
  version: number;
}

/**
 * CampusService.Hub. `counts` keys: programmes, providers, hosts, patients, justIn,
 * awaitingResults.
 */
export interface CampusHub {
  campus: CampusDetail;
  counts: Record<string, number>;
}

/** CampusController.CreateRequest */
export interface CampusCreateRequest {
  fullName: string;
  nicknames?: string[] | null;
  motto?: string | null;
  /** A campus-type code from GET /campus-types. */
  type: string;
  locationId: UUID;
  /** 1–12 */
  defaultGraduationMonth?: number | null;
}

/** CampusController.PatchRequest: only the fields being changed. "" motto clears; month 0 clears. */
export interface CampusPatchRequest {
  version: number;
  fullName?: string;
  nicknames?: string[];
  motto?: string;
  type?: string;
  locationId?: UUID;
  defaultGraduationMonth?: number;
}

export interface CampusListParams extends PageParams {
  card?: CampusCard;
  type?: string;
  q?: string;
  /** Curator only. */
  archived?: boolean;
}

export interface Choice {
  id: UUID;
  label: string;
  on: boolean;
}

export interface TagSetup {
  tagId: UUID;
  title: string;
  options: Choice[];
}

/** CampusProgrammeService.Offered */
export interface OfferedProgramme {
  programmeId: UUID;
  fullName: string;
  nicknames: string[];
  bio: string | null;
  cover: Image | null;
  yearsFrom: number;
  yearsTo: number;
  graduationMonth: number;
  graduationMonthOverride: number | null;
  nicknameChoices: Choice[];
  tags: TagSetup[];
}

export interface ProgrammeList {
  fromCatalogue: boolean;
  items: OfferedProgramme[];
}

/** CampusController.SetupRequest */
export interface ProgrammeSetupRequest {
  yearsFrom?: number | null;
  yearsTo?: number | null;
  graduationMonth?: number | null;
  nicknameIds?: UUID[] | null;
  tags?: { tagId: UUID; optionIds?: UUID[] | null }[] | null;
}

/** CampusProviders.CampusProvider */
export interface CampusProvider {
  providerId: UUID;
  title: string | null;
  fullName: string;
  initials: string;
  photo: Image | null;
  roleCategoryId: UUID | null;
  roleCategory: string | null;
  nsmqCounsellor: boolean;
  mainHost: boolean;
  broughtByCampusHostId: UUID | null;
  attachedAt: ISOInstant;
}

/** PatientService.Student */
export interface CampusStudent {
  accountId: UUID;
  fullName: string;
  initials: string;
  nickname: string;
  photo: Image | null;
  gradeLabel: string | null;
  graduationYear: number | null;
}

/** CatalogueService.Programme (the "other programmes" list uses it). */
export interface CatalogueProgramme {
  id: UUID;
  fullName: string;
  nicknames: { id: UUID; name: string }[];
  bio: string | null;
  cover: Image | null;
  defaultYears: number;
  version: number;
}

export const campusesCurator = {
  list: (params: CampusListParams = {}) =>
    http.get<Page<CampusCardItem>>(`/campuses${buildQuery({ ...params })}`),
  detail: (id: UUID) => http.get<CampusDetail>(`/campuses/${seg(id)}`),
  create: (body: CampusCreateRequest) =>
    http.post<CampusDetail>("/campuses", body),
  update: (id: UUID, body: CampusPatchRequest) =>
    http.patch<CampusDetail>(`/campuses/${seg(id)}`, body),
  /** Hides it from pickers and Studios lists; results and access stay. */
  archive: (id: UUID) =>
    http.post<CampusDetail>(`/campuses/${seg(id)}/archive`),
  restore: (id: UUID) =>
    http.post<CampusDetail>(`/campuses/${seg(id)}/restore`),
  /** The whole ordered list. A site that stays keeps its id. */
  setSites: (id: UUID, sites: string[]) =>
    http.put<CampusDetail>(`/campuses/${seg(id)}/sites`, { sites }),
  uploadLogo: (id: UUID, file: Blob) =>
    http.upload<CampusDetail>(`/campuses/${seg(id)}/logo`, fileForm(file)),
  uploadBanner: (id: UUID, file: Blob) =>
    http.upload<CampusDetail>(`/campuses/${seg(id)}/banner`, fileForm(file)),
  hub: (id: UUID) => http.get<CampusHub>(`/campuses/${seg(id)}/hub`),

  // Programmes offered here
  programmes: (id: UUID, q?: string) =>
    http.get<ProgrammeList>(
      `/campuses/${seg(id)}/programmes${buildQuery({ q })}`,
    ),
  programmeCatalogue: (id: UUID, params: PageParams & { q?: string } = {}) =>
    http.get<Page<CatalogueProgramme>>(
      `/campuses/${seg(id)}/programmes/catalogue${buildQuery({ ...params })}`,
    ),
  addProgramme: (id: UUID, programmeId: UUID, setup?: ProgrammeSetupRequest) =>
    http.post<OfferedProgramme>(
      `/campuses/${seg(id)}/programmes/${seg(programmeId)}`,
      setup,
    ),
  updateProgramme: (
    id: UUID,
    programmeId: UUID,
    setup: ProgrammeSetupRequest,
  ) =>
    http.patch<OfferedProgramme>(
      `/campuses/${seg(id)}/programmes/${seg(programmeId)}`,
      setup,
    ),
  removeProgramme: (id: UUID, programmeId: UUID) =>
    http.delete<void>(`/campuses/${seg(id)}/programmes/${seg(programmeId)}`),

  // Providers serving the campus
  providers: (id: UUID) =>
    http.get<CampusProvider[]>(`/campuses/${seg(id)}/providers`),
  updateProvider: (
    id: UUID,
    providerId: UUID,
    body: { roleCategoryId?: UUID | null; nsmqCounsellor?: boolean | null },
  ) =>
    http.patch<CampusProvider>(
      `/campuses/${seg(id)}/providers/${seg(providerId)}`,
      body,
    ),
  /** The provider and the campus's providers are emailed. */
  removeProvider: (id: UUID, providerId: UUID) =>
    http.delete<void>(`/campuses/${seg(id)}/providers/${seg(providerId)}`),

  // Students
  patients: (id: UUID, params: PageParams & { q?: string } = {}) =>
    http.get<Page<CampusStudent>>(
      `/campuses/${seg(id)}/patients${buildQuery({ ...params })}`,
    ),
  /** Past results keep the campus they were taken at. Answers the student's PatientHome. */
  movePatient: (accountId: UUID, campusId: UUID) =>
    http.put<unknown>(`/patients/${seg(accountId)}/campus`, { campusId }),
};
