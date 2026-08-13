import { createFileRoute, Link } from "@tanstack/react-router";

import { site } from "@/config/site";
import { tools } from "@/data/tools";
import { categories } from "@/data/types";

export const Route = createFileRoute("/sitemap")({
  head: () => ({
    meta: [
      { title: `Sitemap — ${site.name}` },
      { name: "description", content: `Every tool on ${site.name}, grouped by category.` },
    ],
  }),
  component: SitemapPage,
});

function SitemapPage() {
  return (
    <div className="container-page mx-auto max-w-3xl py-14">
      <h1 className="text-3xl font-bold tracking-tight">Sitemap</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Every tool on {site.name}, grouped by category. You can also view the machine-readable{" "}
        <a href="/sitemap.xml" className="text-primary underline">
          XML sitemap
        </a>
        .
      </p>

      <div className="mt-8 space-y-8">
        <section>
          <h2 className="text-lg font-semibold">
            <Link to="/tools" className="text-primary hover:underline">
              All tools
            </Link>
          </h2>
        </section>

        {categories.map((category) => {
          const categoryTools = tools.filter((t) => t.category === category.id);
          return (
            <section key={category.id}>
              <h2 className="text-lg font-semibold">
                <Link to="/category/$slug" params={{ slug: category.slug }} className="text-primary hover:underline">
                  {category.name}
                </Link>
              </h2>
              <ul className="mt-3 grid grid-cols-1 gap-x-6 gap-y-1.5 sm:grid-cols-2">
                {categoryTools.map((tool) => (
                  <li key={tool.slug}>
                    <Link
                      to="/$slug"
                      params={{ slug: tool.slug }}
                      className="text-sm text-muted-foreground hover:text-primary"
                    >
                      {tool.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          );
        })}
      </div>
    </div>
  );
}