/**
 * Persistence types — saved analyses and user history.
 *
 * In V1, analysis history is stored in the browser (localStorage).
 * The interfaces are designed for a seamless migration to server-side
 * persistence (Prisma / Supabase) when the DB layer is ready.
 */

/* ─── Saved analysis ─────────────────────────────────────────────────────── */

export interface SavedAnalysis {
  /** Client-generated CUID or timestamp-based id. */
  id: string;

  /**
   * Serialized onboarding URL search params.
   * e.g. "userType=freelancer&goals=seo,content&budget=low"
   */
  paramsString: string;

  /**
   * Human-readable auto-generated title.
   * e.g. "Freelancer · SEO + İçerik · Düşük Bütçe"
   */
  title: string;

  /**
   * Snapshot of the recommendation result at the time of saving.
   * Stored as JSON-serialized string to survive localStorage round-trips.
   */
  resultSnapshot?: string;

  /** Whether the premium plan was unlocked for this analysis. */
  isPremiumUnlocked: boolean;

  /** User marked this as a favourite. */
  isFavorite: boolean;

  /** ISO timestamp string. */
  createdAt: string;

  /** Optional user note. */
  note?: string;
}

/* ─── Store interface ────────────────────────────────────────────────────── */

export interface AnalysisStore {
  /** Save a new analysis. Returns the saved record. */
  save(analysis: Omit<SavedAnalysis, "id" | "createdAt">): Promise<SavedAnalysis>;

  /** Load a single analysis by id. */
  get(id: string): Promise<SavedAnalysis | null>;

  /** List all analyses, sorted by createdAt descending. */
  list(): Promise<SavedAnalysis[]>;

  /** Delete an analysis by id. */
  remove(id: string): Promise<void>;

  /** Mark / unmark as favourite. */
  toggleFavorite(id: string): Promise<SavedAnalysis | null>;

  /** Update the note on an analysis. */
  updateNote(id: string, note: string): Promise<SavedAnalysis | null>;

  /** Mark premium as unlocked. */
  markPremiumUnlocked(id: string): Promise<void>;
}

/* ─── History summary for UI ─────────────────────────────────────────────── */

export interface HistorySummary {
  totalAnalyses: number;
  premiumUnlocked: number;
  favorites: number;
  recentAnalyses: SavedAnalysis[];
}
