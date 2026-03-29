"use client";

import { useState } from "react";

interface CheckoutButtonProps {
  plan: "one-time" | "subscription";
  queryString?: string;
  className?: string;
  style?: React.CSSProperties;
  children: React.ReactNode;
}

/**
 * Stripe Checkout'a yönlendiren buton.
 * STRIPE_SECRET_KEY yoksa (dev/mock) premium sayfasına doğrudan gider.
 */
export function CheckoutButton({
  plan,
  queryString,
  className,
  style,
  children,
}: CheckoutButtonProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleClick() {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/payment/create-checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan, queryString }),
      });

      const data = await res.json();

      if (!res.ok) {
        // Stripe henüz kurulmamışsa dev bypass ile direkt premium'a git
        if (res.status === 500 && data.error?.includes("fiyat ID")) {
          const qs = queryString ? `?${queryString}` : "";
          window.location.href = `/premium${qs}`;
          return;
        }
        throw new Error(data.error ?? "Ödeme başlatılamadı");
      }

      if (data.url) {
        window.location.href = data.url;
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Bilinmeyen hata";
      setError(msg);
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <button
        onClick={handleClick}
        disabled={loading}
        className={className}
        style={{ ...style, opacity: loading ? 0.7 : 1, cursor: loading ? "wait" : "pointer" }}
      >
        {loading ? (
          <span className="flex items-center gap-2">
            <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none" aria-hidden>
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
            </svg>
            Yönlendiriliyor…
          </span>
        ) : children}
      </button>
      {error && (
        <p className="text-xs text-red-600 text-center">{error}</p>
      )}
    </div>
  );
}
