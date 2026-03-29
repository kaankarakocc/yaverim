import type { Metadata } from "next";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Container } from "@/components/layout/Container";
import { DiagnosisCard }       from "@/components/results/DiagnosisCard";
import { DecisionSummary }     from "@/components/results/DecisionSummary";
import { WhyThese }            from "@/components/results/WhyThese";
import { SolutionAreaSection } from "@/components/results/SolutionAreaSection";
import { ResultsPremiumCta }   from "@/components/results/ResultsPremiumCta";
import { recommend, type ParsedParams } from "@/lib/recommendation/engine";

/* ─── Metadata ───────────────────────────────────────────────────────────── */

export const metadata: Metadata = {
  title: "Analiz Sonuçların",
  description: "Sana özel yapay zekâ araçları önerileri ve çözüm planın.",
  robots: { index: false, follow: false },
};

/* ─── Page ───────────────────────────────────────────────────────────────── */

interface Props {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function ResultsPage({ searchParams }: Props) {
  const raw = await searchParams;

  /* Normalise to ParsedParams */
  const params: ParsedParams = {
    type:   typeof raw.type   === "string" ? raw.type   : undefined,
    biz:    typeof raw.biz    === "string" ? raw.biz    : undefined,
    goals:  typeof raw.goals  === "string" ? raw.goals  : undefined,
    team:   typeof raw.team   === "string" ? raw.team   : undefined,
    budget: typeof raw.budget === "string" ? raw.budget : undefined,
    note:   typeof raw.note   === "string" ? raw.note   : undefined,
  };

  const hasParams = Object.values(params).some(Boolean);
  const result = recommend(hasParams ? params : { type: "freelancer", goals: "content", budget: "low", team: "solo" });

  /* Build query string for CTA deep-link to unlock page */
  const queryString = new URLSearchParams(
    Object.fromEntries(
      Object.entries(params).filter((e): e is [string, string] => typeof e[1] === "string")
    )
  ).toString();

  return (
    <>
      <Navbar />
      <main className="flex flex-col flex-1 bg-white">
        <Container size="narrow" className="py-10 md:py-14">

          {/* Top nav breadcrumb */}
          <div className="flex items-center gap-2 mb-8 text-sm">
            <Link
              href="/analyze"
              className="text-slate-400 hover:text-slate-600 transition-colors"
            >
              ← Yeni analiz
            </Link>
            <span className="text-slate-300">/</span>
            <span className="text-slate-600">Sonuçlar</span>
          </div>

          {/* Page title */}
          <div className="mb-8 flex items-start justify-between gap-4 flex-wrap">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span
                  className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full"
                  style={{ backgroundColor: "#eff6ff", color: "#2563eb", border: "1px solid #bfdbfe" }}
                >
                  <span
                    className="w-1.5 h-1.5 rounded-full"
                    style={{ backgroundColor: "#2563eb" }}
                    aria-hidden
                  />
                  Kişisel Analiz
                </span>
              </div>
              <h1 className="text-2xl font-semibold tracking-tight" style={{ color: "#0f172a" }}>
                Analiz Sonuçların
              </h1>
              <p className="text-sm mt-1" style={{ color: "#64748b" }}>
                Bağlamına göre özelleştirilmiş öneri — ücretsiz özet.
              </p>
            </div>
          </div>

          {/* ── 1. Teşhis ── */}
          <DiagnosisCard
            contextLabel={result.contextLabel}
            diagnosis={result.diagnosis}
            diagnosisDetails={result.diagnosisDetails}
            className="mb-10"
          />

          <div className="h-px bg-slate-200 mb-10" />

          {/* ── 2. Karar Özeti ── */}
          <DecisionSummary cards={result.decisionCards} className="mb-10" />

          <div className="h-px bg-slate-200 mb-10" />

          {/* ── 3. Neden Bunlar ── */}
          <WhyThese reasons={result.whyThese} className="mb-10" />

          <div className="h-px bg-slate-200 mb-10" />

          {/* ── 4. Çözüm Alanları ── */}
          <SolutionAreaSection areas={result.solutionAreas} className="mb-10" />

          {result.solutionAreas.length > 0 && (
            <div className="h-px bg-slate-200 mb-10" />
          )}

          {/* ── 5. Premium CTA ── */}
          <ResultsPremiumCta className="mb-10" queryString={queryString} />

          {/* ── 6. Restart ── */}
          <div className="flex justify-center pt-4">
            <Link
              href="/analyze"
              className="text-sm text-slate-400 hover:text-slate-600 transition-colors"
            >
              Farklı bir senaryo için analizi yeniden başlat →
            </Link>
          </div>

        </Container>
      </main>
      <Footer />
    </>
  );
}
