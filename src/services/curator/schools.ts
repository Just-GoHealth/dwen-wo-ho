import { campusesCurator } from "@/lib/v2/curator/campuses";
import type { CampusCreateRequest, CampusHub } from "@/lib/v2/curator/campuses";
import { networkCurator } from "@/lib/v2/curator/network";
import type { ReachView } from "@/lib/v2/curator/network";
import { resultsCurator } from "@/lib/v2/curator/results";
import type { CampusCardItem, ResultItem } from "@/lib/v2/curator/types";
import type { CuratorSchool } from "@/lib/types/components/curator/schools/campus";
import type { SchoolPatientRecord } from "@/lib/types/components/curator/school-details/school-details";
import { SchoolProvider } from "@/lib/types/entities/provider";
import type { UrgentPatient } from "@/lib/types/entities/patient";
import {
  campusCardToSchool,
  campusDetailToSchool,
  campusProviderToSchoolProvider,
  resultItemToPatientRecord,
  resultItemToUrgentPatient,
} from "@/lib/utils/curator/schools/v2-adapters";

// The v2 list pages at 100 at most; the curator's lists want every campus.
const PAGE_SIZE = 100;

/** Studios "create campus": the record first, then its images. */
export interface CreateSchoolInput extends CampusCreateRequest {
  logo?: File | null;
  banner?: File | null;
}

/** Only the fields being changed, plus the `version` the form was loaded at. */
export interface UpdateSchoolInput {
  id: string;
  version: number;
  fullName?: string;
  nicknames?: string[];
  motto?: string;
  type?: string;
  locationId?: string;
  /** The whole ordered list of site names; sent with PUT /campuses/{id}/sites. */
  sites?: string[];
}

export interface SchoolPatientsOverview {
  patients: SchoolPatientRecord[];
  /** Results still awaiting the curator's acceptance (C19). */
  awaitingCount: number;
  urgentCare: {
    totalUrgentCarePatients: number;
    patients: UrgentPatient[];
  };
}

async function listAllCampuses(archived: boolean): Promise<CampusCardItem[]> {
  const items: CampusCardItem[] = [];
  for (let page = 0; ; page++) {
    const res = await campusesCurator.list({ archived, page, size: PAGE_SIZE });
    items.push(...res.items);
    if (res.items.length < PAGE_SIZE || items.length >= res.total) break;
  }
  return items;
}

async function listAllResults(campusId: string): Promise<ResultItem[]> {
  const items: ResultItem[] = [];
  for (let page = 0; ; page++) {
    const res = await resultsCurator.list(campusId, { page, size: PAGE_SIZE });
    items.push(...res.items);
    if (res.items.length < PAGE_SIZE || items.length >= res.total) break;
  }
  return items;
}

export const schoolsService = {
  /** Every active campus (or every archived one), alphabetical. */
  getSchools: async (
    options: { archived?: boolean } = {},
  ): Promise<CuratorSchool[]> => {
    const cards = await listAllCampuses(options.archived ?? false);
    return cards.map(campusCardToSchool);
  },

  getSchool: async (schoolId: string): Promise<CuratorSchool> =>
    campusDetailToSchool(await campusesCurator.detail(schoolId)),

  /** Identity plus a count per card (programmes, providers, hosts, patients, justIn, awaitingResults). */
  getSchoolHub: (schoolId: string): Promise<CampusHub> =>
    campusesCurator.hub(schoolId),

  /** v1 "disable" is v2 archive: hidden from pickers and lists; results and access stay. */
  archiveSchool: async (schoolId: string): Promise<CuratorSchool> =>
    campusDetailToSchool(await campusesCurator.archive(schoolId)),

  restoreSchool: async (schoolId: string): Promise<CuratorSchool> =>
    campusDetailToSchool(await campusesCurator.restore(schoolId)),

  createSchool: async ({
    logo,
    banner,
    ...body
  }: CreateSchoolInput): Promise<CuratorSchool> => {
    let detail = await campusesCurator.create(body);
    if (logo) detail = await campusesCurator.uploadLogo(detail.id, logo);
    if (banner) detail = await campusesCurator.uploadBanner(detail.id, banner);
    return campusDetailToSchool(detail);
  },

  /** 409 STALE when `version` is behind; 409 NAME_TAKEN on fullName/nicknames. */
  updateSchool: async ({
    id,
    sites,
    ...patch
  }: UpdateSchoolInput): Promise<CuratorSchool> => {
    let detail = await campusesCurator.update(id, patch);
    if (sites) detail = await campusesCurator.setSites(id, sites);
    return campusDetailToSchool(detail);
  },

  getSchoolProviders: async (schoolId: string): Promise<SchoolProvider[]> => {
    const providers = await campusesCurator.providers(schoolId);
    return providers.map(campusProviderToSchoolProvider);
  },

  /** Each provider is emailed; 422 PROVIDER_NOT_APPROVED for one not approved. */
  addProvidersToSchool: (schoolId: string, providerIds: string[]) =>
    networkCurator.addCampusProviders(
      schoolId,
      providerIds.map((providerId) => ({ providerId })),
    ),

  removeProviderFromSchool: (schoolId: string, providerId: string) =>
    campusesCurator.removeProvider(schoolId, providerId),

  /** The roll (every result at the campus, newest first) and the urgent-care list. */
  getPatientsOverview: async (
    schoolId: string,
    school: { name?: string; nickname?: string } = {},
  ): Promise<SchoolPatientsOverview> => {
    const [results, urgent] = await Promise.all([
      listAllResults(schoolId),
      resultsCurator.urgent(schoolId),
    ]);
    return {
      patients: results.map((r) => resultItemToPatientRecord(r, school)),
      awaitingCount: results.filter((r) => r.awaitingAcceptance).length,
      urgentCare: {
        totalUrgentCarePatients: urgent.length,
        patients: urgent.map((r) => resultItemToUrgentPatient(r, school)),
      },
    };
  },

  /** Accept every result awaiting acceptance so the campus's providers see it. */
  acceptAllResults: (schoolId: string) => resultsCurator.acceptAll(schoolId),

  getSchoolReach: (schoolId: string): Promise<ReachView> =>
    networkCurator.reach({ campusId: schoolId }),

  setSchoolReachBaseline: (schoolId: string, value: number) =>
    networkCurator.setReachBaseline(value, schoolId),
};
