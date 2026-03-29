/**
 * Tool data store — reads/writes from data/tools.json.
 *
 * Architecture:
 *   data/tools.json   ← single source of truth (NOT compiled into JS bundle)
 *   lib/tools/store   ← thin wrapper with in-memory cache
 *   Everything else   ← imports from here, never from data/seed/tools.ts
 *
 * Migration from seed:
 *   POST /api/admin/tools/initialize   ← run once to populate tools.json from seed
 *   After that, seed/tools.ts is dead code and can be deleted.
 *
 * Production swap:
 *   Replace read()/write() with Prisma calls — zero changes to consumers.
 */

import fs   from "fs";
import path from "path";
import type { Tool } from "@/data/schemas/tool";

const DATA_FILE = path.join(process.cwd(), "data", "tools.json");

/* ── In-memory cache ──────────────────────────────────────────────────────── */

let _cache: Tool[] | null = null;

function invalidateCache() {
  _cache = null;
}

function read(): Tool[] {
  if (_cache) return _cache;
  if (!fs.existsSync(DATA_FILE)) return [];
  try {
    _cache = JSON.parse(fs.readFileSync(DATA_FILE, "utf-8")) as Tool[];
    return _cache;
  } catch {
    console.error("[tools/store] Failed to parse tools.json");
    return [];
  }
}

function write(tools: Tool[]) {
  fs.mkdirSync(path.dirname(DATA_FILE), { recursive: true });
  fs.writeFileSync(DATA_FILE, JSON.stringify(tools, null, 2), "utf-8");
  _cache = tools;
}

/* ── Public read API ──────────────────────────────────────────────────────── */

export function getTools(): Tool[] {
  return read();
}

export function getToolBySlug(slug: string): Tool | undefined {
  return read().find(t => t.slug === slug);
}

export function countTools(): number {
  return read().length;
}

/** True after initialize() has been called (tools.json exists with ≥1 entry) */
export function isInitialized(): boolean {
  return fs.existsSync(DATA_FILE) && read().length > 0;
}

/* ── Public write API ─────────────────────────────────────────────────────── */

export function addTool(tool: Tool): void {
  const tools = read();
  if (tools.some(t => t.slug === tool.slug)) {
    throw new Error(`Tool "${tool.slug}" already exists`);
  }
  write([...tools, tool]);
}

/** Add if new, replace if slug already exists */
export function upsertTool(tool: Tool): void {
  const tools = read();
  const idx   = tools.findIndex(t => t.slug === tool.slug);
  if (idx === -1) {
    write([...tools, tool]);
  } else {
    const updated = [...tools];
    updated[idx]  = { ...tool, updatedAt: new Date().toISOString() };
    write(updated);
  }
}

export function updateTool(
  slug: string,
  updates: Partial<Omit<Tool, "slug" | "id">>
): Tool {
  const tools = read();
  const idx   = tools.findIndex(t => t.slug === slug);
  if (idx === -1) throw new Error(`Tool "${slug}" not found`);
  const updated = {
    ...tools[idx],
    ...updates,
    updatedAt: new Date().toISOString(),
  };
  const next = [...tools];
  next[idx]  = updated;
  write(next);
  return updated;
}

export function removeToolBySlug(slug: string): void {
  write(read().filter(t => t.slug !== slug));
}

/**
 * One-time migration: populate tools.json from the compiled seed array.
 * Call this once from the admin panel; after that the seed TS file is dead code.
 */
export function initializeFromSeed(seedTools: Tool[]): { count: number } {
  write(seedTools);
  console.log(`[tools/store] Initialized ${seedTools.length} tools → data/tools.json`);
  return { count: seedTools.length };
}

export { invalidateCache };
