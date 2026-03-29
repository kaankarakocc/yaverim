/**
 * Revenue store — file-based (dev), Prisma-ready (prod).
 *
 * All three revenue entities live in data/ops/revenue.json.
 * Replace the read/write helpers with Prisma queries when moving to production.
 */

import fs   from "fs";
import path from "path";
import { randomUUID }  from "crypto";
import type {
  RevenueStore, Purchase, AffiliateClick, Sponsorship,
  PurchaseType, PurchaseStatus, SponsorshipTier, SponsorshipStatus,
  RevenueStats,
} from "./types";

const DATA_DIR    = path.join(process.cwd(), "data", "ops");
const STORE_FILE  = path.join(DATA_DIR, "revenue.json");

/* ─── I/O ────────────────────────────────────────────────────────────────── */

function read(): RevenueStore {
  try {
    if (!fs.existsSync(STORE_FILE)) return { purchases: [], affClicks: [], sponsorships: [] };
    return JSON.parse(fs.readFileSync(STORE_FILE, "utf-8")) as RevenueStore;
  } catch {
    return { purchases: [], affClicks: [], sponsorships: [] };
  }
}

function write(store: RevenueStore): void {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
  fs.writeFileSync(STORE_FILE, JSON.stringify(store, null, 2), "utf-8");
}

/* ─── Purchases ──────────────────────────────────────────────────────────── */

export function logPurchase(data: {
  userId:      string;
  userEmail:   string;
  type:        PurchaseType;
  amountUsd:   number;
  planId:      string;
  provider:    string;
  providerRef: string | null;
  status?:     PurchaseStatus;
}): Purchase {
  const store = read();
  const purchase: Purchase = {
    id:          randomUUID(),
    userId:      data.userId,
    userEmail:   data.userEmail,
    type:        data.type,
    status:      data.status ?? "completed",
    amountUsd:   data.amountUsd,
    currency:    "USD",
    planId:      data.planId,
    provider:    data.provider,
    providerRef: data.providerRef,
    createdAt:   new Date().toISOString(),
  };
  store.purchases.unshift(purchase);
  write(store);
  return purchase;
}

export function refundPurchase(id: string): Purchase | null {
  const store = read();
  const idx   = store.purchases.findIndex(p => p.id === id);
  if (idx === -1) return null;
  store.purchases[idx] = { ...store.purchases[idx], status: "refunded", refundedAt: new Date().toISOString() };
  write(store);
  return store.purchases[idx];
}

export function getPurchases(filter?: { userId?: string; type?: PurchaseType; status?: PurchaseStatus }): Purchase[] {
  const { purchases } = read();
  if (!filter) return purchases;
  return purchases.filter(p =>
    (!filter.userId || p.userId === filter.userId) &&
    (!filter.type   || p.type   === filter.type)   &&
    (!filter.status || p.status === filter.status)
  );
}

/* ─── Affiliate clicks ───────────────────────────────────────────────────── */

export function logAffiliateClick(data: {
  toolSlug:   string;
  toolName:   string;
  userId:     string | null;
  sourcePage: string;
  url:        string;
}): AffiliateClick {
  const store = read();
  const click: AffiliateClick = {
    id:         randomUUID(),
    ...data,
    clickedAt:  new Date().toISOString(),
  };
  store.affClicks.unshift(click);
  // Keep last 10 000 clicks to avoid unbounded growth
  if (store.affClicks.length > 10_000) store.affClicks = store.affClicks.slice(0, 10_000);
  write(store);
  return click;
}

export function getAffiliateClicks(toolSlug?: string): AffiliateClick[] {
  const { affClicks } = read();
  return toolSlug ? affClicks.filter(c => c.toolSlug === toolSlug) : affClicks;
}

/* ─── Sponsorships ───────────────────────────────────────────────────────── */

export function createSponsorship(data: {
  toolSlug:    string;
  toolName:    string;
  tier:        SponsorshipTier;
  amountUsd:   number;
  billingType: "monthly" | "one-time";
  startDate:   string;
  endDate:     string | null;
  notes:       string;
}): Sponsorship {
  const store = read();
  const s: Sponsorship = {
    id:          randomUUID(),
    status:      "active",
    ...data,
    createdAt:   new Date().toISOString(),
    updatedAt:   new Date().toISOString(),
  };
  store.sponsorships.unshift(s);
  write(store);
  return s;
}

export function updateSponsorship(id: string, data: Partial<Pick<Sponsorship, "status"|"tier"|"amountUsd"|"endDate"|"notes">>): Sponsorship | null {
  const store = read();
  const idx   = store.sponsorships.findIndex(s => s.id === id);
  if (idx === -1) return null;
  store.sponsorships[idx] = { ...store.sponsorships[idx], ...data, updatedAt: new Date().toISOString() };
  write(store);
  return store.sponsorships[idx];
}

export function deleteSponsorship(id: string): boolean {
  const store = read();
  const before = store.sponsorships.length;
  store.sponsorships = store.sponsorships.filter(s => s.id !== id);
  if (store.sponsorships.length === before) return false;
  write(store);
  return true;
}

export function getSponsorships(status?: SponsorshipStatus): Sponsorship[] {
  const { sponsorships } = read();
  return status ? sponsorships.filter(s => s.status === status) : sponsorships;
}

/* ─── Stats ──────────────────────────────────────────────────────────────── */

export function getRevenueStats(): RevenueStats {
  const store = read();
  const now   = new Date();

  // Auto-expire sponsorships
  store.sponsorships.forEach(s => {
    if (s.status === "active" && s.endDate && new Date(s.endDate) < now) {
      s.status = "expired";
    }
  });

  const completedPurchases = store.purchases.filter(p => p.status === "completed");
  const purchaseRevenue    = completedPurchases.reduce((sum, p) => sum + p.amountUsd, 0);
  const activeSubs         = completedPurchases.filter(p => p.type === "subscription").length;
  const oneTimePurchases   = completedPurchases.filter(p => p.type === "one-time").length;

  const activeSponsorships = store.sponsorships.filter(s => s.status === "active");
  const sponsorshipRevenue = activeSponsorships.reduce((sum, s) => sum + s.amountUsd, 0);

  // Top clicked tools
  const clicksByTool: Record<string, { name: string; clicks: number }> = {};
  store.affClicks.forEach(c => {
    if (!clicksByTool[c.toolSlug]) clicksByTool[c.toolSlug] = { name: c.toolName, clicks: 0 };
    clicksByTool[c.toolSlug].clicks++;
  });
  const topClickedTools = Object.entries(clicksByTool)
    .map(([slug, v]) => ({ slug, name: v.name, clicks: v.clicks }))
    .sort((a, b) => b.clicks - a.clicks)
    .slice(0, 10);

  // MRR: monthly subscriptions + monthly sponsorships
  const subMrr = completedPurchases.filter(p => p.type === "subscription").length * 9; // $9/mo
  const spMrr  = activeSponsorships.filter(s => s.billingType === "monthly").reduce((sum, s) => sum + s.amountUsd, 0);

  return {
    totalRevenueUsd:    purchaseRevenue + sponsorshipRevenue,
    purchaseRevenue,
    sponsorshipRevenue,
    totalPurchases:     completedPurchases.length,
    activeSubscriptions: activeSubs,
    oneTimePurchases,
    totalAffClicks:     store.affClicks.length,
    topClickedTools,
    activeSponsorships:  activeSponsorships.length,
    monthlyRecurring:   subMrr + spMrr,
    recentPurchases:    store.purchases.slice(0, 20),
  };
}
