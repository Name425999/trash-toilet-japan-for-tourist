import "dotenv/config";
// ลำดับอ่าน 5: Controllers import prisma จากไฟล์นี้เพื่อคุยกับ PostgreSQL | ไฟล์นี้อ่าน DATABASE_URL แล้วสร้าง Prisma Client หนึ่งตัว | ดูว่ามีตารางและ field อะไรได้ต่อที่ prisma/schema.prisma
import { PrismaPg } from "@prisma/adapter-pg";
// นำ Dependency หรือ Module ที่บรรทัดถัดไปต้องใช้เข้ามาในไฟล์
import { PrismaClient } from "../../generated/prisma/client.js";
// นำ Dependency หรือ Module ที่บรรทัดถัดไปต้องใช้เข้ามาในไฟล์

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
  max: 5,
});

const prisma = new PrismaClient({ adapter });
// prisma คือตัวกลางที่ Controllers ใช้อ่านและแก้ข้อมูลใน Database

export { prisma };
