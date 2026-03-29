/**
 * GET /api/cron/discovery
 * Vercel Cron — runs daily at 08:00 UTC.
 * Runs a discovery scan and adds results to the review queue.
 *
 * Secured via CRON_SECRET env var (set in Vercel dashboard).
 */
import { NextRequest, NextResponse } from "next/server";
import { runDiscoveryScan }          from "@/lib/discovery/scanner";
import { addDiscoveredTools }        from "@/lib/discovery/queue-store";

export async function GET(req: NextRequest) {
  // Vercel Cron sends the secret via Authorization header
  const authHeader = req.headers.get("authorization");
  const secret = process.env.CRON_SECRET;

  if (secret && authHeader !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { tools, scannedAt } = runDiscoveryScan({ maxResults: 8 });
  addDiscoveredTools(tools, scannedAt);

  return NextResponse.json({
    ok: true,
    scannedAt,
    newCandidates: tools.length,
  });
}
