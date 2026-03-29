/**
 * Tool data validation utility.
 *
 * Checks data integrity of seed records before they are surfaced
 * to users or promoted in the recommendation engine.
 *
 * Errors   → block promotion (candidate → core)
 * Warnings → flag for editorial review but don't block
 *
 * Used by:
 *   /admin/validate  — displays full validation report
 *   CI pipeline (future) — runs on seed file changes
 */

import type { Tool, ToolScoreData } from "@/data/schemas/tool";
import type { SolutionArea, UserType } from "@/lib/recommendation/types";

export interface ValidationIssue {
  field: string;
  message: string;
}

export interface ToolValidationResult {
  slug: string;
  name: string;
  valid: boolean;
  errors: ValidationIssue[];
  warnings: ValidationIssue[];
}

export interface DatasetValidationReport {
  validCount: number;
  warningCount: number;
  errorCount: number;
  duplicateSlugs: string[];
  results: ToolValidationResult[];
  generatedAt: string;
}

/* ─── Valid value sets ───────────────────────────────────────────────────── */

const VALID_SOLUTION_AREAS: SolutionArea[] = [
  "revenue", "cost-reduction", "content", "advertising",
  "ecommerce", "customer-support", "operations", "development",
  "design", "seo",
];

const VALID_USER_TYPES: UserType[] = ["individual", "freelancer", "founder", "team"];

const VALID_PRICING_TIERS = ["free", "low", "mid", "high", "enterprise"];
const VALID_DIFFICULTY_LEVELS = ["beginner", "intermediate", "advanced"];
const VALID_STATUSES = ["candidate", "tracked", "core", "priority", "deprecated"];
const VALID_TURKISH_SUPPORT = ["none", "partial", "full"];

/* ─── Single-tool validation ─────────────────────────────────────────────── */

export function validateTool(tool: Tool): ToolValidationResult {
  const errors: ValidationIssue[] = [];
  const warnings: ValidationIssue[] = [];

  function err(field: string, message: string) {
    errors.push({ field, message });
  }
  function warn(field: string, message: string) {
    warnings.push({ field, message });
  }

  /* Required strings */
  if (!tool.slug || tool.slug.trim() === "")  err("slug", "Slug is required");
  if (!tool.name || tool.name.trim() === "")  err("name", "Name is required");
  if (!tool.tagline)                           err("tagline", "Tagline is required");
  if (!tool.pricingLabel)                      err("pricingLabel", "pricingLabel is required for UI display");
  if (!tool.websiteUrl)                        err("websiteUrl", "websiteUrl is required");
  if (!tool.category)                          err("category", "category is required");
  if (!tool.whyRecommended)                    err("whyRecommended", "whyRecommended paragraph is required");

  /* Slug format */
  if (tool.slug && !/^[a-z0-9-]+$/.test(tool.slug)) {
    err("slug", "Slug must be lowercase alphanumeric with hyphens only");
  }

  /* URL format */
  if (tool.websiteUrl && !tool.websiteUrl.startsWith("https://")) {
    warn("websiteUrl", "websiteUrl should start with https://");
  }

  /* Enum fields */
  if (!VALID_PRICING_TIERS.includes(tool.pricingTier)) {
    err("pricingTier", `Invalid pricingTier: "${tool.pricingTier}"`);
  }
  if (!VALID_DIFFICULTY_LEVELS.includes(tool.difficultyLevel)) {
    err("difficultyLevel", `Invalid difficultyLevel: "${tool.difficultyLevel}"`);
  }
  if (!VALID_STATUSES.includes(tool.status)) {
    err("status", `Invalid status: "${tool.status}"`);
  }
  if (!VALID_TURKISH_SUPPORT.includes(tool.turkishSupport)) {
    err("turkishSupport", `Invalid turkishSupport: "${tool.turkishSupport}"`);
  }

  /* Array fields */
  if (!tool.solutionAreas || tool.solutionAreas.length === 0) {
    err("solutionAreas", "At least one solution area required");
  } else {
    for (const area of tool.solutionAreas) {
      if (!VALID_SOLUTION_AREAS.includes(area)) {
        err("solutionAreas", `Invalid solution area: "${area}"`);
      }
    }
  }

  if (!tool.suitableForUserTypes || tool.suitableForUserTypes.length === 0) {
    err("suitableForUserTypes", "At least one user type required");
  } else {
    for (const ut of tool.suitableForUserTypes) {
      if (!VALID_USER_TYPES.includes(ut)) {
        err("suitableForUserTypes", `Invalid user type: "${ut}"`);
      }
    }
  }

  /* Score axes */
  const scoreFields: (keyof ToolScoreData)[] = [
    "fitToNeed", "easeOfUse", "priceValue",
    "productivityImpact", "growthImpact", "integrationFit",
  ];
  for (const field of scoreFields) {
    const val = tool.scores?.[field];
    if (val === undefined || val === null) {
      err(`scores.${field}`, `Score axis ${field} is missing`);
    } else if (val < 0 || val > 10) {
      err(`scores.${field}`, `Score ${field} must be 0–10, got ${val}`);
    }
  }

  if (tool.editorialScore < 0 || tool.editorialScore > 10) {
    err("editorialScore", `editorialScore must be 0–10, got ${tool.editorialScore}`);
  }

  /* Content quality warnings */
  if (!tool.logoPath) {
    warn("logoPath", "Logo not set — will show placeholder in UI");
  }
  if (tool.strengths.length < 2) {
    warn("strengths", "Less than 2 strengths — editorial quality low");
  }
  if (tool.weaknesses.length < 1) {
    warn("weaknesses", "No weaknesses listed — may appear biased");
  }
  if (tool.strongSignals.length === 0) {
    warn("strongSignals", "No strongSignals — rationale generation will fall back to whyRecommended");
  }
  if (tool.notSuitableFor.length === 0) {
    warn("notSuitableFor", "notSuitableFor is empty — guidance is incomplete");
  }
  if (tool.subUseCases.length < 2) {
    warn("subUseCases", "Fewer than 2 subUseCases — taxonomy is thin");
  }
  if (tool.whyRecommended.length < 60) {
    warn("whyRecommended", "whyRecommended is very short — editorial depth needed");
  }
  if (tool.status === "priority" && tool.editorialScore < 8.5) {
    warn("status", "Tool is 'priority' but editorialScore < 8.5 — consider downgrading");
  }
  if (tool.status === "deprecated") {
    warn("status", "Tool is deprecated — verify it should not be removed from seed");
  }

  return {
    slug: tool.slug,
    name: tool.name,
    valid: errors.length === 0,
    errors,
    warnings,
  };
}

/* ─── Dataset validation ─────────────────────────────────────────────────── */

export function validateDataset(tools: Tool[]): DatasetValidationReport {
  const slugsSeen = new Set<string>();
  const duplicateSlugs: string[] = [];
  const results: ToolValidationResult[] = [];

  for (const tool of tools) {
    if (slugsSeen.has(tool.slug)) {
      duplicateSlugs.push(tool.slug);
    }
    slugsSeen.add(tool.slug);
    results.push(validateTool(tool));
  }

  const validCount   = results.filter((r) => r.valid && r.warnings.length === 0).length;
  const warningCount = results.filter((r) => r.valid && r.warnings.length > 0).length;
  const errorCount   = results.filter((r) => !r.valid).length;

  return {
    validCount,
    warningCount,
    errorCount,
    duplicateSlugs,
    results,
    generatedAt: new Date().toISOString(),
  };
}

/* ─── Lifecycle transition rules ─────────────────────────────────────────── */

export type LifecycleStatus = Tool["status"];

/**
 * Valid lifecycle promotions — enforces unidirectional flow.
 * Demotion back to 'deprecated' is always allowed for any status.
 */
export const LIFECYCLE_TRANSITIONS: Record<LifecycleStatus, LifecycleStatus[]> = {
  candidate: ["tracked"],
  tracked:   ["core",      "deprecated"],
  core:      ["priority",  "deprecated"],
  priority:  ["core",      "deprecated"],   // can be downgraded back
  deprecated: [],                           // terminal state
};

export function isValidTransition(from: LifecycleStatus, to: LifecycleStatus): boolean {
  return LIFECYCLE_TRANSITIONS[from]?.includes(to) ?? false;
}

export function lifecycleLabel(status: LifecycleStatus): string {
  const labels: Record<LifecycleStatus, string> = {
    candidate:  "Aday",
    tracked:    "Takipte",
    core:       "Core",
    priority:   "Öncelikli",
    deprecated: "Emekli",
  };
  return labels[status] ?? status;
}
