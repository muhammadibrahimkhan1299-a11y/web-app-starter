import { createFileRoute } from "@tanstack/react-router";

import { LegalPage, LegalSection } from "@/components/LegalPage";
import { site } from "@/config/site";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [{ title: `Terms of Service — ${site.name}` }, { name: "description", content: `Terms of service for ${site.name}.` }],
  }),
  component: TermsPage,
});

function TermsPage() {
  return (
    <LegalPage title="Terms of Service" updated="August 13, 2026">
      <p>
        By using {site.name}, you agree to these terms. They are short and written in plain
        language.
      </p>
      <LegalSection title="Free use">
        <p>
          All tools on this site are provided free of charge. You may use them for personal or
          commercial purposes unless a specific tool says otherwise.
        </p>
      </LegalSection>
      <LegalSection title="Acceptable use">
        <p>
          You agree not to misuse the tools, attempt to disrupt the service, or use it for
          unlawful purposes. Short links that point to illegal, abusive, or malicious content
          will be removed.
        </p>
      </LegalSection>
      <LegalSection title="No warranty">
        <p>
          Tools are provided "as is" without warranties of any kind. While we work hard to keep
          them accurate, results are for reference only — verify important calculations or
          conversions independently.
        </p>
      </LegalSection>
      <LegalSection title="Liability">
        <p>
          To the maximum extent permitted by law, {site.name} is not liable for any damages
          arising from the use of, or inability to use, this website.
        </p>
      </LegalSection>
      <LegalSection title="Changes">
        <p>
          We may update these terms from time to time. Continued use of the site after changes
          means you accept the updated terms.
        </p>
      </LegalSection>
    </LegalPage>
  );
}