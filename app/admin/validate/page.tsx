import Link from "next/link";
import type { Metadata } from "next";
import { getTools, getToolBySlug } from "@/lib/tools/store";
import { validateDataset, lifecycleLabel } from "@/lib/ops/validate-tools";
import { ToolStatusBadge } from "@/components/admin/ToolStatusBadge";

export const metadata: Metadata = {
  title: "Admin — Veri Validasyon",
  robots: { index: false, follow: false },
};

export default function ValidatePage() {
  const report = validateDataset(getTools());

  const allClean   = report.errorCount === 0 && report.warningCount === 0;
  const hasErrors  = report.errorCount > 0;

  return (
    <div className="flex flex-col gap-8 max-w-4xl">
      {/* Header */}
      <div>
        <h1 className="text-xl font-semibold text-slate-900 mb-1">Veri Validasyon Raporu</h1>
        <p className="text-sm text-slate-500">
          Seed data bütünlüğü · {report.results.length} araç kontrol edildi · {report.generatedAt.split("T")[0]}
        </p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <SummaryCard label="Toplam Araç"  value={report.results.length} />
        <SummaryCard label="Temiz"        value={report.validCount}    color="emerald" />
        <SummaryCard label="Uyarı"        value={report.warningCount}  color="amber"   />
        <SummaryCard label="Hata"         value={report.errorCount}    color="red"     />
      </div>

      {/* Duplicate slugs */}
      {report.duplicateSlugs.length > 0 && (
        <Alert color="red" title="Tekrarlayan Slug'lar — Kritik">
          {report.duplicateSlugs.map((s) => (
            <span key={s} className="font-mono text-red-300 text-xs mr-2">{s}</span>
          ))}
        </Alert>
      )}

      {/* All clean */}
      {allClean && !report.duplicateSlugs.length && (
        <Alert color="emerald" title="Tüm araçlar geçerli">
          <span className="text-xs text-emerald-300">
            {report.results.length} araç doğrulandı — hata veya uyarı yok.
          </span>
        </Alert>
      )}

      {/* Results list */}
      <div className="flex flex-col gap-3">
        {report.results
          .sort((a, b) => {
            // Errors first, then warnings, then clean
            if (!a.valid && b.valid) return -1;
            if (a.valid && !b.valid) return 1;
            if (a.warnings.length > b.warnings.length) return -1;
            if (a.warnings.length < b.warnings.length) return 1;
            return a.slug.localeCompare(b.slug);
          })
          .map((result) => {
            const tool = getTools().find((t) => t.slug === result.slug)!;
            const isClean = result.valid && result.warnings.length === 0;

            return (
              <div
                key={result.slug}
                className={[
                  "rounded-lg border p-4",
                  !result.valid      ? "border-red-900/50 bg-red-950/10" :
                  result.warnings.length ? "border-amber-900/40 bg-amber-950/10" :
                  "border-slate-200/50 bg-white/50",
                ].join(" ")}
              >
                <div className="flex items-center justify-between gap-4 mb-2">
                  <div className="flex items-center gap-3">
                    <span
                      className={[
                        "w-2 h-2 rounded-full flex-shrink-0",
                        !result.valid             ? "bg-red-500" :
                        result.warnings.length > 0 ? "bg-amber-500" :
                        "bg-emerald-500",
                      ].join(" ")}
                      aria-hidden="true"
                    />
                    <Link
                      href={`/admin/getTools()/${result.slug}`}
                      className="text-sm font-medium text-slate-800 hover:text-white"
                    >
                      {result.name}
                    </Link>
                    <span className="text-[10px] font-mono text-slate-300">{result.slug}</span>
                    {tool && <ToolStatusBadge status={tool.status} />}
                  </div>
                  <div className="flex items-center gap-2 text-[10px] text-slate-400">
                    {result.errors.length > 0 && (
                      <span className="text-red-500 font-semibold">{result.errors.length} hata</span>
                    )}
                    {result.warnings.length > 0 && (
                      <span className="text-amber-500">{result.warnings.length} uyarı</span>
                    )}
                    {isClean && (
                      <span className="text-emerald-600">✓ Temiz</span>
                    )}
                  </div>
                </div>

                {/* Errors */}
                {result.errors.map((e, i) => (
                  <div key={i} className="flex items-start gap-2 text-xs mt-1.5">
                    <span className="text-red-500 flex-shrink-0">✗</span>
                    <span>
                      <span className="font-mono text-red-400">{e.field}</span>
                      <span className="text-red-300 ml-2">{e.message}</span>
                    </span>
                  </div>
                ))}

                {/* Warnings */}
                {result.warnings.map((w, i) => (
                  <div key={i} className="flex items-start gap-2 text-xs mt-1.5">
                    <span className="text-amber-500 flex-shrink-0">⚠</span>
                    <span>
                      <span className="font-mono text-amber-500">{w.field}</span>
                      <span className="text-amber-300/70 ml-2">{w.message}</span>
                    </span>
                  </div>
                ))}
              </div>
            );
          })}
      </div>

      {/* Lifecycle overview */}
      <div className="rounded-lg border border-slate-200 bg-white p-5">
        <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-4">
          Lifecycle Geçiş Kuralları
        </p>
        <div className="flex flex-wrap items-center gap-2 text-xs font-mono text-slate-500">
          {(["candidate", "tracked", "core", "priority"] as const).map((status, i, arr) => (
            <span key={status} className="flex items-center gap-2">
              <ToolStatusBadge status={status} />
              {i < arr.length - 1 && <span className="text-slate-300">→</span>}
            </span>
          ))}
          <span className="text-slate-300 ml-2">| any →</span>
          <ToolStatusBadge status="deprecated" />
        </div>
        <p className="text-xs text-slate-400 mt-3">
          Geçiş onayı: candidate → tracked → core → priority.
          Herhangi bir aşamadan deprecated'a geçilebilir.
          priority ↔ core çift yönlü geçiş mümkün.
        </p>
      </div>

      {/* Instructions */}
      <div className="rounded-lg border border-slate-200 bg-white/50 p-5">
        <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-3">
          Yeni Araç Ekleme — Kılavuz
        </p>
        <ol className="flex flex-col gap-2 text-xs text-slate-500">
          <li className="flex gap-2"><span className="text-slate-300 flex-shrink-0">1.</span> <code className="text-slate-600">data/seed/getTools().ts</code> dosyasına SEED dizisine yeni bir nesne ekle.</li>
          <li className="flex gap-2"><span className="text-slate-300 flex-shrink-0">2.</span> Tüm zorunlu alanları doldur: slug, name, tagline, pricingLabel, websiteUrl, category, solutionAreas, suitableForUserTypes, scores (6 eksen), strengths, weaknesses, whyRecommended, notSuitableFor.</li>
          <li className="flex gap-2"><span className="text-slate-300 flex-shrink-0">3.</span> <code className="text-slate-600">status: &quot;candidate&quot;</code> ile başla — önce izle, kalite onaylandıktan sonra core/priority&apos;a terfi et.</li>
          <li className="flex gap-2"><span className="text-slate-300 flex-shrink-0">4.</span> Bu validasyon sayfasını yenile — hata yoksa üretime hazır.</li>
          <li className="flex gap-2"><span className="text-slate-300 flex-shrink-0">5.</span> <Link href="/admin/debug" className="text-slate-600 hover:text-slate-800">/admin/debug</Link> sayfasında recommendation motorunda nasıl davrandığını test et.</li>
          <li className="flex gap-2"><span className="text-slate-300 flex-shrink-0">6.</span> Editoryal onay için <code className="text-slate-600">data/ops/tool-review-notes.ts</code>&apos;a review notu ekle ve <code className="text-slate-600">applied: true</code> olarak işaretle.</li>
        </ol>
      </div>

      {/* Navigation */}
      <div className="flex gap-4 pt-2 border-t border-slate-200 text-xs text-slate-400">
        <Link href="/admin"         className="hover:text-slate-600">← Araç Listesi</Link>
        <Link href="/admin/debug"   className="hover:text-slate-600">→ Debug</Link>
      </div>
    </div>
  );
}

/* ─── Sub-components ─────────────────────────────────────────────────────── */

function SummaryCard({
  label, value, color,
}: {
  label: string;
  value: number;
  color?: "emerald" | "amber" | "red";
}) {
  const styles = {
    emerald: "border-emerald-900/40 bg-emerald-950/20",
    amber:   "border-amber-900/40   bg-amber-950/20",
    red:     "border-red-900/40     bg-red-950/20",
  };
  const textStyles = {
    emerald: "text-emerald-300",
    amber:   "text-amber-300",
    red:     "text-red-300",
  };
  return (
    <div className={`rounded-lg border p-4 ${color ? styles[color] : "border-slate-200 bg-white"}`}>
      <p className={`text-2xl font-bold tabular-nums ${color ? textStyles[color] : "text-slate-900"}`}>
        {value}
      </p>
      <p className="text-xs text-slate-500 mt-1">{label}</p>
    </div>
  );
}

function Alert({
  color, title, children,
}: {
  color: "red" | "emerald";
  title: string;
  children: React.ReactNode;
}) {
  const styles = {
    red:     "border-red-900/50     bg-red-950/20",
    emerald: "border-emerald-900/50 bg-emerald-950/20",
  };
  const titleStyles = {
    red:     "text-red-400",
    emerald: "text-emerald-400",
  };
  return (
    <div className={`rounded-lg border p-4 ${styles[color]}`}>
      <p className={`text-xs font-semibold mb-2 ${titleStyles[color]}`}>{title}</p>
      {children}
    </div>
  );
}






