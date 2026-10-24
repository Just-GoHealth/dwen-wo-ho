import type { CuratorSummary } from "@/lib/types/api/curator";
import type { StudioCounts } from "@/lib/v2/curator/catalogue";

const EMPTY_SUMMARY: CuratorSummary = {
  schoolCount: 0,
  providerCount: 0,
  partnerCount: 0,
  campusCount: 0,
  specialtyCount: 0,
  programmeCount: 0,
  tagCount: 0,
  justInCount: 0,
};

/**
 * The sidebar and Studios hub counts from v2: GET /studio/counts (campuses,
 * programmes, tags, providers), the hosts total (partners) and the pending
 * Just In total. Schools are campuses; Studios "providers" are provider records.
 */
export function normalizeCuratorSummary(
  counts: StudioCounts | null | undefined,
  extra: { hostCount?: number; justInCount?: number } = {},
): CuratorSummary {
  if (!counts) {
    return {
      ...EMPTY_SUMMARY,
      partnerCount: extra.hostCount ?? 0,
      justInCount: extra.justInCount ?? 0,
    };
  }
  const campuses = counts.campuses ?? 0;
  const providers = counts.providers ?? 0;
  return {
    schoolCount: campuses,
    campusCount: campuses,
    providerCount: providers,
    specialtyCount: providers,
    programmeCount: counts.programmes ?? 0,
    tagCount: counts.tags ?? 0,
    partnerCount: extra.hostCount ?? 0,
    justInCount: extra.justInCount ?? 0,
  };
}
