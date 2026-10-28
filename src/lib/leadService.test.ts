import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs/promises";
import path from "node:path";
import { randomUUID } from "node:crypto";
import type http from "node:http";
import { createLeadServer } from "../../server/leadServer";

const listen = (server: http.Server) => new Promise<string>((resolve) => server.listen(0, "127.0.0.1", () => {
  const address = server.address() as { port: number };
  resolve(`http://127.0.0.1:${address.port}`);
}));
const close = (server: http.Server) => new Promise<void>((resolve, reject) => server.close((error) => error ? reject(error) : resolve()));

test("local lead API validates, persists, deduplicates and protects manager updates", async () => {
  const cache = path.resolve(".cache");
  const directory = path.join(cache, `lead-tests-${randomUUID()}`);
  let server = createLeadServer(directory);
  let origin = await listen(server);
  const key = randomUUID();
  const payload = { name: "Тестовая заявка", contact: "+7 700 000 00 00", mode: "tour", destinationId: "china", tourId: "china-content-3d", desiredDate: "Ноябрь", travelersCount: 2, comment: "Проверка сохранения", locale: "ru", attribution: { utm_source: "instagram", utm_medium: "social", utm_campaign: "autumn_2026", email: "ignored@example.invalid" } };
  const submit = (body: unknown, source = origin) => fetch(origin + "/api/leads", { method: "POST", headers: { "Content-Type": "application/json", "Idempotency-Key": key, Origin: source }, body: JSON.stringify(body) });
  const admin = () => fetch(origin + "/api/admin/leads", { headers: { "X-Alltour-Admin": "1", Origin: origin } });
  try {
    assert.equal((await submit({ ...payload, contact: "" })).status, 400);
    assert.equal((await submit(payload, "https://unrelated.invalid")).status, 403);
    const first = await submit(payload);
    assert.equal(first.status, 201);
    const result = await first.json() as { id: string };
    assert.match(result.id, /^AT-\d{8}-[A-F0-9]{8}$/);
    const duplicate = await submit(payload);
    assert.equal(duplicate.status, 200);
    assert.equal((await duplicate.json()).id, result.id);
    assert.equal((await submit({ ...payload, name: "Другая заявка" })).status, 409);
    assert.equal((await fetch(origin + "/api/admin/leads")).status, 403);
    const list = await admin();
    assert.match(list.headers.get("cache-control")!, /no-store/);
    const entries = await list.json() as { total: number; records: { input: { name: string; tourTitle: string; attribution: Record<string, string> }; version: number }[] };
    assert.equal(entries.total, 1);
    assert.equal(entries.records[0].input.name, payload.name);
    assert.equal(entries.records[0].input.tourTitle, "Инин (Кульджа) — 3 дня");
    assert.deepEqual(entries.records[0].input.attribution, { utm_source: "instagram", utm_medium: "social", utm_campaign: "autumn_2026" });
    const update = () => fetch(origin + "/api/admin/leads/" + result.id, { method: "PATCH", headers: { "X-Alltour-Admin": "1", "Content-Type": "application/json", Origin: origin }, body: JSON.stringify({ status: "contacted", notes: "Связались с клиентом", version: 0 }) });
    assert.equal((await update()).status, 200);
    assert.equal((await update()).status, 409, "A stale manager view cannot overwrite newer notes");
    assert.equal((await fetch(origin + "/.data/leads.sqlite")).status, 404);
    await close(server);
    server = createLeadServer(directory);
    origin = await listen(server);
    const restored = await (await admin()).json() as { total: number; records: { status: string; notes: string }[] };
    assert.equal(restored.total, 1);
    assert.equal(restored.records[0].status, "contacted");
    assert.equal(restored.records[0].notes, "Связались с клиентом");
  } finally {
    await close(server);
    const target = path.resolve(directory);
    if (!target.startsWith(cache + path.sep) || !path.basename(target).startsWith("lead-tests-")) throw new Error("Unsafe test cleanup path");
    await fs.rm(target, { recursive: true, force: true, maxRetries: 3, retryDelay: 100 });
  }
});
