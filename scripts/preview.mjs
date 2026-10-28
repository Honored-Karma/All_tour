import http from "node:http";
import fs from "node:fs/promises";
import path from "node:path";
import { parseArgs } from "node:util";

const { values } = parseArgs({ options: { port: { type: "string", default: "4173" }, host: { type: "string", default: "127.0.0.1" } } });
const root = path.resolve("dist");
const types = { ".html": "text/html; charset=utf-8", ".js": "text/javascript; charset=utf-8", ".css": "text/css; charset=utf-8", ".webp": "image/webp", ".jpg": "image/jpeg", ".png": "image/png", ".svg": "image/svg+xml", ".woff2": "font/woff2", ".xml": "application/xml; charset=utf-8", ".txt": "text/plain; charset=utf-8", ".json": "application/json" };
const server = http.createServer(async (request, response) => {
  if (request.method !== "GET" && request.method !== "HEAD") { response.writeHead(405); response.end(); return; }
  try {
    const url = new URL(request.url || "/", "http://preview.local");
    const relative = decodeURIComponent(url.pathname).replace(/^\/+/, "");
    const localized = url.searchParams.get("lang") === "kz" && !path.extname(relative);
    let file = path.resolve(root, localized ? "_localized/kz" : "", relative);
    if (file !== root && !file.startsWith(root + path.sep)) { response.writeHead(400); response.end(); return; }
    const info = await fs.stat(file).catch(() => null);
    if (info?.isDirectory()) file = path.join(file, "index.html");
    let body = await fs.readFile(file).catch(() => null);
    const status = body ? 200 : 404;
    if (!body) { file = path.join(root, localized ? "_localized/kz" : "", "404.html"); body = await fs.readFile(file); }
    response.writeHead(status, { "Content-Type": types[path.extname(file)] || "application/octet-stream", "Cache-Control": "no-store", "X-Content-Type-Options": "nosniff" });
    response.end(request.method === "HEAD" ? undefined : body);
  } catch { response.writeHead(500); response.end("Preview could not read the build. Run npm run build first."); }
});
server.listen(Number(values.port), values.host, () => console.log(`ALL TOUR preview: http://${values.host}:${values.port}`));
