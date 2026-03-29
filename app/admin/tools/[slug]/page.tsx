import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getToolBySlug, getTools } from "@/lib/tools/store";
import { validateTool } from "@/lib/ops/validate-tools";
import { REVIEW_NOTES, OPEN_FLAGS, FIELD_SUGGESTIONS } from "@/data/ops/tool-review-notes";
import { ToolStatusBadge } from "@/components/admin/ToolStatusBadge";
import { ScoreBar, ScorePill } from "@/components/admin/ScoreBar";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getTools().map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  return {
    title: `Admin — ${slug}`,
    robots: { index: false, follow: false },
  };
}

export default async function ToolDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const tool = getToolBySlug(slug);
  if (!tool) notFound();

  const validation = validateTool(tool);
  const toolReviews = REVIEW_NOTES.filter((n) => n.toolSlug === slug);
  const toolFlags   = OPEN_FLAGS.filter((f) => f.toolSlug === slug && !f.resolved);
  const toolSuggestions = FIELD_SUGGESTIONS.filter((s) => s.toolSlug === slug && s.status === "pending");

  const scoreAxes = [
    { label: "İhtiyaca Uygunluk",    key: "fitToNeed"          as const },
    { label: "Kullanım Kolaylığı",   key: "easeOfUse"          as const },
    { label: "Fiyat / Değer",        key: "priceValue"         as const },
    { label: "Verim Etkisi",         key: "productivityImpact" as const },
    { label: "Büyüme Etkisi",        key: "growthImpact"       as const },
    { label: "Entegrasyon Uyumu",    key: "integrationFit"     as const },
  ];

  return (
    <div className="flex flex-col gap-8 max-w-4xl">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-slate-500">
        <Link href="/admin" className="hover:text-slate-700">Araçlar</Link>
        <span>/</span>
        <span className="text-slate-700">{tool.name}</span>
      </div>

      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-xl font-semibold text-slate-900">{tool.name}</h1>
            <ToolStatusBadge status={tool.status} />
            <ScorePill value={tool.editorialScore} />
          </div>
          <p className="text-sm text-slate-600">{tool.tagline}</p>
          <p className="text-xs font-mono text-slate-400 mt-1">{tool.slug} · {tool.category}</p>
        </div>
        <a
          href={tool.websiteUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-slate-500 hover:text-slate-700 border border-slate-300 px-3 py-1.5 rounded transition-colors flex-shrink-0"
        >
          Site ↗
        </a>
      </div>

      {/* Validation status */}
      {(!validation.valid || validation.warnings.length > 0) && (
        <div className={`rounded-lg border p-4 ${!validation.valid ? "border-red-900/50 bg-red-950/20" : "border-amber-900/40 bg-amber-950/10"}`}>
          <p className={`text-xs font-semibold uppercase tracking-wider mb-3 ${!validation.valid ? "text-red-500" : "text-amber-500"}`}>
            {!validation.valid ? "Doğrulama Hatası" : "Uyarılar"}
          </p>
          <div className="flex flex-col gap-1">
            {validation.errors.map((e, i) => (
              <p key={i} className="text-xs text-red-400">
                <span className="font-mono text-red-600">{e.field}</span> — {e.message}
              </p>
            ))}
            {validation.warnings.map((w, i) => (
              <p key={i} className="text-xs text-amber-400">
                <span className="font-mono text-amber-600">{w.field}</span> — {w.message}
              </p>
            ))}
          </div>
        </div>
      )}

      {/* Open flags */}
      {toolFlags.length > 0 && (
        <div className="rounded-lg border border-amber-900/50 bg-amber-950/20 p-4">
          <p className="text-xs font-semibold text-amber-500 uppercase tracking-wider mb-3">Açık Bayraklar</p>
          {toolFlags.map((f, i) => (
            <div key={i} className="text-sm">
              <span className="text-amber-400">{f.priority.toUpperCase()}</span>{" "}
              <span className="text-slate-700">{f.reason}</span>
              <span className="text-slate-400 text-xs ml-2">— {f.flaggedBy} · {f.flaggedAt.split("T")[0]}</span>
            </div>
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Score axes */}
        <Section title="Skor Eksenleri">
          <div className="flex flex-col gap-3">
            {scoreAxes.map(({ label, key }) => (
              <ScoreBar key={key} label={label} value={tool.scores[key]} />
            ))}
            <div className="border-t border-slate-200 pt-3 mt-1">
              <ScoreBar label="Editoryal Skor (Genel)" value={tool.editorialScore} />
            </div>
          </div>
        </Section>

        {/* Metadata */}
        <Section title="Metadata">
          <div className="flex flex-col gap-2 text-sm">
            <MetaRow label="Fiyat Katmanı" value={tool.pricingTier} />
            <MetaRow label="Fiyat Etiketi" value={tool.pricingLabel} />
            <MetaRow label="Ücretsiz Plan"  value={tool.hasFree      ? "✓ Var"    : "— Yok"} />
            <MetaRow label="Deneme"          value={tool.hasTrial     ? "✓ Var"    : "— Yok"} />
            <MetaRow label="Affiliate"        value={tool.hasAffiliate ? "✓ Aktif" : "— Yok"} />
            <MetaRow label="Partner"          value={tool.hasPartnership ? "✓ Aktif" : "— Yok"} />
            <MetaRow label="Türkçe Destek"   value={tool.turkishSupport} />
            <MetaRow label="Zorluk"          value={tool.difficultyLevel} />
            <MetaRow label="Logo"            value={tool.logoPath ?? "— Ayarlanmamış"} />
          </div>
        </Section>

        {/* Fit */}
        <Section title="Hedef Kitle & Çözüm Alanları">
          <div className="flex flex-col gap-3">
            <div>
              <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Kullanıcı Tipleri</p>
              <div className="flex flex-wrap gap-1">
                {tool.suitableForUserTypes.map((ut) => (
                  <Tag key={ut}>{ut}</Tag>
                ))}
              </div>
            </div>
            <div>
              <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Çözüm Alanları</p>
              <div className="flex flex-wrap gap-1">
                {tool.solutionAreas.map((area) => (
                  <Tag key={area} accent>{area}</Tag>
                ))}
              </div>
            </div>
            <div>
              <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Sektör Uyumu</p>
              <div className="flex flex-wrap gap-1">
                {tool.sectorFit.map((s) => (
                  <Tag key={s}>{s}</Tag>
                ))}
              </div>
            </div>
            <div>
              <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Alt Kullanım Alanları</p>
              <div className="flex flex-wrap gap-1">
                {tool.subUseCases.map((u) => (
                  <Tag key={u}>{u}</Tag>
                ))}
              </div>
            </div>
          </div>
        </Section>

        {/* Similar / alternatives */}
        <Section title="İlişkili Araçlar">
          <div className="flex flex-col gap-3">
            <div>
              <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Benzer Araçlar</p>
              <div className="flex flex-wrap gap-1">
                {tool.similarTools.length ? tool.similarTools.map((s) => (
                  <Link key={s} href={`/admin/getTools()/${s}`} className="text-xs px-2 py-0.5 rounded bg-slate-100 text-slate-700 hover:bg-zinc-700">
                    {s}
                  </Link>
                )) : <span className="text-xs text-zinc-700">—</span>}
              </div>
            </div>
            <div>
              <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Ücretsiz Alternatifler</p>
              <div className="flex flex-wrap gap-1">
                {tool.freeAlternatives.length ? tool.freeAlternatives.map((s) => (
                  <Link key={s} href={`/admin/getTools()/${s}`} className="text-xs px-2 py-0.5 rounded bg-slate-100 text-slate-700 hover:bg-zinc-700">
                    {s}
                  </Link>
                )) : <span className="text-xs text-zinc-700">—</span>}
              </div>
            </div>
          </div>
        </Section>
      </div>

      {/* Content quality */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Section title="Strong Signals">
          <ul className="flex flex-col gap-1.5">
            {tool.strongSignals.map((s, i) => (
              <li key={i} className="text-xs text-slate-700 flex gap-2">
                <span className="text-slate-400">→</span> {s}
              </li>
            ))}
            {!tool.strongSignals.length && <li className="text-xs text-zinc-700">Boş</li>}
          </ul>
        </Section>

        <Section title="Why Recommended">
          <p className="text-xs text-slate-600 leading-relaxed">{tool.whyRecommended}</p>
        </Section>

        <Section title="Güçlü Yönler">
          <ul className="flex flex-col gap-1.5">
            {tool.strengths.map((s, i) => (
              <li key={i} className="text-xs text-slate-700 flex gap-2">
                <span className="text-emerald-600">+</span> {s}
              </li>
            ))}
          </ul>
        </Section>

        <Section title="Zayıf Yönler">
          <ul className="flex flex-col gap-1.5">
            {tool.weaknesses.map((w, i) => (
              <li key={i} className="text-xs text-slate-700 flex gap-2">
                <span className="text-red-700">−</span> {w}
              </li>
            ))}
          </ul>
        </Section>

        <Section title="Uygun Değil">
          <ul className="flex flex-col gap-1.5">
            {tool.notSuitableFor.map((n, i) => (
              <li key={i} className="text-xs text-slate-600">⛔ {n}</li>
            ))}
            {!tool.notSuitableFor.length && <li className="text-xs text-zinc-700">Boş</li>}
          </ul>
        </Section>
      </div>

      {/* Field change suggestions */}
      {toolSuggestions.length > 0 && (
        <Section title={`Alan Değişiklik Önerileri (${toolSuggestions.length})`}>
          <div className="flex flex-col gap-3">
            {toolSuggestions.map((sug) => (
              <div key={sug.id} className="rounded border border-slate-200 p-3 text-xs">
                <p className="font-mono text-slate-600 mb-1">{sug.field}</p>
                <div className="grid grid-cols-2 gap-2 text-slate-500 mb-1">
                  <div>
                    <span className="text-zinc-700">Mevcut: </span>
                    <span>{JSON.stringify(sug.currentValue)}</span>
                  </div>
                  <div>
                    <span className="text-zinc-700">Önerilen: </span>
                    <span className="text-amber-400">{JSON.stringify(sug.proposedValue)}</span>
                  </div>
                </div>
                <p className="text-slate-500 italic">{sug.reason}</p>
                <p className="text-zinc-700 mt-1">— {sug.proposedBy} · {sug.proposedAt.split("T")[0]}</p>
              </div>
            ))}
          </div>
        </Section>
      )}

      {/* Review history */}
      {toolReviews.length > 0 && (
        <Section title="Review Geçmişi">
          <div className="flex flex-col gap-2">
            {toolReviews.map((rev) => (
              <div key={rev.id} className="flex items-start gap-3 text-xs py-2 border-b border-zinc-900 last:border-0">
                <span className={`flex-shrink-0 px-1.5 py-0.5 rounded font-medium ${rev.applied ? "bg-emerald-900/40 text-emerald-500" : "bg-slate-100 text-slate-500"}`}>
                  {rev.applied ? "Uygulandı" : "Bekliyor"}
                </span>
                <div>
                  <p className="text-slate-700">
                    <span className="font-medium">{rev.action}</span>
                    {" "}·{" "}
                    <span className="text-slate-500">{rev.fromStatus} → {rev.toStatus}</span>
                  </p>
                  <p className="text-slate-500 mt-0.5">{rev.note}</p>
                  <p className="text-zinc-700 mt-0.5">{rev.reviewerAlias} · {rev.timestamp.split("T")[0]}</p>
                </div>
              </div>
            ))}
          </div>
        </Section>
      )}

      {/* Actions */}
      <div className="flex items-center gap-4 pt-4 border-t border-slate-200">
        <Link href="/admin" className="text-xs text-slate-400 hover:text-slate-600">← Tüm araçlar</Link>
        <Link
          href={`/admin/debug?type=freelancer&goals=${tool.solutionAreas[0]}&budget=low&team=solo`}
          className="text-xs text-slate-400 hover:text-slate-600"
        >
          → Bu araçla debug
        </Link>
      </div>
    </div>
  );
}

/* ─── Sub-components ─────────────────────────────────────────────────────── */

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4">
      <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 mb-3">{title}</p>
      {children}
    </div>
  );
}

function MetaRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-3">
      <span className="text-slate-400 text-xs">{label}</span>
      <span className="text-slate-700 text-xs font-mono">{value}</span>
    </div>
  );
}

function Tag({ children, accent }: { children: React.ReactNode; accent?: boolean }) {
  return (
    <span className={`text-[10px] px-1.5 py-0.5 rounded ${accent ? "bg-zinc-700 text-slate-700" : "bg-slate-100 text-slate-500"}`}>
      {children}
    </span>
  );
}




