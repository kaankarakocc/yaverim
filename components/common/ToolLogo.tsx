"use client";

import { useState } from "react";

interface Props {
  name:       string;
  websiteUrl: string;
  size?:      number;
  className?: string;
  style?:     React.CSSProperties;
}

function extractDomain(url: string): string {
  try { return new URL(url).hostname.replace(/^www\./, ""); }
  catch { return url.replace(/^https?:\/\/(www\.)?/, "").split("/")[0]; }
}

const INIT_COLORS = [
  "#2563eb", "#7c3aed", "#0891b2", "#059669", "#d97706",
  "#dc2626", "#9333ea", "#0284c7", "#16a34a", "#b45309",
];

function initColor(name: string): string {
  let h = 0;
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) & 0xffffffff;
  return INIT_COLORS[Math.abs(h) % INIT_COLORS.length];
}

/**
 * Renders a real company logo using Google's favicon service.
 * Google S2 has icons for virtually every website, always returns a valid image.
 * Falls back to a colored initial badge only if the icon cannot load.
 */
export function ToolLogo({ name, websiteUrl, size = 32, className = "", style }: Props) {
  const domain = extractDomain(websiteUrl);

  // Google S2 favicon API — free, no key, works for all websites, up to 256px
  // sz=128 gives 2× resolution for sharp display at up to 64px
  const src = `https://www.google.com/s2/favicons?sz=128&domain=${domain}`;

  const [error, setError] = useState(false);

  const radius = Math.round(size * 0.25);
  const font   = Math.round(size * 0.44);

  if (error) {
    return (
      <div
        className={`flex-shrink-0 flex items-center justify-center font-bold text-white select-none ${className}`}
        style={{
          width:        size,
          height:       size,
          borderRadius: radius,
          background:   initColor(name),
          fontSize:     font,
          ...style,
        }}
      >
        {name[0]?.toUpperCase() ?? "?"}
      </div>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={`${name} logo`}
      width={size}
      height={size}
      onError={() => setError(true)}
      className={`flex-shrink-0 object-contain bg-white ${className}`}
      style={{
        width:        size,
        height:       size,
        borderRadius: radius,
        padding:      Math.max(2, Math.round(size * 0.06)),
        border:       "1px solid #e2e8f0",
        ...style,
      }}
    />
  );
}
