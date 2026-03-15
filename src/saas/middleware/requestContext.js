import crypto from "node:crypto";
import { store } from "../store/inMemoryStore.js";
import { logger } from "../../utils/logger.js";

export function requestContext(req, res, next) {
  const requestId = req.headers["x-request-id"] || crypto.randomUUID();
  const startedAt = Date.now();

  req.context = { requestId };
  res.setHeader("x-request-id", requestId);

  res.on("finish", () => {
    store.metrics.requestsTotal += 1;
    const metricKey = `${req.method} ${req.route?.path || req.path} ${res.statusCode}`;
    store.metrics.byPath[metricKey] = (store.metrics.byPath[metricKey] || 0) + 1;

    if (res.statusCode >= 500) {
      store.metrics.errorsTotal += 1;
    }

    logger.info("HTTP request completed", {
      requestId,
      method: req.method,
      path: req.originalUrl,
      statusCode: res.statusCode,
      durationMs: Date.now() - startedAt,
    });
  });

  next();
}
