"use client";

import { useState } from "react";
import { cn } from "@/lib/utils/cn";

interface PdfActionsProps {
  planTitle: string;
}

export function PdfActions({ planTitle }: PdfActionsProps) {
  const [downloading, setDownloading] = useState(false);
  const [copied, setCopied] = useState(false);

  function handleDownload() {
    setDownloading(true);
    setTimeout(() => setDownloading(false), 2000);
  }

  async function handleCopyLink() {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard permission denied */
    }
  }

  const btnClass = cn(
    "inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium border transition-colors duration-150",
    "disabled:opacity-60 disabled:cursor-not-allowed",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
  );

  return (
    <div className="rounded-xl px-5 py-4" style={{ border: "1px solid #e2e8f0", backgroundColor: "#f8fafc" }}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.08em] mb-0.5" style={{ color: "#94a3b8" }}>
            Planını kaydet
          </p>
          <p className="text-sm" style={{ color: "#475569" }}>
            Bağlantıyı kopyala ya da sayfayı tarayıcından kaydet.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleDownload}
            disabled={downloading}
            className={btnClass}
            style={{ backgroundColor: "#ffffff", color: "#0f172a", borderColor: "#e2e8f0" }}
            aria-label={`${planTitle} planını kaydet`}
          >
            {downloading ? (
              <>
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24" style={{ color: "#94a3b8" }} aria-hidden>
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                </svg>
                Hazırlanıyor…
              </>
            ) : (
              <>
                <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4" aria-hidden>
                  <path d="M10.75 2.75a.75.75 0 0 0-1.5 0v8.614L6.295 8.235a.75.75 0 1 0-1.09 1.03l4.25 4.5a.75.75 0 0 0 1.09 0l4.25-4.5a.75.75 0 0 0-1.09-1.03l-2.955 3.129V2.75z" />
                  <path d="M3.5 12.75a.75.75 0 0 0-1.5 0v2.5A2.75 2.75 0 0 0 4.75 18h10.5A2.75 2.75 0 0 0 18 15.25v-2.5a.75.75 0 0 0-1.5 0v2.5c0 .69-.56 1.25-1.25 1.25H4.75c-.69 0-1.25-.56-1.25-1.25v-2.5z" />
                </svg>
                Planı indir
              </>
            )}
          </button>

          <button
            onClick={handleCopyLink}
            className={btnClass}
            style={{ backgroundColor: "#ffffff", color: "#0f172a", borderColor: "#e2e8f0" }}
            aria-label="Sayfanın bağlantısını kopyala"
          >
            {copied ? (
              <>
                <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4" style={{ color: "#16a34a" }} aria-hidden>
                  <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143z" clipRule="evenodd" />
                </svg>
                Kopyalandı
              </>
            ) : (
              <>
                <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4" aria-hidden>
                  <path d="M12.232 4.232a2.5 2.5 0 0 1 3.536 3.536l-1.225 1.224a.75.75 0 0 0 1.061 1.06l1.224-1.224a4 4 0 0 0-5.656-5.656l-3 3a4 4 0 0 0 .225 5.865.75.75 0 0 0 .977-1.138 2.5 2.5 0 0 1-.142-3.667l3-3z" />
                  <path d="M11.603 7.963a.75.75 0 0 0-.977 1.138 2.5 2.5 0 0 1 .142 3.667l-3 3a2.5 2.5 0 0 1-3.536-3.536l1.225-1.224a.75.75 0 0 0-1.061-1.06l-1.224 1.224a4 4 0 0 0 5.656 5.656l3-3a4 4 0 0 0-.225-5.865z" />
                </svg>
                Bağlantıyı kopyala
              </>
            )}
          </button>
        </div>
      </div>

      <p className="text-xs mt-3" style={{ color: "#94a3b8" }}>
        Planı tarayıcından "Sayfayı farklı kaydet" ile PDF olarak da indirebilirsin.
      </p>
    </div>
  );
}
