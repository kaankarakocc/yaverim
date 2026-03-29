import type { PlanSummaryData } from "@/lib/recommendation/premium-engine";

export function PlanSummary({ summary }: { summary: PlanSummaryData }) {
  return (
    <div className="rounded-2xl overflow-hidden" style={{ border: "1px solid #e2e8f0" }}>
      {/* Main message */}
      <div className="px-6 py-6" style={{ backgroundColor: "#f8fafc" }}>
        <p className="text-xs font-bold uppercase tracking-[0.08em] mb-2" style={{ color: "#94a3b8" }}>
          Plan özeti
        </p>
        <h2 className="text-xl font-semibold leading-snug mb-3" style={{ color: "#0f172a" }}>
          {summary.headline}
        </h2>
        <p className="text-sm leading-relaxed" style={{ color: "#475569" }}>
          {summary.keyInsight}
        </p>
      </div>

      {/*
        Stats strip — 3 hücre, subgrid ile hizalı.
        Her hücre içeriği ortalanmış (items-center text-center).
      */}
      <div
        className="grid grid-cols-3"
        style={{ borderTop: "1px solid #e2e8f0" }}
      >
        <StatCell label="İlk kritik adım" value={summary.criticalFirstStep} accent />
        <StatCell label="İlk sonuç"       value={summary.timeToFirstResult} />
        <StatCell label="Toplam aşama"    value={`${summary.totalStages} aşama`} highlight />
      </div>
    </div>
  );
}

function StatCell({
  label,
  value,
  accent,
  highlight,
}: {
  label: string;
  value: string;
  accent?: boolean;
  highlight?: boolean;
}) {
  return (
    <div
      className="flex flex-col items-center justify-center text-center gap-1.5 px-4 py-5"
      style={{ borderRight: "1px solid #e2e8f0" }}
    >
      <span
        className="text-[10px] font-bold uppercase tracking-[0.08em]"
        style={{ color: "#94a3b8" }}
      >
        {label}
      </span>

      {highlight ? (
        /* Pill badge for "X aşama" */
        <span
          className="inline-flex items-center justify-center px-3 py-1 rounded-full text-sm font-bold"
          style={{ backgroundColor: "#eff6ff", color: "#1d4ed8", border: "1px solid #bfdbfe" }}
        >
          {value}
        </span>
      ) : (
        <span
          className="text-sm font-semibold leading-snug"
          style={{ color: accent ? "#1d4ed8" : "#0f172a" }}
        >
          {value}
        </span>
      )}
    </div>
  );
}
