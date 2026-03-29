/**
 * Mock recommendation engine.
 *
 * Generates contextual, realistic results from user context (URL params).
 * Architecture stub: replaces DB + real rule engine until Sprint 3+.
 * The interface is designed to be hot-swappable with a real backend.
 */

import type { SolutionArea, UserType, BudgetTier, TeamStructure } from "./types";
import { getTools } from "@/lib/tools/store";

// Slug → websiteUrl map — built lazily from the live tool store
function getWebsiteUrlMap(): Record<string, string> {
  return Object.fromEntries(getTools().map(t => [t.slug, t.websiteUrl]));
}

// Keep a per-request reference so we don't call getTools() repeatedly
// (getTools() has its own in-memory cache, so this is just a convenience alias)
function getWebsiteUrl(slug: string): string {
  return getWebsiteUrlMap()[slug] ?? `https://${slug}.com`;
}

/* ─── Public result types ────────────────────────────────────────────────── */

export type DecisionRole = "best-fit" | "free-alt" | "power-alt";

export interface DecisionCard {
  role: DecisionRole;
  slug: string;
  name: string;
  tagline: string;
  note: string;
  hasFree: boolean;
  pricingLabel: string;
  compositeScore: number;
  websiteUrl: string;
}

export interface MiniTool {
  slug: string;
  name: string;
  tagline: string;
  rationale: string;
  hasFree: boolean;
  pricingLabel: string;
  compositeScore: number;
  websiteUrl: string;
}

export interface SolutionAreaResult {
  area: SolutionArea;
  label: string;
  description: string;
  tools: MiniTool[];
}

export interface WhyTheseReason {
  label: string;
  value: string;
}

export interface MockResult {
  contextLabel: string;
  diagnosis: string;
  diagnosisDetails: string;
  decisionCards: DecisionCard[];
  whyThese: WhyTheseReason[];
  solutionAreas: SolutionAreaResult[];
}

/* ─── Internal tool record ───────────────────────────────────────────────── */

interface ToolRecord {
  slug: string;
  name: string;
  tagline: string;
  category: string;
  hasFree: boolean;
  pricingLabel: string;
  compositeScore: number;
  solutionAreas: SolutionArea[];
  suitableFor: UserType[];
  budgetMin: BudgetTier; // minimum budget required
  rationales: Partial<Record<SolutionArea, string>>;
}

/* ─── Tool database (mock, ~15 tools) ───────────────────────────────────── */

const TOOLS: Record<string, ToolRecord> = {
  chatgpt: {
    slug: "chatgpt",
    name: "ChatGPT",
    tagline: "OpenAI · Genel amaçlı AI asistan",
    category: "Asistan",
    hasFree: true,
    pricingLabel: "Ücretsiz · Plus $20/ay",
    compositeScore: 9.2,
    solutionAreas: ["content", "advertising", "customer-support", "operations", "revenue"],
    suitableFor: ["individual", "freelancer", "founder", "team"],
    budgetMin: "free-only",
    rationales: {
      content: "İçerik üretimi ve yazarlıkta en yaygın ve esnek tercih.",
      advertising: "Reklam metin yazımında hızlı ve uyarlanabilir sonuçlar üretiyor.",
      "customer-support": "SSS yanıtları, destek yazışmaları ve e-posta şablonlarında etkili.",
      operations: "Proje dokümanları, toplantı özetleri ve süreç açıklamaları için ideal.",
      revenue: "Satış metinleri, teklif taslakları ve müşteri iletişimlerinde güçlü.",
    },
  },
  claude: {
    slug: "claude",
    name: "Claude",
    tagline: "Anthropic · Uzun içerik ve analiz",
    category: "Asistan",
    hasFree: true,
    pricingLabel: "Ücretsiz · Pro $20/ay",
    compositeScore: 9.0,
    solutionAreas: ["content", "development", "operations", "revenue", "seo"],
    suitableFor: ["freelancer", "founder", "team"],
    budgetMin: "free-only",
    rationales: {
      content: "Uzun form içerik ve marka sesi tutarlılığında ChatGPT'den daha güçlü.",
      development: "Kod açıklama, mimari tartışma ve teknik belge yazmada öne çıkıyor.",
      seo: "SEO odaklı uzun içerik üretiminde kaliteli ve tutarlı çıktılar.",
      operations: "Strateji dokümanları ve süreç analizinde derinlikli çıktı üretiyor.",
      revenue: "Satış stratejisi, pitch deck içeriği ve değer önerisi tanımlamada güçlü.",
    },
  },
  "github-copilot": {
    slug: "github-copilot",
    name: "GitHub Copilot",
    tagline: "GitHub · Yazılım geliştirme asistanı",
    category: "Geliştirici",
    hasFree: false,
    pricingLabel: "$10/ay · Takım $19/kişi",
    compositeScore: 8.8,
    solutionAreas: ["development"],
    suitableFor: ["freelancer", "founder", "team"],
    budgetMin: "low",
    rationales: {
      development: "IDE içinde gerçek zamanlı kod tamamlama ve refactoring desteği.",
    },
  },
  midjourney: {
    slug: "midjourney",
    name: "Midjourney",
    tagline: "Görsel ve illüstrasyon üretimi",
    category: "Tasarım",
    hasFree: false,
    pricingLabel: "$10/ay başlangıç",
    compositeScore: 8.6,
    solutionAreas: ["design", "advertising", "content", "ecommerce"],
    suitableFor: ["individual", "freelancer", "founder"],
    budgetMin: "low",
    rationales: {
      design: "Konsept görsel ve illüstrasyon üretiminde sektörün en iyi kalitesi.",
      advertising: "Reklam kreatifleri ve sosyal medya görselleri için güçlü başlangıç noktası.",
      content: "Blog görselleri, kapak fotoğrafları ve içerik görselleri üretmede etkili.",
      ecommerce: "Ürün atmosfer görselleri ve kampanya kreatifleri için kullanışlı.",
    },
  },
  perplexity: {
    slug: "perplexity",
    name: "Perplexity AI",
    tagline: "AI destekli araştırma motoru",
    category: "Araştırma",
    hasFree: true,
    pricingLabel: "Ücretsiz · Pro $20/ay",
    compositeScore: 8.7,
    solutionAreas: ["seo", "content", "operations", "revenue"],
    suitableFor: ["individual", "freelancer", "founder", "team"],
    budgetMin: "free-only",
    rationales: {
      seo: "Anahtar kelime araştırması, rakip analizi ve içerik fikirleri için hızlı kaynaklı sonuç.",
      content: "İçerik araştırması ve trend takibinde güncel ve kaynaklı bilgi.",
      operations: "Pazar araştırması, sektör analizi ve rekabet takibinde pratik.",
      revenue: "Fiyatlandırma araştırması ve pazar büyüklüğü analizinde kullanışlı.",
    },
  },
  "notion-ai": {
    slug: "notion-ai",
    name: "Notion AI",
    tagline: "Doküman + AI entegrasyonu",
    category: "Verimlilik",
    hasFree: false,
    pricingLabel: "$8/ay (Plus üstü)",
    compositeScore: 8.4,
    solutionAreas: ["operations", "content", "development"],
    suitableFor: ["freelancer", "founder", "team"],
    budgetMin: "low",
    rationales: {
      operations: "Proje yönetimi, süreç dokümantasyonu ve ekip bilgi tabanı için mükemmel.",
      content: "İçerik takvimi, blog planlama ve yazı taslakları için iş akışına entegre.",
      development: "Teknik dokümantasyon ve sprint notları için geliştiricilerin tercihi.",
    },
  },
  zapier: {
    slug: "zapier",
    name: "Zapier",
    tagline: "İş akışı otomasyon platformu",
    category: "Otomasyon",
    hasFree: true,
    pricingLabel: "Ücretsiz (5 Zap) · Starter $20/ay",
    compositeScore: 8.3,
    solutionAreas: ["operations", "cost-reduction", "ecommerce", "customer-support"],
    suitableFor: ["freelancer", "founder", "team"],
    budgetMin: "free-only",
    rationales: {
      operations: "Tekrarlayan iş akışlarını otomatize etmek için 6000+ entegrasyon.",
      "cost-reduction": "Manuel işlemleri otomatize ederek zaman ve maliyet tasarrufu sağlar.",
      ecommerce: "Sipariş bildirimleri, CRM güncellemeleri ve envanter takibini otomatize eder.",
      "customer-support": "Destek biletlerini CRM'e, e-postaları takip sistemine otomatik bağlar.",
    },
  },
  "copy-ai": {
    slug: "copy-ai",
    name: "Copy.ai",
    tagline: "Pazarlama içeriği üretimi",
    category: "Pazarlama",
    hasFree: true,
    pricingLabel: "Ücretsiz (2k kelime) · Pro $36/ay",
    compositeScore: 7.9,
    solutionAreas: ["content", "advertising", "ecommerce", "revenue"],
    suitableFor: ["individual", "freelancer", "founder"],
    budgetMin: "free-only",
    rationales: {
      content: "Sosyal medya, e-posta ve blog içerikleri için şablon tabanlı hızlı üretim.",
      advertising: "Facebook, Google ve Instagram reklam metinleri için optimize şablonlar.",
      ecommerce: "Ürün açıklamaları ve kampanya metinleri için pratik ve hızlı.",
      revenue: "Satış e-postaları ve müşteri kazanma metinleri için kullanışlı.",
    },
  },
  adcreative: {
    slug: "adcreative",
    name: "AdCreative.ai",
    tagline: "Performansa göre reklam kreatifleri",
    category: "Reklam",
    hasFree: false,
    pricingLabel: "$21/ay başlangıç",
    compositeScore: 8.1,
    solutionAreas: ["advertising", "ecommerce", "revenue"],
    suitableFor: ["founder", "team"],
    budgetMin: "low",
    rationales: {
      advertising: "Dönüşüm odaklı reklam görselleri üreterek A/B test sürecini hızlandırıyor.",
      ecommerce: "Ürün bazlı reklam kreatifleri ve sezon kampanyaları için güçlü.",
      revenue: "ROAS odaklı görsel üretimde e-ticaret markalarının tercih ettiği araç.",
    },
  },
  jasper: {
    slug: "jasper",
    name: "Jasper AI",
    tagline: "Marka odaklı içerik üretimi",
    category: "İçerik",
    hasFree: false,
    pricingLabel: "$39/ay başlangıç",
    compositeScore: 8.2,
    solutionAreas: ["content", "advertising", "revenue"],
    suitableFor: ["founder", "team"],
    budgetMin: "mid",
    rationales: {
      content: "Marka sesi eğitimi ve şablon sistemiyle tutarlı içerik üretimi sağlar.",
      advertising: "Marka sesine uygun reklam metinleri üretmede güçlü ve ölçeklenebilir.",
      revenue: "İçerik pazarlamasını büyük ölçekte yönetmek isteyen takımlar için uygun.",
    },
  },
  grammarly: {
    slug: "grammarly",
    name: "Grammarly",
    tagline: "Yazı kalitesi ve ton analizi",
    category: "Yazı",
    hasFree: true,
    pricingLabel: "Ücretsiz · Premium $12/ay",
    compositeScore: 8.0,
    solutionAreas: ["content", "seo", "operations", "customer-support"],
    suitableFor: ["individual", "freelancer", "founder", "team"],
    budgetMin: "free-only",
    rationales: {
      content: "Yazı kalitesini, ton tutarlılığını ve profesyonelliği artırıyor.",
      seo: "İçerik okunabilirliğini artırarak SEO sıralamalarına olumlu katkı yapıyor.",
      operations: "Resmi iş yazışmaları ve müşteri iletişimlerinde dil kalitesini yükseltir.",
      "customer-support": "Destek yazışmalarında ton ve netlik kontrolü için kullanışlı.",
    },
  },
  elevenlabs: {
    slug: "elevenlabs",
    name: "ElevenLabs",
    tagline: "Gerçekçi ses klonlama ve sentezi",
    category: "Ses",
    hasFree: true,
    pricingLabel: "Ücretsiz (10k karakter) · Starter $5/ay",
    compositeScore: 8.5,
    solutionAreas: ["design", "content", "advertising"],
    suitableFor: ["individual", "freelancer", "founder"],
    budgetMin: "free-only",
    rationales: {
      design: "Podcast, video seslendirme ve ses marka kimliği oluşturmada lider.",
      content: "Blog ve video içerikleri için profesyonel seslendirme üretir.",
      advertising: "Video reklam seslendirmeleri için hızlı ve uygun maliyetli çözüm.",
    },
  },
  make: {
    slug: "make",
    name: "Make",
    tagline: "Görsel otomasyon ve entegrasyon",
    category: "Otomasyon",
    hasFree: true,
    pricingLabel: "Ücretsiz (1k ops) · Core $9/ay",
    compositeScore: 8.2,
    solutionAreas: ["operations", "cost-reduction", "ecommerce"],
    suitableFor: ["freelancer", "founder", "team"],
    budgetMin: "free-only",
    rationales: {
      operations: "Karmaşık iş akışlarını görsel olarak tasarlama ve otomatize etme.",
      "cost-reduction": "Tekrarlayan süreçleri otomatize ederek operasyon maliyetini düşürür.",
      ecommerce: "Sipariş, envanter ve müşteri süreçlerini otomatize eder.",
    },
  },
  descript: {
    slug: "descript",
    name: "Descript",
    tagline: "Transkript tabanlı video düzenleme",
    category: "Medya",
    hasFree: true,
    pricingLabel: "Ücretsiz · Creator $15/ay",
    compositeScore: 8.1,
    solutionAreas: ["design", "content", "advertising"],
    suitableFor: ["individual", "freelancer", "founder"],
    budgetMin: "free-only",
    rationales: {
      design: "Metin üzerinden video düzenleme ile post-prodüksiyon sürecini hızlandırır.",
      content: "Podcast ve video içeriklerini transkript ile kolayca düzenler.",
      advertising: "Video reklam üretimi ve kırpma için pratik bir araç.",
    },
  },
};

/* ─── Goal → tool priority map ───────────────────────────────────────────── */

const GOAL_PRIORITY: Record<SolutionArea, string[]> = {
  content:          ["chatgpt", "claude", "jasper", "copy-ai", "grammarly"],
  advertising:      ["adcreative", "copy-ai", "jasper", "chatgpt", "midjourney"],
  seo:              ["perplexity", "claude", "grammarly", "chatgpt"],
  development:      ["github-copilot", "claude", "chatgpt", "notion-ai"],
  design:           ["midjourney", "elevenlabs", "descript"],
  operations:       ["notion-ai", "zapier", "make", "chatgpt"],
  ecommerce:        ["adcreative", "copy-ai", "zapier", "chatgpt"],
  "customer-support": ["chatgpt", "grammarly", "zapier", "claude"],
  revenue:          ["chatgpt", "claude", "copy-ai", "adcreative"],
  "cost-reduction": ["zapier", "make", "notion-ai", "chatgpt"],
};

/* ─── Labels ─────────────────────────────────────────────────────────────── */

export const USER_TYPE_LABELS: Record<UserType, string> = {
  individual: "Birey",
  freelancer: "Freelancer",
  founder:    "İşletme sahibi",
  team:       "Ekip / şirket",
};

export const TEAM_LABELS: Record<TeamStructure, string> = {
  solo:        "Tek başıma",
  small:       "Küçük ekip",
  growing:     "Büyüyen ekip",
  established: "Oturmuş ekip",
};

export const BUDGET_LABELS: Record<BudgetTier, string> = {
  "free-only": "Önce ücretsiz",
  low:         "Düşük bütçe",
  mid:         "Orta bütçe",
  best:        "En iyi çözüm",
};

export const GOAL_LABELS: Record<SolutionArea, string> = {
  content:          "İçerik Üretimi",
  advertising:      "Reklam",
  seo:              "SEO",
  development:      "Yazılım Geliştirme",
  design:           "Tasarım",
  operations:       "Operasyon",
  ecommerce:        "E-Ticaret",
  "customer-support": "Müşteri Desteği",
  revenue:          "Gelir Artırma",
  "cost-reduction": "Maliyet Düşürme",
};

export const GOAL_DESCRIPTIONS: Record<SolutionArea, string> = {
  content:          "Yazı, sosyal medya, blog ve e-posta içerikleri",
  advertising:      "Reklam metinleri, kreatifleri ve kampanyaları",
  seo:              "Arama motoru görünürlüğü ve içerik optimizasyonu",
  development:      "Kod üretimi, refactoring ve teknik verimlilik",
  design:           "Görsel üretim, marka kimliği ve medya içerikleri",
  operations:       "Süreç yönetimi, otomasyon ve ekip verimliliği",
  ecommerce:        "Online satış, ürün sayfaları ve dönüşüm",
  "customer-support": "Müşteri yazışmaları, chatbot ve destek süreçleri",
  revenue:          "Satış artırma, müşteri kazanma ve büyüme",
  "cost-reduction": "İş akışı otomasyonu ve operasyon maliyeti",
};

/* ─── Diagnosis templates ────────────────────────────────────────────────── */

const DIAGNOSIS_MAP: Partial<Record<string, { short: string; details: string }>> = {
  "freelancer+content": {
    short: "Serbest çalışan biri olarak içerik üretimini hızlandırmak istiyorsun.",
    details:
      "İçerik üretiminin hızı ve kalitesi, freelancer gelirini doğrudan etkiliyor. Doğru araçla daha kısa sürede daha kaliteli çıktı üretebilir, daha fazla müşteriye hizmet verebilirsin. Bütçeyi verimli kullanmak da kritik — güçlü ücretsiz planlar bu noktada avantaj sağlıyor.",
  },
  "freelancer+seo": {
    short: "Serbest çalışan biri olarak SEO görünürlüğünü artırmak istiyorsun.",
    details:
      "SEO, freelancer için en sürdürülebilir müşteri kazanma kanallarından biri. Doğru araçlar araştırma sürecini hızlandırır, içerik optimizasyonunu kolaylaştırır ve rekabetçi kalmanı sağlar.",
  },
  "freelancer+development": {
    short: "Yazılım geliştirme sürecini hızlandırmak isteyen bir freelancer'sın.",
    details:
      "Geliştirici araçları doğru seçildiğinde saatlik çıktını ciddi ölçüde artırabilir. Kod tamamlama, hata ayıklama ve dokümantasyon — hepsi hızlanabilir.",
  },
  "freelancer+design": {
    short: "Tasarım üretimini hızlandırmak isteyen bir freelancer'sın.",
    details:
      "Görsel üretim araçları, müşteri projelerindeki revizyon süreçlerini kısaltır ve ölçekli üretim yapmanı sağlar. Maliyet/kalite dengesi kritik.",
  },
  "individual+content": {
    short: "Bireysel olarak içerik üretiminde AI'dan destek almak istiyorsun.",
    details:
      "Kişisel marka, blog, sosyal medya veya herhangi bir içerik projesinde AI araçları hem hız hem kalite katkısı sağlar. Ücretsiz başlayıp ihtiyaca göre büyütmek mümkün.",
  },
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
      "Ürün sayfaları, reklam kreatifleri ve kampanya içerikleri — tümünde AI araçları dönüşüm oranını artırmak için kullanılabilir.",
  },
  "founder+operations": {
    short: "Operasyonu daha verimli hale getirmek isteyen bir kurucusun.",
    details:
      "Büyüyen bir işletmede operasyonu otomatize etmek hem maliyeti düşürür hem de ekibin asıl işe odaklanmasını sağlar.",
  },
  "team+operations": {
    short: "Ekip operasyonunu ve verimliliğini artırmak istiyorsunuz.",
    details:
      "Oturmuş ekiplerde otomasyon ve dokümantasyon araçları hem süreç standardizasyonu hem de ölçeklenebilirlik sağlar.",
  },
  "team+development": {
    short: "Yazılım geliştirme süreçlerinizi hızlandırmak istiyorsunuz.",
    details:
      "Takım bazlı geliştirme araçları kod kalitesini artırır, review süreçlerini hızlandırır ve teknik borcu azaltır.",
  },
};

function getDiagnosis(
  userType: UserType,
  primaryGoal: SolutionArea
): { short: string; details: string } {
  const key = `${userType}+${primaryGoal}`;
  const match = DIAGNOSIS_MAP[key];
  if (match) return match;

  // Fallback template
  const typeLabel = USER_TYPE_LABELS[userType];
  const goalLabel = GOAL_LABELS[primaryGoal];
  return {
    short: `${typeLabel} olarak ${goalLabel.toLowerCase()} alanında AI'dan destek almak istiyorsun.`,
    details:
      `${goalLabel} için doğru araçlar seçildiğinde hem hız hem kalite farkı net şekilde hissedilir. Aşağıdaki öneriler bütçen ve çalışma düzenin göz önünde bulundurularak hazırlandı.`,
  };
}

/* ─── Budget filter ───────────────────────────────────────────────────────── */

const BUDGET_ORDER: BudgetTier[] = ["free-only", "low", "mid", "best"];

function budgetAllows(toolMin: BudgetTier, userBudget: BudgetTier): boolean {
  return BUDGET_ORDER.indexOf(toolMin) <= BUDGET_ORDER.indexOf(userBudget);
}

/* ─── Core selection logic ───────────────────────────────────────────────── */

function selectDecisionCards(
  primaryGoal: SolutionArea,
  userType: UserType,
  budget: BudgetTier
): DecisionCard[] {
  const slugs = GOAL_PRIORITY[primaryGoal] ?? GOAL_PRIORITY.content;
  const candidates = slugs
    .map((s) => TOOLS[s])
    .filter((t): t is ToolRecord => !!t)
    .filter((t) => budgetAllows(t.budgetMin, budget) || budget === "best");

  // Best-fit: highest score, fits user + budget
  const bestFit = candidates.find((t) => t.suitableFor.includes(userType)) ?? candidates[0];

  // Free-alt: first with hasFree that's not bestFit
  const freeAlt =
    candidates.find((t) => t.hasFree && t !== bestFit) ??
    // fallback: pick from full candidates ignoring budget if needed
    slugs.map((s) => TOOLS[s]).find((t) => t?.hasFree && t !== bestFit);

  // Power-alt: highest composite score from full pool, different from both
  const allCandidates = slugs
    .map((s) => TOOLS[s])
    .filter((t): t is ToolRecord => !!t && t !== bestFit && t !== freeAlt)
    .sort((a, b) => b.compositeScore - a.compositeScore);
  const powerAlt = allCandidates[0];

  const toCard = (tool: ToolRecord | undefined, role: DecisionRole): DecisionCard | null => {
    if (!tool) return null;
    const rationale = tool.rationales[primaryGoal] ?? Object.values(tool.rationales)[0] ?? "";
    return {
      role,
      slug: tool.slug,
      name: tool.name,
      tagline: tool.tagline,
      note: rationale,
      hasFree: tool.hasFree,
      pricingLabel: tool.pricingLabel,
      compositeScore: tool.compositeScore,
      websiteUrl: getWebsiteUrl(tool.slug),
    };
  };

  return [
    toCard(bestFit, "best-fit"),
    toCard(freeAlt, "free-alt"),
    toCard(powerAlt, "power-alt"),
  ].filter((c): c is DecisionCard => c !== null);
}

function selectSolutionAreas(
  goals: SolutionArea[],
  userType: UserType,
  budget: BudgetTier
): SolutionAreaResult[] {
  return goals.slice(0, 3).map((area) => {
    const slugs = GOAL_PRIORITY[area] ?? [];
    const tools = slugs
      .map((s) => TOOLS[s])
      .filter((t): t is ToolRecord => !!t)
      .filter((t) => budgetAllows(t.budgetMin, budget) || budget === "best")
      .slice(0, 3)
      .map(
        (t): MiniTool => ({
          slug: t.slug,
          name: t.name,
          tagline: t.tagline,
          rationale: t.rationales[area] ?? Object.values(t.rationales)[0] ?? "",
          hasFree: t.hasFree,
          pricingLabel: t.pricingLabel,
          compositeScore: t.compositeScore,
          websiteUrl: getWebsiteUrl(t.slug),
        })
      );

    return {
      area,
      label: GOAL_LABELS[area],
      description: GOAL_DESCRIPTIONS[area],
      tools,
    };
  });
}

/* ─── URL param parsing ──────────────────────────────────────────────────── */

const USER_TYPE_MAP: Record<string, UserType> = {
  birey: "individual",
  freelancer: "freelancer",
  "isletme-sahibi": "founder",
  ekip: "team",
  individual: "individual",
  founder: "founder",
  team: "team",
};

const BUDGET_MAP: Record<string, BudgetTier> = {
  "free-only": "free-only",
  low: "low",
  mid: "mid",
  best: "best",
};

const TEAM_MAP: Record<string, TeamStructure> = {
  solo: "solo",
  small: "small",
  growing: "growing",
  established: "established",
};

export interface ParsedParams {
  type?: string;
  biz?: string;
  goals?: string;
  team?: string;
  budget?: string;
  note?: string;
}

export function parseParams(params: ParsedParams) {
  const userType: UserType = USER_TYPE_MAP[params.type ?? ""] ?? "freelancer";
  const budget: BudgetTier = BUDGET_MAP[params.budget ?? ""] ?? "low";
  const team: TeamStructure = TEAM_MAP[params.team ?? ""] ?? "solo";
  const goals: SolutionArea[] = params.goals
    ? (params.goals.split(",").filter((g) => g in GOAL_LABELS) as SolutionArea[])
    : (["content"] as SolutionArea[]);

  return { userType, budget, team, goals, biz: params.biz ?? "", note: params.note ?? "" };
}

/* ─── Public API ─────────────────────────────────────────────────────────── */

export function generateMockResult(params: ParsedParams): MockResult {
  const { userType, budget, team, goals, biz } = parseParams(params);
  const primaryGoal = goals[0] ?? "content";

  const contextParts: string[] = [
    USER_TYPE_LABELS[userType],
    goals.slice(0, 2).map((g) => GOAL_LABELS[g]).join(" + "),
  ];
  if (biz) contextParts.push(biz);
  contextParts.push(TEAM_LABELS[team]);

  const { short, details } = getDiagnosis(userType, primaryGoal);

  const whyThese: WhyTheseReason[] = [
    { label: "Kullanıcı tipi",   value: USER_TYPE_LABELS[userType] },
    { label: "Hedef alanlar",    value: goals.slice(0, 3).map((g) => GOAL_LABELS[g]).join(", ") },
    { label: "Bütçe yaklaşımı", value: BUDGET_LABELS[budget] },
    { label: "Ekip yapısı",      value: TEAM_LABELS[team] },
  ];

  return {
    contextLabel: contextParts.join(" · "),
    diagnosis: short,
    diagnosisDetails: details,
    decisionCards: selectDecisionCards(primaryGoal, userType, budget),
    whyThese,
    solutionAreas: selectSolutionAreas(goals, userType, budget),
  };
}

