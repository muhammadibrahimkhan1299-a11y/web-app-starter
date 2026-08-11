import { createFileRoute, notFound } from "@tanstack/react-router";
import { useEffect, useState } from "react";

import { AdSlot } from "@/components/AdSlot";
import { ToolCard } from "@/components/ToolCard";
import { ToolRenderer } from "@/components/tools/ToolRenderer";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { site } from "@/config/site";
import { getTool, relatedTools } from "@/data/tools";
import { getCategory } from "@/data/types";
import { supabase } from "@/integrations/supabase/client";
import { track } from "@/lib/analytics";

export const Route = createFileRoute("/$slug")({
  head: ({ params }) => {
    const tool = getTool(params.slug);
    if (!tool) {
      return { meta: [{ title: `Not found — ${site.name}` }, { name: "robots", content: "noindex" }] };
    }
    const title = `${tool.name} — Free Online Tool | ${site.name}`;
    return {
      meta: [
        { title },
        { name: "description", content: tool.description },
        { name: "keywords", content: tool.keywords.join(", ") },
        { property: "og:title", content: `${tool.name} — ${site.name}` },
        { property: "og:description", content: tool.description },
        { property: "og:type", content: "website" },
        { property: "og:url", content: `/${tool.slug}` },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:title", content: `${tool.name} — ${site.name}` },
        { name: "twitter:description", content: tool.description },
      ],
      links: [{ rel: "canonical", href: `/${tool.slug}` }],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@graph": [
              {
                "@type": "SoftwareApplication",
                name: tool.name,
                applicationCategory: "UtilitiesApplication",
                operatingSystem: "Any",
                description: tool.description,
                offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
              },
              {
                "@type": "FAQPage",
                mainEntity: tool.faqs.map((f) => ({
                  "@type": "Question",
                  name: f.q,
                  acceptedAnswer: { "@type": "Answer", text: f.a },
                })),
              },
            ],
          }),
        },
      ],
    };
  },
  component: SlugPage,
});

/** Unknown slugs are treated as short links and resolved client-side. */
function ShortLinkResolver({ code }: { code: string }) {
  const [state, setState] = useState<"loading" | "missing">("loading");

  useEffect(() => {
    let cancelled = false;
    const device = /Mobi|Android/i.test(navigator.userAgent)
      ? "mobile"
      : /Tablet|iPad/i.test(navigator.userAgent)
        ? "tablet"
        : "desktop";

    supabase
      .rpc("resolve_short_link", {
        p_code: code,
        p_device: device,
        p_referrer: document.referrer ? new URL(document.referrer).hostname : "",
      })
      .then(({ data }) => {
        if (cancelled) return;
        const target = data as unknown as string | null;
        if (target && /^https?:\/\//i.test(target)) {
          window.location.replace(target);
        } else {
          setState("missing");
        }
      })
      .catch(() => setState("missing"));

    return () => {
      cancelled = true;
    };
  }, [code]);

  return (
    <div className="container-page flex min-h-[60vh] flex-col items-center justify-center text-center">
      {state === "loading" ? (
        <p className="text-sm text-muted-foreground">Taking you to your link…</p>
      ) : (
        <>
          <h1 className="text-3xl font-bold">This link doesn't exist</h1>
          <p className="mt-3 max-w-md text-sm text-muted-foreground">
            The short link <code className="rounded bg-muted px-1.5 py-0.5">/{code}</code> was not
            found, or it has been removed. Check the address and try again.
          </p>
          <a
            href="/link-shortener"
            className="mt-6 inline-flex h-11 items-center rounded-md bg-primary px-5 text-sm font-semibold text-primary-foreground"
          >
            Create a short link
          </a>
        </>
      )}
    </div>
  );
}

function SlugPage() {
  const { slug } = Route.useParams();
  const tool = getTool(slug);

  useEffect(() => {
    if (tool) track("tool_opened", { tool: tool.slug, category: tool.category });
  }, [tool]);

  if (!tool) return <ShortLinkResolver code={slug} />;

  const category = getCategory(tool.category);
  const related = relatedTools(tool);

  return (
    <div className="container-page py-8">
      <nav aria-label="Breadcrumb" className="mb-5 text-sm text-muted-foreground">
        <a href="/" className="hover:text-primary">
          Home
        </a>
        <span className="mx-2">/</span>
        <a href={`/category/${category.slug}`} className="hover:text-primary">
          {category.name}
        </a>
        <span className="mx-2">/</span>
        <span className="text-foreground">{tool.name}</span>
      </nav>

      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_300px]">
        <div className="min-w-0">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">{tool.name}</h1>
          <p className="mt-3 max-w-2xl text-base text-muted-foreground">{tool.tagline}</p>

          <section
            aria-label={`${tool.name} tool`}
            className="mt-6 rounded-3xl border border-border bg-card p-5 shadow-card sm:p-7"
          >
            <ToolRenderer tool={tool} />
          </section>

          {tool.disclaimer ? (
            <p className="mt-4 rounded-xl border border-warning/40 bg-warning/10 px-4 py-3 text-sm text-foreground">
              <strong className="font-semibold">Please note: </strong>
              {tool.disclaimer}
            </p>
          ) : null}

          <AdSlot position="in-content" className="mt-8" />

          <article className="prose-tool mt-10 max-w-3xl">
            <h2>About the {tool.name}</h2>
            <p>{tool.about}</p>

            <h2>How to use the {tool.name}</h2>
            <ol>
              {tool.howTo.map((step) => (
                <li key={step}>{step}</li>
              ))}
            </ol>

            {tool.formula ? (
              <>
                <h3>Formula</h3>
                <p>
                  <code>{tool.formula}</code>
                </p>
              </>
            ) : null}

            {tool.example ? (
              <>
                <h2>Example</h2>
                <p>{tool.example}</p>
              </>
            ) : null}

            <h2>Frequently asked questions</h2>
          </article>

          <Accordion type="single" collapsible className="mt-2 max-w-3xl">
            {tool.faqs.map((faq) => (
              <AccordionItem key={faq.q} value={faq.q}>
                <AccordionTrigger className="text-left text-base font-semibold">
                  {faq.q}
                </AccordionTrigger>
                <AccordionContent className="text-sm leading-relaxed text-muted-foreground">
                  {faq.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>

          <section className="mt-12">
            <h2 className="text-xl font-bold">Related tools</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {related.map((t) => (
                <ToolCard key={t.slug} tool={t} showCategory={false} />
              ))}
            </div>
          </section>
        </div>

        <aside className="hidden lg:block">
          <AdSlot position="sidebar" />
        </aside>
      </div>
    </div>
  );
}

export { notFound };
