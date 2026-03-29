"use client";

import { useState } from "react";
import type { RankingCardData } from "@/lib/ranking/types";

interface AdminRankingsData {
  weekly:     RankingCardData[];
  monthly:    RankingCardData[];
  yearly:     RankingCardData[];
  categories: Record<string, RankingCardData[]>;
  hiddenGems: RankingCardData[];
  lastUpdated: string;
  totalTools:  number;
}

export function RankingsAdminClient({ data }: { data: AdminRankingsData }) {
  const [refreshing, setRefreshing] = useState(false);
  const [lastResult, setLastResult] = useState<string | null>(null);
  const [activeView, setActiveView] = useState<"weekly" | "categories" | "gems">("weekly");

  async function handleRefresh() {
    setRefreshing(true);
    setLastResult(null);
    try {
      const res = await fetch("/api/admin/rankings/refresh", { method: "POST" });
      const json = await res.json();
      if (json.success) {
        setLastResult(`✓ Sıralamaları yeniden hesaplandı — ${new Date(json.generatedAt).toLocaleString("tr-TR")}`);
      } else {
        setLastResult(`✗ Hata: ${json.error ?? "Bilinmeyen hata"}`);
      }
    } catch (e) {
      setLastResult(`✗ Bağlantı hatası: ${String(e)}`);
    } finally {
      setRefreshing(false);
    }
  }

  const catList = Object.keys(data.categories).sort();

  return (
    <div className="flex flex-col gap-8">

      {/* Header + refresh */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold mb-1" style={{ color: "#0f172a" }}>Sıralama Yönetimi</h1>
          <p className="text-sm" style={{ color: "#64748b" }}>
            Son hesaplama: {new Date(data.lastUpdated).toLocaleString("tr-TR")}
          </p>
        </div>
        <div className="flex flex-col items-end gap-2">
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-opacity hover:opacity-90 disabled:opacity-60"
            style={{ backgroundColor: "#2563eb", color: "#ffffff" }}
          >
            {refreshing ? (
              <>
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24" aria-hidden>
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                </svg>
                Hesaplanıyor…
              </>
            ) : (
              <>
                <svg viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4" aria-hidden>
                  <path fillRule="evenodd" d="M13.836 2.477a.75.75 0 0 1 .75.75v3.182a.75.75 0 0 1-.75.75h-3.182a.75.75 0 0 1 0-1.5h1.37l-.84-.841a4.5 4.5 0 0 0-7.08.932.75.75 0 0 1-1.3-.75 6 6 0 0 1 9.46-1.243l.842.84V3.227a.75.75 0 0 1 .75-.75Zm-.911 7.5A.75.75 0 0 1 13.199 11a6 6 0 0 1-9.46 1.243l-.842-.84v1.181a.75.75 0 0 1-1.5 0V9.402a.75.75 0 0 1 .75-.75h3.182a.75.75 0 0 1 0 1.5H4.962l.84.841a4.5 4.5 0 0 0 7.08-.932.75.75 0 0 1 1.043-.184Z" clipRule="evenodd" />
                </svg>
                Sıralamayı Yenile
              </>
            )}
          </button>
          {lastResult && (
            <p
              className="text-xs font-semibold"
              style={{ color: lastResult.startsWith("✓") ? "#16a34a" : "#dc2626" }}
            >
              {lastResult}
            </p>
          )}
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Aktif araç",       value: data.totalTools },
          { label: "Haftalık top 10",  value: data.weekly.length },
          { label: "Kategori",         value: catList.length },
          { label: "Gizli güçler",     value: data.hiddenGems.length },
        ].map((s) => (
          <div key={s.label} className="rounded-xl px-4 py-3" style={{ border: "1px solid #e2e8f0", backgroundColor: "#f8fafc" }}>
            <p className="text-2xl font-black" style={{ color: "#0f172a" }}>{s.value}</p>
            <p className="text-xs" style={{ color: "#94a3b8" }}>{s.label}</p>
          </div>
        ))}
      </div>

      {/* Architecture note */}
      <div className="rounded-xl p-4" style={{ backgroundColor: "#fffbeb", border: "1px solid #fde68a" }}>
        <p className="text-xs font-bold mb-1" style={{ color: "#d97706" }}>Dinamik sistem — nasıl çalışır?</p>
        <p className="text-xs leading-relaxed" style={{ color: "#92400e" }}>
          Sıralamaları araç puanlarından otomatik hesaplayan bir motor çalışıyor. Sıralama verisi koda gömülü değil —
          motor, araç veritabanındaki puanları her hafta yeniden okuyarak haftalık / aylık / yıllık ve kategori bazlı
          sıralamaları üretiyor. "Sıralamayı Yenile" butonu motoru manuel tetikler. Cron job veya webhook ile
          haftada bir otomatik çağrılabilir.
        </p>
      </div>

      {/* View tabs */}
      <div className="flex gap-1 p-1 rounded-xl" style={{ backgroundColor: "#f1f5f9" }}>
        {(["weekly", "categories", "gems"] as const).map((v) => {
          const labels = { weekly: "Haftalık Top 10", categories: "Kategori Bazlı", gems: "Gizli Güçler" };
          const active = activeView === v;
          return (
            <button
              key={v}
              onClick={() => setActiveView(v)}
              className="flex-1 py-2 rounded-lg text-sm font-semibold transition-all duration-150"
              style={{
                backgroundColor: active ? "#ffffff" : "transparent",
                color:            active ? "#0f172a" : "#64748b",
                boxShadow:        active ? "0 1px 3px rgba(0,0,0,0.08)" : "none",
              }}
            >
              {labels[v]}
            </button>
          );
        })}
      </div>

      {/* Weekly ranking */}
      {activeView === "weekly" && (
        <div className="flex flex-col gap-3">
          <div className="grid grid-cols-[2rem_1fr_auto_auto] gap-3 px-2 text-xs font-bold uppercase tracking-wide" style={{ color: "#94a3b8" }}>
            <span>#</span><span>Araç</span><span className="text-right">Skor</span><span>Kategori</span>
          </div>
          {data.weekly.map((t) => (
            <div key={t.slug} className="grid grid-cols-[2rem_1fr_auto_auto] items-center gap-3 px-4 py-3 rounded-xl" style={{ border: "1px solid #e2e8f0" }}>
              <span className="text-sm font-black" style={{ color: t.rank <= 3 ? "#d97706" : "#94a3b8" }}>{t.rank}</span>
              <div>
                <p className="text-sm font-semibold" style={{ color: "#0f172a" }}>{t.name}</p>
                <p className="text-xs" style={{ color: "#94a3b8" }}>{t.tagline}</p>
              </div>
              <span className="text-sm font-bold tabular-nums" style={{ color: "#2563eb" }}>{t.compositeScore.toFixed(2)}</span>
              <span className="text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: "#f1f5f9", color: "#64748b" }}>{t.category}</span>
            </div>
          ))}
        </div>
      )}

      {/* Category rankings */}
      {activeView === "categories" && (
        <div className="flex flex-col gap-6">
          {catList.map((cat) => {
            const tools = data.categories[cat] ?? [];
            if (tools.length === 0) return null;
            return (
              <div key={cat}>
                <h3 className="text-sm font-bold mb-3 px-1" style={{ color: "#0f172a" }}>
                  {cat} <span style={{ color: "#94a3b8", fontWeight: 400 }}>({tools.length})</span>
                </h3>
                <div className="flex flex-col gap-2">
                  {tools.slice(0, 5).map((t) => (
                    <div key={t.slug} className="flex items-center gap-3 px-3 py-2 rounded-lg" style={{ border: "1px solid #f1f5f9" }}>
                      <span className="text-xs font-black w-5 text-center" style={{ color: "#94a3b8" }}>{t.rank}</span>
                      <span className="flex-1 text-sm font-semibold" style={{ color: "#0f172a" }}>{t.name}</span>
                      <span className="text-xs font-bold tabular-nums" style={{ color: "#2563eb" }}>{t.compositeScore.toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Hidden gems */}
      {activeView === "gems" && (
        <div className="flex flex-col gap-3">
          {data.hiddenGems.map((t) => (
            <div key={t.slug} className="flex items-center gap-4 px-4 py-3 rounded-xl" style={{ border: "1px solid #fde68a", backgroundColor: "#fffbeb" }}>
              <span className="text-xs font-black w-5 text-center" style={{ color: "#d97706" }}>{t.rank}</span>
              <div className="flex-1">
                <p className="text-sm font-semibold" style={{ color: "#0f172a" }}>{t.name}</p>
                <p className="text-xs" style={{ color: "#94a3b8" }}>{t.category} — {t.hiddenGemReason ?? "Gizli güç"}</p>
              </div>
              <span className="text-xs font-bold tabular-nums" style={{ color: "#d97706" }}>{t.compositeScore.toFixed(2)}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
