import { getAllVillas } from "@/lib/villas";
import { blogPosts } from "@/lib/blog";

export const dynamic = "force-dynamic";

export async function GET() {
  const villas = await getAllVillas();

  const villaLines = villas
    .map((v) =>
      `- [${v.name}](https://www.canaryvillas.com/villas/${v.slug}): ${v.bedrooms}-bed, sleeps ${v.maxGuests}, from €${v.pricePerNight}/night. ${v.shortDesc}`
    )
    .join("\n");

  const blogByCategory: Record<string, typeof blogPosts> = {};
  for (const post of blogPosts) {
    if (!blogByCategory[post.category]) blogByCategory[post.category] = [];
    blogByCategory[post.category].push(post);
  }

  const blogLines = Object.entries(blogByCategory)
    .map(([cat, posts]) => {
      const items = posts
        .map((p) => `  - [${p.title}](https://www.canaryvillas.com/blog/${p.slug}): ${p.excerpt.slice(0, 120)}…`)
        .join("\n");
      return `### ${cat}\n${items}`;
    })
    .join("\n\n");

  const body = `# Canary Villas — Holiday Villas in Fuerteventura

> Independent holiday villa agency in Corralejo, Fuerteventura, Canary Islands. Luxury beachfront self-catering villas available to rent direct — no OTA fees, best price guaranteed, free cancellation 60+ days before arrival.

## About

Canary Villas is a family-run company based in Corralejo, Fuerteventura — the second-largest of Spain's Canary Islands, 3.5 hours from the UK. We offer beachfront villas and holiday rentals in the best locations in Corralejo for self-catering holidays.

- **Location**: Corralejo, Fuerteventura, Canary Islands, Spain (28°44'N 13°51'W)
- **Contact**: info@canaryvillas.com | +44 7809 870561
- **Booking**: Direct online booking at www.canaryvillas.com — Stripe-secured payments
- **Languages**: English, German, Spanish, French, Dutch, Italian
- **Check-in**: from 15:00 | **Check-out**: by 10:00
- **Cancellation**: Full refund if cancelled 60+ days before arrival; deposit only forfeited 30–59 days out
- **Minimum stay**: typically 3–7 nights depending on season
- **Climate**: 320+ sunny days/year, avg 22°C year-round — peak summer 28°C, winter 20°C

## Properties

${villaLines}

## Booking Information

All villas include: private terrace or garden, fully equipped kitchen, Wi-Fi, air conditioning, linen & towels. Cleaning on departure included.

**Pricing** includes all taxes. **Cleaning fee** charged separately at checkout. **Security deposit** may apply — returned within 7 days of departure.

To check availability and book: https://www.canaryvillas.com/villas

## About Corralejo & Fuerteventura

Corralejo is a vibrant resort town on Fuerteventura's northern coast, famed for the Corralejo Dunes Natural Park — a UNESCO-recognised sand dune reserve. The town has excellent restaurants, bars, water sports schools and a laid-back atmosphere popular with families, couples and water sports enthusiasts year-round.

**Best activities nearby**: kitesurfing & windsurfing at Flag Beach (5 min), surfing at El Hierro, diving at El Cantil, whale & dolphin watching tours, day trips to Lanzarote (30 min ferry) and Isla de Lobos (15 min).

**Getting there**: Fuerteventura Airport (FUE) — 40 min drive. Direct flights from most UK, German, Dutch, Scandinavian and Spanish cities.

## Travel Guides

${blogLines}

## Site Map

- Homepage: https://www.canaryvillas.com
- All Villas: https://www.canaryvillas.com/villas
- Blog / Travel Guide: https://www.canaryvillas.com/blog
- Contact: https://www.canaryvillas.com/contact
- Privacy Policy: https://www.canaryvillas.com/privacy
- Terms & Conditions: https://www.canaryvillas.com/terms

## Structured Data

Each villa page includes VacationRental (Schema.org), BreadcrumbList, and AggregateRating JSON-LD structured data. Blog posts include Article, FAQPage, and BreadcrumbList schemas. The site root includes Organisation and WebSite schemas.

## AI & Agent Access

This site welcomes indexing by AI assistants and search agents. Full content is available without authentication at the URLs above. The sitemap is at https://www.canaryvillas.com/sitemap.xml.
`;

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
    },
  });
}
