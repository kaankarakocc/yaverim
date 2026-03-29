import { Top10Card, type Top10CardData } from "./Top10Card";
import { cn } from "@/lib/utils/cn";

interface Top10ListProps {
  tools: Top10CardData[];
  className?: string;
}

export function Top10List({ tools, className }: Top10ListProps) {
  return (
    <ol
      className={cn("flex flex-col gap-3", className)}
      aria-label="Top 10 yapay zekâ araçları listesi"
    >
      {tools.map((tool) => (
        <li key={tool.slug}>
          <Top10Card tool={tool} />
        </li>
      ))}
    </ol>
  );
}
