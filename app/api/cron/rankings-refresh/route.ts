/**
 * GET /api/cron/rankings-refresh
 *
 * Called automatically by Vercel Cron every Monday at 03:00 UTC.
 * Schedule defined in vercel.json: "0 3 * * 1"
 *
 * What it does:
 *   1. Busts the in-process ranking cache
 *   2. Re-computes all weekly / monthly / yearly / category / hidden-gem rankings
 *   3. Returns a summary for logging
 *
 * When Prisma DB is live:
 *   - Rankings will be written to Ranking + RankingEntry tables
 *   - This endpoint becomes the authoritative weekly update trigger
 *
 * Security: Vercel validates CRON_SECRET automatically via Authorization header.
 * Set CRON_SECRET in your Vercel environment variables.
 */

import { NextRequest, NextResponse } from "next/server";
import {
  bustRankingCache,
  getOverallCards,
  getHiddenGemCards,
  getAllCategories,
  getLastComputedAt,
} from "@/lib/ranking/service";

export const dynamic = "force-dynamic";
export const maxDuration = 30;

export async function GET(req: NextRequest) {
  /* ── Vercel Cron auth (production) ── */
  const authHeader = req.headers.get("authorization");
  if (
    process.env.NODE_ENV === "production" &&
    process.env.CRON_SECRET &&
    authHeader !== `Bearer ${process.env.CRON_SECRET}`
  ) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const start = Date.now();

  /* ── Recompute ── */
  bustRankingCache();

  const weekly    = getOverallCards("weekly");
  const monthly   = getOverallCards("monthly");
  const yearly    = getOverallCards("yearly");
  const gems      = getHiddenGemCards();
  const cats      = getAllCategories();

  const elapsed = Date.now() - start;

  console.log(
    `[cron] Rankings refreshed — ${weekly.length} weekly, ${gems.length} hidden gems, ${cats.length} categories — ${elapsed}ms`
  );

  return NextResponse.json({
    success:     true,
    generatedAt: getLastComputedAt(),
    elapsed_ms:  elapsed,
    summary: {
      weekly:     weekly.length,
      monthly:    monthly.length,
      yearly:     yearly.length,
      hiddenGems: gems.length,
      categories: cats.length,
    },
  });
}
