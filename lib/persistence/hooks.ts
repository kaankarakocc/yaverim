/**
 * React hooks for analysis persistence.
 *
 * These hooks wrap the localStorage store and provide a clean React interface.
 * They handle hydration correctly (localStorage is client-only).
 *
 * Usage:
 *   const { analyses, save, remove, toggleFavorite } = useAnalysisHistory();
 */

"use client";

import { useState, useEffect, useCallback } from "react";
import { localAnalysisStore } from "./local-store";
import type { SavedAnalysis } from "./types";

/* ─── useAnalysisHistory ─────────────────────────────────────────────────── */

export function useAnalysisHistory() {
  const [analyses, setAnalyses] = useState<SavedAnalysis[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from localStorage on mount (client-only)
  useEffect(() => {
    localAnalysisStore.list().then((items) => {
      setAnalyses(items);
      setIsLoaded(true);
    });
  }, []);

  const refresh = useCallback(async () => {
    const items = await localAnalysisStore.list();
    setAnalyses(items);
  }, []);

  const save = useCallback(
    async (draft: Omit<SavedAnalysis, "id" | "createdAt">) => {
      const saved = await localAnalysisStore.save(draft);
      await refresh();
      return saved;
    },
    [refresh]
  );

  const remove = useCallback(
    async (id: string) => {
      await localAnalysisStore.remove(id);
      await refresh();
    },
    [refresh]
  );

  const toggleFavorite = useCallback(
    async (id: string) => {
      await localAnalysisStore.toggleFavorite(id);
      await refresh();
    },
    [refresh]
  );

  const markPremiumUnlocked = useCallback(
    async (id: string) => {
      await localAnalysisStore.markPremiumUnlocked(id);
      await refresh();
    },
    [refresh]
  );

  return {
    analyses,
    isLoaded,
    save,
    remove,
    toggleFavorite,
    markPremiumUnlocked,
    totalCount:     analyses.length,
    favoriteCount:  analyses.filter((a) => a.isFavorite).length,
    premiumCount:   analyses.filter((a) => a.isPremiumUnlocked).length,
  };
}

/* ─── useSingleAnalysis ──────────────────────────────────────────────────── */

export function useSingleAnalysis(id: string | null) {
  const [analysis, setAnalysis] = useState<SavedAnalysis | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (!id) { setIsLoaded(true); return; }
    localAnalysisStore.get(id).then((item) => {
      setAnalysis(item);
      setIsLoaded(true);
    });
  }, [id]);

  return { analysis, isLoaded };
}

/* ─── Utility: generate a readable title from params ─────────────────────── */

export function buildAnalysisTitle(params: URLSearchParams): string {
  const USER_TYPE_MAP: Record<string, string> = {
    individual: "Bireysel",
    freelancer: "Freelancer",
    founder:    "Kurucu",
    team:       "Ekip",
  };
  const GOAL_MAP: Record<string, string> = {
    content:          "İçerik",
    seo:              "SEO",
    advertising:      "Reklam",
    development:      "Geliştirme",
    design:           "Tasarım",
    operations:       "Operasyon",
    ecommerce:        "E-Ticaret",
    "customer-support": "Destek",
    revenue:          "Gelir",
    "cost-reduction": "Maliyet",
  };
  const BUDGET_MAP: Record<string, string> = {
    free:  "Ücretsiz",
    low:   "Düşük Bütçe",
    mid:   "Orta Bütçe",
    best:  "En İyisi",
  };

  const userType = USER_TYPE_MAP[params.get("userType") ?? ""] ?? "";
  const goals    = (params.get("goals") ?? "").split(",").slice(0, 2)
                     .map((g) => GOAL_MAP[g.trim()] ?? g).join(" + ");
  const budget   = BUDGET_MAP[params.get("budget") ?? ""] ?? "";

  return [userType, goals, budget].filter(Boolean).join(" · ") || "Yeni Analiz";
}
