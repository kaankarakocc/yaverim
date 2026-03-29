import type { Metadata } from "next";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "Kullanım Koşulları | Yaverim",
  description: "Yaverim platformunu kullanırken geçerli olan kullanım koşulları.",
};

const SECTIONS = [
  {
    title: "1. Hizmet tanımı",
    content: "Yaverim, kullanıcılara yapay zekâ araçları önerisi ve uygulama planı oluşturma hizmeti sunar. Ücretsiz ve ücretli katmanlar mevcuttur. Hizmet içerikleri önceden bildirim yapılmaksızın değiştirilebilir.",
  },
  {
    title: "2. Hesap oluşturma",
    content: "Platforma kayıt olurken gerçek ve güncel bilgiler vermeyi kabul edersiniz. Hesabınızın güvenliğinden siz sorumlusunuz. Hesabınızın izinsiz kullanıldığını fark ederseniz derhal destek@yaverim.io adresine bildirmeniz gerekmektedir.",
  },
  {
    title: "3. Ödeme ve iade",
    content: "Pro Plan tek seferlik açma ücreti $2,99, aylık abonelik $9/ay olarak belirlenmektedir. Ödemeler güvenli üçüncü taraf ödeme işlemcisi aracılığıyla gerçekleştirilir. Analiz planı teslim edildikten sonra iade yapılmaz. Ancak teknik sorun yaşanması durumunda 48 saat içinde destek hattımıza başvurulabilir.",
  },
  {
    title: "4. Kullanım sınırları",
    content: "Platformu kötüye kullanmak, içerikleri yetkisiz olarak çoğaltmak, otomatik araçlarla kazımak (scraping) yasaktır. Yaverim içeriklerini ticari amaçla yeniden dağıtmak için yazılı izin gereklidir. İhlal durumunda hesap askıya alınabilir.",
  },
  {
    title: "5. Öneri sorumluluğu",
    content: "Yaverim, sunulan araç önerileri ve planların her kullanıcı için kesin sonuç vereceğini garanti etmez. Öneriler bilgilendirme amaçlıdır; iş kararları kullanıcının sorumluluğundadır. Önerilen araçların işlevselliği, fiyatlandırması veya politikaları üçüncü taraf şirketlere ait olduğundan Yaverim sorumluluk üstlenmez.",
  },
  {
    title: "6. Fikri mülkiyet",
    content: "Platform tasarımı, yazılı içerikler, metodoloji ve skor sistemi Yaverim'e aittir. Araç logoları ve adları ilgili şirketlerin mülkiyetindedir.",
  },
  {
    title: "7. Hizmet değişiklikleri",
    content: "Yaverim, önceden bildirim yaparak veya zorunlu hallerde yapmaksızın hizmet kapsamını, fiyatlandırmasını veya koşullarını değiştirme hakkını saklı tutar. Önemli değişiklikler e-posta ile bildirilir.",
  },
  {
    title: "8. Uygulanacak hukuk",
    content: "Bu koşullar Türkiye Cumhuriyeti kanunlarına tabidir. Anlaşmazlıklarda İstanbul mahkemeleri yetkilidir.",
  },
];

export default function TermsPage() {
  const lastUpdated = "28 Mart 2026";

  return (
    <>
      <Navbar />
      <main className="flex flex-col flex-1 bg-white">
        <div className="max-w-3xl mx-auto px-6 py-16 md:py-24">

          <div className="mb-12">
            <p className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: "#2563eb" }}>
              Kullanım Koşulları
            </p>
            <h1 className="text-4xl font-bold tracking-tight mb-4" style={{ color: "#0f172a" }}>
              Kullanım Koşulları
            </h1>
            <p className="text-sm" style={{ color: "#94a3b8" }}>Son güncelleme: {lastUpdated}</p>
            <p className="text-base mt-4 leading-relaxed" style={{ color: "#475569" }}>
              Yaverim platformunu kullanarak aşağıdaki koşulları kabul etmiş sayılırsınız.
              Lütfen dikkatlice okuyun.
            </p>
          </div>

          <div className="flex flex-col gap-8">
            {SECTIONS.map(s => (
              <div
                key={s.title}
                className="p-6 rounded-2xl"
                style={{ border: "1px solid #e2e8f0" }}
              >
                <h2 className="font-semibold mb-3" style={{ color: "#0f172a" }}>{s.title}</h2>
                <p className="text-sm leading-relaxed" style={{ color: "#475569" }}>{s.content}</p>
              </div>
            ))}
          </div>

          <div
            className="mt-12 p-6 rounded-2xl"
            style={{ backgroundColor: "#f8fafc", border: "1px solid #e2e8f0" }}
          >
            <p className="text-sm" style={{ color: "#475569" }}>
              Bu koşullar hakkında sorularınız için{" "}
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
