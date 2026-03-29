import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Container } from "@/components/layout/Container";
import { ToolLogo } from "@/components/common/ToolLogo";
import { getTools, getToolBySlug } from "@/lib/tools/store";
import type { Tool } from "@/data/schemas/tool";
import { getOutboundUrl, isAffiliate, AFFILIATE_LABEL, AFFILIATE_TOOLTIP } from "@/lib/affiliate/links";

/* ─── Static params ──────────────────────────────────────────────────────── */

export function generateStaticParams() {
  return getTools().map((t) => ({ slug: t.slug }));
}

/* ─── Metadata ───────────────────────────────────────────────────────────── */

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const tool = getToolBySlug(slug);
  if (!tool) return { title: "Araç Bulunamadı" };
  return {
    title: `${tool.name} İncelemesi | Yaverim`,
    description: `${tool.tagline} — Güçlü yönler, skorlar, fiyat ve kimler için uygun.`,
  };
}

/* ─── Helpers ────────────────────────────────────────────────────────────── */

const DIFFICULTY_CONFIG: Record<Tool["difficultyLevel"], { label: string; color: string; bg: string }> = {
  beginner:     { label: "Kolay", color: "#15803d", bg: "#dcfce7" },
  intermediate: { label: "Orta",  color: "#d97706", bg: "#fef3c7" },
  advanced:     { label: "İleri", color: "#dc2626", bg: "#fee2e2" },
};

const TURKISH_CONFIG: Record<Tool["turkishSupport"], { label: string; color: string; bg: string }> = {
  full:    { label: "Türkçe tam destekli",  color: "#15803d", bg: "#dcfce7" },
  partial: { label: "Kısmi Türkçe",        color: "#d97706", bg: "#fef3c7" },
  none:    { label: "Türkçe desteği yok",  color: "#dc2626", bg: "#fee2e2" },
};

const SCORE_AXES = [
  { key: "fitToNeed",          label: "İhtiyaç uyumu",    color: "#2563eb" },
  { key: "easeOfUse",          label: "Kullanım kolaylığı", color: "#7c3aed" },
  { key: "priceValue",         label: "Fiyat/performans", color: "#16a34a" },
  { key: "productivityImpact", label: "Verimlilik etkisi", color: "#d97706" },
  { key: "growthImpact",       label: "Büyüme etkisi",    color: "#0891b2" },
  { key: "integrationFit",     label: "Entegrasyon uyumu", color: "#7c3aed" },
] as const;

function ScoreRow({ label, score, color }: { label: string; score: number; color: string }) {
  return (
    <div className="flex items-center gap-3">
      <span className="text-xs w-36 flex-shrink-0" style={{ color: "#475569" }}>{label}</span>
      <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ backgroundColor: "#f1f5f9" }}>
        <div className="h-full rounded-full transition-all" style={{ width: `${score * 10}%`, backgroundColor: color }} />
      </div>
      <span className="text-xs font-bold w-7 text-right tabular-nums" style={{ color: "#0f172a" }}>
        {score.toFixed(1)}
      </span>
    </div>
  );
}

/* ─── Page ───────────────────────────────────────────────────────────────── */

export default async function ToolDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const tool = getToolBySlug(slug);
  if (!tool) notFound();

  const difficulty = DIFFICULTY_CONFIG[tool.difficultyLevel];
  const turkish    = TURKISH_CONFIG[tool.turkishSupport];

  const similarTools = getTools().filter(
    (t) => tool.similarTools.includes(t.slug) && t.slug !== tool.slug
  ).slice(0, 4);

  const freeAlts = getTools().filter(
    (t) => tool.freeAlternatives.includes(t.slug) && t.slug !== tool.slug
  ).slice(0, 3);

  return (
    <>
      <Navbar />
      <main className="flex flex-col flex-1 bg-white">
        <Container size="narrow" className="py-10 md:py-14">

          {/* Breadcrumb */}
          <div className="flex items-center gap-2 mb-8 text-sm">
            <Link href="/getTools()" className="transition-colors hover:text-slate-600" style={{ color: "#94a3b8" }}>
              ← Tüm araçlar
            </Link>
            <span style={{ color: "#e2e8f0" }}>/</span>
            <span style={{ color: "#475569" }}>{tool.name}</span>
          </div>

          {/* Hero block */}
          <div
            className="rounded-2xl p-6 md:p-8 mb-8"
            style={{ backgroundColor: "#f8fafc", border: "1px solid #e2e8f0" }}
          >
            <div className="flex flex-col sm:flex-row sm:items-start gap-5">
              {/* Logo */}
              <ToolLogo
                name={tool.name}
                websiteUrl={tool.websiteUrl}
                size={56}
                style={{ border: "1px solid #e2e8f0", background: "#fff", padding: 4 }}
              />

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-2">
                  <span
                    className="text-xs font-bold px-2 py-0.5 rounded-full"
                    style={{ backgroundColor: "#eff6ff", color: "#1d4ed8" }}
                  >
                    {tool.category}
                  </span>
                  {tool.status === "priority" && (
                    <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{ backgroundColor: "#fef3c7", color: "#d97706" }}>
                      ★ Öne çıkan
                    </span>
                  )}
                  {tool.hasFree && (
                    <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{ backgroundColor: "#dcfce7", color: "#15803d" }}>
                      Ücretsiz plan var
                    </span>
                  )}
                </div>
                <h1 className="text-2xl md:text-3xl font-bold tracking-tight mb-1" style={{ color: "#0f172a" }}>
                  {tool.name}
                </h1>
                <p className="text-base mb-4" style={{ color: "#64748b" }}>{tool.tagline}</p>

                {/* Meta chips */}
                <div className="flex flex-wrap gap-2 mb-5">
                  <span className="text-xs px-2.5 py-1 rounded-full font-semibold" style={{ backgroundColor: difficulty.bg, color: difficulty.color }}>
                    {difficulty.label}
                  </span>
                  <span className="text-xs px-2.5 py-1 rounded-full font-semibold" style={{ backgroundColor: turkish.bg, color: turkish.color }}>
                    {turkish.label}
                  </span>
                  <span className="text-xs px-2.5 py-1 rounded-full font-semibold" style={{ backgroundColor: "#f1f5f9", color: "#475569" }}>
                    {tool.pricingLabel}
                  </span>
                  {tool.hasTrial && (
                    <span className="text-xs px-2.5 py-1 rounded-full font-semibold" style={{ backgroundColor: "#f0fdf4", color: "#16a34a" }}>
                      Ücretsiz deneme
                    </span>
                  )}
                </div>

                {/* CTA buttons */}
                <div className="flex flex-wrap gap-3 items-start">
                  <div className="flex flex-col gap-1">
                    <a
                      href={`/api/track/outbound?tool=${encodeURIComponent(tool.slug)}&name=${encodeURIComponent(tool.name)}&url=${encodeURIComponent(getOutboundUrl(tool))}&src=/getTools()/${tool.slug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-opacity hover:opacity-90"
                      style={{ backgroundColor: "#2563eb", color: "#ffffff" }}
                    >
                      Resmi siteyi ziyaret et
                      <svg viewBox="0 0 16 16" fill="currentColor" className="w-3.5 h-3.5" aria-hidden>
                        <path d="M6.22 8.72a.75.75 0 0 0 1.06 1.06l5.22-5.22v1.69a.75.75 0 0 0 1.5 0V3a.75.75 0 0 0-.75-.75H9.75a.75.75 0 0 0 0 1.5h1.69L6.22 8.72Z" />
                        <path d="M3.5 6.75c0-.69.56-1.25 1.25-1.25H7A.75.75 0 0 0 7 4H4.75A2.75 2.75 0 0 0 2 6.75v4.5A2.75 2.75 0 0 0 4.75 14h4.5A2.75 2.75 0 0 0 12 11.25V9a.75.75 0 0 0-1.5 0v2.25c0 .69-.56 1.25-1.25 1.25h-4.5c-.69 0-1.25-.56-1.25-1.25v-4.5Z" />
                      </svg>
                    </a>
                    {isAffiliate(tool) && (
                      <span
                        className="text-[10px] font-semibold px-2 py-0.5 rounded-full self-start cursor-help"
                        style={{ backgroundColor: "#fef9c3", color: "#a16207" }}
                        title={AFFILIATE_TOOLTIP}
                      >
                        {AFFILIATE_LABEL}
                      </span>
                    )}
                  </div>
                  <Link
                    href={`/compare?getTools()=${tool.slug}`}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-colors hover:bg-slate-100"
                    style={{ border: "1px solid #e2e8f0", color: "#475569", backgroundColor: "#ffffff" }}
                  >
                    Karşılaştır
                  </Link>
                  <Link
                    href={`/analyze`}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-colors hover:bg-slate-100"
                    style={{ border: "1px solid #e2e8f0", color: "#475569", backgroundColor: "#ffffff" }}
                  >
                    Bana uygun mu? →
                  </Link>
                </div>
              </div>

              {/* Score badge */}
              <div
                className="flex-shrink-0 flex flex-col items-center justify-center w-20 h-20 rounded-2xl self-start"
                style={{ backgroundColor: "#ffffff", border: "2px solid #e2e8f0" }}
              >
                <span className="text-3xl font-black leading-none" style={{ color: "#0f172a" }}>
                  {tool.editorialScore.toFixed(1)}
                </span>
                <span className="text-xs font-semibold mt-0.5" style={{ color: "#94a3b8" }}>/ 10</span>
                <span className="text-[9px] font-bold mt-1 uppercase tracking-wide" style={{ color: "#94a3b8" }}>Skor</span>
              </div>
            </div>
          </div>

          {/* Two-column content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

            {/* Left — main content */}
            <div className="lg:col-span-2 flex flex-col gap-8">

              {/* Why recommended */}
              <section>
                <h2 className="text-lg font-bold mb-3" style={{ color: "#0f172a" }}>Neden öneriyoruz?</h2>
                <p className="text-sm leading-relaxed" style={{ color: "#475569" }}>{tool.whyRecommended}</p>
              </section>

              {/* Strengths */}
              <section>
                <h2 className="text-lg font-bold mb-3" style={{ color: "#0f172a" }}>Güçlü yönler</h2>
                <ul className="flex flex-col gap-2.5">
                  {tool.strengths.map((s, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <span
                        className="flex-shrink-0 mt-0.5 flex h-4 w-4 items-center justify-center rounded-full"
                        style={{ backgroundColor: "#dcfce7" }}
                        aria-hidden
                      >
                        <svg viewBox="0 0 10 10" fill="none" stroke="#16a34a" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-2.5 h-2.5" aria-hidden>
                          <path d="M2 5l2 2 4-4" />
                        </svg>
                      </span>
                      <span className="text-sm leading-relaxed" style={{ color: "#334155" }}>{s}</span>
                    </li>
                  ))}
                </ul>
              </section>

              {/* Weaknesses */}
              <section>
                <h2 className="text-lg font-bold mb-3" style={{ color: "#0f172a" }}>Dikkat edilmesi gerekenler</h2>
                <ul className="flex flex-col gap-2.5">
                  {tool.weaknesses.map((w, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <span
                        className="flex-shrink-0 mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0"
                        style={{ backgroundColor: "#fbbf24" }}
                        aria-hidden
                      />
                      <span className="text-sm leading-relaxed" style={{ color: "#475569" }}>{w}</span>
                    </li>
                  ))}
                </ul>
              </section>

              {/* Not suitable for */}
              {tool.notSuitableFor.length > 0 && (
                <section>
                  <h2 className="text-lg font-bold mb-3" style={{ color: "#0f172a" }}>Kimler için uygun değil?</h2>
                  <ul className="flex flex-col gap-2">
                    {tool.notSuitableFor.map((n, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <span className="flex-shrink-0 mt-0.5 text-base leading-none" style={{ color: "#dc2626" }} aria-hidden>×</span>
                        <span className="text-sm leading-relaxed" style={{ color: "#475569" }}>{n}</span>
                      </li>
                    ))}
                  </ul>
                </section>
              )}

              {/* Use cases */}
              <section>
                <h2 className="text-lg font-bold mb-3" style={{ color: "#0f172a" }}>Kullanım alanları</h2>
                <div className="flex flex-wrap gap-2">
                  {tool.subUseCases.map((u) => (
                    <span
                      key={u}
                      className="text-xs font-semibold px-3 py-1.5 rounded-full"
                      style={{ backgroundColor: "#f1f5f9", color: "#475569" }}
                    >
                      {u}
                    </span>
                  ))}
                </div>
              </section>
            </div>

            {/* Right — scores + meta */}
            <div className="flex flex-col gap-6">

              {/* Score axes */}
              <div className="rounded-2xl p-5" style={{ border: "1px solid #e2e8f0", backgroundColor: "#ffffff" }}>
                <h3 className="text-sm font-bold mb-4" style={{ color: "#0f172a" }}>Puanlama eksenler</h3>
                <div className="flex flex-col gap-3">
                  {SCORE_AXES.map((axis) => (
                    <ScoreRow
                      key={axis.key}
                      label={axis.label}
                      score={tool.scores[axis.key]}
                      color={axis.color}
                    />
                  ))}
                </div>
                <p className="text-[10px] mt-4" style={{ color: "#94a3b8" }}>
                  Editoryal bağımsız skor — sponsorluk durumu etkilemez.
                </p>
              </div>

              {/* Sector fit */}
              <div className="rounded-2xl p-5" style={{ border: "1px solid #e2e8f0" }}>
                <h3 className="text-sm font-bold mb-3" style={{ color: "#0f172a" }}>Sektör uyumu</h3>
                <div className="flex flex-wrap gap-1.5">
                  {tool.sectorFit.map((s) => (
                    <span key={s} className="text-[11px] font-semibold px-2 py-0.5 rounded-full" style={{ backgroundColor: "#f8fafc", color: "#64748b", border: "1px solid #e2e8f0" }}>
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              {/* Free alternatives */}
              {freeAlts.length > 0 && (
                <div className="rounded-2xl p-5" style={{ border: "1px solid #e2e8f0" }}>
                  <h3 className="text-sm font-bold mb-3" style={{ color: "#0f172a" }}>Ücretsiz alternatifler</h3>
                  <ul className="flex flex-col gap-2">
                    {freeAlts.map((alt) => (
                      <li key={alt.slug}>
                        <Link
                          href={`/getTools()/${alt.slug}`}
                          className="flex items-center justify-between text-sm transition-colors hover:text-blue-600"
                          style={{ color: "#475569" }}
                        >
                          <span className="font-semibold">{alt.name}</span>
                          <span className="text-xs" style={{ color: "#94a3b8" }}>{alt.editorialScore.toFixed(1)}</span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Similar getTools() */}
              {similarTools.length > 0 && (
                <div className="rounded-2xl p-5" style={{ border: "1px solid #e2e8f0" }}>
                  <h3 className="text-sm font-bold mb-3" style={{ color: "#0f172a" }}>Benzer araçlar</h3>
                  <ul className="flex flex-col gap-2">
                    {similarTools.map((s) => (
                      <li key={s.slug}>
                        <Link
                          href={`/getTools()/${s.slug}`}
                          className="flex items-center justify-between text-sm transition-colors hover:text-blue-600"
                          style={{ color: "#475569" }}
                        >
                          <span className="font-semibold">{s.name}</span>
                          <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded" style={{ backgroundColor: "#f1f5f9", color: "#64748b" }}>
                            {s.category}
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Analyze CTA */}
              <div
                className="rounded-2xl p-5 flex flex-col gap-3"
                style={{ backgroundColor: "#eff6ff", border: "1px solid #bfdbfe" }}
              >
                <p className="text-sm font-bold" style={{ color: "#1e3a8a" }}>
                  {tool.name} sana uygun mu?
                </p>
                <p className="text-xs leading-relaxed" style={{ color: "#1d4ed8" }}>
                  2 dakikalık analiz ile bağlamına özel öneri al.
                </p>
                <Link
                  href="/analyze"
                  className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-opacity hover:opacity-90"
                  style={{ backgroundColor: "#2563eb", color: "#ffffff" }}
                >
                  Analizi başlat →
                </Link>
              </div>
            </div>
          </div>

        </Container>
      </main>
      <Footer />
    </>
  );
}





