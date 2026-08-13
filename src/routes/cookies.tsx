import { createFileRoute } from "@tanstack/react-router";

import { LegalPage, LegalSection } from "@/components/LegalPage";
import { site } from "@/config/site";

export const Route = createFileRoute("/cookies")({
  head: () => ({
    meta: [{ title: `Cookie Policy — ${site.name}` }, { name: "description", content: `Cookie policy for ${site.name}.` }],
  }),
  component: CookiesPage,
});

function CookiesPage() {
  return (
    <LegalPage title="Cookie Policy" updated="August 13, 2026">
      <p>This policy explains how {site.name} uses cookies and similar technologies.</p>
      <LegalSection title="What cookies are">
        <p>
          Cookies are small text files stored on your device by your browser. They help websites
          remember preferences and work correctly.
        </p>
      </LegalSection>
      <LegalSection title="How we use them">
        <p>
          We use only the cookies necessary for the site to function, such as remembering your
          theme or keeping a session consistent. We do not use advertising cookies or sell your
          data.
        </p>
      </LegalSection>
      <LegalSection title="Managing cookies">
        <p>
          You can block or delete cookies through your browser settings at any time. Doing so may
          affect some features of the site.
        </p>
      </LegalSection>
      <LegalSection title="Third parties">
        <p>
          Some third-party services (such as fonts and analytics providers) may set their own
          cookies. Please review their policies for details.
        </p>
      </LegalSection>
    </LegalPage>
  );
}