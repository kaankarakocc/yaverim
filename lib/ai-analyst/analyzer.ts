/**
 * AI Tool Analyzer
 *
 * Takes a tool name + URL, searches the live web, and returns a structured
 * analysis report in Turkish.
 *
 * Provider priority:
 *   1. Perplexity Sonar   → PERPLEXITY_API_KEY set  (recommended — has built-in web search)
 *   2. OpenAI GPT-4o      → OPENAI_API_KEY set       (fallback)
 *   3. Mock               → neither key set          (dev / demo mode)
 *
 * Perplexity is strongly preferred because its Sonar model searches the live
 * web in real time — it can find current pricing, user reviews, launch dates,
 * and competitor comparisons without any extra tooling.
 */

import type { ToolAnalysisReport, AiDiscoveryScanResult, AnalysisProvider } from "./types";

/* ─── Prompt builders ─────────────────────────────────────────────────────── */

function buildAnalysisPrompt(name: string, url: string): string {
  return `Sen bir yapay zeka araçları uzmanısın. "${name}" adlı yapay zeka aracını (${url}) derinlemesine analiz et.

Lütfen bu aracı gerçek zamanlı web araması yaparak incele ve aşağıdaki bilgileri TÜRKÇE olarak ver:

Yanıtını tam olarak bu JSON formatında ver (başka hiçbir şey yazma):

{
  "summary": "2-3 cümlelik genel özet. Aracın ne yaptığını ve kimler için faydalı olduğunu net belirt.",
  "targetAudience": "Kimin bu aracı kullandığını açıkla (freelancer, ajans, e-ticaret, geliştirici vs.)",
  "topFeatures": ["Özellik 1", "Özellik 2", "Özellik 3", "Özellik 4"],
  "pros": ["Gerçek avantaj 1", "Gerçek avantaj 2", "Gerçek avantaj 3"],
  "cons": ["Gerçek dezavantaj 1", "Gerçek dezavantaj 2"],
  "pricing": {
    "hasFree": true/false,
    "hasTrial": true/false,
    "freeDetails": "Ücretsiz planda ne var veya yok",
    "paidPlans": "Ücretli planların özeti",
    "startingPrice": "$X/ay veya Ücretsiz veya Enterprise",
    "pricingTier": "free/freemium/paid/enterprise"
  },
  "competitors": ["Rakip 1", "Rakip 2", "Rakip 3"],
  "turkishSupport": "full/partial/none",
  "turkishSupportNote": "Türkçe desteğinin detayı",
  "suggestedPopularity": "mainstream/known/niche/emerging",
  "suggestedEditorialScore": 8.0,
  "suggestedCategory": "Asistan/İçerik/Tasarım/Geliştirici/SEO/Otomasyon/Video/Analitik",
  "recommendation": "approve/reject/needs-info",
  "recommendationReason": "Neden bu tavsiyeyi verdiğini açıkla. Rakiplere göre farkını belirt."
}

Önemli kurallar:
- Gerçekçi ve dürüst ol — marketing kopya yazma
- Eğer araç gerçekten güçlüyse approve et, zayıfsa reject et
- Türk kullanıcı perspektifinden değerlendir
- Fiyatlandırma bilgisini güncel web'den al`;
}

function buildDiscoveryPrompt(): string {
  const today = new Date().toLocaleDateString("tr-TR");
  return `Bugün ${today}. Sen bir yapay zeka araçları keşif uzmanısın.

İnterneti tarayarak son 30-60 günde ortaya çıkmış veya dikkat çekmeye başlamış, GEREKLİ ilginç yapay zeka araçlarını bul.

Arama kriterleri:
- ChatGPT, Claude, Midjourney, Gemini gibi zaten bilinen büyük araçları EKLEME
- Gerçekten kullanılabilir, aktif ürünleri seç (beta veya erken erişim kabul)
- Odak alanları: iş verimliliği, içerik üretimi, kod geliştirme, e-ticaret, müşteri hizmetleri, otomasyon
- Product Hunt, GitHub, tech bloglar, Twitter/X, Hacker News kaynaklarını tara

10 araç bul ve yanıtını TAM OLARAK bu JSON formatında ver:

{
  "tools": [
    {
      "name": "Araç Adı",
      "slug": "arac-adi",
      "websiteUrl": "https://...",
      "tagline": "Tek cümle ne yaptığı",
      "rawDescription": "2-3 cümle detaylı açıklama",
      "suggestedCategory": "kategori",
      "suggestedPopularity": "niche/emerging/known",
      "discoverySignal": "Nerede/nasıl keşfedildi, kaç upvote/star vs.",
      "whyInteresting": "Neden öne çıkıyor, rakiplerinden farkı ne"
    }
  ],
  "sources": ["https://...", "https://..."]
}`;
}

/* ─── Perplexity provider ─────────────────────────────────────────────────── */

async function callPerplexity(prompt: string, systemPrompt: string): Promise<{ content: string; sources: string[] }> {
  const key = process.env.PERPLEXITY_API_KEY;
  if (!key) throw new Error("PERPLEXITY_API_KEY is not set");

  const res = await fetch("https://api.perplexity.ai/chat/completions", {
    method:  "POST",
    headers: { "Authorization": `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      model:    "sonar",   // sonar-pro for deeper research
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user",   content: prompt },
      ],
      return_citations: true,
      temperature: 0.2,  // low = more factual
      max_tokens:  2000,
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Perplexity API error ${res.status}: ${err}`);
  }

  const data = await res.json() as {
    choices: Array<{ message: { content: string } }>;
    citations?: string[];
  };

  return {
    content: data.choices[0]?.message?.content ?? "",
    sources: data.citations ?? [],
  };
}

/* ─── OpenAI provider ─────────────────────────────────────────────────────── */

async function callOpenAI(prompt: string, systemPrompt: string): Promise<{ content: string; sources: string[] }> {
  const key = process.env.OPENAI_API_KEY;
  if (!key) throw new Error("OPENAI_API_KEY is not set");

  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method:  "POST",
    headers: { "Authorization": `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      model:    "gpt-4o",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user",   content: prompt },
      ],
      response_format: { type: "json_object" },
      temperature: 0.2,
      max_tokens:  2000,
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`OpenAI API error ${res.status}: ${err}`);
  }

  const data = await res.json() as {
    choices: Array<{ message: { content: string } }>;
  };

  return { content: data.choices[0]?.message?.content ?? "", sources: [] };
}

/* ─── Gemini provider (free — Google AI Studio) ───────────────────────────── */

async function callGemini(prompt: string, systemPrompt: string): Promise<{ content: string; sources: string[] }> {
  const key = process.env.GEMINI_API_KEY;
  if (!key) throw new Error("GEMINI_API_KEY is not set");

  // Strategy 1: gemini-2.0-flash WITH Google Search grounding (live web results)
  // responseMimeType must NOT be set when using grounding tools
  const withSearch = await geminiRequest(key, "gemini-2.0-flash", prompt, systemPrompt, true);
  if (withSearch.ok) return withSearch;

  // Strategy 2: gemini-2.0-flash WITHOUT grounding, pure JSON mode
  const noSearch = await geminiRequest(key, "gemini-2.0-flash", prompt, systemPrompt, false);
  if (noSearch.ok) return noSearch;

  // Strategy 3: fall back to lite models (lower quota cost, separate rate limit bucket)
  // Model names verified against the API's /v1beta/models endpoint
  for (const model of ["gemini-2.0-flash-lite", "gemini-flash-lite-latest"]) {
    const r = await geminiRequest(key, model, prompt, systemPrompt, false);
    if (r.ok) return r;
  }

  // All strategies exhausted — surface the first meaningful error
  const firstError = [withSearch, noSearch].find(r => !r.ok);
  throw new Error((firstError as { ok: false; error: string }).error ?? "Gemini request failed");
}

async function geminiRequest(
  key: string,
  model: string,
  prompt: string,
  systemPrompt: string,
  useSearch: boolean,
): Promise<{ ok: true; content: string; sources: string[] } | { ok: false; error: string }> {
  const body: Record<string, unknown> = {
    systemInstruction: { parts: [{ text: systemPrompt }] },
    contents: [{ role: "user", parts: [{ text: prompt }] }],
    generationConfig: {
      temperature:     0.2,
      maxOutputTokens: 2048,
      // responseMimeType only when NOT using grounding (they are mutually exclusive)
      ...(useSearch ? {} : { responseMimeType: "application/json" }),
    },
  };

  if (useSearch) {
    // google_search grounding (snake_case) — works for both 1.5 and 2.0
    body.tools = [{ google_search: {} }];
  }

  let res: Response;
  try {
    res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${key}`,
      { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) }
    );
  } catch (e) {
    return { ok: false, error: `Network error: ${String(e)}` };
  }

  if (!res.ok) {
    const errText = await res.text().catch(() => res.statusText);
    return { ok: false, error: `Gemini API ${res.status} (${model}): ${errText.slice(0, 300)}` };
  }

  const data = await res.json() as {
    candidates?: Array<{
      content?: { parts?: Array<{ text?: string }> };
      groundingMetadata?: {
        groundingChunks?: Array<{ web?: { uri?: string } }>;
      };
      finishReason?: string;
    }>;
    error?: { message: string };
  };

  if (data.error) return { ok: false, error: `${model}: ${data.error.message}` };

  const parts   = data.candidates?.[0]?.content?.parts ?? [];
  const content = parts.map(p => p.text ?? "").join("").trim();

  if (!content) {
    const reason = data.candidates?.[0]?.finishReason ?? "unknown";
    return { ok: false, error: `Empty response from ${model} (finishReason: ${reason})` };
  }

  const sources = (data.candidates?.[0]?.groundingMetadata?.groundingChunks ?? [])
    .map(c => c.web?.uri ?? "")
    .filter(Boolean);

  return { ok: true, content, sources };
}


/* ─── Provider selector ───────────────────────────────────────────────────── */

function getProvider(): AnalysisProvider {
  if (process.env.PERPLEXITY_API_KEY) return "perplexity";
  if (process.env.OPENAI_API_KEY)     return "openai";
  if (process.env.GEMINI_API_KEY)     return "gemini";
  return "mock";
}

async function callAI(prompt: string, systemPrompt: string): Promise<{ content: string; sources: string[]; provider: AnalysisProvider }> {
  const provider = getProvider();

  if (provider === "perplexity") {
    const r = await callPerplexity(prompt, systemPrompt);
    return { ...r, provider };
  }

  if (provider === "openai") {
    const r = await callOpenAI(prompt, systemPrompt);
    return { ...r, provider };
  }

  if (provider === "gemini") {
    const r = await callGemini(prompt, systemPrompt);
    return { ...r, provider };
  }

  // Mock — returns realistic placeholder when no API key is set
  return { content: "", sources: [], provider: "mock" };
}

function parseJSON<T>(text: string): T | null {
  // 1. Try raw parse first
  try { return JSON.parse(text.trim()) as T; } catch { /* continue */ }

  // 2. Extract from ```json ... ``` fence
  const fence = text.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (fence) {
    try { return JSON.parse(fence[1].trim()) as T; } catch { /* continue */ }
  }

  // 3. Find the outermost { } block (grounded responses add prose around JSON)
  const start = text.indexOf("{");
  const end   = text.lastIndexOf("}");
  if (start !== -1 && end > start) {
    try { return JSON.parse(text.slice(start, end + 1)) as T; } catch { /* continue */ }
  }

  return null;
}

/* ─── Public API ──────────────────────────────────────────────────────────── */

/**
 * Analyze a single AI tool by searching the live web.
 * Returns a structured report in Turkish.
 */
export async function analyzeTool(params: {
  toolId:    string;
  toolName:  string;
  websiteUrl: string;
}): Promise<ToolAnalysisReport> {
  const { toolId, toolName, websiteUrl } = params;

  const systemPrompt = `Sen dünyanın en iyi yapay zeka araçları analistlerinden birisin. 
Web'i gerçek zamanlı olarak tarıyorsun ve kullanıcılara kesin, dürüst ve uygulanabilir analizler sunuyorsun.
Yanıtlarını her zaman geçerli JSON formatında ver.`;

  const { content, sources, provider } = await callAI(
    buildAnalysisPrompt(toolName, websiteUrl),
    systemPrompt
  );

  if (provider === "mock") {
    return buildMockReport(toolId, toolName, websiteUrl);
  }

  const parsed = parseJSON<Record<string, unknown>>(content);

  if (!parsed) {
    throw new Error("AI yanıtı JSON olarak parse edilemedi");
  }

  return {
    toolId,
    toolName,
    websiteUrl,
    analyzedAt:  new Date().toISOString(),
    provider,
    sources,
    rawResponse: content,

    summary:        String(parsed.summary        ?? ""),
    targetAudience: String(parsed.targetAudience  ?? ""),
    topFeatures:    Array.isArray(parsed.topFeatures) ? parsed.topFeatures.map(String) : [],
    pros:           Array.isArray(parsed.pros)        ? parsed.pros.map(String) : [],
    cons:           Array.isArray(parsed.cons)        ? parsed.cons.map(String) : [],

    pricing: {
      hasFree:       Boolean((parsed.pricing as Record<string,unknown>)?.hasFree),
      hasTrial:      Boolean((parsed.pricing as Record<string,unknown>)?.hasTrial),
      freeDetails:   String((parsed.pricing  as Record<string,unknown>)?.freeDetails   ?? ""),
      paidPlans:     String((parsed.pricing  as Record<string,unknown>)?.paidPlans     ?? ""),
      startingPrice: String((parsed.pricing  as Record<string,unknown>)?.startingPrice ?? ""),
      pricingTier:   (["free","freemium","paid","enterprise"].includes(String((parsed.pricing as Record<string,unknown>)?.pricingTier))
                       ? String((parsed.pricing as Record<string,unknown>).pricingTier)
                       : "freemium") as "free"|"freemium"|"paid"|"enterprise",
    },

    competitors:             Array.isArray(parsed.competitors) ? parsed.competitors.map(String) : [],
    turkishSupport:          (["full","partial","none"].includes(String(parsed.turkishSupport)) ? parsed.turkishSupport : "none") as "full"|"partial"|"none",
    turkishSupportNote:      String(parsed.turkishSupportNote      ?? ""),
    suggestedPopularity:     (["mainstream","known","niche","emerging"].includes(String(parsed.suggestedPopularity)) ? parsed.suggestedPopularity : "niche") as "mainstream"|"known"|"niche"|"emerging",
    suggestedEditorialScore: Number(parsed.suggestedEditorialScore ?? 7),
    suggestedCategory:       String(parsed.suggestedCategory       ?? ""),
    recommendation:          (["approve","reject","needs-info"].includes(String(parsed.recommendation)) ? parsed.recommendation : "needs-info") as "approve"|"reject"|"needs-info",
    recommendationReason:    String(parsed.recommendationReason    ?? ""),
  };
}

/**
 * AI-powered tool discovery — searches the live web for new AI tools.
 * Returns up to 10 candidates not yet in our database.
 */
export async function aiDiscoverNewTools(): Promise<AiDiscoveryScanResult> {
  const systemPrompt = `Sen yapay zeka araçları ekosistemini takip eden bir uzmansın.
İnterneti gerçek zamanlı olarak tarıyor ve en güncel, en ilginç araçları buluyorsun.
Yanıtlarını her zaman geçerli JSON formatında ver.`;

  const { content, sources, provider } = await callAI(buildDiscoveryPrompt(), systemPrompt);

  if (provider === "mock") {
    return { tools: [], scannedAt: new Date().toISOString(), provider: "mock", query: "mock", sources: [] };
  }

  const parsed = parseJSON<{ tools: unknown[]; sources?: string[] }>(content);
  if (!parsed?.tools) {
    return { tools: [], scannedAt: new Date().toISOString(), provider, query: buildDiscoveryPrompt(), sources };
  }

  const tools = (parsed.tools as Record<string,unknown>[]).map(t => ({
    name:                String(t.name            ?? ""),
    slug:                String(t.slug            ?? "").toLowerCase().replace(/\s+/g, "-"),
    websiteUrl:          String(t.websiteUrl       ?? ""),
    tagline:             String(t.tagline          ?? ""),
    rawDescription:      String(t.rawDescription   ?? ""),
    suggestedCategory:   String(t.suggestedCategory ?? ""),
    suggestedPopularity: (["mainstream","known","niche","emerging"].includes(String(t.suggestedPopularity))
                           ? t.suggestedPopularity : "niche") as "mainstream"|"known"|"niche"|"emerging",
    discoverySignal:     String(t.discoverySignal  ?? ""),
    whyInteresting:      String(t.whyInteresting   ?? ""),
  }));

  return {
    tools,
    scannedAt: new Date().toISOString(),
    provider,
    query:   buildDiscoveryPrompt(),
    sources: [...sources, ...(parsed.sources ?? [])],
  };
}

/* ─── Mock (no API key) ───────────────────────────────────────────────────── */

function buildMockReport(toolId: string, toolName: string, websiteUrl: string): ToolAnalysisReport {
  return {
    toolId,
    toolName,
    websiteUrl,
    analyzedAt:   new Date().toISOString(),
    provider:     "mock",
    sources:      [],
    summary:      `[MOCK] ${toolName} analizi için PERPLEXITY_API_KEY veya OPENAI_API_KEY gereklidir. Bu mock veridir.`,
    targetAudience: "API key eklendiğinde gerçek analiz yapılacak.",
    topFeatures:    ["API key ekle", "Perplexity önerilir", "PERPLEXITY_API_KEY=..."],
    pros:           ["Gerçek analiz için API key gerekli"],
    cons:           ["Şu an mock mod aktif"],
    pricing:        { hasFree: false, hasTrial: false, freeDetails: "", paidPlans: "", startingPrice: "", pricingTier: "freemium" },
    competitors:    [],
    turkishSupport:     "none",
    turkishSupportNote: "",
    suggestedPopularity:     "niche",
    suggestedEditorialScore: 7,
    suggestedCategory:       "",
    recommendation:          "needs-info",
    recommendationReason:    "Analiz yapılamadı — API key eksik.",
  };
}

export { getProvider };
