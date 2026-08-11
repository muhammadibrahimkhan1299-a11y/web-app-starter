export type CategoryId = "calculators" | "converters" | "text" | "image" | "pdf" | "links";

export interface Faq {
  q: string;
  a: string;
}

export interface CalcField {
  name: string;
  label: string;
  type?: "number" | "date" | "text" | "select" | "time";
  placeholder?: string;
  suffix?: string;
  hint?: string;
  options?: { value: string; label: string }[];
  defaultValue?: string;
}

export type CalcResult = { label: string; value: string; notes?: string[] } | { error: string };

export interface UnitDef {
  id: string;
  label: string;
  /** Multiplier relative to the category base unit. */
  factor: number;
}

export type Engine =
  | { kind: "calc"; fields: CalcField[]; compute: (v: Record<string, string>) => CalcResult }
  | { kind: "grades"; variant: "gpa" | "cgpa" | "grade" }
  | { kind: "convert"; units: UnitDef[]; special?: "temperature"; defaultFrom: string; defaultTo: string }
  | {
      kind: "text";
      mode:
        | "stats"
        | "upper"
        | "lower"
        | "title"
        | "case"
        | "dedupe"
        | "trim"
        | "reverse";
    }
  | { kind: "image"; mode: "compress" | "resize" | "convert" | "crop"; to?: "png" | "jpeg" | "webp"; from?: string }
  | { kind: "pdf"; mode: "compress" | "merge" | "split" | "extract" | "jpg-to-pdf" | "pdf-to-jpg" }
  | { kind: "qr" }
  | { kind: "shortener" };

export interface Tool {
  slug: string;
  name: string;
  category: CategoryId;
  /** One-line card description. */
  tagline: string;
  /** Meta description (<160 chars). */
  description: string;
  keywords: string[];
  popular?: boolean;
  addedAt: string;
  about: string;
  formula?: string;
  howTo: string[];
  example?: string;
  faqs: Faq[];
  related: string[];
  disclaimer?: string;
  engine: Engine;
}

export interface Category {
  id: CategoryId;
  name: string;
  slug: string;
  short: string;
  description: string;
  headline: string;
}

export const categories: Category[] = [
  {
    id: "calculators",
    name: "Calculators",
    slug: "calculators",
    short: "Everyday maths, done instantly",
    headline: "Free Online Calculators",
    description:
      "Percentages, discounts, loans, salary, grades, BMI, dates and more — every calculator shows the formula and a worked example.",
  },
  {
    id: "converters",
    name: "Converters",
    slug: "converters",
    short: "Convert any unit in one step",
    headline: "Unit & Measurement Converters",
    description:
      "Convert length, weight, temperature, area, volume, speed, time, data storage, energy and pressure units instantly.",
  },
  {
    id: "text",
    name: "Text Tools",
    slug: "text-tools",
    short: "Count, clean and reformat text",
    headline: "Online Text & Writing Tools",
    description:
      "Count words and characters, change letter case, remove duplicate lines or extra spaces and reverse text — all in your browser.",
  },
  {
    id: "image",
    name: "Image Tools",
    slug: "image-tools",
    short: "Compress, resize and convert images",
    headline: "Free Image Tools",
    description:
      "Compress, resize, crop and convert JPG, PNG and WebP images privately in your browser. Nothing is uploaded to a server.",
  },
  {
    id: "pdf",
    name: "PDF Tools",
    slug: "pdf-tools",
    short: "Merge, split and compress PDFs",
    headline: "Free PDF Tools",
    description:
      "Merge, split, compress and extract PDF pages, and convert between PDF and JPG — processed locally on your device.",
  },
  {
    id: "links",
    name: "Link Tools",
    slug: "link-tools",
    short: "Short links and QR codes",
    headline: "Link Shortener & QR Codes",
    description:
      "Create short, shareable links with optional custom slugs and click analytics, plus download QR codes as PNG or SVG.",
  },
];

export function getCategory(id: CategoryId): Category {
  return categories.find((c) => c.id === id)!;
}
