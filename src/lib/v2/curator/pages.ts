/**
 * Landing-page content (PagesController): cover pages, the icons wall, team entries and
 * the Reach baseline. All curator only; edits carry `version` (409 STALE).
 * Without a campusId, a cover page or team entry is JustGo Health's own.
 */
import { buildQuery, http } from "@/lib/v2/http";
import { fileForm, seg } from "./files";
import type { Image, UUID } from "./types";

/** PageService.CoverView */
export interface CoverView {
  id: UUID;
  campusId: UUID | null;
  photo: Image | null;
  slogan: string | null;
  /** "#RRGGBB" */
  colour: string | null;
  position: number;
  version: number;
}

export interface CoverRequest {
  campusId?: UUID | null;
  slogan?: string | null;
  colour?: string | null;
  position?: number | null;
}

export interface CoverPatch {
  version: number;
  slogan?: string;
  colour?: string;
  position?: number;
}

/** PageService.IconView: what the public wall shows. */
export interface IconView {
  id: UUID;
  nickname: string | null;
  name: string;
  slogan: string | null;
  campusId: UUID | null;
  campusName: string | null;
  year: number | null;
  photo: Image | null;
  rank: number | null;
  position: number;
  achievements: string[];
  lockIns: string[];
}

/** PageService.CuratorIcon: the icon plus the phone, which stays with the curator. */
export interface CuratorIcon {
  icon: IconView;
  phone: string | null;
  version: number;
}

/** PagesController.IconRequest */
export interface IconRequest {
  name: string;
  nickname?: string | null;
  slogan?: string | null;
  campusId?: UUID | null;
  /** 1900–2100 */
  year?: number | null;
  /** >= 1 */
  rank?: number | null;
  position?: number | null;
  phone?: string | null;
  achievements?: string[] | null;
  lockIns?: string[] | null;
}

/** PagesController.IconPatch. Lists, when sent, replace what was there, in order. */
export type IconPatch = { version: number } & Partial<IconRequest>;

export type TeamEntryType = "COACH" | "ADVISOR" | "AMBASSADOR";

/** PageService.TeamView */
export interface TeamEntry {
  id: UUID;
  campusId: UUID | null;
  type: TeamEntryType;
  fullName: string;
  rank: number;
  version: number;
}

export interface TeamEntryRequest {
  campusId?: UUID | null;
  type: TeamEntryType;
  fullName: string;
  rank?: number | null;
}

export interface TeamEntryPatch {
  version: number;
  type?: TeamEntryType;
  fullName?: string;
  rank?: number;
}

/** A campus's (campusId), JustGo Health's (global), or all when neither is set. */
export interface PageScope {
  campusId?: UUID;
  global?: boolean;
}

export const pagesCurator = {
  // Cover pages
  covers: (scope: PageScope = {}) =>
    http.get<CoverView[]>(`/cover-pages${buildQuery({ ...scope })}`),
  createCover: (body: CoverRequest) =>
    http.post<CoverView>("/cover-pages", body),
  updateCover: (id: UUID, body: CoverPatch) =>
    http.patch<CoverView>(`/cover-pages/${seg(id)}`, body),
  uploadCoverPhoto: (id: UUID, file: Blob) =>
    http.upload<CoverView>(`/cover-pages/${seg(id)}/photo`, fileForm(file)),
  deleteCover: (id: UUID) => http.delete<void>(`/cover-pages/${seg(id)}`),

  // Icons
  icons: () => http.get<CuratorIcon[]>("/icons"),
  createIcon: (body: IconRequest) => http.post<CuratorIcon>("/icons", body),
  updateIcon: (id: UUID, body: IconPatch) =>
    http.patch<CuratorIcon>(`/icons/${seg(id)}`, body),
  uploadIconPhoto: (id: UUID, file: Blob) =>
    http.upload<CuratorIcon>(`/icons/${seg(id)}/photo`, fileForm(file)),
  deleteIcon: (id: UUID) => http.delete<void>(`/icons/${seg(id)}`),

  // Team entries (coaches, advisors, ambassadors)
  teamEntries: (scope: PageScope = {}) =>
    http.get<TeamEntry[]>(`/team-entries${buildQuery({ ...scope })}`),
  addTeamEntry: (body: TeamEntryRequest) =>
    http.post<TeamEntry>("/team-entries", body),
  updateTeamEntry: (id: UUID, body: TeamEntryPatch) =>
    http.patch<TeamEntry>(`/team-entries/${seg(id)}`, body),
  deleteTeamEntry: (id: UUID) => http.delete<void>(`/team-entries/${seg(id)}`),
};
