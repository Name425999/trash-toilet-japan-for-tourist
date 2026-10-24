import L from "leaflet";
// รับ places จาก MapHomePage แล้ววาด Base Map, Marker และตำแหน่งผู้ใช้ | OpenStreetMap เป็นพื้นแผนที่ ส่วน Marker มาจาก Backend/Database
import { Trash2, Toilet } from "lucide-react";
// นำ Dependency หรือ Module ที่บรรทัดถัดไปต้องใช้เข้ามาในไฟล์
import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";
// นำ Dependency หรือ Module ที่บรรทัดถัดไปต้องใช้เข้ามาในไฟล์
import { renderToStaticMarkup } from "react-dom/server";
import { useEffect } from "react";
// นำ Dependency หรือ Module ที่บรรทัดถัดไปต้องใช้เข้ามาในไฟล์
import { Link } from "react-router-dom";
// นำ Dependency หรือ Module ที่บรรทัดถัดไปต้องใช้เข้ามาในไฟล์
import { getAssetUrl } from "../services/api.js";
// นำ Dependency หรือ Module ที่บรรทัดถัดไปต้องใช้เข้ามาในไฟล์

function RecenterMap({ center }) {
// ประกาศฟังก์ชันนี้และกำหนดขอบเขตงานตามชื่อของฟังก์ชัน
  const map = useMap();
  // useMap เข้าถึง Leaflet Map ที่ถูกสร้างโดย MapContainer
  useEffect(() => { map.setView(center, map.getZoom()); }, [map, center]);
  // เปลี่ยนจุดกึ่งกลาง แต่รักษาระดับ Zoom ปัจจุบันไว้
  return null;
  // ส่งผลลัพธ์ออกจากฟังก์ชันและหยุดทำบรรทัดถัดไปในฟังก์ชันนี้
}

const markerIcons = {};

function markerIcon(type) {
  if (markerIcons[type]) return markerIcons[type];
// ประกาศฟังก์ชันนี้และกำหนดขอบเขตงานตามชื่อของฟังก์ชัน
  const color = type === "toilet" ? "#3f7ee8" : "#ff8518";
  // ห้องน้ำใช้สีน้ำเงิน ถังขยะใช้สีส้ม
  const Icon = type === "toilet" ? Toilet : Trash2;
  // ประกาศค่าที่ใช้ภายในขอบเขตนี้และไม่อนุญาตให้เปลี่ยนตัวแปรไปอ้างค่าใหม่
  const iconElement = document.createElement("div");
  // ประกาศค่าที่ใช้ภายในขอบเขตนี้และไม่อนุญาตให้เปลี่ยนตัวแปรไปอ้างค่าใหม่
  iconElement.style.cssText = `display:grid;place-items:center;width:38px;height:38px;border-radius:10px;background:${color};border:3px solid white;box-shadow:0 4px 12px rgba(63,56,47,.28)`;
  iconElement.innerHTML = renderToStaticMarkup(<Icon color="white" size={23} strokeWidth={2.5} />);

  return (markerIcons[type] = L.divIcon({
  // แปลง HTML ที่สร้างเป็น Leaflet divIcon สำหรับ Marker
    className: "",
    html: iconElement.outerHTML,
    iconSize: [38, 38],
    iconAnchor: [19, 38],
    popupAnchor: [0, -38],
  }));
}

const userIcon = L.divIcon({ className: "", html: '<div class="map-dot" style="width:18px;height:18px;background:#4faf6a"></div>', iconSize: [18, 18], iconAnchor: [9, 9] });
// จุดสีเขียวนี้แทนตำแหน่ง GPS ของผู้ใช้ ไม่ใช่ Place จาก Database

function FitPlaces({ places }) {
  const map = useMap();
  useEffect(() => {
    if (places.length) map.fitBounds(places.map((place) => [place.latitude, place.longitude]), { padding: [30, 30], maxZoom: 14 });
  }, [map, places]);
  return null;
}

export default function PlaceMap({ places, position, fitPlaces = false }) {
// ประกาศฟังก์ชันนี้และกำหนดขอบเขตงานตามชื่อของฟังก์ชัน
  return (
  // ส่งผลลัพธ์ออกจากฟังก์ชันและหยุดทำบรรทัดถัดไปในฟังก์ชันนี้
    <MapContainer center={position || [15.3, 100.4]} zoom={position ? 14 : 7} zoomControl={fitPlaces}>
      {fitPlaces && <FitPlaces places={places} />}
      {/* TileLayer คือภาพพื้นแผนที่จาก OpenStreetMap */}
      <TileLayer attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      {/* เมื่อมี GPS ให้เลื่อน Map และวาด Marker ของผู้ใช้ */}
      {position && <><RecenterMap center={position} /><Marker position={position} icon={userIcon}><Popup>ตำแหน่งของคุณ</Popup></Marker></>}
      {/* Marker ส่วนนี้สร้างจาก places ที่ Backend ส่งมา */}
      {places.map((place) => (
        <Marker key={place.id} position={[place.latitude, place.longitude]} icon={markerIcon(place.type)}>
          <Popup><div className="min-w-40">{place.imageUrl && <img className="mb-2 h-20 w-full rounded-lg object-cover" src={getAssetUrl(place.imageUrl)} alt={place.name} />}<strong>{place.name}</strong><p>{place.type === "toilet" ? "ห้องน้ำ" : "ถังขยะ"}</p><p>{place.address}</p>{fitPlaces && <p>สถานะ: {place.status}</p>}<Link className="font-semibold text-orange-600" to={`/places/${place.id}`}>ดูรายละเอียด</Link></div></Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
