/**
 * Ranking system types.
 *
 * All ranking data is stored in /data/rankings/ as JSON files — NOT in
 * TypeScript source. When the Prisma/PostgreSQL connection is live, the
 * service layer can swap JSON file reads for Prisma queries without touching
 * any UI code.
 */

export type RankingPeriod = "weekly" | "monthly" | "yearly";

export type RankingType = "overall" | "category" | "hidden-gems";

/** One entry inside a ranking list */
export interface RankingEntry {
  rank:        number;
  toolSlug:    string;
  isSponsored: boolean;
  /** Optional editorial context note shown on the card */
  contextNote: string | null;
  /** Score at the time of ranking computation */
  score:       number;
}

/** A full ranking snapshot */
export interface RankingSnapshot {
  id:          string;
  period:      RankingPeriod;
  type:        RankingType;
  /** null = overall/hidden-gems; non-null = e.g. "SEO", "Asistan" */
  category:    string | null;
  /** ISO date string of the week/month/year start */
  periodStart: string;
  isPublished: boolean;
  generatedAt: string;
  entries:     RankingEntry[];
}

/** Lightweight shape served to ranking UI */
export interface RankingCardData {
  rank:             number;
  slug:             string;
  name:             string;
  tagline:          string;
  websiteUrl:       string;
  strongestUseCase: string;
  category:         string;
  signals:          string[];
  compositeScore:   number;
  hasFree:          boolean;
  isSponsored:      boolean;
  contextNote:      string | null;
  /** Only on hidden-gems entries */
  hiddenGemReason?: string;
}

/** Index file that lists all available ranking snapshots */
export interface RankingIndex {
  lastComputedAt: string;
  snapshots: {
    id:          string;
    period:      RankingPeriod;
    type:        RankingType;
    category:    string | null;
    periodStart: string;
    isPublished: boolean;
  }[];
}
