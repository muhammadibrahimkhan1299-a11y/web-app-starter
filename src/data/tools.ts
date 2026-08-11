import { calculatorTools } from "./tools.calculators";
import { converterTools } from "./tools.converters";
import { imageTools, linkTools, pdfTools } from "./tools.files";
import { textTools } from "./tools.text";
import type { CategoryId, Tool } from "./types";

export * from "./types";

export const tools: Tool[] = [
  ...calculatorTools,
  ...converterTools,
  ...textTools,
  ...imageTools,
  ...pdfTools,
  ...linkTools,
];

const bySlug = new Map(tools.map((t) => [t.slug, t]));

export function getTool(slug: string): Tool | undefined {
  return bySlug.get(slug);
}

export function toolsByCategory(category: CategoryId): Tool[] {
  return tools.filter((t) => t.category === category);
}

export function popularTools(): Tool[] {
  const order = [
    "percentage-calculator",
    "age-calculator",
    "discount-calculator",
    "gpa-calculator",
    "length-converter",
    "word-counter",
    "image-compressor",
    "compress-pdf",
    "qr-code-generator",
    "link-shortener",
  ];
  return order.map((slug) => bySlug.get(slug)).filter((t): t is Tool => Boolean(t));
}

export function recentTools(count = 6): Tool[] {
  return [...tools].sort((a, b) => b.addedAt.localeCompare(a.addedAt)).slice(0, count);
}

export function relatedTools(tool: Tool, count = 4): Tool[] {
  const related = tool.related.map((slug) => bySlug.get(slug)).filter((t): t is Tool => Boolean(t));
  if (related.length >= count) return related.slice(0, count);
  const fill = toolsByCategory(tool.category).filter(
    (t) => t.slug !== tool.slug && !related.includes(t),
  );
  return [...related, ...fill].slice(0, count);
}

/**
 * Fast, partial-match search across name, tagline, category and keywords.
 * Scored so exact prefix matches always float to the top.
 */
export function searchTools(query: string, limit = 12): Tool[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  const terms = q.split(/\s+/).filter(Boolean);

  const scored = tools
    .map((tool) => {
      const name = tool.name.toLowerCase();
      const haystack = `${name} ${tool.tagline} ${tool.slug} ${tool.category} ${tool.keywords.join(" ")}`.toLowerCase();
      let score = 0;
      for (const term of terms) {
        if (!haystack.includes(term)) return { tool, score: -1 };
        if (name.startsWith(term)) score += 60;
        else if (name.includes(term)) score += 40;
        if (tool.keywords.some((k) => k.toLowerCase().includes(term))) score += 18;
        if (tool.slug.includes(term)) score += 12;
        if (tool.tagline.toLowerCase().includes(term)) score += 6;
        score += 2;
      }
      if (tool.popular) score += 5;
      return { tool, score };
    })
    .filter((r) => r.score > 0)
    .sort((a, b) => b.score - a.score || a.tool.name.localeCompare(b.tool.name));

  return scored.slice(0, limit).map((r) => r.tool);
}
