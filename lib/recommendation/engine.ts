/**
 * Yaverim Recommendation Engine v2.
 *
 * Replaces the mock engine's random selection with real seed-data-driven logic.
 *
 * Architecture (per master-build-prompt §11):
 *   Layer 1 — Rule-based filtering   (user type · budget · goal area)
 *   Layer 2 — Score-based ranking    (weighted composite score per context)
 *   Layer 3 — Explanation layer      (diagnosis + rationale text from tool data)
 *
 * Returns the same MockResult shape consumed by the results page,
 * making it a drop-in replacement for generateMockResult().
 *
 * Sprint 4+: Replace TOOLS import with a real DB query (Prisma).
 *            Replace getDiagnosis() with an LLM call for richer text.
 */

import { getTools } from "@/lib/tools/store";
import { GOAL_WEIGHTS, totalWeight } from "@/data/mappings/goal-weights";
import { toolMeetsBudget } from "@/data/mappings/budget-rules";
import { getDiagnosis } from "@/data/mappings/diagnosis-templates";
import type { Tool } from "@/data/schemas/tool";
import type { UserType, SolutionArea, BudgetTier, TeamStructure } from "./types";

/* Re-export for consumers that previously imported from mock-engine */
export type {
  DecisionCard,
  DecisionRole,
  MiniTool,
  MockResult,
  ParsedParams,
  SolutionAreaResult,
  WhyTheseReason,
} from "./mock-engine";

export {
  parseParams,
  USER_TYPE_LABELS,
  TEAM_LABELS,
  BUDGET_LABELS,
  GOAL_LABELS,
  GOAL_DESCRIPTIONS,
} from "./mock-engine";

import type {
  MockResult,
  DecisionCard,
  MiniTool,
  SolutionAreaResult,
} from "./mock-engine";
import {
  parseParams,
  USER_TYPE_LABELS,
  TEAM_LABELS,
  BUDGET_LABELS,
  GOAL_LABELS,
  type ParsedParams,
} from "./mock-engine";

/* ─── Internal types ─────────────────────────────────────────────────────── */

interface ScoredTool {
  tool: Tool;
  /** Context-sensitive composite score (0–10) */
  score: number;
}

/* ─── Layer 1: Rule-based filtering ─────────────────────────────────────── */

function passesUserTypeFilter(tool: Tool, userType: UserType): boolean {
  // Solo individuals can use tools intended for freelancers too
  if (userType === "individual") {
    return (
      tool.suitableForUserTypes.includes("individual") ||
      tool.suitableForUserTypes.includes("freelancer")
    );
  }
  // Teams can use tools intended for founders
  if (userType === "team") {
    return (
      tool.suitableForUserTypes.includes("team") ||
      tool.suitableForUserTypes.includes("founder")
    );
  }
  return tool.suitableForUserTypes.includes(userType);
}

function passesGoalFilter(tool: Tool, goals: SolutionArea[]): boolean {
  return goals.some((g) => (tool.solutionAreas as string[]).includes(g));
}

/* ─── Layer 2: Penalty functions ────────────────────────────────────────── */

/**
 * Goals where Turkish language quality directly affects output quality.
 * Development/design tools are exempt from heavy Turkish penalties.
 */
const TURKISH_SENSITIVE_GOALS: SolutionArea[] = [
  "content", "advertising", "seo", "customer-support", "revenue",
];

/**
 * Turkish support penalty.
 * Yaverim targets Turkish users — tools without Turkish support should rank
 * lower in language-sensitive contexts (content, advertising, SEO, CS).
 */
function turkishPenalty(tool: Tool, primaryGoal: SolutionArea): number {
  const isSensitive = TURKISH_SENSITIVE_GOALS.includes(primaryGoal);
  if (tool.turkishSupport === "none") {
    return isSensitive ? 0.6 : 0.2;
  }
  if (tool.turkishSupport === "partial") {
    return isSensitive ? 0.2 : 0.05;
  }
  return 0;
}

/**
 * Platform dependency penalty.
 * If a tool requires a specific platform (e.g. Shopify) but the user's
 * business context doesn't mention it, rank lower.
 * Reads the free-text `biz` field from onboarding for platform signals.
 */
function platformPenalty(tool: Tool, biz: string): number {
  if (!tool.platformDependencies || tool.platformDependencies.length === 0) return 0;
  const bizLower = biz.toLowerCase();
  const confirmed = tool.platformDependencies.some((dep) => bizLower.includes(dep));
  return confirmed ? 0 : 0.9;
}

/**
 * Generalist assistant penalty.
 * ChatGPT, Claude, Gemini etc. have universally high scores but should NOT
 * dominate goal-specific contexts (SEO, advertising, ecommerce) where
 * purpose-built tools exist.
 *
 * Applied when: tool is a generalist assistant AND doesn't cover the primary goal.
 * This stacks with the missing goalBonus to create a meaningful gap.
 */
function generalistPenalty(tool: Tool, primaryGoal: SolutionArea): number {
  if (!tool.isGeneralistAssistant) return 0;
  if ((tool.solutionAreas as string[]).includes(primaryGoal)) return 0;
  return 0.4;
}

/* ─── Layer 2: Score-based ranking ──────────────────────────────────────── */

function computeScore(
  tool: Tool,
  primaryGoal: SolutionArea,
  userType: UserType,
  biz: string,
): number {
  const w = GOAL_WEIGHTS[primaryGoal] ?? GOAL_WEIGHTS.content;
  const tw = totalWeight(w);

  const base =
    (tool.scores.fitToNeed          * w.fitToNeed +
     tool.scores.easeOfUse          * w.easeOfUse +
     tool.scores.priceValue         * w.priceValue +
     tool.scores.productivityImpact * w.productivityImpact +
     tool.scores.growthImpact       * w.growthImpact +
     tool.scores.integrationFit     * w.integrationFit) /
    tw;

  // Bonus: tool explicitly covers the primary goal.
  // Raised to 0.5 so specialized tools (Semrush for SEO, Tidio for CS)
  // reliably outrank general-purpose assistants in goal-specific scenarios.
  const goalBonus = (tool.solutionAreas as string[]).includes(primaryGoal) ? 0.5 : 0;

  // Bonus: tool is designed for this exact user type.
  // Raised to 0.3 to better differentiate recommendations by user context.
  const typeBonus = tool.suitableForUserTypes.includes(userType) ? 0.3 : 0;

  const penalties =
    turkishPenalty(tool, primaryGoal) +
    platformPenalty(tool, biz) +
    generalistPenalty(tool, primaryGoal);

  return Math.max(0, Math.min(10, base + goalBonus + typeBonus - penalties));
}

/* ─── Layer 3: Explanation helpers ──────────────────────────────────────── */

function buildNote(tool: Tool, role: "best-fit" | "free-alt" | "power-alt"): string {
  if (role === "best-fit") {
    return tool.strongSignals[0] ?? tool.whyRecommended.slice(0, 100);
  }
  if (role === "free-alt") {
    return tool.hasFree
      ? `Ücretsiz planıyla başlamak için güvenli seçim. ${tool.strongSignals[0] ?? ""}`
      : tool.strongSignals[0] ?? "";
  }
  // power-alt
  return tool.strongSignals[0] ?? `Daha yüksek kapasiteye ihtiyaç duyduğunda ${tool.name} devreye girer.`;
}

/* ─── Decision card selectors ────────────────────────────────────────────── */

function toDecisionCard(
  scored: ScoredTool | undefined,
  role: "best-fit" | "free-alt" | "power-alt"
): DecisionCard | null {
  if (!scored) return null;
  const { tool, score } = scored;
  return {
    role,
    slug: tool.slug,
    name: tool.name,
    tagline: tool.tagline,
    note: buildNote(tool, role),
    hasFree: tool.hasFree,
    pricingLabel: tool.pricingLabel,
    compositeScore: Math.round(score * 10) / 10,
    websiteUrl: tool.websiteUrl,
  };
}

function selectDecisionCards(
  ranked: ScoredTool[],
  budget: BudgetTier
): DecisionCard[] {
  const bestFit = ranked[0];

  // Free alt: highest-scored tool with a free plan, different from bestFit
  const freeAlt = ranked.find(
    (s) => s.tool.hasFree && s.tool.slug !== bestFit?.tool.slug
  );

  // Power alt: higher editorial score or higher pricing tier (indicates more capability),
  // different from both bestFit and freeAlt, and affordable under the budget
  const powerAlt =
    ranked.find(
      (s) =>
        s.tool.slug !== bestFit?.tool.slug &&
        s.tool.slug !== freeAlt?.tool.slug &&
        (s.tool.pricingTier === "mid" || s.tool.pricingTier === "high") &&
        toolMeetsBudget(s.tool, budget === "free-only" ? "low" : budget)
    ) ??
    ranked.find(
      (s) =>
        s.tool.slug !== bestFit?.tool.slug &&
        s.tool.slug !== freeAlt?.tool.slug
    );

  return [
    toDecisionCard(bestFit, "best-fit"),
    toDecisionCard(freeAlt, "free-alt"),
    toDecisionCard(powerAlt, "power-alt"),
  ].filter((c): c is DecisionCard => c !== null);
}

/* ─── Solution area builder ──────────────────────────────────────────────── */

function buildSolutionAreas(
  ranked: ScoredTool[],
  goals: SolutionArea[],
  budget: BudgetTier
): SolutionAreaResult[] {
  const GOAL_DESCRIPTIONS: Record<SolutionArea, string> = {
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
  }

  const GOAL_LABELS_LOCAL: Record<SolutionArea, string> = {
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

  return goals
    .slice(0, 3)
    .map((area) => {
      const areaTools = ranked
        .filter(
          (s) =>
            (s.tool.solutionAreas as string[]).includes(area) &&
            toolMeetsBudget(s.tool, budget)
        )
        .slice(0, 4)
        .map<MiniTool>((s) => ({
          slug: s.tool.slug,
          name: s.tool.name,
          tagline: s.tool.tagline,
          rationale:
            s.tool.strongSignals[0] ??
            s.tool.whyRecommended.slice(0, 120),
          hasFree: s.tool.hasFree,
          pricingLabel: s.tool.pricingLabel,
          compositeScore: Math.round(s.score * 10) / 10,
          websiteUrl: s.tool.websiteUrl,
        }));

      return {
        area,
        label: GOAL_LABELS_LOCAL[area],
        description: GOAL_DESCRIPTIONS[area],
        tools: areaTools,
      } satisfies SolutionAreaResult;
    })
    .filter((r) => r.tools.length > 0);
}

/* ─── Public API ─────────────────────────────────────────────────────────── */

/**
 * Generate a personalized recommendation result from URL search params.
 */
export function recommend(params: ParsedParams): MockResult {
  const { userType, budget, team, goals, biz } = parseParams(params);
  const primaryGoal: SolutionArea = (goals[0] as SolutionArea) ?? "content";

  /* ── Layer 1: Rule-based filtering ── */
  let eligible = getTools().filter(
    (t) =>
      passesUserTypeFilter(t, userType) &&
      passesGoalFilter(t, goals as SolutionArea[])
  );

  if (eligible.length < 3) {
    eligible = getTools().filter((t) => passesUserTypeFilter(t, userType));
  }
  if (eligible.length < 3) {
    eligible = getTools();
  }

  /* ── Layer 2: Score-based ranking ── */
  const ranked: ScoredTool[] = eligible
    .map((tool) => ({
      tool,
      score: computeScore(tool, primaryGoal, userType, biz),
    }))
    .sort((a, b) => b.score - a.score);

  /* ── Layer 3: Build result components ── */
  const decisionCards = selectDecisionCards(ranked, budget);
  const solutionAreas = buildSolutionAreas(ranked, goals as SolutionArea[], budget);

  const { short, details } = getDiagnosis(userType, primaryGoal);

  const contextParts: string[] = [USER_TYPE_LABELS[userType as UserType]];
  if (goals.length > 0) {
    const goalLabels: Record<string, string> = {
      content: "İçerik", advertising: "Reklam", seo: "SEO",
      development: "Geliştirme", design: "Tasarım", operations: "Operasyon",
      ecommerce: "E-Ticaret", "customer-support": "Destek",
      revenue: "Gelir", "cost-reduction": "Maliyet",
    };
    contextParts.push(
      (goals as SolutionArea[]).slice(0, 3).map((g) => goalLabels[g] ?? g).join(" + ")
    );
  }
  if (biz) contextParts.push(biz);
  contextParts.push(TEAM_LABELS[team as TeamStructure]);

  const whyLabels: Record<string, string> = {
    content: "İçerik", advertising: "Reklam", seo: "SEO",
    development: "Geliştirme", design: "Tasarım", operations: "Operasyon",
    ecommerce: "E-Ticaret", "customer-support": "Destek",
    revenue: "Gelir", "cost-reduction": "Maliyet",
  };

  return {
    contextLabel: contextParts.join(" · "),
    diagnosis: short,
    diagnosisDetails: details,
    decisionCards,
    whyThese: [
      { label: "Kullanıcı tipi",   value: USER_TYPE_LABELS[userType as UserType] },
      { label: "Hedef alanlar",    value: (goals as SolutionArea[]).slice(0, 3).map((g) => whyLabels[g] ?? g).join(", ") },
      { label: "Bütçe yaklaşımı", value: BUDGET_LABELS[budget as BudgetTier] },
      { label: "Ekip yapısı",     value: TEAM_LABELS[team as TeamStructure] },
    ],
    solutionAreas,
  };
}

/** Alias matching the mock-engine function name — for easy migration */
export const generateRecommendation = recommend;

