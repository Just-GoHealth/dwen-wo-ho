function elapsedSeconds(timestamp: string | Date): number {
  const date = typeof timestamp === "string" ? new Date(timestamp) : timestamp;
  const now = new Date();
  return Math.floor((now.getTime() - date.getTime()) / 1000);
}

/** mm:ss timer display (e.g. OTP countdown). */
export function formatElapsedSeconds(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

/** Full relative time with weeks, months, and years. */
export function timeAgo(timestamp: string | Date | undefined): string {
  if (!timestamp) return "";

  const seconds = elapsedSeconds(timestamp);

  if (seconds < 60) return "just now";
  if (seconds < 3600) {
    const mins = Math.floor(seconds / 60);
    return `${mins}m ago`;
  }
  if (seconds < 86400) {
    const hours = Math.floor(seconds / 3600);
    return `${hours}h ago`;
  }
  if (seconds < 604800) {
    const days = Math.floor(seconds / 86400);
    return `${days}d ago`;
  }
  if (seconds < 2592000) {
    const weeks = Math.floor(seconds / 604800);
    return `${weeks}w ago`;
  }
  if (seconds < 31536000) {
    const months = Math.floor(seconds / 2592000);
    return `${months}mo ago`;
  }
  const years = Math.floor(seconds / 31536000);
  return `${years}y ago`;
}

/** Compact relative time without "ago" suffix (e.g. `2h`, `3d`, `1w`, `1y`) —
 * escalates through hours/days/weeks/years so a week never reads as "7d"
 * and a year's worth of days never reads as a triple-digit day count. */
export function compactTimeAgo(dateString: string): string {
  if (!dateString) return "";

  const seconds = elapsedSeconds(dateString);

  if (seconds < 60) return "1m";

  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h`;

  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d`;

  if (days < 365) return `${Math.floor(days / 7)}w`;

  return `${Math.floor(days / 365)}y`;
}

/** Short relative time capped at days — used by pending-approval flows. */
export function calculateTimeAgo(dateString: string): string {
  const seconds = elapsedSeconds(dateString);

  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

/** Verbose relative time with full words (e.g. `2 minutes ago`). */
export function verboseTimeAgo(date: string | Date): string {
  const seconds = elapsedSeconds(date);

  if (seconds < 60) return "Just now";
  if (seconds < 3600) {
    const mins = Math.floor(seconds / 60);
    return `${mins} minute${mins > 1 ? "s" : ""} ago`;
  }
  if (seconds < 86400) {
    const hours = Math.floor(seconds / 3600);
    return `${hours} hour${hours > 1 ? "s" : ""} ago`;
  }
  const days = Math.floor(seconds / 86400);
  return `${days} day${days > 1 ? "s" : ""} ago`;
}
