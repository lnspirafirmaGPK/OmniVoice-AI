export function sendApiError(res, {
  status = 500,
  code = "INTERNAL_ERROR",
  message = "เกิดข้อผิดพลาดภายในระบบ",
  details,
  requestId,
}) {
  return res.status(status).json({
    error: {
      code,
      message,
      details,
      requestId,
    },
  });
}
