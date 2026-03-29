import type { Metadata } from "next";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "Güven İlkeleri | Yaverim",
  description: "Yaverim'in editoryal bağımsızlık, şeffaflık ve kullanıcı güveni taahhütleri.",
};

const PRINCIPLES = [
  {
    number: "01",
    title: "Sıralama bağımsızdır",
    body: "Araçların listede yer alması veya sıralanması hiçbir zaman ödeme, sponsor anlaşması veya ortaklık gelirine bağlı değildir. Sıralama yalnızca composite skor metodolojimize göre belirlenir: uygunluk, kolaylık, fiyat-değer oranı, verimlilik ve büyüme potansiyeli.",
  },
  {
    number: "02",
    title: "Referral geliri şeffaf olarak belirtilir",
    body: "Bazı araç linkleri, kullanıcı o araçla kayıt olduğunda bize küçük bir komisyon sağlayan referral linkleri içerebilir. Bu durum her zaman sayfada açıkça belirtilir. Referral komisyonu bir aracı öne çıkarmaz veya geride bırakmaz.",
  },
  {
    number: "03",
    title: "Sponsorluklar etiketlenir",
    body: "Gelecekte sponsorlu içerik yayınlanırsa, bu içerik her zaman açık bir 'Sponsorlu' etiketi taşır. Sponsorlu araçlar organik sonuçların üstünde gösterileceğinde bu durum kullanıcıya bildirilir.",
  },
  {
    number: "04",
    title: "Veriniz satılmaz",
    body: "Analiz sırasında paylaştığınız bilgiler (kullanıcı tipi, hedefler, bütçe) yalnızca size özel öneri oluşturmak için kullanılır. Bu veriler hiçbir üçüncü tarafla satılmaz veya paylaşılmaz.",
  },
  {
    number: "05",
    title: "Araçlar gerçek kriterlere göre değerlendirilir",
    body: "Listedeki her araç belirlenmiş kriterlerle değerlendirilir: Türkçe destek, fiyatlandırma modeli, teknik zorluk seviyesi, hedef kitleye uygunluk ve gerçek kullanıcı geri bildirimleri bu kriterlerin başında gelir.",
  },
  {
    number: "06",
    title: "Öneri bağımsız bir kaynaktan gelir",
    body: "Yaverim bir araç üreticisi değildir. Platformdaki hiçbir araca sahip değiliz. Bu bağımsızlık, tavsiyelerimizin belirli bir ürünü koruma kaygısı taşımamasını sağlar.",
  },
];

export default function TrustPage() {
  return (
    <>
      <Navbar />
      <main className="flex flex-col flex-1 bg-white">
        <div className="max-w-3xl mx-auto px-6 py-16 md:py-24">

          {/* Header */}
          <div className="mb-14">
            <p className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: "#2563eb" }}>
              Güven İlkeleri
            </p>
            <h1 className="text-4xl font-bold tracking-tight mb-6" style={{ color: "#0f172a" }}>
              Editoryal bağımsızlık taahhüdümüz
            </h1>
            <p className="text-lg leading-relaxed" style={{ color: "#475569" }}>
              Yaverim'i kullanırken bilmeniz gereken: hangi araçların size önerildiğini,
              nasıl sıralandığını ve gelirimizi nasıl elde ettiğimizi her zaman şeffaf
              biçimde paylaşırız.
            </p>
          </div>

          {/* Principles */}
          <div className="flex flex-col gap-8 mb-14">
            {PRINCIPLES.map(p => (
              <div
                key={p.number}
                className="flex gap-6 p-6 rounded-2xl"
                style={{ border: "1px solid #e2e8f0" }}
              >
                <span
                  className="flex-shrink-0 text-2xl font-black"
                  style={{ color: "#e2e8f0" }}
                >
                  {p.number}
                </span>
                <div>
                  <h2 className="font-semibold mb-2" style={{ color: "#0f172a" }}>{p.title}</h2>
                  <p className="text-sm leading-relaxed" style={{ color: "#475569" }}>{p.body}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Questions */}
          <div className="p-8 rounded-2xl" style={{ backgroundColor: "#f8fafc", border: "1px solid #e2e8f0" }}>
            <h2 className="font-semibold mb-2" style={{ color: "#0f172a" }}>Bir sorunuz var mı?</h2>
            <p className="text-sm mb-4" style={{ color: "#475569" }}>
              Güven ilkeleri veya editoryal bağımsızlık hakkında herhangi bir sorunuz varsa
              bize yazabilirsiniz.
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm transition-opacity hover:opacity-90"
              style={{ backgroundColor: "#0f172a", color: "#ffffff" }}
            >
              İletişime geç →
            </Link>
          </div>

        </div>
      </main>
      <Footer />
    </>
  );
}
