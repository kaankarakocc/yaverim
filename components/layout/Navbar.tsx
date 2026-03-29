"use client";

import { useState } from "react";
import Link from "next/link";
import { Logo } from "@/components/common/Logo";
import { UserMenu } from "@/components/auth/UserMenu";

const NAV_LINKS = [
  { label: "Nasıl Çalışır?", href: "/#nasil-calisir" },
  { label: "Top 10",         href: "/top10"           },
  { label: "Araçlar",        href: "/tools"           },
  { label: "Karşılaştır",    href: "/compare"         },
] as const;

export function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header
      className="sticky top-0 z-50 w-full backdrop-blur-md"
      style={{
        backgroundColor: "rgba(255,255,255,0.92)",
        borderBottom: "1px solid #e2e8f0",
        boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
      }}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <nav className="flex h-16 items-center justify-between gap-4">

          {/* Brand */}
          <Logo size="md" asLink />

          {/* Desktop nav links */}
          <ul className="hidden md:flex items-center gap-0.5">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="px-3 py-2 rounded-lg text-sm font-medium transition-colors hover:bg-slate-100"
                  style={{ color: "#475569" }}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          {/* Desktop right: CTAs + auth */}
          <div className="hidden md:flex items-center gap-2">
            <a
              href="/tools"
              className="px-3 py-1.5 rounded-lg text-sm font-medium transition-colors hover:bg-slate-100 hover:text-slate-900"
              style={{ color: "#475569" }}
            >
              Araçları Keşfet
            </a>

            <a
              href="/analyze"
              className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-sm font-semibold transition-opacity hover:opacity-90"
              style={{ backgroundColor: "#2563eb", color: "#ffffff" }}
            >
              Analizi Başlat
            </a>

            {/* Divider + auth */}
            <div className="h-5 w-px mx-1" style={{ backgroundColor: "#e2e8f0" }} aria-hidden />
            <UserMenu />
          </div>

          {/* Mobile: hamburger */}
          <button
            type="button"
            className="md:hidden flex items-center justify-center w-9 h-9 rounded-lg transition-colors hover:bg-slate-100"
            style={{ color: "#475569" }}
            aria-label="Menüyü aç/kapat"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((v) => !v)}
          >
            <svg
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
              aria-hidden
            >
              {menuOpen
                ? <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                : <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              }
            </svg>
          </button>
        </nav>

        {/* Mobile menu */}
        {menuOpen && (
          <div
            className="md:hidden flex flex-col gap-0.5 py-3 pb-4"
            style={{ borderTop: "1px solid #e2e8f0" }}
          >
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="px-3 py-2.5 rounded-lg text-sm font-medium transition-colors hover:bg-slate-100 hover:text-slate-900"
                style={{ color: "#475569" }}
                onClick={() => setMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}

            <div className="mt-3 flex flex-col gap-2">
              <a
                href="/tools"
                className="w-full inline-flex items-center justify-center px-4 py-2.5 rounded-lg text-sm font-medium border transition-colors hover:bg-slate-50"
                style={{ borderColor: "#e2e8f0", color: "#334155", backgroundColor: "#ffffff" }}
              >
                Araçları Keşfet
              </a>
              <a
                href="/analyze"
                className="w-full inline-flex items-center justify-center px-4 py-2.5 rounded-lg text-sm font-semibold transition-opacity hover:opacity-90"
                style={{ backgroundColor: "#2563eb", color: "#ffffff" }}
              >
                Analizi Başlat
              </a>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
