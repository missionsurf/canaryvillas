import { getAllVillas } from "@/lib/villas";
import VillaCard from "@/components/VillaCard";
import type { Metadata } from "next";
import Link from "next/link";
import { Wind, Waves, MapPin, CheckCircle2 } from "lucide-react";

export const dynamic = "force-dynamic";

const t: Record<string, { title: string; desc: string; hero: string; sub: string; why: string; whySub: string; villas: string; villasSub: string; guide: string; faqTitle: string; viewAll: string; ask: string }> = {
  en: { title: "Kitesurfing Accommodation Corralejo, Fuerteventura", desc: "Holiday villas in Corralejo, Fuerteventura — perfectly located for kitesurfing at Flag Beach and El Cotillo. Direct booking, best price guaranteed. From €95/night.", hero: "Kitesurfing Accommodation in Corralejo, Fuerteventura", sub: "Stay minutes from Flag Beach — one of the world's best kitesurfing spots. Direct booking, best price guaranteed, no hidden fees.", why: "Why kitesurfers love staying in Corralejo", whySub: "Fuerteventura is one of the best kitesurfing destinations in the world. Our villas put you right in the heart of the action.", villas: "Our Corralejo villas", villasSub: "Both villas are a short drive from Flag Beach and the Corralejo Dunes wind corridor.", guide: "Flag Beach, Corralejo — a quick guide for kitesurfers", faqTitle: "Frequently asked questions", viewAll: "View all villas", ask: "Ask a question" },
  de: { title: "Kitesurfing Unterkunft Corralejo, Fuerteventura", desc: "Ferienvillen in Corralejo, Fuerteventura — ideal gelegen für Kitesurfen am Flag Beach. Direktbuchung, Bestpreisgarantie. Ab €95/Nacht.", hero: "Kitesurfing Unterkunft in Corralejo, Fuerteventura", sub: "Nur Minuten vom Flag Beach entfernt — einer der weltbesten Kitesurfspots. Direktbuchung, Bestpreisgarantie, keine versteckten Gebühren.", why: "Warum Kitesurfer Corralejo lieben", whySub: "Fuerteventura ist eines der besten Kitesurfreiseziele der Welt. Unsere Villen bringen Sie mitten ins Geschehen.", villas: "Unsere Villen in Corralejo", villasSub: "Beide Villen sind eine kurze Fahrt vom Flag Beach und dem Windkorridor der Dünen entfernt.", guide: "Flag Beach, Corralejo — ein kurzer Ratgeber für Kitesurfer", faqTitle: "Häufig gestellte Fragen", viewAll: "Alle Villen ansehen", ask: "Frage stellen" },
  es: { title: "Alojamiento para Kitesurf Corralejo, Fuerteventura", desc: "Villas vacacionales en Corralejo, Fuerteventura — perfectamente ubicadas para el kitesurf en Flag Beach. Reserva directa, mejor precio garantizado. Desde €95/noche.", hero: "Alojamiento para Kitesurf en Corralejo, Fuerteventura", sub: "A pocos minutos del Flag Beach — uno de los mejores spots de kitesurf del mundo. Reserva directa, mejor precio garantizado, sin cargos ocultos.", why: "Por qué los kitesurfistas adoran Corralejo", whySub: "Fuerteventura es uno de los mejores destinos de kitesurf del mundo. Nuestras villas te ponen en el centro de la acción.", villas: "Nuestras villas en Corralejo", villasSub: "Ambas villas están a poca distancia en coche del Flag Beach y el corredor de viento de las Dunas.", guide: "Flag Beach, Corralejo — guía rápida para kitesurfistas", faqTitle: "Preguntas frecuentes", viewAll: "Ver todas las villas", ask: "Hacer una pregunta" },
  fr: { title: "Hébergement Kitesurf Corralejo, Fuerteventura", desc: "Villas de vacances à Corralejo, Fuerteventura — idéalement situées pour le kitesurf à Flag Beach. Réservation directe, meilleur prix garanti. Dès €95/nuit.", hero: "Hébergement Kitesurf à Corralejo, Fuerteventura", sub: "À quelques minutes de Flag Beach — l'un des meilleurs spots de kitesurf au monde. Réservation directe, meilleur prix garanti, sans frais cachés.", why: "Pourquoi les kitesurfeurs adorent Corralejo", whySub: "Fuerteventura est l'une des meilleures destinations de kitesurf au monde. Nos villas vous placent au cœur de l'action.", villas: "Nos villas à Corralejo", villasSub: "Les deux villas sont à courte distance en voiture de Flag Beach et du couloir de vent des Dunes.", guide: "Flag Beach, Corralejo — guide rapide pour kitesurfeurs", faqTitle: "Questions fréquentes", viewAll: "Voir toutes les villas", ask: "Poser une question" },
  nl: { title: "Kitesurfen Accommodatie Corralejo, Fuerteventura", desc: "Vakantievilla's in Corralejo, Fuerteventura — perfect gelegen voor kitesurfen op Flag Beach. Direct boeken, beste prijs gegarandeerd. Vanaf €95/nacht.", hero: "Kitesurfen Accommodatie in Corralejo, Fuerteventura", sub: "Op enkele minuten van Flag Beach — een van de beste kitesurfspots ter wereld. Direct boeken, beste prijs gegarandeerd, geen verborgen kosten.", why: "Waarom kitesurfers dol zijn op Corralejo", whySub: "Fuerteventura is een van de beste kitesurfbestemmingen ter wereld. Onze villa's brengen je midden in het actiegebied.", villas: "Onze villa's in Corralejo", villasSub: "Beide villa's liggen op korte rijafstand van Flag Beach en de Duinen windcorridor.", guide: "Flag Beach, Corralejo — snelle gids voor kitesurfers", faqTitle: "Veelgestelde vragen", viewAll: "Alle villa's bekijken", ask: "Stel een vraag" },
  it: { title: "Alloggio Kitesurf Corralejo, Fuerteventura", desc: "Ville vacanza a Corralejo, Fuerteventura — posizione ideale per il kitesurf al Flag Beach. Prenotazione diretta, miglior prezzo garantito. Da €95/notte.", hero: "Alloggio per Kitesurf a Corralejo, Fuerteventura", sub: "A pochi minuti dal Flag Beach — uno dei migliori spot di kitesurf al mondo. Prenotazione diretta, miglior prezzo garantito, senza costi nascosti.", why: "Perché i kitesurfisti amano Corralejo", whySub: "Fuerteventura è una delle migliori destinazioni di kitesurf al mondo. Le nostre ville ti mettono al centro dell'azione.", villas: "Le nostre ville a Corralejo", villasSub: "Entrambe le ville si trovano a pochi minuti di auto dal Flag Beach e dal corridoio del vento delle Dune.", guide: "Flag Beach, Corralejo — guida rapida per kitesurfisti", faqTitle: "Domande frequenti", viewAll: "Vedi tutte le ville", ask: "Fai una domanda" },
};

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const tr = t[locale] ?? t.en;
  return {
    title: tr.title + " | Canary Villas",
    description: tr.desc,
    alternates: {
      canonical: "https://www.canaryvillas.com/villas/kitesurfing-accommodation-corralejo",
      languages: {
        en: "https://www.canaryvillas.com/villas/kitesurfing-accommodation-corralejo",
        de: "https://www.canaryvillas.com/de/villas/kitesurfing-accommodation-corralejo",
        es: "https://www.canaryvillas.com/es/villas/kitesurfing-accommodation-corralejo",
        fr: "https://www.canaryvillas.com/fr/villas/kitesurfing-accommodation-corralejo",
        nl: "https://www.canaryvillas.com/nl/villas/kitesurfing-accommodation-corralejo",
        it: "https://www.canaryvillas.com/it/villas/kitesurfing-accommodation-corralejo",
        "x-default": "https://www.canaryvillas.com/villas/kitesurfing-accommodation-corralejo",
      },
    },
    openGraph: {
      title: tr.title + " | Canary Villas",
      description: tr.desc,
      url: "https://www.canaryvillas.com/villas/kitesurfing-accommodation-corralejo",
      images: [{ url: "https://pnkxfbsjd3gpupqs.public.blob.vercel-storage.com/header-1.jpg", width: 1200, height: 630 }],
    },
  };
}

const pageSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "How far is Flag Beach from Canary Villas accommodation in Corralejo?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Flag Beach (Playa de la Bandera), Corralejo's world-famous kitesurfing spot, is approximately 2–3 km from our Corralejo villas — a 5 to 8-minute drive. Many guests cycle or take a taxi. Several kitesurfing schools, gear hire shops, and the annual Fuerteventura Kiteboarding World Cup are based here.",
      },
    },
    {
      "@type": "Question",
      name: "Can I store kitesurfing equipment at the villas?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes — our villas have outdoor storage and terrace space suitable for boards, kites, and wetsuits. Please contact us in advance if you are bringing a large amount of equipment and we will make suitable arrangements.",
      },
    },
    {
      "@type": "Question",
      name: "Which is the best beach for kitesurfing near Corralejo?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Flag Beach (Playa de la Bandera) is the most popular spot, hosting the annual PWA Kite World Cup. Grandes Playas (just past the Corralejo Dunes) also offers excellent conditions. El Cotillo, on the west coast, is a 20-minute drive and is excellent for both kitesurfing and windsurfing.",
      },
    },
    {
      "@type": "Question",
      name: "Are there kitesurfing schools near the villas?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes — several IKO-certified kitesurfing schools operate directly on Flag Beach, a short drive from our villas. We can recommend local schools and arrange lessons for guests on request.",
      },
    },
  ],
};

const highlights = [
  { icon: <Wind className="w-5 h-5" />, title: "Flag Beach access", desc: "2 km from the villas — Fuerteventura's premier kitesurfing spot, host of the annual PWA World Cup" },
  { icon: <Waves className="w-5 h-5" />, title: "Year-round wind", desc: "Fuerteventura's consistent trade winds make it a world-class destination for kitesurfing, windsurfing and wing foiling" },
  { icon: <MapPin className="w-5 h-5" />, title: "Corralejo base", desc: "Walk to restaurants, supermarkets and equipment hire — everything you need between sessions" },
  { icon: <CheckCircle2 className="w-5 h-5" />, title: "Equipment-friendly", desc: "Outdoor storage, terrace space, and easy hosing-down access for boards, kites and wetsuits" },
];

export default async function KitesurfingPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const tr = t[locale] ?? t.en;
  const villas = await getAllVillas();

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(pageSchema) }} />

      <div className="pt-20 min-h-screen bg-gray-50">
        {/* Hero */}
        <div className="bg-gradient-to-br from-sky-600 to-sky-800 text-white py-16 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Wind className="w-6 h-6 text-sky-200" />
              <span className="text-sky-200 text-sm font-medium uppercase tracking-wider">Kitesurfing · Windsurfing · Wing Foiling</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold mb-4">{tr.hero}</h1>
            <p className="text-sky-100 text-lg max-w-2xl mx-auto mb-8">{tr.sub}</p>
            <div className="flex flex-wrap gap-3 justify-center">
              <Link href={`/${locale}/villas`} className="bg-white text-sky-700 px-6 py-3 rounded-full font-bold text-sm hover:bg-sky-50 transition-colors">
                {tr.viewAll}
              </Link>
              <Link href={`/${locale}/contact`} className="border border-white/60 text-white px-6 py-3 rounded-full font-semibold text-sm hover:bg-white/10 transition-colors">
                {tr.ask}
              </Link>
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">

          {/* Why stay here */}
          <div className="mb-16">
            <h2 className="text-2xl font-extrabold text-gray-900 mb-2 text-center">{tr.why}</h2>
            <p className="text-gray-500 text-center mb-8 max-w-2xl mx-auto">{tr.whySub}</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {highlights.map((h, i) => (
                <div key={i} className="bg-white rounded-2xl border border-gray-200 p-5">
                  <div className="text-sky-500 mb-3">{h.icon}</div>
                  <p className="font-bold text-gray-900 text-sm mb-1">{h.title}</p>
                  <p className="text-gray-500 text-sm leading-relaxed">{h.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Villa cards */}
          <div className="mb-16">
            <h2 className="text-2xl font-extrabold text-gray-900 mb-2">{tr.villas}</h2>
            <p className="text-gray-500 mb-8">{tr.villasSub}</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {villas.map(v => <VillaCard key={v.id} villa={v} />)}
            </div>
          </div>

          {/* Flag Beach guide */}
          <div className="bg-white rounded-2xl border border-gray-200 p-8 mb-16">
            <h2 className="text-xl font-bold text-gray-900 mb-4">{tr.guide}</h2>
            <div className="prose prose-sm text-gray-600 max-w-none space-y-3">
              <p>
                <strong>Flag Beach (Playa de la Bandera)</strong> sits approximately 2 km south of Corralejo town centre, nestled between the Grandes Playas dunes and the Atlantic Ocean. It hosts the annual <strong>PWA Kite World Cup</strong> — one of the sport's most prestigious events — and is renowned for its consistent thermal winds, reliable side-shore conditions, and flat-water lagoon sections perfect for beginners and freestylers alike.
              </p>
              <p>
                The beach is lined with IKO-certified kitesurfing schools, gear rental shops, and beach bars. Wind conditions are strongest from May to September (the trade wind season), but Fuerteventura's location means you can kite comfortably year-round.
              </p>
              <p>
                <strong>Grandes Playas</strong>, stretching further south into the Corralejo Dunes Natural Park, offers wilder conditions for more experienced riders. <strong>El Cotillo</strong>, on the west coast (about 20 minutes' drive), is excellent for kitesurfing, windsurfing, and wing foiling with a different wind angle.
              </p>
            </div>
          </div>

          {/* FAQ */}
          <div>
            <h2 className="text-2xl font-extrabold text-gray-900 mb-6">{tr.faqTitle}</h2>
            <div className="space-y-3">
              {pageSchema.mainEntity.map((q, i) => (
                <details key={i} className="bg-white border border-gray-200 rounded-2xl overflow-hidden group">
                  <summary className="px-5 py-4 text-sm font-semibold text-gray-900 cursor-pointer hover:bg-gray-50 list-none flex items-center justify-between">
                    {q.name}
                    <span className="text-gray-400 ml-2 text-lg leading-none group-open:rotate-45 transition-transform inline-block">+</span>
                  </summary>
                  <p className="px-5 pb-4 text-sm text-gray-600 leading-relaxed">{q.acceptedAnswer.text}</p>
                </details>
              ))}
            </div>
          </div>

        </div>
      </div>
    </>
  );
}
