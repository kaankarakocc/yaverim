import { MiniToolCard } from "./MiniToolCard";
import { cn } from "@/lib/utils/cn";
import type { SolutionAreaResult } from "@/lib/recommendation/mock-engine";

interface SolutionAreaSectionProps {
  areas: SolutionAreaResult[];
  className?: string;
}

function AreaBlock({ area }: { area: SolutionAreaResult }) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center gap-2.5">
          <span
            className="h-6 w-6 rounded-lg flex items-center justify-center flex-shrink-0"
            style={{ backgroundColor: "#eff6ff" }}
            aria-hidden
          >
            <span className="h-2 w-2 rounded-full" style={{ backgroundColor: "#2563eb" }} />
          </span>
          <h3 className="font-semibold text-base" style={{ color: "#0f172a" }}>{area.label}</h3>
        </div>
        <p className="text-sm" style={{ color: "#475569", paddingLeft: "2.125rem" }}>{area.description}</p>
      </div>
      <ul className="flex flex-col gap-2.5" style={{ paddingLeft: "2.125rem" }}>
        {area.tools.map((tool, i) => (
          <li key={tool.slug}>
            <MiniToolCard tool={tool} rank={i + 1} />
          </li>
        ))}
      </ul>
    </div>
  );
}

export function SolutionAreaSection({ areas, className }: SolutionAreaSectionProps) {
  if (areas.length === 0) return null;

  return (
    <div className={cn("flex flex-col gap-6", className)}>
      <div className="flex flex-col gap-1">
        <p className="text-[11px] font-bold uppercase tracking-[0.1em]" style={{ color: "#94a3b8" }}>
          Çözüm Alanları
        </p>
        <h2 className="text-xl font-semibold tracking-tight" style={{ color: "#0f172a" }}>
          Seçtiğin alanlarda öneriler
        </h2>
        <p className="text-sm" style={{ color: "#475569" }}>
          Her alan için bütçene ve profiline uygun araçlar sıralandı.
        </p>
      </div>
      <div className="flex flex-col gap-8">
        {areas.map((area) => (
          <AreaBlock key={area.area} area={area} />
        ))}
      </div>
    </div>
  );
}
