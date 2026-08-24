import {
  PROVIDER_NOTIFICATION_ACTIONS,
  CURATOR_NOTIFICATION_ACTIONS,
} from "@/lib/constants/infra/app";
import { DYNAMIC_ROUTES, ROUTES } from "@/lib/constants/infra/routes";
import {
  CuratorNotification,
  ProviderNotification,
} from "@/lib/types/entities/notification";
import {
  inferCuratorNotificationAction,
  inferProviderNotificationAction,
} from "./infer-notification-action";

const providerNotificationRouteConfig = {
  [PROVIDER_NOTIFICATION_ACTIONS.OPEN_PATIENT]:
    DYNAMIC_ROUTES.provider.patientDetails,

  [PROVIDER_NOTIFICATION_ACTIONS.OPEN_SCHOOL_PATIENTS]:
    DYNAMIC_ROUTES.provider.patientDetails,

  [PROVIDER_NOTIFICATION_ACTIONS.OPEN_URGENT_CARE]:
    DYNAMIC_ROUTES.provider.patientDetails,

  [PROVIDER_NOTIFICATION_ACTIONS.OPEN_PROVIDER_SCHOOL]:
    DYNAMIC_ROUTES.provider.schoolDetails,
};

export function getProviderNotificationRoute(
  notification: ProviderNotification,
) {
  const computedAction = inferProviderNotificationAction(notification);
  if (!computedAction) return null;

  const validActionKey =
    computedAction as keyof typeof providerNotificationRouteConfig;
  const generator = providerNotificationRouteConfig[validActionKey];
  return generator(
    computedAction === PROVIDER_NOTIFICATION_ACTIONS.OPEN_PROVIDER_SCHOOL ||
      computedAction === PROVIDER_NOTIFICATION_ACTIONS.OPEN_SCHOOL_PATIENTS
      ? notification.targetSchoolId
      : notification.targetId,
  );
}

const curatorNotificationRouteConfig = {
  [CURATOR_NOTIFICATION_ACTIONS.OPEN_SCHOOL]: (id: string | number) =>
    DYNAMIC_ROUTES.curator.schoolDetails(id),
  [CURATOR_NOTIFICATION_ACTIONS.OPEN_PROVIDER]: (id: string | number) =>
    `${ROUTES.curator.providers}?providerModal=${id}`,
  [CURATOR_NOTIFICATION_ACTIONS.OPEN_PATIENT]: (
    schoolId: string | number,
    patientId: string | number,
  ) => DYNAMIC_ROUTES.curator.patientDetails(schoolId, patientId),
  [CURATOR_NOTIFICATION_ACTIONS.OPEN_PARTNER]: () => ROUTES.curator.partners,
};

export function getCuratorNotificationRoute(notification: CuratorNotification) {
  const computedAction = inferCuratorNotificationAction(notification);
  if (!computedAction) return null;

  const validAction =
    computedAction as keyof typeof curatorNotificationRouteConfig;
  const generator = curatorNotificationRouteConfig[validAction];
  if (computedAction === CURATOR_NOTIFICATION_ACTIONS.OPEN_PATIENT) {
    // relatedEntityId is only a result id (safe to open a result-detail
    // page with) when relatedEntityType is PATIENT_RESULT. A "PATIENT"
    // entity's id is the patient's own UUID, not a result id - a
    // NEW_PATIENT_ADDED notification fires before any result exists, so
    // its relatedEntityId is always this UUID (even later, once the
    // patient does have a result, since the notification's payload was
    // captured at creation time). Sending that UUID to the result-detail
    // route 400s on the backend ("resultId must be a valid Long"), so
    // route those to the school's roster instead, where the patient is
    // still visible without needing a result id at all.
    if (notification.relatedEntityType !== "PATIENT_RESULT") {
      return DYNAMIC_ROUTES.curator.schoolDetails(notification.schoolId);
    }
    return generator(notification.schoolId, notification.relatedEntityId);
  }
  if (computedAction === CURATOR_NOTIFICATION_ACTIONS.OPEN_PARTNER) {
    return (generator as () => string)();
  }
  const providerIdentifier =
    computedAction === CURATOR_NOTIFICATION_ACTIONS.OPEN_PROVIDER
      ? notification.targetEmail || notification.relatedEntityId
      : notification.relatedEntityId;
  return (generator as (id: string | number) => string)(providerIdentifier);
}
