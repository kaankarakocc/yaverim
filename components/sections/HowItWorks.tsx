import { Section } from "@/components/layout/Section";

interface Step {
  number: string;
  title: string;
  description: string;
  tags: string[];
  accentColor: string;
  accentBg: string;
  icon: React.ReactNode;
}

const STEPS: Step[] = [
  {
    number: "01",
    title: "Durumunu anlat",
    description:
      "Kim olduğunu, ne iş yaptığını, neyi geliştirmek istediğini ve bütçeni 5 hızlı soruda paylaş.",
    tags: ["Kısa", "Kontrollü", "Gereksiz soru yok"],
    accentColor: "#2563eb",
    accentBg: "#eff6ff",
    icon: (
      <svg viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5" aria-hidden>
        <path fillRule="evenodd" d="M10 2c-2.236 0-4.43.18-6.57.524C1.993 2.755 1 4.014 1 5.426v5.148c0 1.413.993 2.67 2.43 2.902.848.137 1.705.248 2.57.331v3.443a.75.75 0 0 0 1.28.53l3.58-3.579a.78.78 0 0 1 .527-.224 41.202 41.202 0 0 0 5.183-.5c1.437-.232 2.43-1.49 2.43-2.903V5.426c0-1.413-.993-2.67-2.43-2.902A41.289 41.289 0 0 0 10 2Z" clipRule="evenodd" />
      </svg>
    ),
  },
  {
    number: "02",
    title: "Yaverim bağlamını çözüyor",
    description:
      "Cevaplarına göre çözüm alanlarını çıkarıyoruz, uygun araçları kural tabanlı filtreliyor ve puanlıyoruz.",
    tags: ["Filtreleme", "Puanlama", "Açıklama katmanı"],
    accentColor: "#7c3aed",
    accentBg: "#f5f3ff",
    icon: (
      <svg viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5" aria-hidden>
        <path d="M10 1a6 6 0 0 0-3.815 10.631C7.237 12.5 8 13.443 8 14.456v.644a.75.75 0 0 0 .572.729 6.016 6.016 0 0 0 2.856 0A.75.75 0 0 0 12 15.1v-.644c0-1.013.762-1.957 1.815-2.825A6 6 0 0 0 10 1ZM8.863 17.414a.75.75 0 0 0-.226 1.483 9.066 9.066 0 0 0 2.726 0 .75.75 0 0 0-.226-1.483 7.553 7.553 0 0 1-2.274 0Z" />
      </svg>
    ),
  },
  {
    number: "03",
    title: "Özeti gör, planını oluştur",
    description:
      "Ücretsiz katmanda teşhis ve en uygun araçları anında gör. Daha derine inmek istersen aşama bazlı planını aç.",
    tags: ["Teşhis", "Karar özeti", "Pro plan"],
    accentColor: "#16a34a",
    accentBg: "#f0fdf4",
    icon: (
      <svg viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5" aria-hidden>
        <path fillRule="evenodd" d="M4.5 2A1.5 1.5 0 0 0 3 3.5v13A1.5 1.5 0 0 0 4.5 18h11a1.5 1.5 0 0 0 1.5-1.5V7.621a1.5 1.5 0 0 0-.44-1.06l-4.12-4.122A1.5 1.5 0 0 0 11.378 2H4.5Zm2.25 8.5a.75.75 0 0 0 0 1.5h6.5a.75.75 0 0 0 0-1.5h-6.5Zm0 3a.75.75 0 0 0 0 1.5h6.5a.75.75 0 0 0 0-1.5h-6.5Zm0-6a.75.75 0 0 0 0 1.5h3a.75.75 0 0 0 0-1.5h-3Z" clipRule="evenodd" />
      </svg>
    ),
  },
];

export function HowItWorks() {
  return (
    <Section id="nasil-calisir" bg="white" spacing="lg">

      {/* Section header */}
      <div className="flex flex-col items-center text-center gap-3 mb-12">
        <span
          className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full"
          style={{ backgroundColor: "#f1f5f9", color: "#475569", border: "1px solid #e2e8f0" }}
        >
          Nasıl çalışır?
        </span>
        <h2 className="font-bold tracking-tight text-balance" style={{ color: "#0f172a" }}>
          Üç adım, dakikalar içinde
        </h2>
        <p className="max-w-lg text-balance" style={{ color: "#475569" }}>
          Herkese aynı listeyi vermiyoruz. Önce seni anlıyoruz, sonra sana özel öneri üretiyoruz.
        </p>
      </div>

      {/*
        CSS subgrid: <ol> parent grid, her <li> 3 satır kaplar.
        Satır 1: ikon + numara (sabit yükseklik)
        Satır 2: başlık (en uzuna göre hizalanır)
        Satır 3: açıklama (en uzuna göre)
        Satır 4: etiketler (dipte hizalı)
        → Tüm kartlarda her bölüm aynı yükseklikte hizalanır.
      */}
      <ol
        className="grid grid-cols-1 md:grid-cols-3 max-w-4xl mx-auto"
        style={{ columnGap: "16px", rowGap: "16px" }}
      >
        {STEPS.map((step, idx) => (
          <li
            key={step.number}
            style={{
              display: "grid",
              gridRow: "span 4",
              gridTemplateRows: "subgrid",
              borderRadius: "16px",
              overflow: "hidden",
              border: "1px solid #e2e8f0",
              borderTop: `3px solid ${step.accentColor}`,
              backgroundColor: "#ffffff",
            }}
          >
            {/* Satır 1: ikon + numara */}
            <div className="flex items-center gap-3 px-6 pt-6">
              <span
                className="inline-flex items-center justify-center w-10 h-10 rounded-xl flex-shrink-0"
                style={{ backgroundColor: step.accentBg, color: step.accentColor }}
              >
                {step.icon}
              </span>
              <span
                className="text-4xl font-black leading-none select-none"
                style={{ color: "#f1f5f9", WebkitTextStroke: `1px ${step.accentColor}44` }}
                aria-hidden
              >
                {idx + 1}
              </span>
            </div>

            {/* Satır 2: başlık */}
            <div className="px-6 pt-4">
              <h3 className="font-bold text-base leading-snug" style={{ color: "#0f172a" }}>
                {step.title}
              </h3>
            </div>

            {/* Satır 3: açıklama */}
            <div className="px-6 pt-2">
              <p className="text-sm leading-relaxed" style={{ color: "#475569" }}>
                {step.description}
              </p>
            </div>

            {/* Satır 4: etiketler — her kart aynı hizada */}
            <div className="flex flex-wrap gap-1.5 px-6 pb-6 pt-5 items-start">
              {step.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-[11px] font-semibold px-2.5 py-1 rounded-full"
                  style={{ backgroundColor: step.accentBg, color: step.accentColor }}
                >
                  {tag}
                </span>
              ))}
            </div>
          </li>
        ))}
      </ol>

    </Section>
  );
}
