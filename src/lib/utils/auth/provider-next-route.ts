import { ROUTES } from "@/lib/constants/infra/routes";
import type { Me, ProviderNext } from "@/lib/v2/types";

/**
 * The one place a provider's `next` becomes a screen. Applied after sign-in,
 * verify, password set, every profile save and every `provider-status` event.
 */
export const PROVIDER_NEXT_ROUTES = {
  PROFILE_SETUP: `${ROUTES.provider.signUp}?step=profile`,
  PENDING: ROUTES.provider.application,
  REJECTED: ROUTES.provider.application,
  HOME: ROUTES.provider.home,
} as const satisfies Record<ProviderNext, string>;

export function routeForProviderNext(next: ProviderNext | null | undefined) {
  return next ? PROVIDER_NEXT_ROUTES[next] : ROUTES.provider.auth;
}

/** Where a freshly signed-in account belongs, whatever its role. */
export function routeForMe(me: Me): string {
  if (me.role === "CURATOR") return ROUTES.curator.dashboard;
  if (me.role === "PROVIDER") return routeForProviderNext(me.next);
  // Patients have their own app; this one has nothing for them.
  return ROUTES.provider.auth;
}

/** True when `next` lets the provider use the signed-in workspace. */
export const isProviderApproved = (next: ProviderNext | null | undefined) =>
  next === "HOME";
