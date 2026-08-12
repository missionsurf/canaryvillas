import { Mail, Phone, MapPin } from "lucide-react";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "contact" });
  return {
    title: t("heading"),
    description: "Get in touch with Canary Villas for bookings, questions, or more information about our properties in Fuerteventura.",
  };
}

export default async function ContactPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "contact" });

  return (
    <div className="pt-20 min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-14">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-4">{t("heading")}</h1>
          <p className="text-gray-500 text-lg">{t("sub")}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-6 shadow-sm flex gap-4 items-start">
              <div className="bg-sky-100 p-3 rounded-xl shrink-0">
                <Mail className="w-6 h-6 text-sky-600" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 mb-1">{t("emailLabel")}</h3>
                <a href="mailto:info@canaryvillas.com" className="text-sky-600 hover:text-sky-700">info@canaryvillas.com</a>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm flex gap-4 items-start">
              <div className="bg-sky-100 p-3 rounded-xl shrink-0">
                <Phone className="w-6 h-6 text-sky-600" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 mb-1">{t("phone")} / WhatsApp</h3>
                <a href="tel:+447809870561" className="text-sky-600 hover:text-sky-700">+44 7809 870561</a>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm flex gap-4 items-start">
              <div className="bg-sky-100 p-3 rounded-xl shrink-0">
                <MapPin className="w-6 h-6 text-sky-600" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 mb-1">{t("address")}</h3>
                <p className="text-gray-700">Corralejo, Fuerteventura</p>
                <p className="text-gray-500 text-sm">Canary Islands, Spain</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-sm">
            <h2 className="text-xl font-bold text-gray-900 mb-6">{t("send")}</h2>
            <form action="mailto:info@canaryvillas.com" method="GET" className="space-y-4">
              <input type="text" name="name" placeholder={t("name")} className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-sky-400" />
              <input type="email" name="email" placeholder={t("email")} className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-sky-400" />
              <textarea name="body" placeholder={t("message")} rows={5} className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-sky-400 resize-none" />
              <button type="submit" className="w-full bg-sky-500 hover:bg-sky-600 text-white py-3 rounded-xl font-semibold transition-colors">
                {t("send")}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
