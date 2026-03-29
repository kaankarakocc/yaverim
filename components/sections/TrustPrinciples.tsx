import { Section } from "@/components/layout/Section";
import { SectionHeader } from "@/components/common/SectionHeader";

interface Principle {
  title: string;
  description: string;
  note: string;
  icon: React.ReactNode;
  accentColor: string;
  accentBg: string;
}

/* ─── SVG icons ────────────────────────────────────────────────────────────── */

const PRINCIPLES: Principle[] = [
  {
    title: "Skor gelirden bağımsızdır",
    description:
      "Araçların puanı, affiliate veya sponsor ilişkisinden etkilenmez. Komisyon almadığımız ama sana uygun olan araçları da öneriyoruz.",
    note: "Kural bazlı + editoryal denetim",
    accentColor: "#2563eb",
    accentBg: "#eff6ff",
    icon: (
      <svg viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5" aria-hidden>
        <path fillRule="evenodd" d="M10 2.5c-1.31 0-2.526.386-3.546 1.051a.75.75 0 0 1-.82-1.256A8 8 0 1 1 2.627 6.17a.75.75 0 1 1 1.294.756A6.5 6.5 0 1 0 10 2.5ZM6.22 9.22a.75.75 0 0 1 1.06 0L9 10.94l3.72-3.72a.75.75 0 0 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0l-2.25-2.25a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
      </svg>
    ),
  },
  {
    title: "Sponsorlu içerik açık etiketlenir",
    description:
      "Ücretli yer alan içerikler 'Sponsorlu' olarak işaretlenir. Hiçbir şey gizlenmez. Ne gördüğünü bilirsin.",
    note: "Her içerikte şeffaflık",
    accentColor: "#16a34a",
    accentBg: "#f0fdf4",
    icon: (
      <svg viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5" aria-hidden>
        <path fillRule="evenodd" d="M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0Zm-7-4a1 1 0 1 1-2 0 1 1 0 0 1 2 0ZM9 9a.75.75 0 0 0 0 1.5h.253a.25.25 0 0 1 .244.304l-.459 2.066A1.75 1.75 0 0 0 10.747 15H11a.75.75 0 0 0 0-1.5h-.253a.25.25 0 0 1-.244-.304l.459-2.066A1.75 1.75 0 0 0 9.253 9H9Z" clipRule="evenodd" />
      </svg>
    ),
  },
  {
    title: "Gerçekçi beklenti, somut etki",
    description:
      "Abartılı ROI vaadi yapmıyoruz. Tahmini etki gösteriyoruz, garantili sonuç söylemiyoruz. Araç sihirli değil.",
    note: "Palavra değil, veri",
    accentColor: "#d97706",
    accentBg: "#fffbeb",
    icon: (
      <svg viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5" aria-hidden>
        <path d="M15.98 1.804a1 1 0 0 0-1.96 0l-.24 1.192a1 1 0 0 1-.784.785l-1.192.238a1 1 0 0 0 0 1.962l1.192.238a1 1 0 0 1 .785.785l.238 1.192a1 1 0 0 0 1.962 0l.238-1.192a1 1 0 0 1 .785-.785l1.192-.238a1 1 0 0 0 0-1.962l-1.192-.238a1 1 0 0 1-.785-.785l-.238-1.192ZM6.949 5.684a1 1 0 0 0-1.898 0l-.683 2.051a1 1 0 0 1-.633.633l-2.051.683a1 1 0 0 0 0 1.898l2.051.684a1 1 0 0 1 .633.632l.683 2.051a1 1 0 0 0 1.898 0l.683-2.051a1 1 0 0 1 .633-.633l2.051-.683a1 1 0 0 0 0-1.898l-2.051-.683a1 1 0 0 1-.633-.633L6.95 5.684Z" />
      </svg>
    ),
  },
  {
    title: "Bütçen ne olursa olsun",
    description:
      "Ücretsiz alternatifler ücretli seçeneklerle birlikte değerlendirilir. Para ödemeden de iyi bir öneri alırsın.",
    note: "Ücretsiz ≠ ikinci sınıf",
    accentColor: "#7c3aed",
    accentBg: "#f5f3ff",
    icon: (
      <svg viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5" aria-hidden>
        <path d="M10.75 10.818v2.614A3.13 3.13 0 0 0 11.888 13c.482-.315.612-.648.612-.875 0-.227-.13-.56-.612-.875a3.13 3.13 0 0 0-1.138-.432ZM8.33 8.62c.053.055.115.11.176.154.281.205.641.196.953.09V6.254a2.986 2.986 0 0 0-.954.09c-.328.071-.578.25-.733.469-.16.225-.243.494-.243.762 0 .358.14.697.4.96l.4.086ZM9.25 3.75a.75.75 0 0 0-1.5 0v.796a4.75 4.75 0 0 0-1.35.673C5.56 5.8 5 6.7 5 7.75c0 1.05.56 1.95 1.4 2.531a4.75 4.75 0 0 0 1.35.673v3.044a4.006 4.006 0 0 1-.614-.227 3.13 3.13 0 0 1-.863-.717.75.75 0 0 0-1.146.966A4.63 4.63 0 0 0 6.4 15.04c.47.248.983.419 1.35.498v.712a.75.75 0 0 0 1.5 0v-.73a4.75 4.75 0 0 0 1.35-.673C11.44 14.2 12 13.3 12 12.25c0-1.05-.56-1.95-1.4-2.531a4.75 4.75 0 0 0-1.35-.673V5.932c.189.045.37.113.543.203.307.163.578.4.743.699a.75.75 0 0 0 1.3-.75A4.006 4.006 0 0 0 10 4.565v-.815Z" />
      </svg>
    ),
  },
];

export function TrustPrinciples() {
  return (
    <Section id="guven" bg="subtle" spacing="lg">
      <SectionHeader
        badge="Güven ilkeleri"
        title="Çıkarımız değil, çözümün önce gelir."
        description="Yaverim bir reklam platformu değil, editoryal bağımsızlıkla çalışan bir öneri motorudur."
      />

      {/*
        CSS subgrid: her kart 3 satır kaplar.
        Satır 1: ikon + başlık  → en uzun başlığa göre hizalanır
        Satır 2: açıklama       → en uzun açıklamaya göre
        Satır 3: not            → her kart dipte aynı hizada
      */}
      <ul
        className="grid grid-cols-1 sm:grid-cols-2 max-w-3xl mx-auto"
        style={{ columnGap: "16px", rowGap: "16px" }}
      >
        {PRINCIPLES.map((item) => (
          <li
            key={item.title}
            style={{
              display: "grid",
              gridRow: "span 3",
              gridTemplateRows: "subgrid",
              padding: "24px",
              borderRadius: "16px",
              backgroundColor: "#ffffff",
              border: "1px solid #e2e8f0",
            }}
          >
            {/* Satır 1: ikon + başlık */}
            <div className="flex items-start gap-3">
              <div
                className="flex-shrink-0 flex items-center justify-center w-9 h-9 rounded-xl"
                style={{ backgroundColor: item.accentBg, color: item.accentColor }}
              >
                {item.icon}
              </div>
              <h3 className="font-semibold text-slate-800 text-sm leading-snug pt-1.5">
                {item.title}
              </h3>
            </div>

            {/* Satır 2: açıklama */}
            <p className="text-sm text-slate-600 leading-relaxed">
              {item.description}
            </p>

            {/* Satır 3: not — her kart aynı hizada */}
            <div
              className="flex items-center gap-1.5 pt-3 border-t"
              style={{ borderColor: "#f1f5f9" }}
            >
              <span
                className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                style={{ backgroundColor: item.accentColor }}
                aria-hidden
              />
              <span className="text-xs font-medium" style={{ color: item.accentColor }}>
                {item.note}
              </span>
            </div>
          </li>
        ))}
      </ul>
    </Section>
  );
}
