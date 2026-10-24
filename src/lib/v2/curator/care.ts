/**
 * The care catalogue (CareController): treatments, outcome → treatment links (Actions,
 * 7.2) and the Waiting Room. Treatment names are unique (409 NAME_TAKEN, field `name`);
 * edits carry `version` (409 STALE).
 */
import { buildQuery, http } from "@/lib/v2/http";
import { fileForm, seg } from "./files";
import type { CareApp, Image, OutcomeCare, Treatment, UUID } from "./types";

/** CareService.TreatmentView */
export interface TreatmentView {
  id: UUID;
  name: string;
  defaultRank: number;
  photo: Image | null;
  version: number;
}

/** CareService.Action: an outcome students have reached, with counts and treatments. */
export interface CareAction {
  id: UUID;
  app: CareApp;
  sectionCode: string;
  sectionTitle: string;
  band: string;
  label: string;
  students: number;
  treatments: Treatment[];
}

export interface OutcomeParams {
  app?: CareApp;
  q?: string;
  /** Adds outcomes nobody has reached yet. */
  all?: boolean;
}

export const careCurator = {
  outcomes: (params: OutcomeParams = {}) =>
    http.get<CareAction[]>(`/care/outcomes${buildQuery({ ...params })}`),
  /** Replaces the outcome's ranked treatments; published at once. */
  linkTreatments: (
    outcomeId: UUID,
    ranks: { treatmentId: UUID; rank: number }[],
  ) =>
    http.put<CareAction>(`/care/outcomes/${seg(outcomeId)}/treatments`, ranks),
  /** Outcomes with nothing linked are left out. */
  waitingRoom: (app?: CareApp) =>
    http.get<OutcomeCare[]>(`/care/waiting-room${buildQuery({ app })}`),

  treatments: () => http.get<TreatmentView[]>("/treatments"),
  createTreatment: (name: string, defaultRank?: number | null) =>
    http.post<TreatmentView>("/treatments", {
      name,
      defaultRank: defaultRank ?? null,
    }),
  updateTreatment: (
    id: UUID,
    body: { version: number; name?: string; defaultRank?: number },
  ) => http.patch<TreatmentView>(`/treatments/${seg(id)}`, body),
  uploadTreatmentPhoto: (id: UUID, file: Blob) =>
    http.upload<TreatmentView>(`/treatments/${seg(id)}/photo`, fileForm(file)),
};
