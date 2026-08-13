import type { ReactNode } from "react";

import { site } from "@/config/site";

export function LegalPage({
  title,
  updated,
  children,
}: {
  title: string;
  updated: string;
  children: ReactNode;
}) {
  return (
    <div className="container-page mx-auto max-w-3xl py-14">
      <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
      <p className="mt-2 text-sm text-muted-foreground">Last updated: {updated}</p>
      <div className="prose-sm mt-8 space-y-6 text-sm leading-relaxed text-foreground">
        {children}
      </div>
    </div>
  );
}

export function LegalSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section>
      <h2 className="text-lg font-semibold">{title}</h2>
      <div className="mt-2 space-y-2 text-muted-foreground">{children}</div>
    </section>
  );
}

export function ContactEmail() {
  return (
    <a href={`mailto:${site.email}`} className="text-primary underline">
      {site.email}
    </a>
  );
}