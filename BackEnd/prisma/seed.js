import "dotenv/config";
import bcrypt from "bcrypt";
import { prisma } from "../src/lib/prisma.js";

const DEMO_USERS = {
  admin: {
    name: "Demo Admin",
    email: "demo.admin@example.com",
    password: "DemoAdmin!Japan",
    role: "admin",
  },
  member: {
    name: "Demo User",
    email: "demo.user@example.com",
    password: "DemoUser!Japan",
    role: "member",
  },
};

// Coordinates are approximate demo markers, not an official facility directory.
const DEMO_PLACES = [
  { name: "[Demo] ห้องน้ำ สวนลุมพินี", type: "toilet", address: "สวนลุมพินี เขตปทุมวัน กรุงเทพฯ", latitude: 13.7306, longitude: 100.5418, status: "active" },
  { name: "[Demo] จุดทิ้งขยะ สยามสแควร์", type: "trash", address: "สยามสแควร์ เขตปทุมวัน กรุงเทพฯ", latitude: 13.7456, longitude: 100.5342, status: "active" },
  { name: "[Demo] ห้องน้ำ สนามหลวง", type: "toilet", address: "สนามหลวง เขตพระนคร กรุงเทพฯ", latitude: 13.7565, longitude: 100.4930, status: "active" },
  { name: "[Demo] จุดทิ้งขยะ ถนนข้าวสาร", type: "trash", address: "ถนนข้าวสาร เขตพระนคร กรุงเทพฯ", latitude: 13.7589, longitude: 100.4971, status: "active" },
  { name: "[Demo] ห้องน้ำ สวนจตุจักร", type: "toilet", address: "สวนจตุจักร เขตจตุจักร กรุงเทพฯ", latitude: 13.8104, longitude: 100.5554, status: "active" },
  { name: "[Demo] จุดทิ้งขยะ ตลาดนัดจตุจักร", type: "trash", address: "ตลาดนัดจตุจักร เขตจตุจักร กรุงเทพฯ", latitude: 13.7999, longitude: 100.5502, status: "active" },
  { name: "[Demo] ห้องน้ำ อนุสาวรีย์ชัยฯ", type: "toilet", address: "อนุสาวรีย์ชัยสมรภูมิ เขตราชเทวี กรุงเทพฯ", latitude: 13.7649, longitude: 100.5383, status: "active" },
  { name: "[Demo] จุดทิ้งขยะ อารีย์", type: "trash", address: "ย่านอารีย์ เขตพญาไท กรุงเทพฯ", latitude: 13.7797, longitude: 100.5447, status: "active" },
  { name: "[Demo] ห้องน้ำ สวนเบญจกิติ", type: "toilet", address: "สวนเบญจกิติ เขตคลองเตย กรุงเทพฯ", latitude: 13.7303, longitude: 100.5586, status: "active" },
  { name: "[Demo] จุดทิ้งขยะ อโศก", type: "trash", address: "แยกอโศก เขตวัฒนา กรุงเทพฯ", latitude: 13.7370, longitude: 100.5604, status: "active" },
  { name: "[Demo] ห้องน้ำ บางนา", type: "toilet", address: "ย่านบางนา เขตบางนา กรุงเทพฯ", latitude: 13.6682, longitude: 100.6047, status: "active" },
  { name: "[Demo] จุดทิ้งขยะ พระโขนง", type: "trash", address: "ย่านพระโขนง เขตคลองเตย กรุงเทพฯ", latitude: 13.7152, longitude: 100.5912, status: "active" },
  { name: "[Demo] ห้องน้ำ วงเวียนใหญ่", type: "toilet", address: "วงเวียนใหญ่ เขตธนบุรี กรุงเทพฯ", latitude: 13.7210, longitude: 100.4954, status: "active" },
  { name: "[Demo] จุดทิ้งขยะ บางแค", type: "trash", address: "ย่านบางแค เขตบางแค กรุงเทพฯ", latitude: 13.7111, longitude: 100.4094, status: "active" },
  { name: "[Demo] ห้องน้ำ หลักสี่ (รอตรวจสอบ)", type: "toilet", address: "ย่านหลักสี่ เขตหลักสี่ กรุงเทพฯ", latitude: 13.8874, longitude: 100.5792, status: "pending" },
  { name: "[Demo] จุดทิ้งขยะ มีนบุรี (รอตรวจสอบ)", type: "trash", address: "ย่านมีนบุรี เขตมีนบุรี กรุงเทพฯ", latitude: 13.8135, longitude: 100.7480, status: "pending" },
  { name: "[Demo] ห้องน้ำ ลาดกระบัง (รอตรวจสอบ)", type: "toilet", address: "ย่านลาดกระบัง เขตลาดกระบัง กรุงเทพฯ", latitude: 13.7278, longitude: 100.7488, status: "pending" },
  { name: "[Demo] จุดทิ้งขยะ รามคำแหง (ปิดชั่วคราว)", type: "trash", address: "ย่านรามคำแหง เขตบางกะปิ กรุงเทพฯ", latitude: 13.7567, longitude: 100.6187, status: "inactive" },
  { name: "[Demo] ห้องน้ำ ตลิ่งชัน (ปิดชั่วคราว)", type: "toilet", address: "ย่านตลิ่งชัน เขตตลิ่งชัน กรุงเทพฯ", latitude: 13.7767, longitude: 100.4566, status: "inactive" },
  { name: "[Demo] จุดทิ้งขยะ ดอนเมือง (ข้อมูลไม่ผ่าน)", type: "trash", address: "ย่านดอนเมือง เขตดอนเมือง กรุงเทพฯ", latitude: 13.9126, longitude: 100.6068, status: "rejected" },
];

async function upsertDemoUser(user) {
  const password = await bcrypt.hash(user.password, 10);
  return prisma.user.upsert({
    where: { email: user.email },
    update: { name: user.name, password, role: user.role },
    create: { name: user.name, email: user.email, password, role: user.role },
  });
}

async function upsertDemoPlace(place, createdById) {
  const existing = await prisma.place.findFirst({ where: { name: place.name } });
  const data = { ...place, imageUrl: null, createdById };
  return existing
    ? prisma.place.update({ where: { id: existing.id }, data })
    : prisma.place.create({ data });
}

async function seed() {
  const admin = await upsertDemoUser(DEMO_USERS.admin);
  const member = await upsertDemoUser(DEMO_USERS.member);
  const places = [];

  for (const place of DEMO_PLACES) {
    places.push(await upsertDemoPlace(place, place.status === "pending" ? member.id : admin.id));
  }

  const demoReports = [
    { place: places[0], reason: "เวลาปิดไม่ตรงกับข้อมูล", description: "รายงานตัวอย่างสำหรับทดลองขั้นตอนตรวจสอบ", status: "pending" },
    { place: places[5], reason: "จุดทิ้งขยะเต็ม", description: "รายงานตัวอย่างที่ดำเนินการแล้ว", status: "resolved" },
    { place: places[11], reason: "หาไม่พบในตำแหน่งที่ระบุ", description: "รายงานตัวอย่างที่ถูกปฏิเสธ", status: "rejected" },
  ];

  for (const report of demoReports) {
    const existing = await prisma.report.findFirst({
      where: { placeId: report.place.id, reporterId: member.id, reason: report.reason },
    });
    const data = {
      reason: report.reason,
      description: report.description,
      status: report.status,
      placeId: report.place.id,
      reporterId: member.id,
    };
    if (existing) await prisma.report.update({ where: { id: existing.id }, data });
    else await prisma.report.create({ data });
  }

  console.log(`Demo seed complete: 2 users, ${places.length} places, ${demoReports.length} reports.`);
}

seed()
  .catch((error) => {
    console.error("Demo seed failed:", error);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
