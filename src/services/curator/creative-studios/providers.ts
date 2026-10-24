import { providersCurator } from "@/lib/v2/curator/providers";
import type { ProviderProfile } from "@/lib/v2/curator/types";
import type { CreateStudioProviderInput } from "@/lib/types/api/creative-studios";

export const studioProvidersService = {
  /** POST /providers (approved, no account until invited), then the photo upload. */
  createProvider: async (
    input: CreateStudioProviderInput,
  ): Promise<ProviderProfile> => {
    let provider = await providersCurator.create({
      fullName: input.fullName,
      nicknames: input.nicknames,
      bio: input.bio?.trim() ? input.bio : null,
      clinical: input.clinical,
    });
    if (input.photo) {
      provider = await providersCurator.uploadPhoto(provider.id, input.photo);
    }
    return provider;
  },
};
