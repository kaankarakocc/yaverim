/**
 * PATCH /api/admin/discovery/review
 * Approve, reject, mark needs-info, or enrich a discovered tool.
 *
 * When action === "approve":
 *   - Status in queue → "approved"
 *   - Tool is added to data/tools.json (via lib/tools/store)
 *   - AI analysis report data is merged into the Tool record if available
 *
 * Body: { id, action: "approve" | "reject" | "needs-info" | "enrich", note?, enriched? }
 */
import { NextRequest, NextResponse }             from "next/server";
import { updateStatus, updateEnriched, getAllItems, getItemById, getAnalysisReport } from "@/lib/discovery/queue-store";
import { upsertTool }                            from "@/lib/tools/store";
import type { ReviewStatus }                     from "@/lib/discovery/types";
import type { Tool }                             from "@/data/schemas/tool";
import type { SolutionArea, UserType }           from "@/lib/recommendation/types";

export async function PATCH(req: NextRequest) {
  const body = await req.json() as {
    id:       string;
    action:   "approve" | "reject" | "needs-info" | "enrich";
    note?:    string;
    enriched?: Record<string, unknown>;
  };

  if (!body.id || !body.action) {
    return NextResponse.json({ error: "id and action required" }, { status: 400 });
  }

  if (body.action === "enrich") {
    const updated = updateEnriched(body.id, body.enriched ?? {});
    if (!updated) return NextResponse.json({ error: "not found" }, { status: 404 });
    return NextResponse.json({ success: true, item: updated });
  }

  if (body.action === "approve") {
    const item = getItemById(body.id);
    if (!item) return NextResponse.json({ error: "not found" }, { status: 404 });

    // Pull in AI analysis report if available (enriches the Tool record)
    const report  = getAnalysisReport(body.id);   // ToolAnalysisReport | null
    const enriched = item.enriched ?? {};

    // Map discovered tool + analysis + enriched admin data → Tool record
    const solutionAreas = (
      (enriched.solutionAreas as string[] | undefined) ??
      (report?.suggestedCategory ? [report.suggestedCategory.toLowerCase() as SolutionArea] : [])
    ).filter(Boolean) as SolutionArea[];

    const tool: Tool = {
      id:          item.id,
      slug:        item.slug,
      name:        item.name,
      tagline:     item.tagline,
      websiteUrl:  item.websiteUrl,
      pricingLabel: String(enriched.pricingLabel ?? report?.pricing?.paidPlans ?? "Bilinmiyor"),
      category:    String(enriched.category ?? report?.suggestedCategory ?? item.suggestedCategory ?? "Diğer"),
      subUseCases: [],
      strongSignals: Array.isArray(report?.topFeatures)
        ? (report.topFeatures as string[]).slice(0, 3)
        : [item.discoverySignal ?? ""],
      suitableForUserTypes: ["individual", "freelancer", "founder"] as UserType[],
      sectorFit:   (enriched.sectorFit as string[] | undefined) ?? [],
      solutionAreas,
      hasFree:     Boolean(enriched.hasFree ?? report?.pricing?.hasFree ?? false),
      hasTrial:    Boolean(enriched.hasTrial ?? report?.pricing?.hasTrial ?? false),
      pricingTier: mapPricingTier(
        String(enriched.pricingTier ?? report?.pricing?.pricingTier ?? "mid")
      ),
      hasAffiliate:  Boolean(enriched.hasAffiliate ?? false),
      affiliateUrl:  (enriched.affiliateUrl as string | undefined) ?? null,
      affiliateCode: null,
      hasPartnership: false,
      popularity:   mapPopularity(
        String(enriched.popularity ?? report?.suggestedPopularity ?? item.suggestedPopularity ?? "niche")
      ),
      turkishSupport: mapTurkishSupport(
        String(enriched.turkishSupport ?? report?.turkishSupport ?? "none")
      ),
      difficultyLevel: mapDifficulty(String(enriched.difficultyLevel ?? "intermediate")),
      editorialScore: Number(enriched.editorialScore ?? report?.suggestedEditorialScore ?? 7),
      scores: {
        fitToNeed:          7,
        easeOfUse:          7,
        priceValue:         7,
        productivityImpact: 7,
        growthImpact:       6,
        integrationFit:     6,
      },
      strengths:   Array.isArray(report?.pros)  ? (report.pros  as string[]).slice(0, 4) : [],
      weaknesses:  Array.isArray(report?.cons)  ? (report.cons  as string[]).slice(0, 3) : [],
      whyRecommended:  report?.summary ?? item.tagline,
      notSuitableFor:   [],
      similarTools:     [],
      freeAlternatives: [],
      platformDependencies: [],
      status:    "candidate",
      updatedAt: new Date().toISOString(),
    };

    try {
      upsertTool(tool);
    } catch (err) {
      console.error("[review/approve] Failed to add tool to store:", err);
      // Don't block — still update queue status
    }
  }

  const statusMap: Record<string, ReviewStatus> = {
    approve:      "approved",
    reject:       "rejected",
    "needs-info": "needs-info",
  };

  const updated = updateStatus(body.id, statusMap[body.action], body.note);
  if (!updated) return NextResponse.json({ error: "not found" }, { status: 404 });

  return NextResponse.json({ success: true, item: updated });
}

export async function GET() {
  return NextResponse.json({ items: getAllItems() });
}

/* ── Helpers ──────────────────────────────────────────────────────────────── */

function mapPricingTier(s: string): Tool["pricingTier"] {
  const map: Record<string, Tool["pricingTier"]> = {
    free: "free", freemium: "low", paid: "mid", enterprise: "enterprise",
    low: "low", mid: "mid", high: "high",
  };
  return map[s.toLowerCase()] ?? "mid";
}

function mapPopularity(s: string): Tool["popularity"] {
  const valid = ["mainstream", "known", "niche", "emerging"] as const;
  return (valid as readonly string[]).includes(s)
    ? s as Tool["popularity"]
    : "niche";
}

function mapTurkishSupport(s: string): Tool["turkishSupport"] {
  const valid = ["full", "partial", "none"] as const;
  return (valid as readonly string[]).includes(s)
    ? s as Tool["turkishSupport"]
    : "none";
}

function mapDifficulty(s: string): Tool["difficultyLevel"] {
  const valid = ["beginner", "intermediate", "advanced"] as const;
  return (valid as readonly string[]).includes(s)
    ? s as Tool["difficultyLevel"]
    : "intermediate";
}
