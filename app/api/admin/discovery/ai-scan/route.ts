/**
 * POST /api/admin/discovery/ai-scan
 *
 * AI-powered discovery — searches the live web for new AI tools using
 * Perplexity Sonar or OpenAI, then adds them to the discovery queue.
 *
 * This is different from the regular scan (which uses a static watch-list).
 * AI scan queries the live internet: Product Hunt, GitHub, tech blogs, etc.
 *
 * GET /api/admin/discovery/ai-scan
 * Returns provider status (which AI is configured).
 */
import { NextRequest, NextResponse }   from "next/server";
import { aiDiscoverNewTools }          from "@/lib/ai-analyst/analyzer";
import { addDiscoveredTools, getAllItems } from "@/lib/discovery/queue-store";
import { getProvider }                 from "@/lib/ai-analyst/analyzer";
import { randomUUID }                  from "crypto";
import type { DiscoveredTool }         from "@/lib/discovery/types";

export async function POST(_req: NextRequest) {
  const provider = getProvider();

  if (provider === "mock") {
    return NextResponse.json({
      error: "mock",
      message: "AI tarama için API key gerekli.",
      hint:    "ÜCRETSİZ: GEMINI_API_KEY=... → aistudio.google.com/apikey (Google Search dahil, ücretsiz)",
    }, { status: 402 });
  }

  try {
    const result = await aiDiscoverNewTools();

    // Convert AI results to DiscoveredTool shape
    const existingSlugs = new Set(getAllItems().map(i => i.slug));

    const tools: DiscoveredTool[] = result.tools
      .filter(t => t.name && t.websiteUrl && !existingSlugs.has(t.slug))
      .map(t => ({
        id:                  randomUUID(),
        slug:                t.slug || t.name.toLowerCase().replace(/\s+/g, "-"),
        name:                t.name,
        tagline:             t.tagline,
        websiteUrl:          t.websiteUrl,
        source:              "product-hunt" as const,  // AI scan approximation
        rawDescription:      t.rawDescription,
        suggestedCategory:   t.suggestedCategory,
        suggestedPopularity: t.suggestedPopularity,
        discoverySignal:     t.discoverySignal,
        discoveredAt:        result.scannedAt,
        status:              "pending" as const,
      }));

    addDiscoveredTools(tools, result.scannedAt);

    return NextResponse.json({
      success:    true,
      provider:   result.provider,
      scannedAt:  result.scannedAt,
      newItems:   tools.length,
      totalFound: result.tools.length,
      sources:    result.sources,
      items:      tools.map(t => ({ id: t.id, slug: t.slug, name: t.name })),
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: "AI scan failed", detail: message }, { status: 500 });
  }
}

export async function GET() {
  const provider = getProvider();
  const hasKey   = provider !== "mock";

  return NextResponse.json({
    provider,
    hasKey,
    status: hasKey
      ? `${provider} aktif — AI web tarama kullanılabilir`
      : "API key yok — mock mod aktif",
    recommendation: "Perplexity Sonar önerilir: https://www.perplexity.ai/api",
  });
}
