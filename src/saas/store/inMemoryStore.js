import crypto from "node:crypto";

const nowIso = () => new Date().toISOString();

export const billingPlans = {
  starter: { name: "starter", maxUsers: 3, maxProducts: 100 },
  growth: { name: "growth", maxUsers: 20, maxProducts: 2000 },
  enterprise: { name: "enterprise", maxUsers: 500, maxProducts: 100000 },
};

const defaultTenants = [
  { id: "tenant_demo", name: "Demo Commerce", plan: "growth", status: "active", createdAt: nowIso() },
  { id: "tenant_trial", name: "Trial Shop", plan: "starter", status: "active", createdAt: nowIso() },
];

const defaultUsers = [
  { id: "usr_platform", tenantId: null, role: "platform_admin", email: "platform@omnivoice.ai", token: "platform-admin-token" },
  { id: "usr_tenant_admin", tenantId: "tenant_demo", role: "tenant_admin", email: "owner@demo.co.th", token: "tenant-admin-token" },
  { id: "usr_agent", tenantId: "tenant_demo", role: "agent", email: "agent@demo.co.th", token: "tenant-agent-token" },
];

const defaultProducts = [
  {
    id: "prod_001",
    tenantId: "tenant_demo",
    sku: "SERUM-A1",
    name: "เซรั่มบำรุงผิว Omni Glow",
    price: 590,
    currency: "THB",
    active: true,
    createdAt: nowIso(),
    updatedAt: nowIso(),
  },
];

export const store = {
  tenants: [...defaultTenants],
  users: [...defaultUsers],
  products: [...defaultProducts],
  auditLogs: [],
  metrics: {
    requestsTotal: 0,
    errorsTotal: 0,
    byPath: {},
  },
};

export function createId(prefix) {
  return `${prefix}_${crypto.randomUUID().replace(/-/g, "").slice(0, 12)}`;
}
