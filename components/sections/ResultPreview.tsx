import Link from "next/link";
import { Section } from "@/components/layout/Section";
import { SectionHeader } from "@/components/common/SectionHeader";
import { Badge } from "@/components/common/Badge";
import { Button } from "@/components/common/Button";

/* ─── Static example data ────────────────────────────────────────────────────
   Persona: küçük e-ticaret markası sahibi, içerik + reklam odaklı          */

const EXAMPLE_PERSONA = {
  type: "İşletme sahibi",
  business: "Küçük e-ticaret markası",
  goals: ["İçerik Üretimi", "Reklam"],
};

const EXAMPLE_DIAGNOSIS =
  "Sınırlı ekiple büyüyen bir e-ticaret markası için öncelik: içerik üretimini otomatikleştirmek ve reklam metinlerini hızlandırmak.";

const EXAMPLE_SOLUTION_AREAS = ["İçerik", "Reklam", "SEO"];

interface DecisionCard {
  role: "best-fit" | "free-alt" | "power-alt";
  roleLabel: string;
  roleBorderColor: string;
  roleLabelColor: string;
  name: string;
  tagline: string;
  note: string;
  hasFree: boolean;
}

const DECISION_CARDS: DecisionCard[] = [
  {
    role: "best-fit",
    roleLabel: "En uygun seçim",
    roleBorderColor: "#3b82f6",
    roleLabelColor: "#2563eb",
    name: "ChatGPT",
    tagline: "İçerik + reklam metni",
    note: "Hızlı, esnek, düşük öğrenme eğrisi. Ücretsiz planı güçlü.",
    hasFree: true,
  },
  {
    role: "free-alt",
    roleLabel: "Ücretsiz alternatif",
    roleBorderColor: "#4ade80",
    roleLabelColor: "#16a34a",
    name: "Claude (ücretsiz)",
    tagline: "Uzun form içerik",
    note: "Marka sesi tutarlılığı için daha iyi sonuç üretiyor.",
    hasFree: true,
  },
  {
    role: "power-alt",
    roleLabel: "Daha güçlü seçenek",
    roleBorderColor: "#a78bfa",
    roleLabelColor: "#7c3aed",
    name: "Jasper AI",
    tagline: "Marka odaklı içerik",
    note: "Marka sesi eğitimi ve şablon sistemi güçlü. Ücretli.",
    hasFree: false,
  },
];

// Pro plan tab labels for the teaser
const PRO_TABS = ["Yol Haritası", "Plan Özeti", "Hazır Promptlar", "Gün 1 Listesi"];

export function ResultPreview() {
  return (
    <Section bg="subtle" spacing="lg" id="ornek-sonuc">
      <SectionHeader
        badge="Örnek sonuç"
        title="Böyle bir öneri seni bekliyor"
        description="Analiz tamamlandığında teşhis, karar özeti ve araç önerileri hemen görünür."
      />

      {/* Mock result card */}
      <div className="max-w-2xl mx-auto flex flex-col gap-0 rounded-2xl border overflow-hidden"
        style={{ borderColor: "#e2e8f0", backgroundColor: "#ffffff", boxShadow: "0 1px 3px rgba(0,0,0,0.06), 0 1px 2px -1px rgba(0,0,0,0.04)" }}
      >
        {/* Mock "browser toolbar" */}
        <div
          className="flex items-center gap-1.5 px-5 py-3 border-b"
          style={{ backgroundColor: "#f8fafc", borderColor: "#e2e8f0" }}
        >
          {/* Traffic lights — inline style, no CSS vars */}
          <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: "#fca5a5" }} aria-hidden="true" />
          <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: "#fde68a" }} aria-hidden="true" />
          <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: "#86efac" }} aria-hidden="true" />
          <span className="ml-3 text-xs text-slate-400">yaverim.io/results</span>
        </div>

        <div className="p-6 md:p-8 flex flex-col gap-6">

          {/* Persona strip */}
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="default">{EXAMPLE_PERSONA.type}</Badge>
            <span className="text-xs text-slate-400">{EXAMPLE_PERSONA.business}</span>
            <span className="text-xs text-slate-400">·</span>
            {EXAMPLE_PERSONA.goals.map((g) => (
              <Badge key={g} variant="brand">{g}</Badge>
            ))}
          </div>

          {/* Diagnosis */}
          <div className="flex flex-col gap-2">
            <span className="text-[11px] font-semibold uppercase tracking-[0.1em]" style={{ color: "#2563eb" }}>
              Teşhis
            </span>
            <p className="text-slate-800 font-medium text-sm leading-relaxed">
              {EXAMPLE_DIAGNOSIS}
            </p>
          </div>

          {/* Solution area chips */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs text-slate-400 font-medium mr-1">Çözüm alanları:</span>
            {EXAMPLE_SOLUTION_AREAS.map((area) => (
              <Badge key={area} variant="muted">{area}</Badge>
            ))}
          </div>

          {/* Decision cards */}
          <div>
            <span className="text-[11px] font-semibold uppercase tracking-[0.1em] text-slate-400 block mb-3">
              Karar özeti
            </span>
            <ul className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {DECISION_CARDS.map((card) => (
                <li
                  key={card.role}
                  className="flex flex-col gap-2 p-4 rounded-xl border border-t-2"
                  style={{
                    borderColor: "#e2e8f0",
                    borderTopColor: card.roleBorderColor,
                    backgroundColor: "#f8fafc",
                  }}
                >
                  <span className="text-[11px] font-semibold uppercase tracking-wide" style={{ color: card.roleLabelColor }}>
                    {card.roleLabel}
                  </span>
                  <span className="font-semibold text-slate-800 text-sm">{card.name}</span>
                  <span className="text-xs text-slate-400">{card.tagline}</span>
                  <p className="text-xs text-slate-600 leading-relaxed border-t pt-2 mt-1" style={{ borderColor: "#e2e8f0" }}>
                    {card.note}
                  </p>
                  {card.hasFree && (
                    <Badge variant="success" className="self-start">Ücretsiz plan</Badge>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Pro plan teaser — updated to reflect current tab structure */}
          <div
            className="rounded-xl border overflow-hidden"
            style={{ borderColor: "#c4b5fd", backgroundColor: "#faf5ff" }}
          >
            {/* Header */}
            <div className="px-4 py-3 flex items-center justify-between border-b" style={{ borderColor: "#ede9fe" }}>
              <div className="flex items-center gap-2">
                <span
                  className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold"
                  style={{ backgroundColor: "#7c3aed", color: "#ffffff" }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-3 h-3" aria-hidden>
                    <path fillRule="evenodd" d="M8 1a3.5 3.5 0 0 0-3.5 3.5V7A1.5 1.5 0 0 0 3 8.5v5A1.5 1.5 0 0 0 4.5 15h7a1.5 1.5 0 0 0 1.5-1.5v-5A1.5 1.5 0 0 0 11.5 7V4.5A3.5 3.5 0 0 0 8 1Zm2 6V4.5a2 2 0 1 0-4 0V7h4Z" clipRule="evenodd" />
                  </svg>
                  Pro Plan
                </span>
                <span className="text-xs text-violet-700">Detaylı uygulanabilir plan</span>
              </div>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4 text-violet-400" aria-hidden>
                <path fillRule="evenodd" d="M8 1a3.5 3.5 0 0 0-3.5 3.5V7A1.5 1.5 0 0 0 3 8.5v5A1.5 1.5 0 0 0 4.5 15h7a1.5 1.5 0 0 0 1.5-1.5v-5A1.5 1.5 0 0 0 11.5 7V4.5A3.5 3.5 0 0 0 8 1Zm2 6V4.5a2 2 0 1 0-4 0V7h4Z" clipRule="evenodd" />
              </svg>
            </div>
            {/* Tabs preview */}
            <div className="px-4 pt-3 pb-1 flex gap-1 border-b" style={{ borderColor: "#ede9fe" }}>
              {PRO_TABS.map((t, i) => (
                <span
                  key={t}
                  className="px-3 py-1.5 rounded-lg text-xs font-medium"
                  style={i === 0
                    ? { backgroundColor: "#7c3aed", color: "#ffffff" }
                    : { backgroundColor: "transparent", color: "#8b5cf6" }
                  }
                >
                  {t}
                </span>
              ))}
            </div>
            {/* Content preview — blurred/faded */}
            <div className="px-4 py-3 relative" style={{ filter: "blur(2px)", userSelect: "none", pointerEvents: "none" }}>
              <div className="flex flex-col gap-2">
                <div className="h-3 rounded bg-violet-200 w-2/3" />
                <div className="h-2.5 rounded bg-violet-100 w-full" />
                <div className="h-2.5 rounded bg-violet-100 w-4/5" />
                <div className="flex gap-2 mt-1">
                  <div className="h-7 rounded bg-violet-200 w-24" />
                  <div className="h-7 rounded bg-violet-100 w-32" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CTA bar */}
        <div
          className="px-6 md:px-8 py-5 border-t flex flex-col sm:flex-row items-center gap-3 justify-between"
          style={{ backgroundColor: "#f8fafc", borderColor: "#e2e8f0" }}
        >
          <p className="text-sm text-slate-500">
            Bu gerçek bir analiz değil — örnek. Kendi sonucunu gör.
          </p>
          <Button variant="primary" size="md" href="/analyze" className="flex-shrink-0">
            Kendi analizini başlat →
          </Button>
        </div>
      </div>
    </Section>
  );
}
