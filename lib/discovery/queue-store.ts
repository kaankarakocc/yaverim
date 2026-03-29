/**
 * Discovery queue store — file-based today, DB-ready tomorrow.
 *
 * Stores discovered tool candidates in data/ops/discovery-queue.json.
 * When Prisma is live, replace file operations with Prisma queries on a
 * new DiscoveryQueue table — the function signatures stay the same.
 */

import fs   from "fs";
import path from "path";
import type { DiscoveredTool, DiscoveryQueueStore, ReviewStatus, StoredAnalysis } from "./types";
import type { ToolAnalysisReport } from "@/lib/ai-analyst/types";

const DATA_DIR     = path.join(process.cwd(), "data", "ops");
const QUEUE_FILE   = path.join(DATA_DIR, "discovery-queue.json");
const REPORTS_FILE = path.join(DATA_DIR, "analysis-reports.json");

/* ─── I/O ────────────────────────────────────────────────────────────────── */

function readStore(): DiscoveryQueueStore {
  try {
    if (!fs.existsSync(QUEUE_FILE)) return { lastScanAt: "", totalScanned: 0, items: [] };
    return JSON.parse(fs.readFileSync(QUEUE_FILE, "utf-8")) as DiscoveryQueueStore;
  } catch {
    return { lastScanAt: "", totalScanned: 0, items: [] };
  }
}

function writeStore(store: DiscoveryQueueStore): void {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
  fs.writeFileSync(QUEUE_FILE, JSON.stringify(store, null, 2), "utf-8");
}

/* ─── Read ───────────────────────────────────────────────────────────────── */

export function getAllItems(): DiscoveredTool[] {
  return readStore().items;
}

export function getPendingItems(): DiscoveredTool[] {
  return readStore().items.filter(i => i.status === "pending");
}

export function getItemById(id: string): DiscoveredTool | null {
  return readStore().items.find(i => i.id === id) ?? null;
}

export function getQueueStats() {
  const store = readStore();
  const pending  = store.items.filter(i => i.status === "pending").length;
  const approved = store.items.filter(i => i.status === "approved").length;
  const rejected = store.items.filter(i => i.status === "rejected").length;
  const needsInfo = store.items.filter(i => i.status === "needs-info").length;
  return { pending, approved, rejected, needsInfo, lastScanAt: store.lastScanAt, totalScanned: store.totalScanned };
}

/* ─── Write ──────────────────────────────────────────────────────────────── */

export function addDiscoveredTools(tools: DiscoveredTool[], scanAt: string): void {
  const store = readStore();

  // Deduplicate by slug — don't add if already in queue
  const existingSlugs = new Set(store.items.map(i => i.slug));
  const newItems = tools.filter(t => !existingSlugs.has(t.slug));

  store.items = [...newItems, ...store.items]; // newest first
  store.lastScanAt = scanAt;
  store.totalScanned += tools.length;
  writeStore(store);
}

export function updateStatus(id: string, status: ReviewStatus, note?: string): DiscoveredTool | null {
  const store = readStore();
  const idx = store.items.findIndex(i => i.id === id);
  if (idx === -1) return null;
  store.items[idx] = { ...store.items[idx], status, reviewedAt: new Date().toISOString(), reviewNote: note };
  writeStore(store);
  return store.items[idx];
}

export function updateEnriched(id: string, enriched: DiscoveredTool["enriched"]): DiscoveredTool | null {
  const store = readStore();
  const idx = store.items.findIndex(i => i.id === id);
  if (idx === -1) return null;
  store.items[idx] = { ...store.items[idx], enriched: { ...store.items[idx].enriched, ...enriched } };
  writeStore(store);
  return store.items[idx];
}

export function deleteItem(id: string): boolean {
  const store = readStore();
  const before = store.items.length;
  store.items = store.items.filter(i => i.id !== id);
  if (store.items.length === before) return false;
  writeStore(store);
  return true;
}

/* ─── Analysis reports ───────────────────────────────────────────────────── */

function readReports(): StoredAnalysis[] {
  try {
    if (!fs.existsSync(REPORTS_FILE)) return [];
    return JSON.parse(fs.readFileSync(REPORTS_FILE, "utf-8")) as StoredAnalysis[];
  } catch {
    return [];
  }
}

function writeReports(reports: StoredAnalysis[]): void {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
  fs.writeFileSync(REPORTS_FILE, JSON.stringify(reports, null, 2), "utf-8");
}

export function saveAnalysisReport(report: ToolAnalysisReport): void {
  const reports = readReports();
  const idx = reports.findIndex(r => r.toolId === report.toolId);
  const entry: StoredAnalysis = { toolId: report.toolId, report, createdAt: new Date().toISOString() };
  if (idx >= 0) {
    reports[idx] = entry;
  } else {
    reports.unshift(entry);
  }
  writeReports(reports);
}

export function getAnalysisReport(toolId: string): ToolAnalysisReport | null {
  return readReports().find(r => r.toolId === toolId)?.report ?? null;
}

export function getAllAnalysisReports(): StoredAnalysis[] {
  return readReports();
}
