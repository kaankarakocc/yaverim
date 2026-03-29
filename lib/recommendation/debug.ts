/**
 * Recommendation Engine — Debug Layer.
 *
 * Runs the same algorithm as engine.ts but captures every intermediate state:
 *   - Layer 1: filter pass/fail per tool
 *   - Layer 2: full score breakdown per axis
 *   - Layer 3: selection reason
 *
 * Used exclusively by /admin/debug — never imported by user-facing code.
 *
 * Architecture: this file mirrors engine.ts intentionally.
 * When engine.ts is refactored, keep this in sync.
 */

import { getTools } from "@/lib/tools/store";
import { GOAL_WEIGHTS, totalWeight } from "@/data/mappings/goal-weights";
import { toolMeetsBudget } from "@/data/mappings/budget-rules";
import type { Tool } from "@/data/schemas/tool";
import type { UserType, SolutionArea, BudgetTier } from "./types";
import { parseParams, type ParsedParams } from "./mock-engine";

/* ─── Debug types ────────────────────────────────────────────────────────── */

export interface ScoreAxisDebug {
  /** Tool's raw editorial score for this axis (0–10) */
  raw: number;
  /** Goal-specific weight applied */
  weight: number;
  /** raw × weight */
  weighted: number;
}

export interface ScoreBreakdown {
  fitToNeed:          ScoreAxisDebug;
  easeOfUse:          ScoreAxisDebug;
  priceValue:         ScoreAxisDebug;
  productivityImpact: ScoreAxisDebug;
  growthImpact:       ScoreAxisDebug;
  integrationFit:     ScoreAxisDebug;
  /** Sum of all weighted values */
  totalWeighted: number;
  /** totalWeighted / sum(weights) — normalized 0–10 */
  normalizedBase: number;
  /** +0.5 if tool covers primary goal */
  goalBonus: number;
  /** +0.3 if tool explicitly targets user type */
  typeBonus: number;
  /** Turkish support penalty */
  turkishPenalty: number;
  /** Platform dependency penalty */
  platformPenalty: number;
  /** Generalist assistant penalty (non-zero only if generalist + not covering primary goal) */
  generalistPenalty: number;
  /** Final composite score (capped at 10, floored at 0) */
  finalScore: number;
}

export interface FilterDebug {
  passedUserType: boolean;
  passedGoal:     boolean;
  passedBudget:   boolean;
  /** true if tool is in the working set for scoring */
  eligible:       boolean;
  /** Reason string when a filter fails */
  failReason?:    string;
}

export type SelectionRole = "best-fit" | "free-alt" | "power-alt";

export interface ToolDebugEntry {
  tool: Tool;
  filters: FilterDebug;
  /** Only present for eligible tools */
  scores?: ScoreBreakdown;
  /** Only present for the three selected tools */
  selectedAs?: SelectionRole;
  /** Rank within eligible tools (1 = highest score) */
  eligibleRank?: number;
}

export interface PenaltyDebug {
  turkish:     number;
  platform:    number;
  generalist:  number;
  total:       number;
}

export interface EngineDebugContext {
  userType:    string;
  goals:       string[];
  primaryGoal: string;
  budget:      string;
  team:        string;
  biz:         string;
}

export interface RecommendationDebugResult {
  context:         EngineDebugContext;
  allTools:        ToolDebugEntry[];
  eligibleCount:   number;
  widenedFilter:   boolean;
  finalSelection: {
    bestFit?: string;
    freeAlt?: string;
    powerAlt?: string;
  };
  generatedAt: string;
}

/* ─── Engine mirrors (kept in sync with engine.ts) ──────────────────────── */

const TURKISH_SENSITIVE_GOALS: SolutionArea[] = [
  "content", "advertising", "seo", "customer-support", "revenue",
];

function passesUserTypeFilter(tool: Tool, userType: UserType): boolean {
  if (userType === "individual") {
    return (
      tool.suitableForUserTypes.includes("individual") ||
      tool.suitableForUserTypes.includes("freelancer")
    );
  }
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

function computeTurkishPenalty(tool: Tool, primaryGoal: SolutionArea): number {
  const isSensitive = TURKISH_SENSITIVE_GOALS.includes(primaryGoal);
  if (tool.turkishSupport === "none")    return isSensitive ? 0.6 : 0.2;
  if (tool.turkishSupport === "partial") return isSensitive ? 0.2 : 0.05;
  return 0;
}

function computePlatformPenalty(tool: Tool, biz: string): number {
  if (!tool.platformDependencies || tool.platformDependencies.length === 0) return 0;
  const bizLower = biz.toLowerCase();
  const confirmed = tool.platformDependencies.some((dep) => bizLower.includes(dep));
  return confirmed ? 0 : 0.9;
}

function computeGeneralistPenalty(tool: Tool, primaryGoal: SolutionArea): number {
  if (!tool.isGeneralistAssistant) return 0;
  if ((tool.solutionAreas as string[]).includes(primaryGoal)) return 0;
  return 0.4;
}

function computeBreakdown(
  tool: Tool,
  primaryGoal: SolutionArea,
  userType: UserType,
  biz: string,
): ScoreBreakdown {
  const w  = GOAL_WEIGHTS[primaryGoal] ?? GOAL_WEIGHTS.content;
  const tw = totalWeight(w);

  function axis(raw: number, weight: number): ScoreAxisDebug {
    return { raw, weight, weighted: raw * weight };
  }

  const axes = {
    fitToNeed:          axis(tool.scores.fitToNeed,          w.fitToNeed),
    easeOfUse:          axis(tool.scores.easeOfUse,          w.easeOfUse),
    priceValue:         axis(tool.scores.priceValue,         w.priceValue),
    productivityImpact: axis(tool.scores.productivityImpact, w.productivityImpact),
    growthImpact:       axis(tool.scores.growthImpact,       w.growthImpact),
    integrationFit:     axis(tool.scores.integrationFit,     w.integrationFit),
  };

  const totalWeighted =
    axes.fitToNeed.weighted +
    axes.easeOfUse.weighted +
    axes.priceValue.weighted +
    axes.productivityImpact.weighted +
    axes.growthImpact.weighted +
    axes.integrationFit.weighted;

  const normalizedBase     = totalWeighted / tw;
  const goalBonus          = (tool.solutionAreas as string[]).includes(primaryGoal) ? 0.5 : 0;
  const typeBonus          = tool.suitableForUserTypes.includes(userType) ? 0.3 : 0;
  const tPenalty           = computeTurkishPenalty(tool, primaryGoal);
  const pPenalty           = computePlatformPenalty(tool, biz);
  const gPenalty           = computeGeneralistPenalty(tool, primaryGoal);

  return {
    ...axes,
    totalWeighted,
    normalizedBase,
    goalBonus,
    typeBonus,
    turkishPenalty:   tPenalty,
    platformPenalty:  pPenalty,
    generalistPenalty: gPenalty,
    finalScore: Math.max(0, Math.min(10, normalizedBase + goalBonus + typeBonus - tPenalty - pPenalty - gPenalty)),
  };
}

/* ─── Public debug API ───────────────────────────────────────────────────── */

export function debugRecommendation(params: ParsedParams): RecommendationDebugResult {
  const { userType, budget, team, goals, biz } = parseParams(params);
  const bizStr = biz ?? "";
  const primaryGoal = (goals[0] as SolutionArea) ?? "content";

  /* Layer 1: classify every tool */
  const entries: ToolDebugEntry[] = getTools().map((tool) => {
    const passedUserType = passesUserTypeFilter(tool, userType as UserType);
    const passedGoal     = passesGoalFilter(tool, goals as SolutionArea[]);
    const passedBudget   = toolMeetsBudget(tool, budget as BudgetTier);

    const reasons: string[] = [];
    if (!passedUserType) reasons.push(`user type (${userType}) mismatch`);
    if (!passedGoal)     reasons.push(`no overlap with goals [${goals.join(", ")}]`);
    if (!passedBudget)   reasons.push(`pricingTier (${tool.pricingTier}) exceeds budget (${budget})`);

    return {
      tool,
      filters: {
        passedUserType,
        passedGoal,
        passedBudget,
        eligible: passedUserType && passedGoal && passedBudget,
        failReason: reasons.length ? reasons.join("; ") : undefined,
      },
    };
  });

  let eligible = entries.filter((e) => e.filters.eligible);
  const widenedFilter = eligible.length < 4;

  /* Widen: drop budget constraint */
  if (eligible.length < 4) {
    const widened = entries.filter((e) => e.filters.passedUserType && e.filters.passedGoal);
    for (const e of widened) {
      if (!e.filters.eligible) {
        e.filters.eligible = true;
        e.filters.failReason = undefined;
        // Mark budget filter as bypassed
        e.filters.passedBudget = false; // still track original
      }
    }
    eligible = entries.filter((e) => e.filters.eligible);
  }

  /* Layer 2: score eligible tools */
  const rankedEligible = eligible
    .map((e) => ({
      entry: e,
      breakdown: computeBreakdown(e.tool, primaryGoal as SolutionArea, userType as UserType, bizStr),
    }))
    .sort((a, b) => b.breakdown.finalScore - a.breakdown.finalScore);

  rankedEligible.forEach(({ entry, breakdown }, idx) => {
    entry.scores       = breakdown;
    entry.eligibleRank = idx + 1;
  });

  /* Layer 3: determine selection */
  const [bestFitEntry, ...rest] = rankedEligible;
  const freeAltEntry  = rest.find((r) => r.entry.tool.hasFree);
  const powerAltEntry = rest.find(
    (r) =>
      r.entry !== freeAltEntry?.entry &&
      ["mid", "high"].includes(r.entry.tool.pricingTier)
  ) ?? rest.find((r) => r.entry !== freeAltEntry?.entry);

  if (bestFitEntry)  { bestFitEntry.entry.selectedAs  = "best-fit";  }
  if (freeAltEntry)  { freeAltEntry.entry.selectedAs  = "free-alt";  }
  if (powerAltEntry) { powerAltEntry.entry.selectedAs = "power-alt"; }

  return {
    context: {
      userType,
      goals: goals as string[],
      primaryGoal,
      budget,
      team,
      biz,
    },
    allTools: entries.sort((a, b) => {
      // Eligible and selected first, then eligible unselected, then ineligible
      const aScore = a.scores?.finalScore ?? -1;
      const bScore = b.scores?.finalScore ?? -1;
      if (a.filters.eligible !== b.filters.eligible) {
        return a.filters.eligible ? -1 : 1;
      }
      return bScore - aScore;
    }),
    eligibleCount: eligible.length,
    widenedFilter,
    finalSelection: {
      bestFit:  bestFitEntry?.entry.tool.slug,
      freeAlt:  freeAltEntry?.entry.tool.slug,
      powerAlt: powerAltEntry?.entry.tool.slug,
    },
    generatedAt: new Date().toISOString(),
  };
}
