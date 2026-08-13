import { createFileRoute, notFound } from "@tanstack/react-router";

import { AdSlot } from "@/components/AdSlot";
import { ToolCard } from "@/components/ToolCard";
import { site } from "@/config/site";
import { toolsByCategory } from "@/data/tools";
import { categories } from "@/data/types";

function findCategory(slug: string) {
  return categories.find((c) => c.slug === slug);
}

export const Route = createFileRoute("/category/$slug")({
  loader: ({ params }) => {
    const category = findCategory(params.slug);
    if (!category) throw notFound();
    return { category };
  },
  head: ({ params, loaderData }) => {
    const category = loaderData?.category ?? findCategory(params.slug);
    if (!category) return {};
    const title = `${category.headline} | ${site.name}`;
    return {
      meta: [
        { title },
        { name: "description", content: category.description },
        { property: "og:title", content: title },
        { property: "og:description", content: category.description },
        { property: "og:type", content: "website" },
        { property: "og:url", content: `/category/${category.slug}` },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:title", content: title },
        { name: "twitter:description", content: category.description },
      ],
      links: [{ rel: "canonical", href: `/category/${category.slug}` }],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Home", item: "/" },
              { "@type": "ListItem", position: 2, name: "All tools", item: "/tools" },
              {
                "@type": "ListItem",
                position: 3,
                name: category.name,
                item: `/category/${category.slug}`,
              },
            ],
          }),
        },
      ],
    };
  },
  component: CategoryPage,
});

function CategoryPage() {
  const { category } = Route.useLoaderData();
  const categoryTools = toolsByCategory(category.id);

  return (
    <div className="container-page pb-12">
      <nav aria-label="Breadcrumb" className="pt-8 text-sm text-muted-foreground">
        <a href="/" className="hover:text-primary">
          Home
        </a>
        <span aria-hidden="true"> / </span>
        <a href="/tools" className="hover:text-primary">
          All tools
        </a>
        <span aria-hidden="true"> / </span>
        <span className="text-foreground">{category.name}</span>
      </nav>

      <header className="mt-4">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">{category.headline}</h1>
        <p className="mt-3 max-w-2xl text-muted-foreground">{category.description}</p>
      </header>

      <AdSlot position="header" className="mt-8" />

      <section className="mt-10">
        <h2 className="text-xl font-bold tracking-tight">
          {categoryTools.length} {category.name.toLowerCase()}
        </h2>
        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {categoryTools.map((tool) => (
            <ToolCard key={tool.slug} tool={tool} showCategory={false} />
          ))}
        </div>
      </section>

      <section className="mt-12">
        <h2 className="text-xl font-bold tracking-tight">Other categories</h2>
        <div className="mt-4 flex flex-wrap gap-2">
          {categories
            .filter((c) => c.id !== category.id)
            .map((c) => (
              <a
                key={c.id}
                href={`/category/${c.slug}`}
                className="rounded-full border border-border bg-card px-3 py-1.5 text-sm font-medium transition hover:border-primary/40 hover:text-primary"
              >
                {c.name}
              </a>
            ))}
        </div>
      </section>

      <AdSlot position="footer" className="mt-14" />
    </div>
  );
}
