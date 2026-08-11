import { site } from "@/config/site";

/**
 * Privacy-conscious event tracking.
 * Events are queued on `window.dataLayer` so any analytics provider can be
 * attached later without touching feature code. Disable via `site.analytics.enabled`.
 * Never pass personal data, file contents or full URLs a user typed.
 */
export type ToolEvent =
  | "tool_opened"
  | "tool_completed"
  | "download_clicked"
  | "link_shortened"
  | "qr_generated"
  | "search_performed"
  | "signup_completed";

type Payload = Record<string, string | number | boolean | undefined>;

declare global {
  interface Window {
    dataLayer?: Payload[];
  }
}

export function track(event: ToolEvent, payload: Payload = {}) {
  if (!site.analytics.enabled || typeof window === "undefined") return;
  const entry = { event, ...payload };
  window.dataLayer = window.dataLayer ?? [];
  window.dataLayer.push(entry);
  if (site.analytics.debug) console.debug("[analytics]", entry);
}
