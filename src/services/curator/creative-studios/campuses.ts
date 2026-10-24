import { campusesCurator, type CampusDetail } from "@/lib/v2/curator/campuses";
import { catalogueCurator } from "@/lib/v2/curator/catalogue";
import type { CreateCampusInput } from "@/lib/types/api/creative-studios";

const sameName = (a: string, b: string) =>
  a.trim().toLowerCase() === b.trim().toLowerCase();

/** The campus-type code for the label picked in the form. */
async function resolveCampusType(label: string): Promise<string> {
  const types = await catalogueCurator.campusTypes();
  const match = types.find(
    (t) => sameName(t.label, label) || sameName(t.code, label),
  );
  // Unknown labels go through as-is; the server answers VALIDATION on `type`.
  return match?.code ?? label;
}

/** The id of the picked location, adding it to the shared list when it's new. */
async function resolveLocationId(name: string): Promise<string> {
  const locations = await catalogueCurator.locations();
  const match = locations.find((l) => sameName(l.name, name));
  if (match) return match.id;
  return (await catalogueCurator.createLocation(name.trim())).id;
}

export const campusesService = {
  /** POST /campuses, then the logo and banner uploads (multipart `file`). */
  createCampus: async (input: CreateCampusInput): Promise<CampusDetail> => {
    const [type, locationId] = await Promise.all([
      resolveCampusType(input.type),
      resolveLocationId(input.location),
    ]);
    let campus = await campusesCurator.create({
      fullName: input.fullName,
      nicknames: input.nicknames,
      motto: input.motto?.trim() ? input.motto : null,
      type,
      locationId,
    });
    if (input.logo)
      campus = await campusesCurator.uploadLogo(campus.id, input.logo);
    if (input.bannerPhoto) {
      campus = await campusesCurator.uploadBanner(campus.id, input.bannerPhoto);
    }
    return campus;
  },
};
