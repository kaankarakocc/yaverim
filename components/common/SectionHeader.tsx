import { Badge } from "./Badge";
import { cn } from "@/lib/utils/cn";
import type { ReactNode } from "react";

interface SectionHeaderProps {
  badge?: string;
  title: ReactNode;
  description?: ReactNode;
  align?: "center" | "left";
  className?: string;
}

export function SectionHeader({
  badge,
  title,
  description,
  align = "center",
  className,
}: SectionHeaderProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-3 mb-12",
        align === "center" && "items-center text-center",
        align === "left" && "items-start text-left",
        className
      )}
    >
      {badge && <Badge variant="brand">{badge}</Badge>}
      <h2 className="text-balance max-w-2xl">{title}</h2>
      {description && (
        <p className="text-slate-600 max-w-xl text-balance leading-relaxed">
          {description}
        </p>
      )}
    </div>
  );
}
