/**
 * Ranking engine â€” computes ranking snapshots from live tool data.
 *
 * This engine reads from TOOLS (seed data / future: DB) and produces
 * RankingSnapshot objects that are then persisted to /data/rankings/ JSON
 * files (or future: written to the Ranking / RankingEntry Prisma tables).
 *
 * Supported ranking types:
 *   overall      â†’ top 10 across all categories
 *   category     â†’ top 10 within a specific category
 *   hidden-gems  â†’ underrated tools not in overall top 10
 *
 * Periods:
 *   weekly  â†’ computed fresh every week
 *   monthly â†’ best performers of the month (currently: same algorithm, different label)
 *   yearly  â†’ best performers of the year
 */

import { getTools } from "@/lib/tools/store";
import type { Tool } from "@/data/schemas/tool";
import type { RankingSnapshot, RankingEntry } from "./types";

/* â”€â”€â”€ Scoring â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */

/**
 * Composite ranking score â€” different from editorialScore alone.
 * Weights are adjusted per ranking type.
 */
function computeRankingScore(
  tool: Tool,
  weights: {
    fitToNeed: number;
    easeOfUse: number;
    priceValue: number;
    productivity: number;
    growth: number;
    integration: number;
    editorial: number;
  }
): number {
  const { scores, editorialScore } = tool;
  const raw =
    scores.fitToNeed          * weights.fitToNeed    +
    scores.easeOfUse          * weights.easeOfUse    +
    scores.priceValue         * weights.priceValue   +
    scores.productivityImpact * weights.productivity +
    scores.growthImpact       * weights.growth       +
    scores.integrationFit     * weights.integration  +
    editorialScore            * weights.editorial;

  const totalWeight =
    weights.fitToNeed + weights.easeOfUse + weights.priceValue +
    weights.productivity + weights.growth + weights.integration + weights.editorial;

  return Math.round((raw / totalWeight) * 100) / 100;
}

/* â”€â”€â”€ Period helpers â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */

function weekStart(date: Date): string {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Monday
  d.setDate(diff);
  return d.toISOString().split("T")[0];
}

function monthStart(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-01`;
}

function yearStart(date: Date): string {
  return `${date.getFullYear()}-01-01`;
}

function periodStartFor(period: "weekly" | "monthly" | "yearly", date: Date): string {
  if (period === "weekly")  return weekStart(date);
  if (period === "monthly") return monthStart(date);
  return yearStart(date);
}

function makeId(period: string, type: string, category: string | null, periodStart: string): string {
  const cat = category ? `-${category.toLowerCase().replace(/\s+/g, "-")}` : "";
  return `${period}-${type}${cat}-${periodStart}`;
}

/* â”€â”€â”€ Overall ranking â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */

const OVERALL_WEIGHTS = {
  fitToNeed: 0.25, easeOfUse: 0.15, priceValue: 0.15,
  productivity: 0.20, growth: 0.10, integration: 0.05, editorial: 0.10,
};

function buildOverall(
  period: "weekly" | "monthly" | "yearly",
  date: Date,
  limit = 10
): RankingSnapshot {
  const active = getTools().filter((t) => t.status !== "deprecated");
  const scored = active.map((t) => ({
    tool:  t,
    score: computeRankingScore(t, OVERALL_WEIGHTS),
  }));

  scored.sort((a, b) => b.score - a.score);
  const top = scored.slice(0, limit);

  const ps = periodStartFor(period, date);

  const entries: RankingEntry[] = top.map((item, idx) => ({
    rank:        idx + 1,
    toolSlug:    item.tool.slug,
    isSponsored: false,
    contextNote: null,
    score:       item.score,
  }));

  return {
    id:          makeId(period, "overall", null, ps),
    period,
    type:        "overall",
    category:    null,
    periodStart: ps,
    isPublished: true,
    generatedAt: new Date().toISOString(),
    entries,
  };
}

/* â”€â”€â”€ Category ranking â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */

const CATEGORY_WEIGHTS = {
  fitToNeed: 0.35, easeOfUse: 0.15, priceValue: 0.12,
  productivity: 0.18, growth: 0.08, integration: 0.07, editorial: 0.05,
};

function buildCategory(
  category: string,
  period: "weekly" | "monthly" | "yearly",
  date: Date,
  limit = 10
): RankingSnapshot {
  const inCategory = getTools().filter(
    (t) => t.status !== "deprecated" && t.category === category
  );

  const scored = inCategory.map((t) => ({
    tool:  t,
    score: computeRankingScore(t, CATEGORY_WEIGHTS),
  }));

  scored.sort((a, b) => b.score - a.score);
  const top = scored.slice(0, limit);

  const ps = periodStartFor(period, date);

  return {
    id:          makeId(period, "category", category, ps),
    period,
    type:        "category",
    category,
    periodStart: ps,
    isPublished: true,
    generatedAt: new Date().toISOString(),
    entries:     top.map((item, idx) => ({
      rank:        idx + 1,
      toolSlug:    item.tool.slug,
      isSponsored: false,
      contextNote: null,
      score:       item.score,
    })),
  };
}

/* â”€â”€â”€ Hidden gems â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */

/**
 * Hidden gems = tools that:
 * - Have popularity: "niche" or "emerging" (truly underrated)
 * - Are NOT in the overall weekly top 10
 * - Have editorialScore >= 7.5
 * - Have at least one specialty axis >= 8.0
 * - Status is not "deprecated"
 *
 * Sorted by max specialty score descending.
 */
function buildHiddenGems(date: Date, limit = 10): RankingSnapshot {
  const overallTop10Slugs = new Set(
    buildOverall("weekly", date).entries.map((e) => e.toolSlug)
  );

  const candidates = getTools().filter((t) => {
    if (t.status === "deprecated") return false;
    if (overallTop10Slugs.has(t.slug)) return false;
    // Only truly underrated tools qualify as hidden gems
    if (t.popularity !== "niche" && t.popularity !== "emerging") return false;
    if (t.editorialScore < 7.5) return false;
    const { scores } = t;
    const maxSpecialty = Math.max(
      scores.fitToNeed,
      scores.productivityImpact,
      scores.priceValue,
      scores.growthImpact
    );
    return maxSpecialty >= 8.0;
  });

  // Score hidden gems by their maximum specialty axis
  const scored = candidates.map((t) => {
    const maxAxis = Math.max(
      t.scores.fitToNeed,
      t.scores.productivityImpact,
      t.scores.priceValue,
      t.scores.growthImpact
    );
    return { tool: t, score: maxAxis * 0.6 + t.editorialScore * 0.4 };
  });

  scored.sort((a, b) => b.score - a.score);
  const top = scored.slice(0, limit);

  const ps = periodStartFor("weekly", date);

  const GEM_REASONS: Record<string, string> = {
    "priceValue":         "Fiyat/performans oranı çok güçlü",
    "fitToNeed":          "Belirli ihtiyaçlar için mükemmel uyum",
    "productivityImpact": "Günlük verimliliği ciddi artırıyor",
    "growthImpact":       "Büyüme potansiyeli yüksek, az bilinen",
  };

  return {
    id:          `weekly-hidden-gems-${ps}`,
    period:      "weekly",
    type:        "hidden-gems",
    category:    null,
    periodStart: ps,
    isPublished: true,
    generatedAt: new Date().toISOString(),
    entries:     top.map((item, idx) => {
      const bestAxis = (["fitToNeed", "productivityImpact", "priceValue", "growthImpact"] as const)
        .reduce((best, ax) =>
          item.tool.scores[ax] > item.tool.scores[best] ? ax : best
        );
      return {
        rank:        idx + 1,
        toolSlug:    item.tool.slug,
        isSponsored: false,
        contextNote: GEM_REASONS[bestAxis] ?? null,
        score:       item.score,
      };
    }),
  };
}

/* â”€â”€â”€ All categories list â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */

export function getAvailableCategories(): string[] {
  return Array.from(new Set(getTools().filter(t => t.status !== "deprecated").map(t => t.category))).sort();
}

/* â”€â”€â”€ Main export â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */

export interface ComputeOptions {
  date?:      Date;
  periods?:   Array<"weekly" | "monthly" | "yearly">;
  categories?: string[];
  includeHiddenGems?: boolean;
}

/**
 * Compute all ranking snapshots.
 * Call this to regenerate all data files via the admin refresh API.
 */
export function computeAllRankings(opts: ComputeOptions = {}): RankingSnapshot[] {
  const date      = opts.date      ?? new Date();
  const periods   = opts.periods   ?? ["weekly", "monthly", "yearly"];
  const cats      = opts.categories ?? getAvailableCategories();
  const withGems  = opts.includeHiddenGems ?? true;

  const snapshots: RankingSnapshot[] = [];

  for (const period of periods) {
    // Overall
    snapshots.push(buildOverall(period, date));

    // Per-category
    for (const cat of cats) {
      const snap = buildCategory(cat, period, date);
      if (snap.entries.length > 0) snapshots.push(snap);
    }
  }

  // Hidden gems (weekly only)
  if (withGems) {
    snapshots.push(buildHiddenGems(date));
  }

  return snapshots;
}

/** Compute only the snapshots needed for the Top10 page (all tabs) */
export function computeTop10Rankings(date?: Date): RankingSnapshot[] {
  const d = date ?? new Date();
  return computeAllRankings({ date: d, periods: ["weekly", "monthly", "yearly"] });
}

