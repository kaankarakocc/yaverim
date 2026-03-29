/**
 * Budget-based tool filtering rules.
 *
 * Maps user budget preference to tool pricing tier constraints.
 * Layer 1 of the recommendation engine (rule-based filtering).
 */

import type { BudgetTier } from "@/lib/recommendation/types";
import type { PricingTier, Tool } from "@/data/schemas/tool";

/**
 * Returns true if the tool is accessible under the given budget tier.
 *
 * Mapping rationale:
 *   free-only → only tools with hasFree = true (regardless of paid tier)
 *   low       → free tools + low pricing tier ($0–$30/ay range)
 *   mid       → free + low + mid pricing tiers ($0–$120/ay range)
 *   best      → all tiers (user explicitly wants the best regardless of cost)
 */
export function toolMeetsBudget(tool: Tool, budget: BudgetTier): boolean {
  if (budget === "best") return true;

  if (budget === "free-only") {
    return tool.hasFree;
  }

  const ALLOWED: Record<Exclude<BudgetTier, "best" | "free-only">, PricingTier[]> = {
    low: ["free", "low"],
    mid: ["free", "low", "mid"],
  };

  // Always include tools with a free plan, even if they have a paid tier
  if (tool.hasFree) return true;

  return ALLOWED[budget].includes(tool.pricingTier);
}

/**
 * Returns the minimum budget tier required to access any paid features of the tool.
 */
export function minimumBudgetFor(tool: Tool): BudgetTier {
  if (tool.hasFree) return "free-only";
  switch (tool.pricingTier) {
    case "free": return "free-only";
    case "low":  return "low";
    case "mid":  return "mid";
    default:     return "best";
  }
}
