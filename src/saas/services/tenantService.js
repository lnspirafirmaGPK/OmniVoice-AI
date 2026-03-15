import { billingPlans, createId, store } from "../store/inMemoryStore.js";

export const tenantService = {
  list() {
    return store.tenants.map((tenant) => ({
      ...tenant,
      limits: billingPlans[tenant.plan] || null,
    }));
  },

  create({ name, plan = "starter" }) {
    if (!billingPlans[plan]) {
      throw new Error("INVALID_PLAN");
    }

    const tenant = {
      id: createId("tenant"),
      name,
      plan,
      status: "active",
      createdAt: new Date().toISOString(),
    };

    store.tenants.push(tenant);
    return tenant;
  },

  getById(tenantId) {
    return store.tenants.find((tenant) => tenant.id === tenantId) || null;
  },
};
