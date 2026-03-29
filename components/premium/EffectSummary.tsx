import type { EffectItem, ImpactLevel } from "@/lib/recommendation/premium-engine";

interface EffectSummaryProps {
  items: EffectItem[];
}

/* All colors use inline styles — avoids CSS variable arbitrary Tailwind class issues. */
const IMPACT_CONFIG: Record<
  ImpactLevel,
  { label: string; barBg: string; badgeBg: string; badgeText: string; badgeBorder: string }
> = {
  high: {
    label:       "Yüksek etki",
    barBg:       "#3b82f6",
    badgeBg:     "#eff6ff",
    badgeText:   "#1d4ed8",
    badgeBorder: "#bfdbfe",
  },
  medium: {
    label:       "Orta etki",
    barBg:       "#8b5cf6",
    badgeBg:     "#f5f3ff",
    badgeText:   "#6d28d9",
    badgeBorder: "#c4b5fd",
  },
};

const BAR_WIDTH: Record<ImpactLevel, string> = {
  high:   "80%",
  medium: "60%",
};

export function EffectSummary({ items }: EffectSummaryProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {items.map((item) => {
        const cfg = IMPACT_CONFIG[item.impact];
        return (
          <div
            key={item.area}
            className="rounded-xl border p-4 flex flex-col gap-3"
            style={{ borderColor: "#e2e8f0", backgroundColor: "#ffffff" }}
          >
            <div className="flex items-start justify-between gap-3">
              <span className="text-sm font-semibold" style={{ color: "#0f172a" }}>
                {item.area}
              </span>
              <span
                className="text-[10px] font-semibold px-2 py-0.5 rounded-full flex-shrink-0 border"
                style={{
                  backgroundColor: cfg.badgeBg,
                  color:           cfg.badgeText,
                  borderColor:     cfg.badgeBorder,
                }}
              >
                {cfg.label}
              </span>
            </div>

            {/* Progress bar */}
            <div className="flex flex-col gap-1.5">
              <div
                className="h-1.5 rounded-full overflow-hidden"
                style={{ backgroundColor: "#e2e8f0" }}
              >
                <div
                  className="h-full rounded-full transition-all"
                  style={{ backgroundColor: cfg.barBg, width: BAR_WIDTH[item.impact] }}
                  role="presentation"
                  aria-hidden
                />
              </div>
              <div className="flex items-center justify-between">
                <p className="text-xs leading-relaxed" style={{ color: "#475569" }}>
                  {item.description}
                </p>
                <span className="text-xs font-bold ml-3 flex-shrink-0" style={{ color: "#0f172a" }}>
                  {item.estimate}
                </span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
