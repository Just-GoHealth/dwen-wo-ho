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

export const profileOpenAtom = atom(false);
export const editOpenAtom = atom(false);

// Initialised empty – real data loaded from API via useProviderDashboard
export const profileDataAtom = atom<Partial<ProviderProfileData>>({});

export const editFieldKeyAtom = atom<string | null>(null);
export const editFieldLabelAtom = atom<string | null>(null);
export const editValueAtom = atom("");
