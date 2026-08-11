import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";

import { getCategory, type Tool } from "@/data/types";
import { cn } from "@/lib/utils";

export function ToolCard({ tool, showCategory = true }: { tool: Tool; showCategory?: boolean }) {
  return (
    <Link
      to="/$slug"
      params={{ slug: tool.slug }}
      className={cn(
        "group flex h-full flex-col justify-between gap-3 rounded-2xl border border-border bg-card p-5 shadow-card transition",
        "hover:border-primary/40 hover:shadow-lift focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/20",
      )}
    >
      <div>
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-base font-semibold leading-snug text-foreground">{tool.name}</h3>
          <ArrowRight
            className="mt-0.5 size-4 shrink-0 text-muted-foreground transition group-hover:translate-x-0.5 group-hover:text-primary"
            aria-hidden="true"
          />
        </div>
        <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{tool.tagline}</p>
      </div>
      {showCategory ? (
        <span className="w-fit rounded-full bg-primary-soft px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-accent-foreground">
          {getCategory(tool.category).name}
        </span>
      ) : null}
    </Link>
  );
}

export function ToolGrid({ tools, columns = 4 }: { tools: Tool[]; columns?: 3 | 4 }) {
  return (
    <div
      className={cn(
        "grid gap-4 sm:grid-cols-2",
        columns === 4 ? "lg:grid-cols-4" : "lg:grid-cols-3",
      )}
    >
      {tools.map((tool) => (
        <ToolCard key={tool.slug} tool={tool} />
      ))}
    </div>
  );
}
