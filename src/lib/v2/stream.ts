/**
 * Live updates over Server-Sent Events: `GET /me/stream` (contract 4g).
 *
 * The server closes the stream when the 15-minute access cookie expires, and
 * EventSource's own retry would then hit 401 forever. So on `error` we close
 * it, refresh the session (single-flight, shared with http.ts), open a new
 * EventSource and resync the badge counts — backing off between attempts.
 * A fresh EventSource doesn't send Last-Event-ID, hence the resync.
 */
import { refreshSession } from "./http";
import type { JustInEvent } from "./curator/providers";
import type { SseEventName, SseNotification, SseProviderStatus } from "./types";

export const STREAM_PATH = "/me/stream";

export type SsePayloads = {
  notification: SseNotification;
  "provider-status": SseProviderStatus;
  // Curator only.
  "just-in": JustInEvent;
};

const EVENT_NAMES: SseEventName[] = [
  "notification",
  "provider-status",
  "just-in",
];

type EventSourceLike = Pick<
  EventSource,
  "addEventListener" | "close" | "onerror" | "onopen"
>;

export type LiveStreamOptions = {
  onEvent: <K extends SseEventName>(name: K, data: SsePayloads[K]) => void;
  /** Runs after every reopen (resync `/me/notifications/counts`). */
  onResync?: () => void;
  refresh?: () => Promise<boolean>;
  createEventSource?: (url: string) => EventSourceLike;
  /** Delay before reopen attempt `n` (0-based). */
  backoffMs?: (attempt: number) => number;
};

export const defaultBackoff = (attempt: number) =>
  Math.min(30_000, 1_000 * 2 ** attempt);

export function createLiveStream({
  onEvent,
  onResync,
  refresh = refreshSession,
  createEventSource = (url) => new EventSource(url, { withCredentials: true }),
  backoffMs = defaultBackoff,
}: LiveStreamOptions): { close: () => void } {
  let source: EventSourceLike | null = null;
  let closed = false;
  let attempt = 0;
  let timer: ReturnType<typeof setTimeout> | null = null;

  const open = (isReopen: boolean) => {
    if (closed) return;
    const es = createEventSource(STREAM_PATH);
    source = es;
    for (const name of EVENT_NAMES) {
      es.addEventListener(name, (event) => {
        try {
          onEvent(name, JSON.parse((event as MessageEvent).data));
        } catch {
          // Malformed payload: ignore it, the stream stays up.
        }
      });
    }
    es.onopen = () => {
      attempt = 0;
    };
    es.onerror = () => {
      es.close();
      if (source === es) source = null;
      scheduleReopen();
    };
    if (isReopen) onResync?.();
  };

  const scheduleReopen = () => {
    if (closed || timer) return;
    const delay = backoffMs(attempt);
    attempt += 1;
    timer = setTimeout(async () => {
      timer = null;
      if (closed) return;
      // A false refresh may be a network blip; the next error backs off again.
      await refresh();
      open(true);
    }, delay);
  };

  open(false);

  return {
    close: () => {
      closed = true;
      if (timer) clearTimeout(timer);
      timer = null;
      source?.close();
      source = null;
    },
  };
}

// ---------- App-wide fan-out: one stream per tab, many listeners ----------

type Listener = <K extends SseEventName>(name: K, data: SsePayloads[K]) => void;

const listeners = new Set<Listener>();
const resyncListeners = new Set<() => void>();

/** Subscribe to every named event on the shared stream. */
export function subscribeLiveEvents(listener: Listener): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

/** Subscribe to "the stream was reopened; refetch what you show". */
export function subscribeLiveResync(listener: () => void): () => void {
  resyncListeners.add(listener);
  return () => resyncListeners.delete(listener);
}

/** Opens the shared stream; call the returned function to close it. */
export function openSharedLiveStream(
  options: Partial<Omit<LiveStreamOptions, "onEvent">> = {},
): () => void {
  const stream = createLiveStream({
    ...options,
    onEvent: (name, data) => listeners.forEach((l) => l(name, data)),
    onResync: () => {
      options.onResync?.();
      resyncListeners.forEach((l) => l());
    },
  });
  return stream.close;
}
