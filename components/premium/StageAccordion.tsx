"use client";

import { useState } from "react";
import type { PremiumStage } from "@/lib/recommendation/premium-engine";
import { cn } from "@/lib/utils/cn";

interface StageAccordionProps {
  stages: PremiumStage[];
}

const STAGE_ACCENTS = [
  { borderColor: "#3b82f6", badgeBg: "#2563eb",  stepBg: "#eff6ff", stepColor: "#1d4ed8" },
  { borderColor: "#7c3aed", badgeBg: "#7c3aed",  stepBg: "#f5f3ff", stepColor: "#6d28d9" },
  { borderColor: "#16a34a", badgeBg: "#16a34a",  stepBg: "#f0fdf4", stepColor: "#15803d" },
  { borderColor: "#64748b", badgeBg: "#475569",   stepBg: "#f1f5f9", stepColor: "#334155" },
];

export function StageAccordion({ stages }: StageAccordionProps) {
  const [openStages, setOpenStages] = useState<number[]>([1]);

  function toggle(n: number) {
    setOpenStages((prev) => prev.includes(n) ? prev.filter((x) => x !== n) : [...prev, n]);
  }

  return (
    <div className="flex flex-col gap-3">
      {stages.map((stage) => {
        const isOpen  = openStages.includes(stage.number);
        const accent  = STAGE_ACCENTS[Math.min(stage.number - 1, STAGE_ACCENTS.length - 1)];

        return (
          <div
            key={stage.number}
            className="rounded-xl overflow-hidden"
            style={{
              border: `1px solid #e2e8f0`,
              borderLeft: `4px solid ${accent.borderColor}`,
            }}
          >
            {/* Header */}
            <button
              onClick={() => toggle(stage.number)}
              className="w-full flex items-start gap-4 px-5 py-4 text-left hover:bg-slate-50 transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-inset"
              aria-expanded={isOpen}
            >
              <span
                className="flex-shrink-0 flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold text-white mt-0.5"
                style={{ backgroundColor: accent.badgeBg }}
                aria-hidden
              >
                {stage.number}
              </span>

              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm leading-snug" style={{ color: "#0f172a" }}>
                  {stage.title}
                </p>
                <p className="text-xs mt-0.5 leading-relaxed" style={{ color: "#475569" }}>
                  {stage.tagline}
                </p>
              </div>

              <span
                className={cn(
                  "flex-shrink-0 flex items-center justify-center w-6 h-6 mt-0.5 rounded-full border border-slate-200 transition-transform duration-200",
                  isOpen && "rotate-180"
                )}
                style={{ color: "#94a3b8" }}
                aria-hidden
              >
                <svg viewBox="0 0 16 16" fill="currentColor" className="w-3 h-3">
                  <path d="M8 10.94L2.53 5.47a.75.75 0 0 1 1.06-1.06L8 8.82l4.41-4.41a.75.75 0 1 1 1.06 1.06L8 10.94z" />
                </svg>
              </span>
            </button>

            {isOpen && (
              <div style={{ borderTop: "1px solid #e2e8f0" }}>
                <StageContent stage={stage} accent={accent} />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

/* ─── Stage content ─────────────────────────────────────────────────────── */

function StageContent({
  stage,
  accent,
}: {
  stage: PremiumStage;
  accent: { stepBg: string; stepColor: string };
}) {
  return (
    <div className="px-5 py-5 flex flex-col gap-5">

      {/* Quick Start */}
      <div className="flex items-start gap-3 px-4 py-3.5 rounded-xl" style={{ backgroundColor: "#eff6ff", border: "1px solid #bfdbfe" }}>
        <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: "#2563eb" }} aria-hidden>
          <path fillRule="evenodd" d="M10.21 2.58a.75.75 0 0 1 .58 0l7 3a.75.75 0 0 1 0 1.38L10.79 10 17.79 13a.75.75 0 0 1 0 1.38l-7 3a.75.75 0 0 1-.58 0l-7-3a.75.75 0 0 1 0-1.38L10 10 3 7.04a.75.75 0 0 1 0-1.38l7-3Z" clipRule="evenodd" />
        </svg>
        <div className="flex-1 min-w-0">
          <p className="text-[10px] font-bold uppercase tracking-[0.08em] mb-1" style={{ color: "#2563eb" }}>
            Hemen başla — 15 dakika
          </p>
          <p className="text-sm leading-relaxed font-medium" style={{ color: "#1e3a8a" }}>
            {stage.quickStart}
          </p>
        </div>
      </div>

      {/* Purpose + Why Now */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Block label="Bu aşamanın amacı">
          <p className="text-sm leading-relaxed" style={{ color: "#475569" }}>{stage.purpose}</p>
        </Block>
        <Block label="Neden şimdi?">
          <p className="text-sm leading-relaxed" style={{ color: "#475569" }}>{stage.whyNow}</p>
        </Block>
      </div>

      {/* End State */}
      <div className="flex items-start gap-3 px-4 py-3.5 rounded-xl" style={{ backgroundColor: "#f0fdf4", border: "1px solid #bbf7d0" }}>
        <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: "#16a34a" }} aria-hidden>
          <path fillRule="evenodd" d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm3.857-9.809a.75.75 0 0 0-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 1 0-1.06 1.061l2.5 2.5a.75.75 0 0 0 1.137-.089l4-5.5Z" clipRule="evenodd" />
        </svg>
        <div className="flex-1 min-w-0">
          <p className="text-[10px] font-bold uppercase tracking-[0.08em] mb-1" style={{ color: "#16a34a" }}>
            Bu aşamanın sonunda elinde ne olacak
          </p>
          <p className="text-sm leading-relaxed" style={{ color: "#14532d" }}>
            {stage.endState}
          </p>
        </div>
      </div>

      {/* Tools */}
      <Block label="Bu aşamada kullanılacak araçlar">
        <div className="flex flex-col gap-2">
          {stage.tools.map((tool) => (
            <div
              key={tool.slug}
              className="flex items-start gap-3 py-2.5 px-3 rounded-lg"
              style={{ backgroundColor: "#f8fafc", border: "1px solid #e2e8f0" }}
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-sm font-semibold" style={{ color: "#0f172a" }}>{tool.name}</span>
                  {tool.hasFree && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded font-semibold" style={{ backgroundColor: "#dcfce7", color: "#15803d", border: "1px solid #bbf7d0" }}>
                      Ücretsiz plan var
                    </span>
                  )}
                </div>
                <p className="text-xs mt-0.5" style={{ color: "#475569" }}>{tool.role}</p>
              </div>
              <span className="text-xs flex-shrink-0 mt-0.5 text-right" style={{ color: "#94a3b8" }}>
                {tool.pricingLabel}
              </span>
            </div>
          ))}
        </div>
      </Block>

      {/* Steps */}
      <Block label="Adım adım uygulama">
        <ol className="flex flex-col gap-2.5">
          {stage.steps.map((step, i) => (
            <li key={i} className="flex items-start gap-3">
              <span
                className="flex-shrink-0 flex items-center justify-center w-5 h-5 rounded-full text-[10px] font-bold mt-0.5"
                style={{ backgroundColor: accent.stepBg, color: accent.stepColor }}
                aria-hidden
              >
                {i + 1}
              </span>
              <span className="text-sm leading-relaxed" style={{ color: "#475569" }}>{step}</span>
            </li>
          ))}
        </ol>
      </Block>

      {/* Warnings */}
      {stage.warnings.length > 0 && (
        <Block label="Sık yapılan hatalar — dikkat">
          <ul className="flex flex-col gap-2">
            {stage.warnings.map((warn, i) => (
              <li
                key={i}
                className="flex items-start gap-2.5 py-2 px-3 rounded-lg"
                style={{ backgroundColor: "#fffbeb", border: "1px solid #fde68a" }}
              >
                <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: "#d97706" }} aria-hidden>
                  <path fillRule="evenodd" d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 0 1 .75.75v3.5a.75.75 0 0 1-1.5 0v-3.5A.75.75 0 0 1 10 5zm0 9a1 1 0 1 0 0-2 1 1 0 0 0 0 2z" clipRule="evenodd" />
                </svg>
                <span className="text-sm leading-relaxed" style={{ color: "#92400e" }}>{warn}</span>
              </li>
            ))}
          </ul>
        </Block>
      )}

      {/* Exit criteria */}
      <Block label="Bu aşamayı tamamladığını nasıl anlarsın">
        <ul className="flex flex-col gap-2">
          {stage.exitCriteria.map((criterion, i) => (
            <li key={i} className="flex items-start gap-2.5">
              <span
                className="flex-shrink-0 mt-0.5 flex h-4 w-4 items-center justify-center rounded"
                style={{ border: "1px solid #e2e8f0", backgroundColor: "#ffffff" }}
                aria-hidden
              >
                <svg viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className="w-2.5 h-2.5" style={{ color: "#94a3b8" }} aria-hidden>
                  <path d="M2 5l2 2 4-4" />
                </svg>
              </span>
              <span className="text-sm leading-relaxed" style={{ color: "#475569" }}>{criterion}</span>
            </li>
          ))}
        </ul>
      </Block>
    </div>
  );
}

function Block({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-2">
      <p className="text-[10px] font-bold uppercase tracking-[0.08em]" style={{ color: "#94a3b8" }}>
        {label}
      </p>
      {children}
    </div>
  );
}
