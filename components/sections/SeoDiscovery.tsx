import Link from "next/link";
import { Section } from "@/components/layout/Section";

interface Category {
  slug: string;
  label: string;
  description: string;
  toolCount: number;
  accentColor: string;
  accentBg: string;
  featured?: boolean;
  icon: React.ReactNode;
}

const CATEGORIES: Category[] = [
  {
    slug: "icerik-uretimi",
    label: "İçerik Üretimi",
    description: "Blog, sosyal medya, e-posta ve çok daha fazlası için AI destekli içerik",
    toolCount: 24,
    accentColor: "#2563eb",
    accentBg: "#eff6ff",
    featured: true,
    icon: (
      <svg viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5" aria-hidden>
        <path d="M13.586 3.586a2 2 0 1 1 2.828 2.828l-.793.793-2.828-2.828.793-.793ZM11.379 5.793 3 14.172V17h2.828l8.38-8.379-2.83-2.828Z"/>
      </svg>
    ),
  },
  {
    slug: "seo-araclari",
    label: "SEO Araçları",
    description: "Organik büyüme için anahtar kelime araştırması ve içerik optimizasyonu",
    toolCount: 14,
    accentColor: "#16a34a",
    accentBg: "#f0fdf4",
    featured: true,
    icon: (
      <svg viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5" aria-hidden>
        <path fillRule="evenodd" d="M9 3.5a5.5 5.5 0 1 0 0 11 5.5 5.5 0 0 0 0-11ZM2 9a7 7 0 1 1 12.452 4.391l3.328 3.329a.75.75 0 1 1-1.06 1.06l-3.329-3.328A7 7 0 0 1 2 9Z" clipRule="evenodd" />
      </svg>
    ),
  },
  {
    slug: "kod-yazma",
    label: "Kod Yazma",
    description: "AI destekli geliştirme — Copilot, Cursor ve otomatik kod tamamlama",
    toolCount: 18,
    accentColor: "#7c3aed",
    accentBg: "#f5f3ff",
    featured: true,
    icon: (
      <svg viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5" aria-hidden>
        <path fillRule="evenodd" d="M6.28 5.22a.75.75 0 0 1 0 1.06L2.56 10l3.72 3.72a.75.75 0 0 1-1.06 1.06L.97 10.53a.75.75 0 0 1 0-1.06l4.25-4.25a.75.75 0 0 1 1.06 0Zm7.44 0a.75.75 0 0 1 1.06 0l4.25 4.25a.75.75 0 0 1 0 1.06l-4.25 4.25a.75.75 0 0 1-1.06-1.06L17.44 10l-3.72-3.72a.75.75 0 0 1 0-1.06ZM11.377 2.011a.75.75 0 0 1 .612.867l-2.5 14.5a.75.75 0 0 1-1.478-.255l2.5-14.5a.75.75 0 0 1 .866-.612Z" clipRule="evenodd" />
      </svg>
    ),
  },
  {
    slug: "tasarim",
    label: "Tasarım",
    description: "Görsel üretim, UI/UX araçları, video ve animasyon",
    toolCount: 16,
    accentColor: "#db2777",
    accentBg: "#fdf2f8",
    featured: true,
    icon: (
      <svg viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5" aria-hidden>
        <path fillRule="evenodd" d="M3.75 3A1.75 1.75 0 0 0 2 4.75v3.26c.313-.156.65-.26 1-.26h13c.35 0 .687.104 1 .26V4.75A1.75 1.75 0 0 0 15.25 3H3.75ZM2 11.25v.5c0 .416.168.792.44 1.063l3.61 3.61a.75.75 0 0 0 1.06-1.06L5 13.249V11.25h.5a.75.75 0 0 0 0-1.5H5a1 1 0 0 0-1 1v3.61l-1.49-1.49A.25.25 0 0 1 2.5 12.5V11a.75.75 0 0 0-1.5 0v.25Zm16 0V11a.75.75 0 0 0-1.5 0v1.5a.25.25 0 0 1-.07.176L15 14.167V11.25a1 1 0 0 0-1-1h-.5a.75.75 0 0 0 0 1.5h.5v2l-2.11 2.11a.75.75 0 1 0 1.06 1.06l3.61-3.61c.272-.271.44-.647.44-1.063v-.5Z" clipRule="evenodd" />
      </svg>
    ),
  },
  // ── Standard categories ──────────────────────────────────────────
  {
    slug: "reklam-optimizasyonu",
    label: "Reklam",
    description: "Meta, Google, TikTok reklamları",
    toolCount: 11,
    accentColor: "#dc2626",
    accentBg: "#fef2f2",
    icon: (
      <svg viewBox="0 0 20 20" fill="currentColor" className="w-4.5 h-4.5" aria-hidden>
        <path d="M13.92 3.845a19.362 19.362 0 0 1-6.3 1.98C6.765 5.942 5.89 6 5 6a4 4 0 0 0-.504 7.969l1.458 4.165a1 1 0 0 0 1.308.587l1.757-.634a1 1 0 0 0 .586-1.29l-1.003-2.861c1.928.169 3.818.769 5.423 1.342a1 1 0 0 0 1.33-.787 24.303 24.303 0 0 0 .096-7.853 1 1 0 0 0-1.531-.793Z" />
      </svg>
    ),
  },
  {
    slug: "musteri-destegi",
    label: "Müşteri Desteği",
    description: "Chatbot, self-servis, bilet sistemi",
    toolCount: 9,
    accentColor: "#0891b2",
    accentBg: "#ecfeff",
    icon: (
      <svg viewBox="0 0 20 20" fill="currentColor" className="w-4.5 h-4.5" aria-hidden>
        <path fillRule="evenodd" d="M10 2c-2.236 0-4.43.18-6.57.524C1.993 2.755 1 4.014 1 5.426v5.148c0 1.413.993 2.67 2.43 2.902.848.137 1.705.248 2.57.331v3.443a.75.75 0 0 0 1.28.53l3.58-3.579a.78.78 0 0 1 .527-.224 41.202 41.202 0 0 0 5.183-.5c1.437-.232 2.43-1.49 2.43-2.903V5.426c0-1.413-.993-2.67-2.43-2.902A41.289 41.289 0 0 0 10 2Zm0 7a1 1 0 1 0 0-2 1 1 0 0 0 0 2ZM8 8a1 1 0 1 1-2 0 1 1 0 0 1 2 0Zm5 1a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z" clipRule="evenodd" />
      </svg>
    ),
  },
  {
    slug: "e-ticaret",
    label: "E-Ticaret",
    description: "Ürün içeriği, satış artırma",
    toolCount: 12,
    accentColor: "#d97706",
    accentBg: "#fffbeb",
    icon: (
      <svg viewBox="0 0 20 20" fill="currentColor" className="w-4.5 h-4.5" aria-hidden>
        <path d="M1 1.75A.75.75 0 0 1 1.75 1h1.628a1.75 1.75 0 0 1 1.734 1.51L5.18 3a65.25 65.25 0 0 1 13.36 1.412.75.75 0 0 1 .58.875 48.645 48.645 0 0 1-1.618 6.2.75.75 0 0 1-.712.513H6a2.503 2.503 0 0 0-2.292 1.5H17.25a.75.75 0 0 1 0 1.5H2.76a.75.75 0 0 1-.748-.807 4.002 4.002 0 0 1 2.716-3.373L3.37 2.85l-.14-1.1H1.75A.75.75 0 0 1 1 1.75Z" />
      </svg>
    ),
  },
  {
    slug: "operasyon",
    label: "Operasyon",
    description: "Süreç yönetimi, verimlilik",
    toolCount: 10,
    accentColor: "#475569",
    accentBg: "#f8fafc",
    icon: (
      <svg viewBox="0 0 20 20" fill="currentColor" className="w-4.5 h-4.5" aria-hidden>
        <path fillRule="evenodd" d="M7.84 1.804A1 1 0 0 1 8.82 1h2.36a1 1 0 0 1 .98.804l.331 1.652a6.993 6.993 0 0 1 1.929 1.115l1.598-.54a1 1 0 0 1 1.186.447l1.18 2.044a1 1 0 0 1-.205 1.251l-1.267 1.113a7.047 7.047 0 0 1 0 2.228l1.267 1.113a1 1 0 0 1 .206 1.25l-1.18 2.045a1 1 0 0 1-1.187.447l-1.598-.54a6.993 6.993 0 0 1-1.929 1.115l-.33 1.652a1 1 0 0 1-.98.804H8.82a1 1 0 0 1-.98-.804l-.331-1.652a6.993 6.993 0 0 1-1.929-1.115l-1.598.54a1 1 0 0 1-1.186-.447l-1.18-2.044a1 1 0 0 1 .205-1.251l1.267-1.114a7.05 7.05 0 0 1 0-2.227L1.821 7.773a1 1 0 0 1-.206-1.25l1.18-2.045a1 1 0 0 1 1.187-.447l1.598.54A6.992 6.992 0 0 1 7.51 3.456l.33-1.652ZM10 13a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" clipRule="evenodd" />
      </svg>
    ),
  },
  {
    slug: "otomasyon",
    label: "Otomasyon",
    description: "İş akışı, entegrasyon",
    toolCount: 8,
    accentColor: "#0d9488",
    accentBg: "#f0fdfa",
    icon: (
      <svg viewBox="0 0 20 20" fill="currentColor" className="w-4.5 h-4.5" aria-hidden>
        <path d="M11.983 1.907a.75.75 0 0 0-1.292-.657l-8.5 9.5A.75.75 0 0 0 2.75 12h6.572l-1.305 6.093a.75.75 0 0 0 1.292.657l8.5-9.5A.75.75 0 0 0 17.25 8h-6.572l1.305-6.093Z" />
      </svg>
    ),
  },
  {
    slug: "video-ses",
    label: "Video & Ses",
    description: "Ses klonlama, video üretimi",
    toolCount: 13,
    accentColor: "#9333ea",
    accentBg: "#fdf4ff",
    icon: (
      <svg viewBox="0 0 20 20" fill="currentColor" className="w-4.5 h-4.5" aria-hidden>
        <path d="M3.25 4A2.25 2.25 0 0 0 1 6.25v7.5A2.25 2.25 0 0 0 3.25 16h7.5A2.25 2.25 0 0 0 13 13.75v-7.5A2.25 2.25 0 0 0 10.75 4h-7.5ZM19 4.75a.75.75 0 0 0-1.28-.53l-3 3a.75.75 0 0 0-.22.53v4.5c0 .199.079.39.22.53l3 3a.75.75 0 0 0 1.28-.53V4.75Z" />
      </svg>
    ),
  },
];

const featuredCategories = CATEGORIES.filter((c) => c.featured);
const standardCategories = CATEGORIES.filter((c) => !c.featured);
const totalTools = CATEGORIES.reduce((sum, c) => sum + c.toolCount, 0);

export function SeoDiscovery() {
  return (
    <Section bg="white" spacing="lg" id="kategoriler">

      {/* Section header */}
      <div className="flex flex-col items-center text-center gap-2 mb-10">
        <p
          className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full"
          style={{ backgroundColor: "#f1f5f9", color: "#64748b" }}
        >
          Keşfet
        </p>
        <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
          Kategoriye göre araç bul
        </h2>
        <p className="text-sm text-slate-500">
          {totalTools}+ araç, {CATEGORIES.length} kategori — ihtiyacına göre filtrele
        </p>
      </div>

      {/* Featured categories — 2×2 grid on desktop */}
      <div className="max-w-4xl mx-auto mb-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {featuredCategories.map((cat) => (
            <Link
              key={cat.slug}
              href={`/tools?category=${cat.slug}`}
              className="group flex items-start gap-4 p-5 rounded-2xl border transition-all duration-200 hover:shadow-md"
              style={{ borderColor: "#e2e8f0", backgroundColor: "#ffffff" }}
            >
              {/* Icon */}
              <div
                className="flex-shrink-0 flex h-11 w-11 items-center justify-center rounded-xl transition-transform duration-200 group-hover:scale-105"
                style={{ backgroundColor: cat.accentBg, color: cat.accentColor }}
              >
                {cat.icon}
              </div>

              {/* Text */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <span
                    className="text-sm font-bold text-slate-800 group-hover:text-slate-900 transition-colors"
                  >
                    {cat.label}
                  </span>
                  <span
                    className="flex-shrink-0 text-[11px] font-semibold px-2 py-0.5 rounded-full"
                    style={{ backgroundColor: cat.accentBg, color: cat.accentColor }}
                  >
                    {cat.toolCount} araç
                  </span>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed">{cat.description}</p>
              </div>

              {/* Arrow */}
              <svg
                viewBox="0 0 12 12"
                fill="currentColor"
                className="w-4 h-4 flex-shrink-0 mt-0.5 opacity-0 group-hover:opacity-100 transition-opacity -translate-x-1 group-hover:translate-x-0 duration-200"
                style={{ color: cat.accentColor }}
                aria-hidden
              >
                <path fillRule="evenodd" d="M4.22 3.22a.75.75 0 0 1 1.06 0l3 3a.75.75 0 0 1 0 1.06l-3 3a.75.75 0 1 1-1.06-1.06L6.69 6.5 4.22 4.03a.75.75 0 0 1 0-1.06z" clipRule="evenodd" />
              </svg>
            </Link>
          ))}
        </div>
      </div>

      {/* Standard categories — compact row */}
      <div className="max-w-4xl mx-auto">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
          {standardCategories.map((cat) => (
            <Link
              key={cat.slug}
              href={`/tools?category=${cat.slug}`}
              className="group flex flex-col items-center gap-2.5 px-3 py-4 rounded-xl border text-center transition-all duration-200 hover:shadow-sm hover:border-slate-300"
              style={{ borderColor: "#e2e8f0", backgroundColor: "#f8fafc" }}
            >
              <div
                className="flex h-9 w-9 items-center justify-center rounded-lg transition-transform duration-200 group-hover:scale-110"
                style={{ backgroundColor: cat.accentBg, color: cat.accentColor }}
              >
                {cat.icon}
              </div>
              <div>
                <span className="block text-xs font-semibold text-slate-700 group-hover:text-slate-900 leading-tight">
                  {cat.label}
                </span>
                <span className="block text-[10px] text-slate-400 mt-0.5">
                  {cat.toolCount} araç
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* View all CTA */}
      <div className="flex justify-center mt-8">
        <Link
          href="/tools"
          className="inline-flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors"
        >
          Tüm araçları gör
          <svg viewBox="0 0 12 12" fill="currentColor" className="w-3.5 h-3.5" aria-hidden>
            <path fillRule="evenodd" d="M4.22 3.22a.75.75 0 0 1 1.06 0l3 3a.75.75 0 0 1 0 1.06l-3 3a.75.75 0 1 1-1.06-1.06L6.69 6.5 4.22 4.03a.75.75 0 0 1 0-1.06z" clipRule="evenodd" />
          </svg>
        </Link>
      </div>

    </Section>
  );
}
