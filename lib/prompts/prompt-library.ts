/**
 * Ready-to-use prompt library for recommended AI tools.
 * Organized by tool slug — prompts are shown only for tools actually
 * recommended to the user, not generic ChatGPT defaults.
 */

export interface ReadyPrompt {
  id: string;
  toolSlug: string;
  toolName: string;
  category: string;
  title: string;
  description: string;
  prompt: string;
  tags: string[];
}

export interface DayOneTask {
  timeEstimate: string;
  title: string;
  detail: string;
  toolSlug?: string;
  toolName?: string;
  type: "setup" | "learn" | "create" | "connect";
  /** If true, task is for paid plan only — shows free alternative note */
  requiresPaid?: boolean;
  freeAlternative?: string;
}

// ─── Per-tool prompt library ─────────────────────────────────────────────────

const PROMPTS_BY_SLUG: Record<string, ReadyPrompt[]> = {

  chatgpt: [
    {
      id: "chatgpt-brand-voice",
      toolSlug: "chatgpt", toolName: "ChatGPT", category: "Marka Stratejisi",
      title: "Marka sesi kılavuzu",
      description: "Tutarlı iletişim için ton ve dil rehberi oluşturur",
      prompt: `İşletmem için profesyonel bir marka sesi kılavuzu oluştur.

Bağlam:
- Sektör: [sektörünü yaz]
- Hedef kitle: [hedef kitlen]
- Rakiplerimden farkım: [temel farkın]
- Hedeflediğim his: [profesyonel / samimi / cesur / güven veren]

Kılavuzda şunlar olsun:
1. Sesimizin 3 temel özelliği (bullet ile)
2. Kullanılacak kelime/ifade örnekleri (5 adet)
3. Kaçınılacak kelime/ifadeler (5 adet)
4. Sosyal medya için 3 örnek başlık
5. E-posta açılış cümlesi örnekleri (formal ve informal)

Türkçe yaz, sade ve uygulanabilir tut.`,
      tags: ["Marka", "İçerik", "Strateji"],
    },
    {
      id: "chatgpt-content-calendar",
      toolSlug: "chatgpt", toolName: "ChatGPT", category: "İçerik Planlaması",
      title: "30 günlük içerik takvimi",
      description: "Bir aylık sosyal medya ve blog içerik planı",
      prompt: `[İşletme türü] için 30 günlük sosyal medya içerik takvimi oluştur.

Hedef kitle: [kitleni yaz]
Ana hedef: [marka bilinirliği / satış / topluluk]
Platformlar: [Instagram / LinkedIn / X / Blog]

Her gün için:
- İçerik formatı (post / reel / carousel / blog)
- Başlık veya konu
- Ana mesaj (1 cümle)
- CTA (harekete geçirici çağrı)

Ek olarak:
- Haftada 1 kampanya içeriği
- Haftada 1 etkileşim sorusu
- Ayda 1 "perde arkası" içerik

Türkçe, aksiyon odaklı ve platforma özgü yaz.`,
      tags: ["İçerik", "Planlama", "Sosyal Medya"],
    },
    {
      id: "chatgpt-faq-generator",
      toolSlug: "chatgpt", toolName: "ChatGPT", category: "Müşteri İletişimi",
      title: "SSS sayfası oluştur",
      description: "Müşteri soru-cevap sayfası için gerçekçi içerik",
      prompt: `[Ürün/Hizmet] için kapsamlı bir SSS (Sıkça Sorulan Sorular) sayfası yaz.

Hedef kitle: [kitleni yaz]
Ürün/hizmetin özellikleri: [kısaca açıkla]
En çok şikayet aldığım konular: [varsa yaz]

15-20 soru-cevap oluştur. Kategorilere ayır:
1. Genel sorular (3-4 soru)
2. Fiyatlandırma (3-4 soru)
3. Kullanım / kurulum (4-5 soru)
4. Sorun giderme (3-4 soru)
5. İptal / iade (2-3 soru)

Her cevap: kısa, net, güven verici ve arama motoru dostu olsun.
Türkçe, samimi bir ton kullan.`,
      tags: ["Müşteri Desteği", "SEO", "İçerik"],
    },
  ],

  claude: [
    {
      id: "claude-competitor-analysis",
      toolSlug: "claude", toolName: "Claude", category: "Pazar Araştırması",
      title: "Rakip analizi çerçevesi",
      description: "Rakiplerin güçlü/zayıf yanlarını ve pazar boşluklarını ortaya çıkarır",
      prompt: `[Sektör] sektöründe rakip analizi yapıyorum. Sistematik bir çerçeve oluştur.

Analiz edilecek rakipler: [Rakip 1], [Rakip 2], [Rakip 3]

Her rakip için analiz et:
1. Konumlandırma (ne vaat ediyorlar?)
2. Hedef kitle (kimlerle konuşuyorlar?)
3. Fiyatlandırma modeli
4. İçerik stratejisi
5. Güçlü yönleri (3 madde)
6. Zayıf yönleri / fırsatlar (3 madde)

Son olarak:
- Piyasada doldurmamış nişi bul
- Benim için en güçlü farklılaşma açısı nedir?
- Onları geçmek için 3 somut hamle öner

Analitik ve nesnel tut.`,
      tags: ["Strateji", "Rekabet", "Araştırma"],
    },
    {
      id: "claude-landing-page",
      toolSlug: "claude", toolName: "Claude", category: "Dönüşüm Metni",
      title: "Açılış sayfası metni",
      description: "Problem-çözüm-CTA yapısında yüksek dönüşümlü metin",
      prompt: `[Ürün/Hizmet adı] için açılış sayfası metni yaz.

Hedef kitle: [kitleni tanımla]
Ana problem: [müşterinin yaşadığı sorun]
Çözümüm: [ne sunuyorsun]
Kanıtım: [sosyal kanıt veya rakamlar]
Ana CTA: [ücretsiz dene / satın al / demo al]

Sayfa yapısı:
1. Hero başlık (problem odaklı, max 10 kelime)
2. Alt başlık (çözümü netleştiren, 1-2 cümle)
3. 3 temel fayda (bullet, sonuç diliyle)
4. Sosyal kanıt bölümü şablonu
5. Özellikler (fayda diliyle, 3-5 madde)
6. İtiraz karşılama (3 sık itiraz + yanıt)
7. CTA metni + garanti cümlesi

Türkçe, sade, hype içermeyen yaz.`,
      tags: ["Dönüşüm", "Metin", "Satış"],
    },
    {
      id: "claude-email-sequence",
      toolSlug: "claude", toolName: "Claude", category: "E-posta Pazarlama",
      title: "5 e-postalık hoş geldin serisi",
      description: "Yeni aboneleri müşteriye dönüştüren seri",
      prompt: `[Ürün/Hizmet] için 5 e-postalık hoş geldin e-posta serisi yaz.

Marka tonu: [samimi / profesyonel / eğlenceli]
Ana hedef: [ürün deneme / satın alma / topluluk]

Her e-posta için:
- Konu satırı (A/B için 2 seçenek)
- Önizleme metni
- Açılış cümlesi
- Ana mesaj (max 200 kelime)
- Net bir CTA

E-posta 1: Karşılama + beklentiler
E-posta 2: En değerli içerik/kaynak
E-posta 3: Başarı hikayesi / sosyal kanıt
E-posta 4: SSS / itirazlar
E-posta 5: Özel teklif veya sonraki adım

Türkçe, kişisel ve dürüst bir ton. Spam hissi verme.`,
      tags: ["E-posta", "Dönüşüm", "Otomasyon"],
    },
  ],

  gemini: [
    {
      id: "gemini-research",
      toolSlug: "gemini", toolName: "Gemini", category: "Araştırma",
      title: "Kapsamlı pazar araştırması",
      description: "Sektör trendleri ve fırsatları için veri odaklı analiz",
      prompt: `[Sektör/Konu] için kapsamlı bir pazar araştırması yap.

Araştırma kapsamı:
- Mevcut pazar büyüklüğü ve büyüme trendi
- Öne çıkan 5 oyuncu ve konumlandırmaları
- Son 12 aydaki önemli gelişmeler
- Teknoloji/yapay zeka'nın sektöre etkisi
- Türkiye özelinde durum (varsa)
- 2025-2026 için tahmin ve fırsatlar

Çıktı formatı:
- Her bölüm için kısa özet
- En önemli 3 bulgu (bullet)
- Benim için en kritik fırsat (1 paragraf)
- Kaynakları belirt

Güncel ve doğrulanabilir verilere dayandır.`,
      tags: ["Araştırma", "Strateji", "Pazar"],
    },
    {
      id: "gemini-presentation",
      toolSlug: "gemini", toolName: "Gemini", category: "Sunum",
      title: "Yatırımcı sunumu yapısı",
      description: "Etkileyici pitch deck için slayt yapısı ve içerik",
      prompt: `[Şirket/Proje adı] için yatırımcı sunumu (pitch deck) yapısı oluştur.

İşletmem hakkında:
- Ne yapıyoruz: [kısaca]
- Çözdüğümüz problem: [problem]
- Hedef kitle: [kitle]
- İş modeli: [nasıl para kazanıyoruz]
- Mevcut durum: [kullanıcı sayısı / gelir / büyüme]

10-12 slaytlık yapı:
Her slayt için:
1. Başlık
2. Ana mesaj (1 cümle)
3. İçerik önerileri (bullet)
4. Görsel/veri önerisi

Yatırımcının cevabını isteyeceği sorulara önceden yanıt ver.
Türkçe, net ve ikna edici.`,
      tags: ["Yatırım", "Sunum", "Strateji"],
    },
  ],

  "notion-ai": [
    {
      id: "notion-sop",
      toolSlug: "notion-ai", toolName: "Notion AI", category: "Operasyon",
      title: "Standart operasyon prosedürü (SOP)",
      description: "Tekrarlayan süreçleri belgeleyerek ölçeklenebilir kılar",
      prompt: `[Süreç adı] için SOP (Standart Operasyon Prosedürü) oluştur.

Süreç özeti: [nasıl işliyor]
Kullananlar: [roller]
Sıklık: [günlük / haftalık / proje bazlı]

SOP şunları içersin:
1. Amaç (1 cümle)
2. Ön koşullar (ne hazır olmalı)
3. Adım adım talimatlar (numaralı, net)
4. Kalite kontrol noktaları
5. Sık yapılan hatalar ve önlemleri
6. Tamamlandı kriteri
7. Güncelleme tarihi alanı

Türkçe, anlaşılır, belirsizlik bırakmayan.`,
      tags: ["Operasyon", "Verimlilik", "Takım"],
    },
    {
      id: "notion-weekly-review",
      toolSlug: "notion-ai", toolName: "Notion AI", category: "Üretkenlik",
      title: "Haftalık inceleme şablonu",
      description: "Düzenli ilerleme takibi ve öncelik yönetimi",
      prompt: `Haftalık inceleme ve planlama için Notion şablonu oluştur.

Kullanım bağlamı: [freelancer / ekip lideri / girişimci]
Haftalık hedef sayısı: [kaç hedef takip ediyorum]

Şablon bölümleri:
1. Geçen hafta özeti (3 bölüm)
   - Tamamlananlar ✅
   - Yarım kalanlar 🔄
   - Öğrendiklerim 💡
2. Bu hafta planı
   - 3 kritik hedef
   - Günlük görev bloğu (Pazartesi-Cuma)
   - Ertelenebilir listesi
3. Enerji/odak takibi (basit 1-5 skala)
4. Sonraki haftaya not

Notion block yapısına uygun (başlıklar, toggle, callout) formatla.`,
      tags: ["Üretkenlik", "Planlama", "Takım"],
    },
  ],

  jasper: [
    {
      id: "jasper-ad-copy",
      toolSlug: "jasper", toolName: "Jasper", category: "Reklam Metni",
      title: "Reklam metni varyantları",
      description: "A/B test için çoklu reklam metni üretir",
      prompt: `[Ürün/Hizmet] için Meta ve Google reklam metinleri oluştur.

Hedef kitle: [detaylı kitle tanımı]
Ana fayda: [en güçlü benefit]
Teklif/CTA: [indirim / ücretsiz deneme / demo]
Ton: [aciliyet / merak / fayda odaklı]

Her format için 3 varyant:

META REKLAM (Facebook/Instagram):
- Primary text (125 karakter)
- Başlık (27 karakter)
- Açıklama (27 karakter)

GOOGLE SEARCH ADS:
- Başlık 1 (30 karakter)
- Başlık 2 (30 karakter)
- Başlık 3 (30 karakter)
- Açıklama 1 (90 karakter)

Her varyant farklı bir açıdan yaklaşsın (sosyal kanıt / fayda / aciliyet).
Türkçe yaz.`,
      tags: ["Reklam", "Metin", "A/B Test"],
    },
  ],

  "copy-ai": [
    {
      id: "copy-product-desc",
      toolSlug: "copy-ai", toolName: "Copy.ai", category: "Ürün İçeriği",
      title: "Ürün açıklaması paketi",
      description: "E-ticaret için dönüşüm odaklı ürün metinleri",
      prompt: `[Ürün adı ve kategorisi] için kapsamlı ürün metin paketi oluştur.

Ürün özellikleri: [liste]
Hedef alıcı: [kişi tipi]
Fiyat aralığı: [bütçe seviyesi]
Ana fayda: [en önemli çözüm]

Şunları oluştur:
1. Kısa başlık (E-ticaret, max 60 karakter)
2. Kısa açıklama (Listing, 150-200 kelime)
3. Uzun açıklama (SEO + satış odaklı, 400-500 kelime)
4. Bullet özellikler (5-7 madde, fayda diliyle)
5. Meta title + description (SEO için)
6. Sosyal medya paylaşım metni (Instagram + LinkedIn)

Türkçe, satış odaklı, doğal dil kullan. Keyword: [hedef anahtar kelime].`,
      tags: ["E-Ticaret", "SEO", "Ürün"],
    },
  ],

  midjourney: [
    {
      id: "midjourney-brand-visual",
      toolSlug: "midjourney", toolName: "Midjourney", category: "Marka Görseli",
      title: "Marka kimliği görsel prompt seti",
      description: "Tutarlı marka kimliği için hazır prompt şablonları",
      prompt: `Marka görsel kimliği için Midjourney prompt seti:

ÜRÜN/HİZMET GÖRSELİ:
/imagine prompt: [ürün/hizmet temasını yaz], professional photography, clean minimal background, soft studio lighting, premium commercial quality, sharp focus, 8k --ar 4:5 --v 6.1 --style raw

MARKA KİMLİĞİ:
/imagine prompt: [marka değerini yaz] concept, [renk paleti: ör. navy and cream], modern minimalist, abstract geometric, premium feel, white background --ar 1:1 --v 6.1

SOSYAL MEDYA İÇERİĞİ:
/imagine prompt: [içerik konusu], lifestyle photography, [hedef kitle], authentic candid, warm atmosphere, [platform: Instagram story] aesthetic --ar 9:16 --v 6.1

HERO BANNER:
/imagine prompt: [ana mesaj], wide cinematic, [marka tonu: bold / calm / energetic], professional lighting, brand-appropriate color palette, [marka renklerini yaz] --ar 16:9 --v 6.1

Her promptu kendi bağlamınla doldur. [köşeli parantezleri] değiştir.`,
      tags: ["Görsel", "Marka", "Sosyal Medya"],
    },
  ],

  "dall-e": [
    {
      id: "dalle-product-image",
      toolSlug: "dall-e", toolName: "DALL-E", category: "Ürün Görseli",
      title: "Ürün ve sunum görselleri",
      description: "E-ticaret ve pazarlama için AI görsel üretim promptları",
      prompt: `DALL-E 3 ile ürün ve pazarlama görseli üretmek için hazır promptlar:

ÜRÜN FOTOĞRAFI:
"[Ürün adı] on a clean white background, professional product photography, soft shadows, high-resolution commercial quality, studio lighting"

LIFESTYLE GÖRSEL:
"[Ürün] being used by [hedef kitle], natural setting, authentic lifestyle photography, [mood: warm / professional / playful]"

SOSYAL MEDYA BANNER:
"[Tema/mesaj] promotional banner, [marka renkleri] color palette, modern minimalist design, [boyut: 1080x1080] format"

E-TİCARET İNFOGRAFİK:
"[Ürün] infographic showing [özellik 1, özellik 2, özellik 3], clean flat design, [marka rengin] accent color, white background"

Not: DALL-E 3, ChatGPT Plus içinde kullanılabilir. GPT-4 ile konuşurken "Generate an image:" ile başla.`,
      tags: ["Görsel", "E-Ticaret", "Pazarlama"],
    },
  ],

  canva: [
    {
      id: "canva-brand-kit",
      toolSlug: "canva", toolName: "Canva", category: "Marka Kimliği",
      title: "Brand Kit kurulum rehberi prompt",
      description: "Canva'da tutarlı marka kimliği kurulum adımları",
      prompt: `Canva Brand Kit'imi kurmak için profesyonel rehber hazırla.

İşletmem: [işletme türü ve sektör]
Hedef his: [profesyonel / samimi / yenilikçi / güven veren]
Mevcut renklerim: [varsa yaz, yoksa öner]

Şunları üret:
1. Renk paleti (birincil, ikincil, vurgu — hex kodları ile)
2. Font çifti önerisi (Google Fonts, başlık + metin)
3. Canva Brand Kit kurulum adımları (ekran adım adım)
4. Oluşturulması gereken şablon listesi (öncerik sırasıyla):
   - Instagram post (1080×1080)
   - Instagram story (1080×1920)
   - LinkedIn banner (1584×396)
   - Sunum kapağı (1920×1080)
   - E-posta header (600×200)
5. Tasarım tutarlılığı için 5 kural

Türkçe, uygulanabilir ve sıralı ver.`,
      tags: ["Tasarım", "Marka", "Şablon"],
    },
  ],

  semrush: [
    {
      id: "semrush-seo-audit",
      toolSlug: "semrush", toolName: "SEMrush", category: "SEO Denetimi",
      title: "SEO denetim sonuçları öncelik planı",
      description: "SEMrush bulgularını aksiyon planına dönüştürür",
      prompt: `SEMrush ile [web sitesi] SEO denetimi yaptım. Bulgulara göre öncelikli aksiyon planı oluştur.

Bulgular:
- Teknik hatalar: [hata listesi]
- Eksik meta etiketler: [sayı]
- Kırık bağlantılar: [sayı]
- Site hızı skoru: [puan]
- En zayıf sayfalar: [sayfalar]
- Rakip boşlukları: [boşluklar]

Şunları yap:
1. Her bulguyu "Kritik / Önemli / İyileştirme" sınıfına koy
2. İlk 2 haftada yapılacak 5 aksiyon (tahmini etki ile)
3. Hızlı kazanç (quick win) 3 madde
4. Aylık takip metrikleri
5. İçerik fırsatları (öne çıkan 3 konu)

Türkçe, öncelik sırasıyla sun.`,
      tags: ["SEO", "Teknik", "İçerik"],
    },
  ],

  "surfer-seo": [
    {
      id: "surfer-content-brief",
      toolSlug: "surfer-seo", toolName: "Surfer SEO", category: "İçerik SEO",
      title: "SEO içerik brief şablonu",
      description: "Arama amacına uygun, sıralanabilir içerik brief",
      prompt: `"[hedef anahtar kelime]" için SEO içerik brief hazırla.

Hedef kitle: [kitleni yaz]
Arama amacı: [bilgi / karşılaştırma / satın alma]
Rakip içerikler: [2-3 URL]
Web sitesi: [site URL'si ve konumu]

Brief içeriği:
1. Birincil + LSI anahtar kelimeler (10-15 adet)
2. Önerilen içerik uzunluğu (kelime sayısı)
3. Başlık yapısı (H1, H2, H3 sıralaması)
4. Meta açıklama (2 alternatif, max 155 karakter)
5. Mutlaka ele alınacak konular (rakiplerden iyi olmak için)
6. Arama niyetiyle uyumlu giriş paragrafı örneği
7. İç linkleme önerileri
8. Featured snippet için yapı önerisi

Türkçe, Surfer Content Editor puanını maksimize edecek şekilde düzenle.`,
      tags: ["SEO", "İçerik", "Anahtar Kelime"],
    },
  ],

  ahrefs: [
    {
      id: "ahrefs-keyword-strategy",
      toolSlug: "ahrefs", toolName: "Ahrefs", category: "Anahtar Kelime",
      title: "Anahtar kelime strateji rehberi",
      description: "Ahrefs verilerinden organik büyüme stratejisi üretir",
      prompt: `Ahrefs verilerime göre organik büyüme stratejisi oluştur.

Web sitem: [URL]
Sektörüm: [sektör]
Mevcut domain authority (DR): [puan]
Aylık organik ziyaret: [sayı]
En güçlü rakip: [rakip URL]

Şunları analiz et:
1. Hızlı kazanım fırsatları (Sayfa 2'deki içerikler — düşük asılı meyve)
2. Rakip içerik boşlukları (onlar var, bende yok)
3. Featured snippet fırsatları
4. Backlink hedefleri (DR 30-60 arası, sektörel)
5. İçerik kümesi (topic cluster) önerisi — 3 ana konu

Her öneri için:
- Anahtar kelime hedefi
- Tahmini trafik potansiyeli
- Zorluk seviyesi
- Aksiyon adımı

Türkçe, uygulanabilir bir 90 günlük yol haritası çıkar.`,
      tags: ["SEO", "Backlink", "İçerik Stratejisi"],
    },
  ],

  zapier: [
    {
      id: "zapier-automation-map",
      toolSlug: "zapier", toolName: "Zapier", category: "Otomasyon",
      title: "Otomasyon fırsatları haritası",
      description: "En yüksek ROI'lu otomasyon süreçlerini belirler",
      prompt: `İşletmemde en değerli otomasyon fırsatlarını belirlememe yardım et.

İşletme türü: [tür]
Kullandığım araçlar: [liste]
Ekip: [kişi sayısı]
En çok zaman alan tekrarlayan görevler: [listele]
Aylık bütçe (otomasyon için): [rakam]

Şunları analiz et:
1. En yüksek zaman/maliyet tasarrufu sağlayacak 5 otomasyon
2. Her otomasyon için:
   - Trigger (tetikleyici) + Action (aksiyon)
   - Tahmini haftalık zaman tasarrufu (saat)
   - Kurulum zorluk seviyesi (kolay/orta/zor)
   - Gerekli araçlar
3. Kurulum öncelik sırası (hangisinden başlamalıyım)
4. Veri güvenliği dikkat noktaları
5. Ücretsiz Zapier planıyla yapılabilecekler

Türkçe, hemen uygulanabilir öner.`,
      tags: ["Otomasyon", "Verimlilik", "Entegrasyon"],
    },
  ],

  make: [
    {
      id: "make-workflow",
      toolSlug: "make", toolName: "Make", category: "İş Akışı Otomasyonu",
      title: "Make (Integromat) senaryo tasarımı",
      description: "Karmaşık iş akışlarını görsel olarak tasarlar",
      prompt: `Make (eski adıyla Integromat) ile [iş süreci] için otomasyon senaryosu tasarla.

Süreç tanımı: [ne otomatikleştirmek istiyorsun]
Başlangıç tetikleyicisi: [ne olduğunda başlasın]
Beklenen çıktı: [ne üretsin / nerede sonlansın]
Kullandığım araçlar: [liste]

Senaryo tasarımı:
1. Modül akışı (her adım numaralı)
2. Her modül için:
   - Araç/uygulama adı
   - Aksiyon tipi
   - Veri haritalaması (hangi veri nereye gider)
3. Hata yönetimi (ne yaparsa ne olur)
4. Test etme adımları
5. Make free plan limitleri (her ay 1000 işlem)

Make'in ücretsiz planına göre optimize et. Ücretli gerektirenleri belirt.`,
      tags: ["Otomasyon", "İş Akışı", "Entegrasyon"],
    },
  ],

  "github-copilot": [
    {
      id: "copilot-code-quality",
      toolSlug: "github-copilot", toolName: "GitHub Copilot", category: "Geliştirme",
      title: "Kod kalitesi prompt seti",
      description: "Copilot ile kod inceleme, refactor ve test yazma",
      prompt: `GitHub Copilot Chat için hazır kullanım prompt seti:

KOD AÇIKLAMA:
"Explain this code step by step and identify any potential issues or improvements: [kodu yapıştır]"

REFACTOR:
"Refactor this function for better readability and performance. Follow SOLID principles. Add brief comments for non-obvious logic: [kodu yapıştır]"

TEST YAZMA:
"Write comprehensive unit tests for this function. Include: happy path, edge cases, and error scenarios. Use [test framework adı]: [kodu yapıştır]"

GÜVENLİK DENETİMİ:
"Review this code for security vulnerabilities (injection, XSS, auth bypass, etc.) and suggest fixes with explanations: [kodu yapıştır]"

DOKÜMANTASYON:
"Generate complete JSDoc documentation for this function with @param, @returns, @throws, and a usage example: [kodu yapıştır]"

PERFORMANS:
"Analyze this code for performance bottlenecks. Suggest specific optimizations with Big O complexity analysis: [kodu yapıştır]"

Her promptu Copilot Chat panelinde kullan (Ctrl+I veya yan panel).`,
      tags: ["Geliştirme", "Kod Kalitesi", "Test"],
    },
  ],

  cursor: [
    {
      id: "cursor-ai-workflow",
      toolSlug: "cursor", toolName: "Cursor", category: "AI Geliştirme",
      title: "Cursor ile verimli geliştirme iş akışı",
      description: "Cursor'un AI özelliklerini verimli kullanmak için prompt rehberi",
      prompt: `Cursor IDE'de AI özelliklerini verimli kullanmak için hazır prompt seti:

ÖZELLIK EKLEME (Cmd+K):
"Add [özellik adı] to this component. Requirements: [gereksinimler]. Keep existing code style."

BUG FIX (inline):
"This function has a bug: [hatayı açıkla]. Fix it without changing the function signature or breaking existing tests."

KOD AÇIKLAMA (Chat):
"@codebase I need to understand how [işlev/modül] works. What are the key files, data flow, and important edge cases?"

REFACTOR (Chat):
"Refactor [dosya adı veya kodu yapıştır] to improve maintainability. Prioritize: readability > performance > brevity."

YENİ DOSYA (Cmd+K):
"Create a [dosya türü] for [amaç]. Follow the patterns used in [referans dosya]. Include types, error handling, and tests."

COMPOSER (karmaşık görevler):
"Build [özellik] that does [açıklama]. This should work with [mevcut sistem]. Consider: [kısıtlamalar]."`,
      tags: ["Geliştirme", "AI", "Üretkenlik"],
    },
  ],

  mailchimp: [
    {
      id: "mailchimp-campaign",
      toolSlug: "mailchimp", toolName: "Mailchimp", category: "E-posta Pazarlama",
      title: "E-posta kampanya içerik planı",
      description: "Mailchimp kampanyası için içerik ve konu satırı üretir",
      prompt: `Mailchimp e-posta kampanyası için içerik ve stratejisi oluştur.

Kampanya amacı: [bilgilendirme / promosyon / re-engagement / lansман]
Liste büyüklüğü: [yaklaşık kişi sayısı]
Ortalama açılış oranı: [%]
Hedef kitle segmenti: [yeni / aktif / pasif aboneler]

Kampanya içeriği:
1. Konu satırı (5 alternatif, max 50 karakter)
2. Önizleme metni (5 alternatif, max 90 karakter)
3. E-posta yapısı:
   - Header görseli önerisi
   - Giriş (1-2 cümle, dikkat çekici)
   - Ana mesaj bölümü
   - CTA buton metni (3 alternatif)
   - Footer notu
4. Gönderim zamanlaması önerisi (gün + saat)
5. A/B test için değişken öneri
6. Segmentasyon ipuçları

Türkçe, aboneyi değer sağlayacak şekilde yaz.`,
      tags: ["E-posta", "Kampanya", "Otomasyon"],
    },
  ],

  "shopify-magic": [
    {
      id: "shopify-product-content",
      toolSlug: "shopify-magic", toolName: "Shopify Magic", category: "E-Ticaret",
      title: "Shopify ürün sayfası içerik seti",
      description: "Shopify mağazası için dönüşüm odaklı ürün içerikleri",
      prompt: `Shopify mağazam için [ürün adı] ürün sayfası içerik seti oluştur.

Ürün kategorisi: [kategori]
Hedef alıcı: [kişi tipi]
Fiyat: [fiyat aralığı]
Ana özellikler: [özellik listesi]
Rakip ürünler: [varsa belirt]

Şunları üret:
1. Ürün başlığı (SEO odaklı, max 70 karakter)
2. Kısa açıklama (Shopify özet, 150 kelime)
3. Uzun açıklama (HTML formatında, 400 kelime, fayda odaklı)
4. Bullet özellikler (5-7, fayda diliyle)
5. Meta title + meta description
6. Ürün görseli alt text önerileri (5 adet)
7. Ürün etiketi/tag önerileri (10 adet, SEO için)
8. Cross-sell / upsell önerisi (hangi ürünlerle birlikte göstermeli)

Türkçe, dönüşüm odaklı yaz.`,
      tags: ["E-Ticaret", "Shopify", "SEO"],
    },
  ],

  tidio: [
    {
      id: "tidio-chatbot-flows",
      toolSlug: "tidio", toolName: "Tidio", category: "Müşteri Desteği",
      title: "Chatbot konuşma akışı tasarımı",
      description: "Müşteri sorularını karşılayan chatbot senaryoları",
      prompt: `[İşletme türü] için Tidio chatbot konuşma akışları tasarla.

En sık sorulan sorular: [liste]
Müşteri segmentleri: [yeni ziyaretçi / mevcut müşteri / teknik destek]
Ana dönüşüm hedefi: [satış / lead / destek]

Şu akışları oluştur:

1. KARŞILAMA AKIŞI
- Tetikleyici: [sayfa açıldığında / belirli süre sonra]
- Mesaj sırası (3-4 mesaj)
- Seçenek butonları

2. SSS AKIŞI
[Sık sorulan 5 soru için]:
- Soru → Otomatik yanıt
- Tatmin olmadı → Yönlendirme

3. SATIŞ DESTEĞİ AKIŞI
- Ürün/hizmet hakkında sorular
- Fiyat sorusu → Stratejik yanıt
- Ücretsiz deneme / demo yönlendirme

4. DESTEK AKIŞI
- Sorun tanımlama
- Self-servis çözüm
- İnsan desteğine yönlendirme kriterleri

Türkçe, doğal ve yardımsever bir ton.`,
      tags: ["Chatbot", "Müşteri Desteği", "Dönüşüm"],
    },
  ],
};

// ─── Day 1 task library ───────────────────────────────────────────────────────

export const DAY_ONE_TASKS_BY_SLUG: Record<string, DayOneTask[]> = {
  chatgpt: [
    {
      timeEstimate: "5 dk",
      title: "Hesap oluştur (ücretsiz veya Plus)",
      detail: "chat.openai.com → Sign up. Ücretsiz plan GPT-3.5 verir. Plus ($20/ay) için GPT-4 ve görsel üretim.",
      toolSlug: "chatgpt", toolName: "ChatGPT",
      type: "setup",
      requiresPaid: false,
    },
    {
      timeEstimate: "15 dk",
      title: "Custom Instructions ile işletme bağlamı ekle",
      detail: "Settings → Personalization → Custom Instructions. İşletmen, hedef kitleni ve ton tercihini tanımla. Her sohbette tekrar anlatmak zorunda kalmaz.",
      toolSlug: "chatgpt", toolName: "ChatGPT",
      type: "setup",
    },
    {
      timeEstimate: "10 dk",
      title: "İlk içerik testi: marka sesi prompt şablonu",
      detail: "Hazır Promptlar'daki 'Marka sesi kılavuzu' prompt'unu doldur ve çalıştır. Çıktıyı değerlendir, rafine et.",
      type: "create",
    },
  ],
  claude: [
    {
      timeEstimate: "5 dk",
      title: "Claude hesabı kur",
      detail: "claude.ai → Sign up. Ücretsiz plan Claude Sonnet'e eriştirir. Pro plan ($20/ay) öncelikli erişim ve daha uzun context sunar.",
      toolSlug: "claude", toolName: "Claude",
      type: "setup",
      requiresPaid: false,
      freeAlternative: "Ücretsiz plan çoğu iş için yeterli — önce dene, sonra yükselt.",
    },
    {
      timeEstimate: "20 dk",
      title: "İlk rakip analizi çalıştır",
      detail: "Hazır Promptlar'daki 'Rakip analizi çerçevesi' prompt'unu çalıştır. Sonuçları bir belgeye kaydet.",
      type: "learn",
    },
  ],
  canva: [
    {
      timeEstimate: "10 dk",
      title: "Brand Kit kur (ücretsiz veya Pro)",
      detail: "Canva → Brand Hub → Add Brand Kit. Logo, renk paleti (hex kodları) ve fontları gir. Bu adım olmadan tasarımlar tutarsız çıkar.",
      toolSlug: "canva", toolName: "Canva",
      type: "setup",
      requiresPaid: false,
      freeAlternative: "Ücretsiz Brand Kit 1 kit destekler. Pro'da sınırsız kit ve premium şablonlar var.",
    },
    {
      timeEstimate: "20 dk",
      title: "5 temel şablon oluştur",
      detail: "Instagram post (1080×1080), story (1080×1920), LinkedIn banner, sunum kapağı, e-posta header. Brand Kit'i uygula ve kaydet.",
      type: "create",
    },
  ],
  zapier: [
    {
      timeEstimate: "10 dk",
      title: "Zapier hesabı aç ve araçları bağla",
      detail: "zapier.com → Apps → Connect. En az 2 aracı bağla (örn. form + e-posta). Ücretsiz plan ayda 100 görev destekler.",
      toolSlug: "zapier", toolName: "Zapier",
      type: "setup",
      requiresPaid: false,
      freeAlternative: "Ücretsiz plan 5 Zap, ayda 100 görev. Temel ihtiyaçlar için genellikle yeterli.",
    },
    {
      timeEstimate: "15 dk",
      title: "İlk Zap: Form → E-posta bildirimi",
      detail: "Basit bir Zap kur. Trigger: yeni form gönderimi. Action: Gmail bildirimi. Test et, aç. İlk başarılı otomasyonu görmek motivasyon sağlar.",
      type: "connect",
    },
  ],
  make: [
    {
      timeEstimate: "10 dk",
      title: "Make hesabı oluştur",
      detail: "make.com → Sign up. Ücretsiz plan her ay 1000 işlem destekler. Zapier'dan daha görsel ve karmaşık akışlar için ideal.",
      toolSlug: "make", toolName: "Make",
      type: "setup",
      requiresPaid: false,
      freeAlternative: "Ücretsiz plan çoğu küçük iş akışı için yeterli.",
    },
  ],
  semrush: [
    {
      timeEstimate: "15 dk",
      title: "Web siteni SEMrush'a ekle ve ilk denetimi başlat",
      detail: "semrush.com → Projects → Add New Project → kendi sitenizi girin. Site Audit başlat. 7 günlük ücretsiz deneme Pro özelliklerini açar.",
      toolSlug: "semrush", toolName: "SEMrush",
      type: "setup",
      requiresPaid: true,
      freeAlternative: "Ücretsiz plan günde 10 arama ve sınırlı denetim destekler. Temel anahtar kelime araştırması için yeterli.",
    },
    {
      timeEstimate: "20 dk",
      title: "Rakip analizi: En büyük rakibin sıralamasını gör",
      detail: "Domain Overview → rakip sitenin URL'sini gir. Onların en iyi sayfaları ve anahtar kelimeleri senin içerik fırsatların.",
      type: "learn",
    },
  ],
  "surfer-seo": [
    {
      timeEstimate: "10 dk",
      title: "Surfer SEO hesabı aç",
      detail: "surferseo.com → Sign up. 7 günlük ücretsiz deneme. Content Editor ve SERP Analyzer temel araçlardır.",
      toolSlug: "surfer-seo", toolName: "Surfer SEO",
      type: "setup",
      requiresPaid: true,
      freeAlternative: "Ücretsiz deneme biter bitmez temel SEO için Ahrefs free veya Google Search Console'a geç.",
    },
    {
      timeEstimate: "25 dk",
      title: "Hedef kelime için Content Editor aç",
      detail: "Content Editor → [hedef anahtar kelimeni yaz] → Türkçe seç → Analiz et. Önerilen kelime sayısı, başlık yapısı ve kelime listesi çıkar.",
      type: "create",
    },
  ],
  midjourney: [
    {
      timeEstimate: "10 dk",
      title: "Discord'a katıl ve Midjourney bot ekle",
      detail: "discord.gg/midjourney → Subscribe ($10/ay başlıyor). Discord'da /imagine komutunu kullan. Ücretsiz deneme kaldırıldı.",
      toolSlug: "midjourney", toolName: "Midjourney",
      type: "setup",
      requiresPaid: true,
      freeAlternative: "Ücretsiz alternatif: Adobe Firefly (ücretsiz kota var) veya Microsoft Designer (Bing Image Creator).",
    },
    {
      timeEstimate: "20 dk",
      title: "İlk marka görseli dene",
      detail: "Hazır Promptlar'daki Midjourney şablonunu kullan. /imagine ile başlat. 4 varyant üretir — en iyisini U1-U4 ile upscale et.",
      type: "create",
    },
  ],
  "dall-e": [
    {
      timeEstimate: "5 dk",
      title: "ChatGPT Plus ile DALL-E'ye eriş",
      detail: "DALL-E 3, ChatGPT Plus ($20/ay) içinde ücretsiz gelir. ChatGPT'de 'Generate an image:' ile başla. Ayrıca ayrı üyelik gerekmez.",
      toolSlug: "dall-e", toolName: "DALL-E",
      type: "setup",
      requiresPaid: true,
      freeAlternative: "Ücretsiz alternatif: Bing Image Creator (günlük kota var) veya Adobe Firefly.",
    },
  ],
  "github-copilot": [
    {
      timeEstimate: "10 dk",
      title: "GitHub Copilot aktif et",
      detail: "github.com/features/copilot → Activate. VS Code veya Cursor extension'ı kur. 30 günlük ücretsiz deneme var.",
      toolSlug: "github-copilot", toolName: "GitHub Copilot",
      type: "setup",
      requiresPaid: true,
      freeAlternative: "Ücretsiz alternatif: Cursor'un ücretsiz planı veya Codeium (tamamen ücretsiz, güçlü).",
    },
    {
      timeEstimate: "15 dk",
      title: "İlk Copilot Chat deneyimi",
      detail: "VS Code'da Ctrl+Shift+I ile Copilot Chat'i aç. Mevcut kodunu yapıştır ve 'Explain this code' yaz. Nasıl çalıştığını gör.",
      type: "learn",
    },
  ],
  cursor: [
    {
      timeEstimate: "10 dk",
      title: "Cursor indir ve proje aç",
      detail: "cursor.sh → Download. Ücretsiz plan ayda 50 premium istek destekler. Mevcut VS Code ayarlarını içe aktar.",
      toolSlug: "cursor", toolName: "Cursor",
      type: "setup",
      requiresPaid: false,
      freeAlternative: "Ücretsiz plan başlamak için yeterli. Pro ($20/ay) sınırsız premium model erişimi verir.",
    },
    {
      timeEstimate: "15 dk",
      title: "İlk Composer ile özellik yaz",
      detail: "Ctrl+I ile Composer'ı aç. Açık bir dosyada 'Add a loading spinner to this component' gibi basit bir komut dene.",
      type: "create",
    },
  ],
  notion: [
    {
      timeEstimate: "10 dk",
      title: "Notion AI aktif et",
      detail: "notion.so → ücretsiz plan → AI Add-on ($10/ay veya Plus planında dahil). Herhangi bir sayfada Space tuşuna basarak AI'ı çağır.",
      toolSlug: "notion-ai", toolName: "Notion AI",
      type: "setup",
      requiresPaid: true,
      freeAlternative: "Ücretsiz Notion planı var ancak AI özellikleri ücretli. Ücretsiz alternatifsek Coda veya basit Google Docs.",
    },
  ],
  "notion-ai": [
    {
      timeEstimate: "10 dk",
      title: "Notion ve Notion AI kur",
      detail: "notion.so → Sign up (ücretsiz). AI Add-on için +$10/ay. Sayfada Space tuşuna basarak AI'ı çağır.",
      toolSlug: "notion-ai", toolName: "Notion AI",
      type: "setup",
      requiresPaid: false,
      freeAlternative: "Temel Notion ücretsiz. AI özellikleri için eklenti gerekli ama sayfalar, veritabanları ve şablonlar ücretsiz.",
    },
    {
      timeEstimate: "20 dk",
      title: "SOP şablonu oluştur",
      detail: "Hazır Promptlar'daki 'Standart operasyon prosedürü' prompt'unu kullan. En çok zaman alan tekrarlayan sürecin için yaz.",
      type: "create",
    },
  ],
  mailchimp: [
    {
      timeEstimate: "15 dk",
      title: "Mailchimp hesabı ve liste kur",
      detail: "mailchimp.com → Sign up (500 aboneye kadar ücretsiz). Audience → Add Audience → import mevcut listeni (CSV).",
      toolSlug: "mailchimp", toolName: "Mailchimp",
      type: "setup",
      requiresPaid: false,
      freeAlternative: "500 kişiye kadar ücretsiz, ayda 1000 e-posta. Başlamak için yeterli.",
    },
    {
      timeEstimate: "20 dk",
      title: "Welcome automation kur",
      detail: "Automations → Classic Automations → Welcome new subscribers. Hazır Promptlar'daki e-posta şablonunu kullan.",
      type: "connect",
    },
  ],
};

// ─── Generic fallback prompts by goal category ─────────────────────────────

const GOAL_FALLBACK_PROMPTS: Record<string, ReadyPrompt[]> = {
  content: [PROMPTS_BY_SLUG["chatgpt"]?.[0], PROMPTS_BY_SLUG["chatgpt"]?.[1]].filter(Boolean) as ReadyPrompt[],
  advertising: [PROMPTS_BY_SLUG["jasper"]?.[0]].filter(Boolean) as ReadyPrompt[],
  seo: [PROMPTS_BY_SLUG["semrush"]?.[0], PROMPTS_BY_SLUG["surfer-seo"]?.[0]].filter(Boolean) as ReadyPrompt[],
  development: [PROMPTS_BY_SLUG["github-copilot"]?.[0], PROMPTS_BY_SLUG["cursor"]?.[0]].filter(Boolean) as ReadyPrompt[],
  design: [PROMPTS_BY_SLUG["canva"]?.[0], PROMPTS_BY_SLUG["midjourney"]?.[0]].filter(Boolean) as ReadyPrompt[],
  operations: [PROMPTS_BY_SLUG["notion-ai"]?.[0], PROMPTS_BY_SLUG["zapier"]?.[0]].filter(Boolean) as ReadyPrompt[],
  ecommerce: [PROMPTS_BY_SLUG["shopify-magic"]?.[0], PROMPTS_BY_SLUG["copy-ai"]?.[0]].filter(Boolean) as ReadyPrompt[],
  "customer-support": [PROMPTS_BY_SLUG["tidio"]?.[0]].filter(Boolean) as ReadyPrompt[],
};

// ─── Public API ───────────────────────────────────────────────────────────────

/**
 * Returns prompts ONLY for tools actually in the plan.
 * Falls back to goal-based prompts if tool has no specific prompts.
 */
export function getPromptsForTools(
  toolSlugs: string[],
  goalAreas?: string[]
): ReadyPrompt[] {
  const seen = new Set<string>();
  const result: ReadyPrompt[] = [];

  // First pass: get prompts for tools actually recommended
  for (const slug of toolSlugs) {
    const list = PROMPTS_BY_SLUG[slug] ?? [];
    for (const p of list) {
      if (!seen.has(p.id)) {
        seen.add(p.id);
        result.push(p);
      }
    }
  }

  // Second pass: fill gaps with goal-based prompts (not generic ChatGPT)
  if (result.length < 4 && goalAreas?.length) {
    for (const goal of goalAreas) {
      const fallback = GOAL_FALLBACK_PROMPTS[goal] ?? [];
      for (const p of fallback) {
        if (!seen.has(p.id) && !toolSlugs.includes(p.toolSlug)) {
          seen.add(p.id);
          result.push(p);
        }
      }
    }
  }

  return result;
}

/**
 * Returns Day 1 tasks for the given tool slugs.
 * Tasks include whether they require paid plans and free alternatives.
 */
export function getDayOneTasks(
  toolSlugs: string[],
  budgetTier?: string
): DayOneTask[] {
  const seen = new Set<string>();
  const result: DayOneTask[] = [];
  const isFreeOnly = budgetTier === "free-only";

  for (const slug of toolSlugs) {
    const list = DAY_ONE_TASKS_BY_SLUG[slug] ?? [];
    for (const t of list) {
      const key = `${slug}-${t.title}`;
      if (seen.has(key)) continue;
      seen.add(key);

      // For free-only users: include paid tasks but mark clearly with alternative note
      if (isFreeOnly && t.requiresPaid && !t.freeAlternative) {
        continue; // Skip tasks with no free alternative at all
      }

      result.push(t);
    }
  }

  return result.slice(0, 10);
}
