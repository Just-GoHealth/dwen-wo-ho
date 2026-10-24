import { providerApi } from "@/lib/v2/provider";
import { resultsApi } from "@/lib/v2/results";
import { notificationsApi } from "@/lib/v2/notifications";
import { ApiError } from "@/lib/v2/http";
import {
  inferCampusIds,
  toPatientCase,
} from "@/lib/utils/provider/campus-membership";
import type { PatientCase } from "@/lib/types/api/patient-results";
import type { ProviderCampusSummary } from "@/lib/types/api/provider-dashboard";
import type { CampusCardItem, ResultItem, UUID } from "@/lib/v2/types";

const PAGE_SIZE = 100;
// Public campus list: alphabetical, paged; enough pages for the whole network.
const MAX_DIRECTORY_PAGES = 20;

/** Every public campus by id (names and logos for the inferred campus ids). */
export async function loadCampusDirectory(): Promise<
  Record<UUID, CampusCardItem>
> {
  const directory: Record<UUID, CampusCardItem> = {};
  for (let page = 0; page < MAX_DIRECTORY_PAGES; page++) {
    const res = await providerApi.campuses({ page, size: PAGE_SIZE });
    res.items.forEach((c) => {
      directory[c.id] = c;
    });
    if ((page + 1) * res.size >= res.total || res.items.length === 0) break;
  }
  return directory;
}

/** Campus ids this provider serves, inferred (see inferCampusIds). */
export async function loadMyCampusIds(): Promise<UUID[]> {
  const [requests, notifications] = await Promise.all([
    providerApi.joinRequests({ size: PAGE_SIZE }),
    notificationsApi.list({ size: PAGE_SIZE }),
  ]);
  return inferCampusIds(requests.items, notifications.items);
}

export type ProviderHomeData = {
  schools: ProviderCampusSummary[];
  patients: PatientCase[];
};

/**
 * The home roll: newest results for each campus the provider serves. A
 * campus whose results answer 404 isn't (or no longer is) theirs, so it is
 * dropped rather than treated as an error.
 */
export async function loadProviderHome(
  directory: Record<UUID, CampusCardItem>,
): Promise<ProviderHomeData> {
  const campusIds = await loadMyCampusIds();

  const perCampus = await Promise.all(
    campusIds.map(async (id) => {
      try {
        const page = await resultsApi.list(id, { size: PAGE_SIZE });
        return { id, items: page.items as ResultItem[] };
      } catch (error) {
        if (error instanceof ApiError && error.code === "NOT_FOUND")
          return null;
        throw error;
      }
    }),
  );

  const schools: ProviderCampusSummary[] = [];
  const patients: PatientCase[] = [];
  for (const entry of perCampus) {
    if (!entry) continue;
    const campus = directory[entry.id];
    const name = campus?.fullName ?? "Campus";
    schools.push({
      schoolId: entry.id,
      schoolName: name,
      count: entry.items.length,
      hasNotif: entry.items.some((i) => !i.seen),
      avatarUrl: campus?.logo?.thumbnailUrl ?? null,
      primaryColor: null,
    });
    entry.items.forEach((item) =>
      patients.push(
        toPatientCase(item, {
          id: entry.id,
          name,
          nickname: campus?.nicknames[0],
        }),
      ),
    );
  }
  schools.sort((a, b) => a.schoolName.localeCompare(b.schoolName));
  return { schools, patients };
}
