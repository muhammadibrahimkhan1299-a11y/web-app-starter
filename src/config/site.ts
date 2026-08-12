/**
 * Central brand configuration.
 * Change the brand name, tagline, domain or limits here — nothing else needs edits.
 */
export const site = {
  name: "UtilityTools",
  tagline: "Simple tools for everyday tasks.",
  /** Bare domain used for display purposes (e.g. short links preview). */
  domain: "dailytools.com",
  description:
    "Free online calculators, unit converters, text tools, image and PDF utilities, a QR code generator and a link shortener. No sign-up needed.",
  email: "hello@dailytools.com",
  social: {
    twitter: "@dailytools",
  },
  /** Upload limits, surfaced in the UI so users always know the rules. */
  limits: {
    imageBytes: 15 * 1024 * 1024,
    pdfBytes: 25 * 1024 * 1024,
    maxFiles: 20,
  },
  /** Ads are opt-in. When false, AdSlot renders nothing and layout stays clean. */
  ads: {
    enabled: false,
    /** e.g. "ca-pub-0000000000000000" once an ad network is connected. */
    clientId: "",
  },
  /** Product analytics are opt-in and privacy conscious. */
  analytics: {
    enabled: true,
    debug: false,
  },
  /** Reserved for future premium plans; the free tools never depend on this. */
  premium: {
    enabled: false,
    features: [
      "Batch file processing",
      "Higher file size limits",
      "Advanced link analytics",
      "Custom branded short links",
      "Ad-free experience",
      "Saved tool history",
      "API access",
    ],
  },
} as const;

export function formatBytes(bytes: number, decimals = 1): string {
  if (!Number.isFinite(bytes) || bytes <= 0) return "0 KB";
  const units = ["B", "KB", "MB", "GB"];
  const i = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
  return `${(bytes / Math.pow(1024, i)).toFixed(i === 0 ? 0 : decimals)} ${units[i]}`;
}
