import { cn } from "@/lib/utils/cn";
import type { ComponentPropsWithoutRef } from "react";

interface ContainerProps extends ComponentPropsWithoutRef<"div"> {
  as?: "div" | "section" | "article" | "main" | "header" | "footer";
  size?: "default" | "narrow" | "wide";
}

const sizeStyles = {
  default: "max-w-[72rem]",
  narrow: "max-w-[52rem]",
  wide: "max-w-[90rem]",
};

export function Container({
  as: Tag = "div",
  size = "default",
  className,
  children,
  ...props
}: ContainerProps) {
  return (
    <Tag
      className={cn(
        "w-full mx-auto px-4 sm:px-6 lg:px-8",
        sizeStyles[size],
        className
      )}
      {...props}
    >
      {children}
    </Tag>
  );
}
