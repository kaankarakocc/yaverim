"use client";

import { signIn } from "next-auth/react";
import { cn } from "@/lib/utils/cn";

interface SignInPromptProps {
  /** Main heading shown above the sign-in button. */
  title?: string;
  /** Supporting text explaining why sign-in is needed. */
  description?: string;
  /** Where to send the user after successful sign-in. */
  callbackUrl?: string;
  className?: string;
}

/**
 * Minimal sign-in prompt used inside protected pages and premium unlock flow.
 * Not a full-screen modal — designed to embed inline within a section.
 */
export function SignInPrompt({
  title       = "Planını kaydetmek için giriş yap",
  description = "Google hesabınla giriş yaparak analizlerini kaydet, geçmişe dön ve premium planlarına ulaş.",
  callbackUrl,
  className,
}: SignInPromptProps) {
  return (
    <div
      className={cn(
        "rounded-xl border border-slate-200",
        "bg-white px-6 py-8 flex flex-col items-center text-center gap-4",
        className
      )}
    >
      {/* Icon */}
      <div className="h-12 w-12 rounded-full bg-blue-50 flex items-center justify-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6 text-blue-600"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.5}
          aria-hidden
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
          />
        </svg>
      </div>

      <div className="space-y-1.5">
        <h3 className="text-base font-semibold text-slate-900">{title}</h3>
        <p className="text-sm text-slate-600 max-w-sm">{description}</p>
      </div>

      <button
        type="button"
        onClick={() => signIn("google", { callbackUrl: callbackUrl ?? "/account" })}
        className={cn(
          "inline-flex items-center gap-2.5 px-5 py-2.5 rounded-lg",
          "bg-white border border-zinc-200 hover:bg-zinc-50",
          "text-sm font-medium text-zinc-700",
          "shadow-sm transition-all duration-150",
          "hover:shadow-md"
        )}
      >
        {/* Google icon */}
        <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden>
          <path
            fill="#4285F4"
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
          />
          <path
            fill="#34A853"
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
          />
          <path
            fill="#FBBC05"
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
          />
          <path
            fill="#EA4335"
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
          />
        </svg>
        Google ile Giriş Yap
      </button>

      <p className="text-xs text-slate-400">
        Ücretsiz hesap · Kart bilgisi gerekmez
      </p>
    </div>
  );
}
