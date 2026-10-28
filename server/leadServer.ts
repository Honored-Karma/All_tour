import http from "node:http";
import fs from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { LeadStore, leadStatuses, type LeadStatus } from "./leadStore";
import { parseLeadInput } from "../src/lib/leadPayload";

export function createLeadServer(directory = path.resolve(".data")) {
  const store = new LeadStore(directory);
  const requests = new Map<string, { count: number; reset: number }>();
  const server = http.createServer(async (request, response) => {
    response.setHeader("Cache-Control", "no-store");
    response.setHeader("X-Content-Type-Options", "nosniff");
    response.setHeader("X-Frame-Options", "DENY");
    response.setHeader("X-Robots-Tag", "noindex, nofollow");
    const reply = (status: number, value: unknown) => { response.writeHead(status, { "Content-Type": "application/json; charset=utf-8" }); response.end(JSON.stringify(value)); };
    try {
      const address = server.address();
      const port = address && typeof address === "object" ? address.port : 4311;
      const origin = `http://127.0.0.1:${port}`;
      if (request.headers.host !== `127.0.0.1:${port}`) return reply(403, { error: "Invalid host" });
      const url = new URL(request.url || "/", origin);
      const admin = url.pathname.startsWith("/api/admin/");
      if (admin && (request.headers["x-alltour-admin"] !== "1" || request.headers.origin && request.headers.origin !== origin || request.headers["sec-fetch-site"] === "cross-site")) return reply(403, { error: "Откройте локальную панель заявок." });
      const sourceOrigin = request.headers.origin;
      const permittedSource = sourceOrigin === origin || !!sourceOrigin && /^http:\/\/(?:localhost|127\.0\.0\.1):(?:300\d|3010|4173|4178)$/.test(sourceOrigin);
      if (!admin && sourceOrigin && !permittedSource) return reply(403, { error: "Origin is not permitted" });
      if (!admin && permittedSource) {
        response.setHeader("Access-Control-Allow-Origin", sourceOrigin!);
        response.setHeader("Vary", "Origin");
        response.setHeader("Access-Control-Allow-Headers", "Content-Type, Idempotency-Key");
        response.setHeader("Access-Control-Allow-Methods", "POST, GET, OPTIONS");
      }
      if (request.method === "OPTIONS") { response.writeHead(204); response.end(); return; }
      if ((url.pathname === "/admin" || url.pathname === "/") && request.method === "GET") {
        response.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
        response.end(await fs.readFile(new URL("./admin.html", import.meta.url))); return;
      }
      if (url.pathname === "/api/health" && request.method === "GET") return reply(200, { ready: true, storage: "local", service: "alltour-leads" });
      if (url.pathname === "/api/admin/leads" && request.method === "GET") {
        const status = url.searchParams.get("status") || "";
        if (status && !leadStatuses.includes(status as LeadStatus)) return reply(400, { error: "Неизвестный статус." });
        const page = Number(url.searchParams.get("page") || 0);
        if (!Number.isSafeInteger(page) || page < 0) return reply(400, { error: "Неверная страница." });
        return reply(200, store.list(status, (url.searchParams.get("q") || "").slice(0, 100), page));
      }
      const update = url.pathname.match(/^\/api\/admin\/leads\/(AT-\d{8}-[A-F0-9]{8})$/);
      const creating = url.pathname === "/api/leads" && request.method === "POST";
      if (!creating && !(update && request.method === "PATCH")) return reply(404, { error: "Не найдено." });
      if (creating && !permittedSource) return reply(403, { error: "Origin is required" });
      if (!request.headers["content-type"]?.startsWith("application/json")) return reply(415, { error: "Ожидается JSON." });
      const chunks: Buffer[] = [];
      let size = 0;
      for await (const chunk of request) {
        const buffer = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk);
        size += buffer.length;
        if (size > 32_000) return reply(413, { error: "Заявка слишком большая." });
        chunks.push(buffer);
      }
      let payload: unknown;
      try { payload = JSON.parse(Buffer.concat(chunks).toString("utf8")); } catch { return reply(400, { error: "Неверный JSON." }); }
      if (creating) {
        const key = request.headers["idempotency-key"];
        if (typeof key !== "string" || !/^[a-zA-Z0-9_-]{16,80}$/.test(key)) return reply(400, { error: "Нужен ключ повторной отправки." });
        const bucketKey = request.socket.remoteAddress || "local";
        const bucket = requests.get(bucketKey);
        if (!bucket || bucket.reset < Date.now()) requests.set(bucketKey, { count: 1, reset: Date.now() + 60_000 });
        else if (++bucket.count > 30) return reply(429, { error: "Слишком много запросов. Попробуйте через минуту." });
        const parsed = parseLeadInput(payload);
        if (!parsed.input) return reply(400, { error: parsed.errors.join("\n") });
        const result = store.create(parsed.input, key);
        return reply(result.created ? 201 : 200, { id: result.id, status: "new" });
      }
      if (!payload || typeof payload !== "object" || Array.isArray(payload)) return reply(400, { error: "Неверный формат." });
      const change = payload as Record<string, unknown>;
      if (!leadStatuses.includes(change.status as LeadStatus) || typeof change.notes !== "string" || change.notes.length > 4000 || !Number.isSafeInteger(change.version)) return reply(400, { error: "Проверьте статус и заметку." });
      if (!store.update(update![1], change.status as LeadStatus, change.notes.trim(), change.version as number)) return reply(409, { error: "Заявка уже изменена или не найдена. Обновите список." });
      return reply(200, { updated: true });
    } catch (error) {
      if (error instanceof Error && error.message === "IDEMPOTENCY_CONFLICT") return reply(409, { error: "Ключ уже использован для другой заявки." });
      console.error("Lead service request failed", error instanceof Error ? error.name : "unknown");
      if (!response.headersSent) reply(500, { error: "Не удалось сохранить заявку." }); else response.end();
    }
  });
  server.on("close", () => store.close());
  return server;
}

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  const server = createLeadServer();
  server.listen(4311, "127.0.0.1", () => console.log("Заявки ALL TOUR: http://127.0.0.1:4311/admin\nБаза: .data/leads.sqlite (только локально)."));
  for (const signal of ["SIGINT", "SIGTERM"] as const) process.on(signal, () => server.close(() => process.exit(0)));
}
