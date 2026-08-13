import { createFileRoute } from "@tanstack/react-router";

import { LegalPage, LegalSection } from "@/components/LegalPage";
import { site } from "@/config/site";

export const Route = createFileRoute("/disclaimer")({
  head: () => ({
    meta: [{ title: `Disclaimer — ${site.name}` }, { name: "description", content: `Disclaimer for ${site.name}.` }],
  }),
  component: DisclaimerPage,
});

function DisclaimerPage() {
  return (
    <LegalPage title="Disclaimer" updated="August 13, 2026">
      <p>
        {site.name} provides tools for general information and convenience purposes.
      </p>
      <LegalSection title="No professional advice">
        <p>
          Results from calculators and converters are estimates for reference only and are not a
          substitute for professional financial, legal, medical, or engineering advice.
        </p>
      </LegalSection>
      <LegalSection title="Accuracy">
        <p>
          While we strive for accuracy, we make no guarantees that tool results are error-free.
          Always verify important results independently.
        </p>
      </LegalSection>
      <LegalSection title="External links">
        <p>
          Some pages may link to external websites. We are not responsible for the content or
          practices of those sites.
        </p>
      </LegalSection>
      <LegalSection title="Contact">
        <p>
          Questions about this disclaimer? Contact us at {site.email}.
        </p>
      </LegalSection>
    </LegalPage>
  );
}