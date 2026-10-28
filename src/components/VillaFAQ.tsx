"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

export interface FAQItem {
  question: string;
  answer: string;
}

interface Props {
  faqs: FAQItem[];
}

export default function VillaFAQ({ faqs }: Props) {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <div className="divide-y divide-gray-100 border border-gray-200 rounded-2xl overflow-hidden">
      {faqs.map((faq, i) => (
        <div key={i}>
          <button
            onClick={() => setOpen(open === i ? null : i)}
            className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left hover:bg-gray-50 transition-colors"
          >
            <span className="text-sm font-semibold text-gray-900">{faq.question}</span>
            <ChevronDown className={`w-4 h-4 text-gray-400 shrink-0 transition-transform ${open === i ? "rotate-180" : ""}`} />
          </button>
          {open === i && (
            <div className="px-5 pb-4 text-sm text-gray-600 leading-relaxed">{faq.answer}</div>
          )}
        </div>
      ))}
    </div>
  );
}

const faqData: Record<string, Record<string, FAQItem[]>> = {
  en: {
    "beach-house": [
      { question: "How far is the beach from The Beach House?", answer: "The Beach House is directly beachfront — you step straight from the private terrace onto the sand. The nearest beach, Playa de Corralejo Viejo, is immediately in front of the villa. Flag Beach, famous for kitesurfing, is approximately 2 km south (a 5-minute drive or 25-minute walk)." },
      { question: "Is there parking at The Beach House?", answer: "Yes, free on-street parking is available directly outside the villa. Corralejo town centre is a short walk away so a car is optional, though handy for day trips to the Corralejo Dunes Natural Park or the south of the island." },
      { question: "What are the check-in and check-out times?", answer: "Check-in is from 3:00 PM and check-out is by 10:00 AM. Early check-in or late check-out can often be arranged — just contact us in advance and we will do our best to accommodate you." },
      { question: "How many guests can The Beach House sleep?", answer: "The Beach House comfortably sleeps up to 6 guests across two bedrooms (with an optional third). It is ideal for families or groups of friends." },
      { question: "Is The Beach House pet-friendly?", answer: "We are sorry, but pets are not permitted at The Beach House. This allows us to maintain the highest standards of cleanliness for all guests." },
      { question: "What is included in the price?", answer: "The nightly rate includes all utilities (electricity, water, Wi-Fi), bed linen, and towels. A one-off cleaning fee applies per stay. There are no hidden fees — the total you see at checkout is everything you pay." },
      { question: "How close is Corralejo town centre?", answer: "Corralejo town centre — with its restaurants, bars, supermarkets, and water sports hire — is a 5 to 10-minute walk from The Beach House." },
      { question: "Why should I book direct instead of through Airbnb or Booking.com?", answer: "Booking directly through Canary Villas guarantees the lowest price — you avoid the 12–20% service fees charged by platforms like Airbnb. You also get direct contact with the owners, flexible payment options, and personalised local tips." },
    ] as FAQItem[],
    "bungalow-apartment": [
      { question: "How far is the beach from the Bungalow Apartment?", answer: "The Bungalow Apartment is a short drive or 10-minute cycle from Corralejo's main beaches. Playa de Corralejo Viejo (town beach) is approximately 1.2 km away. Flag Beach is around 3 km south." },
      { question: "Is there parking at the Bungalow Apartment?", answer: "Yes — the apartment includes its own private, dedicated parking space at no extra cost." },
      { question: "What are the check-in and check-out times?", answer: "Check-in is from 3:00 PM and check-out is by 10:00 AM. Early check-in or late check-out can often be arranged — just let us know in advance." },
      { question: "How many guests can the Bungalow Apartment sleep?", answer: "The Bungalow Apartment sleeps up to 4 guests. It is perfect for couples or small families." },
      { question: "Is there a private outdoor space?", answer: "Yes — the apartment has its own sunny private terrace with a jacuzzi, ideal for relaxing after a day at the beach." },
      { question: "Is the Bungalow Apartment pet-friendly?", answer: "We are sorry, but pets are not permitted at the Bungalow Apartment." },
      { question: "What is included in the price?", answer: "The nightly rate includes all utilities (electricity, water, Wi-Fi), bed linen, towels, and use of the private jacuzzi. A one-off cleaning fee applies per stay. There are no hidden fees." },
      { question: "Why should I book direct instead of through Airbnb or Booking.com?", answer: "Booking directly through Canary Villas guarantees the lowest price — you avoid the 12–20% service fees charged by platforms like Airbnb. You also get direct contact with the owners and flexible payment options." },
    ] as FAQItem[],
  },
  de: {
    "beach-house": [
      { question: "Wie weit ist der Strand vom Beach House entfernt?", answer: "Das Beach House liegt direkt am Strand — Sie treten von der privaten Terrasse direkt auf den Sand. Der nächste Strand, Playa de Corralejo Viejo, liegt unmittelbar vor der Villa. Flag Beach, bekannt für Kitesurfen, ist ca. 2 km südlich (5 Minuten Fahrt)." },
      { question: "Gibt es Parkplätze beim Beach House?", answer: "Ja, kostenlose Straßenparkplätze sind direkt vor der Villa verfügbar. Das Stadtzentrum von Corralejo ist zu Fuß erreichbar, ein Auto ist also optional." },
      { question: "Was sind die Check-in und Check-out Zeiten?", answer: "Check-in ab 15:00 Uhr, Check-out bis 10:00 Uhr. Früherer Check-in oder späterer Check-out kann oft arrangiert werden — kontaktieren Sie uns einfach im Voraus." },
      { question: "Wie viele Gäste kann das Beach House beherbergen?", answer: "Das Beach House bietet bequem Platz für bis zu 6 Gäste in zwei Schlafzimmern (mit optionalem dritten). Es ist ideal für Familien oder Gruppen." },
      { question: "Sind Haustiere erlaubt?", answer: "Leider sind Haustiere im Beach House nicht gestattet, um höchste Sauberkeitsstandards für alle Gäste zu gewährleisten." },
      { question: "Was ist im Preis inbegriffen?", answer: "Der Nachtpreis beinhaltet alle Nebenkosten (Strom, Wasser, WLAN), Bettwäsche und Handtücher. Eine einmalige Reinigungsgebühr gilt pro Aufenthalt. Es gibt keine versteckten Kosten." },
      { question: "Wie weit ist das Stadtzentrum von Corralejo?", answer: "Das Stadtzentrum von Corralejo mit Restaurants, Bars, Supermärkten und Wassersportverleih ist 5–10 Minuten zu Fuß vom Beach House entfernt." },
      { question: "Warum direkt buchen statt über Airbnb?", answer: "Die Direktbuchung bei Canary Villas garantiert den niedrigsten Preis — Sie vermeiden die 12–20 % Servicegebühren von Plattformen wie Airbnb. Sie erhalten außerdem direkten Kontakt zu den Eigentümern und persönliche Tipps." },
    ] as FAQItem[],
    "bungalow-apartment": [
      { question: "Wie weit ist der Strand vom Bungalow-Apartment entfernt?", answer: "Das Bungalow-Apartment ist eine kurze Fahrt oder 10 Minuten mit dem Fahrrad von Corralejos Hauptstränden entfernt. Playa de Corralejo Viejo ist ca. 1,2 km entfernt." },
      { question: "Gibt es Parkplätze beim Bungalow-Apartment?", answer: "Ja — das Apartment verfügt über einen eigenen, privaten Parkplatz ohne Aufpreis." },
      { question: "Was sind die Check-in und Check-out Zeiten?", answer: "Check-in ab 15:00 Uhr, Check-out bis 10:00 Uhr. Früherer Check-in oder späterer Check-out kann oft arrangiert werden." },
      { question: "Wie viele Gäste kann das Bungalow-Apartment beherbergen?", answer: "Das Bungalow-Apartment bietet Platz für bis zu 4 Gäste. Es ist ideal für Paare oder kleine Familien." },
      { question: "Gibt es einen privaten Außenbereich?", answer: "Ja — das Apartment hat eine sonnige private Terrasse mit Jacuzzi." },
      { question: "Sind Haustiere erlaubt?", answer: "Leider sind Haustiere im Bungalow-Apartment nicht gestattet." },
      { question: "Was ist im Preis inbegriffen?", answer: "Der Nachtpreis beinhaltet alle Nebenkosten, Bettwäsche, Handtücher und die Nutzung des privaten Jacuzzis. Eine einmalige Reinigungsgebühr gilt pro Aufenthalt. Keine versteckten Kosten." },
      { question: "Warum direkt buchen statt über Airbnb?", answer: "Die Direktbuchung garantiert den niedrigsten Preis — Sie vermeiden die 12–20 % Servicegebühren von Airbnb und erhalten direkten Kontakt zu den Eigentümern." },
    ] as FAQItem[],
  },
  es: {
    "beach-house": [
      { question: "¿A qué distancia está la playa del Beach House?", answer: "El Beach House está directamente en primera línea de playa — sales de la terraza privada directamente a la arena. La playa más cercana, Playa de Corralejo Viejo, está justo enfrente. Flag Beach está a unos 2 km al sur (5 minutos en coche)." },
      { question: "¿Hay aparcamiento en el Beach House?", answer: "Sí, hay aparcamiento gratuito en la calle justo frente a la villa. El centro de Corralejo está a poca distancia a pie, por lo que el coche es opcional." },
      { question: "¿Cuáles son los horarios de entrada y salida?", answer: "Entrada a partir de las 15:00 h, salida antes de las 10:00 h. El check-in anticipado o la salida tardía se pueden organizar con antelación." },
      { question: "¿Cuántos huéspedes puede alojar el Beach House?", answer: "El Beach House puede alojar cómodamente hasta 6 huéspedes en dos dormitorios (con un tercero opcional). Ideal para familias o grupos de amigos." },
      { question: "¿Se admiten mascotas?", answer: "Lo sentimos, pero no se admiten mascotas en el Beach House para mantener los más altos estándares de limpieza." },
      { question: "¿Qué está incluido en el precio?", answer: "La tarifa por noche incluye todos los suministros (electricidad, agua, Wi-Fi), ropa de cama y toallas. Se aplica una tarifa de limpieza única por estancia. Sin cargos ocultos." },
      { question: "¿A qué distancia está el centro de Corralejo?", answer: "El centro de Corralejo, con restaurantes, bares, supermercados y alquiler de deportes acuáticos, está a 5–10 minutos a pie del Beach House." },
      { question: "¿Por qué reservar directamente en vez de a través de Airbnb?", answer: "Reservar directamente con Canary Villas garantiza el precio más bajo — evitas las comisiones del 12–20 % de plataformas como Airbnb. También tienes contacto directo con los propietarios y opciones de pago flexibles." },
    ] as FAQItem[],
    "bungalow-apartment": [
      { question: "¿A qué distancia está la playa del Bungalow Apartment?", answer: "El Bungalow Apartment está a un corto trayecto o 10 minutos en bici de las principales playas de Corralejo. La Playa de Corralejo Viejo está a aproximadamente 1,2 km." },
      { question: "¿Hay aparcamiento en el Bungalow Apartment?", answer: "Sí — el apartamento dispone de su propia plaza de aparcamiento privada sin coste adicional." },
      { question: "¿Cuáles son los horarios de entrada y salida?", answer: "Entrada a partir de las 15:00 h, salida antes de las 10:00 h. Se puede organizar entrada anticipada o salida tardía con antelación." },
      { question: "¿Cuántos huéspedes puede alojar el Bungalow Apartment?", answer: "El Bungalow Apartment aloja hasta 4 huéspedes. Perfecto para parejas o familias pequeñas." },
      { question: "¿Hay espacio exterior privado?", answer: "Sí — el apartamento tiene su propia terraza privada soleada con jacuzzi." },
      { question: "¿Se admiten mascotas?", answer: "Lo sentimos, pero no se admiten mascotas en el Bungalow Apartment." },
      { question: "¿Qué está incluido en el precio?", answer: "La tarifa incluye todos los suministros, ropa de cama, toallas y uso del jacuzzi privado. Se aplica una tarifa de limpieza única. Sin cargos ocultos." },
      { question: "¿Por qué reservar directamente en vez de a través de Airbnb?", answer: "La reserva directa garantiza el precio más bajo — evitas las comisiones del 12–20 % de Airbnb y tienes contacto directo con los propietarios." },
    ] as FAQItem[],
  },
  fr: {
    "beach-house": [
      { question: "À quelle distance se trouve la plage du Beach House ?", answer: "Le Beach House est directement en bord de mer — vous passez de la terrasse privée directement sur le sable. La plage la plus proche, Playa de Corralejo Viejo, est juste en face. Flag Beach est à environ 2 km au sud (5 minutes en voiture)." },
      { question: "Y a-t-il un parking au Beach House ?", answer: "Oui, un parking gratuit en bord de rue est disponible directement devant la villa. Le centre-ville de Corralejo est à courte distance à pied." },
      { question: "Quels sont les horaires d'arrivée et de départ ?", answer: "Arrivée à partir de 15h00, départ avant 10h00. Une arrivée anticipée ou un départ tardif peuvent souvent être arrangés en nous contactant à l'avance." },
      { question: "Combien de personnes peut accueillir le Beach House ?", answer: "Le Beach House peut accueillir confortablement jusqu'à 6 personnes dans deux chambres (avec une troisième en option). Idéal pour les familles ou groupes d'amis." },
      { question: "Les animaux sont-ils acceptés ?", answer: "Nous sommes désolés, mais les animaux ne sont pas autorisés au Beach House afin de maintenir les plus hauts standards de propreté." },
      { question: "Qu'est-ce qui est inclus dans le prix ?", answer: "Le tarif par nuit comprend tous les services (électricité, eau, Wi-Fi), le linge de lit et les serviettes. Des frais de ménage uniques s'appliquent par séjour. Aucun frais caché." },
      { question: "À quelle distance se trouve le centre de Corralejo ?", answer: "Le centre de Corralejo, avec ses restaurants, bars, supermarchés et location de sports nautiques, est à 5–10 minutes à pied du Beach House." },
      { question: "Pourquoi réserver en direct plutôt que via Airbnb ?", answer: "Réserver directement auprès de Canary Villas garantit le meilleur prix — vous évitez les frais de service de 12–20 % des plateformes comme Airbnb. Vous bénéficiez également d'un contact direct avec les propriétaires." },
    ] as FAQItem[],
    "bungalow-apartment": [
      { question: "À quelle distance se trouve la plage du Bungalow Apartment ?", answer: "Le Bungalow Apartment est à un court trajet ou 10 minutes à vélo des principales plages de Corralejo. La Playa de Corralejo Viejo est à environ 1,2 km." },
      { question: "Y a-t-il un parking au Bungalow Apartment ?", answer: "Oui — l'appartement dispose de sa propre place de parking privée sans supplément." },
      { question: "Quels sont les horaires d'arrivée et de départ ?", answer: "Arrivée à partir de 15h00, départ avant 10h00. Une arrivée anticipée ou un départ tardif peuvent être arrangés à l'avance." },
      { question: "Combien de personnes peut accueillir le Bungalow Apartment ?", answer: "Le Bungalow Apartment accueille jusqu'à 4 personnes. Parfait pour les couples ou petites familles." },
      { question: "Y a-t-il un espace extérieur privé ?", answer: "Oui — l'appartement dispose de sa propre terrasse privée ensoleillée avec jacuzzi." },
      { question: "Les animaux sont-ils acceptés ?", answer: "Nous sommes désolés, mais les animaux ne sont pas autorisés au Bungalow Apartment." },
      { question: "Qu'est-ce qui est inclus dans le prix ?", answer: "Le tarif inclut tous les services, le linge de lit, les serviettes et l'utilisation du jacuzzi privé. Des frais de ménage uniques s'appliquent. Aucun frais caché." },
      { question: "Pourquoi réserver en direct plutôt que via Airbnb ?", answer: "La réservation directe garantit le meilleur prix — vous évitez les frais de 12–20 % d'Airbnb et bénéficiez d'un contact direct avec les propriétaires." },
    ] as FAQItem[],
  },
  nl: {
    "beach-house": [
      { question: "Hoe ver is het strand van The Beach House?", answer: "The Beach House ligt direct aan het strand — je stapt van het privéterras direct het zand op. Het dichtstbijzijnde strand, Playa de Corralejo Viejo, ligt direct voor de villa. Flag Beach is ca. 2 km zuidelijk (5 minuten rijden)." },
      { question: "Is er parkeergelegenheid bij The Beach House?", answer: "Ja, er is gratis parkeren op straat direct voor de villa. Het centrum van Corralejo is op loopafstand, een auto is dus optioneel." },
      { question: "Wat zijn de check-in en check-out tijden?", answer: "Inchecken vanaf 15:00 uur, uitchecken voor 10:00 uur. Vroeg inchecken of laat uitchecken kan vaak worden geregeld — neem vooraf contact met ons op." },
      { question: "Hoeveel gasten kan The Beach House herbergen?", answer: "The Beach House biedt comfortabel ruimte aan maximaal 6 gasten in twee slaapkamers (met een optionele derde). Ideaal voor gezinnen of vriendengroepen." },
      { question: "Zijn huisdieren toegestaan?", answer: "Helaas zijn huisdieren niet toegestaan in The Beach House om de hoogste reinheidsstandaarden voor alle gasten te handhaven." },
      { question: "Wat is inbegrepen in de prijs?", answer: "De nachtprijs omvat alle nutsvoorzieningen (elektriciteit, water, Wi-Fi), beddengoed en handdoeken. Er geldt een eenmalige schoonmaakkost per verblijf. Geen verborgen kosten." },
      { question: "Hoe ver is het centrum van Corralejo?", answer: "Het centrum van Corralejo met restaurants, bars, supermarkten en watersportverhuur is 5–10 minuten lopen van The Beach House." },
      { question: "Waarom direct boeken in plaats van via Airbnb?", answer: "Direct boeken bij Canary Villas garandeert de laagste prijs — je vermijdt de servicekosten van 12–20 % van platforms zoals Airbnb. Je hebt ook direct contact met de eigenaren en flexibele betaalopties." },
    ] as FAQItem[],
    "bungalow-apartment": [
      { question: "Hoe ver is het strand van het Bungalow Apartment?", answer: "Het Bungalow Apartment is een korte rit of 10 minuten fietsen van de hoofdstranden van Corralejo. Playa de Corralejo Viejo is ca. 1,2 km verwijderd." },
      { question: "Is er parkeergelegenheid bij het Bungalow Apartment?", answer: "Ja — het appartement heeft zijn eigen privéparkeerplaats zonder extra kosten." },
      { question: "Wat zijn de check-in en check-out tijden?", answer: "Inchecken vanaf 15:00 uur, uitchecken voor 10:00 uur. Vroeg inchecken of laat uitchecken kan vaak worden geregeld." },
      { question: "Hoeveel gasten kan het Bungalow Apartment herbergen?", answer: "Het Bungalow Apartment biedt ruimte aan maximaal 4 gasten. Ideaal voor stellen of kleine gezinnen." },
      { question: "Is er een privé buitenruimte?", answer: "Ja — het appartement heeft een eigen zonnig privéterras met jacuzzi." },
      { question: "Zijn huisdieren toegestaan?", answer: "Helaas zijn huisdieren niet toegestaan in het Bungalow Apartment." },
      { question: "Wat is inbegrepen in de prijs?", answer: "De nachtprijs omvat alle nutsvoorzieningen, beddengoed, handdoeken en gebruik van de privéjacuzzi. Eenmalige schoonmaakkosten per verblijf. Geen verborgen kosten." },
      { question: "Waarom direct boeken in plaats van via Airbnb?", answer: "Direct boeken garandeert de laagste prijs — je vermijdt de 12–20 % kosten van Airbnb en hebt direct contact met de eigenaren." },
    ] as FAQItem[],
  },
  it: {
    "beach-house": [
      { question: "Quanto dista la spiaggia da The Beach House?", answer: "The Beach House è direttamente sul mare — si passa dalla terrazza privata direttamente sulla sabbia. La spiaggia più vicina, Playa de Corralejo Viejo, è proprio di fronte alla villa. Flag Beach è a circa 2 km a sud (5 minuti in auto)." },
      { question: "C'è parcheggio al Beach House?", answer: "Sì, è disponibile parcheggio gratuito in strada direttamente davanti alla villa. Il centro di Corralejo è raggiungibile a piedi, quindi l'auto è opzionale." },
      { question: "Quali sono gli orari di check-in e check-out?", answer: "Check-in dalle 15:00, check-out entro le 10:00. Check-in anticipato o check-out posticipato possono spesso essere concordati contattandoci in anticipo." },
      { question: "Quanti ospiti può ospitare The Beach House?", answer: "The Beach House può ospitare comodamente fino a 6 ospiti in due camere da letto (con una terza opzionale). Ideale per famiglie o gruppi di amici." },
      { question: "Gli animali sono ammessi?", answer: "Siamo spiacenti, ma gli animali non sono ammessi a The Beach House per mantenere i più alti standard di pulizia." },
      { question: "Cosa è incluso nel prezzo?", answer: "La tariffa per notte include tutte le utenze (elettricità, acqua, Wi-Fi), biancheria da letto e asciugamani. Si applica una tariffa di pulizia una tantum per soggiorno. Nessun costo nascosto." },
      { question: "Quanto dista il centro di Corralejo?", answer: "Il centro di Corralejo, con ristoranti, bar, supermercati e noleggio sport acquatici, è a 5–10 minuti a piedi da The Beach House." },
      { question: "Perché prenotare direttamente invece di tramite Airbnb?", answer: "Prenotare direttamente con Canary Villas garantisce il prezzo più basso — si evitano le commissioni di servizio del 12–20 % di piattaforme come Airbnb. Si ha inoltre contatto diretto con i proprietari e opzioni di pagamento flessibili." },
    ] as FAQItem[],
    "bungalow-apartment": [
      { question: "Quanto dista la spiaggia dal Bungalow Apartment?", answer: "Il Bungalow Apartment è a breve distanza in auto o 10 minuti in bici dalle principali spiagge di Corralejo. La Playa de Corralejo Viejo è a circa 1,2 km." },
      { question: "C'è parcheggio al Bungalow Apartment?", answer: "Sì — l'appartamento dispone di un posto auto privato dedicato senza costi aggiuntivi." },
      { question: "Quali sono gli orari di check-in e check-out?", answer: "Check-in dalle 15:00, check-out entro le 10:00. Check-in anticipato o check-out posticipato possono essere concordati in anticipo." },
      { question: "Quanti ospiti può ospitare il Bungalow Apartment?", answer: "Il Bungalow Apartment ospita fino a 4 persone. Perfetto per coppie o piccole famiglie." },
      { question: "C'è uno spazio esterno privato?", answer: "Sì — l'appartamento ha una propria terrazza privata soleggiata con jacuzzi." },
      { question: "Gli animali sono ammessi?", answer: "Siamo spiacenti, ma gli animali non sono ammessi al Bungalow Apartment." },
      { question: "Cosa è incluso nel prezzo?", answer: "La tariffa include tutte le utenze, biancheria, asciugamani e uso del jacuzzi privato. Si applica una tariffa di pulizia una tantum. Nessun costo nascosto." },
      { question: "Perché prenotare direttamente invece di tramite Airbnb?", answer: "La prenotazione diretta garantisce il prezzo più basso — si evitano le commissioni del 12–20 % di Airbnb e si ha contatto diretto con i proprietari." },
    ] as FAQItem[],
  },
};

export function getVillaFAQs(slug: string, locale: string): FAQItem[] {
  const localeData = faqData[locale] ?? faqData.en;
  return (localeData[slug] ?? faqData.en[slug] ?? []) as FAQItem[];
}

// Keep VILLA_FAQS export for the FAQ schema (English, used in JSON-LD)
export const VILLA_FAQS = faqData.en as Record<string, FAQItem[]>;
export const DEFAULT_FAQS = faqData.en["beach-house"] as FAQItem[];
