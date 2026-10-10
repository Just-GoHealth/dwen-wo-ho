import {
  NewNotificationEvent,
  NewUrgentCaseEvent,
  PatientStatusChangedEvent,
  NewPatientResultEvent,
  ProviderTopicNotificationEvent,
} from "@/lib/types/entities/websocket";
import { ProviderNotification } from "@/lib/types/entities/notification";
import { refetchAllActiveQueries } from "@/lib/query/client-store";

export function routeSubscriptionMessage(
  topic: string,
  payload: unknown,
): void {
  console.log(
    `[SubscriptionManager] 📨 Handling message for topic: ${topic}`,
    payload,
  );

  if (topic === "/user/queue/notifications") {
    console.log(`[SubscriptionManager] → Routing to personal notifications`);
    dispatchPersonalNotification(payload as NewNotificationEvent<unknown>);
  } else if (
    topic.includes("/topic/provider/") &&
    topic.includes("/notifications")
  ) {
    console.log(
      `[SubscriptionManager] → Routing to provider topic notifications`,
    );
    dispatchProviderTopicNotification(
      payload as ProviderTopicNotificationEvent,
    );
  } else if (topic.includes("/urgent")) {
    console.log(`[SubscriptionManager] → Routing to urgent cases`);
    dispatchUrgentCase(payload as NewUrgentCaseEvent);
  } else if (topic.includes("/patients") && !topic.includes("/urgent")) {
    console.log(`[SubscriptionManager] → Routing to patient status`);
    dispatchPatientStatusChange(payload as PatientStatusChangedEvent);
  } else if (topic.includes("patient-results")) {
    console.log(`[SubscriptionManager] → Routing to patient results`);
    dispatchPatientResult(payload as NewPatientResultEvent);
  } else {
    console.warn(`[SubscriptionManager] ⚠️ Unhandled topic: ${topic}`);
  }

  refetchAllActiveQueries();
}

function dispatchPersonalNotification(
  payload: NewNotificationEvent<unknown>,
): void {
  console.log(`[SubscriptionManager] 🔔 Dispatching ws:notification`, payload);
  window.dispatchEvent(new CustomEvent("ws:notification", { detail: payload }));
}

function dispatchProviderTopicNotification(payload: unknown): void {
  console.log(
    `[SubscriptionManager] 🔔 Dispatching provider notification`,
    payload,
  );

  const rawPayload = payload as Record<string, unknown>;

  if (rawPayload.type === "UNREAD_COUNT_CHANGED") {
    window.dispatchEvent(
      new CustomEvent("ws:unread-count", {
        detail: { unreadCount: rawPayload.unreadCount as number },
      }),
    );
    return;
  }

  const notificationObj = rawPayload.notification as
    Record<string, unknown> | undefined;
  if (rawPayload.type === "NEW_NOTIFICATION" && notificationObj) {
    const notification: ProviderNotification = {
      notificationId: (notificationObj.id as string) || "",
      targetId:
        parseInt((notificationObj.relatedEntityId as string) || "0", 10) || 0,
      targetType: (notificationObj.relatedEntityType as string) || "",
      unread: !(notificationObj.read as boolean),
      targetName: (notificationObj.title as string) || "",
      targetSchoolId: (notificationObj.schoolId as number) || 0,
      targetSchoolName: (notificationObj.schoolName as string | null) || null,
      text: (notificationObj.message as string) || "",
      category:
        notificationObj.type as string as ProviderNotification["category"],
      action:
        (notificationObj.action as ProviderNotification["action"]) || "VIEW",
      notification: (notificationObj.notification as string) || "",
      emoji: (notificationObj.emoji as string) || "",
      timestamp: notificationObj.createdAt as string,
      avatarUrl: (notificationObj.avatarUrl as string | null) || null,
    };

    window.dispatchEvent(
      new CustomEvent("ws:notification", {
        detail: {
          event: "NEW_NOTIFICATION",
          timestamp: notificationObj.createdAt as string,
          recipientId: "",
          recipientRole: "ROLE_PROVIDER",
          unreadCount: rawPayload.unreadCount as number,
          notification,
        },
      }),
    );
  }
}

function dispatchUrgentCase(payload: NewUrgentCaseEvent): void {
  console.log(`[SubscriptionManager] 🚨 Dispatching ws:urgent-case`, payload);
  window.dispatchEvent(new CustomEvent("ws:urgent-case", { detail: payload }));
}

function dispatchPatientStatusChange(payload: PatientStatusChangedEvent): void {
  console.log(
    `[SubscriptionManager] 🏥 Dispatching ws:patient-status`,
    payload,
  );
  window.dispatchEvent(
    new CustomEvent("ws:patient-status", { detail: payload }),
  );
}

function dispatchPatientResult(payload: NewPatientResultEvent): void {
  console.log(
    `[SubscriptionManager] 📋 Dispatching ws:patient-result`,
    payload,
  );
  window.dispatchEvent(
    new CustomEvent("ws:patient-result", { detail: payload }),
  );
}
