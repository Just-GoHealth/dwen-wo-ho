export type ConnectionStatus =
  "CONNECTING" | "CONNECTED" | "DISCONNECTED" | "ERROR";

// WebSocket event payloads from backend
export interface NewNotificationEvent<T> {
  event: "NEW_NOTIFICATION";
  timestamp: string;
  recipientId: string;
  recipientRole: string;
  unreadCount: number;
  notification: T;
}

// Urgent case event (from /topic/provider/{id}/urgent)
export interface UrgentCasePatient {
  patientId: number;
  patientName: string;
  score: number;
  status: "urgent" | "critical";
  schoolId: number;
  schoolName: string;
  time: string;
  preview?: string;
  avatarUrl?: string | null;
}

export interface NewUrgentCaseEvent {
  type: "NEW_URGENT_CASE";
  patient: UrgentCasePatient;
}

// Patient status change event (from /topic/provider/{id}/patients)
export interface PatientStatusChangedEvent {
  type: "PATIENT_STATUS_CHANGED";
  patient: UrgentCasePatient & { status: string };
}

// Curator patient result event (from /topic/curator/patient-results)
export interface NewPatientResultEvent {
  type: "NEW_PATIENT_RESULT";
  schoolId: number;
  patientName: string;
  patientResultId: number;
  lockinId: number;
  createdAt: string;
}

// Provider notification topic payload (/topic/provider/{id}/notifications)
// Has different structure than personal queue
export interface ProviderTopicNotificationEvent {
  type: "NEW_NOTIFICATION" | "UNREAD_COUNT_CHANGED";
  notification?: {
    id: string;
    type: string;
    title: string;
    message: string;
    relatedEntityId: string;
    relatedEntityType: string;
    schoolId: number;
    schoolName?: string | null;
    read: boolean;
    createdAt: string;
    action?: string | null;
    notification?: string | null;
    emoji?: string | null;
    avatarUrl?: string | null;
  };
  unreadCount: number;
}

// Subscription map for tracking active subscriptions
export interface ActiveSubscription {
  id: string;
  topic: string;
  unsubscribe: () => void;
}
