/**
 * Role groups (the sign-up specialty list) and roles (RoleCategoryController).
 * Names are unique (409 NAME_TAKEN); category edits carry `version` (409 STALE).
 */
import { http } from "@/lib/v2/http";
import { seg } from "./files";
import type { RoleCategory, UUID } from "./types";

/** RoleCatalogueStore.Role */
export interface Role {
  id: UUID;
  name: string;
  emoji: string;
}

export const rolesCurator = {
  /** Public; alphabetical, with each group's roles and ON/OFF state. */
  categories: () => http.get<RoleCategory[]>("/role-categories"),
  createCategory: (name: string, dormant = false) =>
    http.post<RoleCategory>("/role-categories", { name, dormant }),
  updateCategory: (
    id: UUID,
    body: { version: number; name?: string; dormant?: boolean },
  ) => http.patch<RoleCategory>(`/role-categories/${seg(id)}`, body),
  /** Put a role in the group, or switch it ON/OFF there. */
  setRole: (categoryId: UUID, roleId: UUID, active: boolean) =>
    http.put<RoleCategory>(
      `/role-categories/${seg(categoryId)}/roles/${seg(roleId)}`,
      { active },
    ),
  roles: () => http.get<Role[]>("/roles"),
  createRole: (name: string, emoji: string) =>
    http.post<Role>("/roles", { name, emoji }),
};
