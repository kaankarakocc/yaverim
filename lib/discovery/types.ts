/**
 * Discovery pipeline types.
 *
 * Flow:
 *   scanner runs (daily cron / manual) →
 *   DiscoveredTool saved to queue with status "pending" →
 *   Admin reviews in /admin/discovery →
 *   "approved" → tool added to seed/DB →
 *   "rejected" → archived with reason
 */

export type DiscoverySource =
  | "product-hunt"
  | "there-is-an-ai"
  | "futurepedia"
  | "github-trending"
  | "manual"
  | "community-suggestion"
  | "competitor-watch";

export type ReviewStatus = "pending" | "approved" | "rejected" | "needs-info";

export interface DiscoveredTool {
  /** Unique id for this discovery record */
  id: string;

  /** Proposed slug (auto-generated, editable) */
  slug: string;

  name: string;
  tagline: string;
  websiteUrl: string;

  /** Where this tool was discovered */
  source: DiscoverySource;

  /** Raw description from discovery source */
  rawDescription: string;

  /** AI-generated or manual categorization suggestion */
  suggestedCategory: string;

  /** Popularity estimate from discovery source */
  suggestedPopularity: "mainstream" | "known" | "niche" | "emerging";

  /** Why this tool is interesting — from the source signal */
  discoverySignal: string;

  /** Discovery date */
  discoveredAt: string;

  /** Review status */
  status: ReviewStatus;

  /** Set when approved or rejected */
  reviewedAt?: string;

  /** Admin notes */
  reviewNote?: string;

  /**
   * Enriched data filled in by admin before approval.
   * When all required fields are filled, the tool can be approved.
   */
  enriched?: Partial<{
    pricingLabel:    string;
    category:        string;
    popularity:      string;
    hasFree:         boolean;
    hasTrial:        boolean;
    hasAffiliate:    boolean;
    affiliateUrl:    string;
    pricingTier:     string;
    turkishSupport:  string;
    difficultyLevel: string;
    editorialScore:  number;
    solutionAreas:   string[];
    sectorFit:       string[];
  }>;
}

export interface DiscoveryQueueStore {
  lastScanAt: string;
  totalScanned: number;
  items: DiscoveredTool[];
}

/** Analysis report stored alongside the discovered tool */
export interface StoredAnalysis {
  toolId:    string;
  report:    import("@/lib/ai-analyst/types").ToolAnalysisReport;
  createdAt: string;
}
