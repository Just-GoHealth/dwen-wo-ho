/**
 * Maps the v2 curator records onto the view shapes the curator school screens
 * already render (School, SchoolProvider, SchoolPatientRecord, SchoolIcon,
 * UrgentPatient). Keeping the mapping here means the cards and tabs don't
 * have to know the wire format.
 */
import type { CuratorSchool } from "@/lib/types/components/curator/schools/campus";
import type { SchoolPatientRecord } from "@/lib/types/components/curator/school-details/school-details";
import type { SchoolProvider } from "@/lib/types/entities/provider";
import type { SchoolIcon } from "@/lib/types/entities/school";
import type { UrgentPatient } from "@/lib/types/entities/patient";
import type { CampusDetail, CampusProvider } from "@/lib/v2/curator/campuses";
import type { CuratorIcon } from "@/lib/v2/curator/pages";
import type { CampusCardItem, Image, ResultItem } from "@/lib/v2/curator/types";

/** Thumbnails for small avatars and crests; the full image otherwise. */
export function imageUrl(image: Image | null | undefined, thumb = false) {
  if (!image) return undefined;
  return (thumb ? image.thumbnailUrl : image.url) || image.url;
}

export function campusCardToSchool(card: CampusCardItem): CuratorSchool {
  return {
    id: card.id,
    name: card.fullName,
    nickname: card.nicknames[0],
    nicknames: card.nicknames,
    motto: card.motto ?? undefined,
    type: card.type,
    card: card.card,
    logo: imageUrl(card.logo),
    // `lockedIn` is the number of students locked in at the campus.
    totalPatients: card.lockedIn,
    campuses: [],
  };
}

export function campusDetailToSchool(detail: CampusDetail): CuratorSchool {
  return {
    id: detail.id,
    name: detail.fullName,
    nickname: detail.nicknames[0],
    nicknames: detail.nicknames,
    motto: detail.motto ?? undefined,
    type: detail.type,
    typeLabel: detail.typeLabel,
    card: detail.card,
    logo: imageUrl(detail.logo),
    banner: imageUrl(detail.banner),
    locationId: detail.location?.id ?? null,
    locationName: detail.location?.name ?? null,
    sites: detail.sites,
    // v1's "campuses" list maps onto the campus's sites.
    campuses: detail.sites.map((site) => site.name),
    archived: detail.archived,
    version: detail.version,
    defaultGraduationMonth: detail.defaultGraduationMonth,
  };
}

/**
 * v2's CampusProvider has no email; the school screens key providers by
 * `email` (selection, provider panel), so it carries the provider id here.
 */
export function campusProviderToSchoolProvider(
  provider: CampusProvider,
): SchoolProvider {
  return {
    id: provider.providerId,
    email: provider.providerId,
    providerName: provider.fullName,
    providerTitle: provider.title ?? "",
    specialty: provider.roleCategory ?? "",
    officePhoneNumber: "",
    profilePhotoURL: imageUrl(provider.photo, true) ?? "",
    // Only approved providers can be attached to a campus.
    applicationStatus: "APPROVED",
    isAssociated: true,
  };
}

/**
 * The roll's triage chips: `urgent` (needs attention now, untreated) shows as
 * 911 and `attention` as NOW; everything else falls through to the Locked-In
 * score (Quick Screen) or ASAP (NSMQ, which has no Locked-In score).
 */
function rollTag(item: ResultItem): SchoolPatientRecord["nsmqTag"] {
  if (item.urgent) return "911";
  if (item.attention) return "NOW";
  return null;
}

function rollStatus(item: ResultItem): string {
  if (item.urgent) return "urgent";
  if (!item.seen) return "new";
  return item.active ? "seen" : "inactive";
}

export function resultItemToPatientRecord(
  item: ResultItem,
  school: { name?: string; nickname?: string } = {},
): SchoolPatientRecord {
  return {
    id: item.id,
    patientId: item.id,
    // v1 numeric ids; nothing on the curator screens reads them.
    lockinId: 0,
    schoolId: 0,
    schoolName: school.name ?? "",
    schoolNickname: school.nickname ?? "",
    patientName: item.displayName,
    patientAge: item.age ?? undefined,
    patientSex: item.gender ?? undefined,
    visibilityStatus: rollStatus(item),
    createdAt: item.createdAt,
    firstOpenedAt: item.lastProviderView?.at ?? null,
    lockinScore: item.lockedIn?.score ?? 10,
    comment: item.urgentReason,
    patientLevel: item.yearLabel ?? "",
    profilePhotoURL: null,
    nsmqTag: rollTag(item),
    nsmqReasonCode: item.urgentReason,
    nsmqResponseDueAt: item.respondBy,
  };
}

export function resultItemToUrgentPatient(
  item: ResultItem,
  school: { name?: string; nickname?: string } = {},
): UrgentPatient {
  return {
    id: item.id,
    patientResultId: item.id,
    patientName: item.displayName,
    schoolId: 0,
    schoolName: school.name ?? "",
    schoolNickname: school.nickname ?? "",
    time: item.createdAt,
    lockedInScore: item.lockedIn ? String(item.lockedIn.score) : "",
    score: item.lockedIn ? String(item.lockedIn.score) : "",
    urgentCareEnteredAt: item.createdAt,
  };
}

export function curatorIconToSchoolIcon(icon: CuratorIcon): SchoolIcon {
  const photo = imageUrl(icon.icon.photo) ?? "";
  return {
    id: icon.icon.id,
    photo,
    photoPreview: photo,
    name: icon.icon.name,
    slogan: icon.icon.slogan ?? "",
    rank: icon.icon.rank ?? 0,
    schoolId: icon.icon.campusId,
    lockIns: icon.icon.lockIns,
  };
}
