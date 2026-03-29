/**
 * POST /api/admin/discovery/scan
 * Manually trigger a discovery scan and add results to the review queue.
 *
 * GET /api/admin/discovery/scan
 * Returns current queue stats.
 */
import { NextRequest, NextResponse } from "next/server";
import { runDiscoveryScan }         from "@/lib/discovery/scanner";
import { addDiscoveredTools, getQueueStats } from "@/lib/discovery/queue-store";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({})) as { maxResults?: number };

  const { tools, scannedAt } = runDiscoveryScan({ maxResults: body.maxResults ?? 10 });
  addDiscoveredTools(tools, scannedAt);

  return NextResponse.json({
    success: true,
    scannedAt,
    newItems: tools.length,
    items: tools.map(t => ({ id: t.id, slug: t.slug, name: t.name, source: t.source })),
  });
}

export async function GET() {
  return NextResponse.json(getQueueStats());
}
