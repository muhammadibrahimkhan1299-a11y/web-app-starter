import { Link } from "@tanstack/react-router";
import { Wrench } from "lucide-react";

import { site } from "@/config/site";
import { cn } from "@/lib/utils";

export function Logo({ className }: { className?: string }) {
  return (
    <Link
      to="/"
      className={cn("group inline-flex items-center gap-2 font-bold tracking-tight", className)}
      aria-label={`${site.name} home`}
    >
      <span className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
        <Wrench className="size-4" aria-hidden="true" />
      </span>
      <span className="text-lg">{site.name}</span>
    </Link>
  );
}
