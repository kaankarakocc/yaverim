/**
 * Diagnosis text templates.
 *
 * Provides contextual, personalized diagnosis strings for the results page.
 * Layer 3 of the recommendation engine (explanation layer — no LLM yet).
 *
 * Key format: `${userType}+${primaryGoal}`
 * Falls back to userType-only, then to the universal default.
 */

import type { UserType, SolutionArea } from "@/lib/recommendation/types";

export interface DiagnosisText {
  /** Short headline shown in DiagnosisCard */
  short: string;
  /** Longer contextual explanation below the headline */
  details: string;
}

type DiagnosisMap = Partial<Record<string, DiagnosisText>>;

const TEMPLATES: DiagnosisMap = {
  /* ── Freelancer ──────────────────────────────────────────────────────── */
  "freelancer+content": {
    short: "Serbest çalışan biri olarak içerik üretimini hızlandırmak istiyorsun.",
    details:
      "İçerik üretiminin hızı ve kalitesi, freelancer gelirini doğrudan etkiliyor. Doğru araçla daha kısa sürede daha kaliteli çıktı üretir, daha fazla müşteriye hizmet verebilirsin. Ücretsiz ve düşük maliyetli planlar bu aşamada avantajlı — bütçeyi büyüdükçe artırabilirsin.",
  },
  "freelancer+seo": {
    short: "Serbest çalışan biri olarak SEO görünürlüğünü artırmak istiyorsun.",
    details:
      "SEO, freelancer için en sürdürülebilir müşteri kazanma kanallarından biri. Doğru araçlar araştırma sürecini hızlandırır, içerik optimizasyonunu kolaylaştırır ve rekabetçi kalmanı sağlar.",
  },
  "freelancer+development": {
    short: "Yazılım geliştirme sürecini hızlandırmak isteyen bir freelancer'sın.",
    details:
      "Geliştirici araçları doğru seçildiğinde saatlik çıktını ciddi ölçüde artırabilir. Kod tamamlama, hata ayıklama ve dokümantasyon — hepsi hızlanabilir. Aylık $10–20 yatırım günde 1–2 saat kazandırabiliyor.",
  },
  "freelancer+design": {
    short: "Tasarım üretimini hızlandırmak isteyen bir freelancer'sın.",
    details:
      "Görsel üretim araçları, müşteri projelerindeki revizyon süreçlerini kısaltır ve ölçekli üretim yapmanı sağlar. Maliyet/kalite dengesi kritik — başlangıçta ücretsiz seçeneklere bak.",
  },
  "freelancer+advertising": {
    short: "Serbest çalışan biri olarak müşteri reklamlarını daha verimli yönetmek istiyorsun.",
    details:
      "Reklam kreatifleri ve metin üretiminde AI araçları hem hız hem kalite katkısı sağlar. Müşteri başına harcanan süreyi düşürmek kar marjını doğrudan artırır.",
  },
  "freelancer+operations": {
    short: "İş operasyonlarını daha verimli hale getirmek isteyen bir freelancer'sın.",
    details:
      "Otomasyon araçları tekrarlayan işleri devralır — fatura, takip, organizasyon. Freelancer olarak zamanın en değerli kaynağın; bunları geri kazanmak büyüme için kritik.",
  },

  /* ── Individual ──────────────────────────────────────────────────────── */
  "individual+content": {
    short: "Bireysel olarak içerik üretiminde AI'dan destek almak istiyorsun.",
    details:
      "Kişisel marka, blog, sosyal medya veya herhangi bir içerik projesinde AI araçları hem hız hem kalite katkısı sağlar. Ücretsiz başlayıp ihtiyaca göre büyütmek mümkün.",
  },
  "individual+development": {
    short: "Kod yazmayı öğreniyor ya da küçük projeler geliştiriyorsun.",
    details:
      "AI kod araçları öğrenme sürecini hızlandırıyor ve takılınan noktalarda yardımcı oluyor. Başlangıç seviyesi için sıfır ya da çok düşük maliyet ile güçlü araçlar mevcut.",
  },
  "individual+seo": {
    short: "Bireysel içerik veya projen için arama görünürlüğünü artırmak istiyorsun.",
    details:
      "Kişisel blog veya projen için SEO araçları organik büyümenin en sürdürülebilir yolu. Ücretsiz veya düşük maliyetli araçlarla başlamak bu aşamada en makul yaklaşım.",
  },
  "individual+design": {
    short: "Tasarım bilgisi olmadan profesyonel görsel üretmek istiyorsun.",
    details:
      "AI görsel araçları tasarımcı olmayan herkese güçlü sonuçlar üretme imkânı tanıyor. Ücretsiz veya çok düşük maliyetle başlamak mümkün.",
  },

  /* ── Founder ─────────────────────────────────────────────────────────── */
  "founder+advertising": {
    short: "Markanın büyümesi için reklam performansını artırmak istiyorsun.",
    details:
      "Küçük ekiple yüksek reklam etkisi hedefliyorsun. Doğru araçlar kreatif üretimini hızlandırır, A/B testini kolaylaştırır ve bütçeyi daha verimli kullanmanı sağlar.",
  },
  "founder+content": {
    short: "Marka içeriğini sistematik hale getirmek isteyen bir kurucusun.",
    details:
      "İçerik pazarlaması büyüyen markalarda organik büyümenin en güçlü aracı. Tutarlı, kaliteli içerik üretimi için AI araçları ekip kapasitesini ölçeklendirir.",
  },
  "founder+ecommerce": {
    short: "E-ticaret satışlarını artırmak isteyen bir işletme sahibisin.",
    details:
      "Ürün sayfaları, reklam kreatifleri ve kampanya içerikleri — tümünde AI araçları dönüşüm oranını artırmak için kullanılabilir. Müşteri desteği otomasyonu da önemli zaman ve maliyet tasarrufu sağlıyor.",
  },
  "founder+seo": {
    short: "Marka görünürlüğünü artırmak ve organik trafik kurmak istiyorsun.",
    details:
      "Organik büyüme reklam maliyetini azaltır ve sürdürülebilir kanallar kurar. SEO araçları doğru anahtar kelimelere odaklanmanı ve rakipten öğrenmeni sağlar.",
  },
  "founder+operations": {
    short: "Ekip operasyonunu verimli hale getirmek isteyen bir kurucusun.",
    details:
      "Otomasyon ve süreç yönetimi araçları küçük ekiple büyük iş yapmanı sağlar. Tekrarlayan görevleri otomatize etmek, ekibin asıl işe odaklanmasına imkân tanır.",
  },
  "founder+revenue": {
    short: "Satışları ve geliri artırmak isteyen bir kurucusun.",
    details:
      "Gelir artırma hem satış süreçlerini hızlandırmayı hem müşteri kazanma maliyetini düşürmeyi kapsar. AI araçları satış metninden müşteri iletişimine kadar geniş bir alanda yardımcı olur.",
  },
  "founder+development": {
    short: "Teknik ürün geliştirme sürecini hızlandırmak isteyen bir kurucusun.",
    details:
      "Geliştirme araçları teknik borcun birikmesini önler, hızlı iterasyonu mümkün kılar ve küçük ekiple büyük çıktı üretmeyi sağlar.",
  },

  /* ── Team ────────────────────────────────────────────────────────────── */
  "team+operations": {
    short: "Ekip operasyonunu sistematize etmek ve otomatize etmek istiyorsunuz.",
    details:
      "Ekipler büyüdükçe koordinasyon ve tekrarlayan işler verimliliği düşürür. Otomasyon ve entegrasyon araçları bu friksiyon noktalarını ortadan kaldırır ve ekip kapasitesini artırır.",
  },
  "team+content": {
    short: "Ekip olarak içerik üretimini ölçeklendirmek istiyorsunuz.",
    details:
      "İçerik üretimini ölçeklendirmek için iş akışı, şablon ve marka sesi tutarlılığı kritik. AI araçları bu süreçlerin tamamını hızlandırır ve standardize eder.",
  },
  "team+advertising": {
    short: "Ekip olarak reklam performansını artırmak istiyorsunuz.",
    details:
      "Reklam yönetiminde kreatif üretim, A/B test ve optimizasyon döngüsü kritik. AI araçları ekip başına üretilen kreatif sayısını ve test hızını önemli ölçüde artırır.",
  },
  "team+development": {
    short: "Yazılım geliştirme süreçlerinizi hızlandırmak istiyorsunuz.",
    details:
      "Kod kalitesi, review süreci ve dokümantasyon — hepsi AI araçlarıyla hızlanabilir. Ekip boyutunda verimlilik artışı bireysel kullanımın çok üzerinde etkide bulunur.",
  },
  "team+customer-support": {
    short: "Müşteri destek operasyonunu otomatize etmek istiyorsunuz.",
    details:
      "Artan müşteri sayısıyla birlikte destek yükü lineer büyür. AI chatbot ve otomasyon araçları bu yükün %50–70'ini insan müdahalesi gerektirmeden çözebilir.",
  },
  "team+ecommerce": {
    short: "E-ticaret satışlarını ekip olarak büyütmek istiyorsunuz.",
    details:
      "E-ticarette içerik, reklam ve müşteri desteği üçlüsü büyümenin motoru. AI araçları bu üç alanda eş zamanlı kapasite artışı sağlar.",
  },

  /* ── Freelancer (ek) ─────────────────────────────────────────────────── */
  "freelancer+customer-support": {
    short: "Müşteri yazışmalarını daha hızlı ve profesyonel yönetmek istiyorsun.",
    details:
      "Freelancer olarak müşteri iletişimi hem zaman alıcı hem kritik. AI araçları tekrarlayan yazışmaları otomatize eder, yanıt kalitesini artırır ve profesyonel imaj sunar. Yılda kaybettiğin zamanı geri kazanabilirsin.",
  },
  "freelancer+ecommerce": {
    short: "Online mağazan için AI araçlarıyla içerik ve operasyon verimliliği istiyorsun.",
    details:
      "Ürün açıklamaları, sosyal medya içerikleri ve müşteri iletişimi — hepsi AI ile otomatize edilebilir. Freelancer olarak zamanını ürüne değil, büyümeye harcamak istiyorsan doğru araç seçimi kritik.",
  },
  "freelancer+revenue": {
    short: "Freelancer gelirini artırmak için AI araçlarına yatırım yapmak istiyorsun.",
    details:
      "Daha fazla müşteri edinmek veya mevcut müşterilere daha fazla değer sunmak için AI araçları hem satış süreçlerini hem hizmet kalitesini yükseltir. İlk adımda ücretsiz planlara bak, değer gördükçe ölçekle.",
  },
  "freelancer+cost-reduction": {
    short: "İş süreçlerini otomatize ederek zaman ve maliyet tasarrufu istiyorsun.",
    details:
      "Freelancer olarak her saat gelir demek. Tekrarlayan iş akışlarını otomasyon araçlarıyla devret — fatura, takip, dosya organizasyonu. Doğru araçlarla ayda birkaç iş günü kazanmak mümkün.",
  },

  /* ── Individual (ek) ─────────────────────────────────────────────────── */
  "individual+advertising": {
    short: "Bireysel içeriklerini veya projeyi tanıtmak için reklam desteği istiyorsun.",
    details:
      "Kişisel marka veya proje tanıtımı için AI reklam araçları metin ve görsel üretimini hızlandırır. Ücretsiz araçlarla başlamak bu aşamada en akıllıca yaklaşım.",
  },
  "individual+operations": {
    short: "Bireysel iş akışlarını düzenlemek ve otomatize etmek istiyorsun.",
    details:
      "Günlük tekrarlayan işleri otomasyon araçlarına devrederek odaklanma zamanını artırabilirsin. Not yönetiminden dosya organizasyonuna kadar birçok alanda ücretsiz AI araçlar var.",
  },
  "individual+customer-support": {
    short: "Bireysel projen veya hizmetin için müşteri/kullanıcı iletişimini düzenlemek istiyorsun.",
    details:
      "Müşteri yazışmalarını standartize etmek ve hızlandırmak için AI araçlar küçük çaplı projeler için bile büyük değer sağlar. Ücretsiz planla başla.",
  },
  "individual+revenue": {
    short: "Ek gelir veya kişisel proje geliri için AI araçlarından destek istiyorsun.",
    details:
      "AI araçları içerik üretimi, satış metni ve müşteri iletişimi gibi gelir arttırıcı aktivitelerde hız ve kalite katkısı sağlar. Ücretsiz planlarla bile anlamlı sonuç almak mümkün.",
  },
  "individual+ecommerce": {
    short: "Kişisel online mağazan için AI araçlarıyla daha verimli çalışmak istiyorsun.",
    details:
      "Ürün açıklamaları, sosyal medya içerikleri ve müşteri mesajları — AI araçlarla bu işleri otomatize etmek başlangıç maliyetini ve zamanını önemli ölçüde düşürür.",
  },
  "individual+cost-reduction": {
    short: "Bireysel giderlerini azaltmak veya araç sayısını optimize etmek istiyorsun.",
    details:
      "Birden fazla araç yerine tek bir AI asistan birçok ihtiyacı karşılayabilir. Ücretsiz planlarla başlayıp gerçekten değer gördüğün tek araca yatırım yapmak en akıllıca yaklaşım.",
  },

  /* ── Founder (ek) ────────────────────────────────────────────────────── */
  "founder+customer-support": {
    short: "Büyüyen markan için müşteri destek süreçlerini otomatize etmek istiyorsun.",
    details:
      "Müşteri sayısı arttıkça destek yükü lineer büyür — insan gücüyle karşılamak giderek zorlaşır. AI chatbot ve otomasyon araçları bu yükün büyük bölümünü devreder, ekibini asıl değer yaratıcı işlere yönlendirir.",
  },
  "founder+design": {
    short: "Marka kimliğini ve görsel içeriği AI araçlarıyla güçlendirmek istiyorsun.",
    details:
      "Tasarımcı olmadan profesyonel görsel üretmek artık mümkün. Sosyal medya, reklam ve marka görselleri için AI tasarım araçları küçük ekiple büyük estetik çıktı üretmeni sağlar.",
  },
  "founder+cost-reduction": {
    short: "Operasyon maliyetlerini düşürmek ve süreçleri otomatize etmek istiyorsun.",
    details:
      "Otomasyon araçları tekrarlayan iş akışlarını devralır — müşteri bildirimleri, raporlama, dosya yönetimi. Küçük ekiple büyük iş çıkarmak için altyapı yatırımı en yüksek ROI'lu adımdır.",
  },

  /* ── Team (ek) ───────────────────────────────────────────────────────── */
  "team+seo": {
    short: "Ekip olarak organik büyüme kanalınızı sistematik hale getirmek istiyorsunuz.",
    details:
      "SEO ekip boyutunda içerik üretimi, anahtar kelime stratejisi ve teknik optimizasyonu koordine etmeyi gerektirir. AI araçları araştırma, içerik optimizasyonu ve rakip izlemeyi hızlandırarak ekip kapasitesini artırır.",
  },
  "team+design": {
    short: "Marka görsel üretimini ekip olarak ölçeklendirmek istiyorsunuz.",
    details:
      "Tutarlı marka görselleri üretmek için ekip içinde ortak araçlar ve şablonlar kritik. AI tasarım araçları yoğun talepleri karşılamayı ve marka tutarlılığını korumayı kolaylaştırır.",
  },
  "team+revenue": {
    short: "Satış ve gelir artırma süreçlerini ekip olarak güçlendirmek istiyorsunuz.",
    details:
      "Gelir artırma operasyonları satış yazışmasından müşteri segmentasyonuna uzanır. AI araçları bu sürecin her aşamasını hızlandırır ve ekip üretkenliğini artırır.",
  },
  "team+cost-reduction": {
    short: "Operasyon maliyetlerini ekip boyutunda düşürmek istiyorsunuz.",
    details:
      "Ekipte tekrarlayan süreçler ölçeklendiğinde maliyet etkisi katlanır. Otomasyon ve AI araçları bu yükü otomatize ederek hem maliyet hem zaman tasarrufu sağlar — ve ekibin asıl işe odaklanmasını mümkün kılar.",
  },

  /* ── Cross-goal fallbacks ─────────────────────────────────────────────── */
  "freelancer": {
    short: "Freelancer olarak AI araçlarıyla verimini artırmak istiyorsun.",
    details:
      "Doğru araç seçimi freelancer olarak daha az zamanda daha fazla iş yapmanı sağlar. Önce ücretsiz seçenekleri dene, değer gördükçe ücretli planlara geç.",
  },
  "individual": {
    short: "Bireysel olarak AI araçlarından destek almak istiyorsun.",
    details:
      "AI araçları artık pahalı değil — çoğu araçta güçlü ücretsiz planlar var. Neye ihtiyaç duyduğunu belirleyip tek bir araçta derinleşmek en verimli başlangıç.",
  },
  "founder": {
    short: "Markanı AI araçlarıyla büyütmek isteyen bir kurucusun.",
    details:
      "Küçük ekiple büyük iş çıkarmak için AI araçları artık zorunluluk. Doğru araçlar seçildiğinde aylık birkaç yüz dolar yatırım ekip kapasiteni 2–3 katına çıkarabilir.",
  },
  "team": {
    short: "AI araçlarıyla ekip verimliliğinizi artırmak istiyorsunuz.",
    details:
      "Ekip boyutunda AI benimsemesi bireysel kullanımın çok üzerinde getiri sağlar. Ortak araç, şablon ve iş akışları oluşturmak ekip verimliliğini standartize eder.",
  },
};

const DEFAULT: DiagnosisText = {
  short: "Sana en uygun AI araçlarını bulmak için analizini tamamladık.",
  details:
    "Bağlamına ve hedeflerine göre seçilmiş araçlar aşağıda. Her öneri, kullanıcı tipin, bütçen ve hedef alanlarına göre filtrelenmiş ve skorlanmıştır.",
};

export function getDiagnosis(
  userType: UserType,
  primaryGoal: SolutionArea
): DiagnosisText {
  return (
    TEMPLATES[`${userType}+${primaryGoal}`] ??
    TEMPLATES[userType] ??
    DEFAULT
  );
}
