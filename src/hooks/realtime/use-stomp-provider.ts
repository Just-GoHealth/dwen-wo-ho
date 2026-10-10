"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { useStompWebSocket } from "@/hooks/realtime/use-stomp-websocket";
import { useNotificationWebSocket } from "@/hooks/realtime/use-notification-websocket";
import { useUrgentCasesWebSocket } from "@/hooks/realtime/use-urgent-cases-websocket";
import { usePatientStatusWebSocket } from "@/hooks/realtime/use-patient-status-websocket";
import { usePatientResultWebSocket } from "@/hooks/realtime/use-patient-result-websocket";
import { subscriptionManager } from "@/services/shared/websocket/subscription-manager";
import { getUserType, hasValidToken } from "@/lib/utils/auth/get-user-type";

function isAuthenticated(): boolean {
  const userType = getUserType();
  return !!(userType && hasValidToken());
}

function syncAuthConnection(
  valid: boolean,
  isAuth: boolean,
  connect: () => void,
  disconnect: () => void,
): boolean {
  if (valid && !isAuth) {
    connect();
    return true;
  }
  if (!valid && isAuth) {
    disconnect();
    return false;
  }
  return isAuth;
}

function onStompConnected(wasConnected: boolean): void {
  const providerId = localStorage.getItem("providerId");

  if (wasConnected) {
    subscriptionManager.resubscribeAll();
    return;
  }

  subscriptionManager.initialize();
  if (providerId) {
    subscriptionManager.setProviderId(providerId);
  }
}

export function useStompProvider() {
  const { connect, disconnect, connectionStatus } = useStompWebSocket();
  // Tracked in a ref: only read inside the auth effect to detect transitions,
  // never rendered, so it shouldn't cause extra renders or chained updates.
  const isAuthRef = useRef(false);
  const pathname = usePathname();

  useNotificationWebSocket();
  useUrgentCasesWebSocket();
  usePatientStatusWebSocket();
  usePatientResultWebSocket();

  useEffect(() => {
    isAuthRef.current = syncAuthConnection(
      isAuthenticated(),
      isAuthRef.current,
      connect,
      disconnect,
    );
  }, [connect, disconnect, pathname]);

  const wasConnectedRef = useRef(false);

  useEffect(() => {
    if (connectionStatus === "CONNECTED") {
      onStompConnected(wasConnectedRef.current);
      wasConnectedRef.current = true;
      return;
    }

    if (connectionStatus === "DISCONNECTED") {
      wasConnectedRef.current = false;
    }
  }, [connectionStatus]);

  useEffect(() => {
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key !== "userType") return;
      disconnect();
      if (isAuthenticated()) {
        setTimeout(connect, 500);
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [connect, disconnect]);
}
