import type { Metadata } from "next";
import { getRevenueStats, getPurchases, getSponsorships } from "@/lib/revenue/store";
import { getTools } from "@/lib/tools/store";
import { RevenuePageClient } from "./RevenuePageClient";

export const metadata: Metadata = {
  title: "Gelir Yönetimi — Admin",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default function RevenuePage() {
  const stats        = getRevenueStats();
  const allPurchases = getPurchases();
  const sponsorships = getSponsorships();

  // Tool slug → name map for affiliate click display
  const toolNames = Object.fromEntries(getTools().map(t => [t.slug, t.name]));

  // Affiliate getTools() — those with hasAffiliate: true
  const affiliateTools = getTools()
    .filter(t => t.hasAffiliate)
    .map(t => ({
      slug:         t.slug,
      name:         t.name,
      category:     t.category,
      websiteUrl:   t.websiteUrl,
      affiliateUrl: (t as { affiliateUrl?: string | null }).affiliateUrl ?? null,
      pricingLabel: t.pricingLabel,
      status:       t.status,
    }));

  return (
    <RevenuePageClient
      stats={stats}
      allPurchases={allPurchases}
      sponsorships={sponsorships}
      toolNames={toolNames}
      affiliateTools={affiliateTools}
    />
  );
}





