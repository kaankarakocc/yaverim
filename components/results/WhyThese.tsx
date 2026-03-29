import { cn } from "@/lib/utils/cn";
import type { WhyTheseReason } from "@/lib/recommendation/mock-engine";

interface WhyTheseProps {
  reasons: WhyTheseReason[];
  className?: string;
}

const SCORE_AXES = [
  { label: "İhtiyaca Uygunluk",  weight: 30 },
  { label: "Fiyat / Performans", weight: 20 },
  { label: "Verim Etkisi",       weight: 20 },
  { label: "Kullanım Kolaylığı", weight: 15 },
  { label: "Büyüme Etkisi",      weight: 10 },
  { label: "Entegrasyon Uyumu",  weight: 5  },
] as const;

export function WhyThese({ reasons, className }: WhyTheseProps) {
  return (
    <div className={cn("flex flex-col gap-6", className)}>
      <div className="flex flex-col gap-1">
        <p className="text-[11px] font-bold uppercase tracking-[0.1em]" style={{ color: "#94a3b8" }}>
          Neden Bunlar?
        </p>
        <h2 className="text-xl font-semibold tracking-tight" style={{ color: "#0f172a" }}>
          Bu öneri nasıl oluştu?
        </h2>
        <p className="text-sm" style={{ color: "#475569" }}>
          Öneriler tamamen LLM'e bırakılmaz. Kural bazlı filtreleme, puanlama sistemi
          ve açıklama katmanından oluşan bir motorla çalışır.
        </p>
      </div>

      {/* Context breakdown */}
      <div className="rounded-xl overflow-hidden" style={{ border: "1px solid #e2e8f0" }}>
        <div className="px-5 py-3" style={{ backgroundColor: "#f8fafc", borderBottom: "1px solid #e2e8f0" }}>
          <p className="text-xs font-semibold" style={{ color: "#94a3b8" }}>Analizde kullanılan bağlam</p>
        </div>
        <ul style={{ backgroundColor: "#ffffff" }}>
          {reasons.map((r, i) => (
            <li
              key={r.label}
              className="flex items-center justify-between gap-4 px-5 py-3"
              style={{ borderTop: i > 0 ? "1px solid #f1f5f9" : "none" }}
            >
              <span className="text-sm" style={{ color: "#94a3b8" }}>{r.label}</span>
              <span className="text-sm font-medium" style={{ color: "#0f172a" }}>{r.value}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Scoring model */}
      <div className="flex flex-col gap-3 p-5 rounded-xl" style={{ backgroundColor: "#f8fafc", border: "1px solid #e2e8f0" }}>
        <p className="text-xs font-bold uppercase tracking-[0.08em]" style={{ color: "#94a3b8" }}>
          Puanlama ağırlıkları
        </p>
        <ul className="flex flex-col gap-3">
          {SCORE_AXES.map((axis) => (
            <li key={axis.label} className="flex items-center gap-3">
              <span className="text-xs w-36 flex-shrink-0" style={{ color: "#475569" }}>
                {axis.label}
              </span>
              <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: "#e2e8f0" }}>
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${axis.weight * 3.33}%`,
                    background: axis.weight >= 25
                      ? "linear-gradient(to right, #2563eb, #7c3aed)"
                      : axis.weight >= 15
                      ? "#3b82f6"
                      : "#94a3b8",
                  }}
                  aria-hidden
                />
              </div>
              <span className="text-xs font-semibold w-8 text-right flex-shrink-0" style={{ color: "#475569" }}>
                {axis.weight}%
              </span>
            </li>
          ))}
        </ul>
        <p className="text-xs pt-1" style={{ color: "#94a3b8", borderTop: "1px solid #e2e8f0" }}>
          Sponsorlu araçlar skor sistemini etkilemez. Komisyon alınsın ya da alınmasın, doğru araç önerilir.
        </p>
      </div>
    </div>
  );
}
