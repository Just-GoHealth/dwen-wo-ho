import { describe, expect, it, beforeEach, afterEach, vi } from "vitest";
import { createLiveStream } from "./stream";

/** Minimal EventSource stand-in: named listeners plus onopen/onerror. */
class FakeEventSource {
  static instances: FakeEventSource[] = [];
  listeners = new Map<string, ((e: MessageEvent) => void)[]>();
  onopen: ((e: Event) => void) | null = null;
  onerror: ((e: Event) => void) | null = null;
  closed = false;

  constructor(public url: string) {
    FakeEventSource.instances.push(this);
  }

  addEventListener(name: string, fn: (e: MessageEvent) => void) {
    this.listeners.set(name, [...(this.listeners.get(name) ?? []), fn]);
  }

  close() {
    this.closed = true;
  }

  emit(name: string, data: unknown) {
    const event = { data: JSON.stringify(data) } as MessageEvent;
    this.listeners.get(name)?.forEach((fn) => fn(event));
  }

  fail() {
    this.onerror?.(new Event("error"));
  }
}

const latest = () => FakeEventSource.instances.at(-1)!;

describe("createLiveStream (GET /me/stream)", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    FakeEventSource.instances = [];
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  const start = (refresh = vi.fn().mockResolvedValue(true)) => {
    const onEvent = vi.fn();
    const onResync = vi.fn();
    const stream = createLiveStream({
      onEvent,
      onResync,
      refresh,
      createEventSource: (url) =>
        new FakeEventSource(url) as unknown as EventSource,
      backoffMs: (n) => 1000 * 2 ** n,
    });
    return { stream, onEvent, onResync, refresh };
  };

  it("opens /me/stream and dispatches the named events", () => {
    const { onEvent } = start();

    expect(latest().url).toBe("/me/stream");
    latest().emit("notification", {
      id: "n1",
      type: "URGENT_RESULT",
      title: "Urgent",
      campusId: null,
      unread: 4,
    });
    latest().emit("provider-status", { status: "APPROVED", next: "HOME" });

    expect(onEvent).toHaveBeenCalledWith(
      "notification",
      expect.objectContaining({ unread: 4 }),
    );
    expect(onEvent).toHaveBeenCalledWith("provider-status", {
      status: "APPROVED",
      next: "HOME",
    });
  });

  it("on error: closes, refreshes, reopens, then resyncs", async () => {
    const { refresh, onResync } = start();
    const first = latest();

    first.fail();
    expect(first.closed).toBe(true);
    expect(refresh).not.toHaveBeenCalled();

    await vi.advanceTimersByTimeAsync(1000);

    expect(refresh).toHaveBeenCalledTimes(1);
    expect(FakeEventSource.instances).toHaveLength(2);
    expect(latest()).not.toBe(first);
    expect(onResync).toHaveBeenCalledTimes(1);
  });

  it("backs off between reopen attempts and resets after a good open", async () => {
    const { refresh } = start();

    latest().fail();
    await vi.advanceTimersByTimeAsync(1000);
    latest().fail();
    await vi.advanceTimersByTimeAsync(1999);
    expect(refresh).toHaveBeenCalledTimes(1);
    await vi.advanceTimersByTimeAsync(1);
    expect(refresh).toHaveBeenCalledTimes(2);

    latest().onopen?.(new Event("open"));
    latest().fail();
    await vi.advanceTimersByTimeAsync(1000);
    expect(refresh).toHaveBeenCalledTimes(3);
  });

  it("stops reopening once closed", async () => {
    const { stream, refresh } = start();

    latest().fail();
    stream.close();
    await vi.advanceTimersByTimeAsync(60_000);

    expect(refresh).not.toHaveBeenCalled();
    expect(FakeEventSource.instances).toHaveLength(1);
  });

  it("ignores malformed payloads", () => {
    const { onEvent } = start();
    latest().listeners.get("notification")?.[0]({ data: "{" } as MessageEvent);
    expect(onEvent).not.toHaveBeenCalled();
  });
});
