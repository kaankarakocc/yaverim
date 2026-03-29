import Link from "next/link";
import { cn } from "@/lib/utils/cn";

interface LogoProps {
  size?: "sm" | "md" | "lg";
  className?: string;
  asLink?: boolean;
  /** "light" = on white/light bg · "dark" = on dark bg */
  theme?: "light" | "dark";
}

const sizes = {
  sm: { text: "text-base",  dot: 7  },
  md: { text: "text-xl",   dot: 8  },
  lg: { text: "text-2xl",  dot: 10 },
};

function LogoMark({ theme = "light", size = "md" }: { theme?: "light" | "dark"; size?: "sm" | "md" | "lg" }) {
  const { text, dot } = sizes[size];
  const textColor = theme === "dark" ? "#f1f5f9" : "#0f172a";

  return (
    <span className={cn("inline-flex items-center gap-2 font-bold tracking-tight select-none", text)}>
      {/* Minimal brand mark — two stacked dots forming a subtle "Y" shape */}
      <span
        className="flex-shrink-0 inline-flex flex-col items-center"
        style={{ gap: 2, width: dot + 2 }}
        aria-hidden
      >
        <span
          style={{
            width: dot,
            height: dot,
            borderRadius: "50%",
            backgroundColor: "#2563eb",
            display: "block",
          }}
        />
        <span
          style={{
            width: Math.round(dot * 0.55),
            height: Math.round(dot * 0.55),
            borderRadius: "50%",
            backgroundColor: "#93c5fd",
            display: "block",
          }}
        />
      </span>
      <span style={{ color: textColor }}>Yaverim</span>
    </span>
  );
}

export function Logo({ size = "md", className, asLink = true, theme = "light" }: LogoProps) {
  if (asLink) {
    return (
      <Link
        href="/"
        className={cn("inline-flex items-center transition-opacity hover:opacity-80", className)}
        aria-label="Yaverim — Ana sayfa"
      >
        <LogoMark theme={theme} size={size} />
      </Link>
    );
  }

  return (
    <div className={cn("inline-flex items-center", className)}>
      <LogoMark theme={theme} size={size} />
    </div>
  );
}
