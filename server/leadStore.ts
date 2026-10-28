import { DatabaseSync } from "node:sqlite";
import fs from "node:fs";
import path from "node:path";
import { createHash, randomUUID } from "node:crypto";
import type { LeadInput } from "../src/lib/leadPayload";
import { localToday } from "../src/lib/departures";

export const leadStatuses = ["new", "contacted", "proposal", "confirmed", "closed"] as const;
export type LeadStatus = typeof leadStatuses[number];
export interface LeadRecord { id: string; created_at: string; updated_at: string; status: LeadStatus; notes: string; version: number; input: LeadInput }
interface Row { id: string; created_at: string; updated_at: string; status: LeadStatus; notes: string; version: number; payload_json: string; payload_hash: string }

export class LeadStore {
  private db: DatabaseSync;
  constructor(directory: string) {
    fs.mkdirSync(directory, { recursive: true });
    this.db = new DatabaseSync(path.join(directory, "leads.sqlite"));
    this.db.exec(`PRAGMA journal_mode=WAL; PRAGMA busy_timeout=5000;
      CREATE TABLE IF NOT EXISTS leads (
        id TEXT PRIMARY KEY, idempotency_key TEXT NOT NULL UNIQUE, payload_hash TEXT NOT NULL,
        created_at TEXT NOT NULL, updated_at TEXT NOT NULL,
        status TEXT NOT NULL DEFAULT 'new' CHECK(status IN ('new','contacted','proposal','confirmed','closed')),
        notes TEXT NOT NULL DEFAULT '', version INTEGER NOT NULL DEFAULT 0, payload_json TEXT NOT NULL
      ); CREATE INDEX IF NOT EXISTS leads_status_created ON leads(status,created_at);`);
  }
  create(input: LeadInput, key: string): { id: string; created: boolean } {
    const json = JSON.stringify(input);
    const hash = createHash("sha256").update(json).digest("hex");
    const existing = this.db.prepare("SELECT id,payload_hash FROM leads WHERE idempotency_key=?").get(key) as { id: string; payload_hash: string } | undefined;
    if (existing) {
      if (existing.payload_hash !== hash) throw new Error("IDEMPOTENCY_CONFLICT");
      return { id: existing.id, created: false };
    }
    const now = new Date().toISOString();
    const id = `AT-${localToday().replaceAll("-", "")}-${randomUUID().slice(0, 8).toUpperCase()}`;
    this.db.prepare("INSERT INTO leads(id,idempotency_key,payload_hash,created_at,updated_at,payload_json) VALUES(?,?,?,?,?,?)").run(id, key, hash, now, now, json);
    return { id, created: true };
  }
  private record(row: Row): LeadRecord { const { payload_json, payload_hash: _, ...record } = row; return { ...record, input: JSON.parse(payload_json) }; }
  list(status = "", query = "", page = 0): { records: LeadRecord[]; total: number } {
    const where = "(?='' OR status=?) AND (?='' OR payload_json LIKE ? OR id LIKE ?)";
    const values = [status, status, query, `%${query}%`, `%${query}%`];
    const total = this.db.prepare(`SELECT COUNT(*) AS total FROM leads WHERE ${where}`).get(...values) as { total: number };
    const rows = this.db.prepare(`SELECT id,created_at,updated_at,status,notes,version,payload_json,payload_hash FROM leads WHERE ${where} ORDER BY created_at DESC,id DESC LIMIT 50 OFFSET ?`).all(...values, page * 50) as unknown as Row[];
    return { records: rows.map((row) => this.record(row)), total: total.total };
  }
  update(id: string, status: LeadStatus, notes: string, version: number): boolean {
    const result = this.db.prepare("UPDATE leads SET status=?,notes=?,updated_at=?,version=version+1 WHERE id=? AND version=?").run(status, notes, new Date().toISOString(), id, version);
    return Number(result.changes) === 1;
  }
  close() { this.db.close(); }
}
