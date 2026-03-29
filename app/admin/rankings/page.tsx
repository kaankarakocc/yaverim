import type { Metadata } from "next";
import { getTools }     from "@/lib/tools/store";
import {
  getOverallCards,
  getCategoryCards,
  getHiddenGemCards,
  getAllCategories,
  getLastComputedAt,
} from "@/lib/ranking/service";
import { RankingsAdminClient } from "./RankingsAdminClient";

export const metadata: Metadata = {
  title:  "Admin — Sıralamalar",
  robots: { index: false, follow: false },
};

export default function AdminRankingsPage() {
  const categories  = getAllCategories();
  const categoryCards: Record<string, ReturnType<typeof getCategoryCards>> = {};
  for (const cat of categories) {
    const cards = getCategoryCards("weekly", cat);
    if (cards.length > 0) categoryCards[cat] = cards;
  }

  return (
    <RankingsAdminClient
      data={{
        weekly:      getOverallCards("weekly"),
        monthly:     getOverallCards("monthly"),
        yearly:      getOverallCards("yearly"),
        categories:  categoryCards,
        hiddenGems:  getHiddenGemCards(),
        lastUpdated: getLastComputedAt(),
        totalTools:  getTools().filter((t) => t.status !== "deprecated").length,
      }}
    />
  );
}




