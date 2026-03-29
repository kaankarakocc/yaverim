import type { Metadata } from "next";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "Gizlilik Politikası | Yaverim",
  description: "Yaverim gizlilik politikası — verilerinizi nasıl topladığımız, kullandığımız ve koruduğumuz.",
};

const SECTIONS = [
  {
    title: "Hangi verileri topluyoruz?",
    content: [
      "Analiz formu aracılığıyla girdiğiniz bilgiler: kullanıcı tipi, sektör, hedefler, ekip yapısı, bütçe aralığı ve isteğe bağlı serbest metin alanı.",
      "Hesap oluşturursanız: e-posta adresi ve ad-soyad.",
      "Teknik veriler: IP adresi, tarayıcı türü, sayfa görüntüleme istatistikleri (anonim).",
      "Ödeme verileri: Ödeme işlemleri güvenli üçüncü taraf sağlayıcılar aracılığıyla gerçekleştirilir; kart bilgileriniz Yaverim sunucularında saklanmaz.",
    ],
  },
  {
    title: "Verileri nasıl kullanıyoruz?",
    content: [
      "Analiz verileriniz yalnızca size özel yapay zekâ araçları önerisi ve plan oluşturmak için kullanılır.",
      "Hizmetleri geliştirmek amacıyla anonim istatistiksel analiz yapılabilir.",
      "E-posta adresiniz hesap bildirimleri ve isteğe bağlı bülten aboneliği için kullanılır.",
      "Verileriniz hiçbir üçüncü tarafla ticari amaçla paylaşılmaz veya satılmaz.",
    ],
  },
  {
    title: "Verileriniz ne kadar süre saklanır?",
    content: [
      "Hesap oluşturduysanız: Hesabınızı silene kadar.",
      "Misafir analiz verileri: Oturum süresi boyunca URL parametreleri olarak aktarılır; sunucuda kalıcı olarak saklanmaz.",
      "Anonim analitik veriler: 24 ay.",
    ],
  },
  {
    title: "Üçüncü taraf hizmetler",
    content: [
      "Google Analytics (anonim ziyaretçi istatistikleri)",
      "Ödeme işlemcisi (Stripe veya benzeri — kart bilgileri Yaverim'e ulaşmaz)",
      "E-posta servisi (hesap ve bildirim e-postaları için)",
    ],
  },
  {
    title: "Haklarınız",
    content: [
      "Saklanan verilerinizin bir kopyasını talep edebilirsiniz.",
      "Verilerinizin silinmesini isteyebilirsiniz.",
      "Bülten aboneliğini her zaman iptal edebilirsiniz.",
      "Bu hakları kullanmak için destek@yaverim.io adresine yazabilirsiniz.",
    ],
  },
  {
    title: "Çerezler",
    content: [
      "Çerezler ve kullanımları hakkında detaylı bilgi için Çerez Politikası sayfamızı inceleyebilirsiniz.",
    ],
  },
];

export default function PrivacyPage() {
  const lastUpdated = "28 Mart 2026";

  return (
    <>
      <Navbar />
      <main className="flex flex-col flex-1 bg-white">
        <div className="max-w-3xl mx-auto px-6 py-16 md:py-24">

          <div className="mb-12">
            <p className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: "#2563eb" }}>
              Gizlilik Politikası
            </p>
            <h1 className="text-4xl font-bold tracking-tight mb-4" style={{ color: "#0f172a" }}>
              Verileriniz güvende
            </h1>
            <p className="text-sm" style={{ color: "#94a3b8" }}>Son güncelleme: {lastUpdated}</p>
          </div>

          <div className="flex flex-col gap-10">
            {SECTIONS.map(s => (
              <div key={s.title}>
                <h2 className="text-lg font-semibold mb-4" style={{ color: "#0f172a" }}>{s.title}</h2>
                <ul className="flex flex-col gap-2.5">
                  {s.content.map((item, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm leading-relaxed" style={{ color: "#475569" }}>
                      <span
                        className="flex-shrink-0 mt-1.5 w-1.5 h-1.5 rounded-full"
                        style={{ backgroundColor: "#cbd5e1" }}
                        aria-hidden
                      />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div
            className="mt-12 p-6 rounded-2xl"
            style={{ backgroundColor: "#f8fafc", border: "1px solid #e2e8f0" }}
          >
            <p className="text-sm" style={{ color: "#475569" }}>
              Bu politika hakkında sorularınız için{" "}
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
