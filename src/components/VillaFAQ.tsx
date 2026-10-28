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
            <ChevronDown
              className={`w-4 h-4 text-gray-400 shrink-0 transition-transform ${open === i ? "rotate-180" : ""}`}
            />
          </button>
          {open === i && (
            <div className="px-5 pb-4 text-sm text-gray-600 leading-relaxed">
              {faq.answer}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

// Villa-specific FAQ data keyed by slug
export const VILLA_FAQS: Record<string, FAQItem[]> = {
  "beach-house": [
    {
      question: "How far is the beach from The Beach House?",
      answer: "The Beach House is directly beachfront — you step straight from the private terrace onto the sand. The nearest beach, Playa de Corralejo Viejo, is immediately in front of the villa (0 metres). Flag Beach, famous for kitesurfing, is approximately 2 km south (a 5-minute drive or 25-minute walk).",
    },
    {
      question: "Is there parking at The Beach House?",
      answer: "Yes, free on-street parking is available directly outside the villa. Corralejo town centre is a short walk away so a car is optional, though handy for day trips to the Corralejo Dunes Natural Park or the south of the island.",
    },
    {
      question: "What are the check-in and check-out times?",
      answer: "Check-in is from 3:00 PM and check-out is by 10:00 AM. Early check-in or late check-out can often be arranged — just contact us in advance and we will do our best to accommodate you.",
    },
    {
      question: "How many guests can The Beach House sleep?",
      answer: "The Beach House comfortably sleeps up to 6 guests across two bedrooms (with an optional third bedroom available). It is ideal for families or groups of friends.",
    },
    {
      question: "Is The Beach House pet-friendly?",
      answer: "We are sorry, but pets are not permitted at The Beach House. This allows us to maintain the highest standards of cleanliness for all guests.",
    },
    {
      question: "What is included in the price?",
      answer: "The nightly rate includes all utilities (electricity, water, Wi-Fi), bed linen, and towels. A one-off cleaning fee applies per stay. There are no hidden fees — the total you see at checkout is everything you pay.",
    },
    {
      question: "How close is Corralejo town centre?",
      answer: "Corralejo town centre — with its restaurants, bars, supermarkets, and water sports hire — is a 5 to 10-minute walk from The Beach House, making it easy to enjoy the local scene without needing a car.",
    },
    {
      question: "Why should I book direct instead of through Airbnb or Booking.com?",
      answer: "Booking directly through Canary Villas guarantees the lowest price — you avoid the 12–20% service fees charged by platforms like Airbnb. You also get direct contact with the owners, flexible payment options, and personalised local tips.",
    },
  ],
  "bungalow-apartment": [
    {
      question: "How far is the beach from the Bungalow Apartment?",
      answer: "The Bungalow Apartment is a short drive or 10-minute cycle from Corralejo's main beaches. Playa de Corralejo Viejo (town beach) is approximately 1.2 km away. Flag Beach, the island's premier kitesurfing and windsurfing spot, is around 3 km south.",
    },
    {
      question: "Is there parking at the Bungalow Apartment?",
      answer: "Yes — the apartment includes its own private, dedicated parking space at no extra cost. This is a real convenience in Corralejo, where street parking can be limited in peak season.",
    },
    {
      question: "What are the check-in and check-out times?",
      answer: "Check-in is from 3:00 PM and check-out is by 10:00 AM. Early check-in or late check-out can often be arranged — just let us know in advance.",
    },
    {
      question: "How many guests can the Bungalow Apartment sleep?",
      answer: "The Bungalow Apartment sleeps up to 4 guests. It is perfect for couples or small families looking for a private, peaceful retreat in Corralejo.",
    },
    {
      question: "Is there a private outdoor space?",
      answer: "Yes — the apartment has its own sunny private terrace with a jacuzzi, ideal for relaxing after a day at the beach or exploring the island.",
    },
    {
      question: "Is the Bungalow Apartment pet-friendly?",
      answer: "We are sorry, but pets are not permitted at the Bungalow Apartment. This allows us to maintain the highest standards of cleanliness for all guests.",
    },
    {
      question: "What is included in the price?",
      answer: "The nightly rate includes all utilities (electricity, water, Wi-Fi), bed linen, towels, and use of the private jacuzzi. A one-off cleaning fee applies per stay. There are no hidden fees — the total at checkout is everything you pay.",
    },
    {
      question: "Why should I book direct instead of through Airbnb or Booking.com?",
      answer: "Booking directly through Canary Villas guarantees the lowest price — you avoid the 12–20% service fees charged by platforms like Airbnb. You also get direct contact with the owners, flexible payment options, and personalised local tips.",
    },
  ],
};

// Fallback FAQs for any villa not explicitly listed
export const DEFAULT_FAQS: FAQItem[] = [
  {
    question: "What are the check-in and check-out times?",
    answer: "Check-in is from 3:00 PM and check-out is by 10:00 AM. Early check-in or late check-out can often be arranged — just contact us in advance.",
  },
  {
    question: "Is parking available?",
    answer: "Yes, parking is available. Please contact us for specific details for your chosen villa.",
  },
  {
    question: "Are pets allowed?",
    answer: "Pets are not permitted at our villas. This allows us to maintain the highest standards of cleanliness for all guests.",
  },
  {
    question: "What is included in the price?",
    answer: "The nightly rate includes all utilities, bed linen, and towels. A one-off cleaning fee applies. There are no hidden fees — the total at checkout is everything you pay.",
  },
  {
    question: "Why book direct?",
    answer: "Booking directly through Canary Villas guarantees the lowest price — you avoid the 12–20% service fees charged by platforms like Airbnb.",
  },
];
