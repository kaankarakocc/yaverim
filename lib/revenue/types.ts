/**
 * Revenue tracking types.
 *
 * Three revenue streams:
 *   1. Purchases   — one-time unlocks and subscriptions
 *   2. AffClicks   — outbound affiliate link clicks per tool
 *   3. Sponsorship — paid tool placements / featured positions
 */

/* ─── Purchases ──────────────────────────────────────────────────────────── */

export type PurchaseType = "one-time" | "subscription";
export type PurchaseStatus = "completed" | "refunded" | "failed" | "pending";

export interface Purchase {
  id:          string;
  userId:      string;
  userEmail:   string;
  type:        PurchaseType;
  status:      PurchaseStatus;
  amountUsd:   number;           // e.g. 2.99 or 9.00
  currency:    string;           // "USD"
  planId:      string;           // "one-time-unlock" | "subscription-monthly"
  provider:    string;           // "stripe" | "mock"
  providerRef: string | null;    // Stripe payment intent id etc.
  createdAt:   string;
  refundedAt?: string;
}

/* ─── Affiliate clicks ───────────────────────────────────────────────────── */

export interface AffiliateClick {
  id:        string;
  toolSlug:  string;
  toolName:  string;
  userId:    string | null;  // null if not logged in
  sourcePage: string;        // "/results" | "/tools/chatgpt" | "/top10" etc.
  url:       string;         // destination URL
  clickedAt: string;
}

/* ─── Sponsorships ───────────────────────────────────────────────────────── */

export type SponsorshipTier = "featured" | "top-placement" | "category-leader" | "badge-only";
export type SponsorshipStatus = "active" | "paused" | "expired" | "pending";

export interface Sponsorship {
  id:          string;
  toolSlug:    string;
  toolName:    string;
  tier:        SponsorshipTier;
  status:      SponsorshipStatus;
  amountUsd:   number;          // monthly or one-time fee
  billingType: "monthly" | "one-time";
  startDate:   string;
  endDate:     string | null;   // null = until cancelled
  notes:       string;
  createdAt:   string;
  updatedAt:   string;
}

/* ─── Revenue store shape ────────────────────────────────────────────────── */

export interface RevenueStore {
  purchases:    Purchase[];
  affClicks:    AffiliateClick[];
  sponsorships: Sponsorship[];
}

/* ─── Computed stats ─────────────────────────────────────────────────────── */

export interface RevenueStats {
  totalRevenueUsd:       number;
  purchaseRevenue:       number;
  sponsorshipRevenue:    number;
  totalPurchases:        number;
  activeSubscriptions:   number;
  oneTimePurchases:      number;
  totalAffClicks:        number;
  topClickedTools:       { slug: string; name: string; clicks: number }[];
  activeSponsorships:    number;
  monthlyRecurring:      number;  // MRR from subscriptions + monthly sponsorships
  recentPurchases:       Purchase[];
}
