import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy | Canary Villas",
  description: "Privacy Policy for Canary Villas — how we collect, use and protect your personal data.",
  alternates: { canonical: "https://canaryvillas.com/privacy" },
  robots: { index: false },
};

export default function PrivacyPage() {
  return (
    <div className="pt-20 min-h-screen bg-white">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-2">Privacy Policy</h1>
        <p className="text-gray-400 text-sm mb-10">Last updated: 1 May 2025</p>

        <div className="prose prose-gray max-w-none">
          <h2>1. Who we are</h2>
          <p>
            Canary Villas (&ldquo;we&rdquo;, &ldquo;us&rdquo;, &ldquo;our&rdquo;) is an independent holiday villa agency based in Corralejo, Fuerteventura, Spain. Our website is <strong>canaryvillas.com</strong>. You can contact us at <a href="mailto:info@canaryvillas.com">info@canaryvillas.com</a> or +44 7809 870561.
          </p>

          <h2>2. What data we collect</h2>
          <p>We collect personal data in the following situations:</p>
          <ul>
            <li><strong>Booking enquiries &amp; reservations</strong> — name, email address, phone number, travel dates, number of guests, and payment information (processed securely by Stripe; we never store card numbers).</li>
            <li><strong>Contact form submissions</strong> — name, email, and any message content you provide.</li>
            <li><strong>Cookies</strong> — see Section 5 below.</li>
          </ul>

          <h2>3. How we use your data</h2>
          <ul>
            <li>To process and manage your booking</li>
            <li>To send booking confirmation, arrival instructions, and invoice emails</li>
            <li>To respond to enquiries and provide pre- and post-stay support</li>
            <li>To send marketing emails (only if you have opted in — you can unsubscribe at any time)</li>
          </ul>

          <h2>4. Legal basis (GDPR)</h2>
          <p>We process your data under the following lawful bases:</p>
          <ul>
            <li><strong>Contract</strong> — processing necessary to fulfil a booking you have made</li>
            <li><strong>Legitimate interests</strong> — responding to enquiries and providing customer support</li>
            <li><strong>Consent</strong> — marketing emails and optional cookies</li>
          </ul>

          <h2>5. Cookies</h2>
          <p>We use the following cookies:</p>
          <table>
            <thead>
              <tr><th>Cookie</th><th>Type</th><th>Purpose</th></tr>
            </thead>
            <tbody>
              <tr><td><code>cv_cookie_consent</code></td><td>Strictly necessary</td><td>Stores your cookie preference (localStorage, not transmitted to our servers)</td></tr>
              <tr><td>Stripe cookies</td><td>Strictly necessary</td><td>Required to process secure card payments. Set by Stripe.com.</td></tr>
              <tr><td>Google Maps cookies</td><td>Optional</td><td>Set when you enable the interactive map on villa pages. Subject to Google&apos;s Privacy Policy.</td></tr>
            </tbody>
          </table>
          <p>
            You can accept or decline optional cookies using the banner shown on your first visit. You can change your preference at any time by clearing your browser&apos;s local storage.
          </p>

          <h2>6. Third-party processors</h2>
          <ul>
            <li><strong>Stripe</strong> — payment processing (<a href="https://stripe.com/gb/privacy" target="_blank" rel="noopener noreferrer">Stripe Privacy Policy</a>)</li>
            <li><strong>Google Maps</strong> — interactive maps on villa pages, only loaded with your consent (<a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer">Google Privacy Policy</a>)</li>
            <li><strong>Vercel</strong> — website hosting. Server logs may include IP addresses for security purposes.</li>
            <li><strong>Resend / SMTP provider</strong> — transactional email delivery</li>
          </ul>
          <p>We do not sell your data to any third party.</p>

          <h2>7. Data retention</h2>
          <p>We retain booking records for 7 years to comply with tax and accounting obligations. Contact enquiries that do not result in a booking are deleted after 2 years. Marketing opt-in records are kept until you unsubscribe.</p>

          <h2>8. Your rights</h2>
          <p>Under UK GDPR and EU GDPR you have the right to:</p>
          <ul>
            <li>Access the personal data we hold about you</li>
            <li>Correct inaccurate data</li>
            <li>Request deletion (&ldquo;right to be forgotten&rdquo;)</li>
            <li>Restrict or object to processing</li>
            <li>Data portability</li>
            <li>Withdraw consent at any time (without affecting prior processing)</li>
          </ul>
          <p>To exercise any of these rights, email <a href="mailto:info@canaryvillas.com">info@canaryvillas.com</a>. We will respond within 30 days.</p>

          <h2>9. Security</h2>
          <p>All data is transmitted over HTTPS. Card payments are handled entirely by Stripe using PCI-DSS compliant infrastructure — we never see or store your full card number.</p>

          <h2>10. Changes to this policy</h2>
          <p>We may update this policy from time to time. The &ldquo;last updated&rdquo; date at the top will reflect any changes. Continued use of the site after a change constitutes acceptance of the updated policy.</p>

          <h2>11. Contact &amp; complaints</h2>
          <p>
            For privacy queries: <a href="mailto:info@canaryvillas.com">info@canaryvillas.com</a><br />
            If you are unsatisfied with our response, you have the right to lodge a complaint with the Information Commissioner&apos;s Office (UK): <a href="https://ico.org.uk" target="_blank" rel="noopener noreferrer">ico.org.uk</a>, or the Spanish data protection authority (AEPD): <a href="https://www.aepd.es" target="_blank" rel="noopener noreferrer">aepd.es</a>.
          </p>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-100">
          <Link href="/" className="text-sky-500 hover:text-sky-600 text-sm font-medium">← Back to home</Link>
        </div>
      </div>
    </div>
  );
}
