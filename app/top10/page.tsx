import type { Metadata } from "next";
import { Navbar }         from "@/components/layout/Navbar";
import { Footer }         from "@/components/layout/Footer";
import {
  getOverallCards,
  getCategoryCards,
  getHiddenGemCards,
  getAllCategories,
  getLastComputedAt,
} from "@/lib/ranking/service";
import { Top10PageClient, type Top10PageData } from "./Top10PageClient";

export const metadata: Metadata = {
  title: "Top 10 Yapay Zekâ Araçları | Yaverim",
  description:
    "Haftalık, aylık ve yıllık dinamik sıralama. Kategori bazlı ve gizli güçler dahil.",
};

export default function Top10Page() {
  /* Build data on the server — no client requests needed */
  const categories = getAllCategories();

  const categoryCards: Record<string, ReturnType<typeof getCategoryCards>> = {};
  for (const cat of categories) {
    const cards = getCategoryCards("weekly", cat);
    if (cards.length > 0) categoryCards[cat] = cards;
  }

  const data: Top10PageData = {
    weekly:     getOverallCards("weekly"),
    monthly:    getOverallCards("monthly"),
    yearly:     getOverallCards("yearly"),
    categories: categoryCards,
    hiddenGems: getHiddenGemCards(),
    lastUpdated: getLastComputedAt(),
  };

  return (
    <>
      <Navbar />
      <main className="flex flex-col flex-1 bg-white">
        <Top10PageClient data={data} />
      </main>
      <Footer />
    </>
  );
}
