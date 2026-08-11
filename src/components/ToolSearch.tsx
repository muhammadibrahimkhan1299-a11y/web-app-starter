import { Link, useNavigate } from "@tanstack/react-router";
import { Search, X } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";

import { getCategory } from "@/data/types";
import { searchTools } from "@/data/tools";
import { track } from "@/lib/analytics";
import { cn } from "@/lib/utils";

interface Props {
  size?: "sm" | "lg";
  placeholder?: string;
  label?: string;
  autoFocus?: boolean;
  className?: string;
  onNavigate?: () => void;
}

export function ToolSearch({
  size = "sm",
  placeholder = "Search calculators, converters, PDF tools, QR generators...",
  label = "What tool do you need?",
  autoFocus,
  className,
  onNavigate,
}: Props) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const boxRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const results = useMemo(() => searchTools(query, 8), [query]);

  useEffect(() => {
    setActive(0);
  }, [query]);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (!boxRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const go = (slug: string) => {
    track("search_performed", { query_length: query.trim().length, picked: slug });
    setOpen(false);
    setQuery("");
    onNavigate?.();
    navigate({ to: "/$slug", params: { slug } });
  };

  return (
    <div ref={boxRef} className={cn("relative w-full", className)}>
      <label htmlFor="tool-search" className="sr-only">
        {label}
      </label>
      <div className="relative">
        <Search
          className={cn(
            "pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground",
            size === "lg" ? "size-5" : "size-4",
          )}
          aria-hidden="true"
        />
        <input
          id="tool-search"
          type="search"
          value={query}
          autoFocus={autoFocus}
          enterKeyHint="search"
          autoComplete="off"
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={(e) => {
            if (!results.length) return;
            if (e.key === "ArrowDown") {
              e.preventDefault();
              setActive((i) => (i + 1) % results.length);
            } else if (e.key === "ArrowUp") {
              e.preventDefault();
              setActive((i) => (i - 1 + results.length) % results.length);
            } else if (e.key === "Enter") {
              e.preventDefault();
              const picked = results[active];
              if (picked) go(picked.slug);
            } else if (e.key === "Escape") {
              setOpen(false);
            }
          }}
          placeholder={placeholder}
          className={cn(
            "w-full rounded-full border border-input bg-card text-foreground shadow-card outline-none transition placeholder:text-muted-foreground focus:border-primary focus:ring-4 focus:ring-primary/15",
            size === "lg" ? "h-14 pl-12 pr-12 text-base" : "h-11 pl-11 pr-10 text-sm",
          )}
        />
        {query ? (
          <button
            type="button"
            aria-label="Clear search"
            onClick={() => setQuery("")}
            className="absolute right-3 top-1/2 flex size-8 -translate-y-1/2 items-center justify-center rounded-full text-muted-foreground transition hover:bg-muted hover:text-foreground"
          >
            <X className="size-4" aria-hidden="true" />
          </button>
        ) : null}
      </div>

      {open && query.trim().length > 0 ? (
        <div className="absolute z-50 mt-2 w-full overflow-hidden rounded-2xl border border-border bg-popover shadow-lift">
          {results.length === 0 ? (
            <p className="px-4 py-6 text-center text-sm text-muted-foreground">
              No tool matches “{query}”. Try “percentage”, “pdf” or “convert”.
            </p>
          ) : (
            <ul className="max-h-[22rem] overflow-y-auto py-1">
              {results.map((tool, i) => (
                <li key={tool.slug}>
                  <Link
                    to="/$slug"
                    params={{ slug: tool.slug }}
                    onMouseEnter={() => setActive(i)}
                    onClick={() => go(tool.slug)}
                    className={cn(
                      "flex items-center justify-between gap-3 px-4 py-2.5 text-left transition",
                      i === active ? "bg-accent" : "bg-transparent",
                    )}
                  >
                    <span className="min-w-0">
                      <span className="block truncate text-sm font-semibold text-foreground">
                        {tool.name}
                      </span>
                      <span className="block truncate text-xs text-muted-foreground">
                        {tool.tagline}
                      </span>
                    </span>
                    <span className="shrink-0 rounded-full bg-muted px-2 py-0.5 text-[11px] font-medium text-muted-foreground">
                      {getCategory(tool.category).name}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      ) : null}
    </div>
  );
}
