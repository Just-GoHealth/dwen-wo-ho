/**
 * Providers in Studios and the Just In approval queue (ProviderController).
 * Curator-only codes: EMAIL_LOCKED (409, field `email`: the provider has claimed their
 * account), NO_EMAIL (invite without an email), REQUEST_DECIDED (409, approve/decline a
 * request that is no longer pending), NAME_TAKEN (field `nicknames`), STALE.
 */
import { buildQuery, http } from "@/lib/v2/http";
import { fileForm, seg } from "./files";
import type {
  JoinRequestKind,
  JoinRequestStatus,
  JoinRequestView,
  JoinTargetType,
  Page,
  PageParams,
  ProviderProfile,
  ProviderStatus,
  ProviderSummary,
  UUID,
} from "./types";

export interface ProviderListParams extends PageParams {
  /** Name or nickname. */
  q?: string;
  roleCategory?: UUID;
  status?: ProviderStatus;
}

/** ProviderController.StudioRequest: approved from the start, no account until invited. */
export interface StudioProviderRequest {
  /** 30 chars max. */
  title?: string | null;
  fullName: string;
  nicknames?: string[] | null;
  email?: string | null;
  phone?: string | null;
  slogan?: string | null;
  clinicianNotes?: string | null;
  bio?: string | null;
  clinical?: boolean | null;
  roleCategoryIds?: UUID[] | null;
}

/** ProviderController.StudioPatchRequest */
export type StudioProviderPatch = { version: number } & Partial<
  Omit<StudioProviderRequest, "fullName">
> & { fullName?: string };

export interface JoinRequestListParams extends PageParams {
  status?: JoinRequestStatus;
  kind?: JoinRequestKind;
  /** With targetId: one hub's Just In. */
  targetType?: JoinTargetType;
  targetId?: UUID;
}

/** Data of the `just-in` event on GET /me/stream: a Just In badge changed (11.2). */
export interface JustInEvent {
  /** Pending requests in total. */
  pending: number;
  /** The campus or host whose queue changed; null for provider applications. */
  targetId: string | null;
}

export const providersCurator = {
  list: (params: ProviderListParams = {}) =>
    http.get<Page<ProviderSummary>>(`/providers${buildQuery({ ...params })}`),
  detail: (id: UUID) => http.get<ProviderProfile>(`/providers/${seg(id)}`),
  create: (body: StudioProviderRequest) =>
    http.post<ProviderProfile>("/providers", body),
  update: (id: UUID, body: StudioProviderPatch) =>
    http.patch<ProviderProfile>(`/providers/${seg(id)}`, body),
  uploadPhoto: (id: UUID, file: Blob) =>
    http.upload<ProviderProfile>(`/providers/${seg(id)}/photo`, fileForm(file)),
  /** Emails a Studios provider an invite to claim their record. 422 NO_EMAIL without an email. */
  invite: (id: UUID) =>
    http.post<ProviderProfile>(`/providers/${seg(id)}/invite`),
};

export const joinRequestsCurator = {
  /** Pending first. */
  list: (params: JoinRequestListParams = {}) =>
    http.get<Page<JoinRequestView>>(
      `/join-requests${buildQuery({ ...params })}`,
    ),
  /** An application approves the provider; a hub request attaches them (role group optional). */
  approve: (id: UUID, roleCategoryId?: UUID | null) =>
    http.post<JoinRequestView>(`/join-requests/${seg(id)}/approve`, {
      roleCategoryId: roleCategoryId ?? null,
    }),
  /** An application rejects the provider (they may resubmit). */
  decline: (id: UUID) =>
    http.post<JoinRequestView>(`/join-requests/${seg(id)}/decline`),
};
