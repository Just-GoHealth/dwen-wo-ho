import {
  catalogueCurator,
  type CatalogueTag,
} from "@/lib/v2/curator/catalogue";
import type { CreateTagInput } from "@/lib/types/api/creative-studios";

export const tagsService = {
  // TODO(v2-backend): v1 sent an optional tag image; v2 tags have no image.
  createTag: (input: CreateTagInput): Promise<CatalogueTag> =>
    catalogueCurator.createTag(input.mainTitle, input.tags),
};
