import Link from "next/link";
import { CheckCircle2, Clock, Mail, Phone } from "lucide-react";

export default function EnquiryPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-16">
      <div className="max-w-lg w-full bg-white rounded-2xl shadow-lg p-10 text-center">
        <div className="flex justify-center mb-6">
          <div className="bg-amber-50 rounded-full p-4">
            <Clock className="w-10 h-10 text-amber-500" />
          </div>
        </div>
        <h1 className="text-2xl font-extrabold text-gray-900 mb-3">Enquiry Received!</h1>
        <p className="text-gray-500 mb-8 leading-relaxed">
          Thank you for your booking request. We'll check availability and get back to you within <strong>24 hours</strong> with a payment link to secure your stay.
        </p>

        <div className="bg-sky-50 rounded-xl p-5 mb-8 text-left space-y-3">
          <p className="font-semibold text-gray-800 text-sm">What happens next:</p>
          <div className="flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-sky-500 shrink-0 mt-0.5" />
            <p className="text-sm text-gray-600">We confirm your dates are available</p>
          </div>
          <div className="flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-sky-500 shrink-0 mt-0.5" />
            <p className="text-sm text-gray-600">You receive a secure payment link by email</p>
          </div>
          <div className="flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-sky-500 shrink-0 mt-0.5" />
            <p className="text-sm text-gray-600">Pay the 50% deposit to secure your booking</p>
          </div>
        </div>

        <p className="text-sm text-gray-500 mb-6">Questions in the meantime?</p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center mb-8">
          <a
            href="mailto:info@canaryvillas.com"
            className="flex items-center justify-center gap-2 border border-gray-200 text-gray-700 hover:bg-gray-50 px-5 py-2.5 rounded-xl text-sm font-semibold transition-colors"
          >
            <Mail className="w-4 h-4" /> Email us
          </a>
          <a
            href="tel:+447809870561"
            className="flex items-center justify-center gap-2 border border-gray-200 text-gray-700 hover:bg-gray-50 px-5 py-2.5 rounded-xl text-sm font-semibold transition-colors"
          >
            <Phone className="w-4 h-4" /> +44 7809 870561
          </a>
        </div>

        <Link href="/villas" className="text-sky-500 hover:text-sky-600 text-sm font-semibold">
          ← Back to villas
        </Link>
      </div>
    </div>
  );
}
