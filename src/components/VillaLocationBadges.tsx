import { Waves, Wind, MapPin, ShoppingCart, Bus, Car } from "lucide-react";

interface Badge {
  icon: React.ReactNode;
  label: string;
  value: string;
}

const VILLA_BADGES: Record<string, Badge[]> = {
  "beach-house": [
    { icon: <Waves className="w-4 h-4" />, label: "Beach access", value: "Direct (0 m)" },
    { icon: <Wind className="w-4 h-4" />, label: "Flag Beach (kitesurfing)", value: "~2 km · 5 min drive" },
    { icon: <MapPin className="w-4 h-4" />, label: "Corralejo town centre", value: "5–10 min walk" },
    { icon: <ShoppingCart className="w-4 h-4" />, label: "Nearest supermarket", value: "~8 min walk" },
    { icon: <MapPin className="w-4 h-4" />, label: "Corralejo Dunes Park", value: "~10 min drive" },
    { icon: <Car className="w-4 h-4" />, label: "Parking", value: "Free on-street" },
  ],
  "bungalow-apartment": [
    { icon: <Waves className="w-4 h-4" />, label: "Town beach (Playa Viejo)", value: "~1.2 km · 10 min cycle" },
    { icon: <Wind className="w-4 h-4" />, label: "Flag Beach (kitesurfing)", value: "~3 km · 8 min drive" },
    { icon: <MapPin className="w-4 h-4" />, label: "Corralejo town centre", value: "~10 min walk" },
    { icon: <ShoppingCart className="w-4 h-4" />, label: "Nearest supermarket", value: "~5 min walk" },
    { icon: <Bus className="w-4 h-4" />, label: "Bus stop", value: "~2 min walk" },
    { icon: <Car className="w-4 h-4" />, label: "Parking", value: "Private dedicated space" },
  ],
};

export default function VillaLocationBadges({ slug }: { slug: string }) {
  const badges = VILLA_BADGES[slug];
  if (!badges) return null;

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
