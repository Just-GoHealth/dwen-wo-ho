import { catalogueCurator } from "@/lib/v2/curator/catalogue";
import type { CatalogueProgramme } from "@/lib/v2/curator/campuses";
import type { CreateProgrammeInput } from "@/lib/types/api/creative-studios";

export const programmesService = {
  /**
   * POST /programmes, then the cover upload. v2 keeps one `defaultYears` per programme;
   * the year range (yearsFrom/yearsTo) is set per campus when a campus offers it.
   */
  createProgramme: async (
    input: CreateProgrammeInput,
  ): Promise<CatalogueProgramme> => {
    const defaultYears = Math.max(
      1,
      input.durationToYear - input.durationFromYear + 1,
    );
    let programme = await catalogueCurator.createProgramme({
      fullName: input.fullName,
      nicknames: input.nicknames,
      bio: input.bio?.trim() ? input.bio : null,
      defaultYears,
    });
    if (input.coverPhoto) {
      programme = await catalogueCurator.uploadProgrammeCover(
        programme.id,
        input.coverPhoto,
      );
    }
    return programme;
  },
};
