# OmniVoice AI MVP Runbook

## Deploy

1. ติดตั้ง dependency
   ```bash
   npm ci
   ```
2. ตั้งค่า environment จาก `.env.example`
3. รัน service
   ```bash
   npm run start
   ```

## Health checks

- Liveness: `GET /health/live`
- Readiness: `GET /health/ready`
- Metrics: `GET /health/metrics`

## Rollback

1. rollback image/container ไปยัง tag ก่อนหน้า
2. ตรวจ health endpoint ทั้ง 3 จุด
3. ตรวจ smoke test API `/api/v1/auth/me` และ `/api/pipeline/reply`

## Config สำคัญ

- `API_VERSION`
- `DEFAULT_TENANT_ISOLATION_MODE`
- OpenAI/Twilio/Telnyx credentials

## Incident note (ย่อ)

- เก็บ `x-request-id` จาก response ทุกครั้ง
- ใช้ request id ค้น log เพื่อ trace ข้อผิดพลาด
- ถ้าพบ 5xx ต่อเนื่อง: ลด traffic และปิด endpoint ที่ไม่จำเป็นชั่วคราว
