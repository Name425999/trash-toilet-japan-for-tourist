# Trash & Toilet Japan

## บัญชีสำหรับทดลอง Live Demo

> บัญชีเหล่านี้ใช้กับฐานข้อมูล Demo เท่านั้น ห้ามนำรหัสผ่านนี้ไปใช้กับระบบจริง

| สิทธิ์ | อีเมล | รหัสผ่าน |
| --- | --- | --- |
| User | `demo.user@example.com` | `DemoUser!Japan` |
| Admin | `demo.admin@example.com` | `DemoAdmin!Japan` |

หน้าเข้าสู่ระบบมีปุ่มกรอกบัญชี Demo ให้อัตโนมัติ ข้อมูลบนแผนที่เป็นข้อมูลจำลองและพิกัดโดยประมาณ ไม่ใช่ฐานข้อมูลสถานที่อย่างเป็นทางการ

เตรียมฐานข้อมูลสำหรับ Live Demo หลังจาก `prisma db push`:

```powershell
cd BackEnd
npm run seed:demo
```

คำสั่ง seed รันซ้ำได้โดยไม่เพิ่มบัญชี สถานที่ หรือรายงานซ้ำ สำหรับ Render จะรันอัตโนมัติทุกครั้งก่อนเปิด Server

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


