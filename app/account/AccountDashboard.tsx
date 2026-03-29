"use client";

import { signOut }           from "next-auth/react";
import Link                  from "next/link";
import { useAnalysisHistory } from "@/lib/persistence/hooks";
import type { AuthUser }     from "@/lib/auth/session";
import { AnalysisCard }      from "./AnalysisCard";

/* ─── Entitlement badge helpers ──────────────────────────────────────────── */
type PlanTier = "free" | "pro_once" | "pro_sub";

function getPlanTier(premiumCount: number, _analyses: unknown[]): PlanTier {
  if (premiumCount > 0) return "pro_once";
  return "free";
}

const PLAN_CONFIG: Record<PlanTier, { label: string; bg: string; color: string; border: string }> = {
  free:     { label: "Ücretsiz",  bg: "#f1f5f9", color: "#475569", border: "#e2e8f0" },
  pro_once: { label: "Pro",       bg: "#eff6ff", color: "#1d4ed8", border: "#bfdbfe" },
  pro_sub:  { label: "Pro Üye",   bg: "#f0fdf4", color: "#15803d", border: "#86efac" },
};

/* ─── Provider badge ─────────────────────────────────────────────────────── */
function ProviderBadge({ provider }: { provider?: string }) {
  if (!provider || provider === "credentials") return null;
  const icons: Record<string, string> = { google: "G", github: "GH" };
  return (
    <span
      className="text-[10px] font-bold px-1.5 py-0.5 rounded"
      style={{ backgroundColor: "#f1f5f9", color: "#64748b" }}
    >
      {icons[provider] ?? provider}
    </span>
  );
}

/* ─── Props ──────────────────────────────────────────────────────────────── */
interface Props { user: AuthUser; }

/* ─── Main ───────────────────────────────────────────────────────────────── */
export function AccountDashboard({ user }: Props) {
  const { analyses, isLoaded, totalCount, favoriteCount, premiumCount, remove, toggleFavorite } =
    useAnalysisHistory();

  if (!user) return null;

  const initials = (user.name ?? user.email ?? "?")
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const planTier = isLoaded ? getPlanTier(premiumCount, analyses) : "free";
  const plan     = PLAN_CONFIG[planTier];

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#f8fafc" }}>

      {/* Header */}
      <div style={{ backgroundColor: "#ffffff", borderBottom: "1px solid #e2e8f0" }}>
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              {/* Avatar */}
              <div
                className="h-14 w-14 rounded-full flex items-center justify-center shrink-0 text-lg font-bold"
                style={{ backgroundColor: "#2563eb", color: "#ffffff" }}
              >
                {user.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={user.image} alt={user.name ?? ""} className="h-14 w-14 rounded-full object-cover" />
                ) : (
                  initials
                )}
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-xl font-bold" style={{ color: "#0f172a" }}>
                    {user.name ?? "Hesabım"}
                  </h1>
                  <ProviderBadge provider={user.provider} />
                </div>
                <p className="text-sm" style={{ color: "#64748b" }}>{user.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Link
                href="/"
                className="inline-flex items-center gap-1.5 text-sm font-medium transition-colors hover:text-slate-900"
                style={{ color: "#64748b" }}
              >
                <svg viewBox="0 0 16 16" fill="currentColor" className="w-3.5 h-3.5" aria-hidden>
                  <path d="M8.543 2.232a.75.75 0 0 0-1.085 0l-5.25 5.5A.75.75 0 0 0 2.75 9H4v5.25A.75.75 0 0 0 4.75 15h2.5a.75.75 0 0 0 .75-.75V11h2v3.25a.75.75 0 0 0 .75.75h2.5A.75.75 0 0 0 13.25 14.25V9h1.25a.75.75 0 0 0 .543-1.268l-5.25-5.5Z"/>
                </svg>
                Ana Sayfa
              </Link>
              <span style={{ color: "#e2e8f0" }}>|</span>
              <button
                type="button"
                onClick={() => signOut({ callbackUrl: "/" })}
                className="text-sm transition-colors hover:text-slate-600"
                style={{ color: "#94a3b8" }}
              >
                Çıkış yap
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div style={{ borderBottom: "1px solid #e2e8f0", backgroundColor: "#ffffff" }}>
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-5">
          <div className="grid grid-cols-3 gap-4">
            <StatCard label="Analiz"    value={isLoaded ? totalCount   : "—"} />
            <StatCard label="Favori"    value={isLoaded ? favoriteCount : "—"} />
            <StatCard label="Pro plan"  value={isLoaded ? premiumCount  : "—"} />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 flex flex-col gap-8">

        {/* Quick actions */}
        <div className="flex flex-wrap gap-3">
          <Link
            href="/analyze"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-opacity hover:opacity-90"
            style={{ backgroundColor: "#2563eb", color: "#ffffff" }}
          >
            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} className="w-4 h-4" aria-hidden>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4"/>
            </svg>
            Yeni analiz
          </Link>
          <Link
            href="/account/plans"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors hover:bg-slate-100"
            style={{ border: "1px solid #e2e8f0", backgroundColor: "#ffffff", color: "#475569" }}
          >
            Tüm geçmiş
          </Link>
        </div>

        {/* Subscription card */}
        <div
          className="rounded-2xl p-5 flex flex-col gap-4"
          style={{ backgroundColor: "#ffffff", border: "1px solid #e2e8f0" }}
        >
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-sm font-bold mb-0.5" style={{ color: "#0f172a" }}>Mevcut Plan</h2>
              <p className="text-xs" style={{ color: "#64748b" }}>
                {planTier === "free"
                  ? "Ücretsiz plan — analiz sonuçların kaydedilir, Pro içerikler kilitli."
                  : planTier === "pro_once"
                  ? "Pro planı açtın — satın aldığın analizlere her zaman erişebilirsin."
                  : "Pro üye — tüm analizlere sınırsız erişim."}
              </p>
            </div>
            <span
              className="flex-shrink-0 text-xs font-bold px-3 py-1 rounded-full"
              style={{ backgroundColor: plan.bg, color: plan.color, border: `1px solid ${plan.border}` }}
            >
              {plan.label}
            </span>
          </div>

          {planTier === "free" && (
            <div
              className="rounded-xl p-4 flex flex-col gap-3"
              style={{ backgroundColor: "#f8fafc", border: "1px solid #e2e8f0" }}
            >
              <p className="text-xs font-semibold" style={{ color: "#0f172a" }}>Pro plan ile ne kazanırsın?</p>
              <ul className="flex flex-col gap-1.5">
                {[
                  "Adım adım uygulanabilir plan",
                  "Sana özel araç rolleri ve öncelik sırası",
                  "Hazır prompt şablonları",
                  "Gün 1 başlangıç listesi",
                ].map((b) => (
                  <li key={b} className="flex items-center gap-2 text-xs" style={{ color: "#475569" }}>
                    <span style={{ color: "#2563eb" }}>→</span> {b}
                  </li>
                ))}
              </ul>
              <Link
                href="/analyze"
                className="inline-flex items-center gap-1.5 text-sm font-semibold transition-colors hover:text-blue-700 mt-1"
                style={{ color: "#2563eb" }}
              >
                Analizi başlat — $2.99'dan başlayan fiyatlarla →
              </Link>
            </div>
          )}

          {planTier === "pro_once" && (
            <div
              className="rounded-xl p-4 flex items-center gap-3"
              style={{ backgroundColor: "#eff6ff", border: "1px solid #bfdbfe" }}
            >
              <span className="text-xl" aria-hidden>🎉</span>
              <div>
                <p className="text-sm font-semibold" style={{ color: "#1d4ed8" }}>Pro planlara erişimin var</p>
                <p className="text-xs mt-0.5" style={{ color: "#3b82f6" }}>
                  Satın aldığın analizleri Hesabım &gt; Geçmiş'ten açabilirsin.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Recent analyses */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-semibold" style={{ color: "#0f172a" }}>Son Analizler</h2>
            {totalCount > 3 && (
              <Link href="/account/plans" className="text-sm transition-colors hover:text-blue-700" style={{ color: "#2563eb" }}>
                Tümünü gör ({totalCount})
              </Link>
            )}
          </div>

          {!isLoaded && (
            <div className="flex flex-col gap-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-20 rounded-xl animate-pulse" style={{ backgroundColor: "#e2e8f0" }} />
              ))}
            </div>
          )}

          {isLoaded && analyses.length === 0 && (
            <div className="rounded-2xl py-12 text-center" style={{ border: "1px dashed #e2e8f0" }}>
              <p className="text-sm mb-3" style={{ color: "#94a3b8" }}>Henüz kayıtlı analiz yok.</p>
              <Link href="/analyze" className="text-sm font-semibold transition-colors hover:text-blue-700" style={{ color: "#2563eb" }}>
                İlk analizini başlat →
              </Link>
            </div>
          )}

          {isLoaded && analyses.length > 0 && (
            <div className="flex flex-col gap-3">
              {analyses.slice(0, 3).map((analysis) => (
                <AnalysisCard
                  key={analysis.id}
                  analysis={analysis}
                  onRemove={remove}
                  onToggleFavorite={toggleFavorite}
                />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: number | string }) {
  return (
    <div className="rounded-xl text-center px-4 py-3" style={{ border: "1px solid #e2e8f0", backgroundColor: "#ffffff" }}>
      <div className="text-2xl font-black" style={{ color: "#0f172a" }}>{value}</div>
      <div className="text-xs mt-0.5" style={{ color: "#94a3b8" }}>{label}</div>
    </div>
  );
}
