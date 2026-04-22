import Link from "next/link";

import { Container } from "@/components/Container";

export const metadata = {
  title: "Privacy policy",
};

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-8">
      <h2 className="text-xl font-semibold text-fix-heading">{title}</h2>
      <div className="mt-3 space-y-3 text-sm leading-relaxed text-fix-text-muted">{children}</div>
    </section>
  );
}

export default function PrivacyPage() {
  return (
    <Container className="py-12 sm:py-16">
      <div className="max-w-4xl">
        <h1 className="text-3xl font-semibold tracking-tight text-fix-heading sm:text-4xl">
          Privacy Policy
        </h1>
        <p className="mt-3 text-sm text-fix-text-muted">Effective date: 4/22/2026</p>

        <Section title="1. Information We Collect">
          <p className="font-medium text-fix-heading">Personal Information</p>
          <ul className="list-disc space-y-1 pl-5">
            <li>Name</li>
            <li>Email address</li>
            <li>Shipping and billing address</li>
            <li>Payment details (processed securely via third parties)</li>
          </ul>
          <p className="font-medium text-fix-heading">Usage Data</p>
          <ul className="list-disc space-y-1 pl-5">
            <li>IP address</li>
            <li>Browser type</li>
            <li>Pages visited</li>
            <li>Time spent on site</li>
          </ul>
          <p className="font-medium text-fix-heading">Platform Data (RootSync)</p>
          <ul className="list-disc space-y-1 pl-5">
            <li>Vendor listings</li>
            <li>User-generated content</li>
            <li>Preferences and activity</li>
          </ul>
        </Section>

        <Section title="2. How We Use Your Information">
          <p>We use your data to:</p>
          <ul className="list-disc space-y-1 pl-5">
            <li>Process orders</li>
            <li>Operate and improve the platform</li>
            <li>Provide personalized recommendations</li>
            <li>Communicate updates and promotions</li>
            <li>Maintain security and prevent fraud</li>
          </ul>
        </Section>

        <Section title="3. Sharing Your Information">
          <p>We do not sell your personal data.</p>
          <p>We may share data with:</p>
          <ul className="list-disc space-y-1 pl-5">
            <li>Payment processors (e.g., Stripe, PayPal)</li>
            <li>Hosting and analytics providers</li>
            <li>Service providers that help operate the platform</li>
          </ul>
        </Section>

        <Section title="4. Cookies and Tracking">
          <p>We use cookies to:</p>
          <ul className="list-disc space-y-1 pl-5">
            <li>Improve user experience</li>
            <li>Track site performance</li>
            <li>Personalize content</li>
          </ul>
          <p>You can disable cookies in your browser settings.</p>
        </Section>

        <Section title="5. Data Security">
          <p>We implement reasonable safeguards to protect your data.</p>
          <p>However, no system is 100% secure. Use the platform at your own risk.</p>
        </Section>

        <Section title="6. Your Rights">
          <p>Depending on your location, you may have the right to:</p>
          <ul className="list-disc space-y-1 pl-5">
            <li>Access your data</li>
            <li>Correct inaccurate data</li>
            <li>Request deletion</li>
          </ul>
          <p>Contact us to make a request.</p>
        </Section>

        <Section title="7. Third-Party Links">
          <p>Our site may contain links to third-party websites.</p>
          <p>We are not responsible for their privacy practices.</p>
        </Section>

        <Section title="8. Children&apos;s Privacy">
          <p>Our services are not intended for children under 13.</p>
          <p>We do not knowingly collect data from children.</p>
        </Section>

        <Section title="9. Updates to This Policy">
          <p>We may update this Privacy Policy at any time.</p>
          <p>Updates will be posted on this page.</p>
        </Section>

        <Section title="10. Contact">
          <p>For privacy-related questions: rootsync@rootsync.io</p>
        </Section>

        <div className="mt-10 border-t border-fix-border/15 pt-6 text-sm text-fix-text-muted">
          Related pages:{" "}
          <Link href="/terms" className="text-fix-link hover:text-fix-link-hover">
            Terms and Conditions
          </Link>{" "}
          ·{" "}
          <Link href="/disclaimer" className="text-fix-link hover:text-fix-link-hover">
            Disclaimer
          </Link>{" "}
          ·{" "}
          <Link href="/ai-disclaimer" className="text-fix-link hover:text-fix-link-hover">
            AI Tool Disclaimer
          </Link>
        </div>
      </div>
    </Container>
  );
}

