import Link from "next/link";
import { Section }       from "@/components/layout/Section";
import { SectionHeader } from "@/components/common/SectionHeader";
import { Top10Card }     from "@/components/top10/Top10Card";
import { Button }        from "@/components/common/Button";
import { getHomepageTop5 } from "@/lib/ranking/service";

/**
 * Homepage Top 5 — reads from the ranking service, which computes rankings
 * dynamically from tool data. No hardcoded arrays here.
 */
export function Top10Section() {
  const top5 = getHomepageTop5();

  // Convert RankingCardData → Top10CardData shape
  const cards = top5.map((r) => ({
    rank:             r.rank,
    slug:             r.slug,
    name:             r.name,
    tagline:          r.tagline,
    websiteUrl:       r.websiteUrl,
    strongestUseCase: r.strongestUseCase,
    category:         r.category,
    signals:          r.signals,
    compositeScore:   r.compositeScore,
    hasFree:          r.hasFree,
    isSponsored:      r.isSponsored,
  }));

  return (
    <Section id="top10" bg="white" spacing="lg">
      <SectionHeader
        badge="Bu hafta"
        title="Top 10 Yapay Zekâ Aracı"
        description="Dinamik sıralama — skor editoryal bağımsızlıkla hesaplanır, sponsorlu içerikler ayrıca etiketlenir."
      />

      <ol className="flex flex-col gap-3 max-w-3xl mx-auto" aria-label="Bu haftanın en iyi 5 yapay zekâ aracı">
        {cards.map((tool) => (
          <li key={tool.slug}>
            <Top10Card tool={tool} compact />
          </li>
        ))}
      </ol>

      <div className="flex flex-col items-center gap-3 mt-10">
        <Button variant="secondary" size="md" href="/top10">
          Tam Top 10 listesini gör →
        </Button>
        <p className="text-xs text-slate-400">
          Haftalık, aylık, yıllık ve kategori bazlı sıralamalar mevcut
        </p>
      </div>
    </Section>
  );
}
