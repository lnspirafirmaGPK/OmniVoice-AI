import { store } from "../store/inMemoryStore.js";

export const rolePermissions = {
  platform_admin: new Set(["tenant:read", "tenant:write", "user:write", "product:write", "product:read", "audit:read"]),
  tenant_admin: new Set(["tenant:read", "product:write", "product:read", "audit:read"]),
  agent: new Set(["product:read"]),
};

export const authService = {
  authenticate(token) {
    if (!token) return null;
    return store.users.find((user) => user.token === token) || null;
  },

  can(user, permission) {
    if (!user) return false;
    return rolePermissions[user.role]?.has(permission) || false;
  },
};
