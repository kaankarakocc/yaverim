/**
 * localStorage-based analysis store (client-side only).
 *
 * Persists analyses in the user's browser.
 * Works without a server or database.
 *
 * Storage limit: ~5MB per origin (enough for 100+ analyses).
 *
 * Sprint 4+: replace with server-side calls to Prisma when DB is available.
 * The AnalysisStore interface is identical so the swap is transparent.
 */

import type { SavedAnalysis, AnalysisStore } from "./types";

const STORAGE_KEY = "yaverim:analyses";

/* ─── Helpers ────────────────────────────────────────────────────────────── */

function readAll(): SavedAnalysis[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as SavedAnalysis[]) : [];
  } catch {
    return [];
  }
}

function writeAll(items: SavedAnalysis[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {
    // Storage full — silently fail
  }
}

function generateId(): string {
  return `ana_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
}

/* ─── Store implementation ───────────────────────────────────────────────── */

export const localAnalysisStore: AnalysisStore = {
  async save(draft) {
    const all = readAll();
    const record: SavedAnalysis = {
      ...draft,
      id:        generateId(),
      createdAt: new Date().toISOString(),
    };
    // Keep max 50 analyses, newest first
    const updated = [record, ...all].slice(0, 50);
    writeAll(updated);
    return record;
  },

  async get(id) {
    return readAll().find((a) => a.id === id) ?? null;
  },

  async list() {
    return readAll().sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  },

  async remove(id) {
    writeAll(readAll().filter((a) => a.id !== id));
  },

  async toggleFavorite(id) {
    const all = readAll();
    const idx = all.findIndex((a) => a.id === id);
    if (idx === -1) return null;
    all[idx] = { ...all[idx], isFavorite: !all[idx].isFavorite };
    writeAll(all);
    return all[idx];
  },

  async updateNote(id, note) {
    const all = readAll();
    const idx = all.findIndex((a) => a.id === id);
    if (idx === -1) return null;
    all[idx] = { ...all[idx], note };
    writeAll(all);
    return all[idx];
  },

  async markPremiumUnlocked(id) {
    const all = readAll();
    const idx = all.findIndex((a) => a.id === id);
    if (idx !== -1) {
      all[idx] = { ...all[idx], isPremiumUnlocked: true };
      writeAll(all);
    }
  },
};
