"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import type { Tool } from "@/data/schemas/tool";

/* ── Helpers ─────────────────────────────────────────────────────────────── */

const ALL = "Tümü";

const DIFFICULTY_LABEL: Record<Tool["difficultyLevel"], string> = {
  beginner:     "Kolay",
  intermediate: "Orta",
  advanced:     "İleri",
};

const TURKISH_LABEL: Record<Tool["turkishSupport"], { label: string; color: string }> = {
  full:    { label: "Türkçe tam",    color: "#16a34a" },
  partial: { label: "Kısmi Türkçe", color: "#d97706" },
  none:    { label: "Türkçe yok",   color: "#dc2626" },
};

const TIER_ORDER: Record<Tool["pricingTier"], number> = {
  free: 0, low: 1, mid: 2, high: 3, enterprise: 4,
};

/* ── Score bar ───────────────────────────────────────────────────────────── */

function ScoreBar({ score, color = "#2563eb" }: { score: number; color?: string }) {
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: "#f1f5f9" }}>
        <div className="h-full rounded-full" style={{ width: `${score * 10}%`, backgroundColor: color }} />
      </div>
      <span className="text-xs font-semibold w-6 text-right tabular-nums" style={{ color: "#475569" }}>
        {score.toFixed(1)}
      </span>
    </div>
  );
}

/* ── Tool card ───────────────────────────────────────────────────────────── */

function ToolCard({ tool }: { tool: Tool }) {
  const tr = TURKISH_LABEL[tool.turkishSupport];

  return (
    <Link
      href={`/tools/${tool.slug}`}
      className="group flex flex-col gap-4 p-5 rounded-2xl bg-white transition-all duration-150 hover:-translate-y-0.5 hover:shadow-lg"
      style={{ border: "1px solid #e2e8f0", boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}
    >
      {/* Header row */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="font-bold text-sm" style={{ color: "#0f172a" }}>{tool.name}</h3>
            {tool.hasFree && (
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded" style={{ backgroundColor: "#dcfce7", color: "#15803d" }}>
                Ücretsiz plan
              </span>
            )}
            {tool.status === "priority" && (
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded" style={{ backgroundColor: "#eff6ff", color: "#1d4ed8" }}>
                Öne çıkan
              </span>
            )}
          </div>
          <p className="text-xs mt-0.5" style={{ color: "#64748b" }}>{tool.tagline}</p>
        </div>

        {/* Score badge */}
        <div
          className="flex-shrink-0 flex flex-col items-center justify-center w-11 h-11 rounded-xl"
          style={{ backgroundColor: "#f8fafc", border: "1px solid #e2e8f0" }}
        >
          <span className="text-base font-black leading-none" style={{ color: "#0f172a" }}>
            {tool.editorialScore.toFixed(1)}
          </span>
          <span className="text-[9px] font-medium" style={{ color: "#94a3b8" }}>/ 10</span>
        </div>
      </div>

      {/* Score bars */}
      <div className="flex flex-col gap-1.5">
        <div className="grid grid-cols-2 gap-x-4 gap-y-1.5">
          {[
            { label: "İhtiyaç uyumu",    val: tool.scores.fitToNeed,          color: "#2563eb" },
            { label: "Kolaylık",          val: tool.scores.easeOfUse,          color: "#7c3aed" },
            { label: "Fiyat/performans",  val: tool.scores.priceValue,         color: "#16a34a" },
            { label: "Verimlilik",        val: tool.scores.productivityImpact, color: "#d97706" },
          ].map((s) => (
            <div key={s.label} className="flex flex-col gap-0.5">
              <span className="text-[10px]" style={{ color: "#94a3b8" }}>{s.label}</span>
              <ScoreBar score={s.val} color={s.color} />
            </div>
          ))}
        </div>
      </div>

      {/* Bottom row */}
      <div className="flex items-center justify-between flex-wrap gap-2 mt-auto">
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full" style={{ backgroundColor: "#f1f5f9", color: "#475569" }}>
            {tool.category}
          </span>
          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full" style={{ backgroundColor: "#f8fafc", color: tr.color }}>
            {tr.label}
          </span>
          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full" style={{ backgroundColor: "#f1f5f9", color: "#64748b" }}>
            {DIFFICULTY_LABEL[tool.difficultyLevel]}
          </span>
        </div>
        <span className="text-xs font-semibold transition-transform duration-200 group-hover:translate-x-0.5" style={{ color: "#2563eb" }}>
          İncele →
        </span>
      </div>
    </Link>
  );
}

/* ── Main client component ────────────────────────────────────────────────── */

export function ToolsPageClient({ tools }: { tools: Tool[] }) {
  const allCategories = useMemo(
    () => [ALL, ...Array.from(new Set(tools.map(t => t.category))).sort()],
    [tools]
  );

  const [activeCategory, setActiveCategory] = useState(ALL);
  const [search, setSearch]               = useState("");
  const [showFreeOnly, setShowFreeOnly]   = useState(false);
  const [sortBy, setSortBy]               = useState<"score" | "name" | "price">("score");

  const filtered = useMemo(() => {
    let list = tools.filter(t => t.status !== "deprecated");

    if (activeCategory !== ALL) {
      list = list.filter(t => t.category === activeCategory);
    }

    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(t =>
        t.name.toLowerCase().includes(q) ||
        t.tagline.toLowerCase().includes(q) ||
        t.category.toLowerCase().includes(q) ||
        t.subUseCases.some(u => u.toLowerCase().includes(q))
      );
    }

    if (showFreeOnly) {
      list = list.filter(t => t.hasFree);
    }

    return [...list].sort((a, b) => {
      if (sortBy === "score") return b.editorialScore - a.editorialScore;
      if (sortBy === "name")  return a.name.localeCompare(b.name);
      if (sortBy === "price") return TIER_ORDER[a.pricingTier] - TIER_ORDER[b.pricingTier];
      return 0;
    });
  }, [activeCategory, search, showFreeOnly, sortBy, tools]);

  const activeCount = tools.filter(t => t.status !== "deprecated").length;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 md:py-14">

      {/* Page header */}
      <div className="mb-10">
        <span
          className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-3"
          style={{ backgroundColor: "#eff6ff", color: "#2563eb", border: "1px solid #bfdbfe" }}
        >
          {activeCount} araç
        </span>
        <h1 className="text-3xl font-bold tracking-tight mb-2" style={{ color: "#0f172a" }}>
          Yapay Zekâ Araçları
        </h1>
        <p className="text-base" style={{ color: "#64748b" }}>
          Kategoriye göre filtrele, puanlara bak ve sana en uygun aracı keşfet.
        </p>
      </div>

      {/* Controls */}
      <div className="flex flex-col gap-4 mb-8">
        {/* Search + sort row */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none" viewBox="0 0 16 16" fill="currentColor" style={{ color: "#94a3b8" }} aria-hidden>
              <path d="M6.5 0a6.5 6.5 0 1 0 4.334 11.27l3.448 3.449a.75.75 0 1 0 1.06-1.06l-3.448-3.449A6.5 6.5 0 0 0 6.5 0ZM1.5 6.5a5 5 0 1 1 10 0 5 5 0 0 1-10 0Z" />
            </svg>
            <input
              type="search"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Araç, kategori veya kullanım alanı ara..."
              className="w-full pl-9 pr-4 py-2.5 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
              style={{ border: "1px solid #e2e8f0", backgroundColor: "#ffffff", color: "#0f172a" }}
            />
          </div>

          <div className="flex items-center gap-2">
            {/* Free filter */}
            <button
              onClick={() => setShowFreeOnly(v => !v)}
              className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-150"
              style={{
                border: `1px solid ${showFreeOnly ? "#16a34a" : "#e2e8f0"}`,
                backgroundColor: showFreeOnly ? "#f0fdf4" : "#ffffff",
                color: showFreeOnly ? "#15803d" : "#475569",
              }}
            >
              <svg viewBox="0 0 16 16" fill="currentColor" className="w-3.5 h-3.5" aria-hidden>
                <path fillRule="evenodd" d="M12.416 3.376a.75.75 0 0 1 .208 1.04l-5 7.5a.75.75 0 0 1-1.154.114l-3-3a.75.75 0 0 1 1.06-1.06l2.353 2.353 4.493-6.74a.75.75 0 0 1 1.04-.207Z" clipRule="evenodd" />
              </svg>
              Ücretsiz plan
            </button>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value as typeof sortBy)}
              className="px-3.5 py-2.5 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-200"
              style={{ border: "1px solid #e2e8f0", backgroundColor: "#ffffff", color: "#475569" }}
            >
              <option value="score">Puana göre</option>
              <option value="name">İsme göre</option>
              <option value="price">Fiyata göre</option>
            </select>
          </div>
        </div>

        {/* Category pills */}
        <div id="kategoriler" className="flex flex-wrap gap-2">
          {allCategories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className="px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-150"
              style={{
                border: `1px solid ${activeCategory === cat ? "#2563eb" : "#e2e8f0"}`,
                backgroundColor: activeCategory === cat ? "#eff6ff" : "#ffffff",
                color: activeCategory === cat ? "#1d4ed8" : "#64748b",
              }}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Results count */}
      <p className="text-xs mb-4 font-medium" style={{ color: "#94a3b8" }}>
        {filtered.length} araç gösteriliyor
      </p>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 gap-3">
          <p className="text-base font-semibold" style={{ color: "#64748b" }}>Sonuç bulunamadı</p>
          <p className="text-sm" style={{ color: "#94a3b8" }}>Farklı bir kategori veya arama terimi deneyin.</p>
          <button
            onClick={() => { setSearch(""); setActiveCategory(ALL); setShowFreeOnly(false); }}
            className="mt-2 px-4 py-2 rounded-xl text-sm font-semibold"
            style={{ backgroundColor: "#eff6ff", color: "#2563eb" }}
          >
            Filtreleri temizle
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(tool => (
            <ToolCard key={tool.slug} tool={tool} />
          ))}
        </div>
      )}

      {/* Analyze CTA */}
      <div
        className="mt-12 rounded-2xl p-8 flex flex-col sm:flex-row items-center gap-6 justify-between"
        style={{ backgroundColor: "#f8fafc", border: "1px solid #e2e8f0" }}
      >
        <div>
          <p className="font-bold text-base mb-1" style={{ color: "#0f172a" }}>
            Hangi araç sana uygun bilmiyorsun?
          </p>
          <p className="text-sm" style={{ color: "#64748b" }}>
            2 dakikalık analiz ile bağlamına özel öneri al.
          </p>
        </div>
        <Link
          href="/analyze"
          className="flex-shrink-0 inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm transition-opacity hover:opacity-90"
          style={{ backgroundColor: "#2563eb", color: "#ffffff" }}
        >
          Analizi başlat →
        </Link>
      </div>
    </div>
  );
}
