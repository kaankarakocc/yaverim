"use client";

import { useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils/cn";
import { useAnalysisHistory } from "@/lib/persistence/hooks";
import { AnalysisCard } from "@/app/account/AnalysisCard";
import type { AuthUser } from "@/lib/auth/session";

type FilterTab = "all" | "favorites" | "premium";

interface Props {
  user: AuthUser;
}

export function PlansPageClient({ user: _user }: Props) {
  const [activeTab, setActiveTab]   = useState<FilterTab>("all");
  const [searchQuery, setSearchQuery] = useState("");

  const { analyses, isLoaded, totalCount, favoriteCount, premiumCount, remove, toggleFavorite } =
    useAnalysisHistory();

  const filtered = analyses.filter((a) => {
    const matchesTab =
      activeTab === "all"       ? true :
      activeTab === "favorites" ? a.isFavorite :
      activeTab === "premium"   ? a.isPremiumUnlocked :
      true;

    const matchesSearch = searchQuery
      ? a.title.toLowerCase().includes(searchQuery.toLowerCase())
      : true;

    return matchesTab && matchesSearch;
  });

  const tabs: { id: FilterTab; label: string; count: number }[] = [
    { id: "all",       label: "Tümü",    count: totalCount    },
    { id: "favorites", label: "Favoriler", count: favoriteCount },
    { id: "premium",   label: "Premium", count: premiumCount  },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="border-b border-slate-200 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6">
          <div className="flex items-center gap-3 mb-1">
            <Link
              href="/account"
              className="text-sm text-slate-400 hover:text-slate-600 transition-colors"
            >
              Hesabım
            </Link>
            <span className="text-slate-400">/</span>
            <span className="text-sm text-slate-900 font-medium">Kayıtlı Planlar</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Kayıtlı Planlar</h1>
          <p className="text-sm text-slate-600 mt-1">
            Geçmiş analizlerinizi tekrar açın veya yeni analiz başlatın.
          </p>
        </div>
      </div>

      {/* Controls */}
      <div className="border-b border-slate-200 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-3 flex flex-wrap items-center gap-3 justify-between">
          {/* Filter tabs */}
          <div className="flex items-center gap-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "px-3 py-1.5 rounded-lg text-sm transition-colors duration-150",
                  activeTab === tab.id
                    ? "bg-blue-50 text-blue-600 font-medium"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                )}
              >
                {tab.label}
                {tab.count > 0 && (
                  <span className={cn(
                    "ml-1.5 text-xs px-1.5 py-0.5 rounded-full",
                    activeTab === tab.id
                      ? "bg-blue-600/20 text-blue-600"
                      : "bg-slate-100 text-slate-400"
                  )}>
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="relative">
            <svg xmlns="http://www.w3.org/2000/svg" className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
            </svg>
            <input
              type="search"
              placeholder="Analiz ara..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={cn(
                "pl-8 pr-3 py-1.5 text-sm rounded-lg",
                "border border-slate-200 bg-white",
                "text-slate-900 placeholder:text-slate-400",
                "focus:outline-none focus:ring-1 focus:ring-[--brand-primary]/50 focus:border-[--brand-primary]/50",
                "transition-all duration-150 w-48"
              )}
            />
          </div>
        </div>
      </div>

      {/* List */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6 space-y-3">
        {/* Skeleton */}
        {!isLoaded && (
          <>
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-20 rounded-xl bg-slate-100 animate-pulse" />
            ))}
          </>
        )}

        {/* Empty state */}
        {isLoaded && filtered.length === 0 && (
          <div className="rounded-xl border border-dashed border-slate-200 py-16 text-center">
            <div className="h-12 w-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
              </svg>
            </div>
            <p className="text-sm font-medium text-slate-600">
              {searchQuery ? "Aramanızla eşleşen analiz bulunamadı." : "Bu kategoride kayıtlı analiz yok."}
            </p>
            <Link
              href="/analyze"
              className="mt-3 inline-block text-sm text-blue-600 hover:underline"
            >
              Yeni analiz başlat
            </Link>
          </div>
        )}

        {/* Analysis list */}
        {isLoaded && filtered.map((analysis) => (
          <AnalysisCard
            key={analysis.id}
            analysis={analysis}
            onRemove={remove}
            onToggleFavorite={toggleFavorite}
            showNote
          />
        ))}
      </div>

      {/* New analysis CTA */}
      {isLoaded && totalCount >= 0 && (
        <div className="max-w-3xl mx-auto px-4 sm:px-6 pb-12">
          <Link
            href="/analyze"
            className={cn(
              "flex items-center justify-center gap-2",
              "rounded-xl border border-dashed border-[--brand-primary]/30",
              "py-4 text-sm text-blue-600 font-medium",
              "hover:bg-blue-50 transition-colors duration-150"
            )}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            Yeni Analiz Başlat
          </Link>
        </div>
      )}
    </div>
  );
}
