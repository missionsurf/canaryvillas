export interface Villa {
  id: string;
  slug: string;
  name: string;
  description: string;
  shortDesc: string;
  location: string;
  latitude?: number | null;
  longitude?: number | null;
  bedrooms: number;
  bathrooms: number;
  maxGuests: number;
  pricePerNight: number;
  cleaningFee: number;
  images: string[];
  amenities: string[];
  airbnbIcalUrl?: string | null;
}

export interface Booking {
  id: string;
  villaId: string;
  guestName: string;
  guestEmail: string;
  guestPhone?: string | null;
  checkIn: Date;
  checkOut: Date;
  guests: number;
  nights: number;
  pricePerNight: number;
  cleaningFee: number;
  totalPrice: number;
  status: "pending" | "confirmed" | "cancelled" | "refunded";
  stripePaymentId?: string | null;
  stripeSessionId?: string | null;
  source: "direct" | "airbnb" | "vrbo";
  notes?: string | null;
  createdAt: Date;
}

export interface BookingFormData {
  villaId: string;
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  notes?: string;
}
