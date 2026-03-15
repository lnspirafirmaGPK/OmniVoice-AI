import { createId, store } from "../store/inMemoryStore.js";

const allowedRoles = new Set(["platform_admin", "tenant_admin", "agent"]);

export const userService = {
  create({ tenantId = null, email, role, token }) {
    if (!allowedRoles.has(role)) {
      throw new Error("INVALID_ROLE");
    }

    if (store.users.some((user) => user.token === token)) {
      throw new Error("TOKEN_CONFLICT");
    }

    const user = {
      id: createId("usr"),
      tenantId,
      email,
      role,
      token,
    };

    store.users.push(user);
    return user;
  },
};
