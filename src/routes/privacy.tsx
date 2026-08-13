import { createFileRoute } from "@tanstack/react-router";

import { LegalPage, LegalSection } from "@/components/LegalPage";
import { site } from "@/config/site";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [{ title: `Privacy Policy — ${site.name}` }, { name: "description", content: `Privacy policy for ${site.name}.` }],
  }),
  component: PrivacyPage,
});

function PrivacyPage() {
  return (
    <LegalPage title="Privacy Policy" updated="August 13, 2026">
      <p>
        Your privacy matters. This policy explains what information {site.name} collects and how
        it is used.
      </p>
      <LegalSection title="Data we process">
        <p>
          Most tools run entirely in your browser — the files you upload or convert never leave
          your device. Where a feature needs a server (for example, shortened links and click
          counts), we store only the minimum data required to make it work.
        </p>
      </LegalSection>
      <LegalSection title="Short links">
        <p>
          When you create a short link, we store the destination URL and a usage count. Click
          analytics are aggregated and never tied to a personal identity.
        </p>
      </LegalSection>
      <LegalSection title="Analytics">
        <p>
          We use privacy-conscious, aggregate analytics to understand which tools are useful. No
          personal identifiers are collected.
        </p>
      </LegalSection>
      <LegalSection title="Cookies">
        <p>
          This site may use essential cookies to keep features working. We do not sell or share
          personal data with third parties for advertising. See our Cookie Policy for details.
        </p>
      </LegalSection>
      <LegalSection title="Contact">
        <p>
          Questions about this policy? Contact us at {site.email}.
        </p>
      </LegalSection>
    </LegalPage>
  );
}