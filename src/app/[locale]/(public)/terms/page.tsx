import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms & Conditions | Canary Villas",
  description: "Booking terms and conditions for Canary Villas holiday villa rentals in Fuerteventura.",
  alternates: { canonical: "https://canaryvillas.com/terms" },
  robots: { index: false },
};

export default function TermsPage() {
  return (
    <div className="pt-20 min-h-screen bg-white">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-2">Terms &amp; Conditions</h1>
        <p className="text-gray-400 text-sm mb-10">Last updated: 1 May 2025</p>

        <div className="prose prose-gray max-w-none">
          <h2>1. Definitions</h2>
          <p>&ldquo;We&rdquo;/&ldquo;us&rdquo;/&ldquo;the Owner&rdquo; means Canary Villas. &ldquo;You&rdquo;/&ldquo;the Guest&rdquo; means the person making the booking and all members of their party. &ldquo;Property&rdquo; means the holiday villa booked.</p>

          <h2>2. Booking &amp; payment</h2>
          <ul>
            <li>A booking is confirmed once a deposit (or full payment) has been received and you have received a written booking confirmation from us.</li>
            <li>A deposit of 30% of the total rental cost is due at booking. The remaining balance is due 60 days before arrival.</li>
            <li>Bookings made within 60 days of arrival require full payment at time of booking.</li>
            <li>All payments are in Euros (EUR) and processed securely via Stripe.</li>
          </ul>

          <h2>3. Cancellation &amp; refunds</h2>
          <ul>
            <li><strong>60+ days before arrival</strong> — full refund of all payments made</li>
            <li><strong>30–59 days before arrival</strong> — deposit is forfeited; balance refunded</li>
            <li><strong>Less than 30 days before arrival</strong> — no refund</li>
          </ul>
          <p>We strongly recommend you take out comprehensive travel insurance including cancellation cover.</p>

          <h2>4. Security deposit</h2>
          <p>A refundable security deposit may be required at check-in. This will be returned within 7 days of departure, subject to inspection of the property.</p>

          <h2>5. Occupancy &amp; use of property</h2>
          <ul>
            <li>The property may only be used by the number of guests stated in the booking. Exceeding this number is not permitted and may result in immediate termination of the stay without refund.</li>
            <li>The property is let for holiday purposes only. Subletting or commercial use is strictly prohibited.</li>
            <li>Smoking is not permitted inside the property.</li>
            <li>Pets are not permitted unless expressly agreed in writing.</li>
          </ul>

          <h2>6. Check-in &amp; check-out</h2>
          <ul>
            <li>Check-in: from 15:00</li>
            <li>Check-out: by 10:00</li>
            <li>Early check-in or late check-out may be available on request, subject to availability.</li>
          </ul>

          <h2>7. Guest responsibilities</h2>
          <p>You are responsible for leaving the property in a clean and tidy condition, reporting any damage promptly, and respecting the property and neighbours. The cost of any damage beyond normal wear and tear may be deducted from your security deposit.</p>

          <h2>8. Our responsibilities</h2>
          <p>We will ensure the property is available as booked and is clean and well-maintained. In the unlikely event of a property becoming unavailable (e.g. due to damage or unforeseen circumstances), we will make every effort to offer an equivalent alternative or provide a full refund.</p>

          <h2>9. Liability</h2>
          <p>We accept no liability for loss, damage, or injury sustained at the property except where caused by our negligence. You are advised to ensure your travel insurance covers personal liability.</p>

          <h2>10. Force majeure</h2>
          <p>We are not liable for cancellations or curtailments caused by events beyond our reasonable control (natural disasters, war, pandemic, government restrictions etc.). In such cases, we will endeavour to offer a rebooking or credit.</p>

          <h2>11. Governing law</h2>
          <p>These terms are governed by the laws of England and Wales. Any disputes will be subject to the exclusive jurisdiction of English courts.</p>

          <h2>12. Contact</h2>
          <p>
            Canary Villas<br />
            Corralejo, Fuerteventura, Spain<br />
            <a href="mailto:info@canaryvillas.com">info@canaryvillas.com</a><br />
            +44 7809 870561
          </p>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-100">
          <Link href="/" className="text-sky-500 hover:text-sky-600 text-sm font-medium">← Back to home</Link>
        </div>
      </div>
    </div>
  );
}
