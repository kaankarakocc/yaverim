/**
 * Tool schema — TypeScript type definition.
 *
 * Mirrors the Prisma model. Used across the app for type safety
 * before and alongside the DB layer.
 *
 * Prisma enum mapping:
 *   ToolStatus      → ToolLifecycleStatus
 *   PricingTier     → PricingTier (lower-cased)
 *   DifficultyLevel → DifficultyLevel (lower-cased)
 *   TurkishSupport  → "none" | "partial" | "full"
 */

import type { SolutionArea, UserType } from "@/lib/recommendation/types";

export type ToolLifecycleStatus =
  | "candidate"
  | "tracked"
  | "core"
  | "priority"
  | "deprecated";

export type PricingTier = "free" | "low" | "mid" | "high" | "enterprise";

export type DifficultyLevel = "beginner" | "intermediate" | "advanced";

export interface ToolScoreData {
  /** How well the tool fits the typical need in its solution areas (0–10) */
  fitToNeed: number;
  /** How easy it is to get started and use effectively (0–10) */
  easeOfUse: number;
  /** Price relative to the value delivered (0–10, 10 = great value) */
  priceValue: number;
  /** Day-to-day productivity improvement (0–10) */
  productivityImpact: number;
  /** Long-term business growth potential (0–10) */
  growthImpact: number;
  /** Ease of integrating with other tools / workflows (0–10) */
  integrationFit: number;
}

export interface Tool {
  id: string;
  slug: string;

  /** Display name */
  name: string;

  /** One-liner shown on cards and in recommendations */
  tagline: string;

  /** Short human-readable pricing string for UI (e.g. "Ücretsiz · Plus $20/ay") */
  pricingLabel: string;

  /** Official website URL */
  websiteUrl: string;

  /** Relative path to logo asset — undefined until logos are added */
  logoPath?: string;

  /** Primary category (e.g. "Asistan", "SEO", "Tasarım") */
  category: string;

  /** Specific use case sub-tags */
  subUseCases: string[];

  /**
   * 2–3 strong signal phrases that distinguish this tool.
   * Used in recommendation rationale generation.
   */
  strongSignals: string[];

  /** Which user types this tool suits */
  suitableForUserTypes: UserType[];

  /** Industry / sector alignment tags */
  sectorFit: string[];

  /** Which solution areas this tool covers */
  solutionAreas: SolutionArea[];

  /** Does a meaningful free tier exist? */
  hasFree: boolean;

  /** Does a free trial exist (no credit card)? */
  hasTrial: boolean;

  /** Rough pricing tier — used for budget-based filtering */
  pricingTier: PricingTier;

  /** Does an affiliate / referral program exist? */
  hasAffiliate: boolean;

  /**
   * Direct affiliate/referral URL for this tool.
   * When set, all "visit site" CTAs use this URL instead of websiteUrl.
   * Must include utm_source=yaverim or the provider's tracking param.
   * null = use websiteUrl directly (no affiliate link configured yet).
   */
  affiliateUrl?: string | null;

  /** Short referral/tracking code (used in deep-link construction if needed) */
  affiliateCode?: string | null;

  /** Has Yaverim established a partner relationship? */
  hasPartnership: boolean;

  /**
   * How well-known / mainstream this tool is.
   *
   *   "mainstream" — everyone knows it (ChatGPT, Midjourney, Notion)
   *   "known"      — known in its niche, moderate search volume
   *   "niche"      — strong tool, but few outside the industry know it
   *   "emerging"   — new (< 18 months old) or rapidly rising, low awareness
   *
   * Used by the hidden-gems algorithm: only "niche" and "emerging" tools
   * qualify as hidden gems, regardless of score.
   */
  popularity: "mainstream" | "known" | "niche" | "emerging";

  /** Turkish language support quality */
  turkishSupport: "none" | "partial" | "full";

  /** Technical difficulty to get started and reach productive use */
  difficultyLevel: DifficultyLevel;

  /**
   * Editorial overall score (0–10) — context-independent.
   * Displayed on public ranking cards.
   * Independent of affiliate / monetization status.
   */
  editorialScore: number;

  /** Score axes — editorial, independent of monetization */
  scores: ToolScoreData;

  /** Key strengths (2–5 bullet points) */
  strengths: string[];

  /** Known limitations (2–4 bullet points) */
  weaknesses: string[];

  /** Why Yaverim recommends it — one paragraph */
  whyRecommended: string;

  /** Who should NOT use this tool */
  notSuitableFor: string[];

  /** Slugs of similar competing tools */
  similarTools: string[];

  /** Slugs of free alternatives */
  freeAlternatives: string[];

  /**
   * External platforms this tool depends on.
   * Tools with platform dependencies receive a scoring penalty when the user's
   * business context doesn't confirm they use that platform.
   *
   * Examples:
   *   ["shopify"]         → tool only makes sense in a Shopify store
   *   ["office365"]       → tool requires Microsoft 365 subscription
   *
   * Sprint 4+: derive from user's onboarding "platform" step when added.
   */
  platformDependencies?: string[];

  /**
   * True for general-purpose AI assistants (ChatGPT, Claude, Gemini, Copilot).
   * When set, the engine applies an additional penalty if the tool doesn't
   * explicitly cover the user's primary goal — preventing generalist tools
   * from dominating all recommendation contexts.
   */
  isGeneralistAssistant?: boolean;

  /** Lifecycle stage */
  status: ToolLifecycleStatus;

  updatedAt: string;
}
