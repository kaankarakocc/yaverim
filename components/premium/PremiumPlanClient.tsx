"use client";

import { useState } from "react";
import type { PremiumPlan } from "@/lib/recommendation/premium-engine";
import { StageRoadmap } from "./StageRoadmap";
import { PriorityMap } from "./PriorityMap";
import { EffectSummary } from "./EffectSummary";
import { WhatIsExpected } from "./WhatIsExpected";
import {
  getPromptsForTools,
  getDayOneTasks,
  type ReadyPrompt,
  type DayOneTask,
} from "@/lib/prompts/prompt-library";

interface Props {
  plan: PremiumPlan;
  /** Budget tier from onboarding ("free-only" | "low" | "mid" | "best") */
  budget?: string;
  /** Goal areas selected in onboarding */
  goalAreas?: string[];
}

type Tab = "roadmap" | "overview" | "prompts" | "day1";

/* ── Tab button ─────────────────────────────────────────────────────────── */

function TabBtn({
  active,
  onClick,
  children,
  icon,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
  icon?: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-1.5 px-4 py-3 text-sm font-semibold transition-colors whitespace-nowrap focus-visible:outline-2 focus-visible:outline-blue-500 focus-visible:outline-offset-2"
      style={{
        color: active ? "#2563eb" : "#64748b",
        backgroundColor: "transparent",
        borderBottom: active ? "2px solid #2563eb" : "2px solid transparent",
      }}
      aria-selected={active}
      role="tab"
    >
      {icon && <span className="opacity-70">{icon}</span>}
      {children}
    </button>
  );
}

/* ── Copy button ──────────────────────────────────────────────────────────── */

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback: select text
    }
  };

  return (
    <button
      onClick={handleCopy}
      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all"
      style={
        copied
          ? { backgroundColor: "#f0fdf4", color: "#16a34a", border: "1px solid #86efac" }
          : { backgroundColor: "#f1f5f9", color: "#475569", border: "1px solid #e2e8f0" }
      }
    >
      {copied ? (
        <>
          <svg viewBox="0 0 12 12" fill="currentColor" className="w-3 h-3" aria-hidden>
            <path fillRule="evenodd" d="M10.78 3.22a.75.75 0 0 1 0 1.06l-5.5 5.5a.75.75 0 0 1-1.06 0l-2.5-2.5a.75.75 0 1 1 1.06-1.06L4.75 8.19l4.97-4.97a.75.75 0 0 1 1.06 0Z" clipRule="evenodd" />
          </svg>
          Kopyalandı
        </>
      ) : (
        <>
          <svg viewBox="0 0 12 12" fill="currentColor" className="w-3 h-3" aria-hidden>
            <path d="M3.5 3.5A1 1 0 0 1 4.5 2.5h5A1 1 0 0 1 10.5 3.5v5a1 1 0 0 1-1 1h-.5v.5a1 1 0 0 1-1 1h-5a1 1 0 0 1-1-1v-5a1 1 0 0 1 1-1H3V3.5zm1 0H3.5V3h.5v.5zm0 1H3v5h5V9h-.5a1 1 0 0 1-1-1V4.5zM5.5 3.5h3v4h-3v-4z"/>
          </svg>
          Kopyala
        </>
      )}
    </button>
  );
}

/* ── Prompt card ──────────────────────────────────────────────────────────── */

function PromptCard({ p }: { p: ReadyPrompt }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div
      className="rounded-xl border overflow-hidden"
      style={{ borderColor: "#e2e8f0", backgroundColor: "#ffffff" }}
    >
      {/* Header */}
      <button
        className="w-full flex items-start gap-3 px-4 py-4 text-left hover:bg-slate-50 transition-colors"
        onClick={() => setExpanded((v) => !v)}
      >
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <span
              className="text-xs font-medium px-2 py-0.5 rounded-full"
              style={{ backgroundColor: "#eff6ff", color: "#2563eb" }}
            >
              {p.toolName}
            </span>
            <span className="text-xs text-slate-400">{p.category}</span>
          </div>
          <p className="text-sm font-semibold text-slate-800 leading-snug">{p.title}</p>
          <p className="text-xs text-slate-500 mt-0.5">{p.description}</p>
        </div>
        <svg
          viewBox="0 0 12 12"
          fill="currentColor"
          className="w-4 h-4 flex-shrink-0 mt-0.5 text-slate-400 transition-transform"
          style={{ transform: expanded ? "rotate(180deg)" : "rotate(0deg)" }}
          aria-hidden
        >
          <path fillRule="evenodd" d="M6 8.5a.75.75 0 0 1-.53-.22l-3-3a.75.75 0 1 1 1.06-1.06L6 6.69l2.47-2.47a.75.75 0 1 1 1.06 1.06l-3 3A.75.75 0 0 1 6 8.5Z" clipRule="evenodd" />
        </svg>
      </button>

      {/* Prompt body */}
      {expanded && (
        <div style={{ borderTop: "1px solid #e2e8f0", backgroundColor: "#f8fafc" }}>
          <div className="px-4 pt-3 pb-2 flex items-center justify-between">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
              Prompt metni
            </span>
            <CopyButton text={p.prompt} />
          </div>
          <pre
            className="px-4 pb-4 text-xs leading-relaxed text-slate-700 whitespace-pre-wrap font-mono overflow-x-auto"
            style={{ fontFamily: "ui-monospace, 'Cascadia Code', monospace" }}
          >
            {p.prompt}
          </pre>
          <div className="px-4 pb-3 flex flex-wrap gap-1.5">
            {p.tags.map((t) => (
              <span
                key={t}
                className="text-[10px] px-2 py-0.5 rounded-full"
                style={{ backgroundColor: "#f1f5f9", color: "#64748b" }}
              >
                {t}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/* ── Day 1 task card ──────────────────────────────────────────────────────── */

const TASK_TYPE_CONFIG: Record<
  DayOneTask["type"],
  { label: string; bg: string; text: string; iconPath: string }
> = {
  setup: {
    label: "Kurulum",
    bg: "#eff6ff",
    text: "#2563eb",
    iconPath: "M10.5 3.5A3 3 0 0 0 4 5.5v.5H2.75A1.75 1.75 0 0 0 1 7.75v3.5C1 12.216 1.784 13 2.75 13h8.5A1.75 1.75 0 0 0 13 11.25v-3.5A1.75 1.75 0 0 0 11.25 6H10v-.5a3 3 0 0 0-.5-1.67V3.5z",
  },
  learn: {
    label: "Öğren",
    bg: "#fdf4ff",
    text: "#7c3aed",
    iconPath: "M6 1.75a.75.75 0 0 1 .75-.75h4.5a.75.75 0 0 1 .75.75v9.5a.75.75 0 0 1-.75.75h-4.5A.75.75 0 0 1 6 11.25v-9.5zM1 3.25a.75.75 0 0 1 .75-.75h3a.75.75 0 0 1 0 1.5h-3A.75.75 0 0 1 1 3.25zm0 3a.75.75 0 0 1 .75-.75h3a.75.75 0 0 1 0 1.5h-3A.75.75 0 0 1 1 6.25zm0 3a.75.75 0 0 1 .75-.75h3a.75.75 0 0 1 0 1.5h-3A.75.75 0 0 1 1 9.25z",
  },
  create: {
    label: "Oluştur",
    bg: "#f0fdf4",
    text: "#16a34a",
    iconPath: "M6 1a.75.75 0 0 1 .75.75v3.5h3.5a.75.75 0 0 1 0 1.5h-3.5v3.5a.75.75 0 0 1-1.5 0v-3.5H1.75a.75.75 0 0 1 0-1.5h3.5V1.75A.75.75 0 0 1 6 1z",
  },
  connect: {
    label: "Bağla",
    bg: "#fff7ed",
    text: "#c2410c",
    iconPath: "M3.75 2a.75.75 0 0 0-.75.75v.5h-.5A2.25 2.25 0 0 0 .25 5.5v5.25A2.25 2.25 0 0 0 2.5 13h9a2.25 2.25 0 0 0 2.25-2.25V5.5A2.25 2.25 0 0 0 11.5 3.25H11v-.5A.75.75 0 0 0 10.25 2h-6.5z",
  },
};

function DayOneCard({ task, index }: { task: DayOneTask; index: number }) {
  const cfg = TASK_TYPE_CONFIG[task.type];

  return (
    <div
      className="flex gap-4 px-4 py-4 rounded-xl border"
      style={{
        borderColor: task.requiresPaid ? "#fde68a" : "#e2e8f0",
        backgroundColor: task.requiresPaid ? "#fffbeb" : "#ffffff",
      }}
    >
      {/* Step number */}
      <div
        className="flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold"
        style={{ backgroundColor: "#f1f5f9", color: "#475569" }}
      >
        {index + 1}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap mb-1">
          {/* Type badge */}
          <span
            className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded"
            style={{ backgroundColor: cfg.bg, color: cfg.text }}
          >
            {cfg.label}
          </span>
          {/* Time estimate */}
          <span className="text-xs text-slate-400">{task.timeEstimate}</span>
          {/* Tool badge if present */}
          {task.toolName && (
            <span
              className="text-[10px] font-medium px-1.5 py-0.5 rounded"
              style={{ backgroundColor: "#f8fafc", color: "#64748b", border: "1px solid #e2e8f0" }}
            >
              {task.toolName}
            </span>
          )}
          {/* Paid indicator */}
          {task.requiresPaid && (
            <span
              className="text-[10px] font-bold uppercase px-1.5 py-0.5 rounded"
              style={{ backgroundColor: "#fef3c7", color: "#92400e" }}
            >
              Ücretli
            </span>
          )}
        </div>
        <p className="text-sm font-semibold text-slate-800 leading-snug mb-1">
          {task.title}
        </p>
        <p className="text-xs text-slate-500 leading-relaxed">{task.detail}</p>
        {/* Free alternative note */}
        {task.freeAlternative && (
          <p
            className="text-xs mt-1.5 px-2 py-1.5 rounded-lg leading-relaxed"
            style={{ backgroundColor: "#f0fdf4", color: "#15803d" }}
          >
            💡 <strong>Ücretsiz alternatif:</strong> {task.freeAlternative}
          </p>
        )}
      </div>
    </div>
  );
}

/* ── Main client component ──────────────────────────────────────────────── */

export function PremiumPlanClient({ plan, budget, goalAreas }: Props) {
  const [tab, setTab] = useState<Tab>("roadmap");

  // Collect all unique tool slugs from the plan
  const toolSlugs = Array.from(
    new Set(plan.stages.flatMap((s) => s.tools.map((t) => t.slug)))
  );

  const prompts = getPromptsForTools(toolSlugs, goalAreas);
  const dayOneTasks = getDayOneTasks(toolSlugs, budget);

  return (
    <div className="flex flex-col h-full overflow-hidden">

      {/* ── Tab bar ──────────────────────────────────────────────────────── */}
      <div
        className="flex-shrink-0 flex border-b overflow-x-auto"
        style={{ backgroundColor: "#ffffff", borderColor: "#e2e8f0" }}
        role="tablist"
      >
        <TabBtn
          active={tab === "roadmap"}
          onClick={() => setTab("roadmap")}
          icon={
            <svg viewBox="0 0 14 14" fill="currentColor" className="w-3.5 h-3.5" aria-hidden>
              <path fillRule="evenodd" d="M7 1.75a5.25 5.25 0 1 0 0 10.5A5.25 5.25 0 0 0 7 1.75zM.25 7a6.75 6.75 0 1 1 13.5 0A6.75 6.75 0 0 1 .25 7zm7.5-2.25a.75.75 0 0 0-1.5 0v2.5c0 .2.08.39.22.53l1.5 1.5a.75.75 0 1 0 1.06-1.06l-1.28-1.28V4.75z" clipRule="evenodd" />
            </svg>
          }
        >
          Yol Haritası
        </TabBtn>
        <TabBtn
          active={tab === "overview"}
          onClick={() => setTab("overview")}
          icon={
            <svg viewBox="0 0 14 14" fill="currentColor" className="w-3.5 h-3.5" aria-hidden>
              <path fillRule="evenodd" d="M1.75 2.5a.75.75 0 0 0 0 1.5h10.5a.75.75 0 0 0 0-1.5H1.75zm0 3a.75.75 0 0 0 0 1.5h10.5a.75.75 0 0 0 0-1.5H1.75zm0 3a.75.75 0 0 0 0 1.5H7a.75.75 0 0 0 0-1.5H1.75z" clipRule="evenodd" />
            </svg>
          }
        >
          Plan Özeti
        </TabBtn>
        {prompts.length > 0 && (
          <TabBtn
            active={tab === "prompts"}
            onClick={() => setTab("prompts")}
            icon={
              <svg viewBox="0 0 14 14" fill="currentColor" className="w-3.5 h-3.5" aria-hidden>
                <path d="M2 2.5A1.5 1.5 0 0 1 3.5 1h7A1.5 1.5 0 0 1 12 2.5v1.25a.75.75 0 0 1-1.5 0V2.5h-7v9h3.25a.75.75 0 0 1 0 1.5H3.5A1.5 1.5 0 0 1 2 11.5v-9zM7.75 8a.75.75 0 0 1 .75-.75h3.72l-.97-.97a.75.75 0 1 1 1.06-1.06l2.25 2.25a.75.75 0 0 1 0 1.06L12.31 10.8a.75.75 0 1 1-1.06-1.06l.97-.97H8.5A.75.75 0 0 1 7.75 8z" />
              </svg>
            }
          >
            Hazır Promptlar
          </TabBtn>
        )}
        {dayOneTasks.length > 0 && (
          <TabBtn
            active={tab === "day1"}
            onClick={() => setTab("day1")}
            icon={
              <svg viewBox="0 0 14 14" fill="currentColor" className="w-3.5 h-3.5" aria-hidden>
                <path fillRule="evenodd" d="M2.5 1.75A.75.75 0 0 1 3.25 1h7.5a.75.75 0 0 1 .75.75v2a.75.75 0 0 1-.22.53L8 7.56v3.19l-2 1V7.56L2.72 4.28A.75.75 0 0 1 2.5 3.75v-2z" clipRule="evenodd" />
              </svg>
            }
          >
            Gün 1 Listesi
          </TabBtn>
        )}
      </div>

      {/* ── Roadmap tab ──────────────────────────────────────────────────── */}
      {tab === "roadmap" && (
        <div className="flex-1 min-h-0 overflow-hidden">
          <StageRoadmap stages={plan.stages} />
        </div>
      )}

      {/* ── Overview tab ─────────────────────────────────────────────────── */}
      {tab === "overview" && (
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 flex flex-col gap-8">

            {/* Key insight */}
            <div
              className="flex items-start gap-3 px-4 py-4 rounded-xl border"
              style={{ backgroundColor: "#eff6ff", borderColor: "#bfdbfe" }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"
                className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: "#2563eb" }} aria-hidden>
                <path fillRule="evenodd" d="M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0Zm-7-4a1 1 0 1 1-2 0 1 1 0 0 1 2 0ZM9 9a.75.75 0 0 0 0 1.5h.253a.25.25 0 0 1 .244.304l-.459 2.066A1.75 1.75 0 0 0 10.747 15H11a.75.75 0 0 0 0-1.5h-.253a.25.25 0 0 1-.244-.304l.459-2.066A1.75 1.75 0 0 0 9.253 9H9Z" clipRule="evenodd" />
              </svg>
              <p className="text-sm font-medium leading-relaxed" style={{ color: "#1e40af" }}>
                {plan.summary.keyInsight}
              </p>
            </div>

            {/* First action */}
            <div
              className="flex items-start gap-3 px-4 py-4 rounded-xl border"
              style={{ backgroundColor: "#f0fdf4", borderColor: "#86efac" }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"
                className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: "#16a34a" }} aria-hidden>
                <path fillRule="evenodd" d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16ZM6.75 9.25a.75.75 0 0 0 0 1.5h4.59l-2.1 1.95a.75.75 0 0 0 1.02 1.1l3.5-3.25a.75.75 0 0 0 0-1.1l-3.5-3.25a.75.75 0 1 0-1.02 1.1l2.1 1.95H6.75Z" clipRule="evenodd" />
              </svg>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.1em] mb-1" style={{ color: "#15803d" }}>
                  İlk yapman gereken
                </p>
                <p className="text-sm font-medium leading-relaxed" style={{ color: "#166534" }}>
                  {plan.summary.criticalFirstStep}
                </p>
              </div>
            </div>

            {/* Priority map */}
            <section>
              <h2 className="text-xs font-bold uppercase tracking-[0.08em] mb-4 text-slate-500">
                Öncelik Haritası
              </h2>
              <PriorityMap items={plan.priorityMap} />
            </section>

            {/* Effect summary */}
            <section>
              <h2 className="text-xs font-bold uppercase tracking-[0.08em] mb-4 text-slate-500">
                Beklenen Etki
              </h2>
              <EffectSummary items={plan.effectSummary} />
            </section>

            {/* What is expected */}
            <section>
              <h2 className="text-xs font-bold uppercase tracking-[0.08em] mb-4 text-slate-500">
                Senden Ne Bekleniyor?
              </h2>
              <WhatIsExpected items={plan.whatIsExpected} />
            </section>

          </div>
        </div>
      )}

      {/* ── Hazır Promptlar tab ──────────────────────────────────────────── */}
      {tab === "prompts" && (
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6">

            {/* Intro */}
            <div className="mb-6">
              <h2 className="text-base font-bold text-slate-800 mb-1">Hazır Kullanıma Uygun Promptlar</h2>
              <p className="text-sm text-slate-500">
                Planındaki araçlara özel, kopyala-yapıştır hazır prompt şablonları.
                Köşeli parantezleri kendi bilgilerinle doldurup doğrudan kullanabilirsin.
              </p>
            </div>

            {/* Prompts grouped by tool */}
            <div className="flex flex-col gap-3">
              {prompts.map((p) => (
                <PromptCard key={p.id} p={p} />
              ))}
            </div>

            {/* Tip */}
            <div
              className="mt-6 flex items-start gap-3 px-4 py-3 rounded-xl border"
              style={{ backgroundColor: "#fefce8", borderColor: "#fde68a" }}
            >
              <span className="text-base flex-shrink-0">💡</span>
              <p className="text-xs text-amber-800 leading-relaxed">
                <strong>İpucu:</strong> Promptları çalıştırmadan önce köşeli parantezlerdeki yer tutucuları
                kendi bağlamınla doldur. Ne kadar spesifik olursan, çıktı o kadar kullanılabilir olur.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ── Gün 1 Listesi tab ────────────────────────────────────────────── */}
      {tab === "day1" && (
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-2xl mx-auto px-4 sm:px-6 py-6">

            {/* Intro */}
            <div className="mb-6">
              <div
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold mb-3"
                style={{ backgroundColor: "#f0fdf4", color: "#16a34a", border: "1px solid #86efac" }}
              >
                <svg viewBox="0 0 12 12" fill="currentColor" className="w-3 h-3" aria-hidden>
                  <path fillRule="evenodd" d="M10.78 3.22a.75.75 0 0 1 0 1.06l-5.5 5.5a.75.75 0 0 1-1.06 0l-2.5-2.5a.75.75 0 1 1 1.06-1.06L4.75 8.19l4.97-4.97a.75.75 0 0 1 1.06 0Z" clipRule="evenodd" />
                </svg>
                Bugün yapabilirsin
              </div>
              <h2 className="text-base font-bold text-slate-800 mb-1">Gün 1 Başlangıç Listesi</h2>
              <p className="text-sm text-slate-500">
                Planına bugün başlamak için sıralı aksiyon listesi. Kurulum adımlarını atlama — ilerleyen günleri kolaylaştırır.
              </p>
            </div>

            {/* Tasks */}
            <div className="flex flex-col gap-3 mb-6">
              {dayOneTasks.map((task, i) => (
                <DayOneCard key={i} task={task} index={i} />
              ))}
            </div>

            {/* Time estimate summary */}
            <div
              className="flex items-center justify-between px-4 py-3 rounded-xl border"
              style={{ backgroundColor: "#f8fafc", borderColor: "#e2e8f0" }}
            >
              <div>
                <p className="text-xs font-semibold text-slate-700">Tahmini toplam süre</p>
                <p className="text-xs text-slate-500 mt-0.5">Gün 1 tamamlamak için ortalama</p>
              </div>
              <span className="text-lg font-black text-slate-800">
                ~{Math.round(dayOneTasks.reduce((acc, t) => acc + parseInt(t.timeEstimate), 0) / 10) * 10} dk
              </span>
            </div>

            {/* Motivation note */}
            <div
              className="mt-4 flex items-start gap-3 px-4 py-3 rounded-xl border"
              style={{ backgroundColor: "#eff6ff", borderColor: "#bfdbfe" }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor"
                className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: "#2563eb" }} aria-hidden>
                <path d="M8 1a.75.75 0 0 1 .75.75V4.5h1.5a.75.75 0 0 1 0 1.5h-1.5v1.94l1.22-1.22a.75.75 0 1 1 1.06 1.06L8.75 9.56V11a.75.75 0 0 1-1.5 0V9.56L5.03 7.78A.75.75 0 0 1 6.09 6.72l1.16 1.16V6h-1.5a.75.75 0 0 1 0-1.5h1.5V1.75A.75.75 0 0 1 8 1z" />
              </svg>
              <p className="text-xs text-blue-800 leading-relaxed">
                <strong>Hatırlatma:</strong> Bu listedeki her tamamlanan adım bir sonraki aşamayı hızlandırır.
                Mükemmel kurulum arama — çalışan kurulum yeterli.
              </p>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
