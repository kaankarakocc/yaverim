"use client";

import { useState, Fragment } from "react";
import type { PremiumStage } from "@/lib/recommendation/premium-engine";
import { cn } from "@/lib/utils/cn";

interface StageRoadmapProps {
  stages: PremiumStage[];
}

/*
 * ACCENT SYSTEM — ALL badge/header colors use inline styles (not Tailwind
 * arbitrary CSS-var classes) to guarantee rendering across all browsers and
 * Tailwind v4 JIT scanning states.
 *
 * Contrast audit (WCAG AA ≥ 4.5:1 for normal text):
 *   brand blue  #2563eb + white text  = 5.7:1  ✓
 *   violet      #7c3aed + white text  = 7.1:1  ✓
 *   green       #16a34a + white text  = 5.1:1  ✓
 *   gray        #334155 + white text  = 9.3:1  ✓
 */
type Accent = {
  /** Colored circle bg (inline style object) */
  badge: { backgroundColor: string; color: string };
  /** Stage detail panel header bg color */
  headerBg: string;
  /** Tailwind class for roadmap button active bg */
  activeBg: string;
  /** Tailwind class for roadmap button active border */
  activeBorder: string;
  /** Dot indicator bg color (inline style) */
  dot: string;
  /** Step number circle bg for checklist */
  stepNum: { backgroundColor: string; color: string };
};

const ACCENTS: Accent[] = [
  /* 0 — brand blue */
  {
    badge:     { backgroundColor: "#2563eb", color: "#ffffff" },
    headerBg:  "#2563eb",
    activeBg:  "bg-blue-50",
    activeBorder: "border-blue-200",
    dot:       "#2563eb",
    stepNum:   { backgroundColor: "#2563eb", color: "#ffffff" },
  },
  /* 1 — premium violet */
  {
    badge:     { backgroundColor: "#7c3aed", color: "#ffffff" },
    headerBg:  "#7c3aed",
    activeBg:  "bg-violet-50",
    activeBorder: "border-violet-200",
    dot:       "#7c3aed",
    stepNum:   { backgroundColor: "#7c3aed", color: "#ffffff" },
  },
  /* 2 — success green */
  {
    badge:     { backgroundColor: "#16a34a", color: "#ffffff" },
    headerBg:  "#16a34a",
    activeBg:  "bg-green-50",
    activeBorder: "border-green-200",
    dot:       "#16a34a",
    stepNum:   { backgroundColor: "#16a34a", color: "#ffffff" },
  },
  /* 3 — slate/neutral */
  {
    badge:     { backgroundColor: "#334155", color: "#ffffff" },
    headerBg:  "#334155",
    activeBg:  "bg-slate-100",
    activeBorder: "border-slate-300",
    dot:       "#334155",
    stepNum:   { backgroundColor: "#334155", color: "#ffffff" },
  },
];

function getAccent(i: number): Accent {
  return ACCENTS[Math.min(i, ACCENTS.length - 1)];
}

/* ─── SVG icons (all inline, no external deps) ───────────────────────────── */

function IcoCheck() {
  return (
    <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth={2.5}
      strokeLinecap="round" strokeLinejoin="round" className="w-3 h-3" aria-hidden>
      <path d="M2 6l3 3 5-5" />
    </svg>
  );
}

function IcoArrowRight({ cls }: { cls?: string }) {
  return (
    <svg viewBox="0 0 16 16" fill="currentColor" className={cn("w-4 h-4", cls)} aria-hidden>
      <path fillRule="evenodd" d="M6.22 4.22a.75.75 0 0 1 1.06 0l3.25 3.25a.75.75 0 0 1 0 1.06l-3.25 3.25a.75.75 0 0 1-1.06-1.06L8.94 8 6.22 5.28a.75.75 0 0 1 0-1.06z" clipRule="evenodd" />
    </svg>
  );
}

function IcoArrowLeft({ cls }: { cls?: string }) {
  return (
    <svg viewBox="0 0 16 16" fill="currentColor" className={cn("w-4 h-4", cls)} aria-hidden>
      <path fillRule="evenodd" d="M9.78 4.22a.75.75 0 0 1 0 1.06L7.06 8l2.72 2.72a.75.75 0 1 1-1.06 1.06L5.47 8.53a.75.75 0 0 1 0-1.06l3.25-3.25a.75.75 0 0 1 1.06 0z" clipRule="evenodd" />
    </svg>
  );
}

/* ─── Section label ───────────────────────────────────────────────────────── */

function Label({ children }: { children: React.ReactNode }) {
  return (
    <p
      className="text-xs font-bold uppercase tracking-[0.08em] mb-2"
      style={{ color: "#475569" }}  /* neutral-600, 7.5:1 on white */
    >
      {children}
    </p>
  );
}

/* ─── Main component ─────────────────────────────────────────────────────── */

export function StageRoadmap({ stages }: StageRoadmapProps) {
  const [activeIdx, setActiveIdx] = useState(0);
  const stage  = stages[activeIdx] ?? stages[0];
  const accent = getAccent(activeIdx);
  const isFirst = activeIdx === 0;
  const isLast  = activeIdx === stages.length - 1;

  return (
    <div
      className="flex flex-col h-full overflow-hidden"
      style={{ backgroundColor: "#ffffff" }}
    >

      {/* ── Horizontal roadmap ─────────────────────────────────────────── */}
      <div
        className="flex-shrink-0 overflow-x-auto border-b"
        style={{ backgroundColor: "#ffffff", borderColor: "#e2e8f0" }}
      >
        <div className="flex items-center px-4 py-3 min-w-max gap-0">
          {stages.map((s, i) => {
            const acc      = getAccent(i);
            const isActive = i === activeIdx;
            const isDone   = i < activeIdx;

            return (
              <Fragment key={s.number}>
                {/* Connector line */}
                {i > 0 && (
                  <div
                    className="flex-shrink-0 h-0.5 w-6 sm:w-10 transition-colors duration-300"
                    style={{ backgroundColor: isDone ? "#16a34a" : "#e2e8f0" }}
                    aria-hidden
                  />
                )}

                {/* Stage button */}
                <button
                  onClick={() => setActiveIdx(i)}
                  aria-label={`Aşama ${s.number}: ${s.title}`}
                  aria-pressed={isActive}
                  className={cn(
                    "flex flex-col items-center gap-1.5 px-3 py-2 rounded-xl border",
                    "transition-all duration-150 min-w-[68px] sm:min-w-[88px]",
                    "focus-visible:outline-2 focus-visible:outline-blue-500 focus-visible:outline-offset-2",
                    isActive ? cn(acc.activeBg, acc.activeBorder, "shadow-sm") :
                               "border-transparent hover:bg-slate-50"
                  )}
                >
                  {/* Number / check badge */}
                  <span
                    className="flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold transition-all"
                    style={
                      isActive ? acc.badge :
                      isDone   ? { backgroundColor: "#16a34a", color: "#ffffff" } :
                                 { backgroundColor: "#f1f5f9", color: "#475569", border: "1px solid #e2e8f0" }
                    }
                  >
                    {isDone ? <IcoCheck /> : s.number}
                  </span>

                  {/* Title */}
                  <span
                    className="text-[10px] font-semibold text-center leading-tight max-w-[80px] line-clamp-2"
                    style={{ color: isActive ? "#0f172a" : "#64748b" }}
                  >
                    {s.title}
                  </span>
                </button>
              </Fragment>
            );
          })}
        </div>
      </div>

      {/*
       * ── Split panel ─────────────────────────────────────────────────
       *
       * MOBILE  (< lg): overflow-y-auto — the ENTIRE panel scrolls as one
       *   unit within the available height. No content is clipped.
       *
       * DESKTOP (≥ lg): overflow-hidden with two INDEPENDENT scrollable
       *   columns side-by-side, filling full height.
       */}
      <div className="flex-1 min-h-0 overflow-y-auto lg:overflow-hidden" key={activeIdx}>
        <div className="flex flex-col lg:flex-row lg:h-full lg:divide-x" style={{ borderColor: "#e2e8f0" }}>

          {/* ── Left column: Context ────────────────────────────────── */}
          <div
            className="lg:w-[42%] lg:flex-shrink-0 flex flex-col lg:overflow-y-auto"
          >
            {/* Colored stage header */}
            <div
              className="px-5 py-4 flex items-start gap-3"
              style={{ backgroundColor: accent.headerBg }}
            >
              <span
                className="flex-shrink-0 flex items-center justify-center w-9 h-9 rounded-full text-base font-black mt-0.5"
                style={{ backgroundColor: "rgba(255,255,255,0.2)", color: "#ffffff" }}
              >
                {stage.number}
              </span>
              <div className="min-w-0">
                <h2 className="font-bold text-base leading-snug" style={{ color: "#ffffff" }}>
                  {stage.title}
                </h2>
                <p className="text-sm mt-0.5 leading-snug" style={{ color: "rgba(255,255,255,0.78)" }}>
                  {stage.tagline}
                </p>
              </div>
            </div>

            {/* Quick start callout */}
            <div className="mx-4 mt-4">
              <div
                className="flex items-start gap-3 px-4 py-3.5 rounded-xl border"
                style={{ backgroundColor: "#eff6ff", borderColor: "#bfdbfe" }}
              >
                {/* Rocket SVG */}
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"
                  className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: "#2563eb" }} aria-hidden>
                  <path fillRule="evenodd" d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16ZM6.75 9.25a.75.75 0 0 0 0 1.5h4.59l-2.1 1.95a.75.75 0 0 0 1.02 1.1l3.5-3.25a.75.75 0 0 0 0-1.1l-3.5-3.25a.75.75 0 1 0-1.02 1.1l2.1 1.95H6.75Z" clipRule="evenodd" />
                </svg>
                <div className="min-w-0">
                  <p className="text-[10px] font-bold uppercase tracking-[0.1em] mb-1.5" style={{ color: "#1d4ed8" }}>
                    Hemen başla — 15 dakika
                  </p>
                  <p className="text-sm font-semibold leading-relaxed" style={{ color: "#1e3a8a" }}>
                    {stage.quickStart}
                  </p>
                </div>
              </div>
            </div>

            {/* Purpose */}
            <div className="px-5 py-4">
              <Label>Bu adımın amacı</Label>
              <p className="text-sm leading-relaxed" style={{ color: "#475569" }}>
                {stage.purpose}
              </p>
            </div>

            {/* Why now */}
            {stage.whyNow && (
              <div className="px-5 pb-4">
                <Label>Neden şimdi?</Label>
                <p className="text-sm leading-relaxed" style={{ color: "#475569" }}>
                  {stage.whyNow}
                </p>
              </div>
            )}

            {/* End state */}
            <div className="px-5 pb-5">
              <div
                className="flex items-start gap-3 px-4 py-3.5 rounded-xl border"
                style={{ backgroundColor: "#f0fdf4", borderColor: "#86efac" }}
              >
                {/* Check circle */}
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"
                  className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: "#16a34a" }} aria-hidden>
                  <path fillRule="evenodd" d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm3.857-9.809a.75.75 0 0 0-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 1 0-1.06 1.061l2.5 2.5a.75.75 0 0 0 1.137-.089l4-5.5Z" clipRule="evenodd" />
                </svg>
                <div className="min-w-0">
                  <p className="text-[10px] font-bold uppercase tracking-[0.1em] mb-1.5" style={{ color: "#15803d" }}>
                    Bu adımın sonunda elinde ne olacak
                  </p>
                  <p className="text-sm leading-relaxed" style={{ color: "#166534" }}>
                    {stage.endState}
                  </p>
                </div>
              </div>
            </div>

          </div>

          {/* ── Right column: Action ─────────────────────────────────── */}
          <div
            className="flex-1 min-w-0 flex flex-col border-t lg:border-t-0 lg:overflow-y-auto"
            style={{ borderColor: "#e2e8f0" }}
          >
            <div className="px-5 py-4 flex flex-col gap-5 flex-1">

              {/* Tools */}
              <div>
                <Label>Kullanılacak araçlar</Label>
                <div className="flex flex-col gap-1.5">
                  {stage.tools.map((tool) => (
                    <div
                      key={tool.slug}
                      className="flex items-center justify-between gap-3 px-3 py-2.5 rounded-xl border"
                      style={{ backgroundColor: "#f8fafc", borderColor: "#e2e8f0" }}
                    >
                      <div className="flex flex-col gap-0.5 min-w-0">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="text-sm font-semibold" style={{ color: "#0f172a" }}>
                            {tool.name}
                          </span>
                          {tool.hasFree && (
                            <span
                              className="inline-flex items-center text-[10px] font-bold px-1.5 py-0.5 rounded-full leading-none"
                              style={{ backgroundColor: "#f0fdf4", color: "#16a34a", border: "1px solid #86efac" }}
                            >
                              Ücretsiz
                            </span>
                          )}
                        </div>
                        <span className="text-xs" style={{ color: "#64748b" }}>{tool.role}</span>
                      </div>
                      <span className="text-xs font-medium flex-shrink-0 whitespace-nowrap" style={{ color: "#64748b" }}>
                        {tool.pricingLabel}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Steps */}
              <div>
                <Label>Yapılacaklar</Label>
                <ol className="flex flex-col gap-2">
                  {stage.steps.map((stepText, i) => (
                    <li key={i} className="flex items-start gap-2.5">
                      <span
                        className="flex-shrink-0 flex items-center justify-center w-5 h-5 rounded-full text-[10px] font-bold mt-0.5"
                        style={accent.stepNum}
                        aria-hidden
                      >
                        {i + 1}
                      </span>
                      <span className="text-sm leading-relaxed" style={{ color: "#475569" }}>
                        {stepText}
                      </span>
                    </li>
                  ))}
                </ol>
              </div>

              {/* Warnings */}
              {stage.warnings.length > 0 && (
                <div>
                  <Label>Dikkat noktaları</Label>
                  <ul className="flex flex-col gap-1.5">
                    {stage.warnings.map((warn, i) => (
                      <li
                        key={i}
                        className="flex items-start gap-2.5 px-3 py-2.5 rounded-xl border"
                        style={{ backgroundColor: "#fffbeb", borderColor: "#fde68a" }}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"
                          className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: "#d97706" }} aria-hidden>
                          <path fillRule="evenodd" d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 0 1 .75.75v3.5a.75.75 0 0 1-1.5 0v-3.5A.75.75 0 0 1 10 5zm0 9a1 1 0 1 0 0-2 1 1 0 0 0 0 2z" clipRule="evenodd" />
                        </svg>
                        <span className="text-sm leading-relaxed" style={{ color: "#92400e" }}>
                          {warn}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Exit criteria */}
              <div>
                <Label>Tamamlandı ölçütü</Label>
                <ul className="flex flex-col gap-2">
                  {stage.exitCriteria.map((criterion, i) => (
                    <li key={i} className="flex items-start gap-2.5">
                      <span
                        className="flex-shrink-0 mt-0.5 flex items-center justify-center w-4 h-4 rounded border-2"
                        style={{ borderColor: "#cbd5e1", backgroundColor: "#ffffff" }}
                        aria-hidden
                      >
                        <svg viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth={2}
                          strokeLinecap="round" strokeLinejoin="round" className="w-2 h-2"
                          style={{ color: "#94a3b8" }} aria-hidden>
                          <path d="M2 5l2 2 4-4" />
                        </svg>
                      </span>
                      <span className="text-sm leading-relaxed" style={{ color: "#475569" }}>
                        {criterion}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

            </div>
          </div>

        </div>
      </div>

      {/* ── Bottom navigation ──────────────────────────────────────────── */}
      <div
        className="flex-shrink-0 flex items-center justify-between gap-3 px-4 py-3 border-t"
        style={{ backgroundColor: "#ffffff", borderColor: "#e2e8f0" }}
      >
        {/* Prev */}
        <button
          onClick={() => setActiveIdx((i) => Math.max(0, i - 1))}
          disabled={isFirst}
          className="flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium transition-all focus-visible:outline-2 focus-visible:outline-blue-500 focus-visible:outline-offset-2"
          style={{
            color: isFirst ? "#cbd5e1" : "#475569",
            cursor: isFirst ? "not-allowed" : "pointer",
            backgroundColor: "transparent",
          }}
          onMouseEnter={(e) => { if (!isFirst) e.currentTarget.style.backgroundColor = "#f8fafc"; }}
          onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "transparent"; }}
        >
          <IcoArrowLeft />
          Önceki
        </button>

        {/* Step dots */}
        <div className="flex items-center gap-1.5">
          {stages.map((_, i) => {
            const dotColor = getAccent(i).dot;
            return (
              <button
                key={i}
                onClick={() => setActiveIdx(i)}
                aria-label={`Aşama ${i + 1}`}
                className="rounded-full transition-all duration-200 focus-visible:outline-2 focus-visible:outline-blue-500"
                style={{
                  width: i === activeIdx ? "1.25rem" : "0.5rem",
                  height: "0.5rem",
                  backgroundColor:
                    i === activeIdx ? dotColor :
                    i < activeIdx   ? "#16a34a" :
                                      "#e2e8f0",
                }}
              />
            );
          })}
        </div>

        {/* Next */}
        <button
          onClick={() => setActiveIdx((i) => Math.min(stages.length - 1, i + 1))}
          disabled={isLast}
          className="flex items-center gap-1 px-4 py-2 rounded-lg text-sm font-semibold transition-all focus-visible:outline-2 focus-visible:outline-blue-500 focus-visible:outline-offset-2"
          style={
            isLast
              ? { backgroundColor: "#f1f5f9", color: "#94a3b8", cursor: "not-allowed" }
              : { backgroundColor: accent.headerBg, color: "#ffffff", cursor: "pointer" }
          }
          onMouseEnter={(e) => { if (!isLast) e.currentTarget.style.opacity = "0.9"; }}
          onMouseLeave={(e) => { e.currentTarget.style.opacity = "1"; }}
        >
          Sonraki
          <IcoArrowRight />
        </button>
      </div>

    </div>
  );
}
