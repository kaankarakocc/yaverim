import Link from "next/link";
import { Badge } from "@/components/common/Badge";
import { cn } from "@/lib/utils/cn";

const PREMIUM_WHAT_YOU_GET = [
  "Öncelik haritası — ne yapmalısın, hangi sırayla?",
  "Aşama bazlı uygulanabilir plan (3–5 aşama)",
  "Her aşamada araç rehberi ve uygulama adımları",
  "Dikkat edilmesi gerekenler ve tuzaklar",
  "Hazır prompt şablonları — kopyala, kullan",
  "Gün 1 başlangıç listesi — bugün ne yapmalısın?",
];

interface ResultsPremiumCtaProps {
  className?: string;
  queryString?: string;
}

export function ResultsPremiumCta({ className, queryString }: ResultsPremiumCtaProps) {
  const unlockHref = `/premium/unlock${queryString ? `?${queryString}` : ""}`;

  return (
    <div
      className={cn("rounded-2xl overflow-hidden", className)}
      style={{ border: "1px solid #e2e8f0" }}
    >
      {/* Header */}
      <div
        className="px-6 py-5 flex items-start gap-3"
        style={{ borderBottom: "1px solid #e2e8f0" }}
      >
        <div className="flex flex-col gap-1 flex-1">
          <div className="flex items-center gap-2">
            <Badge variant="premium">Pro Plan</Badge>
            <span className="text-xs" style={{ color: "#94a3b8" }}>Bir sonraki adım</span>
          </div>
          <h3 className="font-semibold text-lg leading-snug mt-1" style={{ color: "#0f172a" }}>
            Ücretsiz özeti gördün. Sırada uygulanabilir plan var.
          </h3>
          <p className="text-sm leading-relaxed" style={{ color: "#475569" }}>
            Araç listesi değil — senin durumuna özel, önceliklendirilmiş ve
            adım adım uygulanabilir bir plan. Boş vaatlerle değil, gerçek adımlarla.
          </p>
        </div>
      </div>

      {/* What you get */}
      <div className="px-6 py-5" style={{ backgroundColor: "#f8fafc" }}>
        <p className="text-xs font-bold uppercase tracking-[0.08em] mb-3" style={{ color: "#94a3b8" }}>
          Pro planda neler var?
        </p>
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {PREMIUM_WHAT_YOU_GET.map((item) => (
            <li key={item} className="flex items-start gap-2 text-sm" style={{ color: "#475569" }}>
              <span
                className="flex-shrink-0 mt-0.5 flex h-4 w-4 items-center justify-center rounded-full"
                style={{ backgroundColor: "#16a34a" }}
                aria-hidden
              >
                <svg viewBox="0 0 10 10" fill="none" stroke="white" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-2.5 h-2.5" aria-hidden>
                  <path d="M2 5l2 2 4-4" />
                </svg>
              </span>
              {item}
            </li>
          ))}
        </ul>
      </div>

      {/* Pricing + CTA */}
      <div className="px-6 py-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white">
        <div className="flex flex-col gap-0.5">
          <span className="text-xs" style={{ color: "#94a3b8" }}>Tek seferlik açma</span>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-bold" style={{ color: "#0f172a" }}>$2.99</span>
            <span className="text-sm" style={{ color: "#94a3b8" }}>/ analiz</span>
          </div>
          <span className="text-xs" style={{ color: "#94a3b8" }}>veya $9/ay ile sınırsız</span>
        </div>

        <div className="flex flex-col items-start sm:items-end gap-2">
          <Link
            href={unlockHref}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm transition-opacity hover:opacity-90"
            style={{ background: "linear-gradient(to right, #7c3aed, #8b5cf6)", color: "#ffffff" }}
          >
            Detaylı planı aç →
          </Link>
          <p className="text-xs" style={{ color: "#94a3b8" }}>
            Ödeme güvenli · İstediğinde iptal
          </p>
        </div>
      </div>

      {/* Trust note */}
      <div className="px-6 py-3" style={{ backgroundColor: "#f8fafc", borderTop: "1px solid #e2e8f0" }}>
        <p className="text-xs text-center" style={{ color: "#94a3b8" }}>
          Ödeme analizden sonra gelir. Önce ücretsiz özeti gördün, premium açmak zorunlu değil.
        </p>
      </div>
    </div>
  );
}
