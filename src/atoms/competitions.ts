import { atomWithStorage } from "jotai/utils";

// No endpoint lists/creates versions — a curator sets this once (from the
// Competitions area) so school-detail pages know which version's teams to
// resolve against. Persisted so it survives reloads/navigation.
export const currentCompetitionCodeAtom = atomWithStorage<string | null>(
  "current-competition-code",
  null,
);
