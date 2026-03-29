/**
 * Discovery scanner — finds new AI tools to review.
 *
 * TODAY:   Generates realistic candidates from a curated watch-list.
 *          Each "source" has a list of known emerging tools.
 *          The scanner picks tools not already in the seed or queue.
 *
 * FUTURE:  Replace generateCandidates() with real API calls:
 *   - Product Hunt API (trending AI tools this week)
 *   - There's An AI For That (new additions RSS)
 *   - Futurepedia (new tools section)
 *   - Custom web scraper / Apify actor
 *
 * The function signatures stay the same — calling code never changes.
 */

import { randomUUID } from "crypto";
import { getTools }   from "@/lib/tools/store";
import type { DiscoveredTool, DiscoverySource } from "./types";

/* ─── Watch-list candidates ──────────────────────────────────────────────── */
// These are real tools that could be discovered via the sources below.
// In production, these would come from live API responses.

interface Candidate {
  slug:               string;
  name:               string;
  tagline:            string;
  websiteUrl:         string;
  source:             DiscoverySource;
  rawDescription:     string;
  suggestedCategory:  string;
  suggestedPopularity: DiscoveredTool["suggestedPopularity"];
  discoverySignal:    string;
}

const WATCH_LIST: Candidate[] = [
  /* ── Product Hunt discovers ── */
  {
    slug: "perplexity-pages", name: "Perplexity Pages", tagline: "AI ile hızlı research dökümanları oluştur",
    websiteUrl: "https://perplexity.ai/pages", source: "product-hunt",
    rawDescription: "Perplexity'nin yeni özelliği — araştırmanı tek tıkla paylaşılabilir sayfalara dönüştür.",
    suggestedCategory: "Araştırma", suggestedPopularity: "known",
    discoverySignal: "Product Hunt #1 of the day · 2,400+ upvote",
  },
  {
    slug: "ideogram", name: "Ideogram AI", tagline: "Metinden görsel üretiminde en iyi tipografi",
    websiteUrl: "https://ideogram.ai", source: "product-hunt",
    rawDescription: "Midjourney ve DALL-E'nin aksine Ideogram, görsele metin yerleştirmeyi başarıyla çözüyor.",
    suggestedCategory: "Tasarım", suggestedPopularity: "niche",
    discoverySignal: "Product Hunt maker of the week · hızlı büyüyen kullanıcı tabanı",
  },
  {
    slug: "napkin-ai", name: "Napkin AI", tagline: "Metinden otomatik diyagram ve görsel üretimi",
    websiteUrl: "https://napkin.ai", source: "product-hunt",
    rawDescription: "Metni akış diyagramlarına, infografiklere ve slayt görsellerine dönüştürüyor.",
    suggestedCategory: "Tasarım", suggestedPopularity: "niche",
    discoverySignal: "Product Hunt #2 of the week · çok paylaşılan LinkedIn görselleri",
  },
  {
    slug: "gamma-app", name: "Gamma", tagline: "AI ile slayt ve sunum otomatik oluştur",
    websiteUrl: "https://gamma.app", source: "product-hunt",
    rawDescription: "PowerPoint'e alternatif — prompt yaz, sunum hazır. Animasyonlu ve interaktif.",
    suggestedCategory: "Verimlilik", suggestedPopularity: "known",
    discoverySignal: "Product Hunt Golden Kitty Award · 2M+ kullanıcı",
  },
  /* ── There's An AI For That ── */
  {
    slug: "beautiful-ai", name: "Beautiful.ai", tagline: "Otomatik düzenlenen akıllı sunum şablonları",
    websiteUrl: "https://beautiful.ai", source: "there-is-an-ai",
    rawDescription: "Sunum slaytları içerik eklenince otomatik yeniden düzenleniyor.",
    suggestedCategory: "Verimlilik", suggestedPopularity: "niche",
    discoverySignal: "There's An AI For That top 10 presentation tools",
  },
  {
    slug: "consensus-app", name: "Consensus", tagline: "Akademik makalelerden AI destekli araştırma",
    websiteUrl: "https://consensus.app", source: "there-is-an-ai",
    rawDescription: "200M+ akademik makalede arama yap, AI ile bilimsel konsensüs bul.",
    suggestedCategory: "Araştırma", suggestedPopularity: "niche",
    discoverySignal: "There's An AI For That öne çıkan araç · akademik niş",
  },
  {
    slug: "luma-ai", name: "Luma Dream Machine", tagline: "Gerçekçi video üretimi için en güçlü model",
    websiteUrl: "https://lumalabs.ai/dream-machine", source: "there-is-an-ai",
    rawDescription: "Sora rakibi — son derece gerçekçi kısa video üretimi.",
    suggestedCategory: "Video", suggestedPopularity: "niche",
    discoverySignal: "Viral demo videoları · Sora alternatifi olarak öne çıktı",
  },
  /* ── Futurepedia ── */
  {
    slug: "cursor-composer", name: "Cursor Composer", tagline: "Tüm proje bazında AI kod üretimi",
    websiteUrl: "https://cursor.sh/composer", source: "futurepedia",
    rawDescription: "Cursor'ın yeni Composer özelliği — tek promptla birden fazla dosyayı düzenle.",
    suggestedCategory: "Geliştirici", suggestedPopularity: "known",
    discoverySignal: "Futurepedia en çok konuşulan araç · Twitter/X trending",
  },
  {
    slug: "bolt-new", name: "Bolt.new", tagline: "Tarayıcıda tam stack uygulama geliştir",
    websiteUrl: "https://bolt.new", source: "futurepedia",
    rawDescription: "StackBlitz + AI — tarayıcıda deploy edilebilir fullstack uygulama üret.",
    suggestedCategory: "Geliştirici", suggestedPopularity: "known",
    discoverySignal: "Futurepedia trending · no-code developer kitlesi çok ilgili",
  },
  {
    slug: "lovable", name: "Lovable", tagline: "Yapay zeka ile saniyeler içinde web uygulaması",
    websiteUrl: "https://lovable.dev", source: "futurepedia",
    rawDescription: "Prompt yaz → çalışan React uygulaması anında hazır. Bolt.new rakibi.",
    suggestedCategory: "Geliştirici", suggestedPopularity: "emerging",
    discoverySignal: "Futurepedia hızlı büyüyen araç · 500k+ kullanıcı 3 ayda",
  },
  /* ── GitHub Trending ── */
  {
    slug: "open-webui", name: "Open WebUI", tagline: "Kendi sunucunda ChatGPT deneyimi — ücretsiz",
    websiteUrl: "https://github.com/open-webui/open-webui", source: "github-trending",
    rawDescription: "Ollama ve OpenAI uyumlu self-hosted AI arayüzü.",
    suggestedCategory: "Asistan", suggestedPopularity: "niche",
    discoverySignal: "GitHub 30k+ star · self-hosted AI trendi",
  },
  {
    slug: "langflow", name: "Langflow", tagline: "LangChain akışlarını görsel olarak tasarla",
    websiteUrl: "https://langflow.org", source: "github-trending",
    rawDescription: "LangChain agent ve pipeline'larını sürükle-bırak ile oluştur.",
    suggestedCategory: "Otomasyon", suggestedPopularity: "niche",
    discoverySignal: "GitHub 20k+ star · LangChain ekosistemi büyümesi",
  },
  /* ── Competitor watch ── */
  {
    slug: "perplexity-sonar", name: "Perplexity Sonar API", tagline: "Gerçek zamanlı web aramalı AI API",
    websiteUrl: "https://perplexity.ai/api", source: "competitor-watch",
    rawDescription: "Geliştiricilere yönelik Perplexity API — her yanıtta güncel web kaynakları.",
    suggestedCategory: "Geliştirici", suggestedPopularity: "niche",
    discoverySignal: "Competitor watch: Perplexity API abone sayısı artışı",
  },
  {
    slug: "mistral-ai", name: "Mistral AI", tagline: "Açık kaynak ve API bazlı Avrupa AI modeli",
    websiteUrl: "https://mistral.ai", source: "competitor-watch",
    rawDescription: "Güçlü Avrupalı LLM — açık kaynak ve GDPR uyumlu versiyon mevcut.",
    suggestedCategory: "Asistan", suggestedPopularity: "known",
    discoverySignal: "Competitor watch: Anthropic/OpenAI alternatifleri büyüyor",
  },
  {
    slug: "blackbox-ai", name: "Blackbox AI", tagline: "Kod yazarken gerçek zamanlı AI kod asistanı",
    websiteUrl: "https://blackbox.ai", source: "competitor-watch",
    rawDescription: "GitHub Copilot rakibi — daha geniş dil desteği ve daha ucuz.",
    suggestedCategory: "Geliştirici", suggestedPopularity: "niche",
    discoverySignal: "Competitor watch: Copilot rakibi niche kullanıcı tabanı büyüyor",
  },
];

/* ─── Scanner logic ──────────────────────────────────────────────────────── */

/** Slugs already in the seed — never re-suggest these */
function getExistingSlugs(): Set<string> {
  return new Set(getTools().map(t => t.slug));
}

/**
 * Run a discovery scan.
 * Returns tools from the watch-list that are NOT already in the seed.
 *
 * In production: replace WATCH_LIST with live API responses.
 * The return type stays the same.
 */
export function runDiscoveryScan(options: {
  maxResults?: number;
  sources?:    DiscoverySource[];
} = {}): { tools: DiscoveredTool[]; scannedAt: string } {
  const { maxResults = 10, sources } = options;
  const existing = getExistingSlugs();
  const now = new Date().toISOString();

  let candidates = WATCH_LIST.filter(c => !existing.has(c.slug));

  if (sources && sources.length > 0) {
    candidates = candidates.filter(c => sources.includes(c.source));
  }

  // Shuffle slightly so repeated scans surface different items
  candidates = [...candidates].sort(() => Math.random() - 0.5);

  const tools: DiscoveredTool[] = candidates.slice(0, maxResults).map(c => ({
    id:                  randomUUID(),
    slug:                c.slug,
    name:                c.name,
    tagline:             c.tagline,
    websiteUrl:          c.websiteUrl,
    source:              c.source,
    rawDescription:      c.rawDescription,
    suggestedCategory:   c.suggestedCategory,
    suggestedPopularity: c.suggestedPopularity,
    discoverySignal:     c.discoverySignal,
    discoveredAt:        now,
    status:              "pending",
  }));

  return { tools, scannedAt: now };
}

export type { DiscoverySource };
