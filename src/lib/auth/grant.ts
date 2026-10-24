import type { Role } from "@/lib/v2/types";

/**
 * The one-time `grant` from `POST /auth/verify` (RECOVERY or CLAIM), held in
 * memory only: it lives 10 minutes and works once. It survives the client-side
 * hop to the new-password screen; a hard reload drops it and the user asks
 * for a new code.
 */
export type PendingGrant = {
  grant: string;
  email: string;
  role: Role;
  purpose: "RECOVERY" | "CLAIM";
};

let pending: PendingGrant | null = null;

export const holdGrant = (value: PendingGrant) => {
  pending = value;
};

export const peekGrant = (): PendingGrant | null => pending;

export const releaseGrant = () => {
  pending = null;
};
