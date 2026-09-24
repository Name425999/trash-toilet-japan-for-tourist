# Trash & Toilet Japan

## บัญชีสำหรับทดลอง Live Demo

> บัญชีเหล่านี้ใช้กับฐานข้อมูล Demo เท่านั้นครับ



| User | `demo.user@example.com`       | password   | `DemoUser!Japan` |
| Admin | `demo.admin@example.com`     | password  | `DemoAdmin!Japan` |

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


