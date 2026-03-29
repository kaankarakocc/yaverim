import type { Metadata } from "next";
import { getAllItems, getQueueStats, getAllAnalysisReports } from "@/lib/discovery/queue-store";
import { getProvider }    from "@/lib/ai-analyst/analyzer";
import { DiscoveryPageClient } from "./DiscoveryPageClient";
import type { ToolAnalysisReport } from "@/lib/ai-analyst/types";

export const metadata: Metadata = {
  title: "Keşif Kuyruğu — Admin",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default function DiscoveryPage() {
  const items    = getAllItems();
  const stats    = getQueueStats();
  const reports  = getAllAnalysisReports();
  const provider = getProvider();

  // Build a map of toolId → report for the client
  const reportsMap = reports.reduce<Record<string, ToolAnalysisReport>>((acc, r) => {
    acc[r.toolId] = r.report;
    return acc;
  }, {});

  return (
    <DiscoveryPageClient
      initialItems={items}
      initialReports={reportsMap}
      stats={{
        pending:    stats.pending,
        approved:   stats.approved,
        rejected:   stats.rejected,
        needsInfo:  stats.needsInfo,
        lastScanAt: stats.lastScanAt,
      }}
      aiProvider={provider}
      aiHasKey={provider !== "mock"}
    />
  );
}
