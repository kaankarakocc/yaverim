/**
 * Scoring engine types.
 *
 * Architecture: Rule-based filtering → Score-based ranking → LLM explanation layer.
 * Pure LLM reasoning is never the sole decision-maker.
 */

/** Score axes used to rank tools. Each is 0–10. */
export interface ToolScoreAxes {
  /** How well the tool fits the user's stated need */
  fitToNeed: number;
  /** How easy the tool is to learn and use */
  easeOfUse: number;
  /** Price relative to the value delivered */
  priceValue: number;
  /** Impact on individual/team productivity */
  productivityImpact: number;
  /** Impact on business growth */
  growthImpact: number;
  /** How well the tool integrates with common stacks (optional axis) */
  integrationFit?: number;
}

/** Weights applied per user context to produce a composite score. */
export interface ScoringWeights {
  fitToNeed: number;
  easeOfUse: number;
  priceValue: number;
  productivityImpact: number;
  growthImpact: number;
  integrationFit: number;
}

/** Default balanced weights — adjusted per user type in scoring engine. */
export const DEFAULT_WEIGHTS: ScoringWeights = {
  fitToNeed: 0.30,
  easeOfUse: 0.15,
  priceValue: 0.20,
  productivityImpact: 0.20,
  growthImpact: 0.10,
  integrationFit: 0.05,
};

/** Computes a 0–10 composite score from axes and weights. */
export function computeCompositeScore(
  axes: ToolScoreAxes,
  weights: ScoringWeights = DEFAULT_WEIGHTS
): number {
  const weighted =
    axes.fitToNeed * weights.fitToNeed +
    axes.easeOfUse * weights.easeOfUse +
    axes.priceValue * weights.priceValue +
    axes.productivityImpact * weights.productivityImpact +
    axes.growthImpact * weights.growthImpact +
    (axes.integrationFit ?? 5) * weights.integrationFit;

  return Math.round(weighted * 10) / 10;
}
