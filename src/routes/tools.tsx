import { createFileRoute } from "@tanstack/react-router";

import { AdSlot } from "@/components/AdSlot";
import { ToolCard } from "@/components/ToolCard";
import { ToolSearch } from "@/components/ToolSearch";
import { site } from "@/config/site";
import { searchTools, tools, toolsByCategory } from "@/data/tools";
import { categories } from "@/data/types";

const title = `All Online Tools (${tools.length}+ Free Utilities) | ${site.name}`;
const description = `Browse every free ${site.name} utility: calculators, unit converters, text tools, image and PDF tools, QR codes and a link shortener. No sign-up, nothing uploaded.`;

export const Route = createFileRoute("/tools")({
  validateSearch: (search: Record<string, unknown>) => ({
    q: typeof search["q"] === "string" ? (search["q"] as string) : undefined,
  }),
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/tools" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: title },
      { name: "twitter:description", content: description },
    ],
    links: [{ rel: "canonical", href: "/tools" }],
  }),
  component: AllTools,
});

function AllTools() {
  const { q } = Route.useSearch();
  const results = q ? searchTools(q, 60) : [];

  return (
    <div className="container-page pb-12">
      <nav aria-label="Breadcrumb" className="pt-8 text-sm text-muted-foreground">
        <a href="/" className="hover:text-primary">
          Home
        </a>
        <span aria-hidden="true"> / </span>
        <span className="text-foreground">All tools</span>
      </nav>

      <header className="mt-4">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">All {site.name} tools</h1>
        <p className="mt-3 max-w-2xl text-muted-foreground">{description}</p>
        <div className="mt-6 max-w-2xl">
          <ToolSearch autoFocus={false} />
        </div>
      </header>

      <AdSlot position="header" className="mt-8" />

      {q ? (
        <section className="mt-10">
          <h2 className="text-xl font-bold tracking-tight">
            {results.length} result{results.length === 1 ? "" : "s"} for “{q}”
          </h2>
          <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {results.map((tool) => (
              <ToolCard key={tool.slug} tool={tool} />
            ))}
          </div>
          {results.length === 0 ? (
            <p className="mt-4 text-sm text-muted-foreground">
              Nothing matched. Try a shorter keyword, or browse the categories below.
            </p>
          ) : null}
        </section>
      ) : null}

      {categories.map((category) => (
        <section key={category.id} className="mt-12">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <h2 className="text-2xl font-bold tracking-tight">{category.name}</h2>
              <p className="mt-1 text-sm text-muted-foreground">{category.short}</p>
            </div>
            <a
              href={`/category/${category.slug}`}
              className="text-sm font-semibold text-primary hover:underline"
            >
              View category →
            </a>
          </div>
          <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {toolsByCategory(category.id).map((tool) => (
              <ToolCard key={tool.slug} tool={tool} showCategory={false} />
            ))}
          </div>
        </section>
      ))}

      <AdSlot position="footer" className="mt-14" />
    </div>
  );
}
