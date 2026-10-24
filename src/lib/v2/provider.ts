import { http } from "./http";
import type {
  CampusCardItem,
  CampusListParams,
  JoinRequestBody,
  JoinRequestView,
  Page,
  PageParams,
  ProviderPatchRequest,
  ProviderProfile,
} from "./types";

/** The provider's own profile, application and join requests (4a, 4b). */
export const providerApi = {
  me: () => http.get<ProviderProfile>("/providers/me"),
  /** Moves to PENDING when the last required field is filled. 409 STALE on an old `version`. */
  patchMe: (body: ProviderPatchRequest) =>
    http.patch<ProviderProfile>("/providers/me", body),
  /** Multipart field `file`, already cropped round; 5 MB max. */
  uploadPhoto: (file: Blob, filename = "photo.jpg") => {
    const form = new FormData();
    form.append("file", file, filename);
    return http.upload<ProviderProfile>("/providers/me/photo", form, "PUT");
  },
  resubmit: () => http.post<ProviderProfile>("/providers/me/resubmit"),
  requestJoin: (body: JoinRequestBody) =>
    http.post<JoinRequestView>("/providers/me/join-requests", body),
  joinRequests: (params: PageParams = {}) =>
    http.get<Page<JoinRequestView>>("/providers/me/join-requests", {
      query: { ...params },
    }),
  /** Public campus list, alphabetical. */
  campuses: (params: CampusListParams = {}) =>
    http.get<Page<CampusCardItem>>("/campuses", { query: { ...params } }),
};
