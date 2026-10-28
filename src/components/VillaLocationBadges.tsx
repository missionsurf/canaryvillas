import { Waves, Wind, MapPin, ShoppingCart, Bus, Car } from "lucide-react";

interface Badge {
  icon: React.ReactNode;
  label: string;
  value: string;
}

type BadgeLabels = {
  beachAccess: string;
  flagBeach: string;
  townCentre: string;
  supermarket: string;
  dunesPark: string;
  parking: string;
  busStop: string;
  townBeach: string;
};

const labels: Record<string, BadgeLabels> = {
  en: { beachAccess: "Beach access", flagBeach: "Flag Beach (kitesurfing)", townCentre: "Corralejo town centre", supermarket: "Nearest supermarket", dunesPark: "Corralejo Dunes Park", parking: "Parking", busStop: "Bus stop", townBeach: "Town beach (Playa Viejo)" },
  de: { beachAccess: "Strandzugang", flagBeach: "Flag Beach (Kitesurfen)", townCentre: "Stadtzentrum Corralejo", supermarket: "Nächster Supermarkt", dunesPark: "Dünenpark Corralejo", parking: "Parkplatz", busStop: "Bushaltestelle", townBeach: "Stadtsstrand (Playa Viejo)" },
  es: { beachAccess: "Acceso a la playa", flagBeach: "Flag Beach (kitesurf)", townCentre: "Centro de Corralejo", supermarket: "Supermercado más cercano", dunesPark: "Parque Dunas Corralejo", parking: "Aparcamiento", busStop: "Parada de autobús", townBeach: "Playa urbana (Playa Viejo)" },
  fr: { beachAccess: "Accès à la plage", flagBeach: "Flag Beach (kitesurf)", townCentre: "Centre-ville de Corralejo", supermarket: "Supermarché le plus proche", dunesPark: "Parc des Dunes Corralejo", parking: "Parking", busStop: "Arrêt de bus", townBeach: "Plage de la ville (Playa Viejo)" },
  nl: { beachAccess: "Strandtoegang", flagBeach: "Flag Beach (kitesurfen)", townCentre: "Centrum Corralejo", supermarket: "Dichtstbijzijnde supermarkt", dunesPark: "Duinenpark Corralejo", parking: "Parkeren", busStop: "Bushalte", townBeach: "Stadsstrand (Playa Viejo)" },
  it: { beachAccess: "Accesso alla spiaggia", flagBeach: "Flag Beach (kitesurf)", townCentre: "Centro di Corralejo", supermarket: "Supermercato più vicino", dunesPark: "Parco Dune Corralejo", parking: "Parcheggio", busStop: "Fermata bus", townBeach: "Spiaggia cittadina (Playa Viejo)" },
};

const parkingValues: Record<string, Record<string, string>> = {
  "beach-house": {
    en: "Free on-street", de: "Kostenlos auf der Straße", es: "Gratis en la calle", fr: "Gratuit en voirie", nl: "Gratis parkeren op straat", it: "Gratuito in strada",
  },
  "bungalow-apartment": {
    en: "Private dedicated space", de: "Privater Stellplatz", es: "Plaza privada", fr: "Place privée dédiée", nl: "Privéparkeerplaats", it: "Posto auto privato",
  },
};

function getBadges(slug: string, locale: string): Badge[] {
  const l = labels[locale] ?? labels.en;
  const parkVal = parkingValues[slug]?.[locale] ?? parkingValues[slug]?.en ?? "";

  if (slug === "beach-house") {
    return [
      { icon: <Waves className="w-4 h-4" />, label: l.beachAccess, value: "Direct (0 m)" },
      { icon: <Wind className="w-4 h-4" />, label: l.flagBeach, value: "~2 km · 5 min" },
      { icon: <MapPin className="w-4 h-4" />, label: l.townCentre, value: "5–10 min" },
      { icon: <ShoppingCart className="w-4 h-4" />, label: l.supermarket, value: "~8 min" },
      { icon: <MapPin className="w-4 h-4" />, label: l.dunesPark, value: "~10 min" },
      { icon: <Car className="w-4 h-4" />, label: l.parking, value: parkVal },
    ];
  }
  if (slug === "bungalow-apartment") {
    return [
      { icon: <Waves className="w-4 h-4" />, label: l.townBeach, value: "~1.2 km · 10 min" },
      { icon: <Wind className="w-4 h-4" />, label: l.flagBeach, value: "~3 km · 8 min" },
      { icon: <MapPin className="w-4 h-4" />, label: l.townCentre, value: "~10 min" },
      { icon: <ShoppingCart className="w-4 h-4" />, label: l.supermarket, value: "~5 min" },
      { icon: <Bus className="w-4 h-4" />, label: l.busStop, value: "~2 min" },
      { icon: <Car className="w-4 h-4" />, label: l.parking, value: parkVal },
    ];
  }
  return [];
}

export default function VillaLocationBadges({ slug, locale = "en" }: { slug: string; locale?: string }) {
  const badges = getBadges(slug, locale);
  if (!badges.length) return null;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
      {badges.map((b, i) => (
        <div key={i} className="flex items-start gap-2.5 bg-sky-50 rounded-xl px-3 py-3">
          <span className="text-sky-500 mt-0.5 shrink-0">{b.icon}</span>
          <div>
            <p className="text-xs text-gray-500 leading-tight">{b.label}</p>
            <p className="text-sm font-semibold text-gray-800 leading-tight mt-0.5">{b.value}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
