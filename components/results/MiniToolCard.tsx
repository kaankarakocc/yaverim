"use client";

import Link from "next/link";
import { Badge } from "@/components/common/Badge";
import { ToolLogo } from "@/components/common/ToolLogo";
import { cn } from "@/lib/utils/cn";
import type { MiniTool } from "@/lib/recommendation/mock-engine";

interface MiniToolCardProps {
  tool: MiniTool;
  rank?: number;
  className?: string;
}

export function MiniToolCard({ tool, rank, className }: MiniToolCardProps) {
  const isTop = rank === 1;

  return (
    <article
      className={cn(
        "group h-full flex flex-col gap-3 p-4 rounded-xl transition-all duration-200 hover:-translate-y-px",
        className
      )}
      style={{
        backgroundColor: isTop ? "#fafbff" : "#ffffff",
        border: `1px solid ${isTop ? "#bfdbfe" : "#e2e8f0"}`,
        boxShadow: isTop ? "0 2px 8px rgba(37,99,235,0.07)" : "none",
      }}
    >
      {/* ── Header: rank + logo + name ── */}
      <div className="flex items-start gap-3">
        {/* Rank */}
        {rank !== undefined && (
          <div
            className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold"
            style={
              isTop
                ? { backgroundColor: "#2563eb", color: "#ffffff", boxShadow: "0 0 0 3px #bfdbfe" }
                : { backgroundColor: "#f1f5f9", color: "#94a3b8" }
            }
            aria-label={`${rank}. sıra`}
          >
            {rank}
          </div>
        )}

        {/* Logo */}
        <ToolLogo
          name={tool.name}
          websiteUrl={tool.websiteUrl}
          size={28}
          className="flex-shrink-0"
        />

        {/* Name + tagline — full width, wraps naturally */}
        <div className="flex-1">
          <div className="flex items-start gap-2 flex-wrap">
            <h4
              className="font-semibold text-sm leading-snug group-hover:text-blue-700 transition-colors"
              style={{ color: "#0f172a" }}
            >
              {tool.name}
            </h4>
            {isTop && (
              <span
                className="flex-shrink-0 text-[10px] font-bold px-1.5 py-0.5 rounded"
                style={{ backgroundColor: "#eff6ff", color: "#2563eb" }}
              >
                En uygun
              </span>
            )}
          </div>
          {tool.tagline && (
            <p className="text-xs mt-0.5 leading-snug" style={{ color: "#94a3b8" }}>
              {tool.tagline}
            </p>
          )}
        </div>
      </div>

      {/* ── Rationale ── */}
      {tool.rationale && (
        <p className="flex-1 text-xs leading-relaxed" style={{ color: "#475569" }}>
          {tool.rationale}
        </p>
      )}

      {/* ── Footer: pricing + score + link — mt-auto dibe sabitler ── */}
      <div className="mt-auto flex items-center justify-between flex-wrap gap-2 pt-2.5" style={{ borderTop: "1px solid #f1f5f9" }}>
        <div className="flex items-center gap-1.5 flex-wrap">
          {tool.hasFree && <Badge variant="success">Ücretsiz plan</Badge>}
          <Badge variant="muted">{tool.pricingLabel}</Badge>
          {/* Score lives here — never competes with the name */}
          <span
            className="text-[11px] font-bold px-2 py-0.5 rounded-full"
            style={{ color: "#1d4ed8", backgroundColor: "#eff6ff", border: "1px solid #bfdbfe" }}
            title={`Yaverim skoru: ${tool.compositeScore.toFixed(1)} / 10`}
          >
            {tool.compositeScore.toFixed(1)}
          </span>
        </div>
        <Link
          href={`/tools/${tool.slug}`}
          className="text-xs font-semibold transition-all duration-150 group-hover:translate-x-0.5 flex-shrink-0"
          style={{ color: "#2563eb" }}
        >
          İncele →
        </Link>
      </div>
    </article>
  );
}
