import express from "express";
import { store } from "../saas/store/inMemoryStore.js";

const router = express.Router();

router.get("/live", (_req, res) => {
  res.json({ status: "ok", service: "OmniVoice AI", check: "liveness", time: new Date().toISOString() });
});

router.get("/ready", (_req, res) => {
  const ready = Boolean(store.tenants.length > 0 && store.users.length > 0);
  res.status(ready ? 200 : 503).json({
    status: ready ? "ok" : "degraded",
    service: "OmniVoice AI",
    check: "readiness",
    dependencies: {
      inMemoryStore: ready ? "up" : "down",
    },
  });
});

router.get("/metrics", (_req, res) => {
  res.json({
    requestsTotal: store.metrics.requestsTotal,
    errorsTotal: store.metrics.errorsTotal,
    byPath: store.metrics.byPath,
    tenantCount: store.tenants.length,
    userCount: store.users.length,
  });
});

export default router;
