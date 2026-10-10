import { describe, expect, it, beforeEach, afterEach, vi } from "vitest";

type ClientConfig = {
  webSocketFactory: () => unknown;
  onConnect: () => void;
  onDisconnect: () => void;
  onWebSocketClose: (event: { code: number; reason: string }) => void;
  onWebSocketError: (event: unknown) => void;
};

const clients: { config: ClientConfig; active: boolean }[] = [];
const sockJsUrls: string[] = [];

vi.mock("@stomp/stompjs", () => ({
  Client: class {
    active = false;
    config: ClientConfig;
    constructor(config: ClientConfig) {
      this.config = config;
      clients.push(this);
    }
    activate() {}
    deactivate() {
      this.active = false;
    }
    subscribe() {
      return { unsubscribe() {} };
    }
  },
}));

vi.mock("sockjs-client", () => ({
  default: class {
    constructor(url: string) {
      sockJsUrls.push(url);
    }
  },
}));

type StompModule = typeof import("@/services/shared/websocket/stomp-client");

describe("stompClient token handling (LOG-05)", () => {
  let stomp: StompModule["stompClient"];

  beforeEach(async () => {
    vi.resetModules();
    vi.useFakeTimers();
    vi.spyOn(console, "log").mockImplementation(() => {});
    vi.spyOn(console, "warn").mockImplementation(() => {});
    vi.spyOn(console, "error").mockImplementation(() => {});
    clients.length = 0;
    sockJsUrls.length = 0;
    ({ stompClient: stomp } =
      await import("@/services/shared/websocket/stomp-client"));
  });

  afterEach(() => {
    stomp.disconnect();
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it("connects with the token from the provider", async () => {
    const getToken = vi.fn().mockResolvedValue("token-1");

    await stomp.connect(getToken);
    clients[0].config.webSocketFactory();

    expect(getToken).toHaveBeenCalledTimes(1);
    expect(sockJsUrls[0]).toContain("token=token-1");
  });

  it("reads a fresh token on every reconnect instead of reusing the first", async () => {
    const getToken = vi
      .fn()
      .mockResolvedValueOnce("token-1")
      .mockResolvedValueOnce("token-2");

    await stomp.connect(getToken);
    clients[0].config.onWebSocketClose({ code: 1006, reason: "" });
    await vi.runOnlyPendingTimersAsync();

    expect(getToken).toHaveBeenCalledTimes(2);
    expect(clients).toHaveLength(2);
    clients[1].config.webSocketFactory();
    expect(sockJsUrls.at(-1)).toContain("token=token-2");
    expect(sockJsUrls.at(-1)).not.toContain("token-1");
  });

  it("does not connect when no token is available", async () => {
    await stomp.connect(vi.fn().mockResolvedValue(null));

    expect(clients).toHaveLength(0);
    expect(stomp.getStatus()).toBe("DISCONNECTED");
  });

  it("stops reconnecting after disconnect()", async () => {
    const getToken = vi.fn().mockResolvedValue("token-1");

    await stomp.connect(getToken);
    clients[0].config.onWebSocketClose({ code: 1006, reason: "" });
    stomp.disconnect();
    await vi.runOnlyPendingTimersAsync();

    expect(getToken).toHaveBeenCalledTimes(1);
  });

  it("does not connect if disconnect() runs while the token is loading", async () => {
    let resolveToken: (token: string) => void = () => {};
    const getToken = vi.fn(
      () =>
        new Promise<string>((resolve) => {
          resolveToken = resolve;
        }),
    );

    const connecting = stomp.connect(getToken);
    stomp.disconnect();
    resolveToken("token-1");
    await connecting;

    expect(clients).toHaveLength(0);
  });

  it("reports CONNECTED once the broker connects", async () => {
    await stomp.connect(vi.fn().mockResolvedValue("token-1"));
    clients[0].config.onConnect();

    expect(stomp.getStatus()).toBe("CONNECTED");
  });
});
