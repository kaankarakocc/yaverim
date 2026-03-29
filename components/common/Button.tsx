import { cn } from "@/lib/utils/cn";
import Link from "next/link";
import type { ComponentPropsWithoutRef, CSSProperties } from "react";

type Variant = "primary" | "secondary" | "ghost" | "premium";
type Size = "sm" | "md" | "lg";

interface BaseProps {
  variant?: Variant;
  size?: Size;
  isLoading?: boolean;
}

type ButtonAsButton = BaseProps &
  ComponentPropsWithoutRef<"button"> & { href?: undefined };

type ButtonAsLink = BaseProps &
  ComponentPropsWithoutRef<typeof Link> & { href: string };

type ButtonProps = ButtonAsButton | ButtonAsLink;

// Use reliable Tailwind classes or inline styles — NO CSS-var arbitrary classes
const variantClasses: Record<Variant, string> = {
  primary:   "shadow-sm",
  premium:   "shadow-sm",
  secondary: "bg-slate-100 text-slate-800 border border-slate-200 hover:bg-slate-200 active:bg-slate-300",
  ghost:     "text-slate-600 hover:bg-slate-100 hover:text-slate-900",
};

// Inline styles for color-critical variants so they NEVER become invisible
const variantInlineStyles: Record<Variant, CSSProperties> = {
  primary:   { backgroundColor: "#2563eb", color: "#ffffff" },
  premium:   { background: "linear-gradient(to right, #7c3aed, #8b5cf6)", color: "#ffffff" },
  secondary: {},
  ghost:     {},
};

const sizeStyles: Record<Size, string> = {
  sm: "h-8 px-3 text-sm rounded-lg gap-1.5",
  md: "h-10 px-5 text-sm rounded-lg gap-2",
  lg: "h-12 px-6 text-base rounded-xl gap-2.5",
};

const baseStyles = [
  "inline-flex items-center justify-center font-medium",
  "transition-opacity duration-150",
  "focus-visible:outline-2 focus-visible:outline-blue-500 focus-visible:outline-offset-2",
  "disabled:opacity-50 disabled:pointer-events-none",
  "whitespace-nowrap select-none",
].join(" ");

export function Button({
  variant = "primary",
  size = "md",
  isLoading = false,
  className,
  children,
  ...props
}: ButtonProps) {
  const classes = cn(
    baseStyles,
    variantClasses[variant],
    sizeStyles[size],
    className
  );

  const inlineStyle = variantInlineStyles[variant];

  const content = isLoading ? (
    <>
      <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
      <span>Yükleniyor…</span>
    </>
  ) : (
    children
  );

  if ("href" in props && props.href !== undefined) {
    const { href, ...linkProps } = props as ButtonAsLink;
    return (
      <Link href={href} className={classes} style={inlineStyle} {...linkProps}>
        {content}
      </Link>
    );
  }

  return (
    <button
      className={classes}
      style={inlineStyle}
      disabled={isLoading || (props as ButtonAsButton).disabled}
      {...(props as ButtonAsButton)}
    >
      {content}
    </button>
  );
}
