import { authService } from "../services/authService.js";
import { sendApiError } from "../utils/apiResponse.js";

export function authenticate(req, res, next) {
  const raw = req.headers.authorization || "";
  const token = raw.startsWith("Bearer ") ? raw.slice(7) : "";
  const user = authService.authenticate(token);

  if (!user) {
    return sendApiError(res, {
      status: 401,
      code: "UNAUTHORIZED",
      message: "กรุณาเข้าสู่ระบบก่อนใช้งาน",
      requestId: req.context?.requestId,
    });
  }

  req.user = user;
  return next();
}

export function authorize(permission) {
  return (req, res, next) => {
    if (!authService.can(req.user, permission)) {
      return sendApiError(res, {
        status: 403,
        code: "FORBIDDEN",
        message: "คุณไม่มีสิทธิ์ใช้งานส่วนนี้",
        requestId: req.context?.requestId,
      });
    }

    return next();
  };
}

export function enforceTenantAccess(req, res, next) {
  const requestedTenantId = req.params.tenantId;
  const isPlatformAdmin = req.user.role === "platform_admin";

  if (!requestedTenantId || isPlatformAdmin || req.user.tenantId === requestedTenantId) {
    return next();
  }

  return sendApiError(res, {
    status: 403,
    code: "TENANT_SCOPE_VIOLATION",
    message: "ไม่สามารถเข้าถึงข้อมูล tenant อื่นได้",
    requestId: req.context?.requestId,
  });
}
