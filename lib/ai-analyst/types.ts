/**
 * AI Tool Analyst — report types.
 *
 * When you click "AI ile Analiz Et" in the discovery queue, the analyzer
 * calls Perplexity Sonar (or OpenAI) which searches the live web, reads the
 * tool's site, finds reviews and pricing, then returns this structured report.
 */

export type AnalysisProvider = "perplexity" | "openai" | "gemini" | "mock";

export type AnalysisRecommendation = "approve" | "reject" | "needs-info";

export interface PricingAnalysis {
  hasFree:       boolean;
  hasTrial:      boolean;
  freeDetails:   string;  // "Sınırsız ücretsiz katman var" | "14 günlük deneme" etc.
  paidPlans:     string;  // human-readable summary of paid tiers
  startingPrice: string;  // "$9/ay", "Ücretsiz", "Enterprise only" etc.
  pricingTier:   "free" | "freemium" | "paid" | "enterprise";
}

export interface ToolAnalysisReport {
  /** Internal id — matches the DiscoveredTool id */
  toolId: string;

  toolName:    string;
  websiteUrl:  string;
  analyzedAt:  string;
  provider:    AnalysisProvider;

  /** 2-3 sentence overview in Turkish */
  summary: string;

  /** Who benefits most from this tool */
  targetAudience: string;

  /** Top 3-5 concrete capabilities */
  topFeatures: string[];

  /** Real advantages — not marketing copy */
  pros: string[];

  /** Honest weaknesses / limitations */
  cons: string[];

  pricing: PricingAnalysis;

  /** Direct competitors */
  competitors: string[];

  /**
   * Turkish language / locale support.
   * full = UI + support in Turkish
   * partial = some Turkish, mostly English
   * none = English only
   */
  turkishSupport:     "full" | "partial" | "none";
  turkishSupportNote: string;

  /** Suggested popularity tier based on web presence */
  suggestedPopularity: "mainstream" | "known" | "niche" | "emerging";

  /** Suggested editorial score 1–10 */
  suggestedEditorialScore: number;

  /** Suggested category */
  suggestedCategory: string;

  /** AI's verdict + clear reasoning */
  recommendation:       AnalysisRecommendation;
  recommendationReason: string;

  /** URLs the AI cited to produce this report */
  sources: string[];

  /** Raw text response for debugging */
  rawResponse?: string;
}

export interface AiDiscoveredTool {
  name:           string;
  slug:           string;
  websiteUrl:     string;
  tagline:        string;
  rawDescription: string;
  suggestedCategory:   string;
  suggestedPopularity: "mainstream" | "known" | "niche" | "emerging";
  discoverySignal:     string;
  whyInteresting:      string;
}

export interface AiDiscoveryScanResult {
  tools:      AiDiscoveredTool[];
  scannedAt:  string;
  provider:   AnalysisProvider;
  query:      string;
  sources:    string[];
}
