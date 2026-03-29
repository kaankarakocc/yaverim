/**
 * Entitlement types — defines who can access what premium content.
 *
 * Two access models:
 *
 * 1. one_time_unlock
 *    User pays once to unlock the premium plan for a specific analysis.
 *    Cheapest entry point. Stored against analysisId.
 *
 * 2. subscription_monthly / subscription_annual
 *    User has a recurring subscription that unlocks all analyses.
 *    Better value for power users. Does not require an analysisId.
 */

export type EntitlementType =
  | "one_time_unlock"
  | "subscription_monthly"
  | "subscription_annual";

export type EntitlementStatus = "active" | "expired" | "cancelled" | "refunded";

export interface Entitlement {
  id:          string;
  userId:      string;
  type:        EntitlementType;
  status:      EntitlementStatus;

  /** Only set for one_time_unlock — identifies which analysis is unlocked. */
  analysisId?: string;

  /** Stripe payment_intent_id or checkout_session_id for audit trail. */
  paymentRef?: string;

  /** Null for one-time unlocks (lifetime access). Subscription expiry date. */
  expiresAt?:  Date;

  createdAt:   Date;
}

/* ─── Access check result ────────────────────────────────────────────────── */

export interface EntitlementCheckResult {
  hasAccess: boolean;

  /**
   * How the access was granted. Undefined when access is denied.
   *  "one-time"     → user paid for this specific analysis
   *  "subscription" → user has an active subscription
   */
  accessType?: "one-time" | "subscription";

  /** The entitlement that grants access, if found. */
  entitlement?: Entitlement;
}

/* ─── Grant params ───────────────────────────────────────────────────────── */

export interface GrantEntitlementParams {
  userId:      string;
  userEmail?:  string;   // used for purchase logging
  type:        EntitlementType;
  analysisId?: string;
  paymentRef?: string;
  expiresAt?:  Date;
}
