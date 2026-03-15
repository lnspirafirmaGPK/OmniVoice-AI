# OmniVoice AI SaaS MVP Architecture (Multi-tenant)

เอกสารนี้สรุป baseline สำหรับทำ OmniVoice AI ให้เป็น SaaS ใช้งานจริงแบบ MVP โดยรองรับ multi-tenant, billing plan, RBAC และ audit log

## สถาปัตยกรรมเป้าหมาย (MVP)

- **Runtime**: Node.js + Express (โมโนลิธก้อนเดียว เพื่อลดต้นทุนทีมเล็ก)
- **Isolation Model**: `row-level tenant isolation` ผ่าน `tenantId` + middleware บังคับ scope
- **API Versioning**: prefix `/api/v1`
- **Auth**: Bearer token แบบ internal token mapping
- **RBAC Roles**:
  - `platform_admin`
  - `tenant_admin`
  - `agent`
- **Billing Plan**:
  - `starter`, `growth`, `enterprise`
  - enforce limit ตัวอย่างใน product count
- **Audit Log**:
  - บันทึก action สำคัญ เช่น `TENANT_CREATED`, `PRODUCT_CREATED`, `USER_CREATED`
- **Observability ขั้นต้น**:
  - structured logs
  - request metrics in-memory
  - liveness/readiness/metrics endpoint

## Tenant Isolation Tradeoff

### ทางเลือกที่รองรับในระยะยาว

1. **Database-per-tenant**
   - ข้อดี: isolation สูงสุด
   - ข้อเสีย: ต้นทุนจัดการสูง
2. **Schema-per-tenant**
   - ข้อดี: แยกข้อมูลชัดกว่าระดับ row
   - ข้อเสีย: migration ซับซ้อนขึ้นเมื่อ tenant เยอะ
3. **Row-level (เลือกใช้สำหรับ MVP)**
   - ข้อดี: เร็ว, ต้นทุนต่ำ, เหมาะกับทีมเล็ก
   - ข้อเสีย: ต้องคุม query scope เข้มงวด และเพิ่ม automated tests

## API Contract + Error Model

### Versioning

- Base path: `/api/v1`

### Error Model มาตรฐาน

```json
{
  "error": {
    "code": "TENANT_SCOPE_VIOLATION",
    "message": "ไม่สามารถเข้าถึงข้อมูล tenant อื่นได้",
    "details": null,
    "requestId": "..."
  }
}
```

### Endpoint MVP ที่มีในรอบนี้

- `GET /api/v1/auth/me`
- `GET /api/v1/admin/tenants`
- `POST /api/v1/admin/tenants`
- `POST /api/v1/admin/users`
- `GET /api/v1/admin/audit-logs`
- `GET /api/v1/tenants/:tenantId/products`
- `POST /api/v1/tenants/:tenantId/products`
- `PATCH /api/v1/tenants/:tenantId/products/:productId`
- `DELETE /api/v1/tenants/:tenantId/products/:productId`

## เส้นทางขยายหลัง MVP

- เปลี่ยน in-memory store เป็น PostgreSQL + migration
- เพิ่ม JWT/OIDC + refresh token policy
- เพิ่ม queue สำหรับงาน async (call summary enrichment, webhook retries)
- เพิ่ม dashboard/admin UI
- เพิ่ม policy-as-code (ABAC หรือ fine-grained permissions)
