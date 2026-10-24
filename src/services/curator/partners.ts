import { networkCurator } from "@/lib/v2/curator/network";
import type { HostProviderView, HostView } from "@/lib/v2/curator/network";
import {
  Partner,
  PartnerDetailsData,
  AssociatedProvider,
} from "@/lib/types/entities/partners";
import { collectPages } from "./providers/list";

// "Partners" are v2 hosts (Curator Management, ch 11). The screens keep their
// Partner shape: name = fullName, nickname = first nickname, slogan = bio.

const PAGE_SIZE = 100;

export function fromHost(host: HostView): Partner {
  return {
    id: host.id,
    name: host.fullName,
    nickname: host.nicknames[0],
    slogan: host.bio ?? undefined,
    logo: host.photo?.thumbnailUrl ?? host.photo?.url ?? undefined,
  };
}

function fromHostProvider(provider: HostProviderView): AssociatedProvider {
  return {
    id: provider.providerId,
    email: "",
    providerName: provider.fullName,
    providerTitle: provider.title,
    specialty: provider.roleCategory ?? undefined,
    profilePhotoURL:
      provider.photo?.thumbnailUrl ?? provider.photo?.url ?? undefined,
  };
}

export const partnersService = {
  getPartners: async (): Promise<Partner[]> => {
    const hosts = await collectPages((page) =>
      networkCurator.hosts({ page, size: PAGE_SIZE }),
    );
    return hosts.map(fromHost);
  },

  getPartner: async (partnerId: string): Promise<Partner> =>
    fromHost(await networkCurator.host(partnerId)),

  getPartnerWithDetails: async (
    partnerId: string,
  ): Promise<PartnerDetailsData> => {
    const [host, providers] = await Promise.all([
      networkCurator.host(partnerId),
      networkCurator.hostProviders(partnerId),
    ]);
    return {
      partner: fromHost(host),
      // TODO(v2-backend): GET /hosts/{id}/campuses returns CampusHostView rows
      // without a campusId, so the host's campuses can't be listed or linked.
      associatedSchools: [],
      associatedProviders: providers.map(fromHostProvider),
    };
  },

  /** Campus → Hosts: the host joins the campus with all its venues, partners and providers. */
  addSchoolToPartner: (partnerId: string, schoolId: string) =>
    networkCurator.addCampusHosts(schoolId, [{ hostId: partnerId }]),

  removeSchoolFromPartner: (partnerId: string, schoolId: string) =>
    networkCurator.removeCampusHost(schoolId, partnerId),

  /** Attaches an approved provider to the host, with their first role group. */
  addProviderToPartner: (partnerId: string, providerId: string) =>
    networkCurator.addHostProviders(partnerId, [
      { providerId, mainHost: true },
    ]),

  removeProviderFromPartner: (partnerId: string, providerId: string) =>
    networkCurator.removeHostProvider(partnerId, providerId),
};
