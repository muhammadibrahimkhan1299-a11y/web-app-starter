import { createFileRoute } from "@tanstack/react-router";

import { ContactEmail, LegalPage, LegalSection } from "@/components/LegalPage";
import { site } from "@/config/site";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [{ title: `About — ${site.name}` }, { name: "description", content: `Learn more about ${site.name}.` }],
  }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <LegalPage title={`About ${site.name}`} updated="August 13, 2026">
      <p>
        {site.name} is a free collection of online tools designed to make everyday tasks simple.
        No sign-ups, no downloads, no cost — just open a tool and get things done.
      </p>
      <LegalSection title="What we offer">
        <p>
          Calculators, unit converters, text tools, image and PDF utilities, a QR code generator,
          and a link shortener — all running directly in your browser so your files never leave
          your device unless you choose to share them.
        </p>
      </LegalSection>
      <LegalSection title="Contact">
        <p>
          Questions or feedback? Email us at <ContactEmail /> and we'll get back to you as soon as
          we can.
        </p>
      </LegalSection>
    </LegalPage>
  );
}