import assert from 'node:assert/strict';
import test from 'node:test';
import { CENTRAL_PROVINCES, buildCentralDemoPlaces, seedCentralDemoPlaces } from '../prisma/centralDemoPlaces.js';

test('regional demo has distinct, repeatable markers of both types across 22 provinces', () => {
  const places = buildCentralDemoPlaces();
  assert.equal(CENTRAL_PROVINCES.length, 22);
  assert.equal(places.length, 3212);
  assert.equal(new Set(places.map(p => p.name)).size, places.length);
  assert.equal(new Set(places.map(p => [p.latitude, p.longitude].join(','))).size, places.length);
  assert.deepEqual(places, buildCentralDemoPlaces());
  for (const [province] of CENTRAL_PROVINCES) {
    for (const type of ['toilet', 'trash']) {
      assert.equal(places.filter(p => p.name.includes(province + ' ') && p.type === type && p.status === 'active').length, 73);
    }
  }
  for (const place of places) {
    assert.ok(place.latitude > 13 && place.latitude < 18);
    assert.ok(place.longitude > 99 && place.longitude < 102);
    assert.match(place.address, /ข้อมูลจำลอง/);
  }
});

test('batch seeding preserves existing admin changes and does not duplicate records', async () => {
  const stored = [];
  const prisma = { place: {
    findMany: async ({ where }) => stored.filter(p => where.name.in.includes(p.name)),
    createMany: async ({ data }) => { stored.push(...data); return { count: data.length }; },
  } };
  assert.deepEqual(await seedCentralDemoPlaces(prisma, 42), { total: 3212, created: 3212 });
  stored[0].status = 'inactive';
  assert.deepEqual(await seedCentralDemoPlaces(prisma, 42), { total: 3212, created: 0 });
  assert.equal(stored[0].status, 'inactive');
  assert.ok(stored.every(p => p.createdById === 42));
});
