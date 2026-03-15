import express from "express";
import { authenticate, authorize, enforceTenantAccess } from "../middleware/authMiddleware.js";
import adminRoutes from "./adminRoutes.js";
import tenantProductRoutes from "./tenantProductRoutes.js";

const router = express.Router();

router.use(authenticate);

router.get("/auth/me", (req, res) => {
  return res.json({
    data: {
      id: req.user.id,
      tenantId: req.user.tenantId,
      role: req.user.role,
      email: req.user.email,
    },
  });
});

router.use("/admin", authorize("tenant:write"), adminRoutes);
router.use("/tenants/:tenantId", authorize("product:read"), enforceTenantAccess, tenantProductRoutes);

export default router;
