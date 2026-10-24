// Synthetic locations for map demos only; these are not verified facilities or province boundaries.
export const CENTRAL_PROVINCES = [
  [
    "กรุงเทพมหานคร",
    13.7563,
    100.5018,
    0.22,
    0.3
  ],
  [
    "สมุทรปราการ",
    13.5991,
    100.5998,
    0.1,
    0.25
  ],
  [
    "นนทบุรี",
    13.8621,
    100.5144,
    0.14,
    0.18
  ],
  [
    "ปทุมธานี",
    14.0208,
    100.525,
    0.17,
    0.3
  ],
  [
    "พระนครศรีอยุธยา",
    14.3532,
    100.5689,
    0.26,
    0.3
  ],
  [
    "อ่างทอง",
    14.5896,
    100.4551,
    0.17,
    0.18
  ],
  [
    "ลพบุรี",
    14.7995,
    100.6534,
    0.4,
    0.5
  ],
  [
    "สิงห์บุรี",
    14.8936,
    100.3967,
    0.18,
    0.17
  ],
  [
    "ชัยนาท",
    15.1852,
    100.1251,
    0.23,
    0.25
  ],
  [
    "สระบุรี",
    14.5289,
    100.9101,
    0.28,
    0.27
  ],
  [
    "นครสวรรค์",
    15.703,
    100.1372,
    0.5,
    0.55
  ],
  [
    "อุทัยธานี",
    15.3794,
    100.0246,
    0.25,
    0.35
  ],
  [
    "กำแพงเพชร",
    16.4828,
    99.5227,
    0.4,
    0.4
  ],
  [
    "สุโขทัย",
    17.0078,
    99.823,
    0.4,
    0.3
  ],
  [
    "พิษณุโลก",
    16.8211,
    100.2659,
    0.4,
    0.45
  ],
  [
    "พิจิตร",
    16.4429,
    100.3488,
    0.3,
    0.3
  ],
  [
    "เพชรบูรณ์",
    16.4189,
    101.1591,
    0.65,
    0.25
  ],
  [
    "สุพรรณบุรี",
    14.4745,
    100.1177,
    0.38,
    0.3
  ],
  [
    "นครปฐม",
    13.8199,
    100.0622,
    0.25,
    0.28
  ],
  [
    "สมุทรสาคร",
    13.5475,
    100.2744,
    0.07,
    0.2
  ],
  [
    "สมุทรสงคราม",
    13.4098,
    100.0023,
    0.06,
    0.1
  ],
  [
    "นครนายก",
    14.2069,
    101.2131,
    0.2,
    0.28
  ]
];

export function buildCentralDemoPlaces() {
  return CENTRAL_PROVINCES.flatMap(([province, lat, lng, latSpan, lngSpan]) => {
    const points = [];
    // Broad regional coverage plus a denser grid around each provincial centre.
    for (let row = -4; row <= 4; row++) {
      for (let col = -4; col <= 4; col++) {
        if (row * row + col * col > 16 || (row === 0 && col === 0)) continue;
        points.push(['พื้นที่รอบเมือง', row, col, lat + row * latSpan / 4, lng + col * lngSpan / 4]);
      }
    }
    for (let row = -2; row <= 2; row++) {
      for (let col = -2; col <= 2; col++) {
        points.push(['ย่านใจกลางเมือง', row, col, lat + row * .006, lng + col * .006]);
      }
    }
    return points.flatMap(([area, row, col, latitude, longitude]) =>
      ['toilet', 'trash'].map((type) => ({
        name: '[Demo Central] ' + (type === 'toilet' ? 'ห้องน้ำ' : 'ถังขยะ') + ' ' + province + ' ' + area + ' ' + (row + 5) + '-' + (col + 5),
        type,
        address: 'ข้อมูลจำลอง ' + area + ' จังหวัด' + province + ' (พิกัดโดยประมาณ ไม่ใช่สถานที่จริง)',
        latitude: Number((latitude + (type === 'trash' ? .0015 : 0)).toFixed(6)),
        longitude: Number((longitude + (type === 'trash' ? .0015 : 0)).toFixed(6)),
        status: 'active',
      }))
    );
  });
}

// Batch writes keep startup fast. Existing rows retain admin edits on subsequent runs.
export async function seedCentralDemoPlaces(prisma, createdById) {
  const places = buildCentralDemoPlaces();
  let created = 0;
  for (let start = 0; start < places.length; start += 400) {
    const batch = places.slice(start, start + 400);
    const existing = await prisma.place.findMany({
      where: { name: { in: batch.map((place) => place.name) } },
      select: { name: true },
    });
    const names = new Set(existing.map((place) => place.name));
    const data = batch.filter((place) => !names.has(place.name)).map((place) => ({ ...place, createdById }));
    if (data.length) created += (await prisma.place.createMany({ data })).count;
  }
  return { total: places.length, created };
}
