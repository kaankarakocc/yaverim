"use client";

import { useState, useTransition } from "react";
import type { DiscoveredTool }     from "@/lib/discovery/types";
import type { ToolAnalysisReport } from "@/lib/ai-analyst/types";

/* ─── Labels ──────────────────────────────────────────────────────────────── */

const SOURCE_LABEL: Record<string, string> = {
  "product-hunt":         "Product Hunt",
  "there-is-an-ai":       "There's An AI",
  "futurepedia":          "Futurepedia",
  "github-trending":      "GitHub Trending",
  "manual":               "Manuel",
  "community-suggestion": "Topluluk",
  "competitor-watch":     "Rakip Takip",
};

const STATUS_STYLE: Record<string, { bg: string; color: string; label: string }> = {
  pending:      { bg: "#fffbeb", color: "#92400e",  label: "Bekliyor"    },
  approved:     { bg: "#f0fdf4", color: "#166534",  label: "Onaylandı"   },
  rejected:     { bg: "#fef2f2", color: "#991b1b",  label: "Reddedildi"  },
  "needs-info": { bg: "#f8fafc", color: "#475569",  label: "Bilgi Lazım" },
};

const REC_STYLE: Record<string, { bg: string; color: string; icon: string; label: string }> = {
  approve:      { bg: "#f0fdf4", color: "#166534", icon: "✓", label: "Onayla"       },
  reject:       { bg: "#fef2f2", color: "#991b1b", icon: "✕", label: "Reddet"       },
  "needs-info": { bg: "#fffbeb", color: "#92400e", icon: "?", label: "Bilgi Lazım"  },
};

const SCORE_COLOR = (s: number) =>
  s >= 8.5 ? "#16a34a" : s >= 7 ? "#2563eb" : s >= 5.5 ? "#f59e0b" : "#ef4444";

/* ─── Types ───────────────────────────────────────────────────────────────── */

interface Props {
  initialItems: DiscoveredTool[];
  initialReports: Record<string, ToolAnalysisReport>;
  stats: { pending: number; approved: number; rejected: number; needsInfo: number; lastScanAt: string };
  aiProvider: string;
  aiHasKey:   boolean;
}

/* ─── Main component ─────────────────────────────────────────────────────── */

export function DiscoveryPageClient({ initialItems, initialReports, stats, aiProvider, aiHasKey }: Props) {
  const [items,   setItems]   = useState<DiscoveredTool[]>(initialItems);
  const [reports, setReports] = useState<Record<string, ToolAnalysisReport>>(initialReports);
  const [filter,  setFilter]  = useState<"all"|"pending"|"approved"|"rejected"|"needs-info">("pending");

  const [scanning,   startScan]    = useTransition();
  const [aiScanning, startAiScan]  = useTransition();
  const [scanMsg, setScanMsg]      = useState("");

  const [analyzingId,  setAnalyzingId]  = useState<string | null>(null);
  const [analyzeError, setAnalyzeError] = useState<{
    id: string; msg: string; hint?: string; isDailyQuota?: boolean; retryAt?: number;
  } | null>(null);
  const [actionId,     setActionId]     = useState<string | null>(null);
  const [noteMap,      setNoteMap]      = useState<Record<string, string>>({});
  const [expandedId,   setExpandedId]   = useState<string | null>(null);

  /* ── Refresh list ── */
  async function refreshList() {
    const res  = await fetch("/api/admin/discovery/review");
    const data = await res.json() as { items: DiscoveredTool[] };
    setItems(data.items);
  }

  /* ── Regular scan ── */
  function handleScan() {
    startScan(async () => {
      setScanMsg("Taranıyor...");
      const res  = await fetch("/api/admin/discovery/scan", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ maxResults: 10 }),
      });
      const data = await res.json() as { newItems: number };
      setScanMsg(`${data.newItems} yeni aday eklendi.`);
      await refreshList();
    });
  }

  /* ── AI scan ── */
  function handleAiScan() {
    startAiScan(async () => {
      setScanMsg("AI interneti tarıyor...");
      const res  = await fetch("/api/admin/discovery/ai-scan", { method: "POST" });
      const data = await res.json() as { newItems?: number; error?: string; message?: string };
      if (data.error) {
        setScanMsg(data.message ?? "AI tarama hatası.");
      } else {
        setScanMsg(`AI ${data.newItems} yeni araç buldu.`);
        await refreshList();
      }
    });
  }

  /* ── AI analyze tool ── */
  async function handleAnalyze(item: DiscoveredTool) {
    setAnalyzingId(item.id);
    setAnalyzeError(null);
    setExpandedId(item.id);
    try {
      const res  = await fetch("/api/admin/discovery/analyze", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ toolId: item.id }),
      });
      const data = await res.json() as {
        report?:            ToolAnalysisReport;
        error?:             string;
        message?:           string;
        hint?:              string;
        isDailyQuota?:      boolean;
        retryAfterSeconds?: number | null;
      };
      if (data.report) {
        setReports(prev => ({ ...prev, [item.id]: data.report! }));
        setAnalyzeError(null);
      } else {
        const retryAt = data.retryAfterSeconds
          ? Date.now() + data.retryAfterSeconds * 1000
          : undefined;
        setAnalyzeError({
          id:           item.id,
          msg:          data.message ?? "Analiz başarısız.",
          hint:         data.hint,
          isDailyQuota: data.isDailyQuota,
          retryAt,
        });
      }
    } finally {
      setAnalyzingId(null);
    }
  }

  /* ── Review action ── */
  async function handleAction(id: string, action: "approve"|"reject"|"needs-info") {
    setActionId(id);
    const res  = await fetch("/api/admin/discovery/review", {
      method: "PATCH", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, action, note: noteMap[id] }),
    });
    const data = await res.json() as { item: DiscoveredTool };
    setItems(prev => prev.map(i => i.id === id ? data.item : i));
    setActionId(null);
  }

  /* ── Filtered list ── */
  const visible = filter === "all" ? items : items.filter(i => i.status === filter);

  return (
    <div className="flex flex-col gap-6">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: "#0f172a" }}>Keşif Kuyruğu</h1>
          <p className="text-sm mt-1" style={{ color: "#64748b" }}>
            Sistem her gün tarama yapar. AI analistle her aracı otomatik değerlendir.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {scanMsg && (
            <span className="text-xs px-3 py-1.5 rounded-lg" style={{ background: "#f0fdf4", color: "#166534" }}>
              {scanMsg}
            </span>
          )}

          {/* AI Scan button */}
          <button
            onClick={handleAiScan}
            disabled={aiScanning || scanning || !aiHasKey}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-opacity"
            style={{
              background: aiHasKey ? "#7c3aed" : "#e2e8f0",
              color:      aiHasKey ? "#ffffff"  : "#94a3b8",
              opacity: (aiScanning || scanning) ? 0.6 : 1,
            }}
            title={!aiHasKey ? "PERPLEXITY_API_KEY veya OPENAI_API_KEY gerekli" : undefined}
          >
            <span>◈</span>
            {aiScanning ? "AI tarıyor..." : "AI ile İnternet Tara"}
          </button>

          {/* Regular scan */}
          <button
            onClick={handleScan}
            disabled={scanning || aiScanning}
            className="px-4 py-2 rounded-lg text-sm font-semibold transition-opacity"
            style={{ background: "#2563eb", color: "#ffffff", opacity: (scanning || aiScanning) ? 0.6 : 1 }}
          >
            {scanning ? "Taranıyor..." : "Hızlı Tara"}
          </button>
        </div>
      </div>

      {/* AI provider status */}
      <div
        className="flex items-center gap-3 px-4 py-3 rounded-xl border text-sm"
        style={{
          background: aiHasKey ? "#f0fdf4" : "#fffbeb",
          borderColor: aiHasKey ? "#bbf7d0" : "#fde68a",
        }}
      >
        <div
          className="w-2 h-2 rounded-full flex-shrink-0"
          style={{ background: aiHasKey ? "#22c55e" : "#f59e0b" }}
        />
        {aiHasKey ? (
          <span style={{ color: "#166534" }}>
            <strong style={{ textTransform: "capitalize" }}>{aiProvider}</strong> aktif — AI analiz ve Google Search ile internet tarama kullanılabilir.
          </span>
        ) : (
          <div className="flex flex-col gap-1">
            <span style={{ color: "#92400e", fontWeight: 600 }}>
              AI aktif değil — .env.local&apos;e aşağıdakilerden birini ekle:
            </span>
            <span style={{ color: "#b45309" }} className="text-xs">
              🆓 Ücretsiz:{" "}
              <code className="font-mono px-1.5 py-0.5 rounded" style={{ background: "#fef3c7" }}>
                GEMINI_API_KEY=...
              </code>
              {" "}→{" "}
              <a href="https://aistudio.google.com/apikey" target="_blank" rel="noopener noreferrer" style={{ color: "#2563eb" }}>
                aistudio.google.com/apikey
              </a>
              {" "}(Google hesabıyla 30 sn&apos;de al, Google Search dahil)
            </span>
          </div>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-3">
        {[
          { key: "pending",     label: "Bekliyor",   value: stats.pending,   bg: "#fffbeb", color: "#92400e" },
          { key: "approved",    label: "Onaylandı",  value: stats.approved,  bg: "#f0fdf4", color: "#166534" },
          { key: "rejected",    label: "Reddedildi", value: stats.rejected,  bg: "#fef2f2", color: "#991b1b" },
          { key: "needs-info",  label: "Bilgi Lazım",value: stats.needsInfo, bg: "#f8fafc", color: "#475569" },
        ].map(s => (
          <button
            key={s.key}
            onClick={() => setFilter(s.key as typeof filter)}
            className="rounded-xl border p-3 text-center transition-all cursor-pointer"
            style={{
              background:  filter === s.key ? s.bg    : "#ffffff",
              borderColor: filter === s.key ? s.color + "44" : "#e2e8f0",
            }}
          >
            <p className="text-2xl font-bold tabular-nums" style={{ color: s.color }}>{s.value}</p>
            <p className="text-xs mt-0.5"                  style={{ color: s.color }}>{s.label}</p>
          </button>
        ))}
      </div>

      {/* Filter tabs */}
      <div className="flex items-center gap-2 border-b pb-3" style={{ borderColor: "#e2e8f0" }}>
        {(["all","pending","approved","rejected","needs-info"] as const).map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className="px-3 py-1.5 rounded-lg text-sm font-medium transition-colors"
            style={{ background: filter === f ? "#2563eb" : "transparent", color: filter === f ? "#ffffff" : "#64748b" }}
          >
            {f === "all" ? "Tümü" : STATUS_STYLE[f]?.label ?? f}
            <span className="ml-1.5 text-xs opacity-70">
              {f === "all" ? items.length : items.filter(i => i.status === f).length}
            </span>
          </button>
        ))}
      </div>

      {/* Empty state */}
      {visible.length === 0 && (
        <div className="rounded-xl border p-10 text-center" style={{ background: "#ffffff", borderColor: "#e2e8f0" }}>
          <p className="text-4xl mb-3">◈</p>
          <p className="font-semibold" style={{ color: "#0f172a" }}>
            {filter === "pending" ? "Bekleyen araç yok" : "Eşleşen araç yok"}
          </p>
          <p className="text-sm mt-1" style={{ color: "#94a3b8" }}>
            {filter === "pending"
              ? "Tümü incelendi. Yeni tarama için yukarıdaki butonları kullan."
              : "Farklı bir filtre seç."}
          </p>
        </div>
      )}

      {/* Items */}
      <div className="flex flex-col gap-5">
        {visible.map(item => {
          const ss       = STATUS_STYLE[item.status] ?? STATUS_STYLE.pending;
          const report   = reports[item.id] ?? null;
          const isActing = actionId    === item.id;
          const isAnalyzing = analyzingId === item.id;
          const isExpanded  = expandedId  === item.id;
          const rec = report ? REC_STYLE[report.recommendation] : null;

          return (
            <div
              key={item.id}
              className="rounded-xl border overflow-hidden"
              style={{ background: "#ffffff", borderColor: "#e2e8f0" }}
            >
              {/* ── Tool header ── */}
              <div className="p-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-base" style={{ color: "#0f172a" }}>{item.name}</span>
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full" style={{ background: ss.bg, color: ss.color }}>
                        {ss.label}
                      </span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full" style={{ background: "#f1f5f9", color: "#475569" }}>
                        {SOURCE_LABEL[item.source] ?? item.source}
                      </span>
                      {/* AI recommendation badge */}
                      {rec && (
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full flex items-center gap-1" style={{ background: rec.bg, color: rec.color }}>
                          <span>◈ AI:</span> {rec.label}
                        </span>
                      )}
                    </div>
                    <p className="text-sm mt-1" style={{ color: "#334155" }}>{item.tagline}</p>
                    <p className="text-xs mt-0.5" style={{ color: "#94a3b8" }}>{item.discoverySignal}</p>
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0">
                    <a
                      href={item.websiteUrl} target="_blank" rel="noopener noreferrer"
                      className="text-xs px-3 py-1.5 rounded-lg border"
                      style={{ color: "#2563eb", borderColor: "#bfdbfe", background: "#eff6ff" }}
                    >
                      Siteye git ↗
                    </a>
                    <button
                      onClick={() => setExpandedId(isExpanded ? null : item.id)}
                      className="text-xs px-3 py-1.5 rounded-lg border"
                      style={{ borderColor: "#e2e8f0", color: "#64748b" }}
                    >
                      {isExpanded ? "Kapat ↑" : "Detay ↓"}
                    </button>
                  </div>
                </div>

                {/* Analyze button row */}
                {(item.status === "pending" || item.status === "needs-info") && (
                  <div className="mt-3 flex flex-col gap-2">
                    <div className="flex items-center gap-3 flex-wrap">
                      <button
                        onClick={() => handleAnalyze(item)}
                        disabled={isAnalyzing || !aiHasKey}
                        className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-opacity"
                        style={{
                          background: aiHasKey ? "#7c3aed" : "#f1f5f9",
                          color:      aiHasKey ? "#ffffff"  : "#94a3b8",
                          opacity: isAnalyzing ? 0.6 : 1,
                        }}
                        title={!aiHasKey ? "GEMINI_API_KEY gerekli" : undefined}
                      >
                        {isAnalyzing ? (
                          <>
                            <span className="inline-block w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            AI analiz ediyor...
                          </>
                        ) : (
                          <>◈ AI ile Analiz Et</>
                        )}
                      </button>
                      {report && (
                        <span className="text-xs" style={{ color: "#94a3b8" }}>
                          Son analiz: {new Date(report.analyzedAt).toLocaleString("tr-TR")}
                        </span>
                      )}
                    </div>

                    {/* Error / Rate limit message */}
                    {analyzeError?.id === item.id && (
                      <div
                        className="flex items-start gap-2.5 px-3 py-2.5 rounded-lg text-sm"
                        style={{ background: "#fef2f2", border: "1px solid #fecaca", color: "#991b1b" }}
                      >
                        <span className="flex-shrink-0 mt-0.5 text-base">⚠</span>
                        <div className="flex flex-col gap-1.5">
                          <span className="font-semibold">{analyzeError.msg}</span>
                          {analyzeError.hint && (
                            <span className="text-xs leading-relaxed" style={{ color: "#b91c1c" }}>
                              {analyzeError.hint}
                            </span>
                          )}
                          {analyzeError.isDailyQuota && (
                            <div
                              className="flex items-start gap-2 px-2.5 py-2 rounded-lg text-xs mt-0.5"
                              style={{ background: "#fff7ed", border: "1px solid #fed7aa", color: "#c2410c" }}
                            >
                              <span>💡</span>
                              <div>
                                <strong>Hızlı çözüm:</strong>{" "}
                                <a
                                  href="https://aistudio.google.com/apikey"
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="underline"
                                  style={{ color: "#2563eb" }}
                                >
                                  aistudio.google.com/apikey
                                </a>
                                {" "}→ yeni proje aç → yeni key al → .env.local&apos;e yapıştır → sunucuyu yeniden başlat.
                                Her proje 1.500 istek/gün ücretsiz alır.
                              </div>
                            </div>
                          )}
                          {!analyzeError.isDailyQuota && analyzeError.retryAt && (
                            <span className="text-xs" style={{ color: "#ef4444" }}>
                              60 saniye bekle → tekrar dene.
                            </span>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* ── Expanded: AI Analysis Report ── */}
              {isExpanded && (
                <div className="border-t px-5 py-5" style={{ borderColor: "#f1f5f9", background: "#fafafa" }}>

                  {/* Loading state */}
                  {isAnalyzing && (
                    <div className="flex items-center gap-3 py-4">
                      <div className="w-5 h-5 border-2 border-violet-200 border-t-violet-600 rounded-full animate-spin" />
                      <p className="text-sm" style={{ color: "#7c3aed" }}>
                        AI interneti tarıyor, aracı analiz ediyor...
                      </p>
                    </div>
                  )}

                  {/* No report yet */}
                  {!isAnalyzing && !report && (
                    <div className="py-4 text-center">
                      <p className="text-sm" style={{ color: "#94a3b8" }}>
                        {aiHasKey
                          ? "Henüz analiz yok. ◈ AI ile Analiz Et butonuna bas."
                          : "AI analizi için API key gerekli — .env.local'e PERPLEXITY_API_KEY ekle."}
                      </p>
                      {/* Raw discovery info while no report */}
                      <div className="mt-3 text-left rounded-lg p-3 border" style={{ background: "#ffffff", borderColor: "#e2e8f0" }}>
                        <p className="text-xs font-semibold mb-1" style={{ color: "#475569" }}>Ham Bilgi</p>
                        <p className="text-xs" style={{ color: "#64748b" }}>{item.rawDescription}</p>
                      </div>
                    </div>
                  )}

                  {/* ── Report ── */}
                  {!isAnalyzing && report && (
                    <div className="flex flex-col gap-5">

                      {/* AI verdict banner */}
                      {rec && (
                        <div
                          className="flex items-start gap-3 rounded-xl p-4"
                          style={{ background: rec.bg, border: `1px solid ${rec.color}33` }}
                        >
                          <div
                            className="w-8 h-8 rounded-lg flex items-center justify-center text-lg font-bold flex-shrink-0"
                            style={{ background: rec.color + "22", color: rec.color }}
                          >
                            {rec.icon}
                          </div>
                          <div>
                            <p className="font-semibold text-sm" style={{ color: rec.color }}>
                              AI Tavsiyesi: {rec.label}
                            </p>
                            <p className="text-sm mt-0.5" style={{ color: rec.color + "cc" }}>
                              {report.recommendationReason}
                            </p>
                          </div>
                          <div className="ml-auto flex-shrink-0 text-right">
                            <p className="text-2xl font-bold" style={{ color: SCORE_COLOR(report.suggestedEditorialScore) }}>
                              {report.suggestedEditorialScore.toFixed(1)}
                            </p>
                            <p className="text-[10px]" style={{ color: "#94a3b8" }}>/ 10</p>
                          </div>
                        </div>
                      )}

                      {/* Summary */}
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wide mb-1" style={{ color: "#64748b" }}>Özet</p>
                        <p className="text-sm" style={{ color: "#334155" }}>{report.summary}</p>
                      </div>

                      {/* Target audience + category */}
                      <div className="grid sm:grid-cols-2 gap-4">
                        <InfoBlock label="Hedef Kitle" text={report.targetAudience} />
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-wide mb-1" style={{ color: "#64748b" }}>Kategori & Popülerlik</p>
                          <div className="flex gap-2 flex-wrap">
                            <Tag label={report.suggestedCategory} bg="#eff6ff" color="#1d4ed8" />
                            <Tag label={report.suggestedPopularity} bg="#f0fdf4" color="#166534" />
                            <Tag label={`Türkçe: ${report.turkishSupport}`} bg={report.turkishSupport === "full" ? "#f0fdf4" : "#fffbeb"} color={report.turkishSupport === "full" ? "#166534" : "#92400e"} />
                          </div>
                        </div>
                      </div>

                      {/* Features */}
                      {report.topFeatures.length > 0 && (
                        <BulletBlock label="Ana Özellikler" items={report.topFeatures} icon="◆" color="#2563eb" />
                      )}

                      {/* Pros / Cons */}
                      <div className="grid sm:grid-cols-2 gap-4">
                        {report.pros.length > 0 && (
                          <BulletBlock label="Avantajlar" items={report.pros} icon="+" color="#16a34a" bg="#f0fdf4" />
                        )}
                        {report.cons.length > 0 && (
                          <BulletBlock label="Dezavantajlar" items={report.cons} icon="−" color="#dc2626" bg="#fef2f2" />
                        )}
                      </div>

                      {/* Pricing */}
                      <div
                        className="rounded-xl p-4 border"
                        style={{ background: "#ffffff", borderColor: "#e2e8f0" }}
                      >
                        <p className="text-xs font-semibold uppercase tracking-wide mb-2" style={{ color: "#64748b" }}>Fiyatlandırma</p>
                        <div className="flex items-center gap-3 flex-wrap mb-2">
                          <span className="font-bold text-base" style={{ color: "#0f172a" }}>{report.pricing.startingPrice}</span>
                          {report.pricing.hasFree  && <Tag label="Ücretsiz katman var" bg="#f0fdf4" color="#166534" />}
                          {report.pricing.hasTrial && <Tag label="Deneme süresi" bg="#eff6ff" color="#1d4ed8" />}
                        </div>
                        {report.pricing.freeDetails && (
                          <p className="text-xs" style={{ color: "#64748b" }}>Ücretsiz: {report.pricing.freeDetails}</p>
                        )}
                        {report.pricing.paidPlans && (
                          <p className="text-xs mt-0.5" style={{ color: "#64748b" }}>Ücretli: {report.pricing.paidPlans}</p>
                        )}
                      </div>

                      {/* Competitors */}
                      {report.competitors.length > 0 && (
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-wide mb-2" style={{ color: "#64748b" }}>Rakipler</p>
                          <div className="flex flex-wrap gap-2">
                            {report.competitors.map(c => <Tag key={c} label={c} bg="#f8fafc" color="#475569" />)}
                          </div>
                        </div>
                      )}

                      {/* Turkish support note */}
                      {report.turkishSupportNote && (
                        <InfoBlock label="Türkçe Destek Detayı" text={report.turkishSupportNote} />
                      )}

                      {/* Sources */}
                      {report.sources.length > 0 && (
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-wide mb-1" style={{ color: "#64748b" }}>
                            Kaynaklar ({report.sources.length})
                          </p>
                          <div className="flex flex-col gap-1">
                            {report.sources.slice(0, 5).map((s, i) => (
                              <a
                                key={i} href={s} target="_blank" rel="noopener noreferrer"
                                className="text-xs truncate"
                                style={{ color: "#2563eb" }}
                              >
                                {s}
                              </a>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Seed snippet for approved */}
                      {item.status === "approved" && (
                        <div>
                          <p className="text-xs font-semibold mb-1" style={{ color: "#166534" }}>
                            Seed snippet — data/seed/tools.ts'e ekle:
                          </p>
                          <pre
                            className="text-[11px] p-3 rounded-lg overflow-x-auto"
                            style={{ background: "#f8fafc", color: "#334155", border: "1px solid #e2e8f0" }}
                          >
                            {buildSeedSnippet(item, report)}
                          </pre>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* ── Actions ── */}
              {(item.status === "pending" || item.status === "needs-info") && (
                <div
                  className="px-5 py-4 border-t flex flex-col sm:flex-row items-start sm:items-center gap-3"
                  style={{ borderColor: "#f1f5f9", background: "#f8fafc" }}
                >
                  <input
                    type="text"
                    placeholder="İnceleme notu (isteğe bağlı)..."
                    value={noteMap[item.id] ?? ""}
                    onChange={e => setNoteMap(prev => ({ ...prev, [item.id]: e.target.value }))}
                    className="flex-1 text-sm px-3 py-2 rounded-lg border outline-none"
                    style={{ borderColor: "#e2e8f0", color: "#334155", background: "#ffffff" }}
                  />
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <ActionButton label="✓ Onayla"     color="#16a34a" disabled={isActing} onClick={() => handleAction(item.id, "approve")} />
                    <ActionButton label="? Bilgi Lazım" color="#f59e0b" disabled={isActing} onClick={() => handleAction(item.id, "needs-info")} />
                    <ActionButton label="✕ Reddet"     color="#ef4444" disabled={isActing} onClick={() => handleAction(item.id, "reject")} />
                  </div>
                </div>
              )}

              {/* Reviewed indicator */}
              {item.status === "approved" && (
                <div className="px-5 py-3 border-t flex items-center gap-2" style={{ borderColor: "#bbf7d0", background: "#f0fdf4" }}>
                  <span style={{ color: "#16a34a" }}>✓ Onaylandı</span>
                  {item.reviewNote && <span className="text-xs" style={{ color: "#4ade80" }}>— {item.reviewNote}</span>}
                  <button
                    onClick={() => setExpandedId(item.id === expandedId ? null : item.id)}
                    className="ml-auto text-xs"
                    style={{ color: "#16a34a" }}
                  >
                    {expandedId === item.id ? "Snippet'i gizle ↑" : "Seed snippet gör ↓"}
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ─── Sub-components ─────────────────────────────────────────────────────── */

function Tag({ label, bg, color }: { label: string; bg: string; color: string }) {
  return (
    <span className="text-[11px] font-medium px-2 py-0.5 rounded-full" style={{ background: bg, color }}>
      {label}
    </span>
  );
}

function InfoBlock({ label, text }: { label: string; text: string }) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-wide mb-1" style={{ color: "#64748b" }}>{label}</p>
      <p className="text-sm" style={{ color: "#334155" }}>{text}</p>
    </div>
  );
}

function BulletBlock({ label, items, icon, color, bg }: {
  label: string; items: string[]; icon: string; color: string; bg?: string;
}) {
  return (
    <div className="rounded-xl p-4 border" style={{ background: bg ?? "#ffffff", borderColor: color + "22" }}>
      <p className="text-xs font-semibold uppercase tracking-wide mb-2" style={{ color }}>{label}</p>
      <ul className="flex flex-col gap-1.5">
        {items.map((item, i) => (
          <li key={i} className="flex items-start gap-2 text-sm">
            <span className="flex-shrink-0 font-bold text-xs mt-0.5" style={{ color }}>{icon}</span>
            <span style={{ color: "#334155" }}>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function ActionButton({ label, color, disabled, onClick }: {
  label: string; color: string; disabled: boolean; onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="px-4 py-2 rounded-lg text-sm font-semibold transition-opacity"
      style={{ background: color, color: "#ffffff", opacity: disabled ? 0.6 : 1 }}
    >
      {label}
    </button>
  );
}

/* ─── Seed snippet generator ─────────────────────────────────────────────── */

function buildSeedSnippet(item: DiscoveredTool, report: ToolAnalysisReport | null): string {
  const r = report;
  return `{
  slug:               "${item.slug}",
  name:               "${item.name}",
  tagline:            "${item.tagline}",
  websiteUrl:         "${item.websiteUrl}",
  status:             "candidate",
  category:           "${r?.suggestedCategory ?? item.suggestedCategory}",
  popularity:         "${r?.suggestedPopularity ?? item.suggestedPopularity}",
  hasFree:            ${r?.pricing.hasFree    ?? true},
  hasTrial:           ${r?.pricing.hasTrial   ?? false},
  hasAffiliate:       false,
  hasPartnership:     false,
  pricingTier:        "${r?.pricing.pricingTier ?? "freemium"}",
  pricingLabel:       "${r?.pricing.startingPrice ?? ""}",
  turkishSupport:     "${r?.turkishSupport ?? "none"}",
  difficultyLevel:    "beginner",
  editorialScore:     ${r?.suggestedEditorialScore ?? 7.0},
  solutionAreas:      [],
  sectorFit:          [],
  suitableFor:        [],
  platformDependencies: [],
  requiredContextFlags: [],
  strengths:          ${JSON.stringify(r?.pros.slice(0,3) ?? [])},
  weaknesses:         ${JSON.stringify(r?.cons.slice(0,2) ?? [])},
  strongSignals:      [],
  scores: { fit: 7, ease: 7, value: 7, productivity: 7, growth: 7 },
  shortDescription:   "${(r?.summary ?? item.rawDescription).slice(0, 120)}",
  whyRecommended:     "${r?.recommendationReason ?? ""}",
  notIdealFor:        [],
}`;
}
