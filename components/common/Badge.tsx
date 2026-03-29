import { cn } from "@/lib/utils/cn";
import type { ComponentPropsWithoutRef, CSSProperties } from "react";

type BadgeVariant = "default" | "brand" | "premium" | "success" | "muted" | "sponsored";

interface BadgeProps extends ComponentPropsWithoutRef<"span"> {
  variant?: BadgeVariant;
}

// Use only standard Tailwind classes + inline styles — NO CSS-var arbitrary classes
const variantClasses: Record<BadgeVariant, string> = {
  default:   "bg-slate-100 text-slate-700 border border-slate-200",
  brand:     "bg-blue-50 text-blue-700 border border-blue-100",
  premium:   "text-white border-0",   // bg applied via inline style
  success:   "bg-green-50 text-green-700 border border-green-100",
  muted:     "bg-slate-50 text-slate-500 border border-slate-200",
  sponsored: "bg-amber-50 text-amber-700 border border-amber-100",
};

const variantInlineStyles: Record<BadgeVariant, CSSProperties> = {
  default:   {},
  brand:     {},
  premium:   { background: "linear-gradient(to right, #7c3aed, #8b5cf6)" },
  success:   {},
  muted:     {},
  sponsored: {},
};

export function Badge({
  variant = "default",
  className,
  children,
  style,
  ...props
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium",
        variantClasses[variant],
        className
      )}
      style={{ ...variantInlineStyles[variant], ...style }}
      {...props}
    >
      {children}
    </span>
  );
}
