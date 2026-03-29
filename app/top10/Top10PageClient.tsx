"use client";

import { useState } from "react";
import Link from "next/link";
import { ToolLogo } from "@/components/common/ToolLogo";
import type { RankingCardData } from "@/lib/ranking/types";

/* ─── Tab config ─────────────────────────────────────────────────────────── */

type PeriodTab = "weekly" | "monthly" | "yearly";
type MainTab   = "overall" | "category" | "hidden-gems";

/* ─── Rank badge ─────────────────────────────────────────────────────────── */

function RankBadge({ rank }: { rank: number }) {
  const config =
    rank === 1 ? { bg: "#b45309", color: "#ffffff", label: "Altın" } :
    rank === 2 ? { bg: "#475569", color: "#ffffff", label: "Gümüş" } :
    rank === 3 ? { bg: "#7c4a16", color: "#ffffff", label: "Bronz" } :
    { bg: "#f1f5f9", color: "#475569", label: null };

  return (
    <div
      className="flex-shrink-0 flex flex-col items-center justify-center w-12 self-stretch"
      style={{ backgroundColor: config.bg }}
      aria-label={`Sıralama: ${rank}`}
    >
      <span className="text-lg font-black tabular-nums leading-none" style={{ color: config.color }}>
        {rank}
      </span>
      {config.label && (
        <span className="text-[8px] font-bold uppercase tracking-wide mt-0.5" style={{ color: config.color + "cc" }}>
          {config.label}
        </span>
      )}
    </div>
  );
}

/* ─── Ranking card ───────────────────────────────────────────────────────── */

function RankingCard({ tool, showGemReason }: { tool: RankingCardData; showGemReason?: boolean }) {
  const isHighScore = tool.compositeScore >= 9.0;

  return (
    <article
      className="group flex items-stretch rounded-xl overflow-hidden transition-all duration-150 hover:shadow-md"
      style={{ border: "1px solid #e2e8f0", backgroundColor: "#ffffff" }}
    >
      <RankBadge rank={tool.rank} />

      <div className="flex-1 min-w-0 flex items-start gap-3 px-5 py-4">
        <ToolLogo name={tool.name} websiteUrl={tool.websiteUrl} size={36} />

        <div className="flex-1 min-w-0 flex flex-col gap-2">
        <div className="flex items-start justify-between gap-3 flex-wrap">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3
                className="font-bold leading-snug transition-colors group-hover:text-blue-600"
                style={{ color: "#0f172a", fontSize: "0.95rem" }}
              >
                {tool.name}
              </h3>
              {tool.isSponsored && (
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded" style={{ backgroundColor: "#fef9c3", color: "#a16207" }}>
                  Sponsorlu
                </span>
              )}
              {tool.hasFree && (
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded" style={{ backgroundColor: "#dcfce7", color: "#15803d" }}>
                  Ücretsiz plan
                </span>
              )}
            </div>
            <p className="text-xs mt-0.5" style={{ color: "#94a3b8" }}>{tool.tagline}</p>
          </div>

          {/* Score badge */}
          <div
            className="flex-shrink-0 flex flex-col items-center justify-center w-11 h-11 rounded-xl"
            style={isHighScore
              ? { backgroundColor: "#eff6ff", border: "1.5px solid #bfdbfe" }
              : { backgroundColor: "#f8fafc", border: "1.5px solid #e2e8f0" }
            }
          >
            <span className="text-sm font-black tabular-nums leading-none" style={{ color: isHighScore ? "#1d4ed8" : "#475569" }}>
              {tool.compositeScore.toFixed(1)}
            </span>
            <span className="text-[9px] leading-none mt-0.5" style={{ color: isHighScore ? "#93c5fd" : "#94a3b8" }}>
              / 10
            </span>
          </div>
        </div>

        <p className="text-sm leading-relaxed" style={{ color: "#475569" }}>
          <span className="font-semibold" style={{ color: "#334155" }}>En güçlü alan: </span>
          {tool.strongestUseCase}
        </p>

        {/* Hidden gem reason */}
        {showGemReason && tool.hiddenGemReason && (
          <div
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold"
            style={{ backgroundColor: "#fef3c7", color: "#d97706", border: "1px solid #fde68a" }}
          >
            <span aria-hidden>💎</span>
            {tool.hiddenGemReason}
          </div>
        )}

        {/* Context note */}
        {tool.contextNote && !showGemReason && (
          <p className="text-xs italic" style={{ color: "#94a3b8" }}>{tool.contextNote}</p>
        )}

        {/* Signals */}
        <div className="flex flex-wrap gap-1.5 mt-0.5">
          {tool.signals.map((s) => (
            <span key={s} className="text-[11px] px-2 py-0.5 rounded-full" style={{ backgroundColor: "#f1f5f9", color: "#475569" }}>
              {s}
            </span>
          ))}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-4 pt-0.5">
          <Link href={`/tools/${tool.slug}`} className="text-sm font-semibold transition-colors hover:text-blue-700" style={{ color: "#2563eb" }}>
            İncele →
          </Link>
          <Link href={`/compare?tools=${tool.slug}`} className="text-sm transition-colors hover:text-slate-600" style={{ color: "#94a3b8" }}>
            Karşılaştır
          </Link>
        </div>
        </div>{/* end inner content */}
      </div>
    </article>
  );
}

/* ─── Empty state ────────────────────────────────────────────────────────── */

function EmptyState({ message }: { message?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 gap-3 rounded-2xl" style={{ border: "1px dashed #e2e8f0" }}>
      <p className="text-sm font-semibold" style={{ color: "#94a3b8" }}>
        {message ?? "Bu kategori için yeterli araç yok."}
      </p>
    </div>
  );
}

/* ─── Props from server ──────────────────────────────────────────────────── */

export interface Top10PageData {
  weekly:     RankingCardData[];
  monthly:    RankingCardData[];
  yearly:     RankingCardData[];
  categories: Record<string, RankingCardData[]>;
  hiddenGems: RankingCardData[];
  lastUpdated: string;
}

/* ─── Main component ─────────────────────────────────────────────────────── */

export function Top10PageClient({ data }: { data: Top10PageData }) {
  const [mainTab, setMainTab]       = useState<MainTab>("overall");
  const [periodTab, setPeriodTab]   = useState<PeriodTab>("weekly");
  const [activeCategory, setActiveCategory] = useState<string>(
    Object.keys(data.categories)[0] ?? ""
  );

  const PERIOD_LABELS: Record<PeriodTab, string> = {
    weekly:  "Bu Hafta",
    monthly: "Bu Ay",
    yearly:  "Bu Yıl",
  };

  const activeOverall =
    periodTab === "weekly"  ? data.weekly  :
    periodTab === "monthly" ? data.monthly :
    data.yearly;

  const categoryList = Object.keys(data.categories).sort();

  const lastUpdated = new Date(data.lastUpdated).toLocaleDateString("tr-TR", {
    day: "numeric", month: "long", year: "numeric",
  });

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 md:py-14">

      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between flex-wrap gap-3 mb-2">
          <div>
            <span
              className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-3"
              style={{ backgroundColor: "#eff6ff", color: "#2563eb", border: "1px solid #bfdbfe" }}
            >
              Dinamik sıralama
            </span>
            <h1 className="text-3xl font-bold tracking-tight" style={{ color: "#0f172a" }}>
              Top 10 Yapay Zekâ Araçları
            </h1>
          </div>
          <div className="text-right">
            <p className="text-xs" style={{ color: "#94a3b8" }}>Son güncelleme</p>
            <p className="text-sm font-semibold" style={{ color: "#475569" }}>{lastUpdated}</p>
          </div>
        </div>
        <p className="text-sm" style={{ color: "#64748b" }}>
          Skor editoryal bağımsızlıkla hesaplanır. Sponsorlu araçlar ayrıca etiketlenir.
        </p>
      </div>

      {/* Main tabs */}
      <div
        className="flex gap-1 p-1 rounded-xl mb-6"
        style={{ backgroundColor: "#f1f5f9" }}
        role="tablist"
        aria-label="Sıralama türü"
      >
        {(["overall", "category", "hidden-gems"] as MainTab[]).map((tab) => {
          const labels = { overall: "Genel", category: "Kategoriler", "hidden-gems": "💎 Gizli Güçler" };
          const active = mainTab === tab;
          return (
            <button
              key={tab}
              role="tab"
              aria-selected={active}
              onClick={() => setMainTab(tab)}
              className="flex-1 py-2 rounded-lg text-sm font-semibold transition-all duration-150"
              style={{
                backgroundColor: active ? "#ffffff" : "transparent",
                color:            active ? "#0f172a" : "#64748b",
                boxShadow:        active ? "0 1px 3px rgba(0,0,0,0.08)" : "none",
              }}
            >
              {labels[tab]}
            </button>
          );
        })}
      </div>

      {/* ── OVERALL tab ── */}
      {mainTab === "overall" && (
        <div className="flex flex-col gap-4">
          {/* Period pills */}
          <div className="flex gap-2">
            {(["weekly", "monthly", "yearly"] as PeriodTab[]).map((p) => (
              <button
                key={p}
                onClick={() => setPeriodTab(p)}
                className="px-3.5 py-1.5 rounded-full text-xs font-bold transition-all duration-150"
                style={{
                  border:          `1px solid ${periodTab === p ? "#2563eb" : "#e2e8f0"}`,
                  backgroundColor: periodTab === p ? "#eff6ff" : "#ffffff",
                  color:           periodTab === p ? "#1d4ed8" : "#64748b",
                }}
              >
                {PERIOD_LABELS[p]}
              </button>
            ))}
          </div>

          {/* Ranking info note */}
          <p className="text-xs" style={{ color: "#94a3b8" }}>
            {periodTab === "weekly"  && "Bu haftanın tüm kategorilerdeki en yüksek puanlı araçları."}
            {periodTab === "monthly" && "Bu ayın tutarlı en yüksek performans gösterenleri."}
            {periodTab === "yearly"  && "Yılın genel en güçlü araçları — editoryal ve skor bazlı."}
          </p>

          {activeOverall.length === 0
            ? <EmptyState />
            : activeOverall.map((tool) => (
                <RankingCard key={tool.slug} tool={tool} />
              ))
          }
        </div>
      )}

      {/* ── CATEGORY tab ── */}
      {mainTab === "category" && (
        <div className="flex flex-col gap-4">
          {/* Category pills */}
          <div className="flex flex-wrap gap-2">
            {categoryList.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className="px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-150"
                style={{
                  border:          `1px solid ${activeCategory === cat ? "#2563eb" : "#e2e8f0"}`,
                  backgroundColor: activeCategory === cat ? "#eff6ff" : "#ffffff",
                  color:           activeCategory === cat ? "#1d4ed8" : "#64748b",
                }}
              >
                {cat}
              </button>
            ))}
          </div>

          {activeCategory && (
            <>
              <p className="text-xs" style={{ color: "#94a3b8" }}>
                <strong style={{ color: "#475569" }}>{activeCategory}</strong> kategorisindeki en güçlü araçlar
              </p>
              {(data.categories[activeCategory] ?? []).length === 0
                ? <EmptyState message="Bu kategoride henüz yeterli araç yok." />
                : (data.categories[activeCategory] ?? []).map((tool) => (
                    <RankingCard key={tool.slug} tool={tool} />
                  ))
              }
            </>
          )}
        </div>
      )}

      {/* ── HIDDEN GEMS tab ── */}
      {mainTab === "hidden-gems" && (
        <div className="flex flex-col gap-4">
          <div
            className="rounded-xl p-4 flex items-start gap-3"
            style={{ backgroundColor: "#fffbeb", border: "1px solid #fde68a" }}
          >
            <span className="text-xl flex-shrink-0" aria-hidden>💎</span>
            <div>
              <p className="text-sm font-bold mb-0.5" style={{ color: "#d97706" }}>
                Gizli Güçler
              </p>
              <p className="text-xs leading-relaxed" style={{ color: "#92400e" }}>
                Genel top 10'a girmemiş ama belirli alanlarda çok güçlü olan, az bilinen araçlar.
                Bağlamına göre bunlardan biri sana daha uygun olabilir.
              </p>
            </div>
          </div>

          {data.hiddenGems.length === 0
            ? <EmptyState message="Gizli güçler hesaplanıyor..." />
            : data.hiddenGems.map((tool) => (
                <RankingCard key={tool.slug} tool={tool} showGemReason />
              ))
          }
        </div>
      )}

      {/* Bottom CTA */}
      <div
        className="mt-10 rounded-2xl p-6 flex flex-col sm:flex-row items-center gap-5 justify-between"
        style={{ backgroundColor: "#f8fafc", border: "1px solid #e2e8f0" }}
      >
        <div>
          <p className="font-bold text-sm mb-1" style={{ color: "#0f172a" }}>
            Hangi araç sana uygun biliyor musun?
          </p>
          <p className="text-xs" style={{ color: "#64748b" }}>
            Sıralamalar genel — sana özel öneri için analizi başlat.
          </p>
        </div>
        <Link
          href="/analyze"
          className="flex-shrink-0 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-opacity hover:opacity-90"
          style={{ backgroundColor: "#2563eb", color: "#ffffff" }}
        >
          Analizi başlat →
        </Link>
      </div>
    </div>
  );
}
