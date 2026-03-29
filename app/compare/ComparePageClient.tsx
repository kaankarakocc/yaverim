"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import type { Tool } from "@/data/schemas/tool";

/* ── Config ──────────────────────────────────────────────────────────────── */

const SCORE_AXES = [
  { key: "fitToNeed",          label: "İhtiyaç uyumu",      color: "#2563eb" },
  { key: "easeOfUse",          label: "Kullanım kolaylığı", color: "#7c3aed" },
  { key: "priceValue",         label: "Fiyat / performans", color: "#16a34a" },
  { key: "productivityImpact", label: "Verimlilik etkisi",  color: "#d97706" },
  { key: "growthImpact",       label: "Büyüme etkisi",      color: "#0891b2" },
  { key: "integrationFit",     label: "Entegrasyon uyumu",  color: "#7c3aed" },
] as const;

const DIFFICULTY_LABEL: Record<Tool["difficultyLevel"], string> = {
  beginner: "Kolay", intermediate: "Orta", advanced: "İleri",
};
const TURKISH_LABEL: Record<Tool["turkishSupport"], string> = {
  full: "Tam Türkçe", partial: "Kısmi Türkçe", none: "Türkçe yok",
};
const TIER_LABEL: Record<Tool["pricingTier"], string> = {
  free: "Ücretsiz", low: "Düşük", mid: "Orta", high: "Yüksek", enterprise: "Kurumsal",
};

/* ── Tool selector ───────────────────────────────────────────────────────── */

function ToolSelector({
  value,
  onChange,
  exclude,
  label,
  tools,
}: {
  value: Tool | null;
  onChange: (t: Tool | null) => void;
  exclude: string[];
  label: string;
  tools: Tool[];
}) {
  const [open, setOpen]     = useState(false);
  const [search, setSearch] = useState("");

  const options = useMemo(
    () =>
      tools
        .filter(t => !exclude.includes(t.slug) && t.name.toLowerCase().includes(search.toLowerCase()))
        .sort((a, b) => b.editorialScore - a.editorialScore),
    [exclude, search, tools]
  );

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(v => !v)}
        className="w-full flex items-center justify-between gap-3 p-4 rounded-2xl transition-all duration-150"
        style={{
          border: `1px solid ${value ? "#bfdbfe" : "#e2e8f0"}`,
          backgroundColor: value ? "#eff6ff" : "#f8fafc",
        }}
      >
        <div className="flex items-center gap-3 min-w-0">
          <div
            className="flex-shrink-0 w-9 h-9 rounded-xl flex items-center justify-center text-sm font-black"
            style={{ backgroundColor: value ? "#dbeafe" : "#e2e8f0", color: value ? "#1d4ed8" : "#94a3b8" }}
          >
            {value ? value.name[0] : "?"}
          </div>
          <div className="min-w-0 text-left">
            <p className="text-sm font-semibold truncate" style={{ color: value ? "#0f172a" : "#94a3b8" }}>
              {value ? value.name : label}
            </p>
            {value && (
              <p className="text-xs truncate" style={{ color: "#64748b" }}>{value.tagline}</p>
            )}
          </div>
        </div>
        <svg viewBox="0 0 16 16" fill="currentColor" className={`w-4 h-4 flex-shrink-0 transition-transform ${open ? "rotate-180" : ""}`} style={{ color: "#94a3b8" }} aria-hidden>
          <path d="M8 10.94L2.53 5.47a.75.75 0 0 1 1.06-1.06L8 8.82l4.41-4.41a.75.75 0 1 1 1.06 1.06L8 10.94z" />
        </svg>
      </button>

      {open && (
        <div
          className="absolute z-50 mt-2 w-full rounded-2xl overflow-hidden"
          style={{ border: "1px solid #e2e8f0", backgroundColor: "#ffffff", boxShadow: "0 8px 32px rgba(0,0,0,0.08)" }}
        >
          <div className="p-3" style={{ borderBottom: "1px solid #f1f5f9" }}>
            <input
              autoFocus
              type="search"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Araç ara..."
              className="w-full px-3 py-2 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
              style={{ border: "1px solid #e2e8f0", color: "#0f172a" }}
            />
          </div>
          <div className="max-h-64 overflow-y-auto">
            {value && (
              <button
                onClick={() => { onChange(null); setOpen(false); setSearch(""); }}
                className="w-full flex items-center gap-2 px-4 py-2.5 text-sm transition-colors hover:bg-slate-50"
                style={{ color: "#dc2626" }}
              >
                <span aria-hidden>×</span> Seçimi kaldır
              </button>
            )}
            {options.length === 0 && (
              <p className="text-sm text-center py-6" style={{ color: "#94a3b8" }}>Araç bulunamadı</p>
            )}
            {options.map(t => (
              <button
                key={t.slug}
                onClick={() => { onChange(t); setOpen(false); setSearch(""); }}
                className="w-full flex items-center justify-between gap-3 px-4 py-2.5 text-sm transition-colors hover:bg-slate-50"
              >
                <div className="text-left">
                  <p className="font-semibold" style={{ color: "#0f172a" }}>{t.name}</p>
                  <p className="text-xs" style={{ color: "#64748b" }}>{t.category}</p>
                </div>
                <span className="flex-shrink-0 text-xs font-bold" style={{ color: "#2563eb" }}>
                  {t.editorialScore.toFixed(1)}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/* ── Comparison row ──────────────────────────────────────────────────────── */

function CompareRow({
  label,
  left,
  right,
  winner,
}: {
  label: string;
  left: React.ReactNode;
  right: React.ReactNode;
  winner?: "left" | "right" | "tie";
}) {
  return (
    <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-4 py-3" style={{ borderBottom: "1px solid #f1f5f9" }}>
      <div className={`text-sm ${winner === "left" ? "font-bold" : ""}`} style={{ color: winner === "left" ? "#0f172a" : "#64748b" }}>
        {left}
      </div>
      <span className="text-xs font-semibold w-28 text-center" style={{ color: "#94a3b8" }}>{label}</span>
      <div className={`text-sm text-right ${winner === "right" ? "font-bold" : ""}`} style={{ color: winner === "right" ? "#0f172a" : "#64748b" }}>
        {right}
      </div>
    </div>
  );
}

function ScoreCompareRow({ label, color, leftVal, rightVal }: { label: string; color: string; leftVal: number; rightVal: number }) {
  const winner = leftVal > rightVal + 0.3 ? "left" : rightVal > leftVal + 0.3 ? "right" : "tie";
  return (
    <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-4 py-3" style={{ borderBottom: "1px solid #f1f5f9" }}>
      <div className="flex items-center gap-2">
        <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ backgroundColor: "#f1f5f9" }}>
          <div className="h-full rounded-full" style={{ width: `${leftVal * 10}%`, backgroundColor: color }} />
        </div>
        <span className="text-xs font-bold w-6 tabular-nums text-right" style={{ color: winner === "left" ? "#0f172a" : "#94a3b8" }}>
          {leftVal.toFixed(1)}
        </span>
      </div>
      <span className="text-xs font-semibold w-28 text-center" style={{ color: "#94a3b8" }}>{label}</span>
      <div className="flex items-center gap-2">
        <span className="text-xs font-bold w-6 tabular-nums" style={{ color: winner === "right" ? "#0f172a" : "#94a3b8" }}>
          {rightVal.toFixed(1)}
        </span>
        <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ backgroundColor: "#f1f5f9" }}>
          <div className="h-full rounded-full ml-auto" style={{ width: `${rightVal * 10}%`, backgroundColor: color }} />
        </div>
      </div>
    </div>
  );
}

/* ── Main component ──────────────────────────────────────────────────────── */

export function ComparePageClient({ tools }: { tools: Tool[] }) {
  const searchParams = useSearchParams();

  const [toolA, setToolA] = useState<Tool | null>(null);
  const [toolB, setToolB] = useState<Tool | null>(null);

  // Pre-populate from URL: /compare?tools=chatgpt,claude
  useEffect(() => {
    const param = searchParams.get("tools");
    if (!param) return;
    const slugs = param.split(",").slice(0, 2);
    const [a, b] = slugs.map(s => tools.find(t => t.slug === s) ?? null);
    if (a) setToolA(a);
    if (b) setToolB(b);
  }, [searchParams, tools]);

  const ready = toolA !== null && toolB !== null;

  const verdict = useMemo(() => {
    if (!ready) return null;
    const scoreA = SCORE_AXES.reduce((sum, ax) => sum + toolA!.scores[ax.key], 0);
    const scoreB = SCORE_AXES.reduce((sum, ax) => sum + toolB!.scores[ax.key], 0);
    if (scoreA > scoreB + 0.5) return "A";
    if (scoreB > scoreA + 0.5) return "B";
    return "tie";
  }, [toolA, toolB, ready]);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 md:py-14">

      {/* Header */}
      <div className="mb-10">
        <span
          className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-3"
          style={{ backgroundColor: "#f5f3ff", color: "#7c3aed", border: "1px solid #ddd6fe" }}
        >
          Karşılaştırma
        </span>
        <h1 className="text-3xl font-bold tracking-tight mb-2" style={{ color: "#0f172a" }}>
          Araçları Karşılaştır
        </h1>
        <p className="text-base" style={{ color: "#64748b" }}>
          İki aracı tüm skor eksenlerinde yan yana gör, doğru kararı ver.
        </p>
      </div>

      {/* Selectors */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
        <ToolSelector
          value={toolA}
          onChange={setToolA}
          exclude={toolB ? [toolB.slug] : []}
          label="Birinci aracı seç"
          tools={tools}
        />
        <ToolSelector
          value={toolB}
          onChange={setToolB}
          exclude={toolA ? [toolA.slug] : []}
          label="İkinci aracı seç"
          tools={tools}
        />
      </div>

      {/* Placeholder when nothing selected */}
      {!ready && (
        <div
          className="rounded-2xl flex flex-col items-center justify-center py-20 gap-4"
          style={{ border: "1px dashed #e2e8f0", backgroundColor: "#f8fafc" }}
        >
          <svg viewBox="0 0 48 48" fill="none" className="w-12 h-12" style={{ color: "#cbd5e1" }} aria-hidden>
            <rect x="4" y="10" width="18" height="28" rx="4" stroke="currentColor" strokeWidth="2" />
            <rect x="26" y="10" width="18" height="28" rx="4" stroke="currentColor" strokeWidth="2" />
            <path d="M24 18v12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
          <p className="text-base font-semibold" style={{ color: "#94a3b8" }}>İki araç seç ve karşılaştırmayı başlat</p>
          <p className="text-sm" style={{ color: "#cbd5e1" }}>Yukarıdaki seçicilerden her iki aracı seç</p>
        </div>
      )}

      {/* Comparison table */}
      {ready && toolA && toolB && (
        <div className="flex flex-col gap-6">

          {/* Verdict banner */}
          {verdict && verdict !== "tie" && (
            <div
              className="rounded-2xl p-5 flex items-center gap-4"
              style={{ backgroundColor: "#f0fdf4", border: "1px solid #bbf7d0" }}
            >
              <svg viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 flex-shrink-0" style={{ color: "#16a34a" }} aria-hidden>
                <path fillRule="evenodd" d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm3.857-9.809a.75.75 0 0 0-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 1 0-1.06 1.061l2.5 2.5a.75.75 0 0 0 1.137-.089l4-5.5Z" clipRule="evenodd" />
              </svg>
              <p className="text-sm font-semibold" style={{ color: "#15803d" }}>
                Genel skor karşılaştırmasında <strong>{verdict === "A" ? toolA.name : toolB.name}</strong> öne çıkıyor.
                {" "}Senin bağlamına en uygun olanı için{" "}
                <Link href="/analyze" style={{ color: "#15803d", textDecoration: "underline" }}>analizi başlat →</Link>
              </p>
            </div>
          )}
          {verdict === "tie" && (
            <div className="rounded-2xl p-5" style={{ backgroundColor: "#fefce8", border: "1px solid #fde68a" }}>
              <p className="text-sm font-semibold" style={{ color: "#d97706" }}>
                İki araç birbirine çok yakın puanlar alıyor. Bağlamına göre fark büyüyebilir —{" "}
                <Link href="/analyze" style={{ color: "#d97706", textDecoration: "underline" }}>analizi başlat →</Link>
              </p>
            </div>
          )}

          {/* Score axes */}
          <div className="rounded-2xl overflow-hidden" style={{ border: "1px solid #e2e8f0" }}>
            <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-4 px-5 py-4" style={{ backgroundColor: "#f8fafc", borderBottom: "1px solid #e2e8f0" }}>
              <div className="flex flex-col gap-1">
                <span className="font-bold text-sm" style={{ color: "#0f172a" }}>{toolA.name}</span>
                <span className="text-xs" style={{ color: "#64748b" }}>{toolA.category}</span>
              </div>
              <div className="w-28 text-center">
                <span className="text-xs font-bold uppercase tracking-wider" style={{ color: "#94a3b8" }}>Karşılaştırma</span>
              </div>
              <div className="flex flex-col gap-1 text-right">
                <span className="font-bold text-sm" style={{ color: "#0f172a" }}>{toolB.name}</span>
                <span className="text-xs" style={{ color: "#64748b" }}>{toolB.category}</span>
              </div>
            </div>

            <div className="px-5">
              <CompareRow
                label="Genel skor"
                left={<span className="text-lg font-black">{toolA.editorialScore.toFixed(1)}</span>}
                right={<span className="text-lg font-black">{toolB.editorialScore.toFixed(1)}</span>}
                winner={
                  toolA.editorialScore > toolB.editorialScore ? "left" :
                  toolB.editorialScore > toolA.editorialScore ? "right" : "tie"
                }
              />
              {SCORE_AXES.map(axis => (
                <ScoreCompareRow
                  key={axis.key}
                  label={axis.label}
                  color={axis.color}
                  leftVal={toolA.scores[axis.key]}
                  rightVal={toolB.scores[axis.key]}
                />
              ))}
            </div>
          </div>

          {/* Feature comparison */}
          <div className="rounded-2xl overflow-hidden" style={{ border: "1px solid #e2e8f0" }}>
            <div className="px-5 py-4" style={{ backgroundColor: "#f8fafc", borderBottom: "1px solid #e2e8f0" }}>
              <h2 className="text-sm font-bold" style={{ color: "#0f172a" }}>Özellik karşılaştırması</h2>
            </div>
            <div className="px-5">
              <CompareRow label="Ücretsiz plan"    left={toolA.hasFree  ? "✓ Var" : "× Yok"} right={toolB.hasFree  ? "✓ Var" : "× Yok"} winner={toolA.hasFree && !toolB.hasFree ? "left" : !toolA.hasFree && toolB.hasFree ? "right" : "tie"} />
              <CompareRow label="Ücretsiz deneme"  left={toolA.hasTrial ? "✓ Var" : "× Yok"} right={toolB.hasTrial ? "✓ Var" : "× Yok"} winner={toolA.hasTrial && !toolB.hasTrial ? "left" : !toolA.hasTrial && toolB.hasTrial ? "right" : "tie"} />
              <CompareRow label="Fiyat seviyesi"   left={TIER_LABEL[toolA.pricingTier]}  right={TIER_LABEL[toolB.pricingTier]} />
              <CompareRow label="Kullanım kolaylığı" left={DIFFICULTY_LABEL[toolA.difficultyLevel]} right={DIFFICULTY_LABEL[toolB.difficultyLevel]} winner={toolA.difficultyLevel === "beginner" && toolB.difficultyLevel !== "beginner" ? "left" : toolB.difficultyLevel === "beginner" && toolA.difficultyLevel !== "beginner" ? "right" : "tie"} />
              <CompareRow label="Türkçe desteği"   left={TURKISH_LABEL[toolA.turkishSupport]} right={TURKISH_LABEL[toolB.turkishSupport]} winner={toolA.turkishSupport === "full" && toolB.turkishSupport !== "full" ? "left" : toolB.turkishSupport === "full" && toolA.turkishSupport !== "full" ? "right" : toolA.turkishSupport === "partial" && toolB.turkishSupport === "none" ? "left" : toolB.turkishSupport === "partial" && toolA.turkishSupport === "none" ? "right" : "tie"} />
              <CompareRow label="Fiyat"             left={toolA.pricingLabel} right={toolB.pricingLabel} />
            </div>
          </div>

          {/* Strengths side by side */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {([toolA, toolB] as Tool[]).map(tool => (
              <div key={tool.slug} className="rounded-2xl p-5" style={{ border: "1px solid #e2e8f0" }}>
                <h3 className="text-sm font-bold mb-3" style={{ color: "#0f172a" }}>
                  {tool.name} — güçlü yönler
                </h3>
                <ul className="flex flex-col gap-2">
                  {tool.strengths.slice(0, 3).map((s, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="flex-shrink-0 mt-1 w-1 h-1 rounded-full" style={{ backgroundColor: "#2563eb" }} aria-hidden />
                      <span className="text-xs leading-relaxed" style={{ color: "#475569" }}>{s}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* CTAs */}
          <div
            className="rounded-2xl p-6 flex flex-col sm:flex-row items-center gap-5 justify-between"
            style={{ backgroundColor: "#f8fafc", border: "1px solid #e2e8f0" }}
          >
            <div>
              <p className="font-bold text-sm mb-1" style={{ color: "#0f172a" }}>
                Hangisinin sana uygun olduğundan emin değil misin?
              </p>
              <p className="text-xs" style={{ color: "#64748b" }}>
                2 dakikalık analiz, bağlamına özel öneri üretir.
              </p>
            </div>
            <div className="flex gap-3 flex-shrink-0">
              <Link
                href="/tools"
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors hover:bg-slate-100"
                style={{ border: "1px solid #e2e8f0", color: "#475569", backgroundColor: "#ffffff" }}
              >
                Tüm araçlar
              </Link>
              <Link
                href="/analyze"
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-semibold transition-opacity hover:opacity-90"
                style={{ backgroundColor: "#2563eb", color: "#ffffff" }}
              >
                Analizi başlat →
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
