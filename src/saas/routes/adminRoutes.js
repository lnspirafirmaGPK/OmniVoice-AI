import express from "express";
import { auditLogService } from "../services/auditLogService.js";
import { tenantService } from "../services/tenantService.js";
import { userService } from "../services/userService.js";
import { sendApiError } from "../utils/apiResponse.js";

const router = express.Router();

router.get("/tenants", (req, res) => {
  return res.json({ data: tenantService.list() });
});

router.post("/tenants", (req, res) => {
  const { name, plan } = req.body || {};
  if (!name) {
    return sendApiError(res, {
      status: 400,
      code: "INVALID_REQUEST",
      message: "name เป็นข้อมูลที่จำเป็น",
      requestId: req.context?.requestId,
    });
  }

  try {
    const tenant = tenantService.create({ name, plan });
    auditLogService.append({
      actorId: req.user.id,
      actorRole: req.user.role,
      tenantId: tenant.id,
      action: "TENANT_CREATED",
      entityType: "tenant",
      entityId: tenant.id,
      metadata: { plan: tenant.plan },
    });

    return res.status(201).json({ data: tenant });
  } catch (error) {
    if (error.message === "INVALID_PLAN") {
      return sendApiError(res, {
        status: 400,
        code: "INVALID_PLAN",
        message: "ไม่พบ billing plan ที่ระบุ",
        requestId: req.context?.requestId,
      });
    }

    return sendApiError(res, { requestId: req.context?.requestId });
  }
});

router.post("/users", (req, res) => {
  const { tenantId = null, email, role, token } = req.body || {};

  if (!email || !role || !token) {
    return sendApiError(res, {
      status: 400,
      code: "INVALID_REQUEST",
      message: "email, role และ token เป็นข้อมูลที่จำเป็น",
      requestId: req.context?.requestId,
    });
  }

  try {
    const user = userService.create({ tenantId, email, role, token });
    auditLogService.append({
      actorId: req.user.id,
      actorRole: req.user.role,
      tenantId,
      action: "USER_CREATED",
      entityType: "user",
      entityId: user.id,
      metadata: { role },
    });

    return res.status(201).json({ data: user });
  } catch (error) {
    if (error.message === "INVALID_ROLE" || error.message === "TOKEN_CONFLICT") {
      return sendApiError(res, {
        status: 400,
        code: error.message,
        message: "ข้อมูลผู้ใช้ไม่ถูกต้อง",
        requestId: req.context?.requestId,
      });
    }

    return sendApiError(res, { requestId: req.context?.requestId });
  }
});

router.get("/audit-logs", (req, res) => {
  const tenantId = req.query.tenantId ? String(req.query.tenantId) : undefined;
  const limit = req.query.limit ? Number(req.query.limit) : 100;

  return res.json({ data: auditLogService.list({ tenantId, limit }) });
});

export default router;
