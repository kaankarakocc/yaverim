import Link from "next/link";
import { Badge } from "@/components/common/Badge";
import { cn } from "@/lib/utils/cn";

const premiumFeatures = [
  "Öncelik haritası ve aşama planı",
  "Araç bazlı uygulama adımları",
  "Hazır prompt şablonları",
  "Gün 1 başlangıç listesi",
  "Dikkat edilmesi gerekenler",
  "Aşama geçiş kriterleri",
] as const;

interface PremiumPreviewProps {
  className?: string;
  showCta?: boolean;
  ctaHref?: string;
}

export function PremiumPreview({
  className,
  showCta = true,
  ctaHref = "/premium",
}: PremiumPreviewProps) {
  return (
    <div
      className={cn("relative overflow-hidden rounded-2xl p-8 md:p-10", className)}
      style={{ background: "linear-gradient(135deg, #7c3aed 0%, #6d28d9 50%, #1e40af 100%)" }}
    >
      {/* Glow */}
      <div
        className="pointer-events-none absolute -top-12 -right-12 w-64 h-64 rounded-full bg-white opacity-5 blur-3xl"
        aria-hidden
      />

      <div className="relative flex flex-col gap-6">
        <div className="flex items-start gap-3">
          <Badge variant="premium" className="flex-shrink-0 mt-0.5">Premium</Badge>
          <div>
            <h3 className="font-semibold text-white text-xl leading-snug">
              Uygulanabilir plan seni bekliyor
            </h3>
            <p className="text-sm mt-1 leading-relaxed" style={{ color: "rgba(255,255,255,0.70)" }}>
              Araç listesi değil — senin durumuna özel, aşama bazlı yol haritası.
            </p>
          </div>
        </div>

        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {premiumFeatures.map((feature) => (
            <li key={feature} className="flex items-center gap-2 text-sm" style={{ color: "rgba(255,255,255,0.80)" }}>
              <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} style={{ color: "rgba(255,255,255,0.55)" }} aria-hidden>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              {feature}
            </li>
          ))}
        </ul>

        {showCta && (
          <Link
            href={ctaHref}
            className="self-start inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm transition-opacity hover:opacity-90"
            style={{ backgroundColor: "#ffffff", color: "#7c3aed" }}
          >
            Premium planı aç →
          </Link>
        )}
      </div>
    </div>
  );
}
