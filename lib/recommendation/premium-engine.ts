/**
 * Premium plan generator.
 *
 * Produces a structured, contextual action plan from user context.
 * Architecture stub — hot-swappable with a real AI/DB backend in Sprint 4+.
 * Each stage satisfies all master-prompt requirements:
 *   amaç · neden bu sırada · araçlar · uygulama adımları
 *   dikkat edilmesi gerekenler · aşama geçiş kriterleri
 */

import {
  parseParams,
  USER_TYPE_LABELS,
  GOAL_LABELS,
  TEAM_LABELS,
  BUDGET_LABELS,
  type ParsedParams,
} from "./mock-engine";

/* ─── Public types ───────────────────────────────────────────────────────── */

export interface PremiumStageTool {
  slug: string;
  name: string;
  role: string;
  hasFree: boolean;
  pricingLabel: string;
}

export interface PremiumStage {
  number: number;
  title: string;
  /** One-line purpose shown in the collapsed header */
  tagline: string;
  purpose: string;
  whyNow: string;
  /** Exactly what the user will have when this stage is complete — concrete, specific. */
  endState: string;
  /** Fastest path to tangible progress — do this in 15 minutes to get started. */
  quickStart: string;
  tools: PremiumStageTool[];
  steps: string[];
  warnings: string[];
  exitCriteria: string[];
}

export type PriorityLevel = "critical" | "high" | "medium";

export interface PriorityItem {
  label: string;
  priority: PriorityLevel;
  reason: string;
}

export type ImpactLevel = "high" | "medium";

export interface EffectItem {
  area: string;
  impact: ImpactLevel;
  estimate: string;
  description: string;
}

export interface PlanSummaryData {
  headline: string;
  keyInsight: string;
  criticalFirstStep: string;
  timeToFirstResult: string;
  totalStages: number;
}

export interface PremiumPlan {
  contextLabel: string;
  summary: PlanSummaryData;
  priorityMap: PriorityItem[];
  stages: PremiumStage[];
  effectSummary: EffectItem[];
  whatIsExpected: string[];
}

/* ─── Plan templates ────────────────────────────────────────────────────── */

type PlanTemplate = Omit<PremiumPlan, "contextLabel">;

/* ── freelancer + content ── */
const PLAN_FREELANCER_CONTENT: PlanTemplate = {
  summary: {
    headline: "İçerik üretimini sisteme oturt, sonra hızlandır.",
    keyInsight:
      "En büyük kazanım tek tek içerik üretmek değil — yeniden kullanılabilir bir sistem kurmak. Bunu erken yapmak her şeyi kolaylaştırır.",
    criticalFirstStep: "Marka sesi kılavuzu oluştur ve prompt şablonlarını hazırla.",
    timeToFirstResult: "İlk somut fark 2–3 hafta içinde hissedilir.",
    totalStages: 3,
  },
  priorityMap: [
    { label: "Araç Kurulumu",          priority: "critical", reason: "Strateji ve araçlar olmadan üretim sürdürülebilir değil." },
    { label: "Üretim Sistemi",         priority: "critical", reason: "Sistemsiz üretim zamanla yorgunluk ve tutarsızlık yaratır." },
    { label: "Format Çeşitlendirme",   priority: "high",     reason: "Tek format riski azaltmak ve erişimi artırmak için genişletilmeli." },
  ],
  stages: [
    {
      number: 1,
      title: "Araçları Seç, Marka Sesini Kur",
      tagline: "Araçları kur, marka sesini tanımla, prompt şablonlarını hazırla.",
      purpose:
        "Doğru araçları seç ve kur, marka sesini netleştir, yeniden kullanılabilir prompt şablonları oluştur.",
      whyNow:
        "Sisteme koyduğun her şey buna dayanacak. Temel sağlam olmazsa sonraki aşamalar verimli çalışmaz. Araç değiştirmek ilerleyen aşamalarda çok daha maliyetlidir.",
      endState:
        "3 içerik türü için test edilmiş prompt şablonları, tamamlanmış marka sesi kılavuzu ve 4 haftalık içerik takvimi sende hazır.",
      quickStart:
        "ChatGPT'yi aç. Kendi sektörünle ilgili 3 sosyal medya gönderisi yaz ve en doğal hissettiren çıktının prompt'unu kaydet. Süre: 15 dakika.",
      tools: [
        { slug: "chatgpt",   name: "ChatGPT",   role: "Ana içerik üretim aracı",         hasFree: true,  pricingLabel: "Ücretsiz · Plus $20/ay"        },
        { slug: "claude",    name: "Claude",    role: "Uzun form içerik ve marka sesi",   hasFree: true,  pricingLabel: "Ücretsiz · Pro $20/ay"          },
        { slug: "notion-ai", name: "Notion AI", role: "İçerik takvimi ve organizasyon",   hasFree: false, pricingLabel: "$8/ay (Plus planı ile birlikte)" },
      ],
      steps: [
        "ChatGPT ve Claude hesaplarını aç; her ikisini 1'er gün test et, hangisi sana daha iyi uyduğunu not et.",
        "Marka sesi kılavuzu oluştur: hedef kitle, kullandığın ton, yasaklı ifadeler, örnek iyi/kötü cümleler.",
        "Her içerik türü için en az 1 temel prompt şablonu yaz (blog, sosyal medya, e-posta).",
        "Notion'da içerik takvimi şablonu kur: başlık, format, durum, yayın tarihi alanları.",
        "İlk 2 haftalık içerik planını takvime işle.",
      ],
      warnings: [
        "Marka sesi kılavuzu yazmadan üretime geçmek — her içerik farklı tonda çıkar, okuyucu güven kuramaz.",
        "Çok fazla araca aynı anda başlamak dikkat dağıtır; önce 1–2 araçla derinleş.",
        "Prompt şablonlarını 'daha sonra' bırakmak — bu adımı atlamak gelecekte saatler kaybettirir.",
      ],
      exitCriteria: [
        "En az 3 farklı içerik türü için prompt şablonu hazır ve test edilmiş.",
        "Marka sesi kılavuzu dokümanı tamamlanmış ve erişilebilir bir yerde.",
        "4 haftalık içerik takvimi doldurulmuş (başlıklar planlanmış).",
      ],
    },
    {
      number: 2,
      title: "Tekrarlanabilir Üretim Rutini Kur",
      tagline: "İçerik üretimini tekrarlanabilir bir rutine dönüştür.",
      purpose:
        "Haftalık üretim döngüsünü oturtmak, kalite kontrol adımlarını yerleştirmek ve ilk içerik stoğunu oluşturmak.",
      whyNow:
        "Araçlar hazır, şimdi onları düzenli ve verimli kullanmayı öğrenme zamanı. Bu aşama olmadan 1. aşama havada kalır.",
      endState:
        "Haftalık üretim rutini 3 haftadır uygulanıyor, içerik başına ortalama süre ölçülmüş, en az 12 içerik üretilmiş ve 6'sı yayında.",
      quickStart:
        "3 içerik başlığı yaz ve haftalık çalışma saatini takvine ekle. Rutin 'yarın'dan değil, bugünden başlar. Süre: 10 dakika.",
      tools: [
        { slug: "chatgpt",  name: "ChatGPT",  role: "Hızlı taslak ve varyasyon üretimi",     hasFree: true, pricingLabel: "Ücretsiz · Plus $20/ay" },
        { slug: "claude",   name: "Claude",   role: "Uzun içerik ve gözden geçirme",           hasFree: true, pricingLabel: "Ücretsiz · Pro $20/ay"  },
        { slug: "grammarly", name: "Grammarly", role: "Dilbilgisi ve ton kalite kontrolü",    hasFree: true, pricingLabel: "Ücretsiz · Premium $12/ay" },
      ],
      steps: [
        "Haftalık üretim rutini belirle: hangi gün, kaç saat, kaç içerik hedefi.",
        "Her içerik için 3 aşamalı süreç kur: AI taslağı → kendi düzenleme → Grammarly kontrolü.",
        "İlk 4 haftalık içerik paketini bu sistemi kullanarak üret.",
        "Her içerik için üretim süresini kaydet — 4. hafta sonunda ortalamayı hesapla.",
        "En az 2 içeriği takipçi veya güvendiğin birine göster, geri bildirim al.",
      ],
      warnings: [
        "AI çıktısını sıfır düzenlemeyle yayınlamak — okunabilir ama samimiyetsiz çıktılar marka güvenini aşındırır.",
        "Rutin kurmadan 'ilham gelince üretirim' demek — tutarsız üretim takipçi kaybettirir.",
        "Kalite kontrol adımını (Grammarly, kendi okuma) atlamak — küçük hatalar birikir, profesyonellik algısı düşer.",
      ],
      exitCriteria: [
        "Haftalık üretim rutini en az 3 hafta uygulanmış.",
        "İçerik başına ortalama süre ölçülmüş ve kaydedilmiş.",
        "En az 12 içerik üretilmiş, en az 6'sı yayınlanmış.",
        "İçerik kalitesi için geri bildirim alınmış ve notlar çıkarılmış.",
      ],
    },
    {
      number: 3,
      title: "Kapasiteyi Artır, Yeni Formatlara Yay",
      tagline: "Kapasiteyi artır, farklı formatlara yay, sistemi güncelle.",
      purpose:
        "Mevcut içerik üretimini yeni formatlara uyarlamak, aylık hacmi artırmak ve sistemi ilk 3 aylık veriye göre optimize etmek.",
      whyNow:
        "Temel sistem oturdu ve ilk veriler var. Şimdi genişlemek daha az riskli ve daha hızlı sonuç veriyor.",
      endState:
        "En az 2 aktif içerik formatı çalışıyor, aylık üretim hacmin %50+ artmış ve ilk 3 aylık analiz raporu hazır.",
      quickStart:
        "Son 2 ayın en iyi performanslı içeriğini al. Bu içeriği 2 farklı formata (ses clip + kısa video script) uyarlamak için Claude'a ver. Süre: 20 dakika.",
      tools: [
        { slug: "claude",      name: "Claude",      role: "Uzun form ve varyasyon üretimi",  hasFree: true,  pricingLabel: "Ücretsiz · Pro $20/ay"         },
        { slug: "elevenlabs",  name: "ElevenLabs",  role: "Ses içeriği ve podcast seslendirme", hasFree: true, pricingLabel: "Ücretsiz (10k karakter) · Starter $5/ay" },
        { slug: "descript",    name: "Descript",    role: "Video içerik üretimi",            hasFree: true,  pricingLabel: "Ücretsiz · Creator $15/ay"     },
      ],
      steps: [
        "İlk 2 aydaki en iyi performanslı 5 içeriği belirle, neden iyi performans aldığını analiz et.",
        "Bu 5 içeriği farklı formatlara uyarla: blog → sosyal medya → ses (veya video) klibi.",
        "ElevenLabs ile ilk ses denemesini yap — podcast formatı veya kısa audio snippet.",
        "Aylık içerik hedefini %30 artır ve takibe al.",
        "3. ay sonunda tüm sistemi gözden geçir: araçlar, şablonlar, rutin — neyi değiştirmek gerekiyor?",
      ],
      warnings: [
        "Çok fazla formata aynı anda yayılmak — önce 1 yeni format ekle, otur, sonra diğerine geç.",
        "Büyüme için kaliteyi feda etmek — hacim artışı kalite düşüşüyle geliyorsa dur ve düzelт.",
        "Sistemi hiç güncellememe — 3 ayda bir gözden geçirmek ve adapte olmak gerekir.",
      ],
      exitCriteria: [
        "En az 2 farklı içerik formatı aktif ve düzenli üretilen.",
        "Aylık içerik hacmi, 1. aya kıyasla en az %50 artmış.",
        "İlk 3 aylık analiz raporu hazırlanmış ve bir sonraki dönem için hedefler belirlenmiş.",
      ],
    },
  ],
  effectSummary: [
    { area: "İçerik üretim hızı",     impact: "high",   estimate: "+200–300%",      description: "Prompt şablonları ve AI yardımıyla içerik başına süre önemli ölçüde düşer." },
    { area: "Marka sesi tutarlılığı", impact: "high",   estimate: "Yüksek artış",   description: "Kılavuz ve şablonlar sayesinde her içerik aynı tonda çıkar." },
    { area: "Haftalık kazanılan süre", impact: "high",  estimate: "4–8 saat/hafta", description: "Daha hızlı üretim, editörel yorgunluğu azaltır." },
    { area: "İçerik çeşitliliği",     impact: "medium", estimate: "2–3x format",    description: "Mevcut içerik farklı formatlara uyarlanarak erişim alanı genişler." },
  ],
  whatIsExpected: [
    "Haftalık en az 2–3 saat içerik üretim sürecine ayrılacak zaman.",
    "İlk 2 haftada araç kurulumu ve şablon oluşturma için yoğun başlangıç çabası.",
    "AI çıktılarını körce kabul etmemek — her zaman kendi sesini kattığından emin ol.",
    "İlk 4 haftada mükemmel sonuç beklememek; öğrenme eğrisi var.",
    "3. ay sonunda sistemi gözden geçirme ve ihtiyaca göre güncelleme sorumluluğu.",
  ],
};

/* ── founder + advertising ── */
const PLAN_FOUNDER_ADVERTISING: PlanTemplate = {
  summary: {
    headline: "Önce mesajı sabitle, sonra reklamı ölçekle.",
    keyInsight:
      "Çoğu küçük marka reklamda para yakar çünkü mesaj henüz net değildir. En yüksek ROI önce değer önerisini sabitlemeye yatırılır.",
    criticalFirstStep: "Hedef müşteri profili ve marka mesajı netleştirilmeden reklam başlatma.",
    timeToFirstResult: "İlk anlamlı reklam verisi 3–4 haftada gelir.",
    totalStages: 4,
  },
  priorityMap: [
    { label: "Mesaj Netliği",       priority: "critical", reason: "Zayıf mesajla yapılan reklam bütçe yakar, sonuç vermez." },
    { label: "Kreatif Motor",       priority: "critical", reason: "Sürekli yeni kreatif üretebilmek ölçeklemenin temelidir." },
    { label: "Kampanya Yapısı",     priority: "high",     reason: "Doğru yapı olmadan test ve optimizasyon verimli yapılamaz." },
    { label: "Veri ve Optimizasyon",priority: "high",     reason: "Veriye dayalı karar olmadan reklam bütçesi körü körüne harcanır." },
  ],
  stages: [
    {
      number: 1,
      title: "Mesajını Sabitle, Müşterini Tanımla",
      tagline: "Değer önerisini sabitle, hedef müşteriyi tanımla.",
      purpose: "Net bir marka mesajı ve hedef müşteri profili oluşturmak — reklam metninin temeli.",
      whyNow: "Yanlış mesajla doğru hedef kitleye ulaşsan bile sonuç vermez. Bu adım atlanırsa diğer tüm aşamalar zarar görür.",
      endState:
        "Hedef müşteri profili dokümanı, test edilmiş 3 değer önerisi ve tüm reklamlar için kullanacağın onaylı ana mesaj hazır.",
      quickStart:
        "ChatGPT'de şunu sor: 'Benim [ürün/hizmetin] kullanan biri hayatında hangi 1 sorunu çözüyor? 10 farklı cevap ver, müşteri dilini kullan.' Gelen dili not al.",
      tools: [
        { slug: "chatgpt", name: "ChatGPT", role: "Değer önerisi ve mesaj geliştirme",  hasFree: true, pricingLabel: "Ücretsiz · Plus $20/ay" },
        { slug: "perplexity", name: "Perplexity AI", role: "Rakip analizi ve pazar araştırması", hasFree: true, pricingLabel: "Ücretsiz · Pro $20/ay" },
        { slug: "claude", name: "Claude", role: "Müşteri empati haritası ve mesaj testi", hasFree: true, pricingLabel: "Ücretsiz · Pro $20/ay" },
      ],
      steps: [
        "Perplexity ile rakip analizi yap: rakiplerin reklam mesajları nasıl, hangi vaatleri var?",
        "ChatGPT'ye şunu sor: 'Benim ürünümü kullanan biri hayatının hangi sorununu çözdü?' — 10 cevap iste.",
        "Claude ile hedef müşteri profili oluştur: demografik, psikografik, en büyük acısı, en büyük arzusu.",
        "Bu verilerden en güçlü 3 değer önerisi yaz ve test et (yakın çevrene göster).",
        "Kazanan mesajı tüm reklam içerikleri için ana çerçeve olarak belirle.",
      ],
      warnings: [
        "Kendi ürününü tanımlarken müşterinin dilini değil kendi dilini kullanmak — mesaj yanlış rezonans kurar.",
        "Rakip analizi yapmadan mesaj geliştirmek — farkındasız olarak rakiplerle aynı şeyi söylemek riske giriyor.",
      ],
      exitCriteria: [
        "Hedef müşteri profili dokümanı hazır.",
        "En az 3 farklı değer önerisi test edilmiş.",
        "Kazanan ana mesaj belirlenmiş ve ekip/danışmanla onaylanmış.",
      ],
    },
    {
      number: 2,
      title: "AI ile Sürekli Reklam Kreatifleri Üret",
      tagline: "AI ile sürekli ve hızlı reklam kreatifleri üret.",
      purpose: "Reklam metni ve görseli üretim sürecini sistematik hale getirmek; farklı format ve varyasyonları hızlıca üretebilmek.",
      whyNow: "Mesaj hazır, şimdi onu reklamlara dönüştürmek gerekiyor. Kreatif üretimi yavaş olan markalar ölçeklenemez.",
      endState:
        "İlk reklam seti hazır: en az 5 reklam, 2+ metin varyasyonu ve belgelenmiş kreatif üretim şablonu.",
      quickStart:
        "ChatGPT'e şunu ver: '[Ana mesajın] için 3 farklı reklam hook'u yaz: soru, iddia ve rakam/istatistik formatında.' İlk varyasyonları gör. Süre: 15 dakika.",
      tools: [
        { slug: "copy-ai",    name: "Copy.ai",      role: "Reklam metni üretimi",              hasFree: true,  pricingLabel: "Ücretsiz · Pro $36/ay"  },
        { slug: "adcreative", name: "AdCreative.ai", role: "Reklam görsel üretimi",             hasFree: false, pricingLabel: "$21/ay başlangıç"       },
        { slug: "midjourney", name: "Midjourney",    role: "Atmosfer ve konsept görseller",     hasFree: false, pricingLabel: "$10/ay başlangıç"       },
      ],
      steps: [
        "Copy.ai ile belirlenmiş mesaj için 5 farklı reklam metni varyasyonu yaz (kısa/uzun, soru/ifade).",
        "Her metin için en az 2 farklı hook (ilk cümle / görsel başlığı) geliştir.",
        "Adcreative.ai veya Midjourney ile 3–5 farklı görsel konsept üret.",
        "Metinler ve görselleri eşleştirerek ilk kreatif setini (5–8 reklam) oluştur.",
        "Kreatif üretim şablonunu belgeye kaydet: bu şablonu her kampanya için tekrar kullan.",
      ],
      warnings: [
        "Görsel kalitesi ne kadar iyi olursa olsun, hook zayıfsa reklam çalışmaz — metne en az görsel kadar zaman ayır.",
        "Tek varyasyonla kampanyaya gitmek — A/B test için en az 2–3 varyasyon şart.",
      ],
      exitCriteria: [
        "İlk reklam seti hazır: en az 5 reklam, en az 2 metin varyasyonu.",
        "Kreatif üretim şablonu belgelenmiş.",
        "Her reklam görseli için metin eşleştirilmiş.",
      ],
    },
    {
      number: 3,
      title: "Kampanyayı Doğru Yapıyla Başlat",
      tagline: "Sistematik kampanya kur, test için doğru yapıyı oluştur.",
      purpose: "İlk kampanyayı doğru yapıyla başlatmak; bütçe yönetimi, hedefleme ve ölçüm altyapısını kurmak.",
      whyNow: "Kreatifler hazır, artık canlıya geçme zamanı. Ama yapı doğru olmalı — yanlış yapıyla başlamak optimize etmeyi güçleştirir.",
      endState:
        "Kampanya canlıda, dönüşüm takibi kurulu, ilk raporlama tamamlandı. A/B test yapısı aktif ve veri akıyor.",
      quickStart:
        "Pixel/Tag kurulumunu kontrol et. Kurulu değilse bugün kur — bu adım atlanırsa ilk haftanın verisi kaybolur. Süre: 30 dakika.",
      tools: [
        { slug: "chatgpt", name: "ChatGPT", role: "Kampanya strateji ve hedefleme tavsiyesi", hasFree: true, pricingLabel: "Ücretsiz · Plus $20/ay" },
        { slug: "perplexity", name: "Perplexity AI", role: "Hedef kitle ve rakip araştırması", hasFree: true, pricingLabel: "Ücretsiz · Pro $20/ay" },
      ],
      steps: [
        "Kampanya hedefini netleştir: farkındalık mı, trafik mi, dönüşüm mü?",
        "Başlangıç bütçesini belirle ve günlük harcama limitini ayarla.",
        "Hedef kitleyi platforma göre tanımla (Meta Audiences / Google Keywords).",
        "A/B test yapısını kur: 1 kampanya, 2 reklam seti (farklı hedefleme), her sette 2–3 kreatif.",
        "Dönüşüm takibi için Pixel/Tag kurulumunu tamamla veya doğrula.",
      ],
      warnings: [
        "Dönüşüm takibi olmadan reklam başlatmak — neyin işe yaradığını bilemezsin.",
        "Çok küçük bütçeyle çok fazla reklam seti açmak — bölünmüş bütçe anlamlı veri üretmez.",
      ],
      exitCriteria: [
        "Kampanya canlıda ve en az 5 gün çalışıyor.",
        "Dönüşüm takibi doğrulanmış.",
        "İlk raporlama yapılmış (click rate, CPM, ilk dönüşümler).",
      ],
    },
    {
      number: 4,
      title: "Verileri Oku, Kazananları Ölçekle",
      tagline: "Veriye göre düzenle, kazananları ölçekle.",
      purpose: "Kampanya verilerini okumak, düşük performanslıları kesmek, kazananları büyütmek.",
      whyNow: "İlk veriler geldi. Şimdi iterasyon zamanı. Bu döngü süresiz devam eder — ama yapısını şimdi kur.",
      endState:
        "4+ haftalık optimizasyon döngüsü uygulandı, kazanan kreatif-hedefleme kombinasyonu belirlendi, ROAS ≥ 1.5 veya CPA hedef altında.",
      quickStart:
        "Kampanya verilerini aç. CTR %1'in altındaki reklamları işaretle ve bugün duraklatma kararını ver. Bütçeyi iyi performanslılara kaydır. Süre: 15 dakika.",
      tools: [
        { slug: "adcreative", name: "AdCreative.ai", role: "Yeni kreatif varyasyonları",         hasFree: false, pricingLabel: "$21/ay başlangıç" },
        { slug: "chatgpt",    name: "ChatGPT",       role: "Veri yorumlama ve strateji tavsiyesi", hasFree: true, pricingLabel: "Ücretsiz · Plus $20/ay" },
      ],
      steps: [
        "7 günde bir kampanya raporunu incele: CTR, CPC, ROAS, dönüşüm.",
        "CTR %1 altındaki reklamları durdur; ROAS pozitif olanların bütçesini artır.",
        "Her hafta en az 1 yeni kreatif varyasyonu ekle.",
        "2 haftada bir kazanan mesaj ve görseli belirle, yeni varyantlar üret.",
        "Aylık strateji değerlendirmesi: hangi hedefleme, mesaj, format daha iyi çalışıyor?",
      ],
      warnings: [
        "İlk 3–5 günde panikleyip kampanyayı durdurmak — yeterli veri gelmeden karar vermek hatalıdır.",
        "Optimizasyon yaparken çok fazla değişkeni aynı anda değiştirmek — neyin işe yaradığını anlayamazsın.",
      ],
      exitCriteria: [
        "En az 4 haftalık optimizasyon döngüsü uygulanmış.",
        "ROAS ≥ 1.5 veya CPA hedef maliyetin altında.",
        "Kazanan kreatif ve hedefleme kombinasyonu belirlenmiş ve ölçeklenmeye hazır.",
      ],
    },
  ],
  effectSummary: [
    { area: "Reklam bütçesi verimliliği", impact: "high",   estimate: "+40–80% ROAS",     description: "Net mesaj ve A/B test döngüsüyle aynı bütçe daha fazla dönüşüm getirir." },
    { area: "Kreatif üretim hızı",        impact: "high",   estimate: "5x daha hızlı",    description: "AI araçları ile 1 günde yapılan iş 2 saate iner." },
    { area: "Karar alma kalitesi",        impact: "high",   estimate: "Veriye dayalı",     description: "Sezgiyle değil, platfor verisiyle karar alma alışkanlığı kazanılır." },
    { area: "Marka mesaj tutarlılığı",    impact: "medium", estimate: "Yüksek artış",      description: "Tüm reklamlarda aynı güçlü mesaj, marka algısını güçlendirir." },
  ],
  whatIsExpected: [
    "Reklam platformuna haftalık en az 30 dakika zaman ayırmak.",
    "İlk 4 haftada bütçenin bir kısmının 'öğrenme maliyeti' olabileceğini kabul etmek.",
    "Veri okuma ve yorumlama için temel platform metriklerini (CTR, ROAS, CPA) öğrenmek.",
    "Her hafta en az 1 yeni kreatif varyasyonu üretmek için zaman ayırmak.",
    "Kampanya ilk 7 günde sonuç vermese panikleyip değil, veri toplamaya devam etmek.",
  ],
};

/* ── team + operations ── */
const PLAN_TEAM_OPERATIONS: PlanTemplate = {
  summary: {
    headline: "Hangi süreçlerin otomatize edileceğini önce haritala.",
    keyInsight:
      "Çoğu ekip neyin otomatize edilebileceğini bilmeden araç satın alır. Haritalama önce yapılırsa yatırım çok daha verimli olur.",
    criticalFirstStep: "Tekrarlayan iş akışlarını belirle ve önceliklendir.",
    timeToFirstResult: "İlk otomasyon somut verimlilik farkı 3–6 haftada hissedilir.",
    totalStages: 4,
  },
  priorityMap: [
    { label: "Süreç Haritalama",   priority: "critical", reason: "Harita olmadan otomasyon doğru yere uygulanamaz." },
    { label: "Otomasyon Temeli",   priority: "critical", reason: "Tekrarlayan manüel işler en yüksek zaman kaybıdır." },
    { label: "Araç Entegrasyonu",  priority: "high",     reason: "Araçlar birbirine bağlanmadan ekip verimliliği sınırlı kalır." },
    { label: "Ölçüm Sistemi",      priority: "medium",   reason: "Veriye dayalı iyileştirme için ölçüm şart." },
  ],
  stages: [
    {
      number: 1,
      title: "Tekrarlayan İşleri Haritala, Önceliklendir",
      tagline: "Tekrarlayan iş akışlarını belirle ve önceliklendir.",
      purpose: "Ekipteki tüm tekrarlayan iş akışlarını tespit etmek, en fazla zaman ve enerji harcananları önceliklendirmek.",
      whyNow: "Neyi otomatize edeceğini bilmeden araç almak kaynak israfıdır. Haritalama aşaması tüm plan için yol gösterici olur.",
      endState:
        "Ekipte haftalık en çok zaman harcanan 3 süreç belirlenmiş, haftalık saat maliyetleri hesaplanmış ve dokümente edilmiş.",
      quickStart:
        "Ekip üyelerine bugün tek soru sor: 'Bu hafta seni en çok yoran ve sık tekrarlayan 3 iş nedir?' Cevapları topla. Süre: 1 gün.",
      tools: [
        { slug: "notion-ai", name: "Notion AI", role: "Süreç dokümantasyonu ve haritalama", hasFree: false, pricingLabel: "$8/ay (Plus planı ile)" },
        { slug: "chatgpt",   name: "ChatGPT",   role: "Süreç analizi ve önceliklendirme",   hasFree: true,  pricingLabel: "Ücretsiz · Plus $20/ay" },
      ],
      steps: [
        "Ekipteki her rolden 'günlük/haftalık en çok zaman harcadığın 5 iş' listesi al.",
        "Listeleri birleştir; tekrar eden, otomatize edilebilir adımları işaretle.",
        "Her tekrarlayan iş için süre × sıklık hesabı yap (haftalık toplam saat).",
        "En yüksek toplam saate sahip 3 süreci otomatizasyon için seç.",
        "Her seçilen süreç için Notion'da basit süreç dokümanı oluştur: adımlar, girdi, çıktı, sahip.",
      ],
      warnings: [
        "Karmaşık veya istisnalı süreçlerle başlamak — en basit ve tekrarlayan işlerden başla.",
        "Haritalamayı sadece yönetim perspektifinden yapmak — en iyi veriyi sahada çalışanlar verir.",
      ],
      exitCriteria: [
        "Tüm tekrarlayan iş akışları listesi hazır.",
        "Top 3 otomasyon adayı seçilmiş ve dokümente edilmiş.",
        "Her süreç için haftalık zaman maliyeti hesaplanmış.",
      ],
    },
    {
      number: 2,
      title: "En Yüksek Maliyetli 3 Süreci Otomatize Et",
      tagline: "En yüksek zaman maliyetli 3 süreci otomatize et.",
      purpose: "Haritalama sonucu belirlenen öncelikli 3 süreci Zapier veya Make ile otomatize etmek.",
      whyNow: "Harita hazır, en değerli adımları uygulamak için en iyi an şimdi. Ertelemek manuel iş yükünü sürdürür.",
      endState:
        "En az 3 otomasyon aktif ve 2 haftadır hatasız çalışıyor. Kazanılan haftalık saat hesaplanmış.",
      quickStart:
        "Zapier'e gir ve 'Form dolduruldu → Slack bildir' akışını kur. En basit otomasyon bu. 20 dakikada test et ve çalıştığını gör.",
      tools: [
        { slug: "zapier", name: "Zapier", role: "İş akışı otomasyonu (6000+ uygulama)",  hasFree: true, pricingLabel: "Ücretsiz (5 Zap) · Starter $20/ay" },
        { slug: "make",   name: "Make",   role: "Görsel otomasyon (karmaşık akışlar için)", hasFree: true, pricingLabel: "Ücretsiz (1k ops) · Core $9/ay" },
      ],
      steps: [
        "Zapier veya Make hesabı aç; hangisinin arayüzü sana daha uygun geliyorsa onu seç.",
        "En basit süreçten başla: 1 tetikleyici + 1 aksiyon formatındaki akışı kur ve test et.",
        "İlk otomasyon 3 gün başarıyla çalıştıktan sonra 2. sürece geç.",
        "3. süreci de aynı yaklaşımla kur; daha karmaşıksa Make tercih et.",
        "Her otomasyon için hata durumu (fallback) belirle: akış çalışmazsa kim uyarılacak?",
      ],
      warnings: [
        "İlk günden en karmaşık süreci otomatize etmeye çalışmak — basit başarılar motivasyonu ve öğrenmeyi hızlandırır.",
        "Test etmeden canlıya almak — her akışı en az 5 kez test et ve sonucu doğrula.",
        "Fallback mekanizması koymamak — otomasyon bozulduğunda iş durmamalı.",
      ],
      exitCriteria: [
        "En az 3 otomasyon aktif ve en az 2 haftadır hatasız çalışıyor.",
        "Her otomasyonun hata bildirim mekanizması kurulu.",
        "Kazanılan haftalık saat hesaplanmış ve kaydedilmiş.",
      ],
    },
    {
      number: 3,
      title: "Araçları Birbirine Bağla, Veri Silolarını Kır",
      tagline: "Araçları birbirine bağla, veri silolarını kır.",
      purpose: "Ekipte kullanılan araçları birbirine bağlamak; veri manüel taşımayı sıfırlamak, bilgi akışını sürekli kılmak.",
      whyNow: "Otomasyon temel kuruldu. Araçlar bağlanmadan ekibin verimi sınırlı kalır; silolar devam eder.",
      endState:
        "Kritik araçlar arası manüel veri transferi sıfırlanmış, Notion merkezi bilgi tabanı ekip tarafından aktif kullanılıyor.",
      quickStart:
        "Ekibinizde 'bunu şuraya taşımam lazım' denen en sık işlemi bul ve Zapier'de 3 adımlı bir akış kur. Süre: 1 saat.",
      tools: [
        { slug: "notion-ai", name: "Notion AI", role: "Merkezi bilgi tabanı ve ekip dokümantasyonu", hasFree: false, pricingLabel: "$8/ay (Plus planı ile)" },
        { slug: "zapier",    name: "Zapier",    role: "Araçlar arası veri köprüsü",               hasFree: true,  pricingLabel: "Ücretsiz · Starter $20/ay" },
        { slug: "make",      name: "Make",      role: "Çok adımlı entegrasyon akışları",           hasFree: true,  pricingLabel: "Ücretsiz · Core $9/ay"   },
      ],
      steps: [
        "Ekipte kullanılan tüm araçları listele (proje yönetimi, iletişim, CRM, analitik).",
        "Hangi araçlar arası veri transferi en sık yapılıyor? Bunları işaretle.",
        "Her kritik veri transferini otomatize et (örn: form dolu → CRM'e kayıt → Slack bildirimi).",
        "Notion'da merkezi bilgi tabanı kur: süreç dokümanları, onboarding, sıkça sorulan sorular.",
        "Entegrasyon haritasını görselleştir ve ekiple paylaş; herkes hangi aracın neyle bağlı olduğunu bilmeli.",
      ],
      warnings: [
        "Kullanılmayan araçları entegrasyona dahil etmek — önce araç konsolidasyonu, sonra entegrasyon.",
        "Merkezi bilgi tabanını 'daha sonra dolduracağım' demek — bu adım atlanırsa onboarding ve süreç aktarımı acı verir.",
      ],
      exitCriteria: [
        "Kritik araçlar arası manüel veri transferi sıfırlanmış.",
        "Merkezi Notion bilgi tabanı temel içerikle dolu ve ekip aktif kullanıyor.",
        "Entegrasyon haritası ekiple paylaşılmış.",
      ],
    },
    {
      number: 4,
      title: "Verimliliği Ölç, Sistemi Güncel Tut",
      tagline: "Verimliliği ölç, sistemi her 4 haftada güncelle.",
      purpose: "Operasyonel iyileşmeyi ölçmek, darboğazları erken tespit etmek ve sistemi sürekli güncel tutmak.",
      whyNow: "Sistem çalışıyor. Ölçüm yapılmadan iyileştirme kör olur; kazanımlar kaybolmaya başlar.",
      endState:
        "Haftalık metrik panosu aktif, en az 2 retro toplantısı tamamlanmış ve 6 aylık değerlendirme planlanmış.",
      quickStart:
        "Notion'da 4 sütunlu tablo aç: Tarih | Kazanılan saat | Aktif otomasyon | Not. Bu hafta ilk kaydı yap. Süre: 10 dakika.",
      tools: [
        { slug: "notion-ai", name: "Notion AI", role: "Verimlilik panosu ve haftalık raporlama", hasFree: false, pricingLabel: "$8/ay (Plus planı ile)" },
        { slug: "chatgpt",   name: "ChatGPT",   role: "Veri yorumlama ve iyileştirme önerileri",  hasFree: true,  pricingLabel: "Ücretsiz · Plus $20/ay" },
      ],
      steps: [
        "Haftalık operasyonel metrik panosu kur: kazanılan saat, hata sayısı, tamamlanan görev sayısı.",
        "Her 4 haftada 30 dakikalık 'retro' toplantısı yap: ne iyi gidiyor, ne kötü, ne değişmeli?",
        "Bozulan veya verimsizleşen otomasyonları tespit et ve düzelt.",
        "Yeni tekrarlayan işler ortaya çıktıkça otomatize et — haritayı canlı tut.",
        "6. ayda tüm sistemi baştan değerlendir: hangi araçları bırakacaksın, hangilerini genişleteceksin?",
      ],
      warnings: [
        "Ölçüm sistemini kurup kullanmamak — panolar güncellenmezse değersizleşir.",
        "Küçük hataları görmezden gelmek — birikmiş küçük aksaklıklar büyük operasyonel sorun yaratır.",
      ],
      exitCriteria: [
        "Haftalık metrik panosu aktif ve en az 4 haftadır kullanılıyor.",
        "En az 2 retro toplantısı yapılmış, çıktıları Notion'a kaydedilmiş.",
        "6 aylık operasyonel verimlilik değerlendirmesi planlanmış.",
      ],
    },
  ],
  effectSummary: [
    { area: "Manüel iş yükü",        impact: "high",   estimate: "-%30–50",          description: "Tekrarlayan işlerin otomatize edilmesiyle ekip asıl işe odaklanır." },
    { area: "Ekip verimliliği",      impact: "high",   estimate: "+20–40%",          description: "Araç entegrasyonu ve otomasyonla ekip kapasitesi artar." },
    { area: "Hata oranı",            impact: "high",   estimate: "Belirgin düşüş",   description: "Manüel veri transferi azalınca insan hatası da azalır." },
    { area: "Süreç standartizasyonu",impact: "medium", estimate: "Yüksek artış",     description: "Belgelenmiş ve otomatize edilmiş süreçler kolayca aktarılır." },
  ],
  whatIsExpected: [
    "Ekibin değişime açık olması — otomasyon ilk aşamada ekstra öğrenme gerektirir.",
    "İlk 4 haftada kurulum için kişi başı haftalık 2–3 saat yatırım.",
    "Hata olduğunda paniklemek yerine sistemi incelemek ve düzeltmek.",
    "Süreç dokümanlarını güncel tutmak — bu tek seferlik bir iş değil, sürekli bakım gerektirir.",
    "Her 4 haftada retro yapmak ve sistemi iyileştirmeye devam etmek.",
  ],
};

/* ── default fallback ── */
const PLAN_DEFAULT: PlanTemplate = {
  summary: {
    headline: "Doğru araçları seç, sistemi kur, sonra ölçekle.",
    keyInsight: "Araç seçimi kadar araçları nasıl kullandığın önemli. Sistem olmadan en iyi araç bile yetersiz kalır.",
    criticalFirstStep: "Birincil hedef için en kritik aracı belirle ve derin bir şekilde öğren.",
    timeToFirstResult: "İlk somut iyileşme 2–4 hafta içinde gözlemlenir.",
    totalStages: 3,
  },
  priorityMap: [
    { label: "Araç Seçimi ve Kurulum", priority: "critical", reason: "Yanlış araçla başlamak zaman ve para kaybettirir." },
    { label: "İş Akışı Oluşturma",    priority: "critical", reason: "Araçların sisteme entegrasyonu olmadan verimlilik sınırlı kalır." },
    { label: "Optimizasyon",          priority: "high",     reason: "İlk veriler olmadan optimize etmek mümkün değil." },
  ],
  stages: [
    {
      number: 1,
      title: "Hedefine Uygun Aracı Seç, Derine In",
      tagline: "Birincil hedefe göre araçları seç ve kur.",
      purpose: "Hedefin için en uygun araçları belirlemek, ücretsiz ve ücretli seçenekleri test etmek.",
      whyNow: "Yanlış araçla başlamak hem zamanı hem de parayı harcatır. Önce seçim, sonra derinleşme.",
      endState:
        "Birincil araç seçilmiş, 1 haftalık aktif kullanım tamamlanmış ve hangi özelliklerini kullandığın not edilmiş.",
      quickStart:
        "Önerilen ilk aracı aç. 'Ben [sektörün/rolün] birisiyim. Bu araçla başlamak için 5 dakikalık bir ısınma görevi ver.' Görevi yap. Süre: 15 dakika.",
      tools: [
        { slug: "chatgpt",   name: "ChatGPT",    role: "Genel amaçlı asistan",       hasFree: true,  pricingLabel: "Ücretsiz · Plus $20/ay" },
        { slug: "perplexity", name: "Perplexity", role: "Araştırma ve bilgi arama",   hasFree: true,  pricingLabel: "Ücretsiz · Pro $20/ay"  },
        { slug: "notion-ai", name: "Notion AI",  role: "Organizasyon ve planlama",    hasFree: false, pricingLabel: "$8/ay (Plus planı ile)" },
      ],
      steps: [
        "Mevcut çalışma sürecini yazıya dök: hangi adımları en çok zaman alıyor?",
        "Bu öneri listesindeki araçları ücretsiz planlarla 3'er gün test et.",
        "Hangisi sana en doğal hissettirdi? O aracı ana araç olarak belirle.",
        "Seçilen aracın temel özelliklerini öğrenmek için 2 saatlik öğrenme seansı planla.",
        "İlk iş akışını bu araçla manuel olarak 1 hafta uygula.",
      ],
      warnings: [
        "Çok fazla araç aynı anda denemek — odak dağılır, hiçbirini gerçekten öğrenemezsin.",
        "Test etmeden ücretli plana geçmek — ücretsiz plan çoğu zaman başlamak için yeterli.",
      ],
      exitCriteria: [
        "Birincil araç seçilmiş ve 1 haftalık aktif kullanım tamamlanmış.",
        "Temel iş akışı bu araçla uygulanmış.",
        "Aracın hangi özelliklerini kullandığın, hangilerini henüz kullanmadığın not edilmiş.",
      ],
    },
    {
      number: 2,
      title: "Araçları Günlük Rutine Oturt",
      tagline: "Araçları düzenli kullanım rutinine oturt.",
      purpose: "Seçilen araçları düzenli, tekrarlanabilir bir iş akışına entegre etmek.",
      whyNow: "Araçlar seçildi, şimdi sistemi kurma zamanı. Sistem olmadan araçlar tek seferlik yardım verir, dönüşüm sağlamaz.",
      endState:
        "4 haftadır düzenli kullanım rutini aktif, 5+ tekrarlayan iş için şablon hazır ve sistemin çalışan yönleri belgelenmiş.",
      quickStart:
        "Bugün aracı aç ve şunu sor: 'Bu haftanın en önemli görevini benim yerime planla.' Çıktıyı düzenle ve kaydet. İşte bu, rutin.",
      tools: [
        { slug: "chatgpt",   name: "ChatGPT",  role: "Birincil asistan",                hasFree: true, pricingLabel: "Ücretsiz · Plus $20/ay" },
        { slug: "notion-ai", name: "Notion AI", role: "Organizasyon ve takip sistemi",  hasFree: false, pricingLabel: "$8/ay (Plus planı ile)" },
      ],
      steps: [
        "Haftalık kullanım rutinini belirle: hangi gün, ne zaman, hangi iş için araç kullanılacak?",
        "Sık yaptığın işler için şablonlar ve prompt'lar hazırla.",
        "Notion'da basit bir iş takip sistemi kur (backlog, yapılıyor, tamamlandı).",
        "İlk 4 hafta bu rutini uygula; ne işe yaramıyor, ne eksik, not al.",
        "4. hafta sonunda sistemi gözden geçir ve güncelle.",
      ],
      warnings: [
        "Şablon ve rutin olmadan 'ihtiyaç olunca kullanırım' demek — bu yaklaşım araçları yetersiz kullandırır.",
        "Sistemi çok karmaşık kurmak — başlangıçta basit ve işlevsel olsun, zamanla geliştirilebilir.",
      ],
      exitCriteria: [
        "4 haftadır düzenli kullanım rutini uygulanıyor.",
        "En az 5 tekrar eden iş için şablon hazır.",
        "Sistemin işe yarayan ve geliştirilmesi gereken yönleri not edilmiş.",
      ],
    },
    {
      number: 3,
      title: "Sistemi Veriye Göre İyileştir, Kapasiteyi Artır",
      tagline: "Sonuçlara göre düzelt, kapasiteyi artır.",
      purpose: "İlk 2 ayın verilerine bakarak sistemi optimize etmek ve kapasiteyi genişletmek.",
      whyNow: "2 ay sonra yeterli veri var. Bu veriye dayanmadan yapılan optimizasyon tahmine dayanır.",
      endState:
        "2 aylık kullanım analizi yapılmış, sistem en az 1 önemli güncellemeyle iyileştirilmiş ve önümüzdeki 3 ay için hedefler netleşmiş.",
      quickStart:
        "Son 1 ayda en çok vakit kazandıran 3 kullanım senaryosunu yaz. Bu senaryoları daha verimli yapmanın 1 yolunu araştır. Süre: 20 dakika.",
      tools: [
        { slug: "chatgpt",   name: "ChatGPT",   role: "Analiz ve optimizasyon önerileri",  hasFree: true, pricingLabel: "Ücretsiz · Plus $20/ay" },
        { slug: "perplexity", name: "Perplexity", role: "Yeni araç araştırması",           hasFree: true, pricingLabel: "Ücretsiz · Pro $20/ay"  },
      ],
      steps: [
        "İlk 2 ayın kullanım verilerini gözden geçir: ne çalıştı, ne çalışmadı?",
        "En çok zaman kazandıran 3 kullanım senaryosunu belirle.",
        "Bu senaryoları daha da verimli hale getirmenin yollarını araştır.",
        "Yeni bir araç veya özellik eklemeyi düşünüyorsan önce gerekliliği test et.",
        "3. ay sonunda bir değerlendirme raporu hazırla ve önümüzdeki 3 ay için hedefler belirle.",
      ],
      warnings: [
        "Veri olmadan değişiklik yapmak — 'sanki işe yaramıyor gibi' hissiyle değil, gerçek veriyle karar ver.",
        "Çalışan bir sistemi gereksiz yere değiştirmek — 'bozuk değilse tamir etme' prensibi geçerli.",
      ],
      exitCriteria: [
        "2 aylık kullanım analizi yapılmış.",
        "Sistem en az 1 önemli iyileştirmeyle güncellenmiş.",
        "Önümüzdeki 3 ay için hedefler belirlenmiş ve kaydedilmiş.",
      ],
    },
  ],
  effectSummary: [
    { area: "Genel verimlilik",    impact: "high",   estimate: "+30–50%",        description: "Sistematik araç kullanımı iş kapasitesini önemli ölçüde artırır." },
    { area: "Karar kalitesi",      impact: "high",   estimate: "Belirgin artış", description: "Doğru araçlarla daha iyi bilgiyle daha hızlı karar alınır." },
    { area: "Zaman tasarrufu",     impact: "medium", estimate: "3–6 saat/hafta", description: "Tekrarlayan işler hızlandığında stratejik işlere daha fazla zaman kalır." },
    { area: "Öğrenme eğrisi",      impact: "medium", estimate: "2–4 hafta",     description: "İlk 2–4 haftadan sonra araçlar rutin haline gelir, çaba azalır." },
  ],
  whatIsExpected: [
    "Araçları öğrenmek için ilk 2 haftada ekstra sabır ve zaman.",
    "Düzenli kullanım için haftalık rutin oluşturmak ve buna sadık kalmak.",
    "Her 4 haftada sistemi gözden geçirmek ve güncelleme yapmak.",
    "AI araçlarının çıktılarını körce kabul etmemek — her zaman kendi değerlendirmeni kat.",
    "Sonuçların hemen gelmesini değil, birikerek büyümesini beklemek.",
  ],
};

/* ─── Template map ───────────────────────────────────────────────────────── */

const TEMPLATES: Record<string, PlanTemplate> = {
  "freelancer+content":    PLAN_FREELANCER_CONTENT,
  "freelancer+seo":        PLAN_FREELANCER_CONTENT,    // close enough
  "individual+content":    PLAN_FREELANCER_CONTENT,
  "founder+advertising":   PLAN_FOUNDER_ADVERTISING,
  "founder+ecommerce":     PLAN_FOUNDER_ADVERTISING,
  "founder+revenue":       PLAN_FOUNDER_ADVERTISING,
  "team+operations":       PLAN_TEAM_OPERATIONS,
  "team+cost-reduction":   PLAN_TEAM_OPERATIONS,
  "founder+operations":    PLAN_TEAM_OPERATIONS,
};

/* ─── Public API ─────────────────────────────────────────────────────────── */

export function generatePremiumPlan(params: ParsedParams): PremiumPlan {
  const { userType, goals, team, budget, biz } = parseParams(params);
  const primaryGoal = goals[0] ?? "content";

  const templateKey = `${userType}+${primaryGoal}`;
  const template = TEMPLATES[templateKey] ?? PLAN_DEFAULT;

  const contextParts: string[] = [USER_TYPE_LABELS[userType]];
  if (goals.length) contextParts.push(goals.slice(0, 2).map((g) => GOAL_LABELS[g]).join(" + "));
  if (biz) contextParts.push(biz);
  contextParts.push(TEAM_LABELS[team]);
  contextParts.push(BUDGET_LABELS[budget]);

  return {
    contextLabel: contextParts.join(" · "),
    ...template,
  };
}
