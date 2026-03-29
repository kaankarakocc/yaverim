import Link from "next/link";
import { Logo } from "@/components/common/Logo";

const FOOTER_LINKS = {
  "Ürün": [
    { label: "Analizi Başlat",     href: "/analyze"          },
    { label: "Nasıl Çalışır?",     href: "/#nasil-calisir"   },
    { label: "Top 10 Araçlar",     href: "/top10"            },
    { label: "Tüm Araçlar",        href: "/tools"            },
    { label: "Kategoriler",        href: "/tools#kategoriler" },
    { label: "Araç Karşılaştır",   href: "/compare"          },
  ],
  "Şirket": [
    { label: "Hakkında",           href: "/about"   },
    { label: "Güven İlkeleri",     href: "/trust"   },
    { label: "İletişim",           href: "/contact" },
  ],
  "Yasal": [
    { label: "Gizlilik Politikası", href: "/privacy" },
    { label: "Kullanım Koşulları",  href: "/terms"   },
    { label: "Çerez Politikası",    href: "/cookies" },
  ],
};

const TRUST_SIGNALS = [
  "Editöryal bağımsızlık",
  "Şeffaf sponsorluk",
  "Gerçekçi öneriler",
];

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer style={{ backgroundColor: "#0f172a" }}>

      {/* ── Main footer content ──────────────────────────────────────────────── */}
      <div className="max-w-6xl mx-auto px-6 pt-14 pb-10">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-5">

          {/* Brand column — 2 cols on lg */}
          <div className="lg:col-span-2">
            {/* Logo */}
            <div className="mb-4">
              <Logo size="md" asLink theme="dark" />
            </div>

            <p className="text-sm leading-relaxed mb-6" style={{ color: "#94a3b8" }}>
              Hedefine, bütçene ve çalışma düzenine göre en uygun yapay zekâ
              araçlarını ve uygulanabilir planı dakikalar içinde oluşturuyoruz.
            </p>

            {/* Trust signals */}
            <div className="flex flex-col gap-2">
              {TRUST_SIGNALS.map((signal) => (
                <div key={signal} className="flex items-center gap-2">
                  <svg
                    viewBox="0 0 12 12"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="w-3 h-3 flex-shrink-0"
                    style={{ color: "#22c55e" }}
                    aria-hidden
                  >
                    <path d="M2 6l2.5 2.5 5.5-5" />
                  </svg>
                  <span className="text-xs" style={{ color: "#64748b" }}>{signal}</span>
                </div>
              ))}
            </div>

            {/* CTA pill */}
            <Link
              href="/analyze"
              className="inline-flex items-center gap-2 mt-6 px-4 py-2 rounded-xl text-sm font-semibold transition-opacity hover:opacity-80"
              style={{ backgroundColor: "#2563eb", color: "#ffffff" }}
            >
              Analizi başlat →
            </Link>
          </div>

          {/* Link columns */}
          {Object.entries(FOOTER_LINKS).map(([group, links]) => (
            <div key={group}>
              <h3
                className="text-[11px] font-bold uppercase tracking-widest mb-4"
                style={{ color: "#475569" }}
              >
                {group}
              </h3>
              <ul className="flex flex-col gap-2.5">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm transition-colors hover:text-white"
                      style={{ color: "#64748b" }}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* ── Divider ──────────────────────────────────────────────────────────── */}
      <div
        className="max-w-6xl mx-auto px-6"
        style={{ borderTop: "1px solid #1e293b" }}
      />

      {/* ── Bottom bar ────────────────────────────────────────────────────────── */}
      <div className="max-w-6xl mx-auto px-6 py-5">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs" style={{ color: "#334155" }}>
            © {year} Yaverim. Tüm hakları saklıdır.
          </p>
          <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 text-center sm:text-right">
            <span className="text-xs" style={{ color: "#334155" }}>
              Bazı araç linkleri referral komisyon içerebilir — sıralama ve skorları etkilemez.
            </span>
            <span
              className="text-[10px] font-semibold px-2 py-0.5 rounded-full flex-shrink-0"
              style={{ backgroundColor: "#1e293b", color: "#475569" }}
            >
              Editöryal bağımsızlık
            </span>
          </div>
        </div>
      </div>

    </footer>
  );
}
