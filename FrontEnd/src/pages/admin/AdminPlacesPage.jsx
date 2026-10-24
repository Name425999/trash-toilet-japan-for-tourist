import { Trash2 } from "lucide-react";
// Admin ดู Place ทุกสถานะและลบสถานที่ | API หน้านี้ต้องผ่าน authMiddleware และ adminMiddleware
import { useEffect, useMemo, useState } from "react";
// นำ Dependency หรือ Module ที่บรรทัดถัดไปต้องใช้เข้ามาในไฟล์
import PageHeader from "../../components/PageHeader.jsx";
// นำ Dependency หรือ Module ที่บรรทัดถัดไปต้องใช้เข้ามาในไฟล์
import PlaceMap from "../../components/PlaceMap.jsx";
import PlaceCard from "../../components/PlaceCard.jsx";
// นำ Dependency หรือ Module ที่บรรทัดถัดไปต้องใช้เข้ามาในไฟล์
import { Chip, EmptyState } from "../../components/ui.jsx";
// นำ Dependency หรือ Module ที่บรรทัดถัดไปต้องใช้เข้ามาในไฟล์
import api, { getErrorMessage } from "../../services/api.js";
// นำ Dependency หรือ Module ที่บรรทัดถัดไปต้องใช้เข้ามาในไฟล์

export default function AdminPlacesPage() {
// ประกาศฟังก์ชันนี้และกำหนดขอบเขตงานตามชื่อของฟังก์ชัน
  const [places, setPlaces] = useState([]);
  // เก็บข้อมูลทั้งหมดจาก Admin API และค่าที่ใช้ Filter บนหน้าจอ
  const [type, setType] = useState("");
  // สร้าง State และฟังก์ชันเปลี่ยนค่าเพื่อให้ React render ใหม่เมื่อข้อมูลเปลี่ยน
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 30;
  // สร้าง State และฟังก์ชันเปลี่ยนค่าเพื่อให้ React render ใหม่เมื่อข้อมูลเปลี่ยน

  async function loadPlaces() {
  // สร้างฟังก์ชัน async เพื่อให้ใช้ await กับงาน API หรือ Database ได้
    try {
    // status=all ใช้ได้เฉพาะ Admin และคืน Place ทุกสถานะ
      const response = await api.get("/places", { params: { status: "all" } });
      // รอ Promise นี้ทำงานเสร็จก่อนใช้ผลลัพธ์หรือทำบรรทัดถัดไป
      setPlaces(response.data.places);
      // อัปเดต React State เพื่อให้หน้าจอ render ตามข้อมูลล่าสุด
    } catch (error) {
      console.error(getErrorMessage(error));
    }
  }

  useEffect(() => { loadPlaces(); }, []);
  // โหลดรายการครั้งเดียวเมื่อเปิดหน้า

  async function remove(id) {
  // สร้างฟังก์ชัน async เพื่อให้ใช้ await กับงาน API หรือ Database ได้
    if (!window.confirm("ยืนยันการลบสถานที่นี้?")) return;
    // ยืนยันก่อนลบ เพราะ Backend จะลบรูปและ Reports ที่เกี่ยวข้องด้วย
    try {
    // เริ่มดักงานที่อาจเกิด Error เพื่อจัดการผลลัพธ์อย่างควบคุม
      await api.delete(`/places/${id}`);
      // รอ Promise นี้ทำงานเสร็จก่อนใช้ผลลัพธ์หรือทำบรรทัดถัดไป
      loadPlaces();
    } catch (error) {
      console.error(getErrorMessage(error));
    }
  }

  const filtered = useMemo(() => places.filter((place) => (!type || place.type === type) && (place.name + " " + place.address).toLowerCase().includes(search.toLowerCase())), [places, type, search]);
  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize));
  const currentPage = Math.min(page, pageCount);
  const visible = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  // Filter นี้ทำใน Browser เพราะโหลด Place ทั้งหมดมาแล้ว

  return (
  // ส่งผลลัพธ์ออกจากฟังก์ชันและหยุดทำบรรทัดถัดไปในฟังก์ชันนี้
    <div><PageHeader title="จัดการสถานที่" subtitle="เพิ่ม แก้สถานะ และลบสถานที่" />
      <section className="space-y-4 px-5 py-5"><input className="w-full rounded-xl border border-cream-200 bg-white px-4 py-3 outline-none focus:border-brand" placeholder="ค้นหาสถานที่หรือจังหวัด..." value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} /><div className="flex gap-2"><Chip active={!type} onClick={() => { setType(""); setPage(1); }}>ทั้งหมด</Chip><Chip active={type === "toilet"} onClick={() => { setType("toilet"); setPage(1); }}>ห้องน้ำ</Chip><Chip active={type === "trash"} onClick={() => { setType("trash"); setPage(1); }}>ถังขยะ</Chip></div>
        <p className="text-sm text-stone-500">พบ {filtered.length.toLocaleString()} สถานที่ · หมุดสีน้ำเงิน: ห้องน้ำ · สีส้ม: ถังขยะ</p>
        <div className="relative isolate h-[480px] overflow-hidden rounded-2xl" aria-label="แผนที่จัดการสถานที่"><PlaceMap places={filtered} fitPlaces /></div>
        {/* ส่ง action เข้า PlaceCard เพื่อแทนปุ่มรายละเอียดด้วย status และปุ่มลบ */}
        <div className="space-y-3">{filtered.length ? visible.map((place) => <PlaceCard key={place.id} place={place} action={<div className="flex items-center gap-2"><span className="text-xs text-stone-400">{place.status}</span><button className="rounded-lg bg-danger p-2 text-white" onClick={() => remove(place.id)}><Trash2 size={15} /></button></div>} />) : <EmptyState title="ไม่พบสถานที่" />}</div>
        {pageCount > 1 && <div className="flex items-center justify-between gap-3 text-sm"><button className="rounded-xl bg-white px-4 py-2 disabled:opacity-40" disabled={currentPage === 1} onClick={() => setPage(currentPage - 1)}>ก่อนหน้า</button><span>หน้า {currentPage} / {pageCount}</span><button className="rounded-xl bg-white px-4 py-2 disabled:opacity-40" disabled={currentPage === pageCount} onClick={() => setPage(currentPage + 1)}>ถัดไป</button></div>}
      </section>
    </div>
  );
}
