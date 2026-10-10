"use client";

import { useCallback, useEffect, useState, useRef } from "react";
import { useAtom } from "jotai";
import { stompClient } from "@/services/shared/websocket/stomp-client";
import { subscriptionManager } from "@/services/shared/websocket/subscription-manager";
import { connectionStatusAtom } from "@/atoms/websocket";
import { getUserType, hasValidToken } from "@/lib/utils/auth/get-user-type";
import { getAccessToken } from "@/lib/auth/access-token";
import { refreshToken } from "@/lib/auth/session";

const TOKEN_EXPIRY_SKEW_SECONDS = 30;

const isExpiringSoon = (jwt: string): boolean => {
  try {
    const base64 = (jwt.split(".")[1] ?? "")
      .replace(/-/g, "+")
      .replace(/_/g, "/");
    const { exp } = JSON.parse(atob(base64)) as { exp?: number };
    return (
      typeof exp === "number" &&
      exp - TOKEN_EXPIRY_SKEW_SECONDS <= Math.floor(Date.now() / 1000)
    );
  } catch {
    return false;
  }
};

// Called by the STOMP client on every (re)connect: the in-memory token while
// it's still valid, otherwise re-issue it from the HttpOnly refresh cookie.
const getFreshAccessToken = async (): Promise<string | null> => {
  const token = getAccessToken();
  if (token && !isExpiringSoon(token)) {
    return token;
  }
  return refreshToken();
};

export function useStompWebSocket() {
  const [connectionStatus, setConnectionStatus] = useAtom(connectionStatusAtom);
  const [userType, setUserType] =
    useState<ReturnType<typeof getUserType>>(null);
  const reconnectAttemptRef = useRef(0);

  // Initialize connection
  const connect = useCallback(() => {
    const type = getUserType();
    setUserType(type);

    if (!type || !hasValidToken()) {
      return;
    }

    void stompClient.connect(getFreshAccessToken);
  }, []);

  // Disconnect
  const disconnect = useCallback(() => {
    stompClient.disconnect();
    subscriptionManager.cleanup();
  }, []);

  // Subscribe to a topic
  const subscribe = useCallback(
    <T>(topic: string, handler: (payload: T) => void): (() => void) => {
      const subscriptionId = stompClient.subscribe(topic, handler);

      return () => {
        stompClient.unsubscribe(subscriptionId);
      };
    },
    [],
  );

  // Reconnect manually
  const reconnect = useCallback(() => {
    disconnect();
    reconnectAttemptRef.current = 0;
    setTimeout(connect, 500);
  }, [connect, disconnect]);

  // Setup status listener
  useEffect(() => {
    const unsubscribe = stompClient.onStatusChange((status) => {
      setConnectionStatus(status);
    });

    return unsubscribe;
  }, [setConnectionStatus]);

  // Setup reconnect listener to re-fetch state
  useEffect(() => {
    const unsubscribe = stompClient.onReconnect(() => {
      console.log("[WebSocket] Reconnected - re-fetching critical state");
      // Dispatch event for hooks to re-fetch data
      window.dispatchEvent(new CustomEvent("ws:reconnect"));
    });

    return unsubscribe;
  }, []);

  // Handle visibility change (pause/resume)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        // Optional: disconnect when tab hidden to save battery
        // disconnect();
      } else {
        // Reconnect when tab becomes visible
        if (
          connectionStatus === "DISCONNECTED" ||
          connectionStatus === "ERROR"
        ) {
          connect();
        }
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [connect, connectionStatus]);

  return {
    connectionStatus,
    userType,
    connect,
    disconnect,
    subscribe,
    reconnect,
    isConnected: connectionStatus === "CONNECTED",
    isConnecting: connectionStatus === "CONNECTING",
  };
}
