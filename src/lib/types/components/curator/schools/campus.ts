import type { School } from "@/lib/types/entities/school";
import type { CampusCard } from "@/lib/v2/curator/types";
import type { Site } from "@/lib/v2/curator/campuses";

/**
 * A v2 campus as the curator school screens render it. Extends the screens'
 * existing `School` shape so the cards, bars and search keep working; the
 * v2-only fields carry what edits need (`version` for 409 STALE, the
 * location, the sites that replaced v1's "campuses" list).
 */
export interface CuratorSchool extends School {
  id: string;
  nicknames: string[];
  card?: CampusCard;
  typeLabel?: string;
  locationId?: string | null;
  locationName?: string | null;
  sites?: Site[];
  banner?: string;
  archived?: boolean;
  /** Required on PATCH /campuses/{id}; absent on list cards. */
  version?: number;
  defaultGraduationMonth?: number | null;
}
