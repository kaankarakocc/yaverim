import Link from "next/link";
import type { Metadata } from "next";
import { debugRecommendation } from "@/lib/recommendation/debug";
import { ScoreBar, ScorePill } from "@/components/admin/ScoreBar";
import { ToolStatusBadge } from "@/components/admin/ToolStatusBadge";
import type { ParsedParams } from "@/lib/recommendation/engine";

export const metadata: Metadata = {
  title: "Admin — Recommendation Debug",
  robots: { index: false, follow: false },
};

interface PageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

const USER_TYPE_OPTIONS = [
  { value: "freelancer", label: "Freelancer" },
  { value: "founder",    label: "İşletme Sahibi" },
  { value: "individual", label: "Birey" },
  { value: "team",       label: "Ekip" },
];

const GOAL_OPTIONS = [
  "content", "advertising", "seo", "development", "design",
  "operations", "ecommerce", "customer-support", "revenue", "cost-reduction",
];

const BUDGET_OPTIONS = [
  { value: "free-only", label: "Yalnızca Ücretsiz" },
  { value: "low",       label: "Düşük Bütçe" },
  { value: "mid",       label: "Orta Bütçe" },
  { value: "best",      label: "En İyi Çözüm" },
];

const TEAM_OPTIONS = [
  { value: "solo",        label: "Tek Başıma" },
  { value: "small",       label: "Küçük Ekip" },
  { value: "growing",     label: "Büyüyen Ekip" },
  { value: "established", label: "Oturmuş Ekip" },
];

export default async function DebugPage({ searchParams }: PageProps) {
  const raw = await searchParams;

  const params: ParsedParams = {
    type:   typeof raw.type   === "string" ? raw.type   : undefined,
    goals:  typeof raw.goals  === "string" ? raw.goals  : undefined,
    budget: typeof raw.budget === "string" ? raw.budget : undefined,
    team:   typeof raw.team   === "string" ? raw.team   : undefined,
    biz:    typeof raw.biz    === "string" ? raw.biz    : undefined,
  };

  const hasParams = Object.values(params).some(Boolean);
  const debug = hasParams ? debugRecommendation(params) : null;

  const currentType   = params.type   ?? "freelancer";
  const currentGoals  = params.goals  ?? "content";
  const currentBudget = params.budget ?? "low";
  const currentTeam   = params.team   ?? "solo";

  return (
    <div className="flex flex-col gap-8">
      {/* Header */}
      <div>
        <h1 className="text-xl font-semibold text-slate-900 mb-1">Recommendation Debug</h1>
        <p className="text-sm text-slate-500">
          Öneri motorunun hangi araçları neden seçtiğini gör. Her filter ve skor adımı görünür.
        </p>
      </div>

      {/* ── Kullanım Kılavuzu ─────────────────────────────────────────────── */}
      <div className="rounded-xl border p-5 flex flex-col gap-4" style={{ backgroundColor: "#eff6ff", borderColor: "#bfdbfe" }}>
        <div className="flex items-center gap-2">
          <svg viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4 flex-shrink-0" style={{ color: "#2563eb" }} aria-hidden>
            <path fillRule="evenodd" d="M15 8A7 7 0 1 1 1 8a7 7 0 0 1 14 0ZM9 5a1 1 0 1 1-2 0 1 1 0 0 1 2 0ZM6.75 8a.75.75 0 0 0 0 1.5h.75v1.75a.75.75 0 0 0 1.5 0v-2.5A.75.75 0 0 0 8.25 8h-1.5Z" clipRule="evenodd" />
          </svg>
          <h2 className="text-sm font-bold" style={{ color: "#1d4ed8" }}>Bu sayfayı nasıl kullanırsın?</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <HowToCard
            step="1"
            title="Senaryo parametrelerini gir"
            body="Kullanıcı tipi, bütçe, ekip ve hedef alan(lar)ı seç. Birden fazla goal için virgülle yaz: content,seo,advertising"
            color="#2563eb"
          />
          <HowToCard
            step="2"
            title="'Debug →' butonuna bas"
            body="Motor çalışır ve tüm araçları filtreler, puanlar. Hangi araç hangi filtreyi geçti, hangisi neden elendi — hepsi tabloda görünür."
            color="#7c3aed"
          />
          <HowToCard
            step="3"
            title="Sonuçları yorumla"
            body="Tabloda satır renklerine göre: normal satır = filtre geçti, soluk satır = elendi. Skor detayı için 'skor detayı' linkine tıkla."
            color="#16a34a"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          <LegendItem color="#16a34a" label="Yeşil ✓" description="Filtreden geçti (kullanıcı tipine, hedefe veya bütçeye uygun)" />
          <LegendItem color="#dc2626" label="Kırmızı ✗" description="Filtreden geçemedi — o araç bu bağlamda önerilmez" />
          <LegendItem color="#2563eb" label="En Uygun" description="Tüm filtrelerden geçen araçlar arasında en yüksek skoru alan" />
          <LegendItem color="#94a3b8" label="Soluk satır" description="Elenen araç — nedenini 'failReason' sütununda görebilirsin" />
        </div>

        <div className="rounded-lg p-3 text-xs leading-relaxed" style={{ backgroundColor: "rgba(37,99,235,0.06)", color: "#1e40af" }}>
          <strong>Skor detayı:</strong> Tablodaki her uygun araçta &quot;skor detayı&quot; açılır bölümünü tıklayarak
          fitToNeed · easeOfUse · priceValue · productivityImpact · growthImpact · integrationFit
          puanlarını ve uygulanan cezaları (Türkçe desteği eksikse <span className="text-amber-600">tr−</span>,
          platform uyumu yoksa <span className="text-red-600">plat−</span>,
          generalist araçlara <span className="text-orange-600">gen−</span>) görebilirsin.
          En alttaki <strong>→ X.XXX</strong> final skorudur.
        </div>
      </div>

      {/* Context form — GET form, no JS needed */}
      <form method="get" className="rounded-lg border border-slate-200 bg-white p-5">
        <p className="text-xs font-semibold text-slate-600 uppercase tracking-wider mb-4">Bağlamı Ayarla</p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
          <FormField label="Kullanıcı Tipi" name="type" value={currentType} options={USER_TYPE_OPTIONS} />
          <FormField label="Bütçe" name="budget" value={currentBudget} options={BUDGET_OPTIONS} />
          <FormField label="Ekip" name="team" value={currentTeam} options={TEAM_OPTIONS} />
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
              Goals (virgülle)
            </label>
            <input
              type="text"
              name="goals"
              defaultValue={currentGoals}
              placeholder="content,seo,advertising"
              className="w-full bg-slate-100 border border-slate-300 rounded px-2.5 py-1.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-400"
            />
            <p className="text-[10px] text-slate-300">{GOAL_OPTIONS.join(", ")}</p>
          </div>
        </div>
        <button
          type="submit"
          className="px-4 py-2 bg-zinc-700 hover:bg-slate-200 text-slate-900 text-xs font-medium rounded transition-colors"
        >
          Debug →
        </button>
      </form>

      {/* Results */}
      {debug ? (
        <div className="flex flex-col gap-6">
          {/* Context summary */}
          <div className="rounded-lg border border-slate-200 bg-white p-4">
            <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-3">Parsed Context</p>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-3 text-xs">
              <CtxCell label="userType"    value={debug.context.userType} />
              <CtxCell label="primaryGoal" value={debug.context.primaryGoal} accent />
              <CtxCell label="goals"       value={debug.context.goals.join(", ")} />
              <CtxCell label="budget"      value={debug.context.budget} />
              <CtxCell label="team"        value={debug.context.team} />
              <CtxCell label="eligible"    value={`${debug.eligibleCount} araç`} accent />
            </div>
            {debug.widenedFilter && (
              <p className="text-xs text-amber-500 mt-3 flex items-center gap-2">
                <span>⚠</span>
                Bütçe filtresi genişletildi — az araç geçti, budget kısıtı kaldırıldı.
              </p>
            )}
          </div>

          {/* Final selection */}
          <div className="rounded-lg border border-slate-200 bg-white p-4">
            <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-3">Seçilen Araçlar</p>
            <div className="grid grid-cols-3 gap-4">
              <SelectionCell role="best-fit"  slug={debug.finalSelection.bestFit}  label="En Uygun" color="emerald" />
              <SelectionCell role="free-alt"  slug={debug.finalSelection.freeAlt}  label="Ücretsiz Alt." color="blue" />
              <SelectionCell role="power-alt" slug={debug.finalSelection.powerAlt} label="Güçlü Alt." color="violet" />
            </div>
          </div>

          {/* Tool table */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-slate-700">Tüm Araçlar — Filter & Skor Analizi</p>
              <p className="text-xs text-slate-400">
                {debug.eligibleCount} eligible · {debug.allTools.length - debug.eligibleCount} filtered
              </p>
            </div>

            <div className="rounded-lg border border-slate-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b border-slate-200 bg-white">
                      <Th>Araç</Th>
                      <Th center>Kullanıcı Tipi</Th>
                      <Th center>Goal</Th>
                      <Th center>Bütçe</Th>
                      <Th center>Skor</Th>
                      <Th center>Rank</Th>
                      <Th>Seçildi</Th>
                      <Th>Detay</Th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-800/40">
                    {debug.allTools.map((entry) => (
                      <tr
                        key={entry.tool.slug}
                        className={[
                          "transition-colors",
                          entry.selectedAs  ? "bg-slate-100/60 hover:bg-slate-100" :
                          entry.filters.eligible ? "hover:bg-white/60" :
                          "opacity-40 hover:opacity-60",
                        ].join(" ")}
                      >
                        <td className="px-3 py-2.5">
                          <div>
                            <Link
                              href={`/admin/tools/${entry.tool.slug}`}
                              className="text-slate-800 font-medium hover:text-white"
                            >
                              {entry.tool.name}
                            </Link>
                            <p className="text-[10px] text-slate-300 font-mono">{entry.tool.slug}</p>
                          </div>
                        </td>
                        <FilterCell pass={entry.filters.passedUserType} />
                        <FilterCell pass={entry.filters.passedGoal} />
                        <FilterCell pass={entry.filters.passedBudget} />
                        <td className="px-3 py-2.5 text-center">
                          {entry.scores ? (
                            <ScorePill value={entry.scores.finalScore} />
                          ) : (
                            <span className="text-slate-300">—</span>
                          )}
                        </td>
                        <td className="px-3 py-2.5 text-center text-slate-500 font-mono">
                          {entry.eligibleRank ?? "—"}
                        </td>
                        <td className="px-3 py-2.5">
                          {entry.selectedAs ? (
                            <RoleBadge role={entry.selectedAs} />
                          ) : (
                            <span className="text-zinc-800">—</span>
                          )}
                        </td>
                        <td className="px-3 py-2.5">
                          {entry.filters.eligible && entry.scores && (
                            <details className="cursor-pointer">
                              <summary className="text-slate-400 hover:text-slate-600 text-[10px]">
                                skor detayı
                              </summary>
                              <div className="mt-2 min-w-[260px] flex flex-col gap-1.5 pb-1">
                                <ScoreBar label="fitToNeed"          value={entry.scores.fitToNeed.raw}          weight={entry.scores.fitToNeed.weight}          weighted={entry.scores.fitToNeed.weighted} />
                                <ScoreBar label="easeOfUse"          value={entry.scores.easeOfUse.raw}          weight={entry.scores.easeOfUse.weight}          weighted={entry.scores.easeOfUse.weighted} />
                                <ScoreBar label="priceValue"         value={entry.scores.priceValue.raw}         weight={entry.scores.priceValue.weight}         weighted={entry.scores.priceValue.weighted} />
                                <ScoreBar label="productivityImpact" value={entry.scores.productivityImpact.raw} weight={entry.scores.productivityImpact.weight} weighted={entry.scores.productivityImpact.weighted} />
                                <ScoreBar label="growthImpact"       value={entry.scores.growthImpact.raw}       weight={entry.scores.growthImpact.weight}       weighted={entry.scores.growthImpact.weighted} />
                                <ScoreBar label="integrationFit"     value={entry.scores.integrationFit.raw}     weight={entry.scores.integrationFit.weight}     weighted={entry.scores.integrationFit.weighted} />
                                <div className="text-[10px] text-slate-400 mt-1 font-mono space-y-0.5">
                                  <p>base:       {entry.scores.normalizedBase.toFixed(3)}</p>
                                  <p>goal+:      {entry.scores.goalBonus.toFixed(1)}</p>
                                  <p>type+:      {entry.scores.typeBonus.toFixed(1)}</p>
                                  {entry.scores.turkishPenalty > 0   && <p className="text-amber-600">tr−:       {entry.scores.turkishPenalty.toFixed(2)}</p>}
                                  {entry.scores.platformPenalty > 0  && <p className="text-red-600">plat−:    {entry.scores.platformPenalty.toFixed(2)}</p>}
                                  {entry.scores.generalistPenalty > 0 && <p className="text-orange-600">gen−:     {entry.scores.generalistPenalty.toFixed(2)}</p>}
                                  <p className="text-slate-600 font-semibold">→ {entry.scores.finalScore.toFixed(3)}</p>
                                </div>
                              </div>
                            </details>
                          )}
                          {!entry.filters.eligible && entry.filters.failReason && (
                            <span className="text-[10px] text-slate-300">{entry.filters.failReason}</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Quick test links */}
          <div className="rounded-lg border border-slate-200 p-4">
            <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-3">Hızlı Test Senaryoları</p>
            <div className="flex flex-wrap gap-2">
              {QUICK_SCENARIOS.map((s) => (
                <Link
                  key={s.label}
                  href={`/admin/debug?${s.qs}`}
                  className="text-[10px] px-2.5 py-1.5 rounded bg-slate-100 text-slate-600 hover:bg-zinc-700 hover:text-slate-800 transition-colors font-mono"
                >
                  {s.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="rounded-lg border border-slate-200 bg-white p-12 text-center">
          <p className="text-slate-500 text-sm mb-2">Parametre girilmedi</p>
          <p className="text-slate-300 text-xs">Yukarıdaki formu doldur ve &quot;Debug →&quot; düğmesine bas.</p>
        </div>
      )}
    </div>
  );
}

/* ─── Sub-components ─────────────────────────────────────────────────────── */

function FormField({
  label, name, value, options,
}: {
  label: string;
  name: string;
  value: string;
  options: { value: string; label: string }[];
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">{label}</label>
      <select
        name={name}
        defaultValue={value}
        className="bg-slate-100 border border-slate-300 rounded px-2.5 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-blue-400"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
    </div>
  );
}

function Th({ children, center }: { children: React.ReactNode; center?: boolean }) {
  return (
    <th className={`px-3 py-2 text-left text-[10px] font-semibold uppercase tracking-wider text-slate-400 ${center ? "text-center" : ""}`}>
      {children}
    </th>
  );
}

function FilterCell({ pass }: { pass: boolean }) {
  return (
    <td className="px-3 py-2.5 text-center">
      {pass
        ? <span className="text-emerald-500 text-sm" aria-label="Geçti">✓</span>
        : <span className="text-red-700 text-sm"    aria-label="Geçemedi">✗</span>
      }
    </td>
  );
}

function CtxCell({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-[10px] text-slate-300 uppercase tracking-wider">{label}</span>
      <span className={`text-xs font-mono ${accent ? "text-slate-900 font-semibold" : "text-slate-600"}`}>
        {value}
      </span>
    </div>
  );
}

function SelectionCell({
  role, slug, label, color,
}: {
  role: string;
  slug?: string;
  label: string;
  color: "emerald" | "blue" | "violet";
}) {
  const styles = {
    emerald: "border-emerald-900/50 bg-emerald-950/20",
    blue:    "border-blue-900/50    bg-blue-950/20",
    violet:  "border-violet-900/50  bg-violet-950/20",
  };
  const textStyles = {
    emerald: "text-emerald-400",
    blue:    "text-blue-400",
    violet:  "text-violet-400",
  };
  return (
    <div className={`rounded border p-3 ${styles[color]}`}>
      <p className={`text-[10px] font-semibold uppercase tracking-wider mb-1 ${textStyles[color]}`}>{label}</p>
      {slug ? (
        <Link href={`/admin/tools/${slug}`} className="text-sm font-medium text-slate-800 hover:text-white">
          {slug}
        </Link>
      ) : (
        <p className="text-slate-300 text-xs">— seçilmedi</p>
      )}
    </div>
  );
}

function RoleBadge({ role }: { role: string }) {
  const styles: Record<string, string> = {
    "best-fit":  "bg-emerald-900/40 text-emerald-400 border border-emerald-900/60",
    "free-alt":  "bg-blue-900/40    text-blue-400    border border-blue-900/60",
    "power-alt": "bg-violet-900/40  text-violet-400  border border-violet-900/60",
  };
  return (
    <span className={`text-[10px] font-medium px-2 py-0.5 rounded ${styles[role] ?? "bg-slate-100 text-slate-500"}`}>
      {role}
    </span>
  );
}

/* ─── How-to helpers ─────────────────────────────────────────────────────── */

function HowToCard({ step, title, body, color }: { step: string; title: string; body: string; color: string }) {
  return (
    <div className="flex gap-3">
      <span
        className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white mt-0.5"
        style={{ backgroundColor: color }}
      >
        {step}
      </span>
      <div>
        <p className="text-sm font-semibold mb-1" style={{ color: "#0f172a" }}>{title}</p>
        <p className="text-xs leading-relaxed" style={{ color: "#475569" }}>{body}</p>
      </div>
    </div>
  );
}

function LegendItem({ color, label, description }: { color: string; label: string; description: string }) {
  return (
    <div className="flex items-start gap-2">
      <span className="flex-shrink-0 text-xs font-bold mt-0.5" style={{ color }}>{label}</span>
      <span className="text-xs" style={{ color: "#475569" }}>{description}</span>
    </div>
  );
}

/* ─── Quick test scenarios ───────────────────────────────────────────────── */

const QUICK_SCENARIOS = [
  { label: "freelancer · content · low",         qs: "type=freelancer&goals=content&budget=low&team=solo" },
  { label: "freelancer · dev · low",             qs: "type=freelancer&goals=development&budget=low&team=solo" },
  { label: "founder · advertising · mid",        qs: "type=founder&goals=advertising&budget=mid&team=small" },
  { label: "founder · ecommerce · best",         qs: "type=founder&goals=ecommerce&budget=best&team=growing" },
  { label: "team · operations · mid",            qs: "type=team&goals=operations&budget=mid&team=established" },
  { label: "individual · content · free-only",   qs: "type=individual&goals=content&budget=free-only&team=solo" },
  { label: "founder · seo + content · low",      qs: "type=founder&goals=seo,content&budget=low&team=solo" },
  { label: "team · customer-support · best",     qs: "type=team&goals=customer-support&budget=best&team=growing" },
];
