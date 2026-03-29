import { cn } from "@/lib/utils/cn";

interface ScoreBarProps {
  label: string;
  value: number;
  max?: number;
  /** Optional weight display (for debug scoring breakdown) */
  weight?: number;
  /** Optional weighted value */
  weighted?: number;
  className?: string;
}

function scoreColor(value: number): string {
  if (value >= 9.0) return "bg-emerald-500";
  if (value >= 8.0) return "bg-blue-500";
  if (value >= 6.5) return "bg-amber-500";
  return "bg-zinc-400";
}

export function ScoreBar({
  label,
  value,
  max = 10,
  weight,
  weighted,
  className,
}: ScoreBarProps) {
  const pct = Math.min(100, (value / max) * 100);

  return (
    <div className={cn("flex flex-col gap-1", className)}>
      <div className="flex items-center justify-between gap-3 text-xs">
        <span className="text-slate-500 font-medium truncate">{label}</span>
        <div className="flex items-center gap-2 flex-shrink-0">
          {weight !== undefined && (
            <span className="text-slate-600 tabular-nums">w:{weight.toFixed(1)}</span>
          )}
          {weighted !== undefined && (
            <span className="text-slate-500 tabular-nums">→{weighted.toFixed(2)}</span>
          )}
          <span className="font-semibold text-slate-300 tabular-nums w-8 text-right">
            {value.toFixed(1)}
          </span>
        </div>
      </div>
      <div className="h-1.5 rounded-full bg-zinc-100 overflow-hidden">
        <div
          className={cn("h-full rounded-full transition-all", scoreColor(value))}
          style={{ width: `${pct}%` }}
          role="presentation"
          aria-hidden="true"
        />
      </div>
    </div>
  );
}

/** Compact inline score pill */
export function ScorePill({ value, className }: { value: number; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center px-2 py-0.5 rounded text-xs font-bold tabular-nums",
        value >= 9.0 ? "bg-emerald-50 text-emerald-700" :
        value >= 8.0 ? "bg-blue-50 text-blue-700" :
        value >= 7.0 ? "bg-amber-50 text-amber-700" :
                       "bg-zinc-100 text-slate-400",
        className
      )}
    >
      {value.toFixed(1)}
    </span>
  );
}
