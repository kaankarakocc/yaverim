import Link from "next/link";
import { Badge } from "@/components/common/Badge";
import { ToolLogo } from "@/components/common/ToolLogo";
import { cn } from "@/lib/utils/cn";

export interface Top10CardData {
  rank: number;
  slug: string;
  name: string;
  tagline: string;
  websiteUrl: string;
  strongestUseCase: string;
  category: string;
  signals: string[];
  compositeScore: number;
  hasFree: boolean;
  isSponsored?: boolean;
}

interface Top10CardProps {
  tool: Top10CardData;
  className?: string;
  /** When true, uses a more compact layout for the homepage Top10 section */
  compact?: boolean;
}

/* ── Rank badge configuration ─────────────────────────────────────────────── */
function getRankStyle(rank: number): { bg: string; color: string; label?: string } {
  if (rank === 1) return { bg: "#b45309", color: "#ffffff", label: "Altın" };
  if (rank === 2) return { bg: "#64748b", color: "#ffffff", label: "Gümüş" };
  if (rank === 3) return { bg: "#92400e", color: "#ffffff", label: "Bronz" };
  return { bg: "#f1f5f9", color: "#475569" };
}

/* ── Score pill ───────────────────────────────────────────────────────────── */
function ScorePill({ score }: { score: number }) {
  const isHigh = score >= 9;
  return (
    <div
      className="flex flex-col items-center justify-center w-12 h-12 rounded-xl flex-shrink-0"
      style={
        isHigh
          ? { backgroundColor: "#eff6ff", border: "1.5px solid #bfdbfe" }
          : { backgroundColor: "#f8fafc", border: "1.5px solid #e2e8f0" }
      }
      aria-label={`Yaverim skoru: ${score} / 10`}
    >
      <span
        className="text-sm font-black leading-none tabular-nums"
        style={{ color: isHigh ? "#1d4ed8" : "#475569" }}
      >
        {score.toFixed(1)}
      </span>
      <span className="text-[9px] leading-none mt-0.5" style={{ color: isHigh ? "#93c5fd" : "#94a3b8" }}>
        / 10
      </span>
    </div>
  );
}

/* ── Main card ────────────────────────────────────────────────────────────── */
export function Top10Card({ tool, className, compact }: Top10CardProps) {
  const rankStyle = getRankStyle(tool.rank);

  return (
    <article
      className={cn(
        "group relative flex items-stretch rounded-xl overflow-hidden transition-all duration-200",
        "border hover:shadow-md",
        className
      )}
      style={{
        backgroundColor: "#ffffff",
        borderColor: "#e2e8f0",
      }}
    >
      {/* Rank column */}
      <div
        className="flex-shrink-0 flex flex-col items-center justify-center gap-0.5 w-12"
        style={{ backgroundColor: rankStyle.bg }}
        aria-label={`Sıralama: ${tool.rank}`}
      >
        <span
          className="text-lg font-black tabular-nums leading-none"
          style={{ color: rankStyle.color }}
        >
          {tool.rank}
        </span>
        {rankStyle.label && (
          <span className="text-[8px] font-semibold uppercase tracking-wide" style={{ color: `${rankStyle.color}cc` }}>
            {rankStyle.label}
          </span>
        )}
      </div>

      {/* Main content */}
      <div className="flex-1 min-w-0 flex items-start gap-3 px-5 py-4">
        <ToolLogo name={tool.name} websiteUrl={tool.websiteUrl} size={36} />

        <div className="flex-1 min-w-0 flex flex-col gap-2.5">
        {/* Top row: name + badges */}
        <div className="flex items-start justify-between gap-3 flex-wrap">
          <div className="flex flex-col gap-0.5">
            <h3
              className="font-bold text-slate-800 leading-snug transition-colors group-hover:text-blue-600"
              style={{ fontSize: compact ? "0.9rem" : "1rem" }}
            >
              {tool.name}
            </h3>
            <p className="text-xs text-slate-400">{tool.tagline}</p>
          </div>
          <div className="flex items-center gap-1.5 flex-shrink-0 flex-wrap justify-end">
            {tool.isSponsored && <Badge variant="sponsored">Sponsorlu</Badge>}
            <Badge variant="muted">{tool.category}</Badge>
            {tool.hasFree && <Badge variant="success">Ücretsiz plan</Badge>}
          </div>
        </div>

        {/* Use case */}
        <p className="text-sm text-slate-600 leading-relaxed">
          <span className="font-semibold text-slate-700">En güçlü olduğu alan: </span>
          {tool.strongestUseCase}
        </p>

        {/* Signal chips — hidden in compact mode to save space */}
        {!compact && tool.signals.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {tool.signals.map((signal) => (
              <span
                key={signal}
                className="text-[11px] px-2 py-0.5 rounded-full"
                style={{ backgroundColor: "#f1f5f9", color: "#475569" }}
              >
                {signal}
              </span>
            ))}
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center gap-4 pt-0.5">
          <Link
            href={`/tools/${tool.slug}`}
            className="text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors"
          >
            İncele →
          </Link>
          <Link
            href={`/compare?tools=${tool.slug}`}
            className="text-sm text-slate-400 hover:text-slate-600 transition-colors"
          >
            Karşılaştır
          </Link>
        </div>
        </div>{/* end inner content */}
      </div>

      {/* Score column */}
      <div
        className="flex-shrink-0 flex items-center justify-center px-4 border-l"
        style={{ borderColor: "#f1f5f9" }}
      >
        <ScorePill score={tool.compositeScore} />
      </div>
    </article>
  );
}
