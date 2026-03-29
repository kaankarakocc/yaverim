/**
 * GET    /api/admin/revenue/sponsorships   — list all sponsorships
 * POST   /api/admin/revenue/sponsorships   — create new sponsorship
 * PATCH  /api/admin/revenue/sponsorships   — update (body: { id, ...fields })
 * DELETE /api/admin/revenue/sponsorships?id=xxx — delete
 */
import { NextRequest, NextResponse }     from "next/server";
import {
  getSponsorships, createSponsorship,
  updateSponsorship, deleteSponsorship,
} from "@/lib/revenue/store";
import type { SponsorshipTier, SponsorshipStatus } from "@/lib/revenue/types";

export async function GET() {
  return NextResponse.json({ sponsorships: getSponsorships() });
}

export async function POST(req: NextRequest) {
  const body = await req.json() as {
    toolSlug: string; toolName: string; tier: SponsorshipTier;
    amountUsd: number; billingType: "monthly"|"one-time";
    startDate: string; endDate: string|null; notes: string;
  };

  if (!body.toolSlug || !body.toolName) {
    return NextResponse.json({ error: "toolSlug and toolName required" }, { status: 400 });
  }

  const s = createSponsorship(body);
  return NextResponse.json({ success: true, sponsorship: s });
}

export async function PATCH(req: NextRequest) {
  const body = await req.json() as {
    id: string;
    status?: SponsorshipStatus;
    tier?: SponsorshipTier;
    amountUsd?: number;
    endDate?: string | null;
    notes?: string;
  };

  if (!body.id) return NextResponse.json({ error: "id required" }, { status: 400 });

  const updated = updateSponsorship(body.id, body);
  if (!updated) return NextResponse.json({ error: "not found" }, { status: 404 });

  return NextResponse.json({ success: true, sponsorship: updated });
}

export async function DELETE(req: NextRequest) {
  const id = req.nextUrl.searchParams.get("id");
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });

  const ok = deleteSponsorship(id);
  if (!ok) return NextResponse.json({ error: "not found" }, { status: 404 });

  return NextResponse.json({ success: true });
}
