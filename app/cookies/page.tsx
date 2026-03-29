import type { Metadata } from "next";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "Çerez Politikası | Yaverim",
  description: "Yaverim çerez politikası — hangi çerezleri kullandığımız ve nasıl yönetebileceğiniz.",
};

const COOKIE_TYPES = [
  {
    name: "Zorunlu çerezler",
    color: "#16a34a",
    canDisable: false,
    description: "Platformun çalışması için gereklidir. Oturum yönetimi, güvenlik token'ları ve tercihlerin saklanması bu kategoridedir. Bu çerezler devre dışı bırakılamaz.",
    examples: [
      "Oturum kimliği (session ID)",
      "CSRF koruma token'ı",
      "Kullanıcı tercihleri (tema, dil)",
    ],
  },
  {
    name: "Analitik çerezler",
    color: "#2563eb",
    canDisable: true,
    description: "Platformun nasıl kullanıldığını anonim olarak anlamamıza yardımcı olur. Bu veriler hizmetleri iyileştirmek için kullanılır; kişisel tanımlama yapılmaz.",
    examples: [
      "Sayfa görüntüleme sayısı",
      "Oturum süresi",
      "Tıklama istatistikleri",
    ],
  },
  {
    name: "İşlevsel çerezler",
    color: "#7c3aed",
    canDisable: true,
    description: "Analiz formu yanıtlarını geçici olarak saklamak ve kullanıcı deneyimini kişiselleştirmek için kullanılır.",
    examples: [
      "Yarım kalan analiz formu verileri",
      "Son görüntülenen araçlar",
    ],
  },
];

export default function CookiesPage() {
  const lastUpdated = "28 Mart 2026";

  return (
    <>
      <Navbar />
      <main className="flex flex-col flex-1 bg-white">
        <div className="max-w-3xl mx-auto px-6 py-16 md:py-24">

          <div className="mb-12">
            <p className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: "#2563eb" }}>
              Çerez Politikası
            </p>
            <h1 className="text-4xl font-bold tracking-tight mb-4" style={{ color: "#0f172a" }}>
              Çerez Politikası
            </h1>
            <p className="text-sm" style={{ color: "#94a3b8" }}>Son güncelleme: {lastUpdated}</p>
            <p className="text-base mt-4 leading-relaxed" style={{ color: "#475569" }}>
              Yaverim, platformu daha iyi çalıştırmak için çerezler kullanır. Bu sayfa
              hangi çerezleri kullandığımızı ve bunları nasıl yönetebileceğinizi açıklar.
            </p>
          </div>

          {/* What is a cookie */}
          <div className="mb-10 p-6 rounded-2xl" style={{ backgroundColor: "#f8fafc", border: "1px solid #e2e8f0" }}>
            <h2 className="font-semibold mb-2" style={{ color: "#0f172a" }}>Çerez nedir?</h2>
            <p className="text-sm leading-relaxed" style={{ color: "#475569" }}>
              Çerezler, tarayıcınıza kaydedilen küçük metin dosyalarıdır. Web sitelerinin
              sizi tanımasına, tercihlerinizi hatırlamasına ve hizmeti iyileştirmesine
              yardımcı olur.
            </p>
          </div>

          {/* Cookie types */}
          <div className="flex flex-col gap-6 mb-10">
            {COOKIE_TYPES.map(ct => (
              <div
                key={ct.name}
                className="p-6 rounded-2xl"
                style={{ border: "1px solid #e2e8f0" }}
              >
                <div className="flex items-center justify-between gap-4 mb-3 flex-wrap">
                  <div className="flex items-center gap-3">
                    <span
                      className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                      style={{ backgroundColor: ct.color }}
                      aria-hidden
                    />
                    <h2 className="font-semibold" style={{ color: "#0f172a" }}>{ct.name}</h2>
                  </div>
                  <span
                    className="text-xs px-2.5 py-1 rounded-full font-medium"
                    style={{
                      backgroundColor: ct.canDisable ? "#f1f5f9" : "#f0fdf4",
                      color: ct.canDisable ? "#64748b" : "#16a34a",
                    }}
                  >
                    {ct.canDisable ? "Devre dışı bırakılabilir" : "Zorunlu"}
                  </span>
                </div>
                <p className="text-sm leading-relaxed mb-4" style={{ color: "#475569" }}>
                  {ct.description}
                </p>
                <ul className="flex flex-col gap-1.5">
                  {ct.examples.map(ex => (
                    <li key={ex} className="flex items-center gap-2 text-sm" style={{ color: "#64748b" }}>
                      <span
                        className="w-1 h-1 rounded-full flex-shrink-0"
                        style={{ backgroundColor: "#cbd5e1" }}
                        aria-hidden
                      />
                      {ex}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* How to manage */}
          <div className="mb-10">
            <h2 className="text-lg font-semibold mb-4" style={{ color: "#0f172a" }}>Çerezleri nasıl yönetirsiniz?</h2>
            <p className="text-sm leading-relaxed mb-4" style={{ color: "#475569" }}>
              Tarayıcınızın ayarlarından çerezleri silebilir veya engelleyebilirsiniz.
              Zorunlu çerezlerin devre dışı bırakılması, platformun bazı özelliklerinin
              çalışmamasına neden olabilir.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { name: "Google Chrome", url: "https://support.google.com/chrome/answer/95647" },
                { name: "Mozilla Firefox", url: "https://support.mozilla.org/tr/kb/cerezleri-silme" },
                { name: "Safari", url: "https://support.apple.com/tr-tr/guide/safari/sfri11471/mac" },
                { name: "Microsoft Edge", url: "https://support.microsoft.com/tr-tr/microsoft-edge" },
              ].map(b => (
                <a
                  key={b.name}
                  href={b.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-4 rounded-xl text-sm font-medium transition-colors hover:opacity-80"
                  style={{ border: "1px solid #e2e8f0", color: "#2563eb" }}
                >
                  {b.name}
                  <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-3 h-3" aria-hidden>
                    <path d="M2 2h8m0 0v8m0-8L2 10" />
                  </svg>
                </a>
              ))}
            </div>
          </div>

          <div
            className="p-6 rounded-2xl"
            style={{ backgroundColor: "#f8fafc", border: "1px solid #e2e8f0" }}
          >
            <p className="text-sm" style={{ color: "#475569" }}>
              Çerez politikası hakkında sorularınız için{" "}
              <a href="mailto:destek@yaverim.io" className="font-semibold" style={{ color: "#2563eb" }}>
                destek@yaverim.io
              </a>{" "}
              adresine yazabilirsiniz.
            </p>
          </div>

        </div>
      </main>
      <Footer />
    </>
  );
}
