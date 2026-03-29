/**
 * Entitlement service — check and grant premium access.
 *
 * Storage layer is swappable:
 *   - Development / no DB:  in-memory store (resets on server restart)
 *   - Production with DB:   replace store functions with Prisma calls
 *
 * Usage (Server Actions / API routes):
 *   import { checkEntitlement, grantEntitlement } from "@/lib/entitlements/service";
 *
 *   // After payment verification:
 *   await grantEntitlement({ userId, type: "one_time_unlock", analysisId, paymentRef });
 *
 *   // Before showing premium content:
 *   const { hasAccess } = await checkEntitlement(userId, analysisId);
 *   if (!hasAccess) redirect("/premium/unlock?id=" + analysisId);
 */

import type {
  Entitlement,
  EntitlementCheckResult,
  GrantEntitlementParams,
} from "./types";
import { logPurchase } from "@/lib/revenue/store";

/* ─── In-memory store (development / no-DB fallback) ─────────────────────── */

const _store = new Map<string, Entitlement>();
let   _idCounter = 0;

function storeKey(userId: string, analysisId?: string): string {
  return analysisId ? `${userId}:${analysisId}` : `${userId}:sub`;
}

/* ─── Core operations ────────────────────────────────────────────────────── */

/**
 * Check whether a user has premium access to a specific analysis.
 *
 * Access is granted if:
 *   1. User has a one_time_unlock for that specific analysisId, OR
 *   2. User has an active subscription (any type) that hasn't expired
 *
 * Sprint 4+: replace with Prisma query:
 *   await db.entitlement.findFirst({
 *     where: {
 *       userId,
 *       status: "active",
 *       OR: [{ analysisId }, { type: { in: ["subscription_monthly", "subscription_annual"] } }],
 *       OR: [{ expiresAt: null }, { expiresAt: { gt: new Date() } }],
 *     }
 *   })
 */
export async function checkEntitlement(
  userId: string | null | undefined,
  analysisId?: string
): Promise<EntitlementCheckResult> {
  // Unauthenticated users never have access
  if (!userId) return { hasAccess: false };

  const now = new Date();

  // Check for one-time unlock specific to this analysis
  if (analysisId) {
    const key = storeKey(userId, analysisId);
    const ent = _store.get(key);
    if (ent && ent.status === "active") {
      return { hasAccess: true, accessType: "one-time", entitlement: ent };
    }
  }

  // Check for active subscription
  for (const ent of _store.values()) {
    if (
      ent.userId === userId &&
      ent.status === "active" &&
      (ent.type === "subscription_monthly" || ent.type === "subscription_annual") &&
      (!ent.expiresAt || ent.expiresAt > now)
    ) {
      return { hasAccess: true, accessType: "subscription", entitlement: ent };
    }
  }

  return { hasAccess: false };
}

/**
 * Grant an entitlement after successful payment verification.
 *
 * Sprint 4+: replace with Prisma upsert:
 *   await db.entitlement.create({ data: { ... } })
 */
export async function grantEntitlement(
  params: GrantEntitlementParams
): Promise<Entitlement> {
  const id = `ent_${++_idCounter}_${Date.now()}`;
  const ent: Entitlement = {
    id,
    userId:      params.userId,
    type:        params.type,
    status:      "active",
    analysisId:  params.analysisId,
    paymentRef:  params.paymentRef,
    expiresAt:   params.expiresAt,
    createdAt:   new Date(),
  };

  const key = params.analysisId
    ? storeKey(params.userId, params.analysisId)
    : storeKey(params.userId);

  _store.set(key, ent);

  // Log the purchase for revenue tracking
  try {
    const isSubscription = params.type === "subscription_monthly" || params.type === "subscription_annual";
    logPurchase({
      userId:      params.userId,
      userEmail:   params.userEmail ?? params.userId,
      type:        isSubscription ? "subscription" : "one-time",
      amountUsd:   isSubscription ? 9.00 : 2.99,
      planId:      params.type,
      provider:    params.paymentRef?.startsWith("mock") ? "mock" : "stripe",
      providerRef: params.paymentRef ?? null,
    });
  } catch {
    // Revenue logging should never block entitlement granting
  }

  return ent;
}

/**
 * List all active entitlements for a user.
 *
 * Sprint 4+: replace with Prisma findMany.
 */
export async function listEntitlements(userId: string): Promise<Entitlement[]> {
  const result: Entitlement[] = [];
  const now = new Date();
  for (const ent of _store.values()) {
    if (
      ent.userId === userId &&
      ent.status === "active" &&
      (!ent.expiresAt || ent.expiresAt > now)
    ) {
      result.push(ent);
    }
  }
  return result;
}

/**
 * Check whether a user has any active subscription (regardless of analysis).
 */
export async function hasActiveSubscription(userId: string): Promise<boolean> {
  const entitlements = await listEntitlements(userId);
  return entitlements.some(
    (e) => e.type === "subscription_monthly" || e.type === "subscription_annual"
  );
}
