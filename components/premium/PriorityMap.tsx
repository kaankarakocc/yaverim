import type { PriorityItem, PriorityLevel } from "@/lib/recommendation/premium-engine";

interface PriorityMapProps {
  items: PriorityItem[];
}

/*
 * All colors use inline styles — CSS variable arbitrary Tailwind classes
 * (bg-[--color-brand-600], etc.) are not reliably generated in Tailwind v4 JIT.
 */
const PRIORITY_CONFIG: Record<
  PriorityLevel,
  {
    label: string;
    dot: string;      /* bg hex */
    badgeBg: string;
    badgeText: string;
    badgeBorder: string;
    borderLeft: string;
  }
> = {
  critical: {
    label:       "Kritik öncelik",
    dot:         "#2563eb",
    badgeBg:     "#eff6ff",
    badgeText:   "#1d4ed8",
    badgeBorder: "#bfdbfe",
    borderLeft:  "#3b82f6",
  },
  high: {
    label:       "Yüksek öncelik",
    dot:         "#7c3aed",
    badgeBg:     "#f5f3ff",
    badgeText:   "#6d28d9",
    badgeBorder: "#c4b5fd",
    borderLeft:  "#a78bfa",
  },
  medium: {
    label:       "Orta öncelik",
    dot:         "#94a3b8",
    badgeBg:     "#f1f5f9",
    badgeText:   "#475569",
    badgeBorder: "#e2e8f0",
    borderLeft:  "#cbd5e1",
  },
};

const PRIORITY_ORDER: PriorityLevel[] = ["critical", "high", "medium"];

export function PriorityMap({ items }: PriorityMapProps) {
  const grouped = PRIORITY_ORDER.reduce<Record<PriorityLevel, PriorityItem[]>>(
    (acc, level) => {
      acc[level] = items.filter((i) => i.priority === level);
      return acc;
    },
    { critical: [], high: [], medium: [] }
  );

  return (
    <div className="flex flex-col gap-5">
      {PRIORITY_ORDER.map((level) => {
        const group = grouped[level];
        if (!group.length) return null;
        const cfg = PRIORITY_CONFIG[level];

        return (
          <div key={level} className="flex flex-col gap-2.5">
            {/* Level header */}
            <div className="flex items-center gap-2">
              <span
                className="inline-block w-2 h-2 rounded-full flex-shrink-0"
                style={{ backgroundColor: cfg.dot }}
                aria-hidden
              />
              <span
                className="text-xs font-bold uppercase tracking-[0.06em]"
                style={{ color: "#64748b" }}
              >
                {cfg.label}
              </span>
            </div>

            {/* Items */}
            {group.map((item) => (
              <div
                key={item.label}
                className="flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-4 pl-4 ml-1 border-l-2"
                style={{ borderLeftColor: cfg.borderLeft }}
              >
                <span
                  className="text-xs font-semibold px-2.5 py-1 rounded-full flex-shrink-0 self-start border"
                  style={{
                    backgroundColor: cfg.badgeBg,
                    color:           cfg.badgeText,
                    borderColor:     cfg.badgeBorder,
                  }}
                >
                  {item.label}
                </span>
                <span className="text-sm leading-relaxed" style={{ color: "#475569" }}>
                  {item.reason}
                </span>
              </div>
            ))}
          </div>
        );
      })}
    </div>
  );
}
