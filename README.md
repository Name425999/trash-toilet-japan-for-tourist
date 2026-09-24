# Trash & Toilet Japan
Trash & Toilet Japan คือเว็บแผนที่สำหรับค้นหาห้องน้ำสาธารณะและจุดทิ้งขยะใกล้ตัว โดยเฉพาะในญี่ปุ่นที่ถังขยะสาธารณะค่อนข้างหายาก ช่วยให้นักท่องเที่ยวเดินทางได้สะดวก ลดเวลาในการค้นหา และทิ้งขยะได้อย่างถูกที่ เว็บแอพนี้จัดทำเพื่ออยากตอบสนองความรู้สึกที่พบเจอจริงที่ญี่ปุ่นและอยากให้มีอะไรแบบนี้จริงๆครับ

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


