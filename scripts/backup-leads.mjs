import fs from "node:fs";
import path from "node:path";
import { DatabaseSync } from "node:sqlite";

const directory = path.resolve(".data");
const source = path.join(directory, "leads.sqlite");
if (!fs.existsSync(source)) throw new Error("База ещё не создана. Сначала запустите npm run leads.");
const output = path.join(directory, "backups");
fs.mkdirSync(output, { recursive: true });
const target = path.join(output, `leads-${new Date().toISOString().replaceAll(/[:.]/g, "-")}.sqlite`);
const database = new DatabaseSync(source);
try {
  database.exec("PRAGMA busy_timeout=5000");
  database.prepare("VACUUM INTO ?").run(target);
  console.log(`Согласованная копия базы: ${target}`);
} finally { database.close(); }
