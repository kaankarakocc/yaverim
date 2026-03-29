import { cn } from "@/lib/utils/cn";
import { Container } from "./Container";
import type { ComponentPropsWithoutRef } from "react";

interface SectionProps extends ComponentPropsWithoutRef<"section"> {
  bg?: "white" | "subtle" | "muted" | "brand";
  spacing?: "sm" | "md" | "lg" | "xl";
  containerSize?: "default" | "narrow" | "wide";
  noContainer?: boolean;
}

/* All bg values use explicit Tailwind classes — no CSS-variable arbitrary classes */
const bgStyles: Record<NonNullable<SectionProps["bg"]>, string> = {
  white:  "bg-white",
  subtle: "bg-slate-50",
  muted:  "bg-slate-100",
  brand:  "bg-blue-600",
};

const spacingStyles: Record<NonNullable<SectionProps["spacing"]>, string> = {
  sm: "py-10 md:py-14",
  md: "py-16 md:py-20",
  lg: "py-20 md:py-28",
  xl: "py-28 md:py-36",
};

export function Section({
  bg = "white",
  spacing = "lg",
  containerSize = "default",
  noContainer = false,
  className,
  children,
  ...props
}: SectionProps) {
  return (
    <section
      className={cn(bgStyles[bg], spacingStyles[spacing], className)}
      {...props}
    >
      {noContainer ? children : <Container size={containerSize}>{children}</Container>}
    </section>
  );
}
