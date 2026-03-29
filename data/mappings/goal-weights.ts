/**
 * Scoring weights per solution area.
 *
 * Each weight controls how much a score axis contributes to
 * the context-sensitive composite score for a given goal.
 *
 * Weights are relative (not necessarily summing to 1 — division
 * normalizes the result to 0–10 range in the engine).
 *
 * Layer 2 of the recommendation engine (score-based ranking).
 */

import type { SolutionArea } from "@/lib/recommendation/types";

export interface ScoreWeights {
  fitToNeed: number;
  easeOfUse: number;
  priceValue: number;
  productivityImpact: number;
  growthImpact: number;
  integrationFit: number;
}

/**
 * Per-goal weight configuration.
 *
 * Design rationale:
 * - content: productivity and fit are most critical; price matters for freelancers
 * - advertising: growth impact and fit drive ROI; integration with ad platforms matters
 * - seo: fit and growth (organic traffic); value matters because SEO tools are expensive
 * - development: fit and integration dominate; ease matters for velocity
 * - design: fit and productivity; ease is critical for non-designers
 * - operations: integration and ease win; cost reduction is the goal
 * - ecommerce: growth and fit; integration with platform stack matters most
 * - customer-support: ease and productivity; integration with CRM/chat stack
 * - revenue: growth and fit; price value matters for ROI justification
 * - cost-reduction: price value and integration; ease for adoption
 */
export const GOAL_WEIGHTS: Record<SolutionArea, ScoreWeights> = {
  content: {
    fitToNeed:          3.0,
    easeOfUse:          2.0,
    priceValue:         1.5,
    productivityImpact: 3.0,
    growthImpact:       1.0,
    integrationFit:     0.5,
  },
  advertising: {
    fitToNeed:          3.0,
    easeOfUse:          1.5,
    priceValue:         1.5,
    productivityImpact: 2.0,
    growthImpact:       3.0,
    integrationFit:     1.0,
  },
  seo: {
    fitToNeed:          3.5,
    easeOfUse:          1.0,
    priceValue:         2.0,
    productivityImpact: 2.0,
    growthImpact:       3.5,
    integrationFit:     1.0,
  },
  development: {
    fitToNeed:          3.5,
    easeOfUse:          2.0,
    priceValue:         1.5,
    productivityImpact: 3.0,
    growthImpact:       1.5,
    integrationFit:     2.5,
  },
  design: {
    fitToNeed:          3.0,
    easeOfUse:          2.5,
    priceValue:         1.5,
    productivityImpact: 3.0,
    growthImpact:       1.5,
    integrationFit:     1.0,
  },
  operations: {
    fitToNeed:          2.0,
    easeOfUse:          2.5,
    priceValue:         2.0,
    productivityImpact: 3.0,
    growthImpact:       1.5,
    integrationFit:     3.0,
  },
  ecommerce: {
    fitToNeed:          3.0,
    easeOfUse:          1.5,
    priceValue:         1.5,
    productivityImpact: 2.0,
    growthImpact:       3.5,
    integrationFit:     2.5,
  },
  "customer-support": {
    fitToNeed:          3.0,
    easeOfUse:          3.0,
    priceValue:         1.5,
    productivityImpact: 3.0,
    growthImpact:       1.0,
    integrationFit:     2.5,
  },
  revenue: {
    fitToNeed:          3.0,
    easeOfUse:          1.5,
    priceValue:         2.0,
    productivityImpact: 2.0,
    growthImpact:       4.0,
    integrationFit:     1.5,
  },
  "cost-reduction": {
    fitToNeed:          2.0,
    easeOfUse:          2.5,
    priceValue:         3.5,
    productivityImpact: 3.0,
    growthImpact:       1.0,
    integrationFit:     3.0,
  },
};

/** Compute total weight for normalization */
export function totalWeight(w: ScoreWeights): number {
  return (
    w.fitToNeed +
    w.easeOfUse +
    w.priceValue +
    w.productivityImpact +
    w.growthImpact +
    w.integrationFit
  );
}
