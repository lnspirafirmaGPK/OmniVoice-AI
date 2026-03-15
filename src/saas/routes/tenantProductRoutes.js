import express from "express";
import { auditLogService } from "../services/auditLogService.js";
import { productService } from "../services/productService.js";
import { sendApiError } from "../utils/apiResponse.js";

const router = express.Router({ mergeParams: true });

router.get("/products", (req, res) => {
  return res.json({ data: productService.listByTenant(req.params.tenantId) });
});

router.post("/products", (req, res) => {
  const { sku, name, price, currency } = req.body || {};
  if (!sku || !name || Number.isNaN(Number(price))) {
    return sendApiError(res, {
      status: 400,
      code: "INVALID_REQUEST",
      message: "sku, name และ price เป็นข้อมูลที่จำเป็น",
      requestId: req.context?.requestId,
    });
  }

  try {
    const product = productService.create({
      tenantId: req.params.tenantId,
      sku,
      name,
      price: Number(price),
      currency,
    });

    auditLogService.append({
      actorId: req.user.id,
      actorRole: req.user.role,
      tenantId: req.params.tenantId,
      action: "PRODUCT_CREATED",
      entityType: "product",
      entityId: product.id,
      metadata: { sku: product.sku },
    });

    return res.status(201).json({ data: product });
  } catch (error) {
    const known = new Set(["TENANT_NOT_FOUND", "PLAN_LIMIT_REACHED"]);
    if (known.has(error.message)) {
      return sendApiError(res, {
        status: 400,
        code: error.message,
        message: "ไม่สามารถสร้างสินค้าได้",
        requestId: req.context?.requestId,
      });
    }

    return sendApiError(res, { requestId: req.context?.requestId });
  }
});

router.patch("/products/:productId", (req, res) => {
  try {
    const product = productService.update({
      tenantId: req.params.tenantId,
      productId: req.params.productId,
      patch: req.body || {},
    });

    auditLogService.append({
      actorId: req.user.id,
      actorRole: req.user.role,
      tenantId: req.params.tenantId,
      action: "PRODUCT_UPDATED",
      entityType: "product",
      entityId: product.id,
      metadata: { fields: Object.keys(req.body || {}) },
    });

    return res.json({ data: product });
  } catch (error) {
    if (error.message === "PRODUCT_NOT_FOUND") {
      return sendApiError(res, {
        status: 404,
        code: "PRODUCT_NOT_FOUND",
        message: "ไม่พบสินค้าใน tenant นี้",
        requestId: req.context?.requestId,
      });
    }

    return sendApiError(res, { requestId: req.context?.requestId });
  }
});

router.delete("/products/:productId", (req, res) => {
  try {
    const removed = productService.remove({ tenantId: req.params.tenantId, productId: req.params.productId });

    auditLogService.append({
      actorId: req.user.id,
      actorRole: req.user.role,
      tenantId: req.params.tenantId,
      action: "PRODUCT_DELETED",
      entityType: "product",
      entityId: removed.id,
      metadata: { sku: removed.sku },
    });

    return res.status(204).end();
  } catch (error) {
    if (error.message === "PRODUCT_NOT_FOUND") {
      return sendApiError(res, {
        status: 404,
        code: "PRODUCT_NOT_FOUND",
        message: "ไม่พบสินค้าใน tenant นี้",
        requestId: req.context?.requestId,
      });
    }

    return sendApiError(res, { requestId: req.context?.requestId });
  }
});

export default router;
