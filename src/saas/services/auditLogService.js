import { createId, store } from "../store/inMemoryStore.js";

export const auditLogService = {
  append({ actorId, actorRole, tenantId, action, entityType, entityId, metadata = {} }) {
    const entry = {
      id: createId("aud"),
      actorId,
      actorRole,
      tenantId,
      action,
      entityType,
      entityId,
      metadata,
      createdAt: new Date().toISOString(),
    };

    store.auditLogs.push(entry);
    return entry;
  },

  list({ tenantId, limit = 100 }) {
    const scoped = tenantId ? store.auditLogs.filter((entry) => entry.tenantId === tenantId) : store.auditLogs;
    return scoped.slice(-limit).reverse();
  },
};
