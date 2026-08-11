import { Link } from "@tanstack/react-router";
import { Menu } from "lucide-react";
import { useState } from "react";

import { Logo } from "@/components/Logo";
import { ToolSearch } from "@/components/ToolSearch";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { site } from "@/config/site";
import { categories } from "@/data/types";
import { useAuth } from "@/hooks/useAuth";

const navLinks = [
  { label: "All tools", to: "/tools" as const },
  ...categories.map((c) => ({ label: c.name, to: `/category/${c.slug}` })),
];

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const { user } = useAuth();

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur">
      <div className="container-page flex h-16 items-center gap-4">
        <Logo />

        <nav aria-label="Main" className="hidden flex-1 items-center gap-1 lg:flex">
          {navLinks.map((link) => (
            <a
              key={link.to}
              href={link.to}
              className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition hover:bg-muted hover:text-foreground"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="ml-auto hidden w-72 xl:block">
          <ToolSearch placeholder="Search tools…" />
        </div>

        <div className="ml-auto flex items-center gap-2 lg:ml-2">
          <Button asChild variant="outline" size="sm" className="hidden sm:inline-flex">
            <Link to={user ? "/dashboard" : "/auth"}>{user ? "Dashboard" : "Login"}</Link>
          </Button>

          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="lg:hidden" aria-label="Open menu">
                <Menu className="size-5" aria-hidden="true" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[85vw] max-w-sm">
              <SheetTitle className="px-1 text-left">{site.name}</SheetTitle>
              <div className="mt-4 space-y-4 px-1">
                <ToolSearch placeholder="Search tools…" onNavigate={() => setOpen(false)} />
                <nav aria-label="Mobile" className="flex flex-col">
                  {navLinks.map((link) => (
                    <a
                      key={link.to}
                      href={link.to}
                      onClick={() => setOpen(false)}
                      className="rounded-lg px-3 py-3 text-base font-medium text-foreground transition hover:bg-muted"
                    >
                      {link.label}
                    </a>
                  ))}
                  <a
                    href={user ? "/dashboard" : "/auth"}
                    onClick={() => setOpen(false)}
                    className="rounded-lg px-3 py-3 text-base font-medium text-primary"
                  >
                    {user ? "Dashboard" : "Login or sign up"}
                  </a>
                </nav>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}

export function SiteFooter() {
  const legal = [
    ["About", "/about"],
    ["Contact", "/contact"],
    ["Privacy Policy", "/privacy"],
    ["Terms of Service", "/terms"],
    ["Cookie Policy", "/cookies"],
    ["Disclaimer", "/disclaimer"],
    ["Sitemap", "/sitemap"],
  ] as const;

  return (
    <footer className="mt-20 border-t border-border bg-surface">
      <div className="container-page grid gap-10 py-12 md:grid-cols-4">
        <div>
          <Logo />
          <p className="mt-3 max-w-xs text-sm text-muted-foreground">{site.tagline}</p>
        </div>

        <div className="md:col-span-2 grid grid-cols-2 gap-6 sm:grid-cols-3">
          {categories.map((c) => (
            <div key={c.id}>
              <h2 className="text-sm font-semibold text-foreground">{c.name}</h2>
              <a
                href={`/category/${c.slug}`}
                className="mt-2 block text-sm text-muted-foreground transition hover:text-primary"
              >
                Browse {c.name.toLowerCase()}
              </a>
            </div>
          ))}
        </div>

        <div>
          <h2 className="text-sm font-semibold text-foreground">Company</h2>
          <ul className="mt-2 space-y-1.5">
            {legal.map(([label, href]) => (
              <li key={href}>
                <a href={href} className="text-sm text-muted-foreground transition hover:text-primary">
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="container-page border-t border-border py-6 text-xs text-muted-foreground">
        © {new Date().getFullYear()} {site.name}. All tools are free to use — no account required.
      </div>
    </footer>
  );
}
