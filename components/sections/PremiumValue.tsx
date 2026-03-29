import Link from "next/link";
import { Section } from "@/components/layout/Section";

/* ─── Feature comparison data ─────────────────────────────────────────────── */

const FREE_VS_PRO = [
  { label: "Bağlam analizi",                   free: true,  pro: true  },
  { label: "En uygun araç önerisi",            free: true,  pro: true  },
  { label: "Ücretsiz alternatif",              free: true,  pro: true  },
  { label: "Neden bu araçlar",                 free: true,  pro: true  },
  { label: "Öncelik haritası",                 free: false, pro: true  },
  { label: "Aşama bazlı yol haritası",         free: false, pro: true  },
  { label: "Araç bazlı uygulama adımları",     free: false, pro: true  },
  { label: "Hazır prompt şablonları",          free: false, pro: true  },
  { label: "Gün 1 başlangıç listesi",          free: false, pro: true  },
  { label: "Aşama geçiş kriterleri",           free: false, pro: true  },
  { label: "Sık yapılan hatalar",              free: false, pro: true  },
];

/* ─── Stage preview (matches actual Pro plan structure) ────────────────────── */

const PREVIEW_STAGE = {
  number: 1,
  title: "Araçları Seç, Temeli Kur",
  purpose: "Doğru araçları seç, ilk sistem çerçeveni oluştur.",
  tools: [
    { name: "ChatGPT",   role: "Ana üretim aracı",          free: true  },
    { name: "Claude",    role: "Uzun form ve marka sesi",    free: true  },
    { name: "Notion AI", role: "İçerik takvimi & organizasyon", free: false },
  ],
  steps: [
    "ChatGPT ve Claude hesaplarını oluştur, 1'er gün test et",
    "Marka sesi kılavuzu için temel prompt şablonunu hazırla",
    "Haftalık içerik takviminin iskeletini kur",
  ],
};

const LOCKED_STAGES = [
  "Dağıtım ve Amplifikasyon",
  "Reklam ve Büyüme",
];

/* ─── Tabs preview ─────────────────────────────────────────────────────────── */

const PRO_TABS = [
  { label: "Yol Haritası",   active: true  },
  { label: "Plan Özeti",     active: false },
  { label: "Hazır Promptlar",active: false },
  { label: "Gün 1 Listesi",  active: false },
];

export function PremiumValue() {
  return (
    <Section bg="white" spacing="lg" id="premium">

      {/* Section header */}
      <div className="flex flex-col items-center text-center gap-3 mb-12">
        <span
          className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full"
          style={{ background: "linear-gradient(to right, #7c3aed, #8b5cf6)", color: "#ffffff" }}
        >
          Pro Plan
        </span>
        <h2 className="text-balance max-w-2xl font-bold" style={{ color: "#0f172a" }}>
          Araç listesi değil.{" "}
          <span style={{ color: "#7c3aed" }}>Uygulanabilir plan.</span>
        </h2>
        <p className="max-w-xl text-balance leading-relaxed" style={{ color: "#475569" }}>
          Ücretsiz analizinden sonra planın hazır. Pro katmanda ne yapacağını, hangi araçla ve
          hangi sırayla yapacağını adım adım görürsün — prompt şablonlarıyla birlikte.
        </p>
      </div>

      <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-5 gap-6 items-start">

        {/* Left — comparison table */}
        <div className="lg:col-span-2 rounded-2xl overflow-hidden" style={{ border: "1px solid #e2e8f0" }}>

          {/* Table header */}
          <div className="grid grid-cols-3 text-center" style={{ backgroundColor: "#f8fafc", borderBottom: "1px solid #e2e8f0" }}>
            <div className="col-span-1 py-3 px-4 text-left text-xs font-semibold" style={{ color: "#64748b" }}>
              Ne alıyorsun?
            </div>
            <div className="py-3 px-2 text-xs font-semibold" style={{ color: "#94a3b8" }}>Ücretsiz</div>
            <div className="py-3 px-2 text-xs font-bold" style={{ color: "#7c3aed" }}>Pro</div>
          </div>

          {FREE_VS_PRO.map((row, i) => (
            <div
              key={row.label}
              className="grid grid-cols-3 text-center items-center"
              style={{
                backgroundColor: i % 2 === 0 ? "#ffffff" : "#fafafa",
                borderBottom: i < FREE_VS_PRO.length - 1 ? "1px solid #f1f5f9" : "none",
              }}
            >
              <div className="col-span-1 py-2.5 px-4 text-left text-xs" style={{ color: "#475569" }}>
                {row.label}
              </div>
              <div className="flex items-center justify-center py-2.5 px-2">
                {row.free
                  ? <CheckMark color="#16a34a" />
                  : <CrossMark />
                }
              </div>
              <div className="flex items-center justify-center py-2.5 px-2">
                {row.pro
                  ? <CheckMark color="#7c3aed" />
                  : <CrossMark />
                }
              </div>
            </div>
          ))}
        </div>

        {/* Right — Pro plan preview (matches real UI structure) */}
        <div className="lg:col-span-3 flex flex-col gap-3">

          {/* Tab bar */}
          <div
            className="flex items-center gap-1 px-2 py-1.5 rounded-xl"
            style={{ backgroundColor: "#f1f5f9" }}
          >
            {PRO_TABS.map((tab) => (
              <div
                key={tab.label}
                className="flex-1 text-center px-2 py-1.5 rounded-lg text-xs font-semibold"
                style={{
                  backgroundColor: tab.active ? "#ffffff" : "transparent",
                  color: tab.active ? "#1e293b" : "#94a3b8",
                  boxShadow: tab.active ? "0 1px 3px rgba(0,0,0,0.08)" : "none",
                }}
              >
                {tab.label}
              </div>
            ))}
          </div>

          {/* Active stage */}
          <div className="rounded-2xl overflow-hidden" style={{ border: "1px solid #e2e8f0" }}>

            {/* Stage header */}
            <div
              className="flex items-center gap-3 px-5 py-3.5"
              style={{ backgroundColor: "#f8fafc", borderBottom: "1px solid #e2e8f0" }}
            >
              <span
                className="flex h-6 w-6 items-center justify-center rounded-full text-[11px] font-bold flex-shrink-0"
                style={{ backgroundColor: "#2563eb", color: "#ffffff" }}
              >
                {PREVIEW_STAGE.number}
              </span>
              <span className="font-semibold text-sm flex-1" style={{ color: "#0f172a" }}>
                {PREVIEW_STAGE.title}
              </span>
              <span
                className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                style={{ backgroundColor: "#dcfce7", color: "#15803d" }}
              >
                Açık
              </span>
            </div>

            <div className="p-5 flex flex-col gap-4">
              {/* Purpose */}
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest mb-1" style={{ color: "#94a3b8" }}>
                  Amaç
                </p>
                <p className="text-sm" style={{ color: "#334155" }}>{PREVIEW_STAGE.purpose}</p>
              </div>

              {/* Tools */}
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest mb-2" style={{ color: "#94a3b8" }}>
                  Kullanılacak araçlar
                </p>
                <ul className="flex flex-col gap-1.5">
                  {PREVIEW_STAGE.tools.map((tool) => (
                    <li
                      key={tool.name}
                      className="flex items-center justify-between gap-2 py-2 px-3 rounded-lg"
                      style={{ backgroundColor: "#f8fafc", border: "1px solid #e2e8f0" }}
                    >
                      <div>
                        <span className="text-sm font-medium block" style={{ color: "#0f172a" }}>{tool.name}</span>
                        <span className="text-xs" style={{ color: "#64748b" }}>{tool.role}</span>
                      </div>
                      {tool.free && (
                        <span
                          className="text-[10px] font-bold px-2 py-0.5 rounded-full flex-shrink-0"
                          style={{ backgroundColor: "#dcfce7", color: "#15803d" }}
                        >
                          Ücretsiz plan
                        </span>
                      )}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Steps — first visible, rest blurred */}
              <div className="relative">
                <p className="text-[10px] font-bold uppercase tracking-widest mb-2" style={{ color: "#94a3b8" }}>
                  Uygulama adımları
                </p>
                <ol className="flex flex-col gap-1.5">
                  {PREVIEW_STAGE.steps.map((step, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-2 text-sm"
                      style={{ filter: i >= 1 ? "blur(3px)" : "none", userSelect: i >= 1 ? "none" : "auto" }}
                    >
                      <span className="font-bold text-xs mt-0.5 flex-shrink-0" style={{ color: "#2563eb" }}>
                        {i + 1}.
                      </span>
                      <span style={{ color: "#475569" }}>{step}</span>
                    </li>
                  ))}
                </ol>
                <div
                  className="absolute bottom-0 left-0 right-0 h-10 pointer-events-none"
                  style={{ background: "linear-gradient(to bottom, transparent, #ffffff)" }}
                  aria-hidden
                />
              </div>
            </div>
          </div>

          {/* Locked stages */}
          {LOCKED_STAGES.map((title, i) => (
            <div
              key={i}
              className="flex items-center gap-3 px-5 py-3 rounded-2xl"
              style={{ backgroundColor: "#f8fafc", border: "1px solid #e2e8f0", opacity: 0.6 }}
              aria-hidden
            >
              <span
                className="flex h-6 w-6 items-center justify-center rounded-full text-[11px] font-bold flex-shrink-0"
                style={{ backgroundColor: "#e2e8f0", color: "#94a3b8" }}
              >
                {i + 2}
              </span>
              <span className="text-sm flex-1" style={{ color: "#94a3b8" }}>{title}</span>
              <svg viewBox="0 0 16 16" fill="currentColor" className="w-3.5 h-3.5 flex-shrink-0" style={{ color: "#cbd5e1" }} aria-hidden>
                <path fillRule="evenodd" d="M8 1a3.5 3.5 0 0 0-3.5 3.5V7A1.5 1.5 0 0 0 3 8.5v5A1.5 1.5 0 0 0 4.5 15h7a1.5 1.5 0 0 0 1.5-1.5v-5A1.5 1.5 0 0 0 11 7V4.5A3.5 3.5 0 0 0 8 1Zm2 6V4.5a2 2 0 1 0-4 0V7h4Z" clipRule="evenodd" />
              </svg>
            </div>
          ))}

          {/* CTA */}
          <div className="pt-1">
            <Link
              href="/analyze"
              className="w-full inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl text-sm font-bold transition-opacity hover:opacity-90"
              style={{ background: "linear-gradient(135deg, #7c3aed, #5b21b6)", color: "#ffffff" }}
            >
              Analizini tamamla, planını aç
              <svg viewBox="0 0 12 12" fill="currentColor" className="w-3 h-3" aria-hidden>
                <path fillRule="evenodd" d="M4.22 3.22a.75.75 0 0 1 1.06 0l3 3a.75.75 0 0 1 0 1.06l-3 3a.75.75 0 1 1-1.06-1.06L6.69 6.5 4.22 4.03a.75.75 0 0 1 0-1.06z" clipRule="evenodd" />
              </svg>
            </Link>
            <p className="text-xs text-center mt-2" style={{ color: "#94a3b8" }}>
              Önce ücretsiz özet — ödeme analizden sonra gelir
            </p>
          </div>
        </div>

      </div>
    </Section>
  );
}

/* ─── Helpers ────────────────────────────────────────────────────────────── */

function CheckMark({ color }: { color: string }) {
  return (
    <svg viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4" style={{ color }} aria-hidden>
      <path fillRule="evenodd" d="M8 15A7 7 0 1 0 8 1a7 7 0 0 0 0 14Zm3.857-9.809a.75.75 0 0 0-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 1 0-1.06 1.061l2.5 2.5a.75.75 0 0 0 1.137-.089l4-5.5Z" clipRule="evenodd" />
    </svg>
  );
}

function CrossMark() {
  return (
    <svg viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4" style={{ color: "#e2e8f0" }} aria-hidden>
      <path fillRule="evenodd" d="M8 15A7 7 0 1 0 8 1a7 7 0 0 0 0 14ZM5.28 4.22a.75.75 0 0 0-1.06 1.06L6.94 8 4.22 10.72a.75.75 0 1 0 1.06 1.06L8 9.06l2.72 2.72a.75.75 0 1 0 1.06-1.06L9.06 8l2.72-2.72a.75.75 0 0 0-1.06-1.06L8 6.94 5.28 4.22Z" clipRule="evenodd" />
    </svg>
  );
}
