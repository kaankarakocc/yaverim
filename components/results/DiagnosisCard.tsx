import { cn } from "@/lib/utils/cn";

interface DiagnosisCardProps {
  contextLabel: string;
  diagnosis: string;
  diagnosisDetails: string;
  className?: string;
}

export function DiagnosisCard({ contextLabel, diagnosis, diagnosisDetails, className }: DiagnosisCardProps) {
  return (
    <div
      className={cn("rounded-2xl overflow-hidden", className)}
      style={{ border: "1px solid #e2e8f0", backgroundColor: "#ffffff" }}
    >
      {/* Accent bar */}
      <div style={{ height: "3px", background: "linear-gradient(to right, #2563eb, #7c3aed)" }} />

      {/* Context strip */}
      <div
        className="px-6 py-3 flex items-center gap-2 flex-wrap"
        style={{ backgroundColor: "#f8fafc", borderBottom: "1px solid #e2e8f0" }}
      >
        <span className="text-[11px] font-bold uppercase tracking-[0.08em]" style={{ color: "#94a3b8" }}>
          Analiz Bağlamı
        </span>
        <span className="text-[11px]" style={{ color: "#e2e8f0" }}>·</span>
        <span className="text-xs font-medium" style={{ color: "#475569" }}>{contextLabel}</span>
      </div>

      {/* Diagnosis body */}
      <div className="px-6 py-6 flex flex-col gap-4">
        {/* Label + heading row */}
        <div className="flex items-start gap-3">
          <div
            className="flex-shrink-0 mt-0.5 w-6 h-6 rounded-lg flex items-center justify-center"
            style={{ backgroundColor: "#eff6ff" }}
            aria-hidden
          >
            <svg viewBox="0 0 14 14" fill="none" stroke="#2563eb" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-3 h-3">
              <circle cx="7" cy="7" r="5.5"/>
              <path d="M7 5v2.5l1.5 1"/>
            </svg>
          </div>
          <div className="flex flex-col gap-1">
            <p className="text-[11px] font-bold uppercase tracking-[0.1em]" style={{ color: "#2563eb" }}>
              Teşhis
            </p>
            <p className="font-semibold text-base leading-snug" style={{ color: "#0f172a" }}>
              {diagnosis}
            </p>
          </div>
        </div>

        <p className="text-sm leading-relaxed pl-9" style={{ color: "#475569" }}>
          {diagnosisDetails}
        </p>
      </div>
    </div>
  );
}
