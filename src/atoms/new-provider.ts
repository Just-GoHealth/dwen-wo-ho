import { ProviderProfileData } from "@/lib/types/api/provider-dashboard";
import { atom } from "jotai";
import type { TriageTier } from "@/lib/utils/shared/triage";

export const activeSchoolAtom = atom("all");
export const activeStatusAtom = atom("all");
export const searchQueryAtom = atom("");
export const appliedSearchQueryAtom = atom("");
// Lifted out of ProviderHomeShell's local state — a plain useState there
// resets on unmount, so navigating to a patient and back silently cleared
// the active triage filter. An atom survives that round trip.
export const triageFilterAtom = atom<TriageTier | "all">("all");

// Same reasoning as triageFilterAtom, for the patient grid's own scroll
// position/render-batch — otherwise opening a patient and pressing back
// re-mounts the grid fresh, dropping you back at the top with only the
// first batch rendered instead of wherever you'd scrolled to.
export const patientGridVisibleCountAtom = atom(20);
export const patientGridScrollTopAtom = atom(0);

export const profileOpenAtom = atom(false);
export const editOpenAtom = atom(false);

// Initialised empty – real data loaded from API via useProviderDashboard
export const profileDataAtom = atom<Partial<ProviderProfileData>>({});

export const editFieldKeyAtom = atom<string | null>(null);
export const editFieldLabelAtom = atom<string | null>(null);
export const editValueAtom = atom("");
