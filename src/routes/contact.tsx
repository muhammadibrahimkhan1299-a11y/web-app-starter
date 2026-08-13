import { createFileRoute } from "@tanstack/react-router";

import { ContactEmail, LegalPage, LegalSection } from "@/components/LegalPage";
import { site } from "@/config/site";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [{ title: `Contact — ${site.name}` }, { name: "description", content: `Get in touch with ${site.name}.` }],
  }),
  component: ContactPage,
});

function ContactPage() {
  return (
    <LegalPage title="Contact" updated="August 13, 2026">
      <p>
        Have a question, found a bug, or want to suggest a new tool? We'd love to hear from you.
      </p>
      <LegalSection title="Email">
        <p>
          Reach us any time at <ContactEmail />. We typically reply within 1–2 business days.
        </p>
      </LegalSection>
      <LegalSection title="Before you write">
        <p>
          For tool-related issues, include the tool you were using, what you expected to happen,
          and what actually happened. Screenshots help us fix things faster.
        </p>
      </LegalSection>
    </LegalPage>
  );
}