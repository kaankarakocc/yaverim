import type { Metadata } from "next";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "Hakkında | Yaverim",
  description: "Yaverim nedir, nasıl çalışır ve neden editoryal bağımsızlığa önem veririz.",
};

const VALUES = [
  {
    title: "Bağımsız editöryal yaklaşım",
    body: "Hangi araçların listeleneceğine ve nasıl sıralanacağına yalnızca editoryal kriterler karar verir. Sponsorluk veya ortaklık hiçbir zaman sıralamayı etkilemez.",
  },
  {
    title: "Şeffaf gelir modeli",
    body: "Bazı araçların referral linkleri içerdiğini açıkça belirtiyoruz. Bu komisyonlar ürünü geliştirmemize yardımcı olur ama ne bir aracı öne çıkarır ne de geride bırakır.",
  },
  {
    title: "Gerçek kullanıcı bağlamı",
    body: "Herkese aynı öneri listesini vermiyoruz. Analizin kullanıcının gerçek bağlamına — iş tipi, hedef, bütçe, ekip yapısı — göre şekilleniyor.",
  },
  {
    title: "Uygulanabilir plan",
    body: "Araç listesi sunmak yeterli değil. Pro planda kullanıcıya ne yapacağını, hangi sırayla yapacağını ve hangi araçla yapacağını adım adım anlatıyoruz.",
  },
];

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <main className="flex flex-col flex-1 bg-white">
        <div className="max-w-3xl mx-auto px-6 py-16 md:py-24">

          {/* Header */}
          <div className="mb-14">
            <p className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: "#2563eb" }}>
              Hakkında
            </p>
            <h1 className="text-4xl font-bold tracking-tight mb-6" style={{ color: "#0f172a" }}>
              Yaverim nedir?
            </h1>
            <p className="text-lg leading-relaxed" style={{ color: "#475569" }}>
              Yaverim, kullanıcının hedefine, bütçesine ve çalışma düzenine göre en uygun
              yapay zekâ araçlarını ve uygulanabilir bir planı dakikalar içinde oluşturan
              bir AI rehberi platformudur.
            </p>
          </div>

          {/* Story */}
          <div className="mb-14 p-8 rounded-2xl" style={{ backgroundColor: "#f8fafc", border: "1px solid #e2e8f0" }}>
            <h2 className="text-xl font-semibold mb-4" style={{ color: "#0f172a" }}>Nasıl başladı?</h2>
            <div className="flex flex-col gap-4 text-base leading-relaxed" style={{ color: "#475569" }}>
              <p>
                Yapay zekâ araçlarının sayısı hızla büyürken, hangi aracın hangi senaryoya
                uygun olduğunu anlamak giderek zorlaştı. Aynı "en iyi AI araçları" listelerinin
                herkese sunulması, gerçek bir yönlendirme değil salt liste sunmak anlamına geliyordu.
              </p>
              <p>
                Yaverim, bu problemi çözmek için kuruldu: kullanıcının bağlamını anlayan,
                bütçeye ve hedefe göre filtreleyen ve sadece araç önermekle kalmayıp
                <em> ne yapacağını</em> da gösteren bir platform.
              </p>
            </div>
          </div>

          {/* Values */}
          <div className="mb-14">
            <h2 className="text-xl font-semibold mb-8" style={{ color: "#0f172a" }}>Değerlerimiz</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {VALUES.map(v => (
                <div key={v.title} className="p-6 rounded-2xl" style={{ border: "1px solid #e2e8f0" }}>
                  <h3 className="font-semibold mb-2" style={{ color: "#0f172a" }}>{v.title}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: "#475569" }}>{v.body}</p>
                </div>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div className="flex flex-col items-start gap-4 p-8 rounded-2xl" style={{ backgroundColor: "#eff6ff", border: "1px solid #bfdbfe" }}>
            <h2 className="text-xl font-semibold" style={{ color: "#0f172a" }}>Bizi dene</h2>
            <p className="text-sm" style={{ color: "#475569" }}>
              2 dakikalık analiz ile bağlamına özel yapay zekâ araçları önerisi al.
            </p>
            <Link
              href="/analyze"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm transition-opacity hover:opacity-90"
              style={{ backgroundColor: "#2563eb", color: "#ffffff" }}
            >
              Analizi başlat →
            </Link>
          </div>

        </div>
      </main>
      <Footer />
    </>
  );
}
