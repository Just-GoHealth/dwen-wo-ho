import {
  joinRequestsCurator,
  providersCurator,
} from "@/lib/v2/curator/providers";
import type {
  JoinRequestView,
  Page,
  ProviderProfile,
  ProviderSummary,
} from "@/lib/v2/curator/types";
import type { ProviderListParams } from "@/lib/v2/curator/providers";

const PAGE_SIZE = 100;

/** Reads every page of a paged v2 list (the screens filter and count client-side). */
export async function collectPages<T>(
  load: (page: number) => Promise<Page<T>>,
): Promise<T[]> {
  const items: T[] = [];
  for (let page = 0; ; page++) {
    const result = await load(page);
    items.push(...result.items);
    if (items.length >= result.total || result.items.length === 0) break;
  }
  return items;
}

/** The provider's PENDING application in the Just In queue, if any. */
async function findPendingApplication(
  providerId: string,
): Promise<JoinRequestView> {
  const pending = await collectPages((page) =>
    joinRequestsCurator.list({
      kind: "PROVIDER_APPLICATION",
      status: "PENDING",
      page,
      size: PAGE_SIZE,
    }),
  );
  const request = pending.find((r) => r.applicant?.id === providerId);
  if (!request) {
    throw new Error("This provider has no application waiting for a decision.");
  }
  return request;
}

export const listService = {
  getProviders: (
    params: Omit<ProviderListParams, "page" | "size"> = {},
  ): Promise<ProviderSummary[]> =>
    collectPages((page) =>
      providersCurator.list({ ...params, page, size: PAGE_SIZE }),
    ),

  getProvider: (providerId: string): Promise<ProviderProfile> =>
    providersCurator.detail(providerId),

  /** Approves the provider's pending application (Just In). */
  approveProvider: async (providerId: string): Promise<JoinRequestView> => {
    const request = await findPendingApplication(providerId);
    return joinRequestsCurator.approve(request.id);
  },

  /** Declines the provider's pending application; they may resubmit. */
  rejectProvider: async (providerId: string): Promise<JoinRequestView> => {
    const request = await findPendingApplication(providerId);
    return joinRequestsCurator.decline(request.id);
  },
};
