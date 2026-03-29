/**
 * Premium access check.
 *
 * Checks whether the current user has access to a premium analysis.
 * Used in Server Components / Server Actions before rendering locked content.
 *
 * Access is granted if any of the following are true:
 *   1. User has a one_time_unlock entitlement for this specific analysis
 *   2. User has an active subscription (any tier)
 *   3. NODE_ENV=development AND PREMIUM_DEV_BYPASS is not "false"
 *      (so developers can see the premium UI without paying)
 *
 * Sprint 4+: replace in-memory entitlement store with Prisma queries.
 */

import { checkEntitlement } from "@/lib/entitlements/service";

export interface AccessResult {
  hasAccess: boolean;
  accessType?: "one-time" | "subscription" | "dev-bypass";
}

/**
 * @param userId     - Authenticated user id from session (null = unauthenticated)
 * @param analysisId - Optional analysis id (for one-time unlock check)
 */
export async function checkPremiumAccess(
  userId?: string | null,
  analysisId?: string
): Promise<AccessResult> {
  // Dev bypass — allows the team to view premium UI without payment
  const isDev    = process.env.NODE_ENV === "development";
  const noBypass = process.env.PREMIUM_DEV_BYPASS === "false";

  if (isDev && !noBypass) {
    return { hasAccess: true, accessType: "dev-bypass" };
  }

  // Unauthenticated
  if (!userId) return { hasAccess: false };

  // Check entitlements
  const result = await checkEntitlement(userId, analysisId);

  if (!result.hasAccess) return { hasAccess: false };

  return {
    hasAccess:  true,
    accessType: result.accessType,
  };
}
