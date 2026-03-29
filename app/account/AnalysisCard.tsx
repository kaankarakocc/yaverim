"use client";

import Link from "next/link";
import { cn } from "@/lib/utils/cn";
import type { SavedAnalysis } from "@/lib/persistence/types";

interface Props {
  analysis: SavedAnalysis;
  onRemove: (id: string) => void;
  onToggleFavorite: (id: string) => void;
  showNote?: boolean;
}

export function AnalysisCard({ analysis, onRemove, onToggleFavorite }: Props) {
  const formattedDate = new Intl.DateTimeFormat("tr-TR", {
    day:   "numeric",
    month: "short",
    year:  "numeric",
  }).format(new Date(analysis.createdAt));

  return (
    <div
      className={cn(
        "group rounded-xl border border-slate-200 bg-white",
        "px-4 py-3.5 flex items-center gap-4",
        "hover:border-blue-200 hover:bg-slate-100/40",
        "transition-all duration-150"
      )}
    >
      {/* Icon */}
      <div className="h-9 w-9 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4.5 w-4.5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 17.25v1.007a3 3 0 01-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0115 18.257V17.25m6-12V15a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 15V5.25m18 0A2.25 2.25 0 0018.75 3H5.25A2.25 2.25 0 003 5.25m18 0H3" />
        </svg>
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm font-medium text-slate-900 truncate">
            {analysis.title}
          </span>
          {analysis.isPremiumUnlocked && (
            <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full bg-amber-100 text-amber-700 border border-amber-200 shrink-0">
              Premium
            </span>
          )}
        </div>
        <p className="text-xs text-slate-400 mt-0.5">{formattedDate}</p>
        {analysis.note && (
          <p className="text-xs text-slate-600 mt-1 truncate">{analysis.note}</p>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1 shrink-0">
        {/* Favorite */}
        <button
          type="button"
          onClick={() => onToggleFavorite(analysis.id)}
          className={cn(
            "p-1.5 rounded-md transition-colors duration-150",
            analysis.isFavorite
              ? "text-amber-500 hover:bg-amber-50"
              : "text-slate-400 hover:text-amber-500 hover:bg-amber-50 opacity-0 group-hover:opacity-100"
          )}
          aria-label={analysis.isFavorite ? "Favoriden çıkar" : "Favorilere ekle"}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill={analysis.isFavorite ? "currentColor" : "none"} stroke="currentColor" strokeWidth={1.5} aria-hidden>
            <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
          </svg>
        </button>

        {/* Open analysis */}
        <Link
          href={`/results?${analysis.paramsString}`}
          className={cn(
            "p-1.5 rounded-md text-slate-400",
            "hover:text-slate-900 hover:bg-slate-100",
            "transition-colors duration-150"
          )}
          aria-label="Analizi aç"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
          </svg>
        </Link>

        {/* Delete */}
        <button
          type="button"
          onClick={() => onRemove(analysis.id)}
          className={cn(
            "p-1.5 rounded-md",
            "text-slate-400 hover:text-red-500 hover:bg-red-50",
            "transition-colors duration-150",
            "opacity-0 group-hover:opacity-100"
          )}
          aria-label="Sil"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden>
            <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
          </svg>
        </button>
      </div>
    </div>
  );
}
