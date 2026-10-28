import { getAllVillas } from "@/lib/villas";
import VillaCard from "@/components/VillaCard";
import type { Metadata } from "next";
import Link from "next/link";
import { Waves, Sun, Star, CheckCircle2 } from "lucide-react";

export const dynamic = "force-dynamic";

const t: Record<string, { title: string; desc: string; hero: string; sub: string; why: string; whySub: string; villas: string; villasSub: string; faqTitle: string; viewAll: string; ask: string }> = {
  en: { title: "Corralejo Villas with Private Pool & Jacuzzi, Fuerteventura", desc: "Holiday villas in Corralejo, Fuerteventura with private pool or jacuzzi. Direct beachfront access. Book direct — best price guaranteed. From €95/night.", hero: "Corralejo Villas with Private Pool & Jacuzzi", sub: "Luxury holiday villas in Corralejo, Fuerteventura with private outdoor space. Soak in the Atlantic sun on your own terrace or step straight onto the beach. Book direct for the best price.", why: "Why choose a private villa in Corralejo?", whySub: "More space, more privacy, better value than a hotel — with your own outdoor space in the sun.", villas: "Our Corralejo villas", villasSub: "Both villas include private outdoor spaces and are available to book direct.", faqTitle: "Frequently asked questions", viewAll: "View all villas", ask: "Ask a question" },
  de: { title: "Corralejo Villen mit privatem Pool & Jacuzzi, Fuerteventura", desc: "Ferienvillen in Corralejo, Fuerteventura mit privatem Pool oder Jacuzzi. Direktem Strandzugang. Direktbuchung — Bestpreisgarantie. Ab €95/Nacht.", hero: "Corralejo Villen mit privatem Pool & Jacuzzi", sub: "Luxus-Ferienvillen in Corralejo, Fuerteventura mit privatem Außenbereich. Genießen Sie die Atlantiksonne auf Ihrer eigenen Terrasse. Direkt buchen zum besten Preis.", why: "Warum eine private Villa in Corralejo wählen?", whySub: "Mehr Platz, mehr Privatsphäre, besseres Preis-Leistungs-Verhältnis als ein Hotel — mit eigenem Außenbereich in der Sonne.", villas: "Unsere Villen in Corralejo", villasSub: "Beide Villen verfügen über private Außenbereiche und sind direkt buchbar.", faqTitle: "Häufig gestellte Fragen", viewAll: "Alle Villen ansehen", ask: "Frage stellen" },
  es: { title: "Villas en Corralejo con Piscina Privada y Jacuzzi, Fuerteventura", desc: "Villas vacacionales en Corralejo, Fuerteventura con piscina privada o jacuzzi. Acceso directo a la playa. Reserva directa — mejor precio garantizado. Desde €95/noche.", hero: "Villas en Corralejo con Piscina Privada y Jacuzzi", sub: "Villas de lujo en Corralejo, Fuerteventura con espacio exterior privado. Disfruta del sol atlántico en tu propia terraza o accede directamente a la playa. Reserva directa al mejor precio.", why: "¿Por qué elegir una villa privada en Corralejo?", whySub: "Más espacio, más privacidad, mejor relación calidad-precio que un hotel — con tu propio espacio exterior al sol.", villas: "Nuestras villas en Corralejo", villasSub: "Ambas villas incluyen espacios exteriores privados y están disponibles para reserva directa.", faqTitle: "Preguntas frecuentes", viewAll: "Ver todas las villas", ask: "Hacer una pregunta" },
  fr: { title: "Villas à Corralejo avec Piscine Privée & Jacuzzi, Fuerteventura", desc: "Villas de vacances à Corralejo, Fuerteventura avec piscine privée ou jacuzzi. Accès direct à la plage. Réservation directe — meilleur prix garanti. Dès €95/nuit.", hero: "Villas à Corralejo avec Piscine Privée & Jacuzzi", sub: "Villas de luxe à Corralejo, Fuerteventura avec espace extérieur privé. Profitez du soleil atlantique sur votre propre terrasse ou accédez directement à la plage. Réservation directe au meilleur prix.", why: "Pourquoi choisir une villa privée à Corralejo ?", whySub: "Plus d'espace, plus d'intimité, meilleur rapport qualité-prix qu'un hôtel — avec votre propre espace extérieur au soleil.", villas: "Nos villas à Corralejo", villasSub: "Les deux villas disposent d'espaces extérieurs privés et sont disponibles en réservation directe.", faqTitle: "Questions fréquentes", viewAll: "Voir toutes les villas", ask: "Poser une question" },
  nl: { title: "Corralejo Villa's met Privézwembad & Jacuzzi, Fuerteventura", desc: "Vakantievilla's in Corralejo, Fuerteventura met privézwembad of jacuzzi. Direct strandtoegang. Direct boeken — beste prijs gegarandeerd. Vanaf €95/nacht.", hero: "Corralejo Villa's met Privézwembad & Jacuzzi", sub: "Luxe vakantievilla's in Corralejo, Fuerteventura met privé buitenruimte. Geniet van de Atlantische zon op je eigen terras of stap direct het strand op. Direct boeken voor de beste prijs.", why: "Waarom kiezen voor een privévilla in Corralejo?", whySub: "Meer ruimte, meer privacy, betere prijs-kwaliteitsverhouding dan een hotel — met je eigen buitenruimte in de zon.", villas: "Onze villa's in Corralejo", villasSub: "Beide villa's hebben privé buitenruimtes en zijn direct te boeken.", faqTitle: "Veelgestelde vragen", viewAll: "Alle villa's bekijken", ask: "Stel een vraag" },
  it: { title: "Ville a Corralejo con Piscina Privata & Jacuzzi, Fuerteventura", desc: "Ville vacanza a Corralejo, Fuerteventura con piscina privata o jacuzzi. Accesso diretto alla spiaggia. Prenotazione diretta — miglior prezzo garantito. Da €95/notte.", hero: "Ville a Corralejo con Piscina Privata & Jacuzzi", sub: "Ville di lusso a Corralejo, Fuerteventura con spazio esterno privato. Goditi il sole atlantico sulla tua terrazza o raggiungi direttamente la spiaggia. Prenotazione diretta al miglior prezzo.", why: "Perché scegliere una villa privata a Corralejo?", whySub: "Più spazio, più privacy, miglior rapporto qualità-prezzo di un hotel — con il tuo spazio esterno privato al sole.", villas: "Le nostre ville a Corralejo", villasSub: "Entrambe le ville includono spazi esterni privati e sono disponibili per la prenotazione diretta.", faqTitle: "Domande frequenti", viewAll: "Vedi tutte le ville", ask: "Fai una domanda" },
};

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const tr = t[locale] ?? t.en;
  return {
    title: tr.title + " | Canary Villas",
    description: tr.desc,
    alternates: {
      canonical: "https://www.canaryvillas.com/villas/corralejo-villas-with-private-pool",
      languages: {
        en: "https://www.canaryvillas.com/villas/corralejo-villas-with-private-pool",
        de: "https://www.canaryvillas.com/de/villas/corralejo-villas-with-private-pool",
        es: "https://www.canaryvillas.com/es/villas/corralejo-villas-with-private-pool",
        fr: "https://www.canaryvillas.com/fr/villas/corralejo-villas-with-private-pool",
        nl: "https://www.canaryvillas.com/nl/villas/corralejo-villas-with-private-pool",
        it: "https://www.canaryvillas.com/it/villas/corralejo-villas-with-private-pool",
        "x-default": "https://www.canaryvillas.com/villas/corralejo-villas-with-private-pool",
      },
    },
    openGraph: {
      title: tr.title + " | Canary Villas",
      description: tr.desc,
      url: "https://www.canaryvillas.com/villas/corralejo-villas-with-private-pool",
      images: [{ url: "https://pnkxfbsjd3gpupqs.public.blob.vercel-storage.com/header-1.jpg", width: 1200, height: 630 }],
    },
  };
}

type FAQEntry = { name: string; text: string };
const faqTranslations: Record<string, FAQEntry[]> = {
  en: [
    { name: "Which Canary Villas properties have a private jacuzzi or pool?", text: "The Bungalow Apartment features a private outdoor jacuzzi on its sunny terrace, perfect for relaxing under the Fuerteventura sun. The Beach House has direct beachfront terrace access — you step straight onto the sand. Both properties are available to book direct at canaryvillas.com." },
    { name: "Is the jacuzzi heated year-round?", text: "Yes — the jacuzzi at the Bungalow Apartment is available year-round. Fuerteventura's warm climate (average 22°C even in winter) means outdoor use is comfortable throughout the year." },
    { name: "Are the villas suitable for a romantic couple's holiday?", text: "The Bungalow Apartment is ideal for couples — a private retreat with a jacuzzi, king-size bed with hotel-grade mattress, and just minutes from Corralejo's restaurants and beaches. It is one of the most sought-after romantic getaways on Fuerteventura." },
    { name: "Can I book the villas for a family holiday?", text: "The Beach House sleeps up to 6 guests and is perfect for families — step straight off the private terrace onto the beach, with Corralejo's restaurants and supermarkets a short walk away. The Bungalow Apartment is ideal for smaller families of up to 4." },
  ],
  de: [
    { name: "Welche Canary Villas Unterkünfte haben einen privaten Jacuzzi oder Pool?", text: "Das Bungalow Apartment verfügt über einen privaten Außenjacuzzi auf seiner sonnigen Terrasse. Das Beach House bietet direkten Strandzugang — Sie treten direkt auf den Sand. Beide Unterkünfte sind direkt bei canaryvillas.com buchbar." },
    { name: "Ist der Jacuzzi ganzjährig beheizt?", text: "Ja — der Jacuzzi im Bungalow Apartment ist das ganze Jahr verfügbar. Fuerteventuras warmes Klima (durchschnittlich 22°C selbst im Winter) macht die Nutzung im Freien das ganze Jahr angenehm." },
    { name: "Sind die Villen für einen romantischen Paarurlaub geeignet?", text: "Das Bungalow Apartment ist ideal für Paare — ein privater Rückzugsort mit Jacuzzi, Kingsize-Bett mit Hotelmatratze, nur Minuten von Corralejos Restaurants und Stränden entfernt." },
    { name: "Kann ich die Villen für einen Familienurlaub buchen?", text: "Das Beach House bietet Platz für bis zu 6 Gäste und ist perfekt für Familien — von der Terrasse direkt auf den Strand. Das Bungalow Apartment ist ideal für kleinere Familien bis zu 4 Personen." },
  ],
  es: [
    { name: "¿Qué propiedades de Canary Villas tienen jacuzzi privado o piscina?", text: "El Bungalow Apartment tiene un jacuzzi exterior privado en su soleada terraza. El Beach House tiene acceso directo a la playa desde la terraza. Ambas propiedades están disponibles para reserva directa en canaryvillas.com." },
    { name: "¿El jacuzzi está calentado todo el año?", text: "Sí — el jacuzzi del Bungalow Apartment está disponible todo el año. El cálido clima de Fuerteventura (media de 22°C incluso en invierno) hace que el uso exterior sea cómodo todo el año." },
    { name: "¿Son las villas adecuadas para unas vacaciones románticas en pareja?", text: "El Bungalow Apartment es ideal para parejas — un retiro privado con jacuzzi, cama doble con colchón de calidad hotelera, a pocos minutos de los restaurantes y playas de Corralejo." },
    { name: "¿Puedo reservar las villas para unas vacaciones en familia?", text: "El Beach House aloja hasta 6 huéspedes y es perfecto para familias — sale de la terraza directamente a la playa. El Bungalow Apartment es ideal para familias pequeñas de hasta 4." },
  ],
  fr: [
    { name: "Quelles propriétés de Canary Villas disposent d'un jacuzzi ou d'une piscine privée ?", text: "Le Bungalow Apartment dispose d'un jacuzzi extérieur privé sur sa terrasse ensoleillée. Le Beach House offre un accès direct à la plage depuis la terrasse. Les deux propriétés sont disponibles en réservation directe sur canaryvillas.com." },
    { name: "Le jacuzzi est-il chauffé toute l'année ?", text: "Oui — le jacuzzi du Bungalow Apartment est disponible toute l'année. Le climat chaud de Fuerteventura (22°C en moyenne même en hiver) rend son utilisation extérieure agréable toute l'année." },
    { name: "Les villas conviennent-elles à des vacances en couple ?", text: "Le Bungalow Apartment est idéal pour les couples — un refuge privé avec jacuzzi, lit king-size avec matelas de qualité hôtelière, à quelques minutes des restaurants et plages de Corralejo." },
    { name: "Puis-je réserver les villas pour des vacances en famille ?", text: "Le Beach House accueille jusqu'à 6 personnes et est parfait pour les familles — sortie directe sur la plage depuis la terrasse. Le Bungalow Apartment est idéal pour les petites familles jusqu'à 4 personnes." },
  ],
  nl: [
    { name: "Welke Canary Villas accommodaties hebben een privéjacuzzi of privézwembad?", text: "Het Bungalow Apartment heeft een privéjacuzzi buiten op het zonnige terras. The Beach House heeft direct strandtoegang vanaf het terras. Beide accommodaties zijn direct te boeken op canaryvillas.com." },
    { name: "Is de jacuzzi het hele jaar verwarmd?", text: "Ja — de jacuzzi in het Bungalow Apartment is het hele jaar beschikbaar. Fuerteventura's warm klimaat (gemiddeld 22°C ook in de winter) maakt buiten gebruik het hele jaar aangenaam." },
    { name: "Zijn de villa's geschikt voor een romantische vakantie voor twee?", text: "Het Bungalow Apartment is ideaal voor koppels — een privéretreat met jacuzzi, kingsize bed met hotelkwaliteitsmatras, op enkele minuten van de restaurants en stranden van Corralejo." },
    { name: "Kan ik de villa's boeken voor een gezinsvakantie?", text: "The Beach House slaapt tot 6 gasten en is perfect voor gezinnen — stap direct van het terras het strand op. Het Bungalow Apartment is ideaal voor kleine gezinnen van max. 4." },
  ],
  it: [
    { name: "Quali proprietà di Canary Villas hanno jacuzzi o piscina privata?", text: "Il Bungalow Apartment ha un jacuzzi esterno privato sulla soleggiata terrazza. The Beach House ha accesso diretto alla spiaggia dalla terrazza. Entrambe le proprietà sono disponibili per prenotazione diretta su canaryvillas.com." },
    { name: "Il jacuzzi è riscaldato tutto l'anno?", text: "Sì — il jacuzzi del Bungalow Apartment è disponibile tutto l'anno. Il clima caldo di Fuerteventura (media 22°C anche in inverno) rende l'uso esterno confortevole per tutto l'anno." },
    { name: "Le ville sono adatte per una vacanza romantica di coppia?", text: "Il Bungalow Apartment è ideale per le coppie — un rifugio privato con jacuzzi, letto king-size con materasso di qualità alberghiera, a pochi minuti dai ristoranti e dalle spiagge di Corralejo." },
    { name: "Posso prenotare le ville per una vacanza in famiglia?", text: "The Beach House ospita fino a 6 ospiti ed è perfetto per le famiglie — uscita diretta sulla spiaggia dalla terrazza. Il Bungalow Apartment è ideale per famiglie piccole fino a 4 persone." },
  ],
};

type PerkEntry = { title: string; desc: string };
const perkTranslations: Record<string, PerkEntry[]> = {
  en: [
    { title: "Private outdoor space", desc: "Terrace, jacuzzi, or direct beach access — every villa has its own private outdoor area" },
    { title: "Year-round sunshine", desc: "Fuerteventura averages 300 days of sunshine and 22°C year-round — the outdoor space is usable every month" },
    { title: "Hotel-grade amenities", desc: "Premium mattresses, quality linens, fully equipped kitchens — without the hotel price tag" },
    { title: "Direct booking savings", desc: "Book direct and save 12–20% vs Airbnb — no platform fees, straight to the owners" },
  ],
  de: [
    { title: "Privater Außenbereich", desc: "Terrasse, Jacuzzi oder direkter Strandzugang — jede Villa hat ihren eigenen privaten Außenbereich" },
    { title: "Sonnenschein das ganze Jahr", desc: "Fuerteventura hat durchschnittlich 300 Sonnentage und 22°C das ganze Jahr — der Außenbereich ist jeden Monat nutzbar" },
    { title: "Hotelqualität", desc: "Premium-Matratzen, Qualitätsbettwäsche, voll ausgestattete Küchen — ohne den Hotelpreis" },
    { title: "Sparen durch Direktbuchung", desc: "Direkt buchen und 12–20 % gegenüber Airbnb sparen — keine Plattformgebühren" },
  ],
  es: [
    { title: "Espacio exterior privado", desc: "Terraza, jacuzzi o acceso directo a la playa — cada villa tiene su propio espacio exterior privado" },
    { title: "Sol todo el año", desc: "Fuerteventura tiene una media de 300 días de sol y 22°C todo el año — el espacio exterior es utilizable cada mes" },
    { title: "Comodidades de hotel", desc: "Colchones premium, ropa de cama de calidad, cocinas totalmente equipadas — sin el precio del hotel" },
    { title: "Ahorra reservando directo", desc: "Reserva directamente y ahorra 12–20 % frente a Airbnb — sin comisiones de plataforma" },
  ],
  fr: [
    { title: "Espace extérieur privé", desc: "Terrasse, jacuzzi ou accès direct à la plage — chaque villa a son propre espace extérieur privé" },
    { title: "Soleil toute l'année", desc: "Fuerteventura bénéficie en moyenne de 300 jours de soleil et 22°C toute l'année — l'espace extérieur est utilisable chaque mois" },
    { title: "Équipements de qualité hôtelière", desc: "Matelas premium, linge de qualité, cuisines entièrement équipées — sans le prix de l'hôtel" },
    { title: "Économies en réservant directement", desc: "Réservez directement et économisez 12–20 % par rapport à Airbnb — sans frais de plateforme" },
  ],
  nl: [
    { title: "Privé buitenruimte", desc: "Terras, jacuzzi of directe strandtoegang — elke villa heeft zijn eigen privé buitenruimte" },
    { title: "Zonneschijn het hele jaar", desc: "Fuerteventura heeft gemiddeld 300 zonnedagen en 22°C het hele jaar — de buitenruimte is elke maand bruikbaar" },
    { title: "Hotelkwaliteit voorzieningen", desc: "Premium matrassen, kwaliteitsbeddengoed, volledig uitgeruste keukens — zonder de hotelprijs" },
    { title: "Bespaar door direct te boeken", desc: "Direct boeken en 12–20% besparen t.o.v. Airbnb — geen platformkosten" },
  ],
  it: [
    { title: "Spazio esterno privato", desc: "Terrazza, jacuzzi o accesso diretto alla spiaggia — ogni villa ha il proprio spazio esterno privato" },
    { title: "Sole tutto l'anno", desc: "Fuerteventura ha in media 300 giorni di sole e 22°C tutto l'anno — lo spazio esterno è utilizzabile ogni mese" },
    { title: "Servizi di qualità alberghiera", desc: "Materassi premium, biancheria di qualità, cucine completamente attrezzate — senza il prezzo dell'hotel" },
    { title: "Risparmia con la prenotazione diretta", desc: "Prenota direttamente e risparmia il 12–20% rispetto ad Airbnb — senza commissioni di piattaforma" },
  ],
};

const perkIcons = [<Waves className="w-5 h-5" />, <Sun className="w-5 h-5" />, <Star className="w-5 h-5" />, <CheckCircle2 className="w-5 h-5" />];

export default async function PrivatePoolPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const tr = t[locale] ?? t.en;
  const villas = await getAllVillas();
  const faqItems = faqTranslations[locale] ?? faqTranslations.en;
  const pageSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqItems.map(f => ({ "@type": "Question", name: f.name, acceptedAnswer: { "@type": "Answer", text: f.text } })),
  };
  const perks = (perkTranslations[locale] ?? perkTranslations.en).map((p, i) => ({ icon: perkIcons[i], ...p }));

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(pageSchema) }} />

      <div className="pt-20 min-h-screen bg-gray-50">
        {/* Hero */}
        <div className="bg-gradient-to-br from-teal-600 to-sky-700 text-white py-16 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Waves className="w-6 h-6 text-teal-200" />
              <span className="text-teal-200 text-sm font-medium uppercase tracking-wider">Private jacuzzi · Beachfront terrace · Year-round sun</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold mb-4">{tr.hero}</h1>
            <p className="text-teal-100 text-lg max-w-2xl mx-auto mb-8">{tr.sub}</p>
            <div className="flex flex-wrap gap-3 justify-center">
              <Link href={`/${locale}/villas`} className="bg-white text-teal-700 px-6 py-3 rounded-full font-bold text-sm hover:bg-teal-50 transition-colors">
                {tr.viewAll}
              </Link>
              <Link href={`/${locale}/contact`} className="border border-white/60 text-white px-6 py-3 rounded-full font-semibold text-sm hover:bg-white/10 transition-colors">
                {tr.ask}
              </Link>
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">

          {/* Perks */}
          <div className="mb-16">
            <h2 className="text-2xl font-extrabold text-gray-900 mb-2 text-center">{tr.why}</h2>
            <p className="text-gray-500 text-center mb-8 max-w-2xl mx-auto">{tr.whySub}</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {perks.map((p, i) => (
                <div key={i} className="bg-white rounded-2xl border border-gray-200 p-5">
                  <div className="text-teal-500 mb-3">{p.icon}</div>
                  <p className="font-bold text-gray-900 text-sm mb-1">{p.title}</p>
                  <p className="text-gray-500 text-sm leading-relaxed">{p.desc}</p>
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
