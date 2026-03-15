import { billingPlans, createId, store } from "../store/inMemoryStore.js";

export const productService = {
  listByTenant(tenantId) {
    return store.products.filter((product) => product.tenantId === tenantId);
  },

  create({ tenantId, sku, name, price, currency = "THB" }) {
    const tenant = store.tenants.find((item) => item.id === tenantId);
    if (!tenant) throw new Error("TENANT_NOT_FOUND");

    const limits = billingPlans[tenant.plan];
    const currentCount = store.products.filter((product) => product.tenantId === tenantId).length;
    if (limits && currentCount >= limits.maxProducts) throw new Error("PLAN_LIMIT_REACHED");

    const product = {
      id: createId("prod"),
      tenantId,
      sku,
      name,
      price,
      currency,
      active: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    store.products.push(product);
    return product;
  },

  update({ tenantId, productId, patch }) {
    const product = store.products.find((item) => item.id === productId && item.tenantId === tenantId);
    if (!product) throw new Error("PRODUCT_NOT_FOUND");

    Object.assign(product, patch, { updatedAt: new Date().toISOString() });
    return product;
  },

  remove({ tenantId, productId }) {
    const index = store.products.findIndex((item) => item.id === productId && item.tenantId === tenantId);
    if (index < 0) throw new Error("PRODUCT_NOT_FOUND");

    const [removed] = store.products.splice(index, 1);
    return removed;
  },
};
