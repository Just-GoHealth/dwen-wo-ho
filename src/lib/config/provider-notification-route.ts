import { DYNAMIC_ROUTES, ROUTES } from "@/lib/constants/infra/routes";
import type { Notification } from "@/lib/v2/types";

const RESULT_LINK = /^\/results\/([^/?#]+)/;

/**
 * App route for a v2 notification. `link` is an API-shaped path such as
 * `/results/{id}` — which this app proxies to the backend — so it is never
 * navigated to directly; it is mapped onto the provider's own screens.
 */
export function getProviderNotificationRoute(n: Notification): string | null {
  const resultId =
    (typeof n.data?.resultId === "string" && n.data.resultId) ||
    n.link?.match(RESULT_LINK)?.[1];
  if (resultId) return DYNAMIC_ROUTES.provider.patientDetails(resultId);

  const campusId = n.data?.campusId;
  switch (n.type) {
    case "APPLICATION_ACCEPTED":
      return ROUTES.provider.home;
    case "APPLICATION_REJECTED":
      return ROUTES.provider.application;
    case "JOIN_APPROVED":
    case "JOIN_DECLINED":
      return n.data?.targetType === "CAMPUS" &&
        typeof n.data.targetId === "string"
        ? DYNAMIC_ROUTES.provider.schoolDetails(n.data.targetId)
        : ROUTES.provider.schools;
    case "PROVIDER_ADDED":
    case "NEW_RESULTS":
    case "HOST_ADDED":
    case "HOST_REMOVED":
      return typeof campusId === "string"
        ? DYNAMIC_ROUTES.provider.schoolDetails(campusId)
        : ROUTES.provider.schools;
    case "PROVIDER_REMOVED":
      return ROUTES.provider.schools;
    default:
      return null;
  }
}

/** Emoji for the sheet's avatar slot, by type. */
export function getProviderNotificationEmoji(n: Notification): string {
  switch (n.type) {
    case "URGENT_RESULT":
    case "RESULT_OVERDUE":
      return "🚨";
    case "NEW_RESULTS":
      return "📝";
    case "PATIENT_SEEN":
      return "👀";
    case "APPLICATION_ACCEPTED":
    case "JOIN_APPROVED":
      return "✅";
    case "APPLICATION_REJECTED":
    case "JOIN_DECLINED":
      return "✖️";
    default:
      return "🏫";
  }
}
