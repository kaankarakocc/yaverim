/**
 * General-purpose formatting utilities.
 */

/** Capitalize the first letter of a string. */
export function capitalize(str: string): string {
  if (!str) return str;
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/** Truncate a string to a max length with optional suffix. */
export function truncate(str: string, maxLength: number, suffix = "…"): string {
  if (str.length <= maxLength) return str;
  return str.slice(0, maxLength - suffix.length) + suffix;
}

/** Convert a string to a URL-safe slug. */
export function slugify(str: string): string {
  return str
    .toLowerCase()
    .replace(/ğ/g, "g")
    .replace(/ü/g, "u")
    .replace(/ş/g, "s")
    .replace(/ı/g, "i")
    .replace(/ö/g, "o")
    .replace(/ç/g, "c")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

/** Format a price range label. */
export function formatPriceLabel(
  hasFree: boolean,
  pricingTier: "free" | "low" | "mid" | "high" | "enterprise"
): string {
  const tierLabels: Record<typeof pricingTier, string> = {
    free: "Ücretsiz",
    low: "Düşük bütçe",
    mid: "Orta bütçe",
    high: "Yüksek bütçe",
    enterprise: "Kurumsal",
  };
  if (hasFree && pricingTier !== "free") {
    return `Ücretsiz plan + ${tierLabels[pricingTier]}`;
  }
  return tierLabels[pricingTier];
}
