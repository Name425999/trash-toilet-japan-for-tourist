# Trash & Toilet Japan

## บัญชีสำหรับทดลอง Live Demo

> บัญชีเหล่านี้ใช้กับฐานข้อมูล Demo เท่านั้นครับ
| สิทธิ์ | อีเมล | รหัสผ่าน |
| --- | --- | --- |
| User | `demo.user@example.com` | `DemoUser!Japan` |
| Admin | `demo.admin@example.com` | `DemoAdmin!Japan` |

 ข้อมูลบนแผนที่เป็นข้อมูลจำลองและพิกัดโดยประมาณ ไม่ใช่ฐานข้อมูลสถานที่อย่างเป็นทางการครับ

## Flow ทั้งระบบ

```text
ผู้ใช้กดปุ่มใน React Page
→ Page เรียก api.js (Axios)
→ Backend server.js
→ Route
→ Auth/Admin Middleware
→ Multer รับรูป (Place, Avatar หรือหลักฐาน Report)
→ Zod Validation
→ Controller
→ Prisma
→ PostgreSQL
→ JSON กลับ Axios
→ React อัปเดตหน้าจอ
```


