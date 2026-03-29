/**
 * POST /api/admin/discovery/analyze
 * Analyzes a single tool from the discovery queue using AI.
 * Returns structured JSON with the analysis report.
 *
 * GET /api/admin/discovery/analyze?toolId=xxx
 * Returns the stored analysis report for a tool.
 */
import { NextRequest, NextResponse } from "next/server";
import { getItemById, saveAnalysisReport, getAnalysisReport } from "@/lib/discovery/queue-store";
import { analyzeTool, getProvider } from "@/lib/ai-analyst/analyzer";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({})) as { toolId?: string };

  if (!body.toolId) {
    return NextResponse.json({ error: "toolId required" }, { status: 400 });
  }

  const item = getItemById(body.toolId);
  if (!item) {
    return NextResponse.json({ error: "Tool not found in queue" }, { status: 404 });
  }

  const provider = getProvider();

  if (provider === "mock") {
    return NextResponse.json({
      error:   "no_key",
      message: "API key bulunamadı.",
      hint:    "ÜCRETSİZ: .env.local dosyasına GEMINI_API_KEY=... ekle → aistudio.google.com/apikey",
    }, { status: 402 });
  }

  try {
    const report = await analyzeTool({
      toolId:     item.id,
      toolName:   item.name,
      websiteUrl: item.websiteUrl,
    });

    saveAnalysisReport(report);
    return NextResponse.json({ success: true, report });

  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("[discovery/analyze] failed:", message);

    // Detect rate-limit / quota errors from any provider
    const isRateLimit = message.includes("429") || message.toLowerCase().includes("rate limit") || message.toLowerCase().includes("quota");
    const isDailyQuota = message.toLowerCase().includes("per day") || message.toLowerCase().includes("perday") || message.includes("PerDay");

    if (isRateLimit) {
      return NextResponse.json({
        error:     "rate_limited",
        message:   isDailyQuota
          ? "Günlük ücretsiz kota doldu (1.500 istek/gün). Kota her gün gece yarısı sıfırlanır."
          : "Gemini API dakika limiti (15 istek/dk). 60 saniye bekle ve tekrar dene.",
        hint:      isDailyQuota
          ? "Yeni key almak için: aistudio.google.com/apikey → yeni proje oluştur. Veya yarın sabah tekrar dene."
          : "60 saniye bekle → tekrar dene.",
        isDailyQuota,
        retryAfterSeconds: isDailyQuota ? null : 60,
      }, { status: 429 });
    }

    return NextResponse.json({
      error:   "analysis_failed",
      message,
      hint:    provider === "gemini"
        ? "Gemini API key geçerli mi? aistudio.google.com/apikey adresinden kontrol et."
        : "API sağlayıcısı isteği reddetti.",
    }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  const toolId = req.nextUrl.searchParams.get("toolId");
  if (!toolId) return NextResponse.json({ error: "toolId required" }, { status: 400 });

  const report = getAnalysisReport(toolId);
  if (!report) return NextResponse.json({ error: "No report found" }, { status: 404 });

  return NextResponse.json({ report });
}
