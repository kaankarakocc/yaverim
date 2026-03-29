import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { CheckoutButton } from "@/components/payment/CheckoutButton";
import { generatePremiumPlan } from "@/lib/recommendation/premium-engine";
import type { ParsedParams } from "@/lib/recommendation/mock-engine";

export const metadata: Metadata = {
  title: "Planını Aç — Pro Plan",
  description: "Tek seferlik açma veya abonelik ile detaylı planına eriş.",
  robots: { index: false, follow: false },
};

interface PageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

const ONE_TIME_FEATURES = [
  "Bu analize özel tüm aşamalar",
  "Her aşamada araç rehberi ve uygulama adımları",
  "Hazır prompt şablonları — kopyala, kullan",
  "Gün 1 başlangıç listesi",
  "Dikkat edilmesi gerekenler ve sık hatalar",
  "30 gün boyunca tam erişim",
];

const SUBSCRIPTION_FEATURES = [
  "Sınırsız analiz ve plan",
  "Tüm tek seferlik plan özellikleri",
  "Plan geçmişi ve favoriler",
  "Araç karşılaştırma ekranı",
  "Yeni araçlara öncelikli erişim",
  "Öncelikli e-posta destek",
];

const TRUST_NOTES = [
  { text: "Stripe ile güvenli ödeme",      icon: "lock" },
  { text: "7 gün içinde iade garantisi",    icon: "return" },
  { text: "Abonelik istediğin zaman iptal", icon: "cancel" },
  { text: "Kart bilgisi saklanmaz",         icon: "shield" },
];

export default async function UnlockPage({ searchParams }: PageProps) {
  const raw = await searchParams;

  const params: ParsedParams = {
    type:   typeof raw.type   === "string" ? raw.type   : undefined,
    goals:  typeof raw.goals  === "string" ? raw.goals  : undefined,
    budget: typeof raw.budget === "string" ? raw.budget : undefined,
    team:   typeof raw.team   === "string" ? raw.team   : undefined,
    biz:    typeof raw.biz    === "string" ? raw.biz    : undefined,
  };

  const plan = generatePremiumPlan(params);

  const qs = new URLSearchParams(
    Object.fromEntries(
      Object.entries(params).filter((e): e is [string, string] => typeof e[1] === "string")
    )
  ).toString();

  const premiumHref = `/premium${qs ? `?${qs}` : ""}`;
  const resultsHref = `/results${qs ? `?${qs}` : ""}`;

  const headlineSteps = plan.summary.headline
    .replace(/\.$/, "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  return (
    <>
      <Navbar />

      <main className="flex flex-col flex-1" style={{ backgroundColor: "#f8fafc" }}>

        {/* Breadcrumb */}
        <div style={{ backgroundColor: "#ffffff", borderBottom: "1px solid #e2e8f0" }}>
          <div className="max-w-5xl mx-auto px-4 sm:px-6 py-3 flex items-center gap-2">
            <Link href={resultsHref} className="inline-flex items-center gap-1 text-sm transition-colors hover:text-slate-900" style={{ color: "#64748b" }}>
              <svg viewBox="0 0 12 12" fill="currentColor" className="w-3 h-3" aria-hidden>
                <path fillRule="evenodd" d="M7.78 3.22a.75.75 0 0 0-1.06 0L3.97 5.97a.75.75 0 0 0 0 1.06l2.75 2.75a.75.75 0 0 0 1.06-1.06L5.56 6.5l2.22-2.22a.75.75 0 0 0 0-1.06z" clipRule="evenodd" />
              </svg>
              Sonuçlarım
            </Link>
            <svg viewBox="0 0 12 12" fill="currentColor" className="w-3 h-3" style={{ color: "#cbd5e1" }} aria-hidden>
              <path fillRule="evenodd" d="M4.22 3.22a.75.75 0 0 1 1.06 0l3 3a.75.75 0 0 1 0 1.06l-3 3a.75.75 0 1 1-1.06-1.06L6.69 6.5 4.22 4.03a.75.75 0 0 1 0-1.06z" clipRule="evenodd" />
            </svg>
            <span className="text-sm font-semibold" style={{ color: "#1e293b" }}>Pro Plan</span>
          </div>
        </div>

        <div className="max-w-5xl mx-auto w-full px-4 sm:px-6 py-10 sm:py-14">

          {/* Two-column hero */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">

            {/* Left: pitch */}
            <div className="flex flex-col justify-center gap-6">
              <div>
                <span
                  className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-4"
                  style={{ backgroundColor: "#f5f3ff", color: "#6d28d9", border: "1px solid #c4b5fd" }}
                >
                  Pro Plan
                </span>
                <h1 className="text-3xl sm:text-4xl font-bold leading-[1.15] tracking-tight mb-4" style={{ color: "#0f172a" }}>
                  Planın hazır.{" "}
                  <span style={{ color: "#7c3aed" }}>Bir adım kaldı.</span>
                </h1>
                <p className="text-base leading-relaxed" style={{ color: "#475569" }}>
                  Ücretsiz özetini gördün. Sırada uygulanabilir, adım adım rehberin var.
                  Araç listesi değil —{" "}
                  <strong style={{ color: "#1e293b" }}>ne yapacağını tam olarak anlatan bir plan.</strong>
                </p>
              </div>

              {headlineSteps.length > 1 && (
                <div className="flex flex-col gap-2">
                  <p className="text-xs font-bold uppercase tracking-widest" style={{ color: "#94a3b8" }}>
                    Planın yol haritası
                  </p>
                  <div className="flex flex-col gap-2">
                    {headlineSteps.map((step, i) => (
                      <div key={i} className="flex items-start gap-3">
                        <span
                          className="inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold flex-shrink-0 mt-0.5"
                          style={{ backgroundColor: "#7c3aed", color: "#ffffff" }}
                        >
                          {i + 1}
                        </span>
                        <span className="text-sm font-medium pt-0.5" style={{ color: "#334155" }}>{step}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right: plan preview */}
            <PlanPreviewCard
              contextLabel={plan.contextLabel}
              stageCount={plan.stages.length}
              criticalFirstStep={plan.summary.criticalFirstStep}
              timeToFirstResult={plan.summary.timeToFirstResult}
              stageNames={plan.stages.map((s) => s.title)}
            />
          </div>

          {/* Pricing */}
          <div className="mb-8">
            <div className="text-center mb-6">
              <h2 className="text-xl font-bold mb-1" style={{ color: "#0f172a" }}>
                Erişim seçeneğini seç
              </h2>
              <p className="text-sm" style={{ color: "#64748b" }}>
                İki seçeneğin farkı içerik değil — erişim kapsamı ve süre.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto">
              <PricingCard
                badge="Tek seferlik"
                price="$2.99"
                period="/ analiz"
                description="Bu analize özel. 30 gün erişim. Abonelik yok, ek maliyet yok."
                features={ONE_TIME_FEATURES}
                cta="Bu planı aç — $2.99"
                plan="one-time"
                queryString={qs}
                highlighted={false}
              />
              <PricingCard
                badge="Abonelik"
                price="$9"
                period="/ ay"
                description="Sınırsız analiz + plan geçmişi. Birden fazla projen varsa çok daha avantajlı."
                features={SUBSCRIPTION_FEATURES}
                cta="Aboneliği başlat — $9/ay"
                plan="subscription"
                queryString={qs}
                highlighted
                highlightLabel="En avantajlı"
              />
            </div>
          </div>

          {/* Clarifier */}
          <div
            className="max-w-2xl mx-auto rounded-xl px-5 py-4 mb-8"
            style={{ backgroundColor: "#f1f5f9", border: "1px solid #e2e8f0" }}
          >
            <p className="text-sm leading-relaxed" style={{ color: "#475569" }}>
              <strong style={{ color: "#1e293b" }}>Hangisi sana uygun?</strong>{" "}
              Eğer bu analiz için bir kerelik planı kullanmak istiyorsan, tek seferlik yeterli.
              Sık sık analiz yapıyorsan veya birden fazla projen varsa abonelik çok daha avantajlı — her seferinde ayrı ödeme yapmazsın.
            </p>
          </div>

          {/* Trust strip */}
          <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
            {TRUST_NOTES.map((note) => (
              <TrustItem key={note.text} text={note.text} icon={note.icon} />
            ))}
          </div>

        </div>
      </main>

      <Footer />
    </>
  );
}

/* ─── Trust item ─────────────────────────────────────────────────────────── */

function TrustItem({ text, icon }: { text: string; icon: string }) {
  const icons: Record<string, ReactNode> = {
    lock: (
      <svg viewBox="0 0 16 16" fill="currentColor" className="w-3.5 h-3.5" aria-hidden>
        <path fillRule="evenodd" d="M8 1a3.5 3.5 0 0 0-3.5 3.5V7A1.5 1.5 0 0 0 3 8.5v5A1.5 1.5 0 0 0 4.5 15h7a1.5 1.5 0 0 0 1.5-1.5v-5A1.5 1.5 0 0 0 11 7V4.5A3.5 3.5 0 0 0 8 1Zm2 6V4.5a2 2 0 1 0-4 0V7h4Z" clipRule="evenodd" />
      </svg>
    ),
    return: (
      <svg viewBox="0 0 16 16" fill="currentColor" className="w-3.5 h-3.5" aria-hidden>
        <path fillRule="evenodd" d="M1.22 4.22a.75.75 0 0 1 1.06 0l2 2a.75.75 0 0 1-1.06 1.06L2.5 6.56V9.25A2.75 2.75 0 0 0 5.25 12h5.5a.75.75 0 0 1 0 1.5h-5.5A4.25 4.25 0 0 1 1 9.25V6.56L.28 7.28a.75.75 0 0 1-1.06-1.06l2-2Z" clipRule="evenodd" />
      </svg>
    ),
    cancel: (
      <svg viewBox="0 0 16 16" fill="currentColor" className="w-3.5 h-3.5" aria-hidden>
        <path d="M5.28 4.22a.75.75 0 0 0-1.06 1.06L6.94 8l-2.72 2.72a.75.75 0 1 0 1.06 1.06L8 9.06l2.72 2.72a.75.75 0 1 0 1.06-1.06L9.06 8l2.72-2.72a.75.75 0 0 0-1.06-1.06L8 6.94 5.28 4.22Z" />
      </svg>
    ),
    shield: (
      <svg viewBox="0 0 16 16" fill="currentColor" className="w-3.5 h-3.5" aria-hidden>
        <path fillRule="evenodd" d="M8.5 1.709a.75.75 0 0 0-1 0 8.963 8.963 0 0 1-4.84 2.217.75.75 0 0 0-.66.74v1.834c0 3.033 1.82 5.796 4.606 7.112a.75.75 0 0 0 .788 0C10.178 12.296 12 9.533 12 6.5V4.666a.75.75 0 0 0-.66-.74A8.963 8.963 0 0 1 8.5 1.71ZM6.22 8.22a.75.75 0 0 1 1.06 0L8 8.94l2.72-2.72a.75.75 0 1 1 1.06 1.06l-3.25 3.25a.75.75 0 0 1-1.06 0l-1.25-1.25a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
      </svg>
    ),
  };

  return (
    <div className="flex items-center gap-1.5 text-xs" style={{ color: "#64748b" }}>
      <span style={{ color: "#22c55e" }}>{icons[icon]}</span>
      {text}
    </div>
  );
}

/* ─── Plan preview card ─────────────────────────────────────────────────── */

function PlanPreviewCard({
  contextLabel,
  stageCount,
  criticalFirstStep,
  timeToFirstResult,
  stageNames,
}: {
  contextLabel: string;
  stageCount: number;
  criticalFirstStep: string;
  timeToFirstResult: string;
  stageNames: string[];
}) {
  return (
    <div className="rounded-2xl overflow-hidden" style={{ border: "1px solid #c4b5fd", boxShadow: "0 4px 24px rgba(124,58,237,0.10)" }}>
      {/* Header */}
      <div className="px-5 py-4" style={{ background: "linear-gradient(135deg, #7c3aed 0%, #5b21b6 100%)" }}>
        {/* Üst satır: badge tek başına */}
        <div className="flex items-center gap-2 mb-2">
          <span
            className="text-[10px] font-bold px-2.5 py-1 rounded-full whitespace-nowrap inline-flex items-center justify-center"
            style={{ backgroundColor: "rgba(255,255,255,0.18)", color: "#ffffff", border: "1px solid rgba(255,255,255,0.25)" }}
          >
            {stageCount} aşama
          </span>
          <span
            className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
            style={{ backgroundColor: "rgba(255,255,255,0.12)", color: "#ddd6fe" }}
          >
            Pro Plan
          </span>
        </div>
        {/* Başlık */}
        <p className="text-base font-bold mb-1" style={{ color: "#ffffff" }}>Senin planın hazır</p>
        {/* Context label — tam genişlik, wrap edebilir */}
        <p className="text-xs leading-relaxed mb-1" style={{ color: "#c4b5fd" }}>
          {contextLabel}
        </p>
        <p className="text-xs" style={{ color: "#ddd6fe" }}>
          İlk sonuç: {timeToFirstResult}
        </p>
      </div>

      {/* Stage list */}
      <div className="px-5 py-4" style={{ backgroundColor: "#faf5ff" }}>
        <p className="text-[10px] font-bold uppercase tracking-widest mb-3" style={{ color: "#7c3aed" }}>
          Plan aşamaları
        </p>
        <div className="flex flex-col gap-2">
          {stageNames.map((name, i) => (
            <div key={i} className="flex items-center gap-3">
              <span
                className="inline-flex items-center justify-center w-5 h-5 rounded-full text-[10px] font-bold flex-shrink-0"
                style={{
                  backgroundColor: i === 0 ? "#7c3aed" : "#ede9fe",
                  color: i === 0 ? "#ffffff" : "#6d28d9",
                }}
              >
                {i + 1}
              </span>
              <span className="text-sm font-medium" style={{ color: i === 0 ? "#1e293b" : "#64748b" }}>
                {name}
              </span>
              {i > 0 && (
                <svg viewBox="0 0 16 16" fill="currentColor" className="w-3 h-3 ml-auto flex-shrink-0" style={{ color: "#c4b5fd" }} aria-hidden>
                  <path fillRule="evenodd" d="M8 1a3.5 3.5 0 0 0-3.5 3.5V7A1.5 1.5 0 0 0 3 8.5v5A1.5 1.5 0 0 0 4.5 15h7a1.5 1.5 0 0 0 1.5-1.5v-5A1.5 1.5 0 0 0 11 7V4.5A3.5 3.5 0 0 0 8 1Zm2 6V4.5a2 2 0 1 0-4 0V7h4Z" clipRule="evenodd" />
                </svg>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* First step teaser */}
      <div className="px-5 py-4" style={{ backgroundColor: "#ffffff", borderTop: "1px solid #ede9fe" }}>
        <p className="text-[10px] font-bold uppercase tracking-widest mb-1.5" style={{ color: "#94a3b8" }}>
          İlk kritik adım
        </p>
        <p className="text-sm leading-relaxed" style={{ color: "#334155" }}>
          {criticalFirstStep}
        </p>
      </div>

      {/* Bonus features */}
      <div className="px-5 py-3 flex items-center justify-between" style={{ backgroundColor: "#faf5ff", borderTop: "1px solid #ede9fe" }}>
        <span className="text-xs font-medium" style={{ color: "#7c3aed" }}>
          + Hazır prompt şablonları · Gün 1 listesi · Araç rolleri
        </span>
        <svg viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4 flex-shrink-0" style={{ color: "#c4b5fd" }} aria-hidden>
          <path fillRule="evenodd" d="M8 1a3.5 3.5 0 0 0-3.5 3.5V7A1.5 1.5 0 0 0 3 8.5v5A1.5 1.5 0 0 0 4.5 15h7a1.5 1.5 0 0 0 1.5-1.5v-5A1.5 1.5 0 0 0 11 7V4.5A3.5 3.5 0 0 0 8 1Zm2 6V4.5a2 2 0 1 0-4 0V7h4Z" clipRule="evenodd" />
        </svg>
      </div>
    </div>
  );
}

/* ─── Pricing card ──────────────────────────────────────────────────────── */

function PricingCard({
  badge,
  price,
  period,
  description,
  features,
  cta,
  plan,
  queryString,
  highlighted,
  highlightLabel,
}: {
  badge: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  cta: string;
  plan: "one-time" | "subscription";
  queryString: string;
  highlighted: boolean;
  highlightLabel?: string;
}) {
  return (
    <div
      className="rounded-2xl flex flex-col overflow-hidden"
      style={{
        border: `${highlighted ? "2" : "1"}px solid ${highlighted ? "#8b5cf6" : "#e2e8f0"}`,
        boxShadow: highlighted ? "0 4px 20px rgba(124,58,237,0.12)" : "0 1px 4px rgba(0,0,0,0.04)",
        backgroundColor: "#ffffff",
      }}
    >
      {/* Top highlight banner */}
      {highlighted && (
        <div
          className="px-5 py-1.5 text-center text-[11px] font-bold uppercase tracking-widest"
          style={{ background: "linear-gradient(to right, #7c3aed, #8b5cf6)", color: "#ffffff" }}
        >
          {highlightLabel}
        </div>
      )}

      {/* Card header */}
      <div className="px-5 pt-5 pb-4" style={{ backgroundColor: highlighted ? "#faf5ff" : "#f8fafc" }}>
        <p
          className="text-[11px] font-bold uppercase tracking-widest mb-3"
          style={{ color: highlighted ? "#6d28d9" : "#475569" }}
        >
          {badge}
        </p>
        <div className="flex items-baseline gap-1.5 mb-2">
          <span
            className="text-4xl font-black tracking-tight leading-none"
            style={{ color: highlighted ? "#5b21b6" : "#0f172a" }}
          >
            {price}
          </span>
          <span className="text-sm font-medium" style={{ color: highlighted ? "#7c3aed" : "#94a3b8" }}>
            {period}
          </span>
        </div>
        <p className="text-xs leading-relaxed" style={{ color: "#475569" }}>{description}</p>
      </div>

      {/* Features */}
      <div className="px-5 py-4 flex-1" style={{ backgroundColor: "#ffffff" }}>
        <ul className="flex flex-col gap-2.5">
          {features.map((f) => (
            <li key={f} className="flex items-start gap-2.5">
              <svg
                viewBox="0 0 16 16"
                fill="currentColor"
                className="w-4 h-4 flex-shrink-0 mt-0.5"
                style={{ color: highlighted ? "#7c3aed" : "#16a34a" }}
                aria-hidden
              >
                <path fillRule="evenodd" d="M12.416 3.376a.75.75 0 0 1 .208 1.04l-5 7.5a.75.75 0 0 1-1.154.114l-3-3a.75.75 0 0 1 1.06-1.06l2.353 2.353 4.493-6.74a.75.75 0 0 1 1.04-.207z" clipRule="evenodd" />
              </svg>
              <span className="text-sm" style={{ color: "#334155" }}>{f}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* CTA — Stripe Checkout */}
      <div className="px-5 pb-5" style={{ backgroundColor: "#ffffff" }}>
        <CheckoutButton
          plan={plan}
          queryString={queryString}
          className="w-full inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl text-sm font-bold transition-opacity hover:opacity-90"
          style={
            highlighted
              ? { background: "linear-gradient(135deg, #7c3aed, #5b21b6)", color: "#ffffff" }
              : { backgroundColor: "#1e293b", color: "#ffffff" }
          }
        >
          {cta}
        </CheckoutButton>
        <p className="text-[11px] text-center mt-2" style={{ color: "#94a3b8" }}>
          {highlighted
            ? "İstediğin zaman iptal · 7 gün iade"
            : "Tek seferlik · abonelik yok · 30 gün erişim"}
        </p>
      </div>
    </div>
  );
}
