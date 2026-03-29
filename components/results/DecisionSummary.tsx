import Link from "next/link";
import { Badge } from "@/components/common/Badge";
import { ToolLogo } from "@/components/common/ToolLogo";
import { cn } from "@/lib/utils/cn";
import type { DecisionCard, DecisionRole } from "@/lib/recommendation/mock-engine";

interface DecisionSummaryProps {
  cards: DecisionCard[];
  className?: string;
}

const ROLE_CONFIG: Record<
  DecisionRole,
  { label: string; accentColor: string; labelColor: string; scoreBg: string; scoreFg: string; scoreBorder: string }
> = {
  "best-fit": {
    label: "En uygun seçim",
    accentColor: "#3b82f6",
    labelColor: "#2563eb",
    scoreBg: "#eff6ff",
    scoreFg: "#1d4ed8",
    scoreBorder: "#bfdbfe",
  },
  "free-alt": {
    label: "Ücretsiz alternatif",
    accentColor: "#4ade80",
    labelColor: "#16a34a",
    scoreBg: "#f0fdf4",
    scoreFg: "#15803d",
    scoreBorder: "#86efac",
  },
  "power-alt": {
    label: "Daha güçlü seçenek",
    accentColor: "#a78bfa",
    labelColor: "#7c3aed",
    scoreBg: "#faf5ff",
    scoreFg: "#6d28d9",
    scoreBorder: "#c4b5fd",
  },
};

/**
 * Her kart 4 "satır" kaplar (subgrid).
 * Parent grid aynı satır yüksekliklerini tüm sütunlara zorlar
 * → rol etiketi / isim+logo / not / footer her kart için aynı hizada.
 */
function DecisionCardItem({ card }: { card: DecisionCard }) {
  const cfg = ROLE_CONFIG[card.role];
  return (
    <div
      style={{
        // CSS subgrid: bu kart parent grid'in 4 satırını kullanır
        display: "grid",
        gridRow: "span 4",
        gridTemplateRows: "subgrid",
        // iç satırlar arasında boşluk (parent row-gap'ten gelir, ek gap yok)
        padding: "20px",
        borderRadius: "12px",
        backgroundColor: "#ffffff",
        border: "1px solid #e2e8f0",
        borderTop: `2px solid ${cfg.accentColor}`,
      }}
    >
      {/* ── Satır 1: rol etiketi + skor ── */}
      <div className="flex items-start justify-between gap-2">
        <span
          className="text-[11px] font-semibold uppercase tracking-[0.08em]"
          style={{ color: cfg.labelColor }}
        >
          {cfg.label}
        </span>
        <span
          className="flex-shrink-0 text-xs font-bold px-2 py-0.5 rounded-full"
          style={{ color: cfg.scoreFg, backgroundColor: cfg.scoreBg, border: `1px solid ${cfg.scoreBorder}` }}
          title={`Yaverim skoru: ${card.compositeScore.toFixed(1)} / 10`}
        >
          {card.compositeScore.toFixed(1)}
        </span>
      </div>

      {/* ── Satır 2: logo + isim (tam, wrap eden) ── */}
      <div className="flex items-start gap-2.5">
        <ToolLogo
          name={card.name}
          websiteUrl={card.websiteUrl}
          size={32}
          className="flex-shrink-0 mt-0.5"
        />
        <div>
          <h3 className="font-semibold text-slate-900 leading-snug">{card.name}</h3>
          {card.tagline && (
            <p className="text-xs text-slate-500 mt-0.5 leading-snug">{card.tagline}</p>
          )}
        </div>
      </div>

      {/* ── Satır 3: not metni ── */}
      <p className="text-sm text-slate-600 leading-relaxed">
        {card.note}
      </p>

      {/* ── Satır 4: fiyat + link — her kart aynı hizada ── */}
      <div
        className="flex items-center justify-between flex-wrap gap-2 pt-3"
        style={{ borderTop: "1px solid #f1f5f9" }}
      >
        <div className="flex items-center gap-1.5 flex-wrap">
          {card.hasFree && <Badge variant="success">Ücretsiz plan</Badge>}
          <span className="text-xs text-slate-500">{card.pricingLabel}</span>
        </div>
        <Link
          href={`/tools/${card.slug}`}
          className="text-xs font-medium text-blue-600 hover:text-blue-700 transition-colors flex-shrink-0"
        >
          İncele →
        </Link>
      </div>
    </div>
  );
}

export function DecisionSummary({ cards, className }: DecisionSummaryProps) {
  return (
    <div className={cn("flex flex-col gap-4", className)}>
      <div className="flex flex-col gap-1">
        <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-slate-400">
          Karar Özeti
        </p>
        <h2 className="text-xl font-semibold tracking-tight text-slate-900">
          Sana en uygun üç seçenek
        </h2>
        <p className="text-sm text-slate-600">
          Bütçen, ekip yapın ve hedeflerine göre filtrelendi.
        </p>
      </div>

      {/*
        Mobilde: tek sütun, her kart bağımsız (subgrid satır paylaşımı yok).
        sm+ ekranda: 3 sütun, 4 örtük satır (auto), column-gap 12px, row-gap 12px.
        Her kart span-4 + subgrid → aynı "seviye" içerik satırları tüm kartlarda hizalanır.
      */}
      <div
        className="grid grid-cols-1 sm:grid-cols-3"
        style={{ columnGap: "12px", rowGap: "12px" }}
      >
        {cards.map((card) => (
          <DecisionCardItem key={card.slug} card={card} />
        ))}
      </div>
    </div>
  );
}
