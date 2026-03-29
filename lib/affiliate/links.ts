/**
 * Affiliate link helper.
 *
 * Centralised so any future changes (UTM params, tracking pixel, etc.)
 * only need to happen here — not scattered across components.
 *
 * Rules:
 *   1. If tool.affiliateUrl is set, use it.
 *   2. Otherwise build a tracked URL from tool.websiteUrl + UTM params.
 *   3. Never hide that a link is affiliate — always label it.
 */

import type { Tool } from "@/data/schemas/tool";

/** Standard UTM params appended to all outbound links */
const UTM = "?utm_source=yaverim&utm_medium=referral";

export function getOutboundUrl(tool: Pick<Tool, "websiteUrl" | "affiliateUrl" | "hasAffiliate">): string {
  if (tool.affiliateUrl) return tool.affiliateUrl;
  // Append UTM even for non-affiliate links — for analytics
  const base = tool.websiteUrl.replace(/\/$/, "");
  return `${base}${UTM}`;
}

export function isAffiliate(tool: Pick<Tool, "affiliateUrl" | "hasAffiliate">): boolean {
  return !!(tool.affiliateUrl ?? tool.hasAffiliate);
}

/** Label shown next to affiliate links for transparency */
export const AFFILIATE_LABEL = "Referral linki";
export const AFFILIATE_TOOLTIP =
  "Bu link üzerinden yapılan kayıtlarda Yaverim komisyon alabilir. Bu durum sıralama veya editöryal görüşlerimizi etkilemez.";
