import Link from "next/link";

interface UnlockOptionsProps {
  queryString?: string;
  variant?: "full" | "compact";
}

const ONE_TIME_FEATURES = [
  "Bu analize özel detaylı plan",
  "Tüm aşamalar ve uygulama adımları",
  "PDF çıktısı",
  "30 gün erişim",
];

const SUBSCRIPTION_FEATURES = [
  "Sınırsız analiz ve plan",
  "PDF çıktısı + plan geçmişi",
  "Favoriler ve karşılaştırma",
  "Yeni araçlara öncelikli erişim",
  "E-posta destek",
];

export function UnlockOptions({ queryString, variant = "full" }: UnlockOptionsProps) {
  const qs = queryString ? `?${queryString}` : "";
  const unlockBase = `/premium/unlock${qs}`;

  if (variant === "compact") {
    return (
      <div className="rounded-xl border border-slate-200 px-5 py-4" style={{ backgroundColor: "#f8fafc" }}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.08em] text-slate-500 mb-0.5">
              Erişim seçeneğin
            </p>
            <p className="text-sm text-slate-600">
              Tek seferlik <strong className="text-slate-900">$2.99</strong> ile bu plan ·{" "}
              veya abonelikle sınırsız <strong className="text-slate-900">$9/ay</strong>
            </p>
          </div>
          <Link
            href={unlockBase}
            className="flex-shrink-0 inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-sm font-semibold shadow-sm transition-opacity hover:opacity-90"
            style={{ background: "linear-gradient(to right, #7c3aed, #8b5cf6)", color: "#ffffff" }}
          >
            Planı aç →
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.08em] text-slate-500 mb-1">
          Erişim seçenekleri
        </p>
        <p className="text-sm text-slate-600">
          Tek seferlik açma ile abonelik arasındaki fark — ikisi de aynı planı verir, ama abonelik daha fazlasını sağlar.
        </p>
      </div>

      {/*
        CSS subgrid: her kart 4 satır kaplar.
        Satır 1: rozet + fiyat başlığı
        Satır 2: açıklama
        Satır 3: özellik listesi  ← farklı özellik sayısı olsa bile hizalı
        Satır 4: CTA butonu      ← her zaman aynı hizada
      */}
      <div
        className="grid grid-cols-1 sm:grid-cols-2"
        style={{ columnGap: "16px", rowGap: "16px" }}
      >
        <OptionCard
          badge="Tek seferlik"
          price="$2.99"
          period="/ analiz"
          description="Bu analize özel plan, kalıcı erişim gerekmiyorsa ideal."
          features={ONE_TIME_FEATURES}
          cta="Bu planı aç"
          href={`${unlockBase}&plan=one-time`}
          highlighted={false}
        />
        <OptionCard
          badge="Abonelik"
          price="$9"
          period="/ ay"
          description="Düzenli analiz yapıyorsan veya birden fazla proje varsa çok daha avantajlı."
          features={SUBSCRIPTION_FEATURES}
          cta="Aboneliği başlat"
          href={`${unlockBase}&plan=subscription`}
          highlighted
          highlightLabel="Daha avantajlı"
        />
      </div>

      <p className="text-xs text-center text-slate-500">
        Ödeme güvenli · İstediğin zaman iptal · Memnun kalmazsan 7 gün içinde iade
      </p>
    </div>
  );
}

/* ─── Option card ───────────────────────────────────────────────────────── */

function OptionCard({
  badge,
  price,
  period,
  description,
  features,
  cta,
  href,
  highlighted,
  highlightLabel,
}: {
  badge: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  cta: string;
  href: string;
  highlighted: boolean;
  highlightLabel?: string;
}) {
  return (
    /*
      grid-row: span 4 + grid-template-rows: subgrid
      → 4 satır parent grid'e bağlı; her bölüm diğer kartla hizalanır.
    */
    <div
      style={{
        display: "grid",
        gridRow: "span 4",
        gridTemplateRows: "subgrid",
        borderRadius: "12px",
        border: `1px solid ${highlighted ? "#c4b5fd" : "#e2e8f0"}`,
        boxShadow: highlighted ? "0 1px 6px rgba(124,58,237,0.08)" : "none",
        overflow: "hidden",
      }}
    >
      {/* Satır 1: rozet + fiyat */}
      <div
        className="px-5 py-4"
        style={{ backgroundColor: highlighted ? "#f5f3ff" : "#f8fafc" }}
      >
        <div className="flex items-center justify-between mb-2">
          <span
            className="text-xs font-semibold uppercase tracking-[0.06em]"
            style={{ color: highlighted ? "#6d28d9" : "#64748b" }}
          >
            {badge}
          </span>
          {highlightLabel && (
            <span
              className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
              style={{ backgroundColor: "#ede9fe", color: "#6d28d9" }}
            >
              {highlightLabel}
            </span>
          )}
        </div>
        <div className="flex items-baseline gap-1">
          <span className="text-2xl font-bold text-slate-900">{price}</span>
          <span className="text-sm text-slate-500">{period}</span>
        </div>
      </div>

      {/* Satır 2: açıklama */}
      <div className="px-5 pt-3 pb-2" style={{ backgroundColor: "#ffffff" }}>
        <p className="text-xs text-slate-600 leading-relaxed">{description}</p>
      </div>

      {/* Satır 3: özellik listesi */}
      <div className="px-5 py-3" style={{ backgroundColor: "#ffffff" }}>
        <ul className="flex flex-col gap-1.5">
          {features.map((f) => (
            <li key={f} className="flex items-start gap-2 text-sm text-slate-600">
              <svg
                viewBox="0 0 16 16"
                fill="currentColor"
                className="w-4 h-4 flex-shrink-0 mt-0.5"
                style={{ color: highlighted ? "#7c3aed" : "#94a3b8" }}
                aria-hidden
              >
                <path fillRule="evenodd" d="M12.416 3.376a.75.75 0 0 1 .208 1.04l-5 7.5a.75.75 0 0 1-1.154.114l-3-3a.75.75 0 0 1 1.06-1.06l2.353 2.353 4.493-6.74a.75.75 0 0 1 1.04-.207z" clipRule="evenodd" />
              </svg>
              {f}
            </li>
          ))}
        </ul>
      </div>

      {/* Satır 4: CTA — her zaman aynı hizada */}
      <div className="px-5 pb-5 pt-3" style={{ backgroundColor: "#ffffff" }}>
        {highlighted ? (
          <Link
            href={href}
            className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold shadow-sm transition-opacity hover:opacity-90"
            style={{ background: "linear-gradient(to right, #7c3aed, #8b5cf6)", color: "#ffffff" }}
          >
            {cta}
          </Link>
        ) : (
          <Link
            href={href}
            className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold border border-slate-200 bg-white text-slate-800 hover:bg-slate-50 transition-colors"
          >
            {cta}
          </Link>
        )}
      </div>
    </div>
  );
}
