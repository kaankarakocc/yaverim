import Link from "next/link";
import { Badge } from "@/components/common/Badge";
import { cn } from "@/lib/utils/cn";

export type ResultCardRole = "best-fit" | "free-alt" | "power-alt";

export interface ResultCardData {
  slug: string;
  name: string;
  tagline: string;
  role: ResultCardRole;
  reason: string;
  hasFree: boolean;
  priceLabel?: string;
}

const roleConfig: Record<ResultCardRole, { label: string; color: string }> = {
  "best-fit":  { label: "En uygun seçim",    color: "#2563eb" },
  "free-alt":  { label: "Ücretsiz alternatif", color: "#16a34a" },
  "power-alt": { label: "Daha güçlü seçenek", color: "#7c3aed" },
};

export function ResultCard({ tool, className }: { tool: ResultCardData; className?: string }) {
  const config = roleConfig[tool.role];

  return (
    <article
      className={cn("flex flex-col gap-3 p-5 rounded-xl transition-shadow duration-150 hover:shadow-md", className)}
      style={{ backgroundColor: "#ffffff", border: "1px solid #e2e8f0" }}
    >
      <span className="text-xs font-bold uppercase tracking-wider" style={{ color: config.color }}>
        {config.label}
      </span>

      <div>
        <h3 className="font-semibold" style={{ color: "#0f172a" }}>{tool.name}</h3>
        <p className="text-sm mt-0.5" style={{ color: "#475569" }}>{tool.tagline}</p>
      </div>

      <p
        className="text-sm leading-relaxed pl-3"
        style={{ color: "#475569", borderLeft: "2px solid #e2e8f0" }}
      >
        {tool.reason}
      </p>

      <div className="flex items-center justify-between flex-wrap gap-2 mt-auto">
        <div className="flex items-center gap-1.5">
          {tool.hasFree && <Badge variant="success">Ücretsiz plan</Badge>}
          {tool.priceLabel && <Badge variant="muted">{tool.priceLabel}</Badge>}
        </div>
        <Link
          href={`/tools/${tool.slug}`}
          className="text-sm font-semibold transition-colors hover:text-blue-700"
          style={{ color: "#2563eb" }}
        >
          İncele →
        </Link>
      </div>
    </article>
  );
}
