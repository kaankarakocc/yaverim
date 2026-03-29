"use client";

import { useSession, signIn, signOut } from "next-auth/react";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";

/**
 * Navbar user area.
 *  loading         → skeleton pulse
 *  unauthenticated → "Giriş Yap" outlined button
 *  authenticated   → avatar + name + dropdown
 */
export function UserMenu() {
  const { data: session, status } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, []);

  /* Loading */
  if (status === "loading") {
    return (
      <div
        className="h-8 w-16 rounded-lg animate-pulse"
        style={{ backgroundColor: "#f1f5f9" }}
        aria-hidden
      />
    );
  }

  /* Unauthenticated */
  if (status === "unauthenticated" || !session) {
    return (
      <button
        type="button"
        onClick={() => signIn("google")}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors hover:bg-slate-100"
        style={{
          color: "#334155",
          border: "1px solid #cbd5e1",
          backgroundColor: "#ffffff",
        }}
      >
        <svg viewBox="0 0 16 16" fill="currentColor" className="w-3.5 h-3.5 flex-shrink-0" aria-hidden style={{ color: "#64748b" }}>
          <path fillRule="evenodd" d="M8 1a3.5 3.5 0 0 0-3.5 3.5V7A1.5 1.5 0 0 0 3 8.5v5A1.5 1.5 0 0 0 4.5 15h7a1.5 1.5 0 0 0 1.5-1.5v-5A1.5 1.5 0 0 0 11 7V4.5A3.5 3.5 0 0 0 8 1Zm2 6V4.5a2 2 0 1 0-4 0V7h4Z" clipRule="evenodd" />
        </svg>
        Giriş Yap
      </button>
    );
  }

  /* Authenticated */
  const user = session.user;
  const initials = (user.name ?? user.email ?? "?")
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <div className="relative" ref={menuRef}>
      <button
        type="button"
        onClick={() => setIsOpen((v) => !v)}
        className="flex items-center gap-2 rounded-lg px-2 py-1 transition-colors hover:bg-slate-100"
        aria-expanded={isOpen}
        aria-label="Hesap menüsü"
      >
        {/* Avatar */}
        <div
          className="h-7 w-7 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0 overflow-hidden"
          style={{ backgroundColor: "#2563eb" }}
        >
          {user.image
            ? <img src={user.image} alt={user.name ?? "Kullanıcı"} className="h-7 w-7 object-cover" />
            : initials
          }
        </div>

        {/* Name */}
        <span className="hidden sm:block text-sm font-medium max-w-[100px] truncate" style={{ color: "#1e293b" }}>
          {user.name?.split(" ")[0] ?? "Hesabım"}
        </span>

        {/* Chevron */}
        <svg
          className={`hidden sm:block w-3.5 h-3.5 transition-transform duration-150 ${isOpen ? "rotate-180" : ""}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
          style={{ color: "#94a3b8" }}
          aria-hidden
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div
          className="absolute right-0 top-full mt-2 w-52 rounded-xl py-1 z-50"
          style={{
            backgroundColor: "#ffffff",
            border: "1px solid #e2e8f0",
            boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
          }}
        >
          {/* User info */}
          <div className="px-3 py-2.5" style={{ borderBottom: "1px solid #f1f5f9" }}>
            <p className="text-sm font-semibold truncate" style={{ color: "#0f172a" }}>
              {user.name ?? "Kullanıcı"}
            </p>
            <p className="text-xs truncate mt-0.5" style={{ color: "#94a3b8" }}>{user.email}</p>
          </div>

          {/* Menu items */}
          <div className="py-1">
            <DropdownItem href="/account"       onClick={() => setIsOpen(false)}>Hesabım</DropdownItem>
            <DropdownItem href="/account/plans" onClick={() => setIsOpen(false)}>Kayıtlı Planlar</DropdownItem>
            <DropdownItem href="/analyze"       onClick={() => setIsOpen(false)}>Yeni Analiz</DropdownItem>
          </div>

          {/* Sign out */}
          <div className="pt-1" style={{ borderTop: "1px solid #f1f5f9" }}>
            <button
              type="button"
              onClick={() => { setIsOpen(false); signOut({ callbackUrl: "/" }); }}
              className="w-full text-left px-3 py-2 text-sm transition-colors hover:bg-slate-50"
              style={{ color: "#ef4444" }}
            >
              Çıkış Yap
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function DropdownItem({ href, onClick, children }: { href: string; onClick: () => void; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="block px-3 py-2 text-sm transition-colors hover:bg-slate-50"
      style={{ color: "#334155" }}
    >
      {children}
    </Link>
  );
}
