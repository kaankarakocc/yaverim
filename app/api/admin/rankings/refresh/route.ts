/**
 * POST /api/admin/rankings/refresh
 *
 * Triggers a full recomputation of all rankings and busts the in-process
 * cache so subsequent page renders use the fresh data.
 *
 * In production this would:
 *  1. Recompute all RankingSnapshot objects via the engine
 *  2. Upsert them into the Prisma Ranking / RankingEntry tables
 *  3. Optionally write JSON snapshots to /data/rankings/ for CDN caching
 *
 * Today (no live DB): busts the in-process cache so the engine recomputes
 * from the latest seed tool data on next request.
 *
 * Security: only reachable in development or with ADMIN_SECRET header.
 */

import { NextRequest, NextResponse } from "next/server";
import { bustRankingCache, getOverallCards, getHiddenGemCards, getAllCategories, getLastComputedAt } from "@/lib/ranking/service";

export async function POST(req: NextRequest) {
  /* ── Auth guard ── */
  const adminSecret = process.env.ADMIN_SECRET;
  if (adminSecret) {
    const provided = req.headers.get("x-admin-secret");
    if (provided !== adminSecret) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  } else if (process.env.NODE_ENV === "production") {
    return NextResponse.json(
      { error: "ADMIN_SECRET must be set in production" },
      { status: 500 }
    );
  }

  /* ── Recompute ── */
  bustRankingCache();

  // Force re-evaluation by calling the service once
  const weekly  = getOverallCards("weekly");
  const monthly = getOverallCards("monthly");
  const yearly  = getOverallCards("yearly");
  const gems    = getHiddenGemCards();
  const cats    = getAllCategories();

  return NextResponse.json({
    success: true,
    message: "Sıralamaları yeniden hesaplandı.",
    generatedAt: getLastComputedAt(),
    summary: {
      weeklyCount:    weekly.length,
      monthlyCount:   monthly.length,
      yearlyCount:    yearly.length,
      hiddenGemsCount: gems.length,
      categoriesCount: cats.length,
    },
  });
}

/** GET: returns current ranking stats (no auth required) */
export async function GET() {
  const weekly  = getOverallCards("weekly");
  const gems    = getHiddenGemCards();
  const cats    = getAllCategories();

  return NextResponse.json({
    lastComputedAt:  getLastComputedAt(),
    weeklyTop3:      weekly.slice(0, 3).map((t) => ({ slug: t.slug, name: t.name, score: t.compositeScore })),
    hiddenGemsCount: gems.length,
    categoriesCount: cats.length,
  });
}
