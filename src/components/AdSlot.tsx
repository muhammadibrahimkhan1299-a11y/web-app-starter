import { site } from "@/config/site";
import { cn } from "@/lib/utils";

export type AdPosition = "header" | "in-content" | "sidebar" | "between-sections" | "footer";

const sizing: Record<AdPosition, string> = {
  header: "min-h-[90px]",
  "in-content": "min-h-[120px]",
  sidebar: "min-h-[600px] w-full",
  "between-sections": "min-h-[120px]",
  footer: "min-h-[90px]",
};

/**
 * Reserved advertising space.
 * Renders nothing at all while `site.ads.enabled` is false, so the layout stays
 * clean and no placeholder or fake ad is ever shown to a visitor.
 * Never place an AdSlot over interactive tool controls.
 */
export function AdSlot({ position, className }: { position: AdPosition; className?: string }) {
  if (!site.ads.enabled || !site.ads.clientId) return null;

  return (
    <aside
      aria-label="Advertisement"
      data-ad-position={position}
      className={cn(
        "flex items-center justify-center overflow-hidden rounded-xl border border-border bg-surface",
        sizing[position],
        className,
      )}
    >
      {/* Ad network markup is injected here once a provider is configured. */}
    </aside>
  );
}
