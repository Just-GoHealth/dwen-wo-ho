import { campusesCurator } from "@/lib/v2/curator/campuses";
import { networkCurator } from "@/lib/v2/curator/network";

export const schoolsService = {
  /** Campus → Providers: attaches an approved provider as their own main host (each is emailed). */
  addSchoolToProvider: (providerId: string, schoolId: string) =>
    networkCurator.addCampusProviders(schoolId, [
      { providerId, mainHost: true },
    ]),

  removeSchoolFromProvider: (providerId: string, schoolId: string) =>
    campusesCurator.removeProvider(schoolId, providerId),
};
