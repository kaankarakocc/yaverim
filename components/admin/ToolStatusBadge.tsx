import type { ToolLifecycleStatus } from "@/data/schemas/tool";
import { lifecycleLabel } from "@/lib/ops/validate-tools";
import { cn } from "@/lib/utils/cn";

interface ToolStatusBadgeProps {
  status: ToolLifecycleStatus;
  className?: string;
}

const STATUS_STYLES: Record<ToolLifecycleStatus, string> = {
  priority:   "bg-violet-100 text-violet-700 border border-violet-200",
  core:       "bg-blue-50    text-blue-700   border border-blue-200",
  tracked:    "bg-amber-50   text-amber-700  border border-amber-200",
  candidate:  "bg-zinc-100   text-slate-400   border border-zinc-200",
  deprecated: "bg-red-50     text-red-600    border border-red-200 line-through",
};

const STATUS_DOT: Record<ToolLifecycleStatus, string> = {
  priority:   "bg-violet-500",
  core:       "bg-blue-500",
  tracked:    "bg-amber-500",
  candidate:  "bg-zinc-400",
  deprecated: "bg-red-400",
};

export function ToolStatusBadge({ status, className }: ToolStatusBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium",
        STATUS_STYLES[status],
        className
      )}
    >
      <span className={cn("w-1.5 h-1.5 rounded-full flex-shrink-0", STATUS_DOT[status])} aria-hidden="true" />
      {lifecycleLabel(status)}
    </span>
  );
}
