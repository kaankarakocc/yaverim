"use client";

import Link from "next/link";

interface Persona {
  slug: string;
  label: string;
  tagline: string;
  accentColor: string;
  accentBg: string;
  icon: React.ReactNode;
}

const PERSONAS: Persona[] = [
  {
    slug: "birey",
    label: "Birey",
    tagline: "Hayatımı veya yan işimi kolaylaştırmak istiyorum.",
    accentColor: "#2563eb",
    accentBg: "#eff6ff",
    icon: (
      <svg viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5" aria-hidden>
        <path d="M10 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM3.465 14.493a1.23 1.23 0 0 0 .41 1.412A9.957 9.957 0 0 0 10 18c2.31 0 4.438-.784 6.131-2.1.43-.333.604-.903.408-1.41a7.002 7.002 0 0 0-13.074.003Z" />
      </svg>
    ),
  },
  {
    slug: "freelancer",
    label: "Freelancer",
    tagline: "İşimi hızlandırmak ve daha verimli çalışmak istiyorum.",
    accentColor: "#7c3aed",
    accentBg: "#f5f3ff",
    icon: (
      <svg viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5" aria-hidden>
        <path fillRule="evenodd" d="M6 3.75A2.75 2.75 0 0 1 8.75 1h2.5A2.75 2.75 0 0 1 14 3.75v.443c.572.055 1.14.122 1.706.2C17.053 4.582 18 5.75 18 7.07v3.469c0 1.126-.694 2.191-1.83 2.54-1.952.599-4.024.921-6.17.921s-4.219-.322-6.17-.921C2.694 12.73 2 11.665 2 10.539V7.07c0-1.321.947-2.489 2.294-2.676A41.047 41.047 0 0 1 6 4.193V3.75Zm6.5 0v.325a41.622 41.622 0 0 0-5 0V3.75c0-.69.56-1.25 1.25-1.25h2.5c.69 0 1.25.56 1.25 1.25ZM10 10a1 1 0 0 0-1 1v.01a1 1 0 0 0 2 0V11a1 1 0 0 0-1-1Z" clipRule="evenodd" />
        <path d="M3 15.055v-.684c.126.053.255.1.39.142 2.1.642 4.312.987 6.61.987 2.297 0 4.51-.345 6.61-.987.135-.041.264-.089.39-.142v.684c0 1.347-.985 2.53-2.363 2.686a41.454 41.454 0 0 1-9.274 0C3.985 17.585 3 16.402 3 15.055Z" />
      </svg>
    ),
  },
  {
    slug: "isletme-sahibi",
    label: "İşletme Sahibi",
    tagline: "Satış, içerik ve operasyonu güçlendirmek istiyorum.",
    accentColor: "#d97706",
    accentBg: "#fffbeb",
    icon: (
      <svg viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5" aria-hidden>
        <path fillRule="evenodd" d="M4 16.5v-13h-.25a.75.75 0 0 1 0-1.5h12.5a.75.75 0 0 1 0 1.5H16v13h.25a.75.75 0 0 1 0 1.5h-3.5a.75.75 0 0 1-.75-.75v-2.5a.75.75 0 0 0-.75-.75h-2.5a.75.75 0 0 0-.75.75v2.5a.75.75 0 0 1-.75.75h-3.5a.75.75 0 0 1 0-1.5H4Zm3-11a.75.75 0 0 1 .75-.75h.5a.75.75 0 0 1 0 1.5h-.5A.75.75 0 0 1 7 5.5Zm.75 2.25a.75.75 0 0 0 0 1.5h.5a.75.75 0 0 0 0-1.5h-.5ZM7 10.75a.75.75 0 0 1 .75-.75h.5a.75.75 0 0 1 0 1.5h-.5a.75.75 0 0 1-.75-.75Zm4.75-4.25a.75.75 0 0 0 0 1.5h.5a.75.75 0 0 0 0-1.5h-.5Zm-.75 4.25a.75.75 0 0 1 .75-.75h.5a.75.75 0 0 1 0 1.5h-.5a.75.75 0 0 1-.75-.75Zm.75-6.75a.75.75 0 0 0 0 1.5h.5a.75.75 0 0 0 0-1.5h-.5Z" clipRule="evenodd" />
      </svg>
    ),
  },
  {
    slug: "ekip",
    label: "Ekip / Şirket",
    tagline: "Ekibimi daha verimli ve rekabetçi hale getirmek istiyorum.",
    accentColor: "#0891b2",
    accentBg: "#ecfeff",
    icon: (
      <svg viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5" aria-hidden>
        <path d="M7 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM14.5 9a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5ZM1.615 16.428a1.224 1.224 0 0 1-.569-1.175 6.002 6.002 0 0 1 11.908 0c.058.467-.172.92-.57 1.174A9.953 9.953 0 0 1 7 18a9.953 9.953 0 0 1-5.385-1.572ZM14.5 16h-.106c.07-.297.088-.611.048-.933a7.47 7.47 0 0 0-1.588-3.755 4.502 4.502 0 0 1 5.874 2.636.818.818 0 0 1-.36.98A7.465 7.465 0 0 1 14.5 16Z" />
      </svg>
    ),
  },
];

const META = [
  { text: "2 dakika",       icon: <ClockIcon /> },
  { text: "5 adım",         icon: <ListIcon /> },
  { text: "Kayıt gerekmez", icon: <CheckIcon /> },
];

export function OnboardingEntry() {
  return (
    <section
      id="baslat"
      aria-label="Hızlı analiz başlangıcı"
      style={{ backgroundColor: "#f8fafc" }}
    >
      {/* Subtle top divider */}
      <div style={{ height: 1, backgroundColor: "#e2e8f0" }} />

      <div className="container-page py-16 md:py-20">

        {/* Header */}
        <div className="flex flex-col items-center text-center gap-3 max-w-xl mx-auto mb-10">
          <span
            className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full"
            style={{ backgroundColor: "#eff6ff", color: "#2563eb", border: "1px solid #bfdbfe" }}
          >
            Ücretsiz başla
          </span>
          <h2
            className="text-2xl md:text-3xl font-bold tracking-tight text-balance"
            style={{ color: "#0f172a" }}
          >
            Anlat, biz bulalım.
          </h2>
          <p className="text-base leading-relaxed" style={{ color: "#64748b" }}>
            Kim olduğunu seç — sana özel yapay zekâ araçları ve uygulama planı dakikalar içinde hazır.
          </p>
        </div>

        {/* Persona cards */}
        <ul
          className="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-3xl mx-auto"
          aria-label="Persona seçimi"
        >
          {PERSONAS.map((persona) => (
            <li key={persona.slug}>
              <Link
                href={`/analyze?type=${persona.slug}`}
                className="group flex flex-col gap-4 p-5 rounded-2xl h-full bg-white transition-all duration-200 hover:-translate-y-0.5"
                style={{
                  border: "1px solid #e2e8f0",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.borderColor = persona.accentColor + "55";
                  (e.currentTarget as HTMLElement).style.boxShadow = `0 4px 16px ${persona.accentColor}18`;
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.borderColor = "#e2e8f0";
                  (e.currentTarget as HTMLElement).style.boxShadow = "0 1px 3px rgba(0,0,0,0.04)";
                }}
              >
                {/* Accent top strip */}
                <span
                  className="absolute top-0 left-4 right-4 h-0.5 rounded-b-full opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                  style={{ backgroundColor: persona.accentColor }}
                  aria-hidden
                />

                {/* Icon */}
                <span
                  className="flex items-center justify-center w-10 h-10 rounded-xl flex-shrink-0"
                  style={{ backgroundColor: persona.accentBg, color: persona.accentColor }}
                  aria-hidden
                >
                  {persona.icon}
                </span>

                {/* Text */}
                <div className="flex flex-col gap-1 flex-1">
                  <span className="font-semibold text-sm" style={{ color: "#0f172a" }}>
                    {persona.label}
                  </span>
                  <span className="text-xs leading-relaxed" style={{ color: "#64748b" }}>
                    {persona.tagline}
                  </span>
                </div>

                {/* Arrow */}
                <span
                  className="text-sm self-end transition-transform duration-200 group-hover:translate-x-1"
                  style={{ color: persona.accentColor }}
                  aria-hidden
                >
                  →
                </span>
              </Link>
            </li>
          ))}
        </ul>

        {/* Meta row */}
        <div className="flex items-center justify-center gap-6 mt-8 flex-wrap">
          {META.map((item) => (
            <span
              key={item.text}
              className="flex items-center gap-1.5 text-xs"
              style={{ color: "#94a3b8" }}
            >
              <span className="flex-shrink-0" style={{ color: "#cbd5e1" }}>{item.icon}</span>
              {item.text}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── Inline icons ──────────────────────────────────────────────────────── */

function ClockIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="currentColor" className="w-3.5 h-3.5" aria-hidden>
      <path fillRule="evenodd" d="M1 8a7 7 0 1 1 14 0A7 7 0 0 1 1 8Zm7-4.75a.75.75 0 0 1 .75.75v3.69l1.72 1.72a.75.75 0 1 1-1.06 1.06L7.47 8.53A.75.75 0 0 1 7.25 8V4a.75.75 0 0 1 .75-.75Z" clipRule="evenodd" />
    </svg>
  );
}

function ListIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="currentColor" className="w-3.5 h-3.5" aria-hidden>
      <path fillRule="evenodd" d="M2 4.75A.75.75 0 0 1 2.75 4h10.5a.75.75 0 0 1 0 1.5H2.75A.75.75 0 0 1 2 4.75ZM2 8a.75.75 0 0 1 .75-.75h10.5a.75.75 0 0 1 0 1.5H2.75A.75.75 0 0 1 2 8Zm0 3.25a.75.75 0 0 1 .75-.75h4.5a.75.75 0 0 1 0 1.5h-4.5a.75.75 0 0 1-.75-.75Z" clipRule="evenodd" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="currentColor" className="w-3.5 h-3.5" aria-hidden>
      <path fillRule="evenodd" d="M12.416 3.376a.75.75 0 0 1 .208 1.04l-5 7.5a.75.75 0 0 1-1.154.114l-3-3a.75.75 0 0 1 1.06-1.06l2.353 2.353 4.493-6.74a.75.75 0 0 1 1.04-.207Z" clipRule="evenodd" />
    </svg>
  );
}
