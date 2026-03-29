import type { Metadata } from "next";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "İletişim | Yaverim",
  description: "Yaverim ekibiyle iletişime geçin. Sorularınızı, geri bildirimlerinizi ve işbirliği taleplerinizi bekliyoruz.",
};

const TOPICS = [
  {
    title: "Genel sorular",
    description: "Platformun nasıl çalıştığı, analiz süreci veya hesabınız hakkında.",
    email: "destek@yaverim.io",
  },
  {
    title: "Editoryal / araç önerisi",
    description: "Listeye dahil edilmesini istediğiniz bir araç veya sıralama hakkında yorum.",
    email: "editor@yaverim.io",
  },
  {
    title: "Sponsorluk ve ortaklık",
    description: "Referral programı, sponsorlu içerik veya B2B işbirliği için.",
    email: "partner@yaverim.io",
  },
  {
    title: "Teknik / hata bildirimi",
    description: "Bir hata buldunuz veya özellik talebiniz var.",
    email: "teknik@yaverim.io",
  },
];

export default function ContactPage() {
  return (
    <>
      <Navbar />
      <main className="flex flex-col flex-1 bg-white">
        <div className="max-w-3xl mx-auto px-6 py-16 md:py-24">

          {/* Header */}
          <div className="mb-14">
            <p className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: "#2563eb" }}>
              İletişim
            </p>
            <h1 className="text-4xl font-bold tracking-tight mb-6" style={{ color: "#0f172a" }}>
              Sizinle konuşmaktan memnuniyet duyarız
            </h1>
            <p className="text-lg leading-relaxed" style={{ color: "#475569" }}>
              Soru, geri bildirim veya işbirliği talebi için aşağıdaki kanalları kullanabilirsiniz.
              Genellikle 1–2 iş günü içinde yanıt veriyoruz.
            </p>
          </div>

          {/* Contact topics */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-14">
            {TOPICS.map(t => (
              <div
                key={t.title}
                className="flex flex-col gap-3 p-6 rounded-2xl"
                style={{ border: "1px solid #e2e8f0" }}
              >
                <h2 className="font-semibold" style={{ color: "#0f172a" }}>{t.title}</h2>
                <p className="text-sm leading-relaxed flex-1" style={{ color: "#64748b" }}>{t.description}</p>
                <a
                  href={`mailto:${t.email}`}
                  className="text-sm font-semibold transition-colors hover:opacity-80"
                  style={{ color: "#2563eb" }}
                >
                  {t.email}
                </a>
              </div>
            ))}
          </div>

          {/* Response time notice */}
          <div
            className="flex items-start gap-4 p-6 rounded-2xl"
            style={{ backgroundColor: "#f8fafc", border: "1px solid #e2e8f0" }}
          >
            <svg viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: "#22c55e" }} aria-hidden>
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
            </svg>
            <div>
              <p className="font-semibold text-sm" style={{ color: "#0f172a" }}>Hızlı yanıt garantisi</p>
              <p className="text-sm mt-1" style={{ color: "#64748b" }}>
                Tüm sorulara en geç 2 iş günü içinde yanıt veriyoruz.
                Acil teknik sorunlar için teknik@yaverim.io adresini kullanın.
              </p>
            </div>
          </div>

        </div>
      </main>
      <Footer />
    </>
  );
}
