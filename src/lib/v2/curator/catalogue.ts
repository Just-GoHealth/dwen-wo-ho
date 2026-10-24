/**
 * The Studios catalogue (CatalogueController): programmes, tags, locations, campus types
 * and the Studios hub counts. Names are unique (409 NAME_TAKEN on the named field);
 * edits carry `version` (409 STALE).
 */
import { buildQuery, http } from "@/lib/v2/http";
import { fileForm, seg } from "./files";
import type { CampusType, Page, PageParams, UUID } from "./types";
import type { CatalogueProgramme, Location } from "./campuses";

/** CatalogueController.ProgrammeRequest */
export interface ProgrammeRequest {
  fullName: string;
  nicknames?: string[] | null;
  bio?: string | null;
  /** 1–10, default 4. */
  defaultYears?: number | null;
}

/** CatalogueController.ProgrammePatchRequest. "" bio clears it. */
export interface ProgrammePatch {
  version: number;
  fullName?: string;
  nicknames?: string[];
  bio?: string;
  defaultYears?: number;
}

export interface TagOption {
  id: UUID;
  label: string;
}

/** CatalogueService.Tag */
export interface CatalogueTag {
  id: UUID;
  title: string;
  options: TagOption[];
  version: number;
}

/** CatalogueController.TagPatchRequest. `options`, when sent, is the whole ordered list. */
export interface TagPatch {
  version: number;
  title?: string;
  /** Give an option's id to keep it; leave it out to add a new one. */
  options?: { id?: UUID | null; label: string }[];
}

/** Studios hub counts (10.1), e.g. {campuses, programmes, tags, providers, ...}. */
export type StudioCounts = Record<string, number>;

export const catalogueCurator = {
  studioCounts: () => http.get<StudioCounts>("/studio/counts"),
  campusTypes: () => http.get<CampusType[]>("/campus-types"),

  // Locations
  locations: () => http.get<Location[]>("/locations"),
  createLocation: (name: string) => http.post<Location>("/locations", { name }),
  renameLocation: (id: UUID, name: string) =>
    http.patch<Location>(`/locations/${seg(id)}`, { name }),

  // Programmes
  programmes: (params: PageParams & { q?: string } = {}) =>
    http.get<Page<CatalogueProgramme>>(
      `/programmes${buildQuery({ ...params })}`,
    ),
  programme: (id: UUID) =>
    http.get<CatalogueProgramme>(`/programmes/${seg(id)}`),
  createProgramme: (body: ProgrammeRequest) =>
    http.post<CatalogueProgramme>("/programmes", body),
  updateProgramme: (id: UUID, body: ProgrammePatch) =>
    http.patch<CatalogueProgramme>(`/programmes/${seg(id)}`, body),
  uploadProgrammeCover: (id: UUID, file: Blob) =>
    http.upload<CatalogueProgramme>(
      `/programmes/${seg(id)}/cover`,
      fileForm(file),
    ),

  // Tags
  tags: () => http.get<CatalogueTag[]>("/tags"),
  tag: (id: UUID) => http.get<CatalogueTag>(`/tags/${seg(id)}`),
  createTag: (title: string, options: string[]) =>
    http.post<CatalogueTag>("/tags", { title, options }),
  updateTag: (id: UUID, body: TagPatch) =>
    http.patch<CatalogueTag>(`/tags/${seg(id)}`, body),
};
