# OmniVoice AI Architecture

โครงสร้างโปรเจกต์แบ่งตามหน้าที่ เพื่อให้ขยายฟีเจอร์ API และเชื่อมบริการภายนอกได้ง่าย:

- `src/config`: จัดการ environment/config
- `src/controllers`: จุดรับ webhook และ request handlers
- `src/services`: business logic และ integration
- `src/utils`: helper functions
