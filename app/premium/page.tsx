import type { Metadata } from "next";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { PremiumPlanClient } from "@/components/premium/PremiumPlanClient";
import { generatePremiumPlan } from "@/lib/recommendation/premium-engine";
import { checkPremiumAccess } from "@/lib/premium/access";
import type { ParsedParams } from "@/lib/recommendation/mock-engine";

/* ── Renders the plan headline as a clean mission statement title ── */
function PlanHeadlineSteps({ headline }: { headline: string }) {
  const parts = headline
    .replace(/\.$/, "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  // Join with an arrow separator so it reads as a flowing title, not a list
  const display = parts.length > 1 ? parts.join("  →  ") : headline;

  return (
    <h1
      className="text-sm font-semibold leading-snug"
      style={{ color: "#1e293b", letterSpacing: "-0.01em" }}
    >
      {display}
    </h1>
  );
}

export const metadata: Metadata = {
  title: "Pro Plan",
  description: "Sana özel aşama bazlı uygulanabilir plan, araç rehberi ve öncelik haritası.",
  robots: { index: false, follow: false },
};

interface PageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function PremiumPage({ searchParams }: PageProps) {
  const raw = await searchParams;

  const params: ParsedParams = {
    type:   typeof raw.type   === "string" ? raw.type   : undefined,
    goals:  typeof raw.goals  === "string" ? raw.goals  : undefined,
    budget: typeof raw.budget === "string" ? raw.budget : undefined,
    team:   typeof raw.team   === "string" ? raw.team   : undefined,
    biz:    typeof raw.biz    === "string" ? raw.biz    : undefined,
  };

  const token = typeof raw.token === "string" ? raw.token : undefined;
  const { hasAccess } = await checkPremiumAccess(token);
  const plan = generatePremiumPlan(params);

  const qs = new URLSearchParams(
    Object.fromEntries(
      Object.entries(params).filter((entry): entry is [string, string] => typeof entry[1] === "string")
    )
  ).toString();

  /* ── Access gate ─────────────────────────────────────────────────────── */
  if (!hasAccess) {
    return (
      <>
        <Navbar />
        <main className="flex flex-col flex-1 items-center justify-center text-center px-4 py-20 gap-6">
          <span
            className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider"
            style={{ backgroundColor: "#f5f3ff", color: "#7c3aed", border: "1px solid #c4b5fd" }}
          >
            Pro Plan
          </span>
          <h1 className="text-2xl font-semibold" style={{ color: "#0f172a" }}>
            Bu planı görmek için önce aç
          </h1>
          <p className="max-w-sm text-sm" style={{ color: "#64748b" }}>
            Planın hazır — bir adım kaldı.
          </p>
          <Link
            href={`/premium/unlock${qs ? `?${qs}` : ""}`}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-white font-semibold text-sm transition-opacity hover:opacity-90"
            style={{ background: "linear-gradient(135deg, #7c3aed, #6d28d9)" }}
          >
            Planı aç →
          </Link>
        </main>
        <Footer />
      </>
    );
  }

  /* ── Full Pro plan — single-screen experience ────────────────────────── */
  return (
    <>
      <Navbar />

      {/*
       * h-[calc(100dvh-4rem)]: fills exactly the viewport below the 64px navbar.
       * overflow-hidden: page-level vertical scroll disabled — StageRoadmap
       *   handles its own internal scrolling via flex-1/overflow-y-auto columns.
       */}
      <main className="flex flex-col overflow-hidden h-[calc(100dvh-4rem)]">

        {/* ── Compact mission header — clean white, two-row ── */}
        <div
          className="flex-shrink-0 border-b"
          style={{ backgroundColor: "#ffffff", borderColor: "#e2e8f0" }}
        >
          <div className="max-w-6xl mx-auto px-4 sm:px-6 py-2.5">
            {/* Top row: nav + stats */}
            <div className="flex items-center gap-3 mb-1.5">
              <Link
                href={`/results${qs ? `?${qs}` : ""}`}
                className="inline-flex items-center gap-1 text-xs rounded-lg px-2 py-1 border border-slate-200 text-slate-500 hover:text-slate-700 hover:bg-slate-50 transition-colors flex-shrink-0"
              >
                <svg viewBox="0 0 12 12" fill="currentColor" className="w-3 h-3" aria-hidden>
                  <path fillRule="evenodd" d="M7.78 3.22a.75.75 0 0 0-1.06 0L3.97 5.97a.75.75 0 0 0 0 1.06l2.75 2.75a.75.75 0 0 0 1.06-1.06L5.56 6.5l2.22-2.22a.75.75 0 0 0 0-1.06z" clipRule="evenodd" />
                </svg>
                Sonuçlar
              </Link>
              <div className="w-px h-4 flex-shrink-0 bg-slate-200" />
              <span
                className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full flex-shrink-0"
                style={{ backgroundColor: "#f5f3ff", color: "#7c3aed", border: "1px solid #c4b5fd" }}
              >
                Pro Plan
              </span>
              <div className="flex-1" />
              <div className="flex items-center gap-2">
                {/* Stage count — pill badge */}
                <div
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full"
                  style={{ backgroundColor: "#eff6ff", border: "1px solid #bfdbfe" }}
                >
                  <svg viewBox="0 0 14 14" fill="currentColor" className="w-3 h-3 flex-shrink-0" style={{ color: "#2563eb" }} aria-hidden>
                    <path fillRule="evenodd" d="M1 2.75A.75.75 0 0 1 1.75 2h10.5a.75.75 0 0 1 0 1.5H1.75A.75.75 0 0 1 1 2.75Zm0 4A.75.75 0 0 1 1.75 6h10.5a.75.75 0 0 1 0 1.5H1.75A.75.75 0 0 1 1 6.75Zm0 4a.75.75 0 0 1 .75-.75h4.5a.75.75 0 0 1 0 1.5h-4.5a.75.75 0 0 1-.75-.75Z" clipRule="evenodd" />
                  </svg>
                  <span className="text-xs font-bold" style={{ color: "#1d4ed8" }}>{plan.stages.length} aşama</span>
                </div>
                {/* Time-to-result — pill badge */}
                <div
                  className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full"
                  style={{ backgroundColor: "#f0fdf4", border: "1px solid #86efac" }}
                >
                  <svg viewBox="0 0 14 14" fill="currentColor" className="w-3 h-3 flex-shrink-0" style={{ color: "#16a34a" }} aria-hidden>
                    <path fillRule="evenodd" d="M7 1.75a5.25 5.25 0 1 0 0 10.5A5.25 5.25 0 0 0 7 1.75ZM.25 7a6.75 6.75 0 1 1 13.5 0A6.75 6.75 0 0 1 .25 7ZM7 3.75a.75.75 0 0 1 .75.75v2.69l1.03 1.03a.75.75 0 0 1-1.06 1.06L6.47 8.03A.75.75 0 0 1 6.25 7.5V4.5A.75.75 0 0 1 7 3.75Z" clipRule="evenodd" />
                  </svg>
                  <span className="text-xs font-bold" style={{ color: "#15803d" }}>{plan.summary.timeToFirstResult}</span>
                </div>
              </div>
            </div>
            {/* Bottom row: headline as visual step chain */}
            <PlanHeadlineSteps headline={plan.summary.headline} />
          </div>
        </div>

        {/* ── Plan content (tabs: roadmap + plan overview) ─────────────────── */}
        <div className="flex-1 min-h-0 overflow-hidden">
          <div className="h-full max-w-6xl mx-auto">
            <PremiumPlanClient
              plan={plan}
              budget={params.budget}
              goalAreas={params.goals?.split(",").filter(Boolean)}
            />
          </div>
        </div>

      </main>
    </>
  );
}
