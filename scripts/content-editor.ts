import http from "node:http";
import fs from "node:fs/promises";
import path from "node:path";
import { createHash, randomUUID } from "node:crypto";
import { tours } from "../src/data/tours";
import { validateDepartureRecords } from "../src/lib/departureValidation";

const file = path.resolve("src/data/departures.json");
const origin = "http://127.0.0.1:4310";
const revision = (content: string) => createHash("sha256").update(content).digest("hex");
const knownTours = new Set(tours.map((tour) => tour.id));
let saving = false;
const server = http.createServer(async (request, response) => {
  response.setHeader("Cache-Control", "no-store");
  response.setHeader("X-Content-Type-Options", "nosniff");
  response.setHeader("X-Frame-Options", "DENY");
  const reply = (status: number, value: unknown) => { response.writeHead(status, { "Content-Type": "application/json; charset=utf-8" }); response.end(JSON.stringify(value)); };
  try {
    if (request.headers.host !== "127.0.0.1:4310") return reply(403, { error: "Откройте редактор по локальному адресу." });
    if (request.url === "/" && request.method === "GET") {
      response.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
      response.end(await fs.readFile(new URL("./content-editor.html", import.meta.url))); return;
    }
    if (request.url !== "/content") return reply(404, { error: "Не найдено." });
    if (request.method === "GET") {
      const content = await fs.readFile(file, "utf8");
      return reply(200, { records: JSON.parse(content), revision: revision(content), tours: tours.map((tour) => ({ id: tour.id, title: tour.title.ru })) });
    }
    if (request.method !== "PUT") return reply(405, { error: "Метод не поддерживается." });
    if (request.headers.origin !== origin || request.headers["x-alltour-editor"] !== "1" || !request.headers["content-type"]?.startsWith("application/json")) return reply(403, { error: "Запрос должен поступить из локального редактора." });
    if (saving) return reply(409, { error: "Другая запись ещё сохраняется. Повторите сохранение." });
    saving = true;
    try {
      let body = "";
      for await (const chunk of request) {
        body += chunk.toString();
        if (Buffer.byteLength(body) > 128_000) return reply(413, { error: "Список слишком большой." });
      }
      let payload: { records?: unknown; revision?: unknown };
      try { payload = JSON.parse(body); } catch { return reply(400, { error: "Неверный JSON." }); }
      if (!payload || typeof payload !== "object") return reply(400, { error: "Неверный формат." });
      const current = await fs.readFile(file, "utf8");
      if (payload.revision !== revision(current)) return reply(409, { error: "Данные изменены в другом окне. Перезагрузите страницу перед сохранением." });
      const validation = validateDepartureRecords(payload.records, knownTours);
      if (validation.errors.length) return reply(400, { error: validation.errors.join("\n") });
      const backup = path.resolve(".cache/content-backups");
      await fs.mkdir(backup, { recursive: true });
      await fs.writeFile(path.join(backup, `${Date.now()}-${randomUUID()}.json`), current, { flag: "wx" });
      const next = JSON.stringify(validation.records, null, 2) + "\n";
      const temporary = `${file}.${randomUUID()}.tmp`;
      try { await fs.writeFile(temporary, next, { flag: "wx" }); await fs.rename(temporary, file); }
      finally { await fs.rm(temporary, { force: true }); }
      return reply(200, { revision: revision(next) });
    } finally { saving = false; }
  } catch (error) { console.error("Content editor:", error); reply(500, { error: "Не удалось прочитать или сохранить файл. Проверьте терминал." }); }
});
server.listen(4310, "127.0.0.1", () => console.log(`Редактор выездов: ${origin}\nСохраняет только локальный JSON. Для публикации нужна новая сборка сайта.`));
